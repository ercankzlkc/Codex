import * as T from 'three';
import {clone} from 'three/addons/utils/SkeletonUtils.js';
import {MotionLibrary,loadCompressedGLTF,type PersonMotion,type PersonPlayback} from './motions';

const variants=[...Array.from({length:6},(_,i)=>`peasant_${i+1}`),'city_dwellers_1','city_dwellers_2',
  ...Array.from({length:4},(_,i)=>`rich_citizzens_${i+1}`),'king','queen'];
type Joint={bone:T.Bone;rest:T.Quaternion;x:T.Vector3;z:T.Vector3};
const rotation=new T.Quaternion(),sideRotation=new T.Quaternion();

/** One shared download; each citizen receives an independent cloned skeleton. */
export class PeopleLibrary {
  private templates=new Map<string,T.Object3D>();
  private motions=new MotionLibrary();
  readonly ready:Promise<void>;
  constructor(){
    const url=`${(import.meta as unknown as {env:{BASE_URL:string}}).env.BASE_URL}models/people.glb.gz`;
    this.ready=Promise.all([loadCompressedGLTF(url),this.motions.ready]).then(([gltf])=>{
      for(const name of variants){const template=gltf.scene.getObjectByName(`character_${name}`);if(template)this.templates.set(name,template)}
      if(this.templates.size!==variants.length)throw new Error('Character pack is incomplete');
      this.motions.setReference(this.templates.get('peasant_1')!);
    }).catch(error=>console.error('Karakter paketi yuklenemedi; yedek koyluler kullaniliyor.',error));
  }
  create(id:number){
    const template=this.templates.get(variants[id%variants.length]);
    return template?new PersonVisual(clone(template),this.motions):null;
  }
}

/** Adapt the supplied T-pose skeleton to the game's existing task gestures. */
export class PersonVisual {
  readonly root=new T.Group();
  private bones:T.Bone[]=[];
  private arms:Joint[]=[];private elbows:Joint[]=[];private legs:Joint[]=[];private knees:Joint[]=[];
  private spine:Joint|null=null;
  private hands:T.Bone[]=[];
  private playback:PersonPlayback|null=null;
  private overlay:PersonMotion='idle';
  private modelScale=1;
  private palm=new T.Vector3();
  private socketRotation=new T.Quaternion();
  private fishingClock:number|null=null;
  private fishingBase:T.Quaternion[]=[];
  constructor(model:T.Object3D,motions:MotionLibrary){
    this.root.add(model);model.updateMatrixWorld(true);
    const bounds=new T.Box3().setFromObject(model),size=bounds.getSize(new T.Vector3()),center=bounds.getCenter(new T.Vector3());
    const scale=.46/Math.max(.01,size.y);this.modelScale=scale;model.scale.multiplyScalar(scale);
    model.position.set(-center.x*scale,-bounds.min.y*scale,-center.z*scale);
    model.traverse(object=>{
      if((object as T.Bone).isBone)this.bones.push(object as T.Bone);
      if((object as T.Mesh).isMesh){const mesh=object as T.Mesh;mesh.castShadow=true;mesh.receiveShadow=true;mesh.frustumCulled=true;if(mesh instanceof T.SkinnedMesh){mesh.computeBoundingSphere();if(mesh.boundingSphere)mesh.boundingSphere.radius*=1.6}}
    });
    this.root.updateMatrixWorld(true);
    const binds=new Map(this.bones.map(bone=>[bone,{quaternion:bone.quaternion.clone(),position:bone.position.clone()}]));
    this.playback=motions.create(model,this.bones,binds);
    const find=(name:string)=>this.bones.find(b=>b.name===name||b.name.startsWith(`${name}_`));
    const ordered=['R','L'].map(side=>({upper:find(`Upperarm_${side}`),lower:find(`Lowerarm_${side}`),hand:find(`Hand_${side}`),leg:find(`Thigh_${side}`),knee:find(`Calf_${side}`)}));
    for(const [i,limb] of ordered.entries()){
      if(limb.upper&&limb.lower){
        const parent=limb.upper.parent!.getWorldQuaternion(new T.Quaternion());
        const direction=limb.lower.getWorldPosition(new T.Vector3()).sub(limb.upper.getWorldPosition(new T.Vector3())).normalize();
        const down=new T.Vector3(i===0?-.10:.10,-1,.025).normalize();
        const turn=new T.Quaternion().setFromUnitVectors(direction,down);
        limb.upper.quaternion.premultiply(parent.clone().invert().multiply(turn).multiply(parent));
      }
    }
    this.root.updateMatrixWorld(true);
    for(const limb of ordered){
      if(limb.upper)this.arms.push(this.joint(limb.upper));if(limb.lower)this.elbows.push(this.joint(limb.lower));
      if(limb.leg)this.legs.push(this.joint(limb.leg));if(limb.knee)this.knees.push(this.joint(limb.knee));
      if(limb.hand)this.hands.push(limb.hand);
    }
    const spine=find('Spine_01');if(spine)this.spine=this.joint(spine);
    const index=find('Index_01_R'),ring=find('Ring_01_R');
    if(index&&ring){
      this.palm.copy(index.position).add(ring.position).multiplyScalar(.20);
      const y=index.position.clone().sub(ring.position).normalize();
      const x=index.position.clone().add(ring.position).normalize();x.addScaledVector(y,-x.dot(y)).normalize();
      const z=x.clone().cross(y).normalize();this.socketRotation.setFromRotationMatrix(new T.Matrix4().makeBasis(x,y,z));
    }
  }
  private joint(bone:T.Bone):Joint{
    const inverse=bone.parent!.getWorldQuaternion(new T.Quaternion()).invert();
    return {bone,rest:bone.quaternion.clone(),x:new T.Vector3(1,0,0).applyQuaternion(inverse),z:new T.Vector3(0,0,1).applyQuaternion(inverse)};
  }
  private pose(joint:Joint|undefined,x:number,z=0){
    if(!joint)return;
    rotation.setFromAxisAngle(joint.x,x);sideRotation.setFromAxisAngle(joint.z,z);
    joint.bone.quaternion.copy(rotation).multiply(sideRotation).multiply(joint.rest);
  }
  update(body:T.Group,arms:T.Group[],legs:T.Group[],carrying:boolean){
    if(this.playback){
      if(this.overlay==='fish_idle'&&this.fishingClock!==null){
        const joints=[...this.arms,...this.elbows,...(this.spine?[this.spine]:[])];
        joints.forEach((joint,i)=>{if(this.fishingBase[i])joint.bone.quaternion.copy(this.fishingBase[i])});
        const t=this.fishingClock,wind=T.MathUtils.smoothstep(t,0,.45),release=T.MathUtils.smoothstep(t,.45,.95);
        const reel=T.MathUtils.smoothstep(t,5.8,7.2),pulse=t>5.8?Math.sin((t-5.8)*16)*.10:0;
        const swing=-.85*wind+.85*release-.38*reel+pulse;
        for(let i=0;i<2;i++){
          const arm=this.arms[i],elbow=this.elbows[i];
          if(arm)arm.bone.quaternion.premultiply(rotation.setFromAxisAngle(arm.x,swing*(i===0?1:.45)));
          if(elbow)elbow.bone.quaternion.premultiply(rotation.setFromAxisAngle(elbow.x,-.30*wind+.30*release-.25*reel));
        }
      }
      if(carrying||this.overlay==='eat'||this.overlay==='pick'){
        for(let i=0;i<2;i++){this.pose(this.arms[i],arms[i].rotation.x,arms[i].rotation.z);this.pose(this.elbows[i],carrying?-.32:-.08)}
        if(this.overlay==='pick'&&this.spine)this.pose(this.spine,body.rotation.x);
      }
      return;
    }
    if(this.spine)this.pose(this.spine,body.rotation.x);
    for(let i=0;i<2;i++){
      this.pose(this.arms[i],arms[i].rotation.x,arms[i].rotation.z);
      this.pose(this.elbows[i],carrying?-.32:-.08);
      this.pose(this.legs[i],legs[i].rotation.x);
      this.pose(this.knees[i],Math.max(0,legs[i].rotation.x)*.55);
    }
  }
  animate(dt:number,motion:PersonMotion,speed:number,move?:()=>number){
    this.overlay=motion;const blocked=this.playback?this.playback.step(dt,motion,speed,move):(move?.(),false);
    if(motion==='fish_idle')this.fishingBase=[...this.arms,...this.elbows,...(this.spine?[this.spine]:[])].map(joint=>joint.bone.quaternion.clone());
    return blocked;
  }
  sitOnBench(){
    if(this.spine)this.pose(this.spine,.06);
    for(let i=0;i<2;i++){this.pose(this.legs[i],-Math.PI*.47);this.pose(this.knees[i],Math.PI*.48);this.pose(this.arms[i],-.32,i===0?.08:-.08);this.pose(this.elbows[i],-.35)}
  }
  setFishingClock(time:number|null){this.fishingClock=time}
  get walkSpeed(){return this.playback?.walkSpeed??.4}
  get hasAnimations(){return this.playback!==null}
  get castDuration(){return 1.35}
  workDuration(kind:'wood'|'stone'){return this.playback?.duration(kind)??1/1.7}
  dispose(){this.playback?.dispose()}
  /** A palm socket on the anatomical right hand, in the imported rig's units. */
  grip(tool:T.Group,kind:'axe'|'pickaxe'|'rod'){
    const hand=this.hands[0];if(!hand)return;
    if(tool.parent!==hand)hand.add(tool);
    tool.position.copy(this.palm);tool.scale.setScalar(1/this.modelScale);tool.quaternion.copy(this.socketRotation);
    if(kind==='rod'){
      const t=this.fishingClock??2,wind=T.MathUtils.smoothstep(t,0,.45),release=T.MathUtils.smoothstep(t,.45,.95),settle=T.MathUtils.smoothstep(t,.95,1.35);
      const reel=T.MathUtils.smoothstep(t,5.8,7.2);
      tool.quaternion.multiply(sideRotation.setFromAxisAngle(new T.Vector3(1,0,0),-.25+.5*wind-.8*release+.8*settle-.3*reel));
    }
  }
}
