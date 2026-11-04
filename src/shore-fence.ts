import * as T from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {adjacent,position,RADIUS} from './hex';
import {LAND_Y} from './scenery';

/** The same offset-line intersections as the land keep adjoining coast rails joined. */
function fencePlan(id:number,board:ReadonlyMap<number,unknown>,openingYaw?:number){
  if(!board.has(id))return [];
  const outer=adjacent(id).map(n=>!board.has(n)),apothem=RADIUS*Math.cos(Math.PI/6);
  const vertex=(k:number)=>{
    const a=((k+5)%6)*Math.PI/3,b=(k%6)*Math.PI/3;
    const da=apothem-(outer[(k+5)%6] ? .12 : 0),db=apothem-(outer[k%6] ? .12 : 0),det=Math.sin(b-a);
    return new T.Vector3((da*Math.sin(b)-db*Math.sin(a))/det,0,(Math.cos(a)*db-Math.cos(b)*da)/det);
  };
  const gap=openingYaw===undefined?-1:outer.map((open,i)=>({i,d:open?Math.abs(Math.atan2(Math.sin(Math.PI/2-i*Math.PI/3-openingYaw),Math.cos(Math.PI/2-i*Math.PI/3-openingYaw))):Infinity})).sort((a,b)=>a.d-b.d)[0].i;
  const segments=outer.map((open,i)=>open&&i!==gap?i:-1).filter(i=>i>=0);
  return segments.map(side=>{
    const a=vertex(side),b=vertex(side+1),midpoint=a.clone().lerp(b,.5);
    return {side,a,b,midpoint,signature:[a.x,a.z,b.x,b.z].map(n=>n.toFixed(4)).join(','),create:()=>fencePanel(a,b,midpoint)};
  });
}
function fencePanel(a:T.Vector3,b:T.Vector3,center:T.Vector3){
  const pieces:T.BufferGeometry[]=[],posts=new Set<string>();
  const add=(w:number,h:number,d:number,p:T.Vector3,tint:number,yaw=0)=>{
    const geometry=new T.BoxGeometry(w,h,d);geometry.rotateY(yaw);geometry.translate(p.x,p.y,p.z);
    const color=new T.Color(tint),colors=Array.from({length:geometry.getAttribute('position').count},()=>[color.r,color.g,color.b]).flat();
    geometry.setAttribute('color',new T.Float32BufferAttribute(colors,3));pieces.push(geometry);
  };
  const post=(p:T.Vector3)=>{
    const key=`${p.x.toFixed(4)},${p.z.toFixed(4)}`;if(posts.has(key))return;posts.add(key);
    add(.045,.24,.045,new T.Vector3(p.x,LAND_Y+.12,p.z),0xa18b67);
    add(.054,.025,.054,new T.Vector3(p.x,LAND_Y+.247,p.z),0xd9c7a0);
  };
  const length=a.distanceTo(b),yaw=Math.atan2(b.x-a.x,b.z-a.z);
  post(a);post(center);post(b);
  for(const y of [.095,.19])add(.028,.035,length,center.clone().setY(LAND_Y+y),0xc7b48e,yaw);
  const geometry=mergeGeometries(pieces,false);pieces.forEach(p=>p.dispose());
  geometry?.translate(-center.x,-LAND_Y,-center.z);return geometry!;
}


export type FenceEdge={side:number;a:T.Vector3;b:T.Vector3};
type Spec=ReturnType<typeof fencePlan>[number];
type Panel={mesh:T.Mesh<T.BufferGeometry,T.MeshStandardMaterial>;spec:Spec;age:number;delay:number;removing:boolean;smoked:boolean;initialScale:number};
type Puff={mesh:T.Mesh<T.IcosahedronGeometry,T.MeshBasicMaterial>;velocity:T.Vector3;age:number};
const timber=new T.MeshStandardMaterial({vertexColors:true,roughness:.95,flatShading:true});
const puffGeometry=new T.IcosahedronGeometry(.055,1);
/** Reconcile only changed edges; keep disappearing wood alive until its dust burst finishes. */
export class ShoreFence {
  readonly root=new T.Group();
  private panels=new Map<number,Panel>();
  private retiring:Panel[]=[];
  private pending=new Map<number,Spec>();
  private puffs:Puff[]=[];
  plan(id:number,board:ReadonlyMap<number,unknown>,opening?:number){
    const desired=new Map(fencePlan(id,board,opening).map(spec=>[spec.side,spec]));
    for(const [side,panel] of this.panels){
      const spec=desired.get(side);
      if(spec){
        // The same outer edge survives. Adjust its join without demolishing it.
        if(spec.signature!==panel.spec.signature){
          const geometry=panel.mesh.geometry;panel.mesh.geometry=spec.create();geometry.dispose();
          panel.mesh.position.x=spec.midpoint.x;panel.mesh.position.z=spec.midpoint.z;panel.spec=spec;
        }
        continue;
      }
      if(panel.mesh.visible){panel.initialScale=panel.mesh.scale.y;panel.removing=true;panel.age=0;panel.smoked=false;this.retiring.push(panel)}
      else{this.root.remove(panel.mesh);panel.mesh.geometry.dispose()}
      this.panels.delete(side);
    }
    this.pending=new Map([...desired].filter(([side])=>!this.panels.has(side)));
  }
  private dust(spec:Spec){
    for(let i=0;i<5&&this.puffs.length<48;i++){
      const mat=new T.MeshBasicMaterial({color:i%2?0xded5b9:0xf1e8cf,transparent:true,opacity:0,depthWrite:false});
      const mesh=new T.Mesh(puffGeometry,mat),spread=(i-2)*.17,angle=spec.side*Math.PI/3;
      mesh.position.set(spec.midpoint.x-Math.sin(angle)*spread,LAND_Y+.09,spec.midpoint.z+Math.cos(angle)*spread);this.root.add(mesh);
      this.puffs.push({mesh,velocity:new T.Vector3((Math.random()-.5)*.16,.16+Math.random()*.1,(Math.random()-.5)*.16),age:0});
    }
  }
  private edge(spec:Spec,id:number):FenceEdge{
    const p=position(id),offset=new T.Vector3(p.x,0,p.z);
    return {side:spec.side,a:spec.a.clone().add(offset),b:spec.b.clone().add(offset)};
  }
  get hasPending(){return this.pending.size>0}
  waitingEdges(id:number){return [...this.pending.values()].filter(spec=>!this.retiring.some(panel=>panel.spec.side===spec.side)).map(spec=>this.edge(spec,id))}
  existingEdges(id:number){return [...this.panels.values()].map(panel=>this.edge(panel.spec,id))}
  enqueue(side:number,delay:number){
    const spec=this.pending.get(side);if(!spec)return;
    const mesh=new T.Mesh(spec.create(),timber);mesh.position.set(spec.midpoint.x,LAND_Y,spec.midpoint.z);mesh.visible=false;mesh.castShadow=true;mesh.receiveShadow=true;
    const panel:Panel={mesh,spec,age:0,delay,removing:false,smoked:false,initialScale:1};this.root.add(mesh);this.panels.set(side,panel);this.pending.delete(side);
  }
  update(dt:number,onBuild:()=>void,onBreak:()=>void){
    for(const panel of [...this.panels.values(),...this.retiring]){
      panel.age+=dt;const age=panel.age-(panel.removing?0:panel.delay);
      if(age<0)continue;
      if(!panel.smoked){this.dust(panel.spec);panel.smoked=true;if(panel.removing)onBreak();else onBuild()}
      const t=Math.min(1,age/.42);panel.mesh.visible=true;
      const progress=panel.removing?1-t:t;
      const height=1-(1-progress)**3+Math.sin(progress*Math.PI)*.07;
      panel.mesh.rotation.set(0,0,0);panel.mesh.position.y=LAND_Y;
      panel.mesh.scale.y=Math.max(.001,height*(panel.removing?panel.initialScale:1));
    }
    this.retiring=this.retiring.filter(panel=>{if(panel.age<.42)return true;this.root.remove(panel.mesh);panel.mesh.geometry.dispose();return false});
    this.puffs=this.puffs.filter(puff=>{
      puff.age+=dt;if(puff.age>=.65){this.root.remove(puff.mesh);puff.mesh.material.dispose();return false}
      const t=puff.age/.65;puff.mesh.position.addScaledVector(puff.velocity,dt);puff.mesh.scale.setScalar(.45+t*1.6);puff.mesh.material.opacity=Math.sin(t*Math.PI)*.48;return true;
    });
  }
  dispose(){
    for(const panel of [...this.panels.values(),...this.retiring])panel.mesh.geometry.dispose();
    for(const puff of this.puffs)puff.mesh.material.dispose();
    this.root.clear();this.panels.clear();this.retiring=[];this.pending.clear();this.puffs=[];
  }
}
