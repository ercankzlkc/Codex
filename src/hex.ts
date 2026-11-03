/** Pointy-top axial coordinates. A compact stable id lets the UI refer to a cell across turns. */
export interface Hex { q:number; r:number }
export const RADIUS=1.03;
const SQRT3=Math.sqrt(3);
const BIAS=64, STRIDE=129;
export const directions:readonly Hex[]=[
  {q:1,r:0},{q:0,r:1},{q:-1,r:1},{q:-1,r:0},{q:0,r:-1},{q:1,r:-1},
];
export function key(q:number,r:number) {
  return Number.isInteger(q)&&Number.isInteger(r)&&Math.abs(q)<=BIAS&&Math.abs(r)<=BIAS?(q+BIAS)*STRIDE+r+BIAS:-1;
}
export const CENTER=key(0,0);
export function axial(id:number):Hex {return {q:Math.floor(id/STRIDE)-BIAS,r:id%STRIDE-BIAS}}
export function adjacent(id:number) {
  if(!Number.isInteger(id)||id<0||id>=STRIDE*STRIDE)return [];
  const {q,r}=axial(id);
  return directions.map(d=>key(q+d.q,r+d.r));
}
export function position(id:number) {
  const {q,r}=axial(id);return {x:RADIUS*SQRT3*(q+r/2),z:RADIUS*1.5*r};
}
export function fromWorld(x:number,z:number) {
  const q=(x/SQRT3-z/3)/RADIUS,r=(2*z/3)/RADIUS,s=-q-r;
  let a=Math.round(q),b=Math.round(r);const c=Math.round(s);
  const da=Math.abs(a-q),db=Math.abs(b-r),dc=Math.abs(c-s);
  if(da>db&&da>dc)a=-b-c;else if(db>dc)b=-a-c;
  return key(a,b);
}
export function frontier(board:ReadonlyMap<number,unknown>):number[] {
  const open=new Set<number>();
  for(const id of board.keys())for(const neighbor of adjacent(id))if(neighbor>=0&&!board.has(neighbor))open.add(neighbor);
  return [...open];
}
export function canGrow(board:ReadonlyMap<number,unknown>,id:number) {
  return id>=0&&!board.has(id)&&adjacent(id).some(n=>board.has(n));
}
export interface ShoreEdge {id:number;side:number;ax:number;az:number;bx:number;bz:number}
export function corner(i:number,r=RADIUS) {const a=(i-.5)*Math.PI/3;return {x:Math.cos(a)*r,z:Math.sin(a)*r}}
export function coast(board:ReadonlyMap<number,unknown>):ShoreEdge[] {
  const edges:ShoreEdge[]=[];
  for(const id of board.keys()){
    const p=position(id);
    adjacent(id).forEach((n,i)=>{if(board.has(n))return;
      const a=corner(i),b=corner(i+1);
      edges.push({id,side:i,ax:p.x+a.x,az:p.z+a.z,bx:p.x+b.x,bz:p.z+b.z});
    });
  }
  return edges;
}
