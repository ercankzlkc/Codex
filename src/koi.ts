import * as T from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {clone} from 'three/addons/utils/SkeletonUtils.js';
let asset:ReturnType<GLTFLoader['loadAsync']>|undefined;
/** Each swimming fish owns its skeleton and animation playback. */
export function koiFish(length:number,animated=false,underwater=false){
  const root=new T.Group();
  asset??=new GLTFLoader().loadAsync(new URL('models/koi-fish.glb',document.baseURI).href);
  void asset.then(gltf=>{
    const model=clone(gltf.scene),pivot=new T.Group();pivot.add(model);root.add(pivot);
    const bounds=new T.Box3().setFromObject(model),size=bounds.getSize(new T.Vector3()),center=bounds.getCenter(new T.Vector3());
    const scale=length/Math.max(size.x,size.y,size.z);pivot.scale.setScalar(scale);model.position.sub(center);
    model.traverse(object=>{
      if(!(object instanceof T.Mesh))return;
      object.frustumCulled=false;object.castShadow=false;
      if(underwater){
        object.material=Array.isArray(object.material)?object.material.map(m=>m.clone()):object.material.clone();
        for(const material of Array.isArray(object.material)?object.material:[object.material]){material.transparent=true;material.opacity=0;material.depthWrite=false;
          if(material instanceof T.MeshStandardMaterial){material.color.lerp(new T.Color('#438e97'),.38);material.roughness=.85}}
        object.renderOrder=3;
      }
    });
    if(animated&&gltf.animations.length){
      const mixer=new T.AnimationMixer(model);mixer.clipAction(gltf.animations[0]).play();mixer.update(Math.random()*gltf.animations[0].duration);root.userData.koiMixer=mixer;
    }
  }).catch(error=>console.error('Koi balığı yüklenemedi',error));
  return root;
}
export function animateKoi(root:T.Group,dt:number,opacity?:number){
  (root.userData.koiMixer as T.AnimationMixer|undefined)?.update(dt);
  if(opacity!==undefined)root.traverse(object=>{
    if(object instanceof T.Mesh)for(const material of Array.isArray(object.material)?object.material:[object.material])material.opacity=opacity;
  });
}
