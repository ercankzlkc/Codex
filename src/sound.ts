import * as T from 'three';
import type { Kind } from './game';
import {fromWorld,type ShoreEdge} from './hex';
import {harvestAudio,type HarvestCue} from './harvest-audio';
import {placementAudio} from './placement-audio';
import { BUILD_START, BUILD_END, LAND_START } from './emergence';

type Bus='master'|'sfx'|'ambience';
const cues={
  hover:[['card-slide-1','card-slide-3'],.16], lift:[['card-fan-1','card-fan-2'],.39],
  drop:[['card-place-1','card-place-3'],.45], earth:[['footstep_grass_001','footstep_grass_003'],.46],
  build:[['impactWood_light_000','impactWood_light_003'],.33], reward:[['chip-lay-2'],.22],
  fence:[['impactWood_light_000','impactWood_light_003'],.24],
  fenceBreak:[['impactWood_light_000','impactWood_light_003'],.30],
  bonus:[['chips-stack-3'],.30], turn:[['card-shove-2'],.20], invalid:[['impactSoft_medium_002'],.27],
} as const;
type Cue=keyof typeof cues;
const birdClips=['seagull-1','seagull-2','seagull-3'] as const;
type BirdVoice={source:AudioBufferSourceNode;panner:PannerNode;gain:GainNode;filter:BiquadFilterNode;bird:T.Object3D;endsAt:number};
const clamp=(n:number)=>Math.max(0,Math.min(1,n));
export class TableSound {
  muted=false;
  levels:Record<Bus,number>={master:.72,sfx:.7,ambience:.36};
  private ctx:AudioContext|null=null;
  private buses:Partial<Record<Bus,GainNode>>={};
  private wave:HTMLAudioElement|null=null;
  private seaGain:GainNode|null=null;
  private seaPan:StereoPannerNode|null=null;
  private seaFilter:BiquadFilterNode|null=null;
  private workLive=new Set<AudioBufferSourceNode>();
  private workViews=new Map<AudioBufferSourceNode,{at:T.Vector3;gain:GainNode}>();
  private lastWork=new Map<string,number>();
  private lastSpatialClip=new Map<string,string>();
  private viewCamera:T.OrthographicCamera|null=null;
  private clipPoint=new T.Vector3();
  private readonly audioRight=new T.Vector3();
  private clips=new Map<string,AudioBuffer>();
  private live=new Set<AudioScheduledSourceNode>();
  private noise:AudioBuffer|null=null;
  private waveLoads:Promise<void>[]=[];
  private lastLandingWave=-1;
  private landingRequest=0;
  private pending=new Set<number>();
  private lastHover=0;
  private birdVoice:BirdVoice|null=null;
  private birdClipIndex=0;
  private nextBirdAt=3;
  private lastSpatial=-1;
  private readonly ear=new T.Vector3();
  private readonly forward=new T.Vector3();
  private readonly up=new T.Vector3();
  private readonly birdPosition=new T.Vector3();
  private readonly projected=new T.Vector3();
  constructor(){
    try{const prefs=JSON.parse(localStorage.getItem('lk-audio-v2')||'{}');
      this.muted=typeof prefs.muted==='boolean'?prefs.muted:localStorage.getItem('lk-mute')==='1';
      for(const k of Object.keys(this.levels) as Bus[])if(Number.isFinite(prefs[k]))this.levels[k]=clamp(prefs[k]);
    }catch{/* Storage is optional. */}
    const activate=()=>this.unlock();
    window.addEventListener('pointerdown',activate,{passive:true});window.addEventListener('keydown',activate);
    document.addEventListener('visibilitychange',()=>{if(document.hidden)this.cancel();this.apply()});
  }
  private unlock(){
    if(!window.AudioContext)return;
    if(!this.ctx){
      this.ctx=new AudioContext();
      const master=this.ctx.createGain();master.connect(this.ctx.destination);
      this.buses.master=master;
      for(const bus of ['sfx','ambience'] as const){const node=this.ctx.createGain();node.connect(master);this.buses[bus]=node}
      const wave=new Audio(new URL('audio/shore.mp3',document.baseURI).href);wave.preload='none';wave.loop=true;this.wave=wave;
      // Preserve the recording's stereo image and gently widen the side signal.
      // L'=1.1L-.1R, R'=1.1R-.1L. No duplicated mono or rapid autopanning.
      const split=this.ctx.createChannelSplitter(2),merge=this.ctx.createChannelMerger(2),sea=this.ctx.createGain();sea.gain.value=0;
      this.seaGain=sea;this.seaPan=this.ctx.createStereoPanner();this.seaFilter=this.ctx.createBiquadFilter();this.seaFilter.type='lowpass';this.seaFilter.frequency.value=5500;this.seaFilter.Q.value=.3;
      this.ctx.createMediaElementSource(wave).connect(split);
      for(const [input,output,level] of [[0,0,1.1],[1,1,1.1],[0,1,-.1],[1,0,-.1]]){
        const route=this.ctx.createGain();route.gain.value=level;split.connect(route,input);route.connect(merge,0,output);
      }
      merge.connect(this.seaFilter).connect(this.seaPan).connect(sea).connect(this.buses.ambience!);
      const names=new Set([...Object.values(cues).flatMap(([files])=>[...files]),...Object.values(harvestAudio).flatMap(c=>[...c.files]),...Object.values(placementAudio).flatMap(c=>[...c.files])]);
      for(const name of names){
        const extension=/^(wood-hit|wood-fall|wood-land|stone-hit|stone-break|berry-pick|wheat-pick|ice-break)-/.test(name)?'.mp3':'.ogg';
        void fetch(new URL('audio/'+name+extension,document.baseURI)).then(r=>{if(!r.ok)throw Error(name);return r.arrayBuffer()})
          .then(b=>this.ctx!.decodeAudioData(b)).then(b=>this.clips.set(name,b)).catch(()=>{});
      }
      for(let i=1;i<=6;i++){
        const name=`landing-wave-${i}`;
        this.waveLoads.push(fetch(new URL(`audio/${name}.mp3`,document.baseURI)).then(r=>{if(!r.ok)throw Error(name);return r.arrayBuffer()})
          .then(data=>this.ctx!.decodeAudioData(data)).then(buffer=>{this.clips.set(name,buffer)}).catch(()=>{}));
      }
      for(const name of birdClips){
        void fetch(new URL(`audio/${name}.mp3`,document.baseURI)).then(r=>{if(!r.ok)throw Error(name);return r.arrayBuffer()})
          .then(data=>this.ctx!.decodeAudioData(data)).then(buffer=>this.clips.set(name,this.pointSourceBuffer(buffer))).catch(()=>{});
      }
      this.nextBirdAt=this.ctx.currentTime+3;
      this.apply();
    }
    if(this.ctx.state==='suspended')void this.ctx.resume().catch(()=>{});
    if(this.wave?.paused&&!this.muted&&!document.hidden&&this.levels.ambience*this.levels.master>0)void this.wave.play().catch(()=>{});
  }
  set(bus:Bus,value:number){this.levels[bus]=clamp(value);this.apply();this.save()}
  toggle(){this.muted=!this.muted;if(this.muted)this.cancel();this.apply();this.save()}
  private save(){try{localStorage.setItem('lk-audio-v2',JSON.stringify({...this.levels,muted:this.muted}))}catch{}}
  private apply(){
    if(!this.ctx)return;
    for(const k of ['master','sfx','ambience'] as const){
      const v=k==='master'&&(this.muted||document.hidden)?0:this.levels[k];
      this.buses[k]?.gain.setTargetAtTime(v*v,this.ctx.currentTime,.035);
    }
    if(this.muted||document.hidden||!this.levels.ambience||!this.levels.master){this.wave?.pause();this.stopBird();if(this.ctx)this.nextBirdAt=this.ctx.currentTime+3;}
    else if(this.wave?.paused)void this.wave.play().catch(()=>{});
  }
  /** Fold a recording to a gently levelled point source; HRTF supplies stereo direction. */
  private pointSourceBuffer(buffer:AudioBuffer){
    const mixed=new Float32Array(buffer.length);
    for(let channel=0;channel<buffer.numberOfChannels;channel++){
      const data=buffer.getChannelData(channel);for(let i=0;i<mixed.length;i++)mixed[i]+=data[i]/buffer.numberOfChannels;
    }
    // Long field recordings contain quiet stretches: select a real, audible call
    // instead of randomly starting in silence or distant city background.
    const binSize=Math.max(1,Math.floor(buffer.sampleRate*.1)),bins:number[]=[];
    for(let i=0;i<mixed.length;i+=binSize){let energy=0;for(let j=i;j<Math.min(mixed.length,i+binSize);j++)energy+=mixed[j]*mixed[j];bins.push(energy)}
    const length=Math.min(buffer.length,Math.floor(buffer.sampleRate*5)),span=Math.ceil(length/binSize);
    let start=0,best=-1,energy=0;
    for(let i=0;i<bins.length;i++){
      energy+=bins[i];if(i>=span)energy-=bins[i-span];
      if(i>=span-1&&energy>best){best=energy;start=Math.min((i-span+1)*binSize,mixed.length-length)}
    }
    const mono=this.ctx!.createBuffer(1,length,buffer.sampleRate),out=mono.getChannelData(0);out.set(mixed.subarray(start,start+length));
    let total=0,peak=0;for(const sample of out){total+=sample*sample;peak=Math.max(peak,Math.abs(sample))}
    const rms=Math.sqrt(total/Math.max(1,out.length)),level=Math.min(3,.14/Math.max(.001,rms),.85/Math.max(.001,peak));
    for(let i=0;i<out.length;i++)out[i]*=level;
    return mono;
  }
  updateSpatial(camera:T.OrthographicCamera,focus:T.Vector3,birds:readonly T.Object3D[],shore:readonly ShoreEdge[],land:ReadonlyMap<number,unknown>){
    this.viewCamera=camera;
    const ctx=this.ctx;if(!ctx||ctx.state!=='running'||this.muted||document.hidden||!this.levels.master)return;
    const now=ctx.currentTime;if(now-this.lastSpatial<1/30)return;this.lastSpatial=now;
    camera.getWorldDirection(this.forward);this.up.set(0,1,0).applyQuaternion(camera.quaternion);
    // Orthographic zoom changes apparent proximity without moving the real camera.
    // Use a virtual listener so a near-plane safety adjustment cannot mute the birds.
    this.ear.copy(focus).addScaledVector(this.forward,-8/Math.max(.5,camera.zoom));
    const listener=ctx.listener;
    if(listener.positionX){
      for(const [parameter,value] of [[listener.positionX,this.ear.x],[listener.positionY,this.ear.y],[listener.positionZ,this.ear.z],
        [listener.forwardX,this.forward.x],[listener.forwardY,this.forward.y],[listener.forwardZ,this.forward.z],
        [listener.upX,this.up.x],[listener.upY,this.up.y],[listener.upZ,this.up.z]] as [AudioParam,number][])parameter.setTargetAtTime(value,now,.06);
    }else{listener.setPosition(this.ear.x,this.ear.y,this.ear.z);listener.setOrientation(this.forward.x,this.forward.y,this.forward.z,this.up.x,this.up.y,this.up.z)}
    for(const voice of this.workViews.values())voice.gain.gain.setTargetAtTime(this.workWeight(voice.at),now,.08);
    this.updateSea(camera,focus,shore,land,now);
    if(!this.levels.ambience){this.stopBird();return}
    if(this.birdVoice&&now>this.birdVoice.endsAt+.5)this.stopBird();
    if(!this.birdVoice&&now>=this.nextBirdAt&&birds.length){
      let bird:T.Object3D|undefined,best=Infinity;
      for(const candidate of birds){
        candidate.getWorldPosition(this.birdPosition);this.projected.copy(this.birdPosition).project(camera);
        const score=this.birdPosition.distanceTo(this.ear)+(Math.abs(this.projected.x)>1.15||Math.abs(this.projected.y)>1.15?5:0);
        if(score<best){best=score;bird=candidate}
      }
      if(bird)this.startBird(bird,now);
    }
    const voice=this.birdVoice;if(!voice)return;
    voice.bird.getWorldPosition(this.birdPosition);
    if(voice.panner.positionX){
      voice.panner.positionX.setTargetAtTime(this.birdPosition.x,now,.06);voice.panner.positionY.setTargetAtTime(this.birdPosition.y,now,.06);voice.panner.positionZ.setTargetAtTime(this.birdPosition.z,now,.06);
    }else voice.panner.setPosition(this.birdPosition.x,this.birdPosition.y,this.birdPosition.z);
    const distance=this.birdPosition.distanceTo(this.ear);
    voice.filter.frequency.setTargetAtTime(T.MathUtils.lerp(6500,1500,T.MathUtils.smoothstep(distance,3,20)),now,.12);
  }
  private updateSea(camera:T.OrthographicCamera,focus:T.Vector3,shore:readonly ShoreEdge[],land:ReadonlyMap<number,unknown>,now:number){
    let distance=0,pan=0;
    if(land.has(fromWorld(focus.x,focus.z))){
      distance=Infinity;let weight=0,dx=0,dz=0;
      for(const edge of shore){
        const vx=edge.bx-edge.ax,vz=edge.bz-edge.az;
        const t=T.MathUtils.clamp(((focus.x-edge.ax)*vx+(focus.z-edge.az)*vz)/Math.max(.0001,vx*vx+vz*vz),0,1);
        const x=edge.ax+vx*t-focus.x,z=edge.az+vz*t-focus.z,d=Math.hypot(x,z),w=1/(1+d*d)**2;
        distance=Math.min(distance,d);dx+=x*w;dz+=z*w;weight+=w;
      }
      if(weight){
        this.audioRight.set(1,0,0).applyQuaternion(camera.quaternion);
        pan=T.MathUtils.clamp((dx*this.audioRight.x+dz*this.audioRight.z)/weight/Math.max(2,distance),-.65,.65);
      }
    }
    // Zoom is virtual proximity in the orthographic view; camera safety offsets must not change sound.
    const proximity=distance+4.5/Math.max(.5,camera.zoom),level=Number.isFinite(proximity)?.9*Math.exp(-proximity*.13):0;
    this.seaGain?.gain.setTargetAtTime(level,now,.25);this.seaPan?.pan.setTargetAtTime(pan,now,.3);
    this.seaFilter?.frequency.setTargetAtTime(1100+7400*Math.exp(-proximity*.08),now,.3);
  }
  work(cue:HarvestCue,at:T.Vector3){
    const now=this.ctx?.currentTime??0,key=`${cue}:${at.x.toFixed(1)},${at.z.toFixed(1)}`;
    if(now-(this.lastWork.get(key)??-99)<.09)return;
    if(this.spatialClip(harvestAudio[cue],at))this.lastWork.set(key,now);
    if(this.lastWork.size>512)for(const [k,t] of this.lastWork)if(now-t>3)this.lastWork.delete(k);
  }
  delivery(at:T.Vector3){this.spatialClip(harvestAudio.berryPick,at)}
  placement(kind:Kind,at:T.Vector3){this.spatialClip(placementAudio[kind],at)}
  /** Use the supplied recordings without repeating the previous landing. */
  async landingWave(at:T.Vector3){
    this.unlock();
    const request=++this.landingRequest;
    await Promise.all(this.waveLoads);
    const ctx=this.ctx;
    if(!ctx||ctx.state!=='running'||request!==this.landingRequest||this.muted||document.hidden||!this.levels.master||!this.levels.sfx)return;
    const available=Array.from({length:6},(_,i)=>i+1).filter(i=>this.clips.has(`landing-wave-${i}`));
    const choices=available.length>1?available.filter(i=>i!==this.lastLandingWave):available;
    if(!choices.length)return;
    const choice=choices[Math.floor(Math.random()*choices.length)];this.lastLandingWave=choice;
    const source=ctx.createBufferSource(),gain=ctx.createGain(),pan=ctx.createStereoPanner();
    source.buffer=this.clips.get(`landing-wave-${choice}`)!;
    const now=ctx.currentTime,duration=source.buffer.duration,fade=Math.min(.04,duration/4);
    gain.gain.setValueAtTime(0,now);gain.gain.linearRampToValueAtTime(1.8,now+fade);
    gain.gain.setValueAtTime(1.8,now+duration-fade);gain.gain.linearRampToValueAtTime(0,now+duration);
    if(this.viewCamera){this.clipPoint.copy(at).project(this.viewCamera);pan.pan.value=T.MathUtils.clamp(this.clipPoint.x*.65,-.65,.65)}
    source.connect(gain).connect(pan).connect(this.buses.sfx!);
    this.trackVoice(source,[gain,pan]);source.start(now);source.stop(now+duration);
  }
  private workWeight(at:T.Vector3){
    const camera=this.viewCamera;if(!camera)return 0;
    this.clipPoint.copy(at).project(camera);
    if(Math.abs(this.clipPoint.x)>1.05||Math.abs(this.clipPoint.y)>1.05||Math.abs(this.clipPoint.z)>1)return 0;
    const distance=Math.hypot(this.clipPoint.x,this.clipPoint.y);
    return (1-.55*T.MathUtils.smoothstep(distance,.35,1.45))*(.7+.3*T.MathUtils.smoothstep(camera.zoom,.8,2.2));
  }
  private spatialClip(cue:{files:readonly string[];volume:number;rate:readonly[number,number];fullLength?:boolean},at:T.Vector3){
    const ctx=this.ctx;if(!ctx||ctx.state!=='running'||this.muted||document.hidden||!this.levels.sfx||this.workLive.size>=12)return false;
    const focusGain=this.workWeight(at);if(focusGain<.012)return false;
    const key=cue.files.join(','),loaded=cue.files.filter(name=>this.clips.has(name));
    const choices=loaded.length>1?loaded.filter(name=>name!==this.lastSpatialClip.get(key)):loaded;
    if(!choices.length)return false;
    const name=choices[Math.floor(Math.random()*choices.length)],buffer=this.clips.get(name)!;
    this.lastSpatialClip.set(key,name);
    const source=ctx.createBufferSource(),panner=ctx.createPanner(),filter=ctx.createBiquadFilter(),gain=ctx.createGain();
    source.buffer=buffer;source.playbackRate.value=T.MathUtils.lerp(cue.rate[0],cue.rate[1],Math.random());
    panner.panningModel='HRTF';panner.distanceModel='inverse';panner.refDistance=6;panner.rolloffFactor=.45;panner.maxDistance=40;
    panner.setPosition(at.x,at.y,at.z);filter.type='lowpass';filter.Q.value=.3;filter.frequency.value=T.MathUtils.lerp(7000,1500,T.MathUtils.smoothstep(at.distanceTo(this.ear),5,30));
    const now=ctx.currentTime,duration=Math.min(cue.fullLength?buffer.duration:2.5,buffer.duration/source.playbackRate.value);
    gain.gain.setValueAtTime(0,now);gain.gain.linearRampToValueAtTime(cue.volume*2,now+.008);gain.gain.setValueAtTime(cue.volume*2,now+Math.max(.01,duration-.04));gain.gain.linearRampToValueAtTime(0,now+duration);
    const viewGain=ctx.createGain();viewGain.gain.value=focusGain;
    source.connect(filter).connect(panner).connect(gain).connect(viewGain).connect(this.buses.sfx!);this.workLive.add(source);this.workViews.set(source,{at:at.clone(),gain:viewGain});
    source.onended=()=>{this.workLive.delete(source);this.workViews.delete(source);source.disconnect();filter.disconnect();panner.disconnect();gain.disconnect();viewGain.disconnect()};
    source.start(now);source.stop(now+duration);return true;
  }
  private startBird(bird:T.Object3D,now:number){
    const ctx=this.ctx!;
    // Fixed recording order, only one call at a time. Failed loads cannot block the queue.
    let buffer:AudioBuffer|undefined;
    for(let attempt=0;attempt<birdClips.length;attempt++){
      const name=birdClips[this.birdClipIndex++%birdClips.length];buffer=this.clips.get(name);if(buffer)break;
    }
    if(!buffer){this.nextBirdAt=now+5;return}
    const source=ctx.createBufferSource(),panner=ctx.createPanner(),gain=ctx.createGain(),filter=ctx.createBiquadFilter();
    source.buffer=buffer;panner.panningModel='HRTF';panner.distanceModel='inverse';panner.refDistance=3.5;panner.rolloffFactor=.9;panner.maxDistance=40;
    bird.getWorldPosition(this.birdPosition);panner.setPosition(this.birdPosition.x,this.birdPosition.y,this.birdPosition.z);
    filter.type='lowpass';filter.frequency.value=4000;filter.Q.value=.3;
    const duration=Math.min(5,buffer.duration);
    gain.gain.setValueAtTime(0,now);gain.gain.linearRampToValueAtTime(.6,now+.25);gain.gain.setValueAtTime(.6,now+Math.max(.25,duration-.65));gain.gain.linearRampToValueAtTime(0,now+duration);
    source.connect(filter).connect(panner).connect(gain).connect(this.buses.ambience!);
    const voice:BirdVoice={source,panner,gain,filter,bird,endsAt:now+duration};this.birdVoice=voice;
    this.nextBirdAt=now+22+Math.random()*4;
    source.onended=()=>{source.disconnect();filter.disconnect();panner.disconnect();gain.disconnect();if(this.birdVoice===voice)this.birdVoice=null};
    source.start(now,0,duration);
  }
  private stopBird(){
    const voice=this.birdVoice;if(!voice)return;this.birdVoice=null;
    const now=this.ctx!.currentTime;voice.gain.gain.cancelScheduledValues(now);voice.gain.gain.setValueAtTime(voice.gain.gain.value,now);voice.gain.gain.linearRampToValueAtTime(0,now+.08);voice.source.stop(now+.1);
  }
  resetAmbience(){
    this.stopBird();this.lastWork.clear();this.birdClipIndex=0;this.lastSpatial=-1;this.nextBirdAt=(this.ctx?.currentTime??0)+3;
  }
  play(cue:Cue,force=false){
    if(this.muted||document.hidden||!this.ctx||this.ctx.state!=='running'||this.live.size>=(cue==='fence'||cue==='fenceBreak'||force?8:3))return;
    if(cue==='hover'){if(!force&&performance.now()-this.lastHover<160)return;this.lastHover=performance.now()}
    const [files,volume]=cues[cue],buffer=this.clips.get(files[Math.floor(Math.random()*files.length)]);
    if(!buffer)return;
    const player=this.ctx.createBufferSource();player.buffer=buffer;
    player.playbackRate.value=cue==='fenceBreak'?.68+Math.random()*.12:cue==='fence'?.98+Math.random()*.16:.92+Math.random()*.10;
    const gain=this.ctx.createGain();gain.gain.value=volume*(.9+Math.random()*.13);
    player.connect(gain).connect(this.buses.sfx!);player.onended=()=>{this.live.delete(player);player.disconnect();gain.disconnect()};
    this.live.add(player);player.start();
    if(cue==='fenceBreak')this.rustle(850,.045,.17,.02);
  }
  /** Every placed material has a short, soft voice on the existing effects bus. */
  private canVoice(){
    return !!this.ctx&&this.ctx.state==='running'&&!this.muted&&!document.hidden&&
      this.levels.master>0&&this.levels.sfx>0&&this.live.size<8;
  }
  private trackVoice(source:AudioScheduledSourceNode,nodes:AudioNode[]){
    this.live.add(source);
    source.onended=()=>{this.live.delete(source);source.disconnect();for(const node of nodes)node.disconnect()};
  }
  private note(frequency:number,volume:number,duration=.18,delay=0,fall=1){
    if(!this.canVoice())return;
    const ctx=this.ctx!,now=ctx.currentTime+delay,voice=ctx.createOscillator(),gain=ctx.createGain();
    voice.type='sine';voice.frequency.setValueAtTime(frequency,now);
    voice.frequency.exponentialRampToValueAtTime(Math.max(30,frequency*fall),now+duration);
    gain.gain.setValueAtTime(0,now);gain.gain.linearRampToValueAtTime(volume,now+.012);
    gain.gain.exponentialRampToValueAtTime(.0001,now+duration);
    voice.connect(gain).connect(this.buses.sfx!);this.trackVoice(voice,[gain]);
    voice.start(now);voice.stop(now+duration+.025);
  }
  private rustle(frequency:number,volume:number,duration=.26,delay=0){
    if(!this.canVoice())return;
    const ctx=this.ctx!,now=ctx.currentTime+delay;
    if(!this.noise){
      this.noise=ctx.createBuffer(1,Math.ceil(ctx.sampleRate*.6),ctx.sampleRate);
      const data=this.noise.getChannelData(0);
      for(let i=0;i<data.length;i++)data[i]=Math.random()*2-1;
    }
    const voice=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),gain=ctx.createGain();
    voice.buffer=this.noise;voice.playbackRate.value=.94+Math.random()*.12;
    filter.type='bandpass';filter.frequency.value=frequency;filter.Q.value=.45;
    gain.gain.setValueAtTime(0,now);gain.gain.linearRampToValueAtTime(volume,now+.025);
    gain.gain.exponentialRampToValueAtTime(.0001,now+duration);
    voice.connect(filter).connect(gain).connect(this.buses.sfx!);
    this.trackVoice(voice,[filter,gain]);voice.start(now,Math.random()*.06,duration);voice.stop(now+duration+.03);
  }
  private material(kind:Kind){
    const pitch=.97+Math.random()*.06;
    switch(kind){
      case 'forest':
        this.rustle(1250,.105,.36);this.rustle(1900,.045,.25,.10);break;
      case 'berry':
        this.rustle(1650,.065,.23);this.note(420*pitch,.035,.14,.06,1.25);break;
      case 'farm':
        this.rustle(950,.09,.34);this.rustle(1500,.035,.24,.12);break;
      case 'garden':
        this.rustle(2200,.06,.32);this.note(660*pitch,.023,.22,.08);break;
      case 'stone':
        this.note(185*pitch,.09,.13,0,.63);this.rustle(650,.06,.10);
        this.note(310*pitch,.045,.09,.08,.68);break;
      case 'fisher':
        this.play('build');this.note(330*pitch,.065,.17,.08,1.65);
        this.note(470*pitch,.035,.12,.20,1.4);break;
      case 'house':
        this.play('build');this.note(220*pitch,.035,.14,0,.72);break;
      case 'manor':
        this.play('build');this.note(150*pitch,.05,.20,0,.72);
        this.note(240*pitch,.025,.12,.10,.8);break;
      case 'lumber':
        this.play('build');this.note(260*pitch,.045,.10,0,.65);
        this.note(210*pitch,.035,.11,.10,.7);break;
      case 'store':
        this.play('build');this.note(175*pitch,.045,.17,0,.7);
        this.note(350*pitch,.023,.09,.09,.75);break;
      case 'festival':
        this.note(523.25*pitch,.055,.24);this.note(659.25*pitch,.045,.25,.11);
        this.note(783.99*pitch,.035,.30,.22);break;
      case 'harvest':
        this.rustle(1100,.085,.30);this.note(392*pitch,.045,.17,.06);
        this.note(523.25*pitch,.035,.22,.18);break;
    }
  }
  sequence(kind:Kind,bonus:boolean){
    this.cancel();this.play('drop');
    const later=(action:()=>void,delay:number)=>{
      const token=window.setTimeout(()=>{this.pending.delete(token);action()},delay);
      this.pending.add(token);
    };
    if(kind==='festival'||kind==='harvest'){this.material(kind);return}
    // The land rises first; its material voice follows the visible building.
    later(()=>this.play('earth'),LAND_START*1000);
    later(()=>this.material(kind),(BUILD_START+.2)*1000);
    if(bonus)later(()=>this.note(587.33,.025,.24),BUILD_END*1000);
  }
  cancel(){
    this.landingRequest++;
    for(const voice of this.workLive){try{voice.stop()}catch{}}this.workLive.clear();
    for(const token of this.pending)clearTimeout(token);this.pending.clear();
    for(const source of this.live){try{source.stop()}catch{/* A voice may already have ended. */}}
    this.live.clear();
  }
}


