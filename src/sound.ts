type Bus='master'|'sfx'|'ambience';
const cues={
  hover:[['card-slide-1','card-slide-3'],.16], lift:[['card-fan-1','card-fan-2'],.39],
  drop:[['card-place-1','card-place-3'],.45], earth:[['footstep_grass_001','footstep_grass_003'],.46],
  build:[['impactWood_light_000','impactWood_light_003'],.33], reward:[['chip-lay-2'],.22],
  bonus:[['chips-stack-3'],.30], turn:[['card-shove-2'],.20], invalid:[['impactSoft_medium_002'],.27],
} as const;
type Cue=keyof typeof cues;
const clamp=(n:number)=>Math.max(0,Math.min(1,n));
export class TableSound {
  muted=false;
  levels:Record<Bus,number>={master:.72,sfx:.7,ambience:.36};
  private ctx:AudioContext|null=null;
  private buses:Partial<Record<Bus,GainNode>>={};
  private wave:HTMLAudioElement|null=null;
  private clips=new Map<string,AudioBuffer>();
  private live=new Set<AudioBufferSourceNode>();
  private pending=new Set<number>();
  private lastHover=0;
  constructor(){
    try{const prefs=JSON.parse(localStorage.getItem('lk-audio-v2')||'{}');
      this.muted=typeof prefs.muted==='boolean'?prefs.muted:localStorage.getItem('lk-mute')==='1';
      for(const k of Object.keys(this.levels) as Bus[])if(Number.isFinite(prefs[k]))this.levels[k]=clamp(prefs[k]);
    }catch{/* Storage is optional. */}
    const activate=()=>this.unlock();
    window.addEventListener('pointerdown',activate,{passive:true});window.addEventListener('keydown',activate);
    document.addEventListener('visibilitychange',()=>{if(document.hidden){this.wave?.pause();this.cancel()}else this.apply()});
  }
  private unlock(){
    if(!window.AudioContext)return;
    if(!this.ctx){
      this.ctx=new AudioContext();
      const master=this.ctx.createGain();master.connect(this.ctx.destination);
      this.buses.master=master;
      for(const bus of ['sfx','ambience'] as const){const node=this.ctx.createGain();node.connect(master);this.buses[bus]=node}
      const wave=new Audio(new URL('audio/shore.mp3',document.baseURI).href);wave.preload='none';wave.loop=true;this.wave=wave;
      this.ctx.createMediaElementSource(wave).connect(this.buses.ambience!);
      const names=new Set(Object.values(cues).flatMap(([files])=>[...files]));
      for(const name of names){
        void fetch(new URL('audio/'+name+'.ogg',document.baseURI)).then(r=>{if(!r.ok)throw Error(name);return r.arrayBuffer()})
          .then(b=>this.ctx!.decodeAudioData(b)).then(b=>this.clips.set(name,b)).catch(()=>{});
      }
      this.apply();
    }
    if(this.ctx.state==='suspended')void this.ctx.resume().catch(()=>{});
    if(this.wave?.paused&&!this.muted&&!document.hidden&&this.levels.ambience*this.levels.master>0)void this.wave.play().catch(()=>{});
  }
  set(bus:Bus,value:number){this.levels[bus]=clamp(value);this.apply();this.save()}
  toggle(){this.muted=!this.muted;this.apply();this.save()}
  private save(){try{localStorage.setItem('lk-audio-v2',JSON.stringify({...this.levels,muted:this.muted}))}catch{}}
  private apply(){
    if(!this.ctx)return;
    for(const k of ['master','sfx','ambience'] as const){
      const v=k==='master'&&this.muted?0:this.levels[k];
      this.buses[k]?.gain.setTargetAtTime(v*v,this.ctx.currentTime,.035);
    }
    if(this.muted||document.hidden||!this.levels.ambience||!this.levels.master)this.wave?.pause();
    else if(this.wave?.paused)void this.wave.play().catch(()=>{});
  }
  play(cue:Cue){
    if(this.muted||document.hidden||!this.ctx||this.ctx.state!=='running'||this.live.size>=3)return;
    if(cue==='hover'){if(performance.now()-this.lastHover<160)return;this.lastHover=performance.now()}
    const [files,volume]=cues[cue],buffer=this.clips.get(files[Math.floor(Math.random()*files.length)]);
    if(!buffer)return;
    const player=this.ctx.createBufferSource();player.buffer=buffer;
    player.playbackRate.value=.92+Math.random()*.10;
    const gain=this.ctx.createGain();gain.gain.value=volume*(.9+Math.random()*.13);
    player.connect(gain).connect(this.buses.sfx!);player.onended=()=>{this.live.delete(player);player.disconnect();gain.disconnect()};
    this.live.add(player);player.start();
  }
  sequence(event:boolean,wooden:boolean,bonus:boolean){
    this.cancel();this.play('drop');
    const later=(cue:Cue,delay:number)=>{const token=window.setTimeout(()=>{this.pending.delete(token);this.play(cue)},delay);this.pending.add(token)};
    if(!event)later('earth',145);
    if(wooden)later('build',325);
    later(bonus?'bonus':'reward',520);later('turn',855);
  }
  cancel(){for(const token of this.pending)clearTimeout(token);this.pending.clear()}
}
