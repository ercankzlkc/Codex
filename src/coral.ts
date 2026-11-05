import * as T from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {coast,fromWorld} from './hex';
import {SEA_Y} from './scenery';
import {gameSpeed} from './game-speed';

const hash=(seed:number)=>{const n=Math.sin(seed*127.1+17.7)*43758.5453;return n-Math.floor(n)};
function branchGeometry(fan:boolean){
  const parts:T.BufferGeometry[]=[],up=new T.Vector3(0,1,0);
  const branch=(a:T.Vector3,b:T.Vector3,r:number)=>{
    const direction=b.clone().sub(a);
    const geometry=new T.CylinderGeometry(r*.65,r,direction.length(),5,1);
    geometry.applyQuaternion(new T.Quaternion().setFromUnitVectors(up,direction.clone().normalize()));
    geometry.translate((a.x+b.x)/2,(a.y+b.y)/2,(a.z+b.z)/2);parts.push(geometry);
    parts.push(new T.IcosahedronGeometry(r*.85,0).translate(b.x,b.y,b.z));
  };
  branch(new T.Vector3(),new T.Vector3(0,.65,0),.065);
  for(let i=0;i<5;i++){
    const angle=fan?(i/4-.5)*2.5:i*2.4;
    const start=new T.Vector3(0,.22+i*.07,0);
    const tip=new T.Vector3(Math.sin(angle)*(.25+i*.025),.58+i*.10,fan?Math.cos(angle)*.07:Math.cos(angle)*.27);
    branch(start,tip,.045);
    const end=tip.clone().add(new T.Vector3(Math.sin(angle+.8)*.12,.18,fan?.02:Math.cos(angle+.8)*.12));branch(tip,end,.028);
  }
  const flat=parts.map(part=>part.index?part.toNonIndexed():part);
  const geometry=mergeGeometries(flat,false)!;
  flat.forEach((part,i)=>{part.dispose();if(part!==parts[i])parts[i].dispose()});return geometry;
}
/** Deterministic shallow-water gardens; two draw calls, no per-coral animation objects. */
export class CoralGardens{
  private meshes:T.InstancedMesh[]=[];private clock={value:0};private last=0;
  private matrix=new T.Matrix4();private rotation=new T.Quaternion();private scale=new T.Vector3();private point=new T.Vector3();
  constructor(scene:T.Scene,private depthAt:(x:number,z:number)=>number){
    for(let variant=0;variant<2;variant++){
      const material=new T.MeshLambertMaterial({color:0xffffff,flatShading:true});
      material.onBeforeCompile=shader=>{
        shader.uniforms.uReefTime=this.clock;
        shader.vertexShader='uniform float uReefTime;\n'+shader.vertexShader;
        shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>',`#include <begin_vertex>
          float reefPhase=instanceMatrix[3].x*.71+instanceMatrix[3].z*.53;
          float reefBend=pow(max(position.y,0.),1.7);
          transformed.x+=sin(uReefTime*.65+reefPhase)*reefBend*.045;
          transformed.z+=cos(uReefTime*.49+reefPhase)*reefBend*.028;`);
      };
      material.customProgramCacheKey=()=>'coral-gentle-current-v1';
      const mesh=new T.InstancedMesh(branchGeometry(variant===1),material,60);
      mesh.count=0;mesh.castShadow=false;mesh.receiveShadow=true;mesh.userData.underwater=true;scene.add(mesh);this.meshes.push(mesh);
    }
  }
  sync(board:ReadonlyMap<number,unknown>){
    const counts=[0,0],placed:{x:number;z:number}[]=[],colors=['#ee927e','#d99bc9','#e7bc71','#95cbbb','#ba9bdf'];
    for(const edge of coast(board)){
      const seed=edge.id*13+edge.side*101;if(hash(seed)<.38)continue;
      const dx=edge.bx-edge.ax,dz=edge.bz-edge.az,len=Math.max(.001,Math.hypot(dx,dz));
      const midX=(edge.ax+edge.bx)/2,midZ=(edge.az+edge.bz)/2;
      const sign=board.has(fromWorld(midX-dz/len*.35,midZ+dx/len*.35))?-1:1;
      for(let member=0;member<3;member++){
        const n=seed+member*37,along=.2+hash(n+1)*.6,offset=.65+hash(n+2)*1.4;
        const x=edge.ax+dx*along-dz/len*offset*sign,z=edge.az+dz*along+dx/len*offset*sign,depth=this.depthAt(x,z);
        if(!Number.isFinite(depth)||depth<.42||depth>1.6||board.has(fromWorld(x,z)))continue;
        if(placed.some(p=>Math.hypot(p.x-x,p.z-z)<.32))continue;
        const variant=hash(n+3)>.5?1:0;if(counts[variant]>=60)continue;
        placed.push({x,z});const size=Math.min(.25+hash(n+4)*.16,(depth-.12)/1.2);
        this.point.set(x,SEA_Y-depth+.018,z);this.rotation.setFromAxisAngle(new T.Vector3(0,1,0),hash(n+5)*Math.PI*2);
        this.matrix.compose(this.point,this.rotation,this.scale.set(size,size,size));
        const index=counts[variant]++;this.meshes[variant].setMatrixAt(index,this.matrix);
        this.meshes[variant].setColorAt(index,new T.Color(colors[Math.floor(hash(n+6)*colors.length)]));
      }
    }
    this.meshes.forEach((mesh,i)=>{mesh.count=counts[i];mesh.instanceMatrix.needsUpdate=true;if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;mesh.computeBoundingSphere()});
  }
  update(time:number){this.clock.value+=Math.max(0,Math.min(.26,time-this.last))/Math.max(1,gameSpeed.value);this.last=time}
  reset(){this.clock.value=0;for(const mesh of this.meshes)mesh.count=0}
}
