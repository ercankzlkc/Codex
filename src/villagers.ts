import * as T from 'three';
import {box,ball} from './models';
import {CENTER,position,fromWorld,adjacent} from './hex';
import {Game,hexDistance,type Resource} from './game';
import {LAND_Y} from './scenery';

type Waypoint={tile:number;x:number;z:number};
type Job={source:number;store:number;resource:Resource;amount:number;tree:number};
type Citizen={id:number;root:T.Group;body:T.Group;arms:T.Group[];legs:T.Group[];bundle:T.Mesh;axe:T.Group;stage:'idle'|'to-work'|'working'|'to-store';path:Waypoint[];job:Job|null;clock:number;retry:number;phase:number;birth:number};
export interface VillageHooks {
  ready(id:number):boolean;
  pickTree(id:number,preferred:number):number;
  workPoint(id:number,tree:number):T.Vector3;
  harvest(id:number,resource:Resource,tree:number):boolean;
  deliver(source:number,store:number,resource:Resource,amount:number):void;
}
/** Citizens own the actual harvest / carry / delivery cycle. No placement yield. */
export class Villagers {
  readonly root=new T.Group();
  private game:Game|null=null;
  private citizens:Citizen[]=[];
  private time=0;
  private spawned=new Set<number>();
  constructor(scene:T.Scene,private hooks:VillageHooks){scene.add(this.root)}
  assignedTo(id:number){return this.citizens.filter(c=>c.job?.source===id).length}
  get working(){return this.citizens.filter(c=>c.job!==null).length}
  reset(game:Game){for(const c of this.citizens){c.bundle.geometry.dispose();(c.bundle.material as T.Material).dispose()}this.root.clear();this.citizens=[];this.spawned.clear();this.game=game;this.time=0}
  private path(start:number,end:number):number[]|null{
    const board=this.game!.board;if(!board.has(start)||!board.has(end))return null;
    const queue=[start],parent=new Map<number,number>([[start,-1]]);
    for(let i=0;i<queue.length;i++){
      const current=queue[i];if(current===end){const path=[];for(let n=end;n!==-1;n=parent.get(n)!)path.push(n);return path.reverse()}
      for(const n of adjacent(current))if(board.has(n)&&!parent.has(n)&&this.hooks.ready(n)){parent.set(n,current);queue.push(n)}
    }
    return null;
  }
  private route(c:Citizen,to:number,end?:T.Vector3){
    const start=fromWorld(c.root.position.x,c.root.position.z),path=this.path(start,to);
    if(!path)return false;
    c.path=path.map(tile=>{const p=position(tile);return {tile,x:p.x+.42,z:p.z+.10}});
    if(end)c.path.push({tile:to,x:end.x,z:end.z});
    return true;
  }
  private spawn(id:number,home:number){
    const root=new T.Group(),body=new T.Group();root.add(body);body.position.y=.16;
    box(body,[0x799c91,0xb58a70,0x9a9b72,0x7d91a3][id%4],0,.075,0,.115,.15,.075);
    ball(body,0xe2ba91,0,.20,0,.062);ball(body,[0x624b3c,0x94734f,0x4e483e][id%3],0,.228,-.012,.052);
    const arms=[-1,1].map(sign=>{const g=new T.Group();g.position.set(sign*.083,.125,0);body.add(g);box(g,0xdfb28b,0,-.065,0,.035,.13,.035);return g});
    const legs=[-1,1].map(sign=>{const g=new T.Group();g.position.set(sign*.035,.155,0);root.add(g);box(g,0x59655d,0,-.065,0,.044,.13,.045);box(g,0x665647,0,-.13,.018,.05,.035,.075);return g});
    const bundle=new T.Mesh(new T.BoxGeometry(.11,.10,.09),new T.MeshStandardMaterial({color:0xac8655,roughness:1}));bundle.position.set(0,.235,.11);bundle.visible=false;root.add(bundle);
    const axe=new T.Group();box(axe,0x8b6947,0,-.13,.04,.022,.19,.022);box(axe,0x9faeaa,.025,-.19,.04,.09,.045,.025);arms[1].add(axe);axe.visible=false;
    const p=position(home);root.position.set(p.x+(id===0?.12:(id%4-1.5)*.09),LAND_Y,p.z+(id===0?.62:.58+(id%2)*.10));root.rotation.y=Math.PI;
    this.root.add(root);this.spawned.add(id);this.citizens.push({id,root,body,arms,legs,bundle,axe,stage:'idle',path:[],job:null,clock:0,retry:.8+(id%7)*.12,phase:id*1.73,birth:id===0?1:0});
  }
  private findJob(c:Citizen){
    const g=this.game!,here=fromWorld(c.root.position.x,c.root.position.z);
    const options=[...g.board.keys()].map(source=>({source,recipe:g.productAt(source)}))
      .filter(({source,recipe})=>recipe&&(recipe.resource!=='happy'||g.happy<100)&&this.hooks.ready(source)&&this.citizens.filter(a=>a.job?.source===source).length<recipe.capacity)
      .sort((a,b)=>hexDistance(here,a.source)-hexDistance(here,b.source)+(g.food<g.people*4?(a.recipe!.resource==='food'?-2:0)-(b.recipe!.resource==='food'?-2:0):0));
    for(const {source,recipe} of options){
      const store=g.storageFor(source).find(id=>this.hooks.ready(id)&&this.path(source,id)!==null);if(store===undefined)continue;
      const tree=recipe!.resource==='wood'?this.hooks.pickTree(source,c.id%3):-1;
      if(recipe!.resource==='wood'&&tree<0)continue;
      if(!this.route(c,source,this.hooks.workPoint(source,tree)))continue;
      c.job={source,store,resource:recipe!.resource,amount:recipe!.amount,tree};c.stage='to-work';c.clock=0;return true;
    }
    return false;
  }
  private wander(c:Citizen){
    const here=fromWorld(c.root.position.x,c.root.position.z);
    const choices=[here,...adjacent(here)].filter(id=>this.game!.board.has(id)&&this.hooks.ready(id));
    if(!choices.length)return;
    const tile=choices[Math.floor((Math.sin(this.time+c.phase)+1)*.499*choices.length)],p=position(tile);
    const angle=this.time*.7+c.phase;
    const end=new T.Vector3(p.x+Math.sin(angle)*.38,LAND_Y,p.z+.45+Math.cos(angle)*.1);
    this.route(c,tile,end);
  }
  private move(c:Citizen,dt:number){
    let left=dt*(.80+(c.id%4)*.045),walked=false;
    while(c.path.length&&left>0){
      const p=c.path[0];if(!this.game!.board.has(p.tile)||!this.hooks.ready(p.tile)){c.path=[];break}
      const dx=p.x-c.root.position.x,dz=p.z-c.root.position.z,d=Math.hypot(dx,dz);
      if(d<.025){c.path.shift();continue}
      const step=Math.min(left,d);c.root.position.x+=dx/d*step;c.root.position.z+=dz/d*step;left-=step;walked=true;
      const target=Math.atan2(dx,dz),difference=T.MathUtils.euclideanModulo(target-c.root.rotation.y+Math.PI,Math.PI*2)-Math.PI;
      c.root.rotation.y+=difference*(1-Math.exp(-14*dt));
      if(step>=d)c.path.shift();
    }
    return walked;
  }
  update(dt:number){
    const g=this.game;if(!g)return;this.time+=dt;
    for(const r of g.residents)if(!this.spawned.has(r.id)&&this.hooks.ready(r.home))this.spawn(r.id,r.home);
    for(const c of this.citizens){
      c.birth=Math.min(1,c.birth+dt*2);c.root.scale.setScalar(Math.max(.01,c.birth*c.birth*(3-2*c.birth)));
      const current=fromWorld(c.root.position.x,c.root.position.z);
      if(!g.board.has(current)){
        const home=g.residents[c.id]?.home??CENTER,p=position(home);c.root.position.set(p.x,LAND_Y,p.z+.5);c.path=[];c.job=null;c.stage='idle';c.bundle.visible=false;
      }
      if(c.job&&!g.board.has(c.job.source)){c.job=null;c.stage='idle';c.path=[];c.bundle.visible=false}
      c.retry-=dt;
      if(c.stage==='idle'&&c.retry<=0){
        c.retry=1.8+(c.id%3)*.3;
        if(!this.findJob(c)&&!c.path.length)this.wander(c);
      }
      let walking=this.move(c,dt);
      if(c.stage==='to-work'&&!c.path.length&&c.job){
        const target=this.hooks.workPoint(c.job.source,c.job.tree);
        if(Math.hypot(target.x-c.root.position.x,target.z-c.root.position.z)<.15){c.stage='working';c.clock=0}
        else if(!this.route(c,c.job.source,target)){c.job=null;c.stage='idle';c.retry=1}
      }
      if(c.stage==='working'&&c.job){
        c.clock+=dt;const wood=c.job.resource==='wood',duration=wood?2.5:2.1;
        const p=this.hooks.workPoint(c.job.source,c.job.tree);c.root.rotation.y=Math.atan2(p.x-.12-c.root.position.x,p.z-.16-c.root.position.z);
        if(c.clock>=duration){
          if(this.hooks.harvest(c.job.source,c.job.resource,c.job.tree)){
            c.bundle.visible=true;(c.bundle.material as T.MeshStandardMaterial).color.setHex(c.job.resource==='wood'?0xa5784f:c.job.resource==='food'?0xb76555:0xd4bd72);
            c.stage='to-store';c.path=[];c.retry=0;
          }else{c.stage='idle';c.job=null;c.retry=.6}
        }
      }
      if(c.stage==='to-store'&&c.job){
        if(!g.storageFor(c.job.source).includes(c.job.store)||!g.board.has(c.job.store)){c.path=[];c.job.store=-1}
        if(!c.path.length&&c.retry<=0){
          const store=g.storageFor(c.job.source).find(id=>this.hooks.ready(id)&&this.path(fromWorld(c.root.position.x,c.root.position.z),id)!==null);
          if(store===undefined){c.retry=1}
          else{
            c.job.store=store;const dest=position(store);
            if(Math.hypot(c.root.position.x-(dest.x+.42),c.root.position.z-(dest.z+.10))<.12){
              this.hooks.deliver(c.job.source,store,c.job.resource,c.job.amount);c.job=null;c.stage='idle';c.bundle.visible=false;c.retry=.5;
            }else this.route(c,store);
          }
        }
      }
      const working=c.stage==='working',wood=working&&c.job?.resource==='wood',phase=this.time*9+c.phase;
      c.root.position.y=LAND_Y+(walking?Math.abs(Math.sin(phase))*.014:Math.sin(this.time*2+c.phase)*.003);
      c.body.rotation.x=working?(wood?.12+Math.sin(c.clock*7)*.08:.45+.30*Math.sin(c.clock*4)**2):walking?.05:Math.sin(this.time*1.4+c.phase)*.025;
      c.arms[0].rotation.x=working?(wood?-.35:-.9):walking?Math.sin(phase)*.45:Math.sin(this.time*1.7+c.phase)*.08;
      c.arms[1].rotation.x=working?(wood?-1+Math.sin(c.clock*7)*.9:-.9):walking?-Math.sin(phase)*.45:-Math.sin(this.time*1.7+c.phase)*.08;
      if(c.bundle.visible)c.arms.forEach(arm=>arm.rotation.x=-.8);
      c.legs[0].rotation.x=walking?Math.sin(phase)*.55:0;c.legs[1].rotation.x=walking?-Math.sin(phase)*.55:0;
      c.axe.visible=!!wood;
    }
  }
}
