import * as T from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {adjacent,RADIUS} from './hex';
import {LAND_Y} from './scenery';

/** The same offset-line intersections as the land keep adjoining coast rails joined. */
export function shoreFence(id:number,board:ReadonlyMap<number,unknown>,openingYaw?:number,previousSignature?:string){
  const outer=adjacent(id).map(n=>!board.has(n)),apothem=RADIUS*Math.cos(Math.PI/6);
  const vertex=(k:number)=>{
    const a=((k+5)%6)*Math.PI/3,b=(k%6)*Math.PI/3;
    const da=apothem-(outer[(k+5)%6] ? .12 : 0),db=apothem-(outer[k%6] ? .12 : 0),det=Math.sin(b-a);
    return new T.Vector3((da*Math.sin(b)-db*Math.sin(a))/det,0,(Math.cos(a)*db-Math.cos(b)*da)/det);
  };
  const gap=openingYaw===undefined?-1:outer.map((open,i)=>({i,d:open?Math.abs(Math.atan2(Math.sin(Math.PI/2-i*Math.PI/3-openingYaw),Math.cos(Math.PI/2-i*Math.PI/3-openingYaw))):Infinity})).sort((a,b)=>a.d-b.d)[0].i;
  const segments=outer.map((open,i)=>open&&i!==gap?i:-1).filter(i=>i>=0);
  const signature=`${outer.map(Number).join('')}:${gap}`;
  if(signature===previousSignature)return {signature,geometry:undefined};
  if(!segments.length)return {signature,geometry:null};
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
  for(const side of segments){
    const a=vertex(side),b=vertex(side+1),center=a.clone().lerp(b,.5),length=a.distanceTo(b),yaw=Math.atan2(b.x-a.x,b.z-a.z);
    post(a);post(center);post(b);
    for(const y of [.095,.19])add(.028,.035,length,center.clone().setY(LAND_Y+y),0xc7b48e,yaw);
  }
  const geometry=mergeGeometries(pieces,false);pieces.forEach(p=>p.dispose());
  return {signature,geometry};
}
