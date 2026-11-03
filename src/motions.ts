import * as T from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

export type PersonMotion='idle'|'walk'|'carry'|'wood'|'stone'|'farm'|'berry'|'fish_cast'|'fish_idle'|'pick'|'eat';
type Bind={quaternion:T.Quaternion;position:T.Vector3};
type ClipState=Exclude<PersonMotion,'carry'|'pick'|'eat'>|'sit'|'stand'|'sit_down';

export async function loadCompressedGLTF(url:string){
  const response=await fetch(url);if(!response.ok)throw new Error(`Asset download: ${response.status}`);
  const raw=await response.arrayBuffer(),signature=new Uint8Array(raw,0,Math.min(2,raw.byteLength));
  // Also accept an already-decoded response from a CDN using Content-Encoding.
  const bytes=signature[0]===31&&signature[1]===139
    ?await new Response(new Blob([raw]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer():raw;
  return new GLTFLoader().parseAsync(bytes,'');
}

/** Retarget once per character variant; clips are shared, playback is per citizen. */
export class MotionLibrary {
  private clips:T.AnimationClip[]=[];
  private reference=new Map<string,Bind>();
  private cache=new Map<string,T.AnimationClip[]>();
  readonly ready:Promise<void>;
  constructor(){
    const base=(import.meta as unknown as {env:{BASE_URL:string}}).env.BASE_URL;
    this.ready=loadCompressedGLTF(`${base}models/motions.glb.gz`).then(gltf=>{
      this.clips=gltf.animations;
      // The reference mesh is only needed to decode the source bind skeleton.
      gltf.scene.traverse(object=>{if((object as T.Mesh).isMesh){const mesh=object as T.Mesh;mesh.geometry.dispose();for(const material of Array.isArray(mesh.material)?mesh.material:[mesh.material])material.dispose()}});
    }).catch(error=>console.error('Animasyon paketi yüklenemedi; yedek hareketler kullanılıyor.',error));
  }
  setReference(model:T.Object3D){
    const bones:T.Bone[]=[];model.traverse(bone=>{if((bone as T.Bone).isBone)bones.push(bone as T.Bone)});
    const names=new Set(this.clips.flatMap(clip=>clip.tracks.map(track=>track.name.slice(0,track.name.lastIndexOf('.')))));
    for(const name of names){const bone=bones.find(b=>b.name===name||b.name.startsWith(`${name}_`));if(bone)this.reference.set(name,{quaternion:bone.quaternion.clone(),position:bone.position.clone()})}
  }
  create(model:T.Object3D,bones:T.Bone[],binds:Map<T.Bone,Bind>){
    if(!this.clips.length)return null;
    let clips=this.cache.get(model.name);
    if(!clips){
      clips=this.clips.map(clip=>{
        const tracks:T.KeyframeTrack[]=[];
        for(const track of clip.tracks){
          const dot=track.name.lastIndexOf('.'),name=track.name.slice(0,dot),property=track.name.slice(dot+1);
          const bone=bones.find(b=>b.name===name||b.name.startsWith(`${name}_`)),reference=this.reference.get(name);
          const bind=bone&&binds.get(bone);if(!bone||!reference||!bind)continue;
          if(property==='quaternion'){
            const values=new Float32Array(track.values.length),inverse=reference.quaternion.clone().invert(),value=new T.Quaternion();
            for(let i=0;i<values.length;i+=4){value.fromArray(track.values,i).premultiply(inverse).premultiply(bind.quaternion).normalize();value.toArray(values,i)}
            tracks.push(new T.QuaternionKeyframeTrack(`${bone.name}.quaternion`,track.times,values,track.getInterpolation()));
          }else if(property==='position'&&name==='Pelvis'){
            const values=new Float32Array(track.values.length),ratio=bind.position.length()/Math.max(.001,reference.position.length());
            for(let i=0;i<values.length;i+=3)for(let axis=0;axis<3;axis++)values[i+axis]=bind.position.getComponent(axis)+(track.values[i+axis]-reference.position.getComponent(axis))*ratio;
            tracks.push(new T.VectorKeyframeTrack(`${bone.name}.position`,track.times,values,track.getInterpolation()));
          }
        }
        return new T.AnimationClip(clip.name,clip.duration,tracks);
      });
      this.cache.set(model.name,clips);
    }
    return new PersonPlayback(model,clips);
  }
}

export class PersonPlayback {
  private mixer:T.AnimationMixer;
  private action:T.AnimationAction|null=null;
  private state:ClipState='idle';private idleTime=0;private finished=false;
  private retired:{action:T.AnimationAction;until:number}[]=[];
  constructor(model:T.Object3D,private clips:T.AnimationClip[]){
    this.mixer=new T.AnimationMixer(model);
    this.mixer.addEventListener('finished',event=>{if(event.action===this.action)this.finished=true});
    this.mixer.addEventListener('loop',event=>{
      if(event.action===this.action&&this.pool(this.state).length>1)this.play(this.state);
    });
    this.play('idle');if(this.action)this.action.time=Math.random()*this.action.getClip().duration;
  }
  duration(name:ClipState){return this.pool(name)[0]?.duration??0}
  private pool(state:ClipState){const name=state==='sit_down'?'stand':state;return this.clips.filter(clip=>clip.name===name||clip.name.startsWith(`${name}_`))}
  private play(state:ClipState,resume?:number){
    const pool=this.pool(state);if(!pool.length)return;
    const alternatives=pool.filter(clip=>clip!==this.action?.getClip()),choices=alternatives.length?alternatives:pool;
    const clip=choices[Math.floor(Math.random()*choices.length)],previous=this.action,next=this.mixer.clipAction(clip);
    // A fading-out action can be selected again when switching tasks quickly.
    this.retired=this.retired.filter(item=>item.action!==next);
    next.reset().setEffectiveWeight(1).setEffectiveTimeScale(1);
    next.setLoop(state==='stand'||state==='sit_down'||state==='fish_cast'?T.LoopOnce:T.LoopRepeat,Infinity);next.clampWhenFinished=true;
    if(state==='sit_down'){next.time=clip.duration;next.timeScale=-1}else if(resume!==undefined)next.time=resume;
    next.play();
    if(previous&&previous!==next){next.crossFadeFrom(previous,.20,false);this.retired.push({action:previous,until:this.mixer.time+.22})}
    this.action=next;this.state=state;this.finished=false;
  }
  step(dt:number,requested:PersonMotion,speed:number){
    this.idleTime=requested==='idle'?this.idleTime+dt:0;
    let desired:ClipState=requested==='carry'?'walk':requested==='eat'||requested==='pick'?'idle':requested;
    if((this.state==='sit'||this.state==='sit_down')&&requested==='eat')desired='sit';
    if((this.state==='sit'||this.state==='sit_down')&&desired!=='idle'&&desired!=='sit')this.play('stand',this.state==='sit_down'?this.action?.time:undefined);
    if(this.state==='sit_down'){
      this.mixer.update(dt);this.cleanup();
      if(this.finished)this.play('sit');return false;
    }
    if(this.state==='stand'){
      this.mixer.update(dt);this.cleanup();
      if(!this.finished)return true;
      this.idleTime=0;this.play(desired);return false;
    }
    if(desired==='idle'&&(this.state==='sit'||this.idleTime>3.5))desired=this.state==='sit'?'sit':'sit_down';
    if(desired!==this.state)this.play(desired);
    if(this.action)this.action.timeScale=desired==='sit_down'?-1:desired==='walk'?T.MathUtils.clamp(speed/.85,.65,1.35):1;
    this.mixer.update(dt);this.cleanup();return false;
  }
  private cleanup(){
    this.retired=this.retired.filter(item=>{if(item.until>this.mixer.time)return true;item.action.stop();return false});
  }
  dispose(){this.mixer.stopAllAction();this.mixer.uncacheRoot(this.mixer.getRoot());this.retired=[]}
}
