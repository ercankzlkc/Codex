import * as T from 'three';
import {icon} from './icons';
import {box,ball} from './models';
import {CENTER,position,fromWorld,adjacent} from './hex';
import {Game,hexDistance,WORK_CATEGORIES,type Resource,type WorkCategory} from './game';
import {LAND_Y,SEA_Y} from './scenery';
import {Walkways,type WalkPoint} from './navigation';
type Job={source:number;store:number;resource:Resource;amount:number;tree:number;category:WorkCategory|null};
type Citizen={id:number;root:T.Group;body:T.Group;arms:T.Group[];legs:T.Group[];bundle:T.Mesh;axe:T.Group;pickaxe:T.Group;rod:T.Group;line:T.Line;bobber:T.Mesh;fish:T.Group;stage:'idle'|'to-work'|'working'|'to-store';path:WalkPoint[];target:T.Vector3|null;job:Job|null;clock:number;retry:number;phase:number;birth:number;speed:number;wait:number;status:HTMLElement;lastStatus:string;eatUntil:number;hungry:boolean;waitReason:string;searchUntil:number;stuck:number;bestDistance:number;nodeMarker:string;avoid:{x:number;z:number;until:number}[]};
export interface VillageHooks {
  ready(id:number):boolean;yaw(id:number):number;resourceReady(id:number):boolean;
  pickTree(id:number,preferred:number):number;workPoint(id:number,tree:number):T.Vector3;
  harvest(id:number,resource:Resource,tree:number,actor:number):boolean;
  harvestProgress(id:number,actor:number,progress:number):void;
  fishingSpot(id:number):{stand:T.Vector3;water:T.Vector3}|null;
  impact(id:number,index:number):void;splash(x:number,z:number):void;trail(points:WalkPoint[]):void;
  deliver(source:number,store:number,resource:Resource,amount:number):number;
}
export class Villagers {
  readonly root=new T.Group();
  private game:Game|null=null;private nav:Walkways|null=null;
  private citizens:Citizen[]=[];private time=0;private spawned=new Set<number>();private spawnClock=0;
  private buckets=new Map<string,Citizen[]>();
  constructor(scene:T.Scene,private hooks:VillageHooks,private overlay:HTMLElement){scene.add(this.root)}
  assignedTo(id:number){return this.citizens.filter(c=>c.job?.source===id).length}
  assignedCounts(){return Object.fromEntries(WORK_CATEGORIES.map(k=>[k,this.citizens.filter(c=>c.job?.category===k).length])) as Record<WorkCategory,number>}
  get working(){return this.citizens.filter(c=>c.job!==null).length}
  refreshNavigation(){this.nav?.invalidate()}
  rebalance(){
    if(!this.game)return;const targets=this.game.workTargets(),counts=this.assignedCounts();
    for(const c of [...this.citizens].reverse())if(c.job?.category&&c.stage!=='to-store'&&counts[c.job.category]>targets[c.job.category]){counts[c.job.category]--;this.releaseJob(c)}
  }
  private releaseJob(c:Citizen){if(c.job)this.hooks.harvestProgress(c.job.source,c.id,0);c.job=null;c.stage='idle';c.path=[];c.retry=.1;c.bundle.visible=false;c.line.visible=false;c.bobber.visible=false;c.fish.visible=false;c.axe.visible=false;c.pickaxe.visible=false;c.rod.visible=false;c.waitReason='';c.target=null}
  reset(game:Game){
    for(const c of this.citizens){c.status.remove();c.bundle.geometry.dispose();(c.bundle.material as T.Material).dispose();c.line.geometry.dispose();(c.line.material as T.Material).dispose();c.bobber.geometry.dispose();(c.bobber.material as T.Material).dispose()}
    this.root.clear();this.citizens=[];this.spawned.clear();this.game=game;this.time=0;this.spawnClock=0;this.nav=new Walkways(game,id=>this.hooks.ready(id),id=>this.hooks.yaw(id));
  }
  private neighbors(x:number,z:number){const result:Citizen[]=[];const bx=Math.floor(x/.32),bz=Math.floor(z/.32);for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++)result.push(...(this.buckets.get(`${bx+a}:${bz+b}`)??[]));return result}
  private clear(c:Citizen,x:number,z:number){return this.neighbors(x,z).every(other=>other===c||Math.hypot(other.root.position.x-x,other.root.position.z-z)>.21)}
  private route(c:Citizen,to:number,end?:T.Vector3,strict=false){
    const p=position(to),yaw=this.hooks.yaw(to),target=end??new T.Vector3(p.x+Math.sin(yaw)*.65,LAND_Y,p.z+Math.cos(yaw)*.65);
    const path=this.nav!.path(c.root.position,target,(x,z)=>this.neighbors(x,z).reduce((n,a)=>n+(a!==c&&Math.hypot(a.root.position.x-x,a.root.position.z-z)<.32?4:0),0)+c.avoid.reduce((n,p)=>n+(Math.hypot(p.x-x,p.z-z)<.26?8:0),0),strict?.18:.65);
    if(!path?.length)return false;c.nodeMarker='';c.stuck=0;c.bestDistance=Infinity;c.path=path;c.target=new T.Vector3(path[path.length-1].x,LAND_Y,path[path.length-1].z);this.hooks.trail(path);return true;
  }
  private spawn(id:number,home:number){
    const p=position(home),yaw=this.hooks.yaw(home),free=this.nav!.nearest(p.x+Math.sin(yaw)*.65,p.z+Math.cos(yaw)*.65,(x,z)=>this.citizens.every(c=>Math.hypot(c.root.position.x-x,c.root.position.z-z)>.23),1.1);if(!free)return;
    const root=new T.Group(),body=new T.Group();root.add(body);body.position.y=.16;
    box(body,[0x799c91,0xb58a70,0x9a9b72,0x7d91a3][id%4],0,.075,0,.115,.15,.075);
    ball(body,0xe2ba91,0,.20,0,.062);ball(body,[0x624b3c,0x94734f,0x4e483e][id%3],0,.228,-.012,.052);
    for(const x of [-.022,.022])ball(body,0x453e32,x,.205,.054,.006);
    // Facing +Z: local -X is the citizen's anatomical right hand.
    const arms=[-1,1].map(sign=>{const g=new T.Group();g.position.set(sign*.083,.125,0);body.add(g);box(g,0xdfb28b,0,-.065,0,.035,.13,.035);return g});
    const legs=[-1,1].map(sign=>{const g=new T.Group();g.position.set(sign*.035,.155,0);root.add(g);box(g,0x59655d,0,-.065,0,.044,.13,.045);box(g,0x665647,0,-.13,.018,.05,.035,.075);return g});
    const bundle=new T.Mesh(new T.BoxGeometry(.11,.10,.09),new T.MeshStandardMaterial({color:0xac8655,roughness:1}));bundle.position.set(0,.235,.11);bundle.visible=false;root.add(bundle);
    const axe=new T.Group();box(axe,0x8b6947,0,-.13,.04,.022,.19,.022);box(axe,0x9faeaa,.025,-.19,.04,.09,.045,.025);arms[0].add(axe);axe.visible=false;
    const pickaxe=new T.Group();box(pickaxe,0x8b6947,0,-.13,.04,.022,.22,.022);const pickHead=box(pickaxe,0xaeb7b2,0,-.23,.04,.17,.025,.027);pickHead.rotation.z=.16;arms[0].add(pickaxe);pickaxe.visible=false;
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
    const fish=new T.Group(),belly=ball(fish,0x94babb,0,0,0,.055);belly.scale.set(.55,.7,1.6);const tail=partFishTail();fish.add(tail);fish.visible=false;
    root.position.set(free.x,LAND_Y,free.z);root.rotation.y=yaw+Math.PI;
    const status=document.createElement('div');status.className='citizen-status';status.setAttribute('role','img');this.overlay.append(status);
    this.root.add(root,line,bobber,fish);this.spawned.add(id);this.citizens.push({id,root,body,arms,legs,bundle,axe,pickaxe,rod,line,bobber,fish,stage:'idle',path:[],target:null,job:null,clock:0,retry:.6+(id%7)*.10,phase:id*1.73,birth:id===0?1:0,speed:0,wait:0,status,lastStatus:'',eatUntil:0,hungry:false,waitReason:'',searchUntil:0,stuck:0,bestDistance:Infinity,nodeMarker:'',avoid:[]});
  }
  private findJob(c:Citizen){
    const g=this.game!,here=fromWorld(c.root.position.x,c.root.position.z),targets=g.workTargets(),counts=this.assignedCounts();
    const options=[...g.board.keys()].map(source=>({source,recipe:g.productAt(source),category:g.categoryFor(source)}))
      .filter(({source,recipe,category})=>recipe&&this.hooks.resourceReady(source)&&this.hooks.ready(source)&&(category?counts[category]<targets[category]:g.happy<70)&&this.assignedTo(source)<recipe.capacity)
      .sort((a,b)=>hexDistance(here,a.source)-hexDistance(here,b.source));
    for(const {source,recipe,category} of options){
      const store=g.storageFor(source).find(id=>this.hooks.ready(id)&&g.canStore(id,recipe!.resource));if(store===undefined)continue;
      let tree=(recipe!.resource==='wood'||recipe!.resource==='stone')?-1:c.id%2;
      if(category==='farm'||category==='berry'){tree=[0,1].find(slot=>!this.citizens.some(a=>a.job?.source===source&&a.job.tree===slot&&a.stage!=='to-store'))??-1;if(tree<0)continue}
      if((recipe!.resource==='wood'||recipe!.resource==='stone'))for(let j=0;j<3;j++){const index=this.hooks.pickTree(source,(c.id+j)%3);if(index>=0&&!this.citizens.some(a=>a.job?.source===source&&a.job.tree===index&&a.stage!=='to-store')){tree=index;break}}
      if((recipe!.resource==='wood'||recipe!.resource==='stone')&&tree<0)continue;
      const fishing=g.board.get(source)==='fisher'?this.hooks.fishingSpot(source):null;if(g.board.get(source)==='fisher'&&!fishing)continue;
      if(!this.route(c,source,fishing?.stand??this.hooks.workPoint(source,tree)))continue;
      c.job={source,store,resource:recipe!.resource,amount:recipe!.amount,tree,category};c.stage='to-work';c.clock=0;return true;
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
    c.speed+=((.82+(c.id%4)*.025)*Math.max(.35,1-Math.abs(difference)/Math.PI*.65)-c.speed)*(1-Math.exp(-7*dt));
    const step=Math.min(d,c.speed*dt),ux=dx/d,uz=dz/d,origin={x:c.root.position.x,z:c.root.position.z};
    const dodge=Math.min(.06,dt*.8);
    const candidates=[{x:origin.x+ux*step,z:origin.z+uz*step},{x:origin.x+ux*step-uz*dodge,z:origin.z+uz*step+ux*dodge},{x:origin.x+ux*step+uz*dodge,z:origin.z+uz*step-ux*dodge},{x:origin.x-uz*dodge,z:origin.z+ux*dodge},{x:origin.x+uz*dodge,z:origin.z-ux*dodge}];
    const next=candidates.find(n=>this.clear(c,n.x,n.z)&&this.nav!.segment(origin,n));
    if(!next){c.wait+=dt;c.speed*=.8;if(c.wait>.6)this.recover(c);return false}
    c.wait=0;c.root.position.x=next.x;c.root.position.z=next.z;c.root.rotation.y+=difference*(1-Math.exp(-15*dt));
    if(Math.hypot(p.x-next.x,p.z-next.z)<.035)c.path.shift();return true;
  }
  private recover(c:Citizen){
    this.nav!.invalidate();c.searchUntil=this.time+1.5;c.wait=0;c.stuck=0;
    if(c.path[0])c.avoid.push({x:c.path[0].x,z:c.path[0].z,until:this.time+4});
    c.path=[];
    if(c.stage==='to-store'){c.target=null;if(c.job)c.job.store=-1;c.retry=0;return}
    if(c.job){const goal=c.job.category==='fish'?this.hooks.fishingSpot(c.job.source)?.stand:this.hooks.workPoint(c.job.source,c.job.tree);if(goal&&this.route(c,c.job.source,goal))return;c.retry=.5}
    else c.retry=.2;
  }
  private sendToStorage(c:Citizen){
    const job=c.job;if(!job)return;const g=this.game!;if(job.resource==='happy'&&g.happy>=100){this.releaseJob(c);return}
    const covered=g.storageFor(job.source).filter(id=>this.hooks.ready(id));
    const stores=covered.filter(id=>g.canStore(id,job.resource));
    if(!stores.length){c.waitReason=covered.length?'full':'path';c.retry=.7;return}
    if(job.store>=0&&stores.includes(job.store)&&c.target&&Math.hypot(c.root.position.x-c.target.x,c.root.position.z-c.target.z)<.10&&Math.hypot(c.root.position.x-position(job.store).x,c.root.position.z-position(job.store).z)<1.05){
      const delivered=this.hooks.deliver(job.source,job.store,job.resource,job.amount);job.amount-=delivered;
      if(job.amount<=0){this.releaseJob(c);c.retry=.35;return}
      c.target=null;job.store=-1;c.retry=.1;return;
    }
    const ordered=stores.sort((a,b)=>Math.hypot(c.root.position.x-position(a).x,c.root.position.z-position(a).z)-Math.hypot(c.root.position.x-position(b).x,c.root.position.z-position(b).z));
    for(const store of ordered){
      const p=position(store),yaw=this.hooks.yaw(store),angles=[0,Math.PI/3,-Math.PI/3,Math.PI/2,-Math.PI/2,Math.PI,2*Math.PI/3,-2*Math.PI/3];
      const doors=angles.map(a=>new T.Vector3(p.x+Math.sin(yaw+a)*.67,LAND_Y,p.z+Math.cos(yaw+a)*.67))
        .filter(d=>this.nav!.free(d.x,d.z)&&this.clear(c,d.x,d.z))
        .sort((a,b)=>c.root.position.distanceTo(a)-c.root.position.distanceTo(b));
      for(const door of doors)if(this.route(c,store,door,true)){job.store=store;c.waitReason='';return}
    }
    c.waitReason='path';c.searchUntil=this.time+1.2;c.retry=.6;
  }
  updateStatuses(camera:T.Camera,width:number,height:number){
    const v=new T.Vector3();
    for(const c of this.citizens){
      const eating=c.eatUntil>this.time,carrying=c.bundle.visible;
      const state=eating?(c.hungry?'hungry':'eat'):carrying?(c.waitReason==='full'?'full':'carry'):c.job?(c.job.category??'garden'):'rest';
      const graphic=state==='carry'?(c.job?.category??'garden'):state,key=`${state}:${graphic}`;
      if(key!==c.lastStatus){c.lastStatus=key;c.status.innerHTML=icon(graphic);c.status.dataset.state=state;const label=state==='carry'?`Depoya taşıyor · ${statusNames[graphic]??''}`:statusNames[state]??'Dinleniyor';c.status.setAttribute('aria-label',label);c.status.title=label}
      v.copy(c.root.position);v.y+=.58;v.project(camera);c.status.hidden=v.z< -1||v.z>1;c.status.style.left=`${(v.x+1)*width/2}px`;c.status.style.top=`${(1-v.y)*height/2}px`;const ortho=camera as T.OrthographicCamera,pixels=height/((ortho.top-ortho.bottom)/ortho.zoom),fade=T.MathUtils.smoothstep(pixels,42,100);
      c.status.style.opacity=String(c.birth*fade);c.status.style.setProperty('--status-scale',String(.35+.65*fade));c.status.hidden=c.status.hidden||fade<.01;
    }
  }
  private fishing(c:Citizen,dt:number){
    const spot=this.hooks.fishingSpot(c.job!.source);if(!spot)return;
    const t=c.clock,previous=t-dt,water=spot.water;
    c.root.rotation.y=Math.atan2(water.x-c.root.position.x,water.z-c.root.position.z);c.rod.visible=true;
    const cast=T.MathUtils.smoothstep(t,.7,1.35),pull=T.MathUtils.smoothstep(t,5.8,7.2);
    c.arms[0].rotation.x=t<.7?-.8-t*.5:t<1.35?-.95+cast*.9:t>5.8?-.1-pull*.9:-.1;
    c.arms[1].rotation.x=-.35;c.rod.rotation.x=.75;
    c.root.updateMatrixWorld(true);const tip=c.rod.localToWorld(new T.Vector3(0,.58,0)),hand=c.root.localToWorld(new T.Vector3(0,.24,.15));
    const end=new T.Vector3().lerpVectors(tip,water,cast);end.y+=Math.sin(cast*Math.PI)*.45;
    if(t>=1.35){end.copy(water);end.y+=Math.sin(this.time*4)*.015}
    if(t>5.8){end.lerpVectors(water,hand,pull);end.y+=Math.sin(pull*Math.PI)*.38}
    c.bobber.visible=t>.7&&t<7.25;c.bobber.position.copy(end);c.line.visible=c.bobber.visible;
    const positions=c.line.geometry.getAttribute('position');
    for(let i=0;i<12;i++){const f=i/11;positions.setXYZ(i,T.MathUtils.lerp(tip.x,end.x,f),T.MathUtils.lerp(tip.y,end.y,f)-Math.sin(f*Math.PI)*.06,T.MathUtils.lerp(tip.z,end.z,f))}positions.needsUpdate=true;
    c.fish.visible=t>5.9&&t<7.2;c.fish.position.copy(end);c.fish.rotation.z=Math.sin(this.time*22)*.25;
    if(previous<1.35&&t>=1.35)this.hooks.splash(water.x,water.z);
    if(t>1.35&&t<5.8&&Math.floor(t/.9)!==Math.floor(previous/.9))this.hooks.splash(water.x,water.z);
  }
  update(dt:number){
    const g=this.game;if(!g||!this.nav)return;this.time+=dt;g.tick(dt);this.spawnClock-=dt;
    for(const event of g.takeMeals()){const c=this.citizens.find(c=>c.id===event.id);if(c){c.eatUntil=this.time+1.5;c.hungry=!event.ate}}
    if(this.spawnClock<=0){for(const r of g.residents)if(!this.spawned.has(r.id)&&this.hooks.ready(r.home))this.spawn(r.id,r.home);this.spawnClock=.35}
    this.buckets.clear();for(const c of this.citizens){const k=`${Math.floor(c.root.position.x/.32)}:${Math.floor(c.root.position.z/.32)}`;if(!this.buckets.has(k))this.buckets.set(k,[]);this.buckets.get(k)!.push(c)}
    for(const c of this.citizens){
      c.avoid=c.avoid.filter(p=>p.until>this.time);
      c.birth=Math.min(1,c.birth+dt*2);c.root.scale.setScalar(Math.max(.01,c.birth*c.birth*(3-2*c.birth)));
      const current=fromWorld(c.root.position.x,c.root.position.z);
      if(!this.nav.free(c.root.position.x,c.root.position.z)){
        const home=position(g.residents[c.id]?.home??CENTER),p=this.nav.nearest(g.board.has(current)?c.root.position.x:home.x,g.board.has(current)?c.root.position.z:home.z,(x,z)=>this.citizens.every(a=>a===c||Math.hypot(a.root.position.x-x,a.root.position.z-z)>.23),1.2);
        if(p){
          const old=`${Math.floor(c.root.position.x/.32)}:${Math.floor(c.root.position.z/.32)}`,list=this.buckets.get(old);if(list){const i=list.indexOf(c);if(i>=0)list.splice(i,1)}
          c.root.position.x=p.x;c.root.position.z=p.z;c.path=[];const key=`${Math.floor(p.x/.32)}:${Math.floor(p.z/.32)}`;if(!this.buckets.has(key))this.buckets.set(key,[]);this.buckets.get(key)!.push(c);
        }else continue;
      }
      if(c.job&&!g.board.has(c.job.source))this.releaseJob(c);
      c.retry-=dt;
      if(c.eatUntil>this.time){c.axe.visible=false;c.pickaxe.visible=false;c.rod.visible=false;c.line.visible=false;c.bobber.visible=false;c.fish.visible=false;c.body.rotation.x=.06;c.arms[0].rotation.x=-1.9+Math.sin(this.time*7)*.12;c.arms[1].rotation.x=c.bundle.visible?-.8:-.2;c.legs.forEach(leg=>leg.rotation.x=0);continue}
      if(c.stage==='idle'&&c.retry<=0){c.retry=1.5+(c.id%3)*.2;if(!this.findJob(c)&&!c.path.length)this.wander(c)}
      const walking=this.move(c,dt);
      if(c.stage==='to-work'&&!c.path.length&&c.job&&c.retry<=0){
        if(c.target&&Math.hypot(c.target.x-c.root.position.x,c.target.z-c.root.position.z)<.17){c.stage='working';c.clock=0}
        else{const goal=c.job.category==='fish'?this.hooks.fishingSpot(c.job.source)?.stand:this.hooks.workPoint(c.job.source,c.job.tree);if(!goal||!this.route(c,c.job.source,goal)){c.retry=.6;c.searchUntil=this.time+1}}
      }
      c.rod.visible=false;c.line.visible=false;c.bobber.visible=false;c.fish.visible=false;
      const working=c.stage==='working',wood=working&&(c.job?.resource==='wood'||c.job?.resource==='stone'),fishing=working&&c.job?.category==='fish',phase=this.time*9+c.phase;
      c.root.position.y=LAND_Y+(fishing?.035:0)+(walking?Math.abs(Math.sin(phase))*.012:Math.sin(this.time*2+c.phase)*.002);
      c.body.rotation.x=working?(wood?.12:.45+Math.sin(c.clock*4)**2*.22):walking?.05:Math.sin(this.time*1.4+c.phase)*.02;
      const chop=(c.clock*1.7)%1,windup=T.MathUtils.smoothstep(chop,0,.60),strike=T.MathUtils.smoothstep(chop,.60,.76),recover=T.MathUtils.smoothstep(chop,.76,1);
      c.arms[0].rotation.x=wood?-.3-windup*1.9+strike*2.1-recover*.2:working?-.9:walking?Math.sin(phase)*.45:Math.sin(this.time*1.7+c.phase)*.08;
      c.arms[1].rotation.x=wood?-.25:working?-.9:walking?-Math.sin(phase)*.45:-Math.sin(this.time*1.7+c.phase)*.08;
      c.legs[0].rotation.x=walking?Math.sin(phase)*.55:0;c.legs[1].rotation.x=walking?-Math.sin(phase)*.55:0;c.axe.visible=!!wood&&c.job?.resource==='wood';c.pickaxe.visible=!!wood&&c.job?.resource==='stone';
      if(working&&c.job){
        if(fishing){const spot=this.hooks.fishingSpot(c.job.source);if(!spot||Math.hypot(c.root.position.x-spot.stand.x,c.root.position.z-spot.stand.z)>.22){c.clock=0;c.stage='to-work';c.path=[];c.target=null;c.retry=0;continue}}
        c.clock+=dt;
        if(wood&&c.clock>.3&&Math.floor(c.clock*1.7-.72)!==Math.floor((c.clock-dt)*1.7-.72))this.hooks.impact(c.job.source,c.job.tree);
        const duration=fishing?7.5:wood?(c.job.resource==='stone'?6.8:6):2.4;
        if(fishing){c.body.rotation.x=.05;this.fishing(c,dt)}
        else{const p=this.hooks.workPoint(c.job.source,c.job.tree);c.root.rotation.y=Math.atan2(p.x-.12-c.root.position.x,p.z-.15-c.root.position.z);this.hooks.harvestProgress(c.job.source,c.id,Math.min(1,c.clock/duration))}
        if(c.clock>=duration){
          if(this.hooks.harvest(c.job.source,c.job.resource,c.job.tree,c.id)){
            c.bundle.visible=true;(c.bundle.material as T.MeshStandardMaterial).color.setHex(c.job.category==='fish'?0x8aafbb:c.job.category==='farm'?0xd7b85e:c.job.resource==='stone'?0x96a29c:c.job.resource==='wood'?0xa5784f:0xb76555);c.stage='to-store';c.path=[];c.retry=0;
          }else this.releaseJob(c);
          c.line.visible=false;c.bobber.visible=false;c.fish.visible=false;c.rod.visible=false;
        }
      }
      if(c.stage==='to-store'&&c.job&&!c.path.length&&c.retry<=0)this.sendToStorage(c);
      if(c.bundle.visible)c.arms.forEach(arm=>arm.rotation.x=-.8);
    }
  }
}
function partFishTail(){const mesh=new T.Mesh(new T.ConeGeometry(.05,.065,3),new T.MeshStandardMaterial({color:0x739b9c,roughness:.7}));mesh.position.z=-.09;mesh.rotation.x=Math.PI/2;return mesh}

const statusNames:Record<string,string>={stone:'Taş çıkarıyor',wood:'Odun kesiyor',berry:'Çilek topluyor',farm:'Buğday biçiyor',fish:'Balık tutuyor',garden:'Çiçek topluyor',carry:'Depoya taşıyor',full:'Depo dolu',rest:'Dinleniyor',eat:'Yemek yiyor',hungry:'Yiyecek yok',search:'Alternatif yol arıyor'};
