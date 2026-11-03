import * as T from 'three';
import { fromWorld, type ShoreEdge } from '../hex';

const SHORE_RANGE = 7;
const BED_MAX = 3.8;
const FIELD_SIZE = 256;
const smooth = (a:number,b:number,x:number) => {
  const t=Math.max(0,Math.min(1,(x-a)/(b-a))); return t*t*(3-2*t);
};

/** R/G encode signed distance to the nearest exposed edge. B encodes actual bed depth.
 * The same interpolated depth is used to build the seabed, seat stones and shade the surface. */
export class LagoonField {
  readonly pixels=new Uint8Array(FIELD_SIZE*FIELD_SIZE*4);
  readonly texture=new T.DataTexture(this.pixels,FIELD_SIZE,FIELD_SIZE,T.RGBAFormat);
  readonly region=new T.Vector4();
  constructor(){
    this.texture.minFilter=this.texture.magFilter=T.LinearFilter;
    this.texture.generateMipmaps=false;this.texture.needsUpdate=true;
  }
  rebuild(board:ReadonlyMap<number,unknown>,edges:ShoreEdge[],region?:T.Vector4){
    const xs=edges.flatMap(e=>[e.ax,e.bx]),zs=edges.flatMap(e=>[e.az,e.bz]);
    const left=region?.x??Math.min(...xs)-SHORE_RANGE, back=region?.y??Math.min(...zs)-SHORE_RANGE;
    if(region)this.region.copy(region);
    else this.region.set(left,back,Math.max(...xs)-left+SHORE_RANGE,Math.max(...zs)-back+SHORE_RANGE);
    const segments=edges.map(e=>{const dx=e.bx-e.ax,dz=e.bz-e.az;return {...e,dx,dz,inv:1/(dx*dx+dz*dz)}});
    const dx=this.region.z/FIELD_SIZE,dz=this.region.w/FIELD_SIZE;
    const block=16,radius=Math.hypot(dx,dz)*block*.5;
    function distance2(e:typeof segments[number],x:number,z:number){
      const u=x-e.ax,v=z-e.az,t=Math.max(0,Math.min(1,(u*e.dx+v*e.dz)*e.inv));
      const a=u-t*e.dx,b=v-t*e.dz;return a*a+b*b;
    }
    // A segment farther than best + two block radii at the centre cannot
    // be the closest segment anywhere in this block.
    for(let y0=0;y0<FIELD_SIZE;y0+=block)for(let x0=0;x0<FIELD_SIZE;x0+=block){
      const cx=left+(x0+block/2)*dx,cz=back+(y0+block/2)*dz;
      const distances=segments.map(e=>distance2(e,cx,cz));
      const limit=Math.min(SHORE_RANGE+radius,Math.sqrt(Math.min(...distances))+2*radius);
      const nearby=segments.filter((_,index)=>distances[index]<=limit*limit);
      for(let j=y0;j<y0+block;j++)for(let i=x0;i<x0+block;i++){
        const x=left+(i+.5)*dx,z=back+(j+.5)*dz;
        let d2=SHORE_RANGE*SHORE_RANGE;
        for(const e of nearby)d2=Math.min(d2,distance2(e,x,z));
        const d=Math.sqrt(d2)*(board.has(fromWorld(x,z))?-1:1);
        // Broad sand tongues and channels vary the shelf width along the coast.
        const bank=.5+.25*Math.sin(x*.79+z*.36)+.18*Math.cos(z*.94-x*.51)+.07*Math.sin(x*1.41-z*.88);
        const shelf=smooth(.18,2.2+2.3*bank,d);
        const depth=.31+.23*smooth(.24,1.65,d)+shelf*(1.15+.43*(1-bank))+1.55*smooth(2.9,6.9,d);
        const packed=Math.round(65535*Math.max(0,Math.min(1,(d+1)/(SHORE_RANGE+1))));
        const k=(j*FIELD_SIZE+i)*4;
        this.pixels[k]=packed>>8;this.pixels[k+1]=packed&255;
        this.pixels[k+2]=Math.round(255*Math.min(depth/BED_MAX,1));this.pixels[k+3]=255;
      }
    }
    this.texture.needsUpdate=true;
  }
  depthAt(x:number,z:number){
    const u=Math.max(0,Math.min(FIELD_SIZE-1,(x-this.region.x)/this.region.z*FIELD_SIZE-.5));
    const v=Math.max(0,Math.min(FIELD_SIZE-1,(z-this.region.y)/this.region.w*FIELD_SIZE-.5));
    const i=Math.floor(u),j=Math.floor(v),ii=Math.min(i+1,FIELD_SIZE-1),jj=Math.min(j+1,FIELD_SIZE-1);
    const at=(a:number,b:number)=>this.pixels[(b*FIELD_SIZE+a)*4+2]*BED_MAX/255;
    return T.MathUtils.lerp(T.MathUtils.lerp(at(i,j),at(ii,j),u-i),T.MathUtils.lerp(at(i,jj),at(ii,jj),u-i),v-j);
  }
}

/** One reusable, wrapping data tile: Voronoi edge distance, junction strength, two smooth currents.
 * A lookup replaces the neighborhood search in every full-screen fragment. */
export function lightField(){
  const n=384, count=8, data=new Uint8Array(n*n*4);
  let seed=70816;
  const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
  const sites=Array.from({length:count*count},()=>[.15+.70*random(),.15+.70*random()]);
  const tau=2*Math.PI;
  for(let y=0;y<n;y++)for(let x=0;x<n;x++){
    const u=(x+.5)/n,v=(y+.5)/n;
    const sx=u*count,sz=v*count,ix=Math.floor(sx),iz=Math.floor(sz);
    let first=10,second=10,third=10;
    for(let j=-1;j<=1;j++)for(let i=-1;i<=1;i++){
      const site=sites[((iz+j+count)%count)*count+(ix+i+count)%count];
      const dx=ix+i+site[0]-sx,dz=iz+j+site[1]-sz,d=dx*dx+dz*dz;
      if(d<first){third=second;second=first;first=d}else if(d<second){third=second;second=d}else if(d<third)third=d;
    }
    const k=(y*n+x)*4;
    data[k]=255*Math.min(1,Math.sqrt(second)-Math.sqrt(first));
    data[k+1]=255*(1-smooth(.015,.35,Math.sqrt(third)-Math.sqrt(first)));
    data[k+2]=255*(.5+.21*Math.sin(tau*(2*u+v)+.9*Math.sin(tau*v))+.16*Math.cos(tau*(u-2*v))+.09*Math.sin(tau*(3*v-u)+.7));
    data[k+3]=255*(.5+.22*Math.cos(tau*(v-u)+.7*Math.cos(tau*u))+.14*Math.sin(tau*(u+2*v)+1.3)+.09*Math.cos(tau*(3*u+v)));
  }
  const t=new T.DataTexture(data,n,n,T.RGBAFormat);t.wrapS=t.wrapT=T.RepeatWrapping;
  t.minFilter=T.LinearMipmapLinearFilter;t.magFilter=T.LinearFilter;t.generateMipmaps=true;t.needsUpdate=true;return t;
}

