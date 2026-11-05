import * as T from 'three';
import {PeopleLibrary,type PersonVisual} from './people';
import type {PersonMotion} from './motions';
import {icon} from './icons';
import {box,ball,resourceModel,resourceUnitModel} from './models';
import {CENTER,position,fromWorld,adjacent} from './hex';
import {Game,harvestSeconds,hexDistance,WORK_CATEGORIES,type Resource,type WorkCategory} from './game';
import {LAND_Y,SEA_Y} from './scenery';
import {Walkways,type WalkPoint} from './navigation';
type Job={source:number;store:number;resource:Resource;amount:number;tree:number;category:WorkCategory|null};
type Flight={mesh:T.Group;owner:Citizen;job:Job;store:number;from:T.Vector3;to:T.Vector3;age:number;duration:number;returning:boolean};
type Citizen={visual:PersonVisual|null;restUntil:number;id:number;root:T.Group;body:T.Group;arms:T.Group[];legs:T.Group[];bundle:T.Group;axe:T.Group;pickaxe:T.Group;rod:T.Group;line:T.Line;bobber:T.Mesh;fish:T.Group;stage:'idle'|'to-work'|'working'|'to-pickup'|'picking'|'to-store'|'unloading';unload:{store:number;clock:number;lastThrow:number;inFlight:number;failed:boolean;total:number}|null;path:WalkPoint[];target:T.Vector3|null;job:Job|null;clock:number;retry:number;phase:number;birth:number;speed:number;walkPhase:number;wait:number;status:HTMLElement;lastStatus:string;eatUntil:number;hungry:boolean;waitReason:string;searchUntil:number;stuck:number;bestDistance:number;nodeMarker:string;avoid:{x:number;z:number;until:number}[]};
export interface VillageHooks {
  ready(id:number):boolean;yaw(id:number):number;resourceReady(id:number):boolean;
  pickTree(id:number,preferred:number):number;workPoint(id:number,tree:number):T.Vector3;
  obstacles(id:number):{x:number;z:number;r:number}[];
  pickup(id:number,index:number,take:boolean):T.Vector3|null;
  harvest(id:number,resource:Resource,tree:number,actor:number):boolean;
  harvestProgress(id:number,actor:number,progress:number):void;
  fishingSpot(id:number):{stand:T.Vector3;water:T.Vector3}|null;
  contactDistance(id:number,index:number,point:T.Vector3):number;
  impact(id:number,index:number):void;splash(x:number,z:number):void;trail(points:WalkPoint[]):void;
  deliver(source:number,store:number,resource:Resource,amount:number):number;
}
export class Villagers {
  private contacts=new WeakMap<Citizen,{distance:number;approaching:boolean;lastHit:number;job:Citizen['job'];tips?:T.Vector3[]}>();
  private contactPoint=new T.Vector3();
  private updateToolContact(c:Citizen){
    const job=c.job;
    if(c.stage!=='working'||!job||!['wood','stone'].includes(job.resource)){this.contacts.delete(c);return}
    const tool=job.resource==='wood'?c.axe:c.pickaxe;
    // Sample the visible tool head after the animated hand socket has been updated.
    c.root.updateWorldMatrix(true,true);
    this.contactPoint.set(job.resource==='wood'?.025:0,.12,job.resource==='stone'?.07:0);tool.localToWorld(this.contactPoint);
    const target=this.hooks.workPoint(job.source,job.tree).clone();target.y+=.18;
    const previous=this.contacts.get(c);
    const tips:T.Vector3[]=[];
    let distance=this.contactPoint.distanceTo(target);
    if(job.resource==='stone'){
      distance=Infinity;
      for(const z of [-.099,.099]){
        this.contactPoint.set(0,.124,z);tool.localToWorld(this.contactPoint);
        const tip=this.contactPoint.clone(),old=previous?.job===job?previous.tips?.[tips.length]:undefined;
        tips.push(tip);
        for(let step=0;step<=5;step++){
          this.contactPoint.copy(old??tip).lerp(tip,step/5);
          distance=Math.min(distance,this.hooks.contactDistance(job.source,job.tree,this.contactPoint));
        }
      }
    }
    if(!previous||previous.job!==job){this.contacts.set(c,{distance,approaching:false,lastHit:-99,job,tips});return}
    const change=distance-previous.distance;
    const cooldown=Math.max(.25,(c.visual?.workDuration(job.resource as 'wood'|'stone')??.59)*.5);
    const contact=job.resource==='stone'?distance<.025&&previous.distance>=.025:previous.approaching&&change>.0001;
    if(contact&&this.time-previous.lastHit>cooldown){
      this.hooks.impact(job.source,job.tree);previous.lastHit=this.time;previous.approaching=false;
    }
    if(change<-.0001)previous.approaching=true;
    previous.distance=distance;previous.tips=tips;
  }

  readonly root=new T.Group();
  private flights:Flight[]=[];
  private game:Game|null=null;private nav:Walkways|null=null;
  private citizens:Citizen[]=[];private time=0;private spawned=new Set<number>();private spawnClock=0;
  private buckets=new Map<string,Citizen[]>();
  private people=new PeopleLibrary();
  private frameTargets:ReturnType<Game['workTargets']>|null=null;
  constructor(scene:T.Scene,private hooks:VillageHooks,private overlay:HTMLElement){scene.add(this.root)}
  assignedTo(id:number){return this.citizens.filter(c=>c.job?.source===id).length}
  assignedCounts(){return Object.fromEntries(WORK_CATEGORIES.map(k=>[k,this.citizens.filter(c=>c.job?.category===k).length])) as Record<WorkCategory,number>}
  get working(){return this.citizens.filter(c=>c.job!==null).length}
  refreshNavigation(){this.nav?.invalidate()}
  rebalance(){
    if(!this.game)return;const targets=this.game.workTargets(),counts=this.assignedCounts();
    for(const c of [...this.citizens].reverse())if(c.job?.category&&!['to-store','to-pickup','picking','unloading'].includes(c.stage)&&counts[c.job.category]>targets[c.job.category]){counts[c.job.category]--;this.releaseJob(c)}
  }
  private releaseJob(c:Citizen){this.nav?.cancel(c.id);if(c.job)this.hooks.harvestProgress(c.job.source,c.id,0);c.job=null;c.unload=null;c.bundle.scale.setScalar(1);c.stage='idle';c.path=[];c.retry=.1;c.bundle.visible=false;c.line.visible=false;c.bobber.visible=false;c.fish.visible=false;c.axe.visible=false;c.pickaxe.visible=false;c.rod.visible=false;c.waitReason='';c.target=null}
  reset(game:Game){
    for(const c of this.citizens){c.visual?.dispose();c.status.remove();c.line.geometry.dispose();(c.line.material as T.Material).dispose();c.bobber.geometry.dispose();(c.bobber.material as T.Material).dispose()}
    this.flights=[];this.root.clear();this.citizens=[];this.spawned.clear();this.game=game;this.time=0;this.spawnClock=0;this.nav=new Walkways(game,id=>this.hooks.ready(id),id=>this.hooks.yaw(id),id=>this.hooks.obstacles(id));
  }
  private neighbors(x:number,z:number){const result:Citizen[]=[];const bx=Math.floor(x/.32),bz=Math.floor(z/.32);for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++)result.push(...(this.buckets.get(`${bx+a}:${bz+b}`)??[]));return result}
  private clear(c:Citizen,x:number,z:number){return this.neighbors(x,z).every(other=>other===c||Math.hypot(other.root.position.x-x,other.root.position.z-z)>.21)}
  private route(c:Citizen,to:number,end?:T.Vector3,strict=false){
    const p=position(to),yaw=this.hooks.yaw(to),target=end??new T.Vector3(p.x+Math.sin(yaw)*.65,LAND_Y,p.z+Math.cos(yaw)*.65);
    const path=this.nav!.path(c.root.position,target,(x,z)=>c.avoid.reduce((n,p)=>n+(Math.hypot(p.x-x,p.z-z)<.26?8:0),0),strict?.18:.65,c.id);
    if(!path?.length)return false;c.nodeMarker='';c.stuck=0;c.bestDistance=Infinity;c.path=path;c.target=new T.Vector3(path[path.length-1].x,LAND_Y,path[path.length-1].z);this.hooks.trail(path);return true;
  }
  private spawn(id:number,home:number){
    const p=position(home),yaw=this.hooks.yaw(home),sx=p.x+Math.sin(yaw)*.65,sz=p.z+Math.cos(yaw)*.65;
    const free=this.nav!.nearest(sx,sz,(x,z)=>this.citizens.every(c=>Math.hypot(c.root.position.x-x,c.root.position.z-z)>.23),1.1)??this.nav!.nearest(sx,sz,()=>true,1.1);if(!free)return;
    const root=new T.Group(),body=new T.Group();root.add(body);body.position.y=.16;
    box(body,[0x799c91,0xb58a70,0x9a9b72,0x7d91a3][id%4],0,.075,0,.115,.15,.075);
    ball(body,0xe2ba91,0,.20,0,.062);ball(body,[0x624b3c,0x94734f,0x4e483e][id%3],0,.228,-.012,.052);
    for(const x of [-.022,.022])ball(body,0x453e32,x,.205,.054,.006);
    // Facing +Z: local -X is the citizen's anatomical right hand.
    const arms=[-1,1].map(sign=>{const g=new T.Group();g.position.set(sign*.083,.125,0);body.add(g);box(g,0xdfb28b,0,-.065,0,.035,.13,.035);return g});
    const legs=[-1,1].map(sign=>{const g=new T.Group();g.position.set(sign*.035,.155,0);root.add(g);box(g,0x59655d,0,-.065,0,.044,.13,.045);box(g,0x665647,0,-.13,.018,.05,.035,.075);return g});
    const bundle=new T.Group();bundle.position.set(0,.235,.12);bundle.visible=false;root.add(bundle);
    const axe=new T.Group(),axeShape=new T.Group();axeShape.scale.setScalar(.62);axe.add(axeShape);box(axeShape,0x8b6947,0,.075,0,.022,.24,.022);box(axeShape,0x9faeaa,.025,.19,0,.09,.045,.025);arms[0].add(axe);axe.visible=false;
    const pickaxe=new T.Group();pickaxe.position.set(0,.125,.015);body.add(pickaxe);
    const pickaxeShape=new T.Group();pickaxeShape.scale.setScalar(.62);pickaxe.add(pickaxeShape);
    box(pickaxeShape,0x8b6947,0,.075,0,.023,.27,.023);
    const head=box(pickaxeShape,0xaeb7b2,0,.20,0,.028,.035,.16);
    for(const sign of [-1,1]){const tip=new T.Mesh(new T.ConeGeometry(.023,.095,4),head.material);tip.position.set(0,.20,sign*.112);tip.rotation.x=sign*Math.PI/2;pickaxeShape.add(tip)}
    pickaxe.visible=false;
    const rod=new T.Group();rod.position.set(0,-.12,0);box(rod,0x84684b,0,.28,0,.013,.58,.013);rod.rotation.x=1.0;arms[0].add(rod);rod.visible=false;
    const line=new T.Line(new T.BufferGeometry().setAttribute('position',new T.BufferAttribute(new Float32Array(36),3)),new T.LineBasicMaterial({color:0xe2e5d1,transparent:true,opacity:.8}));line.frustumCulled=false;line.visible=false;
    const floatGeometry=new T.SphereGeometry(.032,12,12).toNonIndexed(),floatColors:number[]=[];
    const floatPositions=floatGeometry.getAttribute('position');
    for(let i=0;i<floatPositions.count;i+=3){
      const y=(floatPositions.getY(i)+floatPositions.getY(i+1)+floatPositions.getY(i+2))/3;
      const tint=new T.Color(Math.floor((y+.032)/.016)%2===0?0xe45c50:0xfff5df);
      for(let j=0;j<3;j++)floatColors.push(tint.r,tint.g,tint.b);
    }
    floatGeometry.scale(.85,1.25,.85);floatGeometry.setAttribute('color',new T.Float32BufferAttribute(floatColors,3));
    const bobber=new T.Mesh(floatGeometry,new T.MeshStandardMaterial({vertexColors:true,roughness:.55}));bobber.visible=false;
    const fish=resourceUnitModel('fish');fish.visible=false;
    root.position.set(free.x,LAND_Y,free.z);root.rotation.y=yaw+Math.PI;
    const status=document.createElement('div');status.className='citizen-status';status.hidden=true;status.setAttribute('role','img');this.overlay.append(status);
    this.root.add(root,line,bobber,fish);this.spawned.add(id);
    const citizen:Citizen={visual:null,restUntil:0,id,root,body,arms,legs,bundle,axe,pickaxe,rod,line,bobber,fish,stage:'idle',unload:null,path:[],target:null,job:null,clock:0,retry:.6+(id%7)*.10,phase:id*1.73,birth:id===0?1:0,speed:0,walkPhase:0,wait:0,status,lastStatus:'',eatUntil:0,hungry:false,waitReason:'',searchUntil:0,stuck:0,bestDistance:Infinity,nodeMarker:'',avoid:[]};
    this.citizens.push(citizen);
    void this.people.ready.then(()=>{
      if(!this.citizens.includes(citizen))return;
      const visual=this.people.create(id);if(!visual)return;
      // Keep the original gesture pivots for tools and as a load-error fallback.
      for(const part of [body,...arms,...legs])for(const child of part.children)if((child as T.Mesh).isMesh)child.visible=false;
      citizen.visual=visual;root.add(visual.root);this.updateVisual(citizen);
    });
  }
  private updateVisual(c:Citizen){
    if(!c.visual)return;
    c.visual.setFishingClock(c.stage==='working'&&c.job?.category==='fish'?c.clock:null);
    c.visual.update(c.body,c.arms,c.legs,c.bundle.visible);
    c.visual.grip(c.axe,'axe');c.visual.grip(c.rod,'rod');c.visual.grip(c.pickaxe,'pickaxe');
  }
  private motionFor(c:Citizen):PersonMotion{
    if(c.path.length)return c.bundle.visible?'carry':'walk';
    if(c.bundle.visible||c.stage==='unloading'||c.stage==='to-store')return 'hold';
    if(c.stage==='picking')return 'pick';
    if(c.stage==='working'&&c.job){
      if(c.job.category==='fish')return 'fish_idle';
      if(c.job.resource==='wood')return 'wood';
      if(c.job.resource==='stone')return 'stone';
      return c.job.category==='farm'?'farm':'berry';
    }
    return 'idle';
  }
  private fishTiming(){return {launch:.7,land:1.35,pull:5.8,total:7.5}}

  private findJob(c:Citizen){
    if(this.nav!.waiting(c.id))return false;
    const g=this.game!,here=fromWorld(c.root.position.x,c.root.position.z),targets=this.frameTargets??g.workTargets(),counts=this.assignedCounts();
    const options=[...g.board.keys()].map(source=>({source,recipe:g.productAt(source),category:g.categoryFor(source)}))
      .filter(({source,recipe,category})=>recipe&&this.hooks.resourceReady(source)&&this.hooks.ready(source)&&(category?counts[category]<targets[category]:g.happy<70)&&this.assignedTo(source)<recipe.capacity)
      .sort((a,b)=>hexDistance(here,a.source)-hexDistance(here,b.source));
    for(const {source,recipe,category} of options){
      const store=g.storageFor(source).find(id=>this.hooks.ready(id)&&g.canStore(id,recipe!.resource));if(store===undefined)continue;
      let tree=(recipe!.resource==='wood'||recipe!.resource==='stone')?-1:c.id%2;
      if(category==='farm'||category==='berry'){tree=[0,1].find(slot=>!this.citizens.some(a=>a.job?.source===source&&a.job.tree===slot&&!['to-store','to-pickup','picking','unloading'].includes(a.stage)))??-1;if(tree<0)continue}
      if((recipe!.resource==='wood'||recipe!.resource==='stone'))for(let j=0;j<3;j++){const index=this.hooks.pickTree(source,(c.id+j)%3);if(index>=0&&!this.citizens.some(a=>a.job?.source===source&&a.job.tree===index&&!['to-store','to-pickup','picking','unloading'].includes(a.stage))){tree=index;break}}
      if((recipe!.resource==='wood'||recipe!.resource==='stone')&&tree<0)continue;
      const fishing=g.board.get(source)==='fisher'?this.hooks.fishingSpot(source):null;if(g.board.get(source)==='fisher'&&!fishing)continue;
      if(!this.route(c,source,fishing?.stand??this.hooks.workPoint(source,tree))){if(this.nav!.waiting(c.id))return false;continue}
      c.eatUntil=0;c.job={source,store,resource:recipe!.resource,amount:recipe!.amount,tree,category};c.stage='to-work';c.clock=0;return true;
    }
    return false;
  }
  private wander(c:Citizen){
    const here=fromWorld(c.root.position.x,c.root.position.z),choices=[here,...adjacent(here)].filter(id=>this.game!.board.has(id)&&this.hooks.ready(id));if(!choices.length)return;
    const tile=choices[Math.floor((Math.sin(this.time+c.phase)+1)*.499*choices.length)],p=position(tile),angle=this.time*.7+c.phase;
    this.route(c,tile,new T.Vector3(p.x+Math.sin(angle)*.70,LAND_Y,p.z+Math.cos(angle)*.70));
  }
  private move(c:Citizen,dt:number){
    if(!c.path.length){c.speed*=Math.exp(-10*dt);return false}
    const p=c.path[0];if(!this.nav!.free(p.x,p.z)){c.path=[];return false}
    const dx=p.x-c.root.position.x,dz=p.z-c.root.position.z,d=Math.hypot(dx,dz);
    if(d<.035){c.path.shift();c.nodeMarker='';return false}
    const marker=`${p.x}:${p.z}`;
    if(c.nodeMarker!==marker){c.nodeMarker=marker;c.bestDistance=d;c.stuck=0}
    else if(d<c.bestDistance-.035){c.bestDistance=d;c.stuck=0}else c.stuck+=dt;
    if(c.stuck>1.1){this.recover(c);return false}
    const target=Math.atan2(dx,dz),difference=T.MathUtils.euclideanModulo(target-c.root.rotation.y+Math.PI,Math.PI*2)-Math.PI;
    c.speed+=(((c.visual?.walkSpeed??.4)*(1+(c.id%4)*.025))*Math.max(.35,1-Math.abs(difference)/Math.PI*.65)-c.speed)*(1-Math.exp(-7*dt));
    const step=Math.min(d,c.speed*dt),ux=dx/d,uz=dz/d,origin={x:c.root.position.x,z:c.root.position.z};
    const dodge=Math.min(.06,dt*.8);
    const candidates=[{x:origin.x+ux*step,z:origin.z+uz*step},{x:origin.x+ux*step-uz*dodge,z:origin.z+uz*step+ux*dodge},{x:origin.x+ux*step+uz*dodge,z:origin.z+uz*step-ux*dodge},{x:origin.x-uz*dodge,z:origin.z+ux*dodge},{x:origin.x+uz*dodge,z:origin.z-ux*dodge}];
    const walkable=candidates.filter(n=>this.nav!.segment(origin,n));
    const next=walkable[0];
    if(!next){c.wait+=dt;c.speed*=.9;if(c.wait>.6)this.recover(c);return false}
    c.wait=0;c.root.position.x=next.x;c.root.position.z=next.z;c.root.rotation.y+=difference*(1-Math.exp(-15*dt));
    if(Math.hypot(p.x-next.x,p.z-next.z)<.035)c.path.shift();return true;
  }
  private recover(c:Citizen){
    this.nav!.invalidate();c.searchUntil=this.time+1.5;c.wait=0;c.stuck=0;
    if(c.path[0])c.avoid.push({x:c.path[0].x,z:c.path[0].z,until:this.time+4});
    c.path=[];
    if(c.stage==='to-store'){c.target=null;if(c.job)c.job.store=-1;c.retry=0;return}
    if(c.stage==='to-pickup'){c.target=null;c.retry=.2;return}
    if(c.job){const goal=c.job.category==='fish'?this.hooks.fishingSpot(c.job.source)?.stand:this.hooks.workPoint(c.job.source,c.job.tree);if(goal&&this.route(c,c.job.source,goal))return;c.retry=.5}
    else c.retry=.2;
  }
  private carry(c:Citizen){
    if(!c.job)return;c.bundle.clear();c.bundle.add(resourceModel(c.job.resource==='food'?(c.job.category==='fish'?'fish':c.job.category==='farm'?'wheat':'berry'):c.job.resource));
    c.bundle.visible=true;c.stage='to-store';c.path=[];c.target=null;c.retry=0;c.body.rotation.x=0;
  }
  private sendToStorage(c:Citizen){
    const job=c.job;if(!job)return;if(this.nav!.waiting(c.id)){c.retry=.12;return}const g=this.game!;if(job.resource==='happy'&&g.happy>=100){this.releaseJob(c);return}
    const covered=g.storageFor(job.source).filter(id=>this.hooks.ready(id));
    const stores=covered.filter(id=>g.canStore(id,job.resource));
    if(!stores.length){c.waitReason=covered.length?'full':'path';c.retry=.7;return}
    if(job.store>=0&&stores.includes(job.store)&&c.target&&Math.hypot(c.root.position.x-c.target.x,c.root.position.z-c.target.z)<.10&&Math.hypot(c.root.position.x-position(job.store).x,c.root.position.z-position(job.store).z)<1.05){
      c.stage='unloading';c.path=[];c.unload={store:job.store,clock:0,lastThrow:-1,inFlight:0,failed:false,total:job.amount};return;
    }
    const ordered=stores.sort((a,b)=>Math.hypot(c.root.position.x-position(a).x,c.root.position.z-position(a).z)-Math.hypot(c.root.position.x-position(b).x,c.root.position.z-position(b).z));
    for(const store of ordered){
      const p=position(store),yaw=this.hooks.yaw(store),angles=[0,Math.PI/3,-Math.PI/3,Math.PI/2,-Math.PI/2,Math.PI,2*Math.PI/3,-2*Math.PI/3];
      const doors=angles.map(a=>new T.Vector3(p.x+Math.sin(yaw+a)*.67,LAND_Y,p.z+Math.cos(yaw+a)*.67))
        .filter(d=>this.nav!.free(d.x,d.z))
        .sort((a,b)=>Number(this.clear(c,b.x,b.z))-Number(this.clear(c,a.x,a.z))||c.root.position.distanceTo(a)-c.root.position.distanceTo(b));
      for(const door of doors){if(this.route(c,store,door,true)){job.store=store;c.waitReason='';return}if(this.nav!.waiting(c.id)){c.retry=.12;return}}
    }
    c.waitReason='path';c.searchUntil=this.time+1.2;c.retry=.6;
  }
  private updateFlights(dt:number){
    this.flights=this.flights.filter(flight=>{
      const c=flight.owner,state=c.unload;
      if(c.job!==flight.job||!state){this.root.remove(flight.mesh);return false}
      flight.age+=dt;const t=Math.min(1,flight.age/flight.duration),smooth=t*t*(3-2*t);
      flight.mesh.position.copy(flight.from).lerp(flight.to,smooth);
      flight.mesh.position.y+=Math.sin(t*Math.PI)*(.18+flight.from.distanceTo(flight.to)*.18);
      flight.mesh.rotation.y=t*.8;flight.mesh.rotation.z=Math.sin(t*Math.PI)*.18;
      flight.mesh.scale.setScalar(flight.returning?.85*(.2+.8*smooth):.85*(t>.8?Math.max(.08,1-(t-.8)*4):1));
      if(t<1)return true;
      if(!flight.returning){
        const accepted=this.hooks.deliver(flight.job.source,flight.store,flight.job.resource,Math.min(1,flight.job.amount));
        if(accepted>0){flight.job.amount=Math.max(0,flight.job.amount-accepted)}
        else{
          state.failed=true;c.bundle.updateWorldMatrix(true,false);flight.from.copy(flight.mesh.position);c.bundle.getWorldPosition(flight.to);flight.age=0;flight.duration=.35;flight.returning=true;return true;
        }
      }
      state.inFlight--;this.root.remove(flight.mesh);return false;
    });
  }
  private unload(c:Citizen,dt:number){
    const state=c.unload,job=c.job;if(!state||!job)return;
    c.visual?.animate(dt,'hold',0);
    state.clock+=dt;c.root.position.y=LAND_Y;
    const p=position(state.store),dx=c.root.position.x-p.x,dz=c.root.position.z-p.z,length=Math.max(.01,Math.hypot(dx,dz));
    c.root.rotation.y=Math.atan2(-dx,-dz);
    if(!state.failed&&job.amount>state.inFlight&&state.clock-state.lastThrow>=.14&&this.flights.length<96){
      const kind=job.resource==='food'?(job.category==='fish'?'fish':job.category==='farm'?'wheat':'berry'):job.resource;
      const mesh=resourceUnitModel(kind);c.bundle.updateWorldMatrix(true,false);
      const from=c.bundle.getWorldPosition(new T.Vector3()),to=new T.Vector3(p.x+dx/length*.38,LAND_Y+.27,p.z+dz/length*.38);
      mesh.position.copy(from);mesh.scale.setScalar(.85);this.root.add(mesh);
      this.flights.push({mesh,owner:c,job,store:state.store,from,to,age:0,duration:.5,returning:false});state.inFlight++;state.lastThrow=state.clock;
    }
    const held=Math.max(0,job.amount-state.inFlight);c.bundle.visible=held>0;c.bundle.scale.setScalar(Math.max(.01,Math.cbrt(held/Math.max(1,state.total))));
    c.visual?.animate(dt,'pick',0);c.axe.visible=false;c.pickaxe.visible=false;c.rod.visible=false;
    const toss=Math.sin(Math.min(1,(state.clock-state.lastThrow)/.18)*Math.PI);
    c.arms.forEach(arm=>arm.rotation.x=-.8-toss*.55);c.legs.forEach(leg=>leg.rotation.x=0);c.body.rotation.x=.06*toss;this.updateVisual(c);
    if(state.inFlight===0&&(job.amount<=0||state.failed)){
      if(job.amount<=0){this.releaseJob(c);c.retry=.35}
      else{c.unload=null;c.bundle.scale.setScalar(1);c.bundle.visible=true;c.stage='to-store';c.target=null;job.store=-1;c.retry=.4}
    }
  }
  updateStatuses(camera:T.Camera,width:number,height:number,detailTile:number){
    const v=new T.Vector3();
    for(const c of this.citizens){
      if(detailTile<0||fromWorld(c.root.position.x,c.root.position.z)!==detailTile){c.status.hidden=true;continue}
      const eating=c.eatUntil>this.time&&!c.job&&!c.path.length,carrying=c.bundle.visible;
      const state=c.stage==='unloading'?'unload':eating?(c.hungry?'hungry':'eat'):carrying?(c.waitReason==='full'?'full':'carry'):c.job?(c.job.category??'garden'):'rest';
      const graphic=state==='unload'?'carry':state==='carry'?(c.job?.category??'garden'):state,key=`${state}:${graphic}`;
      if(key!==c.lastStatus){c.lastStatus=key;c.status.innerHTML=icon(graphic);c.status.dataset.state=state;const label=state==='carry'?`Depoya taşıyor · ${statusNames[graphic]??''}`:statusNames[state]??'Dinleniyor';c.status.setAttribute('aria-label',label);c.status.title=label}
      v.copy(c.root.position);v.y+=.58;v.project(camera);c.status.hidden=v.z< -1||v.z>1;c.status.style.left=`${(v.x+1)*width/2}px`;c.status.style.top=`${(1-v.y)*height/2}px`;const ortho=camera as T.OrthographicCamera,pixels=height/((ortho.top-ortho.bottom)/ortho.zoom),fade=T.MathUtils.smoothstep(pixels,42,100);
      c.status.style.opacity=String(c.birth*fade);c.status.style.setProperty('--status-scale',String(.35+.65*fade));c.status.hidden=c.status.hidden||fade<.01||detailTile<0||fromWorld(c.root.position.x,c.root.position.z)!==detailTile;
    }
  }
  private fishing(c:Citizen,dt:number){
    const spot=this.hooks.fishingSpot(c.job!.source);if(!spot)return;
    const t=c.clock,previous=t-dt,water=spot.water;
    c.root.rotation.y=Math.atan2(water.x-c.root.position.x,water.z-c.root.position.z);c.rod.visible=true;
    const timing=this.fishTiming(),cast=T.MathUtils.smoothstep(t,timing.launch,timing.land),pull=T.MathUtils.smoothstep(t,timing.pull,timing.total-.3);
    c.arms[0].rotation.x=t<.7?-.8-t*.5:t<1.35?-.95+cast*.9:t>5.8?-.1-pull*.9:-.1;
    c.arms[1].rotation.x=-.35;c.rod.rotation.x=.75;
    this.updateVisual(c);c.root.updateMatrixWorld(true);const tip=c.rod.localToWorld(new T.Vector3(0,.58,0)),hand=c.root.localToWorld(new T.Vector3(0,.24,.15));
    const end=new T.Vector3().lerpVectors(tip,water,cast);end.y+=Math.sin(cast*Math.PI)*.45;
    if(t>=timing.land){end.copy(water);end.y+=Math.sin(this.time*4)*.015}
    if(t>timing.pull){end.lerpVectors(water,hand,pull);end.y+=Math.sin(pull*Math.PI)*.38}
    c.bobber.visible=t>timing.launch&&t<timing.total-.25;c.bobber.position.copy(end);c.line.visible=c.bobber.visible;
    const positions=c.line.geometry.getAttribute('position');
    for(let i=0;i<12;i++){const f=i/11;positions.setXYZ(i,T.MathUtils.lerp(tip.x,end.x,f),T.MathUtils.lerp(tip.y,end.y,f)-Math.sin(f*Math.PI)*.06,T.MathUtils.lerp(tip.z,end.z,f))}positions.needsUpdate=true;
    c.fish.visible=t>timing.pull+.1&&t<timing.total-.3;c.fish.position.copy(end);c.fish.rotation.z=Math.sin(this.time*22)*.25;
    if(previous<timing.land&&t>=timing.land)this.hooks.splash(water.x,water.z);
    if(t>timing.land&&t<timing.pull&&Math.floor(t/.9)!==Math.floor(previous/.9))this.hooks.splash(water.x,water.z);
  }
  update(dt:number,navigationBudget=2){
    const g=this.game;if(!g||!this.nav)return;this.time+=dt;g.tick(dt);this.spawnClock-=dt;
    for(const event of g.takeMeals()){const c=this.citizens.find(c=>c.id===event.id);if(c){if(!c.job&&!c.path.length)c.eatUntil=this.time+1.5;c.hungry=!event.ate}}
    if(this.spawnClock<=0){for(const r of g.residents)if(!this.spawned.has(r.id)&&this.hooks.ready(r.home))this.spawn(r.id,r.home);this.spawnClock=.35}
    this.buckets.clear();for(const c of this.citizens){const k=`${Math.floor(c.root.position.x/.32)}:${Math.floor(c.root.position.z/.32)}`;if(!this.buckets.has(k))this.buckets.set(k,[]);this.buckets.get(k)!.push(c)}
    this.frameTargets=g.workTargets();
    this.nav.process(navigationBudget);
    this.updateFlights(dt);
    for(const c of this.citizens){
      c.avoid=c.avoid.filter(p=>p.until>this.time);
      c.birth=Math.min(1,c.birth+dt*2);c.root.scale.setScalar(Math.max(.01,c.birth*c.birth*(3-2*c.birth)));
      const current=fromWorld(c.root.position.x,c.root.position.z);
      if(!this.nav.free(c.root.position.x,c.root.position.z)){
        const home=position(g.residents[c.id]?.home??CENTER),p=this.nav.nearest(g.board.has(current)?c.root.position.x:home.x,g.board.has(current)?c.root.position.z:home.z,()=>true,1.2);
        if(p){
          const old=`${Math.floor(c.root.position.x/.32)}:${Math.floor(c.root.position.z/.32)}`,list=this.buckets.get(old);if(list){const i=list.indexOf(c);if(i>=0)list.splice(i,1)}
          c.root.position.x=p.x;c.root.position.z=p.z;c.path=[];const key=`${Math.floor(p.x/.32)}:${Math.floor(p.z/.32)}`;if(!this.buckets.has(key))this.buckets.set(key,[]);this.buckets.get(key)!.push(c);
        }else continue;
      }
      if(c.job&&!g.board.has(c.job.source))this.releaseJob(c);
      c.retry-=dt;
      if(c.stage==='unloading'){this.unload(c,dt);continue}
      if(c.eatUntil>this.time&&!c.job&&!c.path.length){c.visual?.animate(dt,'eat',0);c.axe.visible=false;c.pickaxe.visible=false;c.rod.visible=false;c.line.visible=false;c.bobber.visible=false;c.fish.visible=false;c.body.rotation.x=.06;c.arms[0].rotation.x=-1.9+Math.sin(this.time*7)*.12;c.arms[1].rotation.x=c.bundle.visible?-.8:-.2;c.legs.forEach(leg=>leg.rotation.x=0);this.updateVisual(c);continue}
      if(c.stage==='idle'&&c.retry<=0){
        c.retry=1.5+(c.id%7)*.10;
        const found=this.findJob(c),waiting=this.nav.waiting(c.id);if(waiting)c.retry=.12;
        if(!found&&!waiting&&!c.path.length&&this.time>=c.restUntil){
          if(c.visual?.hasAnimations&&Math.random()<.5)c.restUntil=this.time+10+Math.random()*8;
          else this.wander(c);
        }
      }
      let walking=false;
      const travel=()=>{
        const x=c.root.position.x,z=c.root.position.z;walking=this.move(c,dt);
        const distance=Math.hypot(c.root.position.x-x,c.root.position.z-z);c.walkPhase+=distance*Math.PI*2/.34;
        return dt>0?distance/dt:0;
      };
      if(c.visual?.animate(dt,this.motionFor(c),0,travel)){
        c.axe.visible=false;c.pickaxe.visible=false;c.rod.visible=false;c.line.visible=false;c.bobber.visible=false;c.fish.visible=false;
        c.root.position.y=LAND_Y;this.updateVisual(c);continue;
      }
      if(!c.visual)travel();
      if(c.stage==='to-work'&&!c.path.length&&c.job&&c.retry<=0){
        if(c.target&&Math.hypot(c.target.x-c.root.position.x,c.target.z-c.root.position.z)<.17){c.stage='working';c.clock=0}
        else{const goal=c.job.category==='fish'?this.hooks.fishingSpot(c.job.source)?.stand:this.hooks.workPoint(c.job.source,c.job.tree);if(!goal||!this.route(c,c.job.source,goal)){c.retry=.6;c.searchUntil=this.time+1}}
      }
      c.rod.visible=false;c.line.visible=false;c.bobber.visible=false;c.fish.visible=false;
      const working=c.stage==='working',mining=working&&c.job?.resource==='stone',wood=working&&(c.job?.resource==='wood'||c.job?.resource==='stone'),fishing=working&&c.job?.category==='fish',phase=c.walkPhase+c.phase;
      c.root.position.y=LAND_Y+(fishing?.035:0)+(c.visual?.hasAnimations?0:walking?Math.abs(Math.sin(phase))*.012:Math.sin(this.time*2+c.phase)*.002);
      c.body.rotation.x=working?(wood?.12:.45+Math.sin(c.clock*4)**2*.22):walking?.05:Math.sin(this.time*1.4+c.phase)*.02;
      const chop=(c.clock*1.7)%1,windup=T.MathUtils.smoothstep(chop,0,.60),strike=T.MathUtils.smoothstep(chop,.60,.76),recover=T.MathUtils.smoothstep(chop,.76,1);
      c.arms[0].rotation.x=wood?-.3-windup*1.9+strike*2.1-recover*.2:working?-.9:walking?Math.sin(phase)*.45:Math.sin(this.time*1.7+c.phase)*.08;
      c.arms[1].rotation.x=mining?c.arms[0].rotation.x:wood?-.25:working?-.9:walking?-Math.sin(phase)*.45:-Math.sin(this.time*1.7+c.phase)*.08;
      c.arms[0].rotation.z=mining?.45:0;c.arms[1].rotation.z=mining?-.45:0;
      const miningSwing=-.95-windup*1.95+strike*1.65+recover*.3;
      if(mining)c.arms.forEach(arm=>arm.rotation.x=miningSwing);
      c.pickaxe.rotation.x=mining?miningSwing:0;
      c.legs[0].rotation.x=walking?Math.sin(phase)*.55:0;c.legs[1].rotation.x=walking?-Math.sin(phase)*.55:0;c.axe.visible=!!wood&&c.job?.resource==='wood';c.pickaxe.visible=!!wood&&c.job?.resource==='stone';
      if(working&&c.job){
        if(fishing){const spot=this.hooks.fishingSpot(c.job.source);if(!spot||Math.hypot(c.root.position.x-spot.stand.x,c.root.position.z-spot.stand.z)>.22){c.clock=0;c.stage='to-work';c.path=[];c.target=null;c.retry=0;continue}}
        c.clock+=dt;
        const duration=fishing?this.fishTiming().total:wood?(c.job.resource==='stone'?6.8:6):harvestSeconds(c.job.category,c.job.amount);
        if(fishing){c.body.rotation.x=.05;this.fishing(c,dt)}
        else{const p=this.hooks.workPoint(c.job.source,c.job.tree);c.root.rotation.y=c.job.category==='farm'?this.hooks.yaw(c.job.source)+Math.PI:Math.atan2(p.x-.12-c.root.position.x,p.z-.15-c.root.position.z);this.hooks.harvestProgress(c.job.source,c.id,Math.min(1,c.clock/duration))}
        if(c.clock>=duration){
          if(this.hooks.harvest(c.job.source,c.job.resource,c.job.tree,c.id)){
            if(c.job.resource==='wood'){
              c.stage='to-pickup';c.path=[];c.target=null;c.retry=.9;
            }else this.carry(c);

          }else this.releaseJob(c);
          c.line.visible=false;c.bobber.visible=false;c.fish.visible=false;c.rod.visible=false;
        }
      }
      if(c.stage==='to-pickup'&&c.job&&!c.path.length&&c.retry<=0){
        const p=this.hooks.pickup(c.job.source,c.job.tree,false);
        if(!p){this.releaseJob(c);continue}
        if(c.target&&c.root.position.distanceTo(c.target)<.17){c.stage='picking';c.clock=0;c.root.rotation.y=Math.atan2(p.x-c.root.position.x,p.z-.23-c.root.position.z)}
        else if(!this.route(c,c.job.source,p,true))c.retry=.4;
      }
      if(c.stage==='picking'&&c.job){
        c.clock+=dt;c.body.rotation.x=Math.sin(Math.min(1,c.clock/.85)*Math.PI)*.85;c.arms.forEach(a=>a.rotation.x=-.8);
        if(c.clock>=.85){if(this.hooks.pickup(c.job.source,c.job.tree,true))this.carry(c);else{c.stage='to-pickup';c.retry=.25}}
      }
      if(c.stage==='to-store'&&c.job&&!c.path.length&&c.retry<=0)this.sendToStorage(c);
      if(c.bundle.visible)c.arms.forEach(arm=>arm.rotation.x=-.8);
      this.updateVisual(c);this.updateToolContact(c);
    }
  }
}

const statusNames:Record<string,string>={stone:'Taş çıkarıyor',wood:'Odun kesiyor',berry:'Çilek topluyor',farm:'Buğday biçiyor',fish:'Balık tutuyor',garden:'Çiçek topluyor',unload:'Depoya bırakıyor',carry:'Depoya taşıyor',full:'Depo dolu',rest:'Dinleniyor',eat:'Yemek yiyor',hungry:'Yiyecek yok',search:'Alternatif yol arıyor'};
