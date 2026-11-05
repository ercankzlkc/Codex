import * as T from 'three';
import {climate} from './climate';
import {gameSpeed} from './game-speed';
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
  private swimMotion=new WeakMap<T.Group,{speed:number;heading:number;home?:{x:number;z:number}}>();
  private swimTime=0;
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
      this.swimmers.push({root,angle:i*2.39996,speed:.10+Math.random()*.08,lane:i,opacity:0});
    }
  }

  /** Only pointer-made disturbances trigger fear, never the fish's own splashes. */
  frighten(x:number,z:number,strength:number,length:number){
    if(climate.winter.value>.6)return;
    const radius=.32+Math.min(1,strength)*.12+Math.min(.04,length*.12);
    for(const fish of [...this.swimmers,...this.fish]){
      const root=fish.root;if(!root.visible||root.position.y>SEA_Y+.12)continue;
      const dx=root.position.x-x,dz=root.position.z-z,distance=Math.hypot(dx,dz);
      if(distance>radius)continue;
      const angle=distance>.01?Math.atan2(dx,dz):root.rotation.y;
      const previous=this.fear.get(root),velocity=previous?.velocity??new T.Vector3();
      velocity.lerp(new T.Vector3(Math.sin(angle),0,Math.cos(angle)),.45).normalize().multiplyScalar(.44+Math.min(1,strength)*.18);
      this.fear.set(root,{left:1.25,velocity});
    }
  }
  private fleeFish(root:T.Group,dt:number){
    const fear=this.fear.get(root);if(!fear||fear.left<=0)return false;
    fear.left=Math.max(0,fear.left-dt);
    const motion=this.swimMotion.get(root)??{speed:.14,heading:root.rotation.y};
    const target=Math.atan2(fear.velocity.x,fear.velocity.z);
    const turn=T.MathUtils.euclideanModulo(target-motion.heading+Math.PI,Math.PI*2)-Math.PI;
    motion.heading+=T.MathUtils.clamp(turn,-dt*3,dt*3);
    motion.speed=T.MathUtils.damp(motion.speed,T.MathUtils.lerp(.16,fear.velocity.length(),Math.min(1,fear.left/.6)),4,dt);
    this.swimMotion.set(root,motion);
    const heading=motion.heading,step=Math.min(.055,motion.speed*dt);
    let moved=false;
    // Turn along the shore instead of entering land; test the full short move.
    for(const turn of [0,.4,-.4,.85,-.85,1.4,-1.4,Math.PI]){
      const a=heading+turn,dx=Math.sin(a)*step,dz=Math.cos(a)*step;
      if(![.5,1].every(t=>this.clearWater(root.position.x+dx*t,root.position.z+dz*t)))continue;
      root.position.x+=dx;root.position.z+=dz;
      motion.heading=a;
      const yaw=T.MathUtils.euclideanModulo(a-root.rotation.y+Math.PI,Math.PI*2)-Math.PI;
      root.rotation.y+=yaw*(1-Math.exp(-dt*6));moved=true;break;
    }
    const home=this.swimMotion.get(root)?.home;if(home){home.x=root.position.x;home.z=root.position.z}
    if(!moved)fear.velocity.applyAxisAngle(new T.Vector3(0,1,0),dt*5);
    const depth=Math.max(.03,this.waterDepth(root.position.x,root.position.z)-.10);
    root.position.y=T.MathUtils.damp(root.position.y,SEA_Y-Math.min(.28,depth),6,dt);
    return true;
  }
  private shoreHome(lane:number){
    const count=this.shore.length;if(!count)return null;
    for(let attempt=0;attempt<Math.min(18,count*3);attempt++){
      const edge=this.shore[(Math.floor(lane*count/18)+attempt*7)%count];
      const dx=edge.bx-edge.ax,dz=edge.bz-edge.az,len=Math.max(.001,Math.hypot(dx,dz));
      const t=.25+((lane*7+attempt*3)%11)/22,mx=edge.ax+dx*t,mz=edge.az+dz*t;
      const sign=this.board.has(fromWorld(mx-dz/len*.3,mz+dx/len*.3))?-1:1;
      const offset=.82+((lane+attempt)%5)*.18;
      const x=mx-dz/len*offset*sign,z=mz+dx/len*offset*sign,depth=this.waterDepth(x,z);
      if(depth>.24&&depth<1.7&&this.clearWater(x,z))return {x,z,heading:Math.atan2(dx,dz)+(lane%2?Math.PI:0)};
    }
    return null;
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
  reset(){this.fear=new WeakMap();this.swimMotion=new WeakMap();this.swimTime=0;this.swimReady=false;this.swimmers.forEach(f=>{f.root.visible=false;f.opacity=0});this.shore=[];for(let i=0;i<this.fish.length;i++){const f=this.fish[i];f.root.visible=false;f.age=-1;f.wait=5+i*7}}
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
    // Ambient fish use real time: game fast-forward must not turn them into projectiles.
    const fishDt=dt/Math.max(1,gameSpeed.value);this.swimTime+=fishDt;
    const targetRadius=Math.max(1.8,(this.radius-.7)/.88);
    if(!this.swimReady){this.swimCenter.copy(this.center);this.swimRadius=targetRadius;this.swimReady=true}
    this.swimCenter.lerp(this.center,1-Math.exp(-fishDt*.8));
    this.swimRadius=T.MathUtils.damp(this.swimRadius,targetRadius,.8,fishDt);
    for(const fish of this.swimmers){
      let motion=this.swimMotion.get(fish.root);
      if(!motion){
        const radius=this.swimRadius+fish.lane*.72,a=fish.angle;
        const x=this.swimCenter.x+Math.sin(a)*radius,z=this.swimCenter.z+Math.cos(a)*radius*.88;
        const home=this.shoreHome(fish.lane);
        fish.root.position.set(home?.x??x,SEA_Y-.2,home?.z??z);
        motion={speed:fish.speed,heading:home?.heading??Math.atan2(Math.cos(a),-Math.sin(a)*.88),home:home??{x,z}};
        fish.root.rotation.y=motion.heading;this.swimMotion.set(fish.root,motion);
      }
      const waterDepth=this.waterDepth(fish.root.position.x,fish.root.position.z);
      const open=this.clearWater(fish.root.position.x,fish.root.position.z);
      const shelfVisibility=1-T.MathUtils.smoothstep(waterDepth,1.3,2.7);
      const targetOpacity=this.shore.length&&open?this.fishVisibility*.92*shelfVisibility*(1-climate.winter.value*.96):0;
      fish.opacity=T.MathUtils.damp(fish.opacity,targetOpacity,3,fishDt);fish.root.visible=fish.opacity>.005;
      if(!open){
        // New land may cover a swimmer. Leave below the surface while hidden, never jump through it.
        const home=this.shoreHome(fish.lane);
        if(home){
          motion.home=home;const dx=home.x-fish.root.position.x,dz=home.z-fish.root.position.z,d=Math.hypot(dx,dz);
          const step=Math.min(d,fishDt*.28);
          if(d>.001){fish.root.position.x+=dx/d*step;fish.root.position.z+=dz/d*step;motion.heading=Math.atan2(dx,dz)}
        }
        animateKoi(fish.root,fishDt,fish.opacity);continue;
      }
      if(this.fleeFish(fish.root,fishDt)){animateKoi(fish.root,fishDt*(.5+motion.speed*2),fish.opacity);continue}
      // Keep the actual escape position. Gently curve onwards, never spring back to an old lane.
      motion.speed=T.MathUtils.damp(motion.speed,fish.speed,1.5,fishDt);
      motion.heading+=Math.sin(this.swimTime*.18+fish.lane*2.4)*fishDt*.10;
      if(motion.home){
        const dx=motion.home.x-fish.root.position.x,dz=motion.home.z-fish.root.position.z,d=Math.hypot(dx,dz);
        if(d>1.15){
          const target=Math.atan2(dx,dz),turn=T.MathUtils.euclideanModulo(target-motion.heading+Math.PI,Math.PI*2)-Math.PI;
          motion.heading+=T.MathUtils.clamp(turn,-fishDt*.22,fishDt*.22)*T.MathUtils.smoothstep(d,1.15,2.4);
        }
      }
      let moved=false;
      for(const turn of [0,.3,-.3,.65,-.65,1.2,-1.2]){
        const heading=motion.heading+turn,step=motion.speed*fishDt;
        const x=fish.root.position.x+Math.sin(heading)*step,z=fish.root.position.z+Math.cos(heading)*step;
        if(!this.clearWater(x,z))continue;
        fish.root.position.x=x;fish.root.position.z=z;motion.heading=heading;moved=true;break;
      }
      if(!moved)motion.heading+=fishDt*.8;
      const depth=Math.min(.18+Math.min(.6,fish.lane*.045),Math.max(.03,this.waterDepth(fish.root.position.x,fish.root.position.z)-.10));
      fish.root.position.y=T.MathUtils.damp(fish.root.position.y,SEA_Y-depth,2,fishDt);
      const turn=T.MathUtils.euclideanModulo(motion.heading-fish.root.rotation.y+Math.PI,Math.PI*2)-Math.PI;
      fish.root.rotation.y+=turn*(1-Math.exp(-fishDt*2.5));
      animateKoi(fish.root,fishDt*(.4+motion.speed*2),fish.opacity);
    }
    for(const f of this.fish){

      if(f.age>=f.duration&&this.fleeFish(f.root,fishDt)){
        f.age+=fishDt;const fear=this.fear.get(f.root)!;f.direction.copy(fear.velocity).normalize().multiplyScalar(1.5);
        f.opacity=T.MathUtils.damp(f.opacity,.88*this.fishVisibility*(1-climate.winter.value*.96),3,fishDt);
        animateKoi(f.root,fishDt*1.3,f.opacity);continue;
      }
      if(f.age>=f.duration){
        // Keep the same fish swimming from its actual splash-down position.
        f.age+=fishDt;const swimAge=f.age-f.duration;
        const heading=Math.atan2(f.direction.x,f.direction.z)+fishDt*.16;
        f.direction.set(Math.sin(heading)*1.5,0,Math.cos(heading)*1.5);
        const next=f.root.position.clone().addScaledVector(f.direction,fishDt*.2);
        if(this.clearWater(next.x,next.z))f.root.position.copy(next);
        else {f.direction.applyAxisAngle(new T.Vector3(0,1,0),fishDt*2);}
        if(!this.clearWater(f.root.position.x,f.root.position.z)){
          // A newly placed tile can cover an existing route; swim toward open water.
          const outward=f.root.position.clone().sub(this.center).setY(0).normalize();
          f.direction.lerp(outward.multiplyScalar(1.5),1-Math.exp(-fishDt*3));
          f.root.position.addScaledVector(f.direction,fishDt*.4);
        }
        f.root.position.y=T.MathUtils.damp(f.root.position.y,SEA_Y-Math.min(.23,Math.max(.03,this.waterDepth(f.root.position.x,f.root.position.z)-.10)),3,fishDt);
        f.root.quaternion.slerp(new T.Quaternion().setFromAxisAngle(new T.Vector3(0,1,0),heading),1-Math.exp(-3*fishDt));
        f.opacity=T.MathUtils.damp(f.opacity,.88*this.fishVisibility*(1-climate.winter.value*.96),3,fishDt);animateKoi(f.root,fishDt,f.opacity);
        if(climate.winter.value<.35&&swimAge>20&&[.25,.5,.75,1].every(t=>this.clearWater(f.root.position.x+f.direction.x*t,f.root.position.z+f.direction.z*t))){
          f.start.copy(f.root.position);f.start.y=SEA_Y;f.age=0;this.splash(f.start.x,f.start.z);
        }
        continue;
      }
      if(f.age<0){
        f.wait-=fishDt;if(f.wait>0)continue;
        let found=false;
        for(let n=0;n<12;n++){
          const a=Math.random()*Math.PI*2,r=this.radius*(.75+Math.random()*.65),heading=a+Math.PI/2;
          f.start.set(this.center.x+Math.sin(a)*r,SEA_Y,this.center.z+Math.cos(a)*r);f.direction.set(Math.sin(heading)*1.5,0,Math.cos(heading)*1.5);
          if([0,.25,.5,.75,1].every(t=>this.clearWater(f.start.x+f.direction.x*t,f.start.z+f.direction.z*t))){found=true;break}
        }
        if(!found){f.wait=3;continue}
        f.age=0;f.root.visible=true;this.splash(f.start.x,f.start.z);
      }
      f.opacity=T.MathUtils.damp(f.opacity,1,4,fishDt);animateKoi(f.root,fishDt,f.opacity);
      f.age+=fishDt;const t=Math.min(1,f.age/f.duration);
      const nextJump=f.start.clone().addScaledVector(f.direction,t);
      if(!this.clearWater(nextJump.x,nextJump.z)){f.age=f.duration;continue}
      f.root.position.copy(nextJump);f.root.position.y+=Math.sin(t*Math.PI)*.65;
      const tangent=f.direction.clone();tangent.y=Math.cos(t*Math.PI)*Math.PI*.65;f.root.quaternion.setFromUnitVectors(new T.Vector3(0,0,1),tangent.normalize());
      if(t>=1||this.board.has(fromWorld(f.root.position.x,f.root.position.z))){this.splash(f.root.position.x,f.root.position.z);f.age=f.duration;f.root.position.y=SEA_Y;animateKoi(f.root,0,f.opacity)}
    }
    const active=[...this.swimmers.map(f=>f.root),...this.fish.map(f=>f.root)].filter(root=>root.visible&&root.position.y<SEA_Y+.12);
    for(let pass=0;pass<3;pass++)for(let i=0;i<active.length;i++)for(let j=i+1;j<active.length;j++){
      const a=active[i],b=active[j],dx=a.position.x-b.position.x,dz=a.position.z-b.position.z,d=Math.hypot(dx,dz);
      if(d>=.5)continue;
      const nx=d>.001?dx/d:Math.cos(i*2.4),nz=d>.001?dz/d:Math.sin(i*2.4);
      const push=Math.min(.012,(.5-d)*fishDt*1.2);
      for(const [root,sign] of [[a,1],[b,-1]] as const){
        const x=root.position.x+nx*push*sign,z=root.position.z+nz*push*sign;
        if(!this.clearWater(x,z))continue;
        root.position.x=x;root.position.z=z;
        const motion=this.swimMotion.get(root);
        if(motion){
          motion.heading+=nx*sign*fishDt*.15;
        }else{
          const fish=this.fish.find(f=>f.root===root)!;
          fish.direction.x+=nx*sign*fishDt;fish.direction.z+=nz*sign*fishDt;fish.direction.normalize().multiplyScalar(1.5);
        }
      }
    }
  }
}
