import * as T from 'three';
import {fromWorld,position} from './hex';
import {climate} from './climate';
export const windForce={value:.35};
type Streak={mesh:T.Mesh;age:number;duration:number;delay:number};
/** Brief, translucent ribbons, rather than permanent stripes across the scene. */
export class Atmosphere{
  private root=new T.Group();
  private board:ReadonlyMap<number,unknown>=new Map();
  private center=new T.Vector3();private radius=3;private nextGust=5;
  private streaks:Streak[]=[];
  private readonly direction=new T.Vector3(.94,0,.34).normalize();
  constructor(scene:T.Scene){scene.add(this.root)}
  sync(board:ReadonlyMap<number,unknown>){
    this.board=board;const points=[...board.keys()].map(position);if(!points.length)return;
    this.center.set(points.reduce((n,p)=>n+p.x,0)/points.length,0,points.reduce((n,p)=>n+p.z,0)/points.length);
    this.radius=Math.max(2.5,...points.map(p=>Math.hypot(p.x-this.center.x,p.z-this.center.z)+1.8));
  }
  private gust(){
    const x=this.center.x+(Math.random()-.5)*this.radius*2,z=this.center.z+(Math.random()-.5)*this.radius*2;
    const length=.9+Math.random()*1.4,high=Array.from({length:13},(_,i)=>i*.5).some(t=>this.board.has(fromWorld(x+this.direction.x*t,z+this.direction.z*t)));
    for(let line=0;line<3;line++){
      const vertices:number[]=[],width=.006+Math.random()*.005;
      for(let i=0;i<28;i++){
        const point=(t:number,side:number)=>[t*length,Math.sin(t*Math.PI*2)*.06+side*width,Math.sin(t*Math.PI)*.14];
        const a=i/28,b=(i+1)/28;vertices.push(...point(a,-1),...point(a,1),...point(b,1),...point(a,-1),...point(b,1),...point(b,-1));
      }
      const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(vertices,3));
      const material=new T.MeshBasicMaterial({color:0xf1efd4,transparent:true,opacity:0,depthWrite:false,side:T.DoubleSide});
      const mesh=new T.Mesh(geometry,material);mesh.position.set(x-line*.28,(high?1.85:.36)+line*.13,z+line*.14);mesh.rotation.y=-Math.atan2(this.direction.z,this.direction.x);mesh.frustumCulled=false;
      this.root.add(mesh);this.streaks.push({mesh,age:0,duration:2.8+Math.random()*.7,delay:line*.18});
    }
  }
  update(dt:number){
    this.nextGust-=dt;if(this.nextGust<=0){this.nextGust=9+Math.random()*9;this.gust()}
    let force=.35;
    this.streaks=this.streaks.filter(streak=>{
      streak.age+=dt;const t=(streak.age-streak.delay)/streak.duration,fade=t>0&&t<1?Math.sin(t*Math.PI)**1.5:0;
      force=Math.max(force,.35+fade*.65);(streak.mesh.material as T.MeshBasicMaterial).opacity=fade*.19*(1-climate.night.value*.8);
      streak.mesh.position.addScaledVector(this.direction,dt*.8);
      const head=Math.min(28,Math.max(0,Math.ceil(t*40))),tail=Math.max(0,Math.floor(t*40-17));streak.mesh.geometry.setDrawRange(tail*6,Math.max(0,head-tail)*6);
      if(t>=1){this.root.remove(streak.mesh);streak.mesh.geometry.dispose();(streak.mesh.material as T.Material).dispose();return false}return true;
    });windForce.value=force;
  }
  reset(){for(const s of this.streaks){s.mesh.geometry.dispose();(s.mesh.material as T.Material).dispose()}this.root.clear();this.streaks=[];this.nextGust=5;windForce.value=.35}
}
