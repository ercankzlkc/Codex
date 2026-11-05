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
  private fish:{root:T.Group;start:T.Vector3;direction:T.Vector3;age:number;wait:number;duration:number;opacity:number}[]=[];
  private swimmers:{root:T.Group;angle:number;speed:number;lane:number;opacity:number}[]=[];
  private avoidance=new WeakMap<T.Group,T.Vector3>();
  private fear=new WeakMap<T.Group,{left:number;velocity:T.Vector3}>();
  private swimCenter=new T.Vector3();
  private swimRadius=2;
  private swimReady=false;
  private shore:ShoreEdge[]=[];
  private fishVisibility=0;
  private targetFishVisibility=1;
  private center=new T.Vector3();private radius=4;
  private board:ReadonlyMap<number,unknown>=new Map();
  constructor(scene:T.Scene,private splash:(x:number,z:number)=>void,private waterDepth:(x:number,z:number)=>number){
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
      const root=koiFish(.30,true,true);root.visible=false;this.root.add(root);
      this.fish.push({root,start:new T.Vector3(),direction:new T.Vector3(),age:-1,wait:5+i*7,duration:1.25,opacity:0});
    }
    for(let i=0;i<18;i++){
      const root=koiFish(.28,true,true);root.visible=false;this.root.add(root);
      this.swimmers.push({root,angle:i*2.39996,speed:.18+Math.random()*.32,lane:i,opacity:0});
    }
  }

  /** Only pointer-made disturbances trigger fear, never the fish's own splashes. */
  frighten(x:number,z:number,strength:number,length:number){
    if(climate.winter.value>.6)return;
    const radius=1.25+Math.min(1,strength)*.8+Math.min(.4,length);
    for(const fish of [...this.swimmers,...this.fish]){
      const root=fish.root;if(!root.visible||root.position.y>SEA_Y+.12)continue;
      const dx=root.position.x-x,dz=root.position.z-z,distance=Math.hypot(dx,dz);
      if(distance>radius)continue;
      const angle=distance>.01?Math.atan2(dx,dz):root.rotation.y;
      const previous=this.fear.get(root),velocity=previous?.velocity??new T.Vector3();
      velocity.lerp(new T.Vector3(Math.sin(angle),0,Math.cos(angle)),.8).normalize().multiplyScalar(2.4+strength*1.2);
      this.fear.set(root,{left:1.6,velocity});
    }
  }
  private fleeFish(root:T.Group,dt:number){
    const fear=this.fear.get(root);if(!fear||fear.left<=0)return false;
    fear.left=Math.max(0,fear.left-dt);
    const heading=Math.atan2(fear.velocity.x,fear.velocity.z),speed=fear.velocity.length()*Math.min(1,.35+fear.left);
    const step=Math.min(.16,speed*dt);
    let moved=false;
    // Turn along the shore instead of entering land; test the full short move.
    for(const turn of [0,.4,-.4,.85,-.85,1.4,-1.4,Math.PI]){
      const a=heading+turn,dx=Math.sin(a)*step,dz=Math.cos(a)*step;
      if(![.5,1].every(t=>this.clearWater(root.position.x+dx*t,root.position.z+dz*t)))continue;
      root.position.x+=dx;root.position.z+=dz;
      fear.velocity.set(Math.sin(a),0,Math.cos(a)).multiplyScalar(3);
      const yaw=T.MathUtils.euclideanModulo(a-root.rotation.y+Math.PI,Math.PI*2)-Math.PI;
      root.rotation.y+=yaw*(1-Math.exp(-dt*14));moved=true;break;
    }
    if(!moved)fear.velocity.applyAxisAngle(new T.Vector3(0,1,0),dt*5);
    const depth=Math.max(.03,this.waterDepth(root.position.x,root.position.z)-.10);
    root.position.y=T.MathUtils.damp(root.position.y,SEA_Y-Math.min(.28,depth),6,dt);
    return true;
  }
  private clearWater(x:number,z:number){
    if(this.board.has(fromWorld(x,z)))return false;
    for(let i=0;i<8;i++){const a=i*Math.PI/4;if(this.board.has(fromWorld(x+Math.cos(a)*.48,z+Math.sin(a)*.48)))return false}
    return true;
  }
  setView(camera:T.OrthographicCamera,height:number){
    const pixels=height/((camera.top-camera.bottom)/camera.zoom);
    this.targetFishVisibility=.25+.75*T.MathUtils.smoothstep(pixels,20,85);
  }
  sync(board:ReadonlyMap<number,unknown>){
    this.board=board;this.shore=coast(board);const points=[...board.keys()].map(position);if(!points.length)return;
    this.center.set(points.reduce((n,p)=>n+p.x,0)/points.length,0,points.reduce((n,p)=>n+p.z,0)/points.length);
    this.radius=Math.max(3,...points.map(p=>Math.hypot(p.x-this.center.x,p.z-this.center.z)+1.7));
  }
  reset(){this.fear=new WeakMap();this.avoidance=new WeakMap();this.swimReady=false;this.swimmers.forEach(f=>{f.root.visible=false;f.opacity=0});this.shore=[];for(let i=0;i<this.fish.length;i++){const f=this.fish[i];f.root.visible=false;f.age=-1;f.wait=5+i*7}}
  update(time:number,dt:number){
    this.fishVisibility=T.MathUtils.damp(this.fishVisibility,this.targetFishVisibility,3,dt);
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
    const targetRadius=Math.max(1.8,(this.radius-.7)/.88);
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
      const targetOpacity=this.shore.length
        ?this.fishVisibility*T.MathUtils.lerp(.48,.13,Math.min(1,fish.lane/12))*(1-climate.winter.value*.85):0;
      fish.opacity=T.MathUtils.damp(fish.opacity,targetOpacity,3,dt);
      fish.root.visible=fish.opacity>.005;
      if(this.fleeFish(fish.root,dt)){
        this.avoidance.set(fish.root,new T.Vector3(fish.root.position.x-x,0,fish.root.position.z-z));
        animateKoi(fish.root,dt*3.2,fish.opacity);continue;
      }
      const previousPosition=fish.root.position.clone();
      fish.root.position.set(x,SEA_Y-Math.min(depth,Math.max(.03,this.waterDepth(x,z)-.10)),z);
      const offset=this.avoidance.get(fish.root);if(offset){offset.multiplyScalar(Math.exp(-dt*.8));if(this.clearWater(x+offset.x,z+offset.z))fish.root.position.add(offset)}
      if(!this.clearWater(fish.root.position.x,fish.root.position.z)&&this.clearWater(previousPosition.x,previousPosition.z))fish.root.position.copy(previousPosition);
      const yaw=Math.atan2(Math.cos(angle),-Math.sin(angle)*.88);
      const turn=T.MathUtils.euclideanModulo(yaw-fish.root.rotation.y+Math.PI,Math.PI*2)-Math.PI;
      fish.root.rotation.y+=turn*(1-Math.exp(-2*dt));
      animateKoi(fish.root,dt*(.65+fish.speed*1.8),fish.opacity);
    }
    for(const f of this.fish){

      if(f.age>=f.duration&&this.fleeFish(f.root,dt)){
        f.age+=dt;const fear=this.fear.get(f.root)!;f.direction.copy(fear.velocity).normalize().multiplyScalar(1.5);
        f.opacity=T.MathUtils.damp(f.opacity,.42*this.fishVisibility*(1-climate.winter.value*.85),3,dt);
        animateKoi(f.root,dt*3.2,f.opacity);continue;
      }
      if(f.age>=f.duration){
        // Keep the same fish swimming from its actual splash-down position.
        f.age+=dt;const swimAge=f.age-f.duration;
        const heading=Math.atan2(f.direction.x,f.direction.z)+dt*.16;
        f.direction.set(Math.sin(heading)*1.5,0,Math.cos(heading)*1.5);
        const next=f.root.position.clone().addScaledVector(f.direction,dt*.2);
        if(this.clearWater(next.x,next.z))f.root.position.copy(next);
        else {f.direction.applyAxisAngle(new T.Vector3(0,1,0),dt*2);}
        if(!this.clearWater(f.root.position.x,f.root.position.z)){
          // A newly placed tile can cover an existing route; swim toward open water.
          const outward=f.root.position.clone().sub(this.center).setY(0).normalize();
          f.direction.lerp(outward.multiplyScalar(1.5),1-Math.exp(-dt*3));
          f.root.position.addScaledVector(f.direction,dt*.4);
        }
        f.root.position.y=T.MathUtils.damp(f.root.position.y,SEA_Y-Math.min(.23,Math.max(.03,this.waterDepth(f.root.position.x,f.root.position.z)-.10)),3,dt);
        f.root.quaternion.slerp(new T.Quaternion().setFromAxisAngle(new T.Vector3(0,1,0),heading),1-Math.exp(-3*dt));
        f.opacity=T.MathUtils.damp(f.opacity,.42*this.fishVisibility*(1-climate.winter.value*.85),3,dt);animateKoi(f.root,dt,f.opacity);
        if(climate.winter.value<.35&&swimAge>20&&[.25,.5,.75,1].every(t=>this.clearWater(f.root.position.x+f.direction.x*t,f.root.position.z+f.direction.z*t))){
          f.start.copy(f.root.position);f.start.y=SEA_Y;f.age=0;this.splash(f.start.x,f.start.z);
        }
        continue;
      }
      if(f.age<0){
        f.wait-=dt;if(f.wait>0)continue;
        let found=false;
        for(let n=0;n<12;n++){
          const a=Math.random()*Math.PI*2,r=this.radius*(.75+Math.random()*.65),heading=a+Math.PI/2;
          f.start.set(this.center.x+Math.sin(a)*r,SEA_Y,this.center.z+Math.cos(a)*r);f.direction.set(Math.sin(heading)*1.5,0,Math.cos(heading)*1.5);
          if([0,.25,.5,.75,1].every(t=>this.clearWater(f.start.x+f.direction.x*t,f.start.z+f.direction.z*t))){found=true;break}
        }
        if(!found){f.wait=3;continue}
        f.age=0;f.root.visible=true;this.splash(f.start.x,f.start.z);
      }
      f.opacity=T.MathUtils.damp(f.opacity,1,4,dt);animateKoi(f.root,dt,f.opacity);
      f.age+=dt;const t=Math.min(1,f.age/f.duration);
      const nextJump=f.start.clone().addScaledVector(f.direction,t);
      if(!this.clearWater(nextJump.x,nextJump.z)){f.age=f.duration;continue}
      f.root.position.copy(nextJump);f.root.position.y+=Math.sin(t*Math.PI)*.65;
      const tangent=f.direction.clone();tangent.y=Math.cos(t*Math.PI)*Math.PI*.65;f.root.quaternion.setFromUnitVectors(new T.Vector3(0,0,1),tangent.normalize());
      if(t>=1||this.board.has(fromWorld(f.root.position.x,f.root.position.z))){this.splash(f.root.position.x,f.root.position.z);f.age=f.duration;f.root.position.y=SEA_Y;animateKoi(f.root,0,f.opacity)}
    }
    const swimmers=new Set(this.swimmers.map(f=>f.root));
    const active=[...this.swimmers.map(f=>f.root),...this.fish.map(f=>f.root)].filter(root=>root.visible&&root.position.y<SEA_Y+.12);
    for(let pass=0;pass<3;pass++)for(let i=0;i<active.length;i++)for(let j=i+1;j<active.length;j++){
      const a=active[i],b=active[j],dx=a.position.x-b.position.x,dz=a.position.z-b.position.z,d=Math.hypot(dx,dz);
      if(d>=.85)continue;
      const nx=d>.001?dx/d:Math.cos(i*2.4),nz=d>.001?dz/d:Math.sin(i*2.4);
      const push=d<.48?(.48-d)*.5:(.85-d)*Math.min(.5,dt*3);
      for(const [root,sign] of [[a,1],[b,-1]] as const){
        const x=root.position.x+nx*push*sign,z=root.position.z+nz*push*sign;
        if(!this.clearWater(x,z))continue;
        root.position.x=x;root.position.z=z;
        if(swimmers.has(root)){
          const offset=this.avoidance.get(root)??new T.Vector3();offset.x+=nx*push*sign;offset.z+=nz*push*sign;this.avoidance.set(root,offset);
        }else{
          const fish=this.fish.find(f=>f.root===root)!;
          fish.direction.x+=nx*sign*dt;fish.direction.z+=nz*sign*dt;fish.direction.normalize().multiplyScalar(1.5);
        }
      }
    }
  }
}
