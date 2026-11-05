import * as T from 'three';
import {torchField} from './torch-light';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {coast,fromWorld} from './hex';
import {SEA_Y} from './scenery';
import {gameSpeed} from './game-speed';

/** Keep submerged solids opaque while receiving the same attenuated warm light as the bed. */
function underwaterLight(material:T.MeshStandardMaterial){
  material.transparent=false;material.opacity=1;material.depthWrite=true;
  const previous=material.onBeforeCompile,key=material.customProgramCacheKey();
  material.onBeforeCompile=function(shader,renderer){
    previous.call(this,shader,renderer);
    shader.uniforms.uReefTorch=torchField.map;shader.uniforms.uReefTorchRegion=torchField.region;
    shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 vReefWorld;');
    shader.vertexShader=shader.vertexShader.replace('#include <project_vertex>','#include <project_vertex>\nvReefWorld=(modelMatrix*instanceMatrix*vec4(transformed,1.)).xyz;');
    shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\nuniform sampler2D uReefTorch;uniform vec4 uReefTorchRegion;varying vec3 vReefWorld;');
    shader.fragmentShader=shader.fragmentShader.replace('#include <opaque_fragment>',`
      vec2 reefLightUv=(vReefWorld.xz-uReefTorchRegion.xy)/uReefTorchRegion.zw;
      float reefInside=step(0.,reefLightUv.x)*step(0.,reefLightUv.y)*step(reefLightUv.x,1.)*step(reefLightUv.y,1.);
      float reefWarm=texture2D(uReefTorch,clamp(reefLightUv,0.,1.)).g*reefInside;
      outgoingLight+=diffuseColor.rgb*vec3(1.,.58,.27)*reefWarm*exp(-max(0.,-.18-vReefWorld.y)*.75)*.65;
      #include <opaque_fragment>
    `);
  };
  material.customProgramCacheKey=()=>key+'-submerged-warm-solid-v1';
}
const hash=(seed:number)=>{const n=Math.sin(seed*127.1+17.7)*43758.5453;return n-Math.floor(n)};
function coralGeometry(type:number){
  const parts:T.BufferGeometry[]=[];
  const add=(geometry:T.BufferGeometry,shade=1)=>{
    const values=new Float32Array(geometry.getAttribute('position').count*3);
    for(let i=0;i<values.length;i+=3){values[i]=shade;values[i+1]=shade*.97;values[i+2]=shade}
    geometry.setAttribute('color',new T.BufferAttribute(values,3));parts.push(geometry);
  };
  if(type===0){
    // Broad fleshy brain-coral mound with interlocking rounded lobes, no trunk.
    add(new T.IcosahedronGeometry(.48,1).scale(1,.63,.9).translate(0,.25,0),.76);
    for(let i=0;i<12;i++){
      const angle=i*2.39996,r=.13+.22*hash(i+3);
      const lobe=new T.SphereGeometry(.14,7,4).scale(1,.65,1.35);
      lobe.rotateY(angle);lobe.translate(Math.sin(angle)*r,.32+hash(i+8)*.12,Math.cos(angle)*r);add(lobe,.9+hash(i)*.1);
    }
  }else if(type===1){
    // Hollow tube sponges with a bright rolled rim and a recessed dark opening.
    for(let i=0;i<5;i++){
      const a=i*2.4,r=i===0?0:.23,x=Math.sin(a)*r,z=Math.cos(a)*r,h=.35+hash(i+31)*.42;
      add(new T.CylinderGeometry(.10,.14,h,8,1,true).translate(x,h/2,z),.85);
      add(new T.TorusGeometry(.10,.025,4,8).rotateX(Math.PI/2).translate(x,h,z),1);
      add(new T.CircleGeometry(.078,8).rotateX(-Math.PI/2).translate(x,h-.06,z),.24);
    }
  }else if(type===2){
    // Overlapping scalloped plates: wide, thin shelves rather than bare branches.
    for(let layer=0;layer<4;layer++){
      const r=.46-layer*.065,geometry=new T.CylinderGeometry(r,r*.9,.045,14,1);
      const vertices=geometry.getAttribute('position');
      for(let i=0;i<vertices.count;i++){
        const x=vertices.getX(i),z=vertices.getZ(i),a=Math.atan2(z,x),distance=Math.hypot(x,z);
        vertices.setY(i,vertices.getY(i)+Math.sin(a*5+layer)*.035*distance/r);
      }
      geometry.computeVertexNormals();geometry.rotateY(layer*.8);geometry.translate(Math.sin(layer*2)*.06,.10+layer*.105,Math.cos(layer*2)*.05);add(geometry,.78+layer*.065);
    }
  }else{
    // A cushion of soft bulb-tipped polyps, thick enough to read as living coral.
    add(new T.IcosahedronGeometry(.33,1).scale(1,.4,1).translate(0,.10,0),.64);
    for(let i=0;i<9;i++){
      const a=i*2.39996,r=i===0?0:.22,x=Math.sin(a)*r,z=Math.cos(a)*r,h=.24+hash(i+91)*.32;
      const stalk=new T.CylinderGeometry(.047,.075,h,6);stalk.rotateZ(Math.sin(a)*.18);stalk.translate(x,h/2,z);add(stalk,.9);
      add(new T.IcosahedronGeometry(.075,1).scale(1,.75,1).translate(x,h,z),1);
    }
  }
  const flat=parts.map(part=>part.index?part.toNonIndexed():part),geometry=mergeGeometries(flat,false)!;
  flat.forEach((part,i)=>{part.dispose();if(part!==parts[i])parts[i].dispose()});geometry.computeBoundingBox();return geometry;
}
export class CoralGardens{
  private meshes:T.InstancedMesh[]=[];private clock={value:0};private last=0;
  private rocks:T.InstancedMesh;
  private matrix=new T.Matrix4();private rotation=new T.Quaternion();private scale=new T.Vector3();private point=new T.Vector3();
  constructor(scene:T.Scene,private depthAt:(x:number,z:number)=>number){
    for(let variant=0;variant<4;variant++){
      const material=new T.MeshStandardMaterial({color:0xffffff,vertexColors:true,flatShading:true,roughness:.88});
      material.onBeforeCompile=shader=>{
        shader.uniforms.uReefTime=this.clock;
        shader.vertexShader='uniform float uReefTime;\n'+shader.vertexShader;
        shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>',`#include <begin_vertex>
          float reefPhase=instanceMatrix[3].x*.71+instanceMatrix[3].z*.53;
          float reefBend=pow(max(position.y,0.),1.7);
          transformed.x+=sin(uReefTime*.55+reefPhase)*reefBend*${variant===3?'.09':'.025'};
          transformed.z+=cos(uReefTime*.41+reefPhase)*reefBend*.025;`);
        shader.fragmentShader=shader.fragmentShader.replace('#include <emissivemap_fragment>','#include <emissivemap_fragment>\ntotalEmissiveRadiance+=diffuseColor.rgb*.055;');
      };
      material.customProgramCacheKey=()=>`reef-species-${variant}-v2`;
      underwaterLight(material);
      const mesh=new T.InstancedMesh(coralGeometry(variant),material,24);
      mesh.count=0;mesh.castShadow=false;mesh.receiveShadow=true;mesh.userData.underwater=true;scene.add(mesh);this.meshes.push(mesh);
    }
    this.rocks=new T.InstancedMesh(new T.IcosahedronGeometry(.5,1),new T.MeshStandardMaterial({color:0x91a6a0,roughness:1,flatShading:true}),48);
    underwaterLight(this.rocks.material as T.MeshStandardMaterial);
    this.rocks.count=0;this.rocks.receiveShadow=true;this.rocks.userData.underwater=true;scene.add(this.rocks);
  }
  sync(board:ReadonlyMap<number,unknown>){
    const counts=[0,0,0,0],placed:{x:number;z:number}[]=[],colors=['#ff7859','#e45fa8','#f4b752','#4cc9b0','#9b71e0','#eb8ab3'];
    let rocks=0;
    for(const edge of coast(board)){
      const seed=edge.id*13+edge.side*101;if(hash(seed)<.30)continue;
      const dx=edge.bx-edge.ax,dz=edge.bz-edge.az,len=Math.max(.001,Math.hypot(dx,dz)),midX=(edge.ax+edge.bx)/2,midZ=(edge.az+edge.bz)/2;
      const sign=board.has(fromWorld(midX-dz/len*.35,midZ+dx/len*.35))?-1:1;
      for(let member=0;member<3;member++){
        const n=seed+member*37,along=.12+hash(n+1)*.76,offset=.65+hash(n+2)*1.1;
        const x=edge.ax+dx*along-dz/len*offset*sign,z=edge.az+dz*along+dx/len*offset*sign,depth=this.depthAt(x,z);
        if(!Number.isFinite(depth)||depth<.38||depth>1.45||board.has(fromWorld(x,z)))continue;
        if(placed.some(p=>Math.hypot(p.x-x,p.z-z)<.48))continue;
        const variant=Math.floor(hash(n+3)*4);if(counts[variant]>=24)continue;
        placed.push({x,z});const size=.48+hash(n+4)*.22;
        const height=this.meshes[variant].geometry.boundingBox!.max.y;
        const sy=Math.min(size*(.85+hash(n+14)*.3),(depth-.10)/Math.max(.1,height));
        this.point.set(x,SEA_Y-depth+.012,z);this.rotation.setFromAxisAngle(new T.Vector3(0,1,0),hash(n+5)*Math.PI*2);
        this.matrix.compose(this.point,this.rotation,this.scale.set(size*(.85+hash(n+7)*.3),sy,size));
        const index=counts[variant]++;this.meshes[variant].setMatrixAt(index,this.matrix);
        this.meshes[variant].setColorAt(index,new T.Color(colors[Math.floor(hash(n+6)*colors.length)]));
        if(member===0&&rocks<48){
          const rx=x+.24,rz=z+.13,d=this.depthAt(rx,rz);
          if(!board.has(fromWorld(rx,rz))&&d>.3){
            this.point.set(rx,SEA_Y-d+.05,rz);this.matrix.compose(this.point,this.rotation,this.scale.set(.24,.13,.19));this.rocks.setMatrixAt(rocks++,this.matrix);
          }
        }
      }
    }
    this.meshes.forEach((mesh,i)=>{mesh.count=counts[i];mesh.instanceMatrix.needsUpdate=true;if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;mesh.computeBoundingSphere()});
    this.rocks.count=rocks;this.rocks.instanceMatrix.needsUpdate=true;this.rocks.computeBoundingSphere();
  }
  update(time:number){this.clock.value+=Math.max(0,Math.min(.26,time-this.last))/Math.max(1,gameSpeed.value);this.last=time}
  reset(){this.clock.value=0;for(const mesh of this.meshes)mesh.count=0;this.rocks.count=0}
}
