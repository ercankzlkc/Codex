import * as T from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {torchLight,updateTorchField} from './torch-light';
import {climate} from './climate';
import {position} from './hex';
import {LAND_Y} from './scenery';
import type {Game} from './game';

type Anchor={key:string;id:number;position:T.Vector3;strength:number};
const vertex=`
uniform float uTime;varying vec3 vFire;varying float vHeight,vShade;
void main(){
  #ifdef USE_INSTANCING_COLOR
  vFire=instanceColor;
  #else
  vFire=vec3(1.,0.,0.);
  #endif
  vec3 p=position;float t=uTime+vFire.g*19.;
  p.x+=p.y*p.y*(sin(t*3.2)*.12+sin(t*5.7)*.05);
  vHeight=position.y;vShade=.85+normal.x*.1+normal.z*.12;
  gl_Position=projectionMatrix*modelViewMatrix*instanceMatrix*vec4(p,1.);
}`;
const flameFragment=`
varying vec3 vFire;varying float vHeight,vShade;
void main(){
  vec3 outer=mix(vec3(1.,.62,.11),vec3(1.,.22,.035),vHeight);
  vec3 inner=mix(vec3(1.,.94,.61),vec3(1.,.76,.27),vHeight);
  gl_FragColor=vec4(mix(outer,inner,vFire.b)*vShade,clamp(vFire.r,0.,1.)*.95);
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
  private clock={value:0};private levels=new Map<string,number>();
  private lights:T.PointLight[]=[];
  private fieldClock=0;
  private matrix=new T.Matrix4();private rotation=new T.Quaternion();private scale=new T.Vector3();private point=new T.Vector3();private color=new T.Color();
  private flameGeo=new T.ConeGeometry(.5,1,5,1).translate(0,.5,0);
  private holderGeo=(()=>{const parts=[new T.CylinderGeometry(.012,.018,.28,5).translate(0,-.19,0),new T.CylinderGeometry(.047,.026,.06,5).translate(0,-.035,0),new T.BoxGeometry(.064,.022,.034).translate(0,-.11,0)];parts.forEach((part,i)=>{const tint=new T.Color(i===0?0x745137:i===1?0x383d40:0x9c7246),values=new Float32Array(part.getAttribute('position').count*3);for(let j=0;j<values.length;j+=3){values[j]=tint.r;values[j+1]=tint.g;values[j+2]=tint.b}part.setAttribute('color',new T.BufferAttribute(values,3))});const geometry=mergeGeometries(parts,false)!;parts.forEach(part=>part.dispose());return geometry})();
  private holderMat=new T.MeshStandardMaterial({color:0xffffff,vertexColors:true,roughness:.9,flatShading:true});
  private glowGeo=new T.PlaneGeometry(1,1).rotateX(-Math.PI/2);
  private flameMat=new T.ShaderMaterial({uniforms:{uTime:this.clock},vertexShader:vertex,fragmentShader:flameFragment,transparent:true,depthWrite:false,side:T.DoubleSide,blending:T.AdditiveBlending,toneMapped:false});
  private groundMat=new T.ShaderMaterial({uniforms:{uTime:this.clock,uWater:{value:0}},vertexShader:glowVertex,fragmentShader:glowFragment,transparent:true,depthWrite:false,blending:T.AdditiveBlending,toneMapped:false});
  constructor(private scene:T.Scene){
    for(let i=0;i<4;i++){const light=new T.PointLight(0xffb45c,0,2.5,2);light.castShadow=false;this.lights.push(light)}
  }
  private allocate(count:number){
    if(count<=this.capacity)return;
    for(const mesh of [this.flames,this.ground,this.holder])if(mesh){this.scene.remove(mesh);mesh.dispose()}
    this.capacity=Math.max(32,2**Math.ceil(Math.log2(count)));
    this.flames=new T.InstancedMesh(this.flameGeo,this.flameMat,this.capacity*2);
    this.ground=new T.InstancedMesh(this.glowGeo,this.groundMat,this.capacity);
    this.holder=new T.InstancedMesh(this.holderGeo,this.holderMat,this.capacity);
    for(const mesh of [this.flames,this.ground,this.holder]){
      mesh.instanceMatrix.setUsage(T.DynamicDrawUsage);mesh.frustumCulled=false;mesh.count=0;mesh.setColorAt(0,new T.Color(mesh===this.holder?0xffffff:0x000000));this.scene.add(mesh);
    }
    this.flames.renderOrder=8;this.ground.renderOrder=3;this.holder.renderOrder=0;this.holder.castShadow=true;
  }
  reset(){
    this.levels.clear();this.clock.value=0;this.fieldClock=0;updateTorchField([]);this.selectionKey='';this.selected.clear();torchLight.value.forEach(light=>light.set(0,0,0,0));
    for(const mesh of [this.flames,this.ground,this.holder])if(mesh)mesh.count=0;
    for(const light of this.lights)light.intensity=0;
  }
  update(dt:number,anchors:readonly Anchor[],game:Game,focus:T.Vector3){
    this.clock.value+=dt;this.allocate(anchors.length);
    const candidates:{anchor:Anchor;level:number;distance:number;phase:number}[]=[];
    const live=new Set<string>();
    anchors.forEach((anchor,index)=>{
      live.add(anchor.key);
      const target=game.torchLit(anchor.id)?T.MathUtils.smoothstep(climate.night.value,.12,.85)*anchor.strength:0;
      const level=T.MathUtils.damp(this.levels.get(anchor.key)??0,target,3,dt);this.levels.set(anchor.key,level);
      const phase=(anchor.id*.618+Number(anchor.key.split(':')[1])*.137)%1;
      const tile=position(anchor.id),dx=anchor.position.x-tile.x,dz=anchor.position.z-tile.z,len=Math.max(.001,Math.hypot(dx,dz));
      this.rotation.identity();this.point.copy(anchor.position);
      this.matrix.compose(this.point,this.rotation,this.scale.set(1,1,1));this.holder!.setMatrixAt(index,this.matrix);
      const flicker=1+.055*Math.sin(this.clock.value*3.2+phase*19)+.025*Math.sin(this.clock.value*5.7+phase*31);
      for(let layer=0;layer<2;layer++){
        this.point.copy(anchor.position);this.point.y-=.005;
        this.scale.set(layer?.052:.095,(layer?.105:.17)*flicker,layer?.052:.095);
        this.matrix.compose(this.point,this.rotation,this.scale);
        this.flames!.setMatrixAt(index*2+layer,this.matrix);this.color.setRGB(level,phase,layer);this.flames!.setColorAt(index*2+layer,this.color);
      }
      this.point.set(anchor.position.x-dx/len*.35,LAND_Y+.012,anchor.position.z-dz/len*.35);
      this.matrix.compose(this.point,this.rotation,this.scale.set(.85,1,.85));
      this.color.setRGB(level,phase,0);this.ground!.setMatrixAt(index,this.matrix);this.ground!.setColorAt(index,this.color);
      if(level>.01)candidates.push({anchor,level,distance:anchor.position.distanceToSquared(focus),phase});
    });
    for(const key of this.levels.keys())if(!live.has(key))this.levels.delete(key);
    for(const mesh of [this.flames,this.ground,this.holder])if(mesh){
      mesh.count=mesh===this.flames?anchors.length*2:anchors.length;mesh.instanceMatrix.needsUpdate=true;if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;
    }
    this.fieldClock-=dt;
    if(this.fieldClock<=0){this.fieldClock=.08;updateTorchField(candidates.flatMap(c=>{
      const tile=position(c.anchor.id),dx=c.anchor.position.x-tile.x,dz=c.anchor.position.z-tile.z,length=Math.max(.001,Math.hypot(dx,dz));
      return [{x:c.anchor.position.x,z:c.anchor.position.z,level:c.level,water:false},
        {x:c.anchor.position.x+dx/length*.65,z:c.anchor.position.z+dz/length*.65,level:c.level*.9,water:true}];
    }))}
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
