import * as T from 'three';
import {climate} from './climate';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {clone} from 'three/addons/utils/SkeletonUtils.js';
import {fromWorld,position,coast,type ShoreEdge} from './hex';
import {SEA_Y} from './scenery';
import {koiFish,animateKoi} from './koi';
/** Small shared meshes keep the coast alive without adding simulation workers. */
export class Wildlife {
  readonly soundBirds:T.Object3D[]=[];
  private root=new T.Group();
  private birds:{root:T.Group;mixer:T.AnimationMixer;phase:number;pace:number;angle:number;direction:number;radius:number;center:T.Vector3}[]=[];
  private fish:{root:T.Group;start:T.Vector3;direction:T.Vector3;age:number;wait:number;duration:number}[]=[];
  private swimmers:{root:T.Group;angle:number;speed:number;lane:number;opacity:number}[]=[];
  private swimCenter=new T.Vector3();
  private swimRadius=2;
  private swimReady=false;
  private shore:ShoreEdge[]=[];
  private fishVisibility=0;
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
        this.root.add(root);this.soundBirds.push(root);const angle=i*1.93,radius=this.radius+i*.9;root.position.set(this.center.x+Math.cos(angle)*radius,2.4+i*.38,this.center.z+Math.sin(angle)*radius*.7);
        const direction=i%2?-1:1;root.rotation.y=Math.atan2(-Math.sin(angle)*direction,Math.cos(angle)*.7*direction);
        this.birds.push({root,mixer,phase:i*1.93,pace:i===1?1.55:i===3?1.85:1,angle,direction,radius,center:this.center.clone()});
      }
    },undefined,error=>console.error('Martı modeli yüklenemedi',error));
    for(let i=0;i<2;i++){
      const root=koiFish(.30,true);root.visible=false;this.root.add(root);
      this.fish.push({root,start:new T.Vector3(),direction:new T.Vector3(),age:-1,wait:5+i*7,duration:1.25});
    }
    for(let i=0;i<18;i++){
      const root=koiFish(.28,true,true);root.visible=false;this.root.add(root);
      this.swimmers.push({root,angle:i*2.39996,speed:.18+Math.random()*.32,lane:i,opacity:0});
    }
  }

  setView(camera:T.OrthographicCamera,height:number){
    const pixels=height/((camera.top-camera.bottom)/camera.zoom);
    this.fishVisibility=T.MathUtils.smoothstep(pixels,20,85);
  }
  sync(board:ReadonlyMap<number,unknown>){
    this.board=board;this.shore=coast(board);const points=[...board.keys()].map(position);if(!points.length)return;
    this.center.set(points.reduce((n,p)=>n+p.x,0)/points.length,0,points.reduce((n,p)=>n+p.z,0)/points.length);
    this.radius=Math.max(3,...points.map(p=>Math.hypot(p.x-this.center.x,p.z-this.center.z)+1.7));
  }
  reset(){this.swimReady=false;this.swimmers.forEach(f=>{f.root.visible=false;f.opacity=0});this.shore=[];for(let i=0;i<this.fish.length;i++){const f=this.fish[i];f.root.visible=false;f.age=-1;f.wait=5+i*7}}
  update(time:number,dt:number){
    this.birds.forEach((bird,i)=>{
      bird.angle+=dt*(.11+i*.007)*bird.pace*bird.direction;
      const a=bird.angle,blend=1-Math.exp(-1.5*dt);
      bird.center.lerp(this.center,blend);bird.radius=T.MathUtils.lerp(bird.radius,this.radius+i*.9,blend);
      const r=bird.radius+Math.sin(time*.09+bird.phase)*.05;
      // Separated concentric lanes and altitude bands keep opposing flights apart.
      bird.root.position.set(bird.center.x+Math.cos(a)*r,2.4+i*.38+Math.sin(time*.6+bird.phase)*.04,bird.center.z+Math.sin(a)*r*.7);
      const yaw=Math.atan2(-Math.sin(a)*bird.direction,Math.cos(a)*.7*bird.direction);
      const turn=T.MathUtils.euclideanModulo(yaw-bird.root.rotation.y+Math.PI,Math.PI*2)-Math.PI;
      bird.root.rotation.y+=turn*(1-Math.exp(-5*dt));
      bird.root.rotation.z=T.MathUtils.lerp(bird.root.rotation.z,-bird.direction*.10+Math.sin(a+bird.phase)*.04,1-Math.exp(-3*dt));
      bird.mixer.update(dt*(bird.pace===1?1:1.15));
    });
    // Separate elliptical lanes keep a body-width clearance even at different speeds.
    const targetRadius=Math.max(1.8,this.radius-1.05);
    if(!this.swimReady){this.swimCenter.copy(this.center);this.swimRadius=targetRadius;this.swimReady=true}
    this.swimCenter.lerp(this.center,1-Math.exp(-dt*.8));
    this.swimRadius=T.MathUtils.damp(this.swimRadius,targetRadius,.8,dt);
    for(const fish of this.swimmers){
      const radius=this.swimRadius+fish.lane*.72;
      const a=fish.angle;
      // Constant individual cruising speed, no reversing at the end of a shore segment.
      const tangentLength=radius*Math.hypot(Math.cos(a),Math.sin(a)*.88);
      fish.angle+=dt*fish.speed/Math.max(1,tangentLength);
      const angle=fish.angle,x=this.swimCenter.x+Math.sin(angle)*radius,z=this.swimCenter.z+Math.cos(angle)*radius*.88;
      const depth=.18+Math.min(.6,fish.lane*.045);
      const targetOpacity=this.shore.length&&!this.board.has(fromWorld(x,z))&&climate.winter.value<.5
        ?this.fishVisibility*T.MathUtils.lerp(.48,.13,Math.min(1,fish.lane/12)):0;
      fish.opacity=T.MathUtils.damp(fish.opacity,targetOpacity,3,dt);
      fish.root.visible=fish.opacity>.005;
      fish.root.position.set(x,SEA_Y-depth,z);
      const yaw=Math.atan2(Math.cos(angle),-Math.sin(angle)*.88);
      const turn=T.MathUtils.euclideanModulo(yaw-fish.root.rotation.y+Math.PI,Math.PI*2)-Math.PI;
      fish.root.rotation.y+=turn*(1-Math.exp(-2*dt));
      animateKoi(fish.root,dt*(.65+fish.speed*1.8),fish.opacity);
    }
    for(const f of this.fish){
      if(climate.winter.value>.35){f.root.visible=false;f.age=-1;continue;}
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
      animateKoi(f.root,dt);
      f.age+=dt;const t=Math.min(1,f.age/f.duration);
      f.root.position.copy(f.start).addScaledVector(f.direction,t);f.root.position.y+=Math.sin(t*Math.PI)*.65;
      const tangent=f.direction.clone();tangent.y=Math.cos(t*Math.PI)*Math.PI*.65;f.root.quaternion.setFromUnitVectors(new T.Vector3(0,0,1),tangent.normalize());
      if(t>=1||this.board.has(fromWorld(f.root.position.x,f.root.position.z))){this.splash(f.root.position.x,f.root.position.z);f.root.visible=false;f.age=-1;f.wait=8+Math.random()*15}
    }
  }
}
