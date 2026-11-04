import {Game,BUILDING_SCALE} from './game';
import {CENTER,fromWorld,position,adjacent} from './hex';
export type WalkPoint={tile:number;x:number;z:number};
/** Sampled land navigation with padded footprints; paths never cut a building corner. */
export class Walkways {
  private cache=new Map<string,boolean>();
  readonly step=.10;
  constructor(private game:Game,private ready:(id:number)=>boolean,private yaw:(id:number)=>number,private obstacles:(id:number)=>{x:number;z:number;r:number}[]=()=>[]){}
  invalidate(){this.cache.clear()}
  free(x:number,z:number){
    // A narrow walkable strip reaches the outer end of each coastal pier.
    for(const [cell,k] of this.game.board)if(k==='fisher'&&this.ready(cell)){
      const p=position(cell),a=this.yaw(cell),dx=x-p.x,dz=z-p.z;
      const lx=dx*Math.cos(a)-dz*Math.sin(a),lz=dx*Math.sin(a)+dz*Math.cos(a);
      if(Math.abs(lx)<.13&&lz>.10&&lz<1.04)return true;
    }
    const id=fromWorld(x,z),kind=this.game.board.get(id);if(!kind||!this.ready(id))return false;
    const p=position(id),px=x-p.x,pz=z-p.z;
    for(let i=0;i<6;i++)if(!this.game.board.has(adjacent(id)[i])&&px*Math.cos(i*Math.PI/3)+pz*Math.sin(i*Math.PI/3)>.70)return false;
    const angle=this.yaw(id),c=Math.cos(angle),s=Math.sin(angle),lx=px*c-pz*s,lz=px*s+pz*c;
    const rect=(x0:number,x1:number,z0:number,z1:number,scale=BUILDING_SCALE)=>lx>x0*scale-.075&&lx<x1*scale+.075&&lz>z0*scale-.075&&lz<z1*scale+.075;
    if(kind==='house'||kind==='manor'||kind==='store'||kind==='lumber'){
      const w=kind==='manor'?.54:.43;
      if(rect(-w,w,-.39,.58))return false;
      if(kind==='store'&&(rect(-.51,-.25,.26,.59)||rect(.25,.51,.26,.59)))return false;
      // The centre tower projects behind the main house.
      if(id===CENTER&&rect(-.60,-.1,-.48,.04))return false;
    }else if(kind==='harbor'){if(rect(-.49,.01,-.46,-.02)||rect(.2,.42,-.32,.23))return false}
    else if(kind==='fisher'){if(rect(-.34,.34,-.57,.16))return false}
    else if(kind==='berry'){if(rect(-.50,.50,-.57,.40,.75))return false}
    else if(kind==='farm'){if(lx<-.31&&lx>-.45&&lz>-.5&&lz<.42)return false}
    else if(kind==='garden'){if(Math.hypot(lx,lz)<.44)return false}
    else if(kind==='forest'||kind==='stone')for(const o of this.obstacles(id))if(Math.hypot(x-o.x,z-o.z)<o.r)return false;
    return true;
  }
  segment(a:{x:number;z:number},b:{x:number;z:number}){
    const n=Math.max(1,Math.ceil(Math.hypot(b.x-a.x,b.z-a.z)/.055));
    for(let i=1;i<=n;i++)if(!this.free(a.x+(b.x-a.x)*i/n,a.z+(b.z-a.z)*i/n))return false;
    return true;
  }
  nearest(x:number,z:number,accept=(x:number,z:number)=>true,radius=.8):WalkPoint|null{
    let best:WalkPoint|null=null,distance=Infinity;
    for(let dz=-radius;dz<=radius;dz+=this.step)for(let dx=-radius;dx<=radius;dx+=this.step){
      const nx=Math.round((x+dx)/this.step)*this.step,nz=Math.round((z+dz)/this.step)*this.step,d=(nx-x)**2+(nz-z)**2;
      if(d<distance&&this.free(nx,nz)&&accept(nx,nz)){distance=d;best={x:nx,z:nz,tile:fromWorld(nx,nz)}}
    }
    return best;
  }
  path(start:{x:number;z:number},end:{x:number;z:number},crowd:(x:number,z:number)=>number=()=>0,endRadius=.8):WalkPoint[]|null{
    const a=this.nearest(start.x,start.z,(x,z)=>this.segment(start,{x,z})),b=this.nearest(end.x,end.z,()=>true,endRadius);if(!a||!b)return null;
    const key=(x:number,z:number)=>`${x},${z}`,sx=Math.round(a.x/this.step),sz=Math.round(a.z/this.step),tx=Math.round(b.x/this.step),tz=Math.round(b.z/this.step),target=key(tx,tz);
    type Node={x:number;z:number;key:string;cost:number;score:number};
    const heap:Node[]=[],push=(n:Node)=>{heap.push(n);for(let i=heap.length-1;i>0;){const p=(i-1)>>1;if(heap[p].score<=n.score)break;heap[i]=heap[p];heap[p]=n;i=p}},pop=()=>{const first=heap[0],last=heap.pop()!;if(heap.length){heap[0]=last;let i=0;for(;;){let j=i*2+1;if(j>=heap.length)break;if(j+1<heap.length&&heap[j+1].score<heap[j].score)j++;if(heap[i].score<=heap[j].score)break;[heap[i],heap[j]]=[heap[j],heap[i]];i=j}}return first};
    const first=key(sx,sz),cost=new Map([[first,0]]),parent=new Map<string,string>(),positions=new Map<string,{x:number;z:number}>([[first,{x:sx,z:sz}]]);
    push({x:sx,z:sz,key:first,cost:0,score:Math.hypot(tx-sx,tz-sz)});
    for(let visited=0;heap.length&&visited<14000;visited++){
      const node=pop();if(node.cost!==cost.get(node.key))continue;
      if(node.key===target){
        const raw:WalkPoint[]=[];for(let k=target;;k=parent.get(k)!){const p=positions.get(k)!;raw.push({x:p.x*this.step,z:p.z*this.step,tile:fromWorld(p.x*this.step,p.z*this.step)});if(k===first)break}raw.reverse();
        const result:WalkPoint[]=[];let i=0;
        while(i<raw.length){let j=Math.min(raw.length-1,i+12);while(j>i&&!this.segment(i?raw[i-1]:a,raw[j]))j--;result.push(raw[j]);i=j+1}
        if(this.free(end.x,end.z)&&this.segment(result[result.length-1]??a,end))result.push({...end,tile:fromWorld(end.x,end.z)});
        return result;
      }
      for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,1],[1,-1],[-1,-1],[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]]){
        const x=node.x+dx,z=node.z+dz,k=key(x,z),wx=x*this.step,wz=z*this.step;
        let free=this.cache.get(k);if(free===undefined){free=this.free(wx,wz);this.cache.set(k,free)}
        if(!free||!this.segment({x:node.x*this.step,z:node.z*this.step},{x:wx,z:wz}))continue;
        const next=node.cost+Math.hypot(dx,dz)+crowd(wx,wz);
        if(next>=(cost.get(k)??Infinity))continue;
        cost.set(k,next);parent.set(k,node.key);positions.set(k,{x,z});push({x,z,key:k,cost:next,score:next+Math.hypot(tx-x,tz-z)});
      }
    }
    return null;
  }
}
