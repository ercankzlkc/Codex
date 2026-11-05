import {Vector4,DataTexture,RGBAFormat,LinearFilter} from 'three';
export const torchLight={value:Array.from({length:4},()=>new Vector4())};
const SIZE=64,pixels=new Uint8Array(SIZE*SIZE*4),energy=new Float32Array(SIZE*SIZE);
const texture=new DataTexture(pixels,SIZE,SIZE,RGBAFormat);
texture.minFilter=texture.magFilter=LinearFilter;texture.generateMipmaps=false;texture.needsUpdate=true;
export const torchField={map:{value:texture},region:{value:new Vector4(-4,-4,8,8)}};
/** Rasterise each light's small footprint, rather than adding a GPU light per torch. */
export function updateTorchField(sources:readonly {x:number;z:number;level:number}[]){
  energy.fill(0);pixels.fill(0);
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
        energy[z*SIZE+x]+=source.level*Math.exp(-r2*1.5)*Math.max(0,1-r2/(margin*margin));
      }
    }
    for(let i=0;i<energy.length;i++){pixels[i*4]=Math.round(Math.min(1,energy[i]*.8)*255);pixels[i*4+3]=255}
  }
  texture.needsUpdate=true;
}
