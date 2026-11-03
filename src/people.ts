import * as T from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {clone} from 'three/addons/utils/SkeletonUtils.js';

const variants=[...Array.from({length:6},(_,i)=>`peasant_${i+1}`),'city_dwellers_1','city_dwellers_2',
  ...Array.from({length:4},(_,i)=>`rich_citizzens_${i+1}`),'king','queen'];
type Joint={bone:T.Bone;rest:T.Quaternion;x:T.Vector3;z:T.Vector3};
const rotation=new T.Quaternion(),sideRotation=new T.Quaternion();

/** One shared download; each citizen receives an independent cloned skeleton. */
export class PeopleLibrary {
  private templates=new Map<string,T.Object3D>();
  readonly ready:Promise<void>;
  constructor(){
    const url=`${(import.meta as unknown as {env:{BASE_URL:string}}).env.BASE_URL}models/people.glb.gz`;
    this.ready=fetch(url).then(async response=>{
      if(!response.ok||!response.body)throw new Error(`Character download: ${response.status}`);
      const bytes=await new Response(response.body.pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();
      const gltf=await new GLTFLoader().parseAsync(bytes,'');
      for(const name of variants){const template=gltf.scene.getObjectByName(`character_${name}`);if(template)this.templates.set(name,template)}
      if(this.templates.size!==variants.length)throw new Error('Character pack is incomplete');
    }).catch(error=>{console.error('Karakter paketi y�klenemedi; yedek k�yl�ler kullan�l�yor.',error)});
  }
  create(id:number){
    const template=this.templates.get(variants[id%variants.length]);
    return template?new PersonVisual(clone(template)):null;
  }
}

/** Adapt the supplied T-pose skeleton to the game's existing task gestures. */
export class PersonVisual {
  readonly root=new T.Group();
  private bones:T.Bone[]=[];
  private arms:Joint[]=[];private elbows:Joint[]=[];private legs:Joint[]=[];private knees:Joint[]=[];
  private spine:Joint|null=null;
  private hands:T.Bone[]=[];
  private point=new T.Vector3();
  constructor(model:T.Object3D){
    this.root.add(model);model.updateMatrixWorld(true);
    const bounds=new T.Box3().setFromObject(model),size=bounds.getSize(new T.Vector3()),center=bounds.getCenter(new T.Vector3());
    const scale=.46/Math.max(.01,size.y);model.scale.multiplyScalar(scale);
    model.position.set(-center.x*scale,-bounds.min.y*scale,-center.z*scale);
    model.traverse(object=>{
      if((object as T.Bone).isBone)this.bones.push(object as T.Bone);
      if((object as T.Mesh).isMesh){const mesh=object as T.Mesh;mesh.castShadow=true;mesh.receiveShadow=true;mesh.frustumCulled=false}
    });
    this.root.updateMatrixWorld(true);
    const find=(name:string)=>this.bones.find(b=>b.name===name||b.name.startsWith(`${name}_`));
    const ordered=['R','L'].map(side=>({upper:find(`Upperarm_${side}`),lower:find(`Lowerarm_${side}`),hand:find(`Hand_${side}`),leg:find(`Thigh_${side}`),knee:find(`Calf_${side}`)}))
      .sort((a,b)=>(a.upper?.getWorldPosition(new T.Vector3()).x??0)-(b.upper?.getWorldPosition(new T.Vector3()).x??0));
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
    if(this.spine)this.pose(this.spine,body.rotation.x);
    for(let i=0;i<2;i++){
      this.pose(this.arms[i],arms[i].rotation.x,arms[i].rotation.z);
      this.pose(this.elbows[i],carrying?-.32:-.08);
      this.pose(this.legs[i],legs[i].rotation.x);
      this.pose(this.knees[i],Math.max(0,legs[i].rotation.x)*.55);
    }
  }
  /** Position existing tools at the actual imported hand, preserving their swing. */
  grip(tool:T.Group,offset=0,both=false){
    const hand=this.hands[0];if(!hand||!tool.parent)return;
    hand.getWorldPosition(this.point);
    if(both&&this.hands[1])this.point.add(this.hands[1].getWorldPosition(new T.Vector3())).multiplyScalar(.5);
    tool.parent.worldToLocal(this.point);
    // The old tools were authored below a shoulder pivot; offset to their handle.
    tool.position.copy(this.point);
    tool.position.y+=offset;
  }
}

