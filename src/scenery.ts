import * as T from 'three';
import {windForce} from './atmosphere';
import {adjacent,position,RADIUS} from './hex';

export const LAND_Y=.13, SEA_Y=-.18;
// Shared world-space sampling makes neighboring tiles agree on every seam.
const groundPalette:Record<string,T.Color>=Object.fromEntries(Object.entries({
  forest:'#759b77',berry:'#a2bd83',farm:'#a8bb80',stone:'#91aa86',
  house:'#a4bb88',manor:'#adbf8c',lumber:'#90ab7c',store:'#9fb785',
  garden:'#90b684',fisher:'#a8bc8c',harbor:'#a5b98a',
}).map(([kind,color])=>[kind,new T.Color(color)]));
const grassBase=new T.Color('#9fb982');
function nearby(id:number){return [...new Set([id,...adjacent(id),...adjacent(id).flatMap(adjacent)])]}
export function terrainSignature(id:number,board:ReadonlyMap<number,unknown>){
  return nearby(id).map(i=>`${i}:${board.get(i)??''}`).join('|');
}
function groundSampler(id:number,board:ReadonlyMap<number,unknown>){
  const patches=nearby(id).filter(i=>board.has(i)).map(i=>({...position(i),tint:groundPalette[String(board.get(i))]??grassBase}));
  // Sample a broad ecological blend, with a compact smooth kernel and no per-tile noise.
  return (x:number,z:number,out:T.Color)=>{
    out.setRGB(0,0,0);let total=0;
    for(const p of patches){
      const d=Math.hypot(x-p.x,z-p.z)/2.25;if(d>=1)continue;
      const w=(1-d*d)**3;out.r+=p.tint.r*w;out.g+=p.tint.g*w;out.b+=p.tint.b*w;total+=w;
    }
    if(total)out.multiplyScalar(1/total);else out.copy(grassBase);
    const variation=1+.025*Math.sin(x*.63+z*.34)+.018*Math.cos(z*.84-x*.47);
    return out.multiplyScalar(variation);
  };
}

const APOTHEM=RADIUS*Math.cos(Math.PI/6);
export function terrainGeometry(id:number,board:ReadonlyMap<number,unknown>,topOnly=false){
  const outer=adjacent(id).map(n=>!board.has(n));
  // Intersect neighboring offset edge lines. Shared edges always use zero offset,
  // so even at a concave shoreline both tiles produce the same seam endpoints.
  function vertex(k:number,offset:number,y:number){
    const previous=(k+5)%6,theCurrent=k%6;
    const a=previous*Math.PI/3,b=theCurrent*Math.PI/3;
    const d1=APOTHEM+(outer[previous]?offset:0),d2=APOTHEM+(outer[theCurrent]?offset:0);
    const det=Math.sin(b-a);
    return new T.Vector3((d1*Math.sin(b)-d2*Math.sin(a))/det,y,(Math.cos(a)*d2-Math.cos(b)*d1)/det);
  }
  const origin=position(id),sample=groundSampler(id,board),sampleCache=new Map<string,T.Color>();
  const pos:number[]=[],color:number[]=[];
  const tri=(a:T.Vector3,b:T.Vector3,c:T.Vector3,hex:number,brightness=1)=>{
    const shade=new T.Color(hex).multiplyScalar(brightness);
    for(const v of [a,b,c]){
      pos.push(v.x,v.y,v.z);
      if(hex===0xa4bb7f || hex===0x91ab6c){
        const key=`${v.x.toFixed(5)},${v.z.toFixed(5)}`;
        let tint=sampleCache.get(key);if(!tint){tint=sample(origin.x+v.x,origin.z+v.z,new T.Color());sampleCache.set(key,tint)}
        shade.copy(tint);
        if(v.y<LAND_Y)shade.multiplyScalar(.89);
      }
      color.push(shade.r,shade.g,shade.b);
    }
  };
  const levels=[[-.095,LAND_Y],[-.035,.074],[.05,-.016],[.15,-.16],[.21,-.25],[.28,-.34],[.36,-.43],[.45,-.51],[.56,-.58],[.69,-.64],[.84,-.69]];
  const tints=[0x91ab6c,0xa8b780,0xdcc796,0xe8cf9e,0xe3cc9c,0xdbc79b,0xc9be98,0xb2b69a,0x9cab96,0x8b9f91];
  for(let k=0;k<6;k++){
    const layers=levels.map(([o,y])=>{
      const a=vertex(k,o,y),b=vertex(k+1,o,y);
      return Array.from({length:5},(_,s)=>{
        const t=s/4,p=a.clone().lerp(b,t);
        if(outer[k]&&s>0&&s<4){
          const undulation=.025*Math.sin(id*.61+k*2.8+t*Math.PI*2)*Math.sin(t*Math.PI);
          p.x+=Math.cos(k*Math.PI/3)*undulation;p.z+=Math.sin(k*Math.PI/3)*undulation;
        }
        return p;
      });
    });
    for(let s=0;s<4;s++){
      // Extra interior samples keep colour transitions curved rather than broad triangle fans.
      const a=new T.Vector3(0,LAND_Y,0),b=layers[0][s+1],c=layers[0][s],steps=4;
      const point=(u:number,v:number)=>a.clone().addScaledVector(b.clone().sub(a),u/steps).addScaledVector(c.clone().sub(a),v/steps);
      for(let u=0;u<steps;u++)for(let v=0;v<steps-u;v++){
        tri(point(u,v),point(u+1,v),point(u,v+1),0xa4bb7f);
        if(u+v<steps-1)tri(point(u+1,v),point(u+1,v+1),point(u,v+1),0xa4bb7f);
      }
      if(topOnly||!outer[k])continue;
      for(let l=0;l<levels.length-1;l++){
        const [a,b,c,d]=[layers[l][s],layers[l][s+1],layers[l+1][s],layers[l+1][s+1]];
        const shade=1+.035*Math.sin(id+k*1.7+s);
        tri(a,b,c,tints[l],shade);tri(c,b,d,tints[l],shade+.01);
      }
    }
  }
  const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(pos,3));
  geometry.setAttribute('color',new T.Float32BufferAttribute(color,3));geometry.computeVertexNormals();
  // Average normals across duplicate triangle vertices for a rounded coastal slope.
  const normals=geometry.getAttribute('normal'),positions=geometry.getAttribute('position'),sums=new Map<string,T.Vector3>();
  const keys:string[]=[];
  for(let i=0;i<positions.count;i++){
    const key=`${positions.getX(i).toFixed(5)},${positions.getY(i).toFixed(5)},${positions.getZ(i).toFixed(5)}`;keys.push(key);
    const sum=sums.get(key)??new T.Vector3();sum.add(new T.Vector3(normals.getX(i),normals.getY(i),normals.getZ(i)));sums.set(key,sum);
  }
  for(const normal of sums.values())normal.normalize();
  for(let i=0;i<normals.count;i++){const normal=sums.get(keys[i])!;normals.setXYZ(i,normal.x,normal.y,normal.z)}
  return geometry;
}
/** Scattered rooted blades, kept clear of model footprints and the shore. */
export const grassTime={value:0};
export function meadow(id:number,blocked:(x:number,z:number)=>boolean=()=>false){
  const group=new T.Group();const p=position(id);group.position.set(p.x,LAND_Y,p.z);
  const pos:number[]=[],color:number[]=[];
  function triangle(points:number[],tint:number){
    pos.push(...points);const c=new T.Color(tint);for(let i=0;i<3;i++)color.push(c.r,c.g,c.b);
  }
  const spots:{x:number;z:number}[]=[];
  for(let attempt=0;attempt<500&&spots.length<55;attempt++){
    const x=(Math.random()-.5)*1.8,z=(Math.random()-.5)*1.8;
    if(Array.from({length:6},(_,k)=>x*Math.cos(k*Math.PI/3)+z*Math.sin(k*Math.PI/3)).some(d=>d>APOTHEM-.19))continue;
    if(blocked(x,z)||spots.some(p=>Math.hypot(p.x-x,p.z-z)<.075))continue;
    spots.push({x,z});
  }
  for(let j=0;j<spots.length;j++){
    const {x,z}=spots[j];
    const seed=(n:number)=>{const v=Math.sin(id*17.31+j*71.13+n*29.7)*43758.5453;return v-Math.floor(v)};
    const count=3+Math.floor(seed(0)*4),angle=seed(1)*Math.PI*2;
    const palette=[0x73965e,0x86a86b,0x9bb97b,0xb1c88a,0x7fa56c];
    for(let n=0;n<count;n++){
      const heading=angle+(seed(n+2)-.5)*2.4,ux=Math.cos(heading),uz=Math.sin(heading);
      const bx=x+(seed(n+20)-.5)*.06,bz=z+(seed(n+40)-.5)*.06;
      const height=.035+seed(n+60)*.07,width=.009+seed(n+80)*.008,lean=.012+seed(n+100)*.035;
      const mx=bx+ux*lean*.3,mz=bz+uz*lean*.3,tx=bx+ux*lean,tz=bz+uz*lean;
      const tint=palette[Math.floor(seed(n+120)*palette.length)];
      triangle([bx-uz*width,.004,bz+ux*width,bx+uz*width,.004,bz-ux*width,mx+uz*width*.55,height*.55,mz-ux*width*.55],tint);
      triangle([bx-uz*width,.004,bz+ux*width,mx+uz*width*.55,height*.55,mz-ux*width*.55,mx-uz*width*.55,height*.55,mz+ux*width*.55],tint);
      triangle([mx-uz*width*.55,height*.55,mz+ux*width*.55,mx+uz*width*.55,height*.55,mz-ux*width*.55,tx,height,tz],tint);
    }

  }
  const geom=new T.BufferGeometry();geom.setAttribute('position',new T.Float32BufferAttribute(pos,3));geom.setAttribute('color',new T.Float32BufferAttribute(color,3));geom.computeVertexNormals();
  const mat=new T.MeshLambertMaterial({vertexColors:true,side:T.DoubleSide});
  mat.onBeforeCompile=shader=>{shader.uniforms.grassTime=grassTime;shader.uniforms.windForce=windForce;shader.vertexShader='uniform float windForce;\nuniform float grassTime;\n'+shader.vertexShader;shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>',`#include <begin_vertex>
    float phase=position.x*31.0+position.z*23.0;
    float bend=sin(grassTime*1.8+phase)*0.18+sin(grassTime*2.7+phase*1.7)*0.09;
    transformed.x+=bend*position.y*(.7+windForce);transformed.z+=cos(grassTime*1.6+phase)*position.y*0.12*(.7+windForce);`)};
  mat.customProgramCacheKey=()=>'meadow-wind';
  const blades=new T.Mesh(geom,mat);blades.receiveShadow=true;group.add(blades);return group;
}

