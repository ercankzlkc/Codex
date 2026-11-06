import * as T from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {torchLight,updateTorchField} from './torch-light';
import {climate} from './climate';
import {position} from './hex';
import {LAND_Y} from './scenery';
import type {Game} from './game';

type Anchor={key:string;id:number;position:T.Vector3;strength:number};
const FLAME_LAYERS=4;
/** A full-bodied, curved flame silhouette, rather than a straight cone. */
function flameGeometry(){
  const profile=[[0,.16],[.13,.36],[.32,.48],[.51,.43],[.69,.31],[.84,.19],[.95,.085],[1,0]],sides=8,vertices:number[]=[];
  const ring=(i:number,j:number)=>{
    const [height,radius]=profile[i],angle=j/sides*Math.PI*2+height*.24;
    return [Math.cos(angle)*radius+height*height*.23,height,Math.sin(angle)*radius+Math.sin(height*Math.PI)*.07];
  };
  for(let i=0;i<profile.length-1;i++)for(let j=0;j<sides;j++){
    const a=ring(i,j),b=ring(i,j+1),c=ring(i+1,j),d=ring(i+1,j+1);
    vertices.push(...a,...c,...b);if(i<profile.length-2)vertices.push(...b,...c,...d);
  }
  const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(vertices,3));geometry.computeVertexNormals();return geometry;
}
/** Weathered timber, forged basket and bound kindling share one instanced mesh. */
function holderGeometry(){
  const parts:T.BufferGeometry[]=[];
  const add=(geometry:T.BufferGeometry,hex:number)=>{
    const tint=new T.Color(hex),values=new Float32Array(geometry.getAttribute('position').count*3);
    for(let i=0;i<values.length;i+=3){values[i]=tint.r;values[i+1]=tint.g;values[i+2]=tint.b}
    geometry.setAttribute('color',new T.BufferAttribute(values,3));parts.push(geometry);
  };
  add(new T.CylinderGeometry(.022,.028,.45,6).translate(0,-.305,0),0x997448);
  add(new T.BoxGeometry(.004,.21,.012).translate(.021,-.31,.007),0x775332);
  add(new T.BoxGeometry(.012,.14,.004).translate(-.005,-.35,.024),0xbc9560);
  add(new T.BoxGeometry(.059,.055,.059).translate(0,-.523,0),0x454d4c);
  for(const y of [-.455,-.135]){
    add(new T.CylinderGeometry(.031,.031,.020,6).translate(0,y,0),0x4c5554);
    for(let i=0;i<3;i++){
      const angle=i*Math.PI*2/3;
      add(new T.SphereGeometry(.0045,6,4).translate(Math.sin(angle)*.031,y,Math.cos(angle)*.031),0x8a9390);
    }
  }
  add(new T.CylinderGeometry(.034,.026,.026,6).translate(0,-.088,0),0x65706a);
  add(new T.CylinderGeometry(.058,.032,.062,8).translate(0,-.044,0),0x414a49);
  add(new T.TorusGeometry(.055,.006,4,8).rotateX(Math.PI/2).translate(0,-.011,0),0x7a8075);
  add(new T.CylinderGeometry(.047,.047,.009,8).translate(0,-.009,0),0x3d3029);
  for(let i=0;i<4;i++){
    const angle=i*Math.PI/2+Math.PI/4;
    const bottom=new T.Vector3(Math.sin(angle)*.039,-.052,Math.cos(angle)*.039),top=new T.Vector3(Math.sin(angle)*.064,.026,Math.cos(angle)*.064);
    const prong=new T.BoxGeometry(.009,bottom.distanceTo(top),.009);
    prong.applyQuaternion(new T.Quaternion().setFromUnitVectors(new T.Vector3(0,1,0),top.clone().sub(bottom).normalize()));
    prong.translate((bottom.x+top.x)/2,(bottom.y+top.y)/2,(bottom.z+top.z)/2);add(prong,0x68726a);
  }
  for(let i=0;i<3;i++){
    const angle=i*Math.PI*2/3;
    add(new T.CylinderGeometry(.008,.011,.062,5).rotateZ(.22).rotateY(angle).translate(Math.sin(angle)*.020,.004,Math.cos(angle)*.020),i===1?0x80603e:0x5d4330);
  }
  const geometry=mergeGeometries(parts,false)!;parts.forEach(part=>part.dispose());return geometry;
}
const vertex=`
uniform float uTime;varying vec3 vFire;varying float vHeight,vShade;
void main(){
  #ifdef USE_INSTANCING_COLOR
  vFire=instanceColor;
  #else
  vFire=vec3(1.,0.,0.);
  #endif
  vec3 p=position;float t=uTime+vFire.g*19.+vFire.b*3.7;
  p.x+=p.y*p.y*(sin(t*3.2)*.17+sin(t*5.7)*.065);
  p.z+=p.y*p.y*sin(t*2.8+1.4)*.11;
  p.y*=1.+sin(t*4.1)*.035;
  vHeight=position.y;vShade=.92+normal.x*.055+normal.z*.065;
  gl_Position=projectionMatrix*modelViewMatrix*instanceMatrix*vec4(p,1.);
}`;
const flameFragment=`
varying vec3 vFire;varying float vHeight,vShade;
void main(){
  vec3 outer=mix(vec3(1.,.63,.12),vec3(.98,.27,.055),smoothstep(.12,.95,vHeight));
  vec3 inner=mix(vec3(1.,.95,.65),vec3(1.,.75,.27),vHeight);
  gl_FragColor=vec4(mix(outer,inner,smoothstep(.55,1.,vFire.b))*vShade,clamp(vFire.r,0.,1.)*.94);
  #include <colorspace_fragment>
}`;
const glowVertex=`
varying vec2 vUv;varying vec3 vFire;
void main(){
  vUv=uv;
  #ifdef USE_INSTANCING_COLOR
  vFire=instanceColor;
  #else
  vFire=vec3(1.,0.,0.);
  #endif
  gl_Position=projectionMatrix*modelViewMatrix*instanceMatrix*vec4(position,1.);
}`;
const glowFragment=`
uniform float uTime;uniform float uWater;varying vec2 vUv;varying vec3 vFire;
void main(){
  vec2 p=(vUv-.5)*2.;
  float radial=exp(-dot(p,p)*3.)*(1.-smoothstep(.55,1.,length(p)));
  float flicker=.95+.035*sin(uTime*3.2+vFire.g*20.)+.015*sin(uTime*5.7+vFire.g*43.);
  float alpha=radial*flicker*vFire.r*.065;
  gl_FragColor=vec4(vec3(1.,.72,.43),alpha);
}`;
/** Low-poly holders and layered flames, and a shared warm-light field, independent of fence count. */
export class FenceTorches{
  private capacity=0;private flames:T.InstancedMesh|null=null;private ground:T.InstancedMesh|null=null;private holder:T.InstancedMesh|null=null;
  private selected=new Set<string>();private selectionKey='';
  selectAnchors(anchors:readonly Anchor[]){
    const key=anchors.map(a=>a.key).sort().join('|');
    if(key!==this.selectionKey){
      const survivors=new Set(this.selected);this.selectionKey=key;this.selected.clear();const chosen:Anchor[]=[],counts=new Map<number,number>();
      for(const anchor of [...anchors].sort((a,b)=>Number(survivors.has(b.key))-Number(survivors.has(a.key))||a.id-b.id||a.key.localeCompare(b.key))){
        if((counts.get(anchor.id)??0)>=2||chosen.some(other=>other.position.distanceToSquared(anchor.position)<1.35**2))continue;
        chosen.push(anchor);this.selected.add(anchor.key);counts.set(anchor.id,(counts.get(anchor.id)??0)+1);
      }
    }
    return anchors.filter(anchor=>this.selected.has(anchor.key));
  }
  private clock={value:0};private levels=new Map<string,number>();private heat=new Map<string,number>();
  private lights:T.PointLight[]=[];
  private fieldClock=0;
  private matrix=new T.Matrix4();private rotation=new T.Quaternion();private scale=new T.Vector3();private point=new T.Vector3();private color=new T.Color();
  private flameGeo=flameGeometry();
  private holderGeo=holderGeometry();
  private holderMat=new T.MeshStandardMaterial({color:0xffffff,vertexColors:true,roughness:.9,flatShading:true});
  private glowGeo=new T.PlaneGeometry(1,1).rotateX(-Math.PI/2);
  private flameMat=new T.ShaderMaterial({uniforms:{uTime:this.clock},vertexShader:vertex,fragmentShader:flameFragment,transparent:true,depthWrite:false,side:T.DoubleSide,toneMapped:false});
  private groundMat=new T.ShaderMaterial({uniforms:{uTime:this.clock,uWater:{value:0}},vertexShader:glowVertex,fragmentShader:glowFragment,transparent:true,depthWrite:false,blending:T.AdditiveBlending,toneMapped:false});
  constructor(private scene:T.Scene){
    for(let i=0;i<4;i++){const light=new T.PointLight(0xffb45c,0,2.5,2);light.castShadow=false;this.lights.push(light)}
  }
  private allocate(count:number){
    if(count<=this.capacity)return;
    for(const mesh of [this.flames,this.ground,this.holder])if(mesh){this.scene.remove(mesh);mesh.dispose()}
    this.capacity=Math.max(32,2**Math.ceil(Math.log2(count)));
    this.flames=new T.InstancedMesh(this.flameGeo,this.flameMat,this.capacity*FLAME_LAYERS);
    this.ground=new T.InstancedMesh(this.glowGeo,this.groundMat,this.capacity);
    this.holder=new T.InstancedMesh(this.holderGeo,this.holderMat,this.capacity);
    for(const mesh of [this.flames,this.ground,this.holder]){
      mesh.instanceMatrix.setUsage(T.DynamicDrawUsage);mesh.frustumCulled=false;mesh.count=0;mesh.setColorAt(0,new T.Color(mesh===this.holder?0xffffff:0x000000));this.scene.add(mesh);
    }
    this.flames.renderOrder=8;this.ground.renderOrder=3;this.holder.renderOrder=0;this.holder.castShadow=true;
  }
  reset(){
    this.levels.clear();this.heat.clear();this.clock.value=0;this.fieldClock=0;updateTorchField([]);this.selectionKey='';this.selected.clear();torchLight.value.forEach(light=>light.set(0,0,0,0));
    for(const mesh of [this.flames,this.ground,this.holder])if(mesh)mesh.count=0;
    for(const light of this.lights)light.intensity=0;
  }
  update(dt:number,anchors:readonly Anchor[],game:Game,focus:T.Vector3){
    this.clock.value+=dt;this.allocate(anchors.length);this.fieldClock-=dt;
    const refreshField=this.fieldClock<=0;
    const candidates:{anchor:Anchor;level:number;distance:number;phase:number}[]=[];
    const fieldSources:{x:number;z:number;level:number;water?:boolean;heat?:number}[]=[];
    const live=new Set<string>();
    anchors.forEach((anchor,index)=>{
      live.add(anchor.key);
      const target=game.torchLit(anchor.id)?T.MathUtils.smoothstep(climate.night.value,.12,.85)*anchor.strength:0;
      const level=T.MathUtils.damp(this.levels.get(anchor.key)??0,target,3,dt);this.levels.set(anchor.key,level);
      const previousHeat=this.heat.get(anchor.key)??0,heat=T.MathUtils.damp(previousHeat,level,level>previousHeat?2.1:.55,dt);this.heat.set(anchor.key,heat);
      const phase=(anchor.id*.618+Number(anchor.key.split(':')[1])*.137)%1;
      const tile=position(anchor.id),dx=anchor.position.x-tile.x,dz=anchor.position.z-tile.z,len=Math.max(.001,Math.hypot(dx,dz));
      this.rotation.identity();this.point.copy(anchor.position);
      this.matrix.compose(this.point,this.rotation,this.scale.set(1,1,1));this.holder!.setMatrixAt(index,this.matrix);
      const flicker=1+.055*Math.sin(this.clock.value*3.2+phase*19)+.025*Math.sin(this.clock.value*5.7+phase*31);
      for(let layer=0;layer<FLAME_LAYERS;layer++){
        const core=layer===FLAME_LAYERS-1,angle=phase*Math.PI*2+layer*2.4;
        this.rotation.setFromAxisAngle(T.Object3D.DEFAULT_UP,angle);
        this.point.copy(anchor.position);this.point.y-=.004;
        if(layer>0&&!core){this.point.x+=Math.sin(angle)*.024;this.point.z+=Math.cos(angle)*.024}
        const width=core?.055:layer===0?.105:.067,height=core?.108:layer===0?.185:layer===1?.137:.119;
        this.scale.set(width,height*flicker,width);
        this.matrix.compose(this.point,this.rotation,this.scale);
        this.flames!.setMatrixAt(index*FLAME_LAYERS+layer,this.matrix);this.color.setRGB(level,phase,core?1:layer*.18);this.flames!.setColorAt(index*FLAME_LAYERS+layer,this.color);
      }
      this.rotation.identity();
      this.point.set(anchor.position.x-dx/len*.35,LAND_Y+.012,anchor.position.z-dz/len*.35);
      this.matrix.compose(this.point,this.rotation,this.scale.set(.85,1,.85));
      this.color.setRGB(level,phase,0);this.ground!.setMatrixAt(index,this.matrix);this.ground!.setColorAt(index,this.color);
      if(level>.01)candidates.push({anchor,level,distance:anchor.position.distanceToSquared(focus),phase});
      if(refreshField&&(level>.005||heat>.002)){
        fieldSources.push({x:anchor.position.x,z:anchor.position.z,level,heat});
        if(level>.005)fieldSources.push({x:anchor.position.x+dx/len*.65,z:anchor.position.z+dz/len*.65,level:level*.9,water:true});
      }
    });
    for(const key of this.levels.keys())if(!live.has(key))this.levels.delete(key);
    for(const key of this.heat.keys())if(!live.has(key))this.heat.delete(key);
    for(const mesh of [this.flames,this.ground,this.holder])if(mesh){
      mesh.count=mesh===this.flames?anchors.length*FLAME_LAYERS:anchors.length;mesh.instanceMatrix.needsUpdate=true;if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;
    }
    if(refreshField){this.fieldClock=.08;updateTorchField(fieldSources)}
    candidates.sort((a,b)=>a.distance-b.distance);
    this.lights.forEach((light,i)=>{
      const candidate=candidates[i];if(!candidate){light.intensity=0;torchLight.value[i].set(0,0,0,0);return}
      light.position.copy(candidate.anchor.position);
      const flicker=.95+.035*Math.sin(this.clock.value*3.2+candidate.phase*20)+.015*Math.sin(this.clock.value*5.7+candidate.phase*43);
      light.intensity=candidate.level*flicker*.75;
      torchLight.value[i].set(light.position.x,light.position.y,light.position.z,light.intensity);
    });
  }
}
