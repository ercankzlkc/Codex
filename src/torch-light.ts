import {Vector4,DataTexture,RGBAFormat,LinearFilter} from 'three';
export const torchLight={value:Array.from({length:4},()=>new Vector4())};
const SIZE=64,pixels=new Uint8Array(SIZE*SIZE*4),energy=new Float32Array(SIZE*SIZE),seaEnergy=new Float32Array(SIZE*SIZE);
const texture=new DataTexture(pixels,SIZE,SIZE,RGBAFormat);
texture.minFilter=texture.magFilter=LinearFilter;texture.generateMipmaps=false;texture.needsUpdate=true;
// Heat needs finer sampling than the broad light field: it only melts a small
// patch around the post, rather than clearing snow across the whole light pool.
const HEAT_SIZE=256,heatPixels=new Uint8Array(HEAT_SIZE*HEAT_SIZE*4),heatEnergy=new Float32Array(HEAT_SIZE*HEAT_SIZE);
const heatTexture=new DataTexture(heatPixels,HEAT_SIZE,HEAT_SIZE,RGBAFormat);
heatTexture.minFilter=heatTexture.magFilter=LinearFilter;heatTexture.generateMipmaps=false;heatTexture.needsUpdate=true;
export const torchField={map:{value:texture},heat:{value:heatTexture},region:{value:new Vector4(-4,-4,8,8)}};
/** Rasterise each light's small footprint, rather than adding a GPU light per torch. */
export function updateTorchField(sources:readonly {x:number;z:number;level:number;water?:boolean;heat?:number}[]){
  energy.fill(0);seaEnergy.fill(0);pixels.fill(0);heatPixels.fill(0);heatEnergy.fill(0);
  if(sources.length){
    const margin=2.2,left=Math.min(...sources.map(s=>s.x))-margin,back=Math.min(...sources.map(s=>s.z))-margin;
    const width=Math.max(4,Math.max(...sources.map(s=>s.x))+margin-left),depth=Math.max(4,Math.max(...sources.map(s=>s.z))+margin-back);
    torchField.region.value.set(left,back,width,depth);
    for(const source of sources){
      const minX=Math.max(0,Math.floor((source.x-margin-left)/width*SIZE)),maxX=Math.min(SIZE-1,Math.ceil((source.x+margin-left)/width*SIZE));
      const minZ=Math.max(0,Math.floor((source.z-margin-back)/depth*SIZE)),maxZ=Math.min(SIZE-1,Math.ceil((source.z+margin-back)/depth*SIZE));
      for(let z=minZ;z<=maxZ;z++)for(let x=minX;x<=maxX;x++){
        const dx=left+(x+.5)/SIZE*width-source.x,dz=back+(z+.5)/SIZE*depth-source.z,r2=dx*dx+dz*dz;
        if(r2>margin*margin)continue;
        (source.water?seaEnergy:energy)[z*SIZE+x]+=source.level*Math.exp(-r2*(source.water?1.05:1.5))*Math.max(0,1-r2/(margin*margin));
      }
      if((source.heat??0)>.002&&!source.water){
        const radius=.46,inner=.27;
        const heatMinX=Math.max(0,Math.floor((source.x-radius-left)/width*HEAT_SIZE)),heatMaxX=Math.min(HEAT_SIZE-1,Math.ceil((source.x+radius-left)/width*HEAT_SIZE));
        const heatMinZ=Math.max(0,Math.floor((source.z-radius-back)/depth*HEAT_SIZE)),heatMaxZ=Math.min(HEAT_SIZE-1,Math.ceil((source.z+radius-back)/depth*HEAT_SIZE));
        for(let z=heatMinZ;z<=heatMaxZ;z++)for(let x=heatMinX;x<=heatMaxX;x++){
          const dx=left+(x+.5)/HEAT_SIZE*width-source.x,dz=back+(z+.5)/HEAT_SIZE*depth-source.z,d=Math.hypot(dx,dz);
          if(d>=radius)continue;
          const edge=Math.max(0,Math.min(1,(d-inner)/(radius-inner))),warmth=(source.heat??0)*(1-edge*edge*(3-2*edge));
          heatEnergy[z*HEAT_SIZE+x]=Math.max(heatEnergy[z*HEAT_SIZE+x],warmth);
        }
      }
    }
    for(let i=0;i<energy.length;i++){pixels[i*4]=Math.round(Math.min(1,energy[i]*.8)*255);pixels[i*4+1]=Math.round(Math.min(1,seaEnergy[i]*.8)*255);pixels[i*4+3]=255}
    for(let i=0;i<heatEnergy.length;i++){heatPixels[i*4]=Math.round(Math.min(1,heatEnergy[i])*255);heatPixels[i*4+3]=255}
  }
  texture.needsUpdate=true;heatTexture.needsUpdate=true;
}
