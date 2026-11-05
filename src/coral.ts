import * as T from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {torchField} from './torch-light';
import {coast,fromWorld} from './hex';
import {SEA_Y} from './scenery';
import {optics} from './water/shaders';
import {sampleReefCurrent,type OceanUniforms} from './water/motion';

const hash=(seed:number)=>{const n=Math.sin(seed*127.1+17.7)*43758.5453;return n-Math.floor(n)};
const CAPACITY=24;
const palettes=[
  ['#c888bd','#d999bd','#b5a0cf'], // sea fans
  ['#ed9d83','#e89aaf','#dcb077'], // finger colonies
  ['#a797c9','#b5a4d0','#dd9aab'], // ruffled rosettes
  ['#78bbae','#95c6ae','#c1a0c8'], // soft polyps
];

/** Opaque solids are drawn below the water, receiving light without a glowing outline. */
function underwaterLight(material:T.MeshStandardMaterial,uniforms:OceanUniforms){
  const previous=material.onBeforeCompile,key=material.customProgramCacheKey();
  material.onBeforeCompile=function(shader,renderer){
    previous.call(this,shader,renderer);
    Object.assign(shader.uniforms,uniforms);
    shader.uniforms.uReefTorch=torchField.map;shader.uniforms.uReefTorchRegion=torchField.region;
    shader.vertexShader='varying vec3 vReefWorld;\n'+shader.vertexShader;
    shader.vertexShader=shader.vertexShader.replace('#include <project_vertex>',`
      #include <project_vertex>
      vReefWorld=(modelMatrix*instanceMatrix*vec4(transformed,1.)).xyz;
    `);
    shader.fragmentShader='varying vec3 vReefWorld;\nuniform sampler2D uReefTorch;uniform vec4 uReefTorchRegion;\n'+optics+'\n'+shader.fragmentShader;
    shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`
      #include <color_fragment>
      float reefDepth=max(0.,-.18-vReefWorld.y);
      vec2 reefFlow=current(vReefWorld.xz);
      Lens reefLens=lightNet(vReefWorld.xz+reefDepth*vec2(.19,-.12),reefFlow,vec4(0.));
      float reefDay=(1.-uNight)*(1.-uFreeze)*exp(-reefDepth*.7);
      diffuseColor.rgb*=.97+(reefLens.thread*.17+reefLens.halo*.045)*reefDay;
    `);
    shader.fragmentShader=shader.fragmentShader.replace('#include <opaque_fragment>',`
      vec2 reefUv=(vReefWorld.xz-uReefTorchRegion.xy)/uReefTorchRegion.zw;
      float reefInside=step(0.,reefUv.x)*step(0.,reefUv.y)*step(reefUv.x,1.)*step(reefUv.y,1.);
      float reefWarm=texture2D(uReefTorch,clamp(reefUv,0.,1.)).g*reefInside;
      outgoingLight+=diffuseColor.rgb*(vec3(.012)*reefDay+vec3(1.,.86,.68)*reefWarm*.38*exp(-reefDepth*.75));
      outgoingLight*=mix(vec3(1.),vec3(.73,.94,.98),1.-exp(-reefDepth*.45));
      #include <opaque_fragment>
    `);
  };
  material.customProgramCacheKey=()=>key+'-reef-optics-v2';
}

function coralGeometry(type:number){
  const parts:T.BufferGeometry[]=[];
  const add=(geometry:T.BufferGeometry,shade=1)=>{
    geometry.deleteAttribute('uv');
    const pos=geometry.getAttribute('position'),color=new Float32Array(pos.count*3);
    for(let i=0;i<pos.count;i++){
      const tip=T.MathUtils.smoothstep(pos.getY(i),.08,.95);
      color[i*3]=shade*(.80+.20*tip);color[i*3+1]=shade*(.74+.24*tip);color[i*3+2]=shade*(.81+.19*tip);
    }
    geometry.setAttribute('color',new T.BufferAttribute(color,3));parts.push(geometry);
  };
  const tube=(points:T.Vector3[],radius:number,shade:number)=>{
    const curve=new T.CatmullRomCurve3(points);
    const geometry=new T.TubeGeometry(curve,7,radius,5,false),pos=geometry.getAttribute('position');
    // TubeGeometry supplies frames; taper each ring without losing the curved centreline.
    for(let ring=0;ring<=7;ring++){
      const t=ring/7,center=curve.getPointAt(t),taper=.18+.82*Math.pow(1-t,.65);
      for(let side=0;side<=5;side++){
        const i=ring*6+side;
        pos.setXYZ(i,center.x+(pos.getX(i)-center.x)*taper,center.y+(pos.getY(i)-center.y)*taper,center.z+(pos.getZ(i)-center.z)*taper);
      }
    }
    geometry.computeVertexNormals();add(geometry,shade);
    const end=points[points.length-1];add(new T.IcosahedronGeometry(radius*.24,0).translate(end.x,end.y,end.z),1);
  };
  if(type===0){
    // A thin, scalloped sea-fan membrane with fine ribs, not a woody branching trunk.
    const pos:number[]=[],indices:number[]=[];
    const bands=3,sectors=12,base=.07;
    for(let ring=0;ring<=bands;ring++)for(let j=0;j<=sectors;j++){
      const angle=-1.15+j/sectors*2.3,t=ring/bands;
      const edge=.78+.07*Math.sin(j*2.1)+.04*Math.cos(j*3.7),r=edge*t;
      pos.push(Math.sin(angle)*r*.58,base+Math.cos(angle)*r,.018*Math.sin(j*1.5)*t+.035*t*t);
    }
    for(let r=0;r<bands;r++)for(let j=0;j<sectors;j++){
      const a=r*(sectors+1)+j,b=a+sectors+1;
      indices.push(a,b,a+1,a+1,b,b+1);
    }
    const fan=new T.BufferGeometry();fan.setAttribute('position',new T.Float32BufferAttribute(pos,3));fan.setIndex(indices);fan.computeVertexNormals();add(fan,.93);
    for(let j=0;j<=sectors;j+=2){
      const a=-1.15+j/sectors*2.3,r=.78+.07*Math.sin(j*2.1)+.04*Math.cos(j*3.7);
      tube([new T.Vector3(0,.025,0),new T.Vector3(Math.sin(a)*r*.3,.07+Math.cos(a)*r*.55,.018),new T.Vector3(Math.sin(a)*r*.58,.07+Math.cos(a)*r,.018*Math.sin(j*1.5)+.035)],.012,.88);
    }
  }else if(type===1){
    for(let i=0;i<6;i++){
      const a=i*2.39996,r=i===0?0:.13,h=.64+hash(i+31)*.40;
      const x=Math.sin(a)*r,z=Math.cos(a)*r,lean=Math.sin(a+.7)*.12;
      const middle=new T.Vector3(x+lean*.4,h*.54,z+.025);
      tube([new T.Vector3(x*.7,0,z*.7),middle,new T.Vector3(x+lean,h,z+Math.cos(a)*.09)],.027,.92+hash(i+11)*.08);
      const side=new T.Vector3(x+lean*.4+Math.cos(a)*.12,h*.78,z+.025+Math.sin(a)*.09);
      tube([middle.clone().multiply(new T.Vector3(1,.88,1)),middle.clone().lerp(side,.5),side],.017,.95);
    }
  }else if(type===2){
    // Thin curled plates grow upward around a small centre, like an underwater rosette.
    for(let layer=0;layer<4;layer++){
      const pos:number[]=[],indices:number[]=[],segments=16,rings=3,radius=.27-layer*.027;
      for(let r=0;r<=rings;r++)for(let j=0;j<=segments;j++){
        const a=j/segments*Math.PI*2,t=r/rings,rim=1+.10*Math.sin(a*5+layer*1.7);
        pos.push(Math.cos(a)*radius*t*rim,.045+layer*.105+.075*t*t+.022*Math.sin(a*5+layer)*t,Math.sin(a)*radius*t*rim);
      }
      for(let r=0;r<rings;r++)for(let j=0;j<segments;j++){const a=r*(segments+1)+j,b=a+segments+1;indices.push(a,a+1,b,a+1,b+1,b)}
      const plate=new T.BufferGeometry();plate.setAttribute('position',new T.Float32BufferAttribute(pos,3));plate.setIndex(indices);plate.computeVertexNormals();
      plate.rotateY(layer*.9);plate.translate(Math.sin(layer*2)*.035,0,Math.cos(layer*2)*.025);add(plate,.84+layer*.045);
    }
  }else{
    add(new T.IcosahedronGeometry(.17,1).scale(1,.20,1).translate(0,.025,0),.78);
    for(let i=0;i<13;i++){
      const a=i*2.39996,r=.04+.09*hash(i+71),h=.28+hash(i+91)*.24;
      const start=new T.Vector3(Math.sin(a)*r,.025,Math.cos(a)*r);
      tube([start,new T.Vector3(start.x*1.2,h*.5,start.z*1.2),new T.Vector3(start.x+Math.sin(a+.6)*.065,h,start.z+Math.cos(a+.6)*.065)],.020,.93+hash(i+32)*.07);
    }
  }
  const flat=parts.map(part=>part.index?part.toNonIndexed():part),geometry=mergeGeometries(flat,false)!;
  flat.forEach((part,i)=>{part.dispose();if(part!==parts[i])parts[i].dispose()});
  geometry.computeBoundingBox();geometry.computeBoundingSphere();geometry.boundingSphere!.radius+=.18;
  return geometry;
}

type Colony={key:string;variant:number;index:number;x:number;z:number;yaw:number;phase:number;birth:number;flow:T.Vector2};
export class CoralGardens{
  private meshes:T.InstancedMesh[]=[];
  private motions:T.InstancedBufferAttribute[]=[];
  private colonies:Colony[]=[];
  private rocks:T.InstancedMesh;
  private lastTime=0;
  private current=new T.Vector2();
  constructor(scene:T.Scene,private depthAt:(x:number,z:number)=>number,private uniforms:OceanUniforms){
    for(let variant=0;variant<4;variant++){
      const geometry=coralGeometry(variant),height=Math.max(.1,geometry.boundingBox!.max.y);
      const motion=new T.InstancedBufferAttribute(new Float32Array(CAPACITY*4),4);motion.setUsage(T.DynamicDrawUsage);
      geometry.setAttribute('aReefMotion',motion);this.motions.push(motion);
      const material=new T.MeshStandardMaterial({color:0xffffff,vertexColors:true,side:T.DoubleSide,flatShading:true,roughness:.92});
      const flex=variant===2?.28:variant===0?.65:1;
      material.onBeforeCompile=shader=>{
        shader.uniforms.uTime=this.uniforms.uTime;
        shader.vertexShader=`
          uniform float uTime;
          attribute vec4 aReefMotion;
          vec2 reefBend(float y){
            float t=clamp(y/${height.toFixed(5)},0.,1.);
            return aReefMotion.xy*t*t*${flex.toFixed(3)};
          }
        `+shader.vertexShader;
        shader.vertexShader=shader.vertexShader.replace('#include <beginnormal_vertex>',`
          #include <beginnormal_vertex>
          float reefHeight=clamp(position.y/${height.toFixed(5)},0.,1.);
          objectNormal.y-=dot(objectNormal.xz,aReefMotion.xy)*2.*reefHeight*${(flex/height).toFixed(5)};
        `);
        shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>',`
          #include <begin_vertex>
          transformed.xz+=reefBend(position.y);
          float reefAppear=smoothstep(0.,1.25,uTime-aReefMotion.z);
          transformed*=max(.001,reefAppear);
        `);
      };
      material.customProgramCacheKey=()=>`cozy-reef-${variant}-v4`;
      underwaterLight(material,this.uniforms);
      const mesh=new T.InstancedMesh(geometry,material,CAPACITY);
      mesh.count=0;mesh.receiveShadow=true;mesh.userData.underwater=true;scene.add(mesh);this.meshes.push(mesh);
    }
    const material=new T.MeshStandardMaterial({color:0x9ba8a0,roughness:1,flatShading:true});
    underwaterLight(material,this.uniforms);
    this.rocks=new T.InstancedMesh(new T.IcosahedronGeometry(.5,0),material,48);
    this.rocks.count=0;this.rocks.receiveShadow=true;this.rocks.userData.underwater=true;scene.add(this.rocks);
  }
  sync(board:ReadonlyMap<number,unknown>){
    const previous=new Map(this.colonies.map(c=>[c.key,c])),candidates:{key:string;seed:number;x:number;z:number;variant:number}[]=[];
    for(const edge of coast(board)){
      const seed=edge.id*13+edge.side*101;if(hash(seed)<.22)continue;
      const dx=edge.bx-edge.ax,dz=edge.bz-edge.az,len=Math.max(.001,Math.hypot(dx,dz));
      const mx=(edge.ax+edge.bx)/2,mz=(edge.az+edge.bz)/2;
      const sign=board.has(fromWorld(mx-dz/len*.35,mz+dx/len*.35))?-1:1;
      for(let member=0;member<3;member++){
        const n=seed+member*37,along=.18+hash(n+1)*.64,offset=.72+hash(n+2)*1.12;
        const x=edge.ax+dx*along-dz/len*offset*sign,z=edge.az+dz*along+dx/len*offset*sign,depth=this.depthAt(x,z);
        if(!Number.isFinite(depth)||depth<.38||depth>1.50||board.has(fromWorld(x,z)))continue;
        candidates.push({key:`${edge.id}:${edge.side}:${member}`,seed:n,x,z,variant:Math.floor(hash(n+3)*4)});
      }
    }
    // Preserve surviving gardens as the map expands, then fill remaining slots by stable seed.
    candidates.sort((a,b)=>Number(previous.has(b.key))-Number(previous.has(a.key))||hash(a.seed+97)-hash(b.seed+97));
    const counts=[0,0,0,0],colonies:Colony[]=[],o=new T.Object3D();let rocks=0;
    const now=this.uniforms.uTime.value as number,initial=previous.size===0;
    for(const c of candidates){
      if(counts[c.variant]>=CAPACITY||colonies.some(p=>Math.hypot(p.x-c.x,p.z-c.z)<.38))continue;
      const size=.53+hash(c.seed+4)*.20;
      // Bury the foot slightly on sloping seabeds; the tallest tip stays below the trough.
      const depth=Math.max(this.depthAt(c.x,c.z),this.depthAt(c.x+.12,c.z),this.depthAt(c.x-.12,c.z),this.depthAt(c.x,c.z+.12),this.depthAt(c.x,c.z-.12));
      const geometry=this.meshes[c.variant].geometry,height=geometry.boundingBox!.max.y;
      const sy=Math.min(size*(c.variant===2?1.0:1.35),(depth-.15)/height);
      if(sy<.18)continue;
      const yaw=hash(c.seed+5)*Math.PI*2,index=counts[c.variant]++;
      o.position.set(c.x,SEA_Y-depth+.006,c.z);o.rotation.set(0,yaw,0);o.scale.set(size*.72,sy,size*(c.variant===0?.6:.72));o.updateMatrix();
      this.meshes[c.variant].setMatrixAt(index,o.matrix);
      const palette=palettes[c.variant],color=new T.Color(palette[Math.floor(hash(c.seed+6)*palette.length)]);
      color.offsetHSL((hash(c.seed+19)-.5)*.025,0,(hash(c.seed+20)-.5)*.035);this.meshes[c.variant].setColorAt(index,color);
      const old=previous.get(c.key),birth=old?.birth??(initial?now-2:now);
      const colony:Colony={...c,index,yaw,phase:hash(c.seed+9)*6.28,birth,flow:old?.flow??new T.Vector2()};
      colonies.push(colony);this.motions[c.variant].setXYZW(index,colony.flow.x,colony.flow.y,birth,colony.phase);
      if(hash(c.seed+8)<.45&&rocks<48){
        const x=c.x+.19,z=c.z+.13,d=this.depthAt(x,z);
        if(d>.28&&!board.has(fromWorld(x,z))){
          o.position.set(x,SEA_Y-d+.035,z);o.scale.set(.15,.095,.12);o.updateMatrix();this.rocks.setMatrixAt(rocks++,o.matrix);
        }
      }
    }
    this.colonies=colonies;
    this.meshes.forEach((mesh,i)=>{
      mesh.count=counts[i];mesh.instanceMatrix.needsUpdate=true;this.motions[i].needsUpdate=true;
      if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;mesh.computeBoundingSphere();
    });
    this.rocks.count=rocks;this.rocks.instanceMatrix.needsUpdate=true;this.rocks.computeBoundingSphere();
  }
  update(){
    const now=this.uniforms.uTime.value as number,dt=Math.max(0,Math.min(.065,now-this.lastTime));this.lastTime=now;
    if(dt<=0)return;
    for(const c of this.colonies){
      sampleReefCurrent(this.uniforms,c.x,c.z,this.current);
      const depth=this.depthAt(c.x,c.z),damping=Math.exp(-depth*.35);
      const cos=Math.cos(c.yaw),sin=Math.sin(c.yaw);
      const x=(cos*this.current.x-sin*this.current.y)*damping,z=(sin*this.current.x+cos*this.current.y)*damping;
      const response=1-Math.exp(-dt*(2.4+.4*Math.sin(c.phase)));
      c.flow.x+=(x-c.flow.x)*response;c.flow.y+=(z-c.flow.y)*response;
      this.motions[c.variant].setXYZW(c.index,c.flow.x,c.flow.y,c.birth,c.phase);
    }
    this.motions.forEach((a,i)=>{if(this.meshes[i].count)a.needsUpdate=true});
  }
  reset(){this.colonies=[];this.lastTime=this.uniforms.uTime.value;for(const mesh of this.meshes)mesh.count=0;this.rocks.count=0}
}
