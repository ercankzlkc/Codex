import * as T from 'three';
import {windForce} from './atmosphere';
import {adjacent,position,RADIUS} from './hex';

export const LAND_Y=.13, SEA_Y=-.18;
const clover=new T.Color('#80ac71'), sunnyGrass=new T.Color('#b8c982');
function grassAt(x:number,z:number,out:T.Color) {
  const sun=.5+.23*Math.sin(x*.94+z*.47)+.16*Math.cos(z*1.27-x*.52)+.09*Math.sin(x*1.8-z*.98);
  return out.copy(clover).lerp(sunnyGrass,T.MathUtils.smoothstep(sun,.10,.90));
}

const APOTHEM=RADIUS*Math.cos(Math.PI/6);
export function terrainGeometry(id:number,board:ReadonlyMap<number,unknown>){
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
  const origin=position(id);
  const pos:number[]=[],color:number[]=[];
  const tri=(a:T.Vector3,b:T.Vector3,c:T.Vector3,hex:number,brightness=1)=>{
    const shade=new T.Color(hex).multiplyScalar(brightness);
    for(const v of [a,b,c]){
      pos.push(v.x,v.y,v.z);
      if(hex===0xa4bb7f || hex===0x91ab6c){
        grassAt(origin.x+v.x,origin.z+v.z,shade);
        if(v.y<LAND_Y)shade.multiplyScalar(.89);
      }
      color.push(shade.r,shade.g,shade.b);
    }
  };
  const levels=[[-.095,LAND_Y],[-.035,.074],[.05,-.016],[.15,-.16],[.28,-.37],[.42,-.58]];
  const tints=[0x91ab6c,0xa8b780,0xdcc796,0xe8cf9e,0xd7c397];
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
      tri(new T.Vector3(0,LAND_Y,0),layers[0][s+1],layers[0][s],0xa4bb7f,1+.009*Math.sin(k+s+id));
      if(!outer[k])continue;
      for(let l=0;l<levels.length-1;l++){
        const [a,b,c,d]=[layers[l][s],layers[l][s+1],layers[l+1][s],layers[l+1][s+1]];
        const shade=1+.035*Math.sin(id+k*1.7+s);
        tri(a,b,c,tints[l],shade);tri(c,b,d,tints[l],shade+.01);
      }
    }
  }
  const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(pos,3));
  geometry.setAttribute('color',new T.Float32BufferAttribute(color,3));geometry.computeVertexNormals();
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

