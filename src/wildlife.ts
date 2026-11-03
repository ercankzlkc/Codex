import * as T from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {clone} from 'three/addons/utils/SkeletonUtils.js';
import {fromWorld,position} from './hex';
import {SEA_Y} from './scenery';
/** Small shared meshes keep the coast alive without adding simulation workers. */
export class Wildlife {
  readonly soundBirds:T.Object3D[]=[];
  private root=new T.Group();
  private birds:{root:T.Group;mixer:T.AnimationMixer;phase:number}[]=[];
  private fish:{root:T.Group;start:T.Vector3;direction:T.Vector3;age:number;wait:number;duration:number}[]=[];
  private center=new T.Vector3();private radius=4;
  private board:ReadonlyMap<number,unknown>=new Map();
  constructor(scene:T.Scene,private splash:(x:number,z:number)=>void){
    scene.add(this.root);
    new GLTFLoader().load(`${(import.meta as unknown as {env:{BASE_URL:string}}).env.BASE_URL}models/seagull.glb`,gltf=>{
      const clip=gltf.animations.find(a=>a.name==='ArmatureAction');
      if(!clip){console.error('Martı uçuş animasyonu bulunamadı');return}
      for(let i=0;i<5;i++){
        const root=new T.Group(),bird=clone(gltf.scene);root.add(bird);
        const bounds=new T.Box3().setFromObject(bird),size=bounds.getSize(new T.Vector3()),center=bounds.getCenter(new T.Vector3());
        const scale=.55/Math.max(size.x,size.y,size.z);bird.scale.multiplyScalar(scale);bird.position.addScaledVector(center,-scale);
        const mixer=new T.AnimationMixer(bird);mixer.clipAction(clip).play();mixer.update(i*.27);
        this.root.add(root);this.soundBirds.push(root);this.birds.push({root,mixer,phase:i*1.93});
      }
    },undefined,error=>console.error('Martı modeli yüklenemedi',error));
    const silver=new T.MeshStandardMaterial({color:0x88b5b5,metalness:.18,roughness:.5}),tailGeo=new T.ConeGeometry(.055,.12,3);
    for(let i=0;i<2;i++){
      const root=new T.Group(),body=new T.Mesh(new T.SphereGeometry(.09,7,5),silver);body.scale.set(.5,.65,1.7);root.add(body);
      const tail=new T.Mesh(tailGeo,silver);tail.rotation.x=-Math.PI/2;tail.position.z=-.18;root.add(tail);root.visible=false;this.root.add(root);
      this.fish.push({root,start:new T.Vector3(),direction:new T.Vector3(),age:-1,wait:5+i*7,duration:1.25});
    }
  }
  sync(board:ReadonlyMap<number,unknown>){
    this.board=board;const points=[...board.keys()].map(position);if(!points.length)return;
    this.center.set(points.reduce((n,p)=>n+p.x,0)/points.length,0,points.reduce((n,p)=>n+p.z,0)/points.length);
    this.radius=Math.max(3,...points.map(p=>Math.hypot(p.x-this.center.x,p.z-this.center.z)+1.7));
  }
  reset(){for(let i=0;i<this.fish.length;i++){const f=this.fish[i];f.root.visible=false;f.age=-1;f.wait=5+i*7}}
  update(time:number,dt:number){
    this.birds.forEach((bird,i)=>{
      const a=time*(.11+i*.007)+bird.phase,r=this.radius+Math.sin(time*.09+bird.phase)*.8;
      bird.root.position.set(this.center.x+Math.cos(a)*r,2.4+i*.24+Math.sin(time*.6+bird.phase)*.14,this.center.z+Math.sin(a)*r*.7);
      bird.root.rotation.set(0,Math.atan2(-Math.sin(a),Math.cos(a)*.7),Math.sin(a+bird.phase)*.15);
      bird.mixer.update(dt);
    });
    for(const f of this.fish){
      if(f.age<0){
        f.wait-=dt;if(f.wait>0)continue;
        let found=false;
        for(let n=0;n<12;n++){
          const a=Math.random()*Math.PI*2,r=this.radius*(.75+Math.random()*.65),heading=a+Math.PI/2;
          f.start.set(this.center.x+Math.sin(a)*r,SEA_Y,this.center.z+Math.cos(a)*r);f.direction.set(Math.sin(heading)*1.5,0,Math.cos(heading)*1.5);
          if([0,.25,.5,.75,1].every(t=>!this.board.has(fromWorld(f.start.x+f.direction.x*t,f.start.z+f.direction.z*t)))){found=true;break}
        }
        if(!found){f.wait=3;continue}
        f.age=0;f.root.visible=true;this.splash(f.start.x,f.start.z);
      }
      f.age+=dt;const t=Math.min(1,f.age/f.duration);
      f.root.position.copy(f.start).addScaledVector(f.direction,t);f.root.position.y+=Math.sin(t*Math.PI)*.65;
      const tangent=f.direction.clone();tangent.y=Math.cos(t*Math.PI)*Math.PI*.65;f.root.quaternion.setFromUnitVectors(new T.Vector3(0,0,1),tangent.normalize());
      if(t>=1||this.board.has(fromWorld(f.root.position.x,f.root.position.z))){this.splash(f.root.position.x,f.root.position.z);f.root.visible=false;f.age=-1;f.wait=8+Math.random()*15}
    }
  }
}
