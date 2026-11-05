import * as T from 'three';
import {climate} from './climate';
import {position} from './hex';
import {LAND_Y,SEA_Y} from './scenery';
import type {Game} from './game';

type Anchor={key:string;id:number;position:T.Vector3;strength:number};
const vertex=`
varying vec2 vUv;varying vec3 vFire;
void main(){
  vUv=uv;
  #ifdef USE_INSTANCING_COLOR
  vFire=instanceColor;
  #else
  vFire=vec3(1.,0.,0.);
  #endif
  vec4 center=modelViewMatrix*instanceMatrix*vec4(0.,0.,0.,1.);
  center.xy+=position.xy*vec2(length(instanceMatrix[0].xyz),length(instanceMatrix[1].xyz));
  gl_Position=projectionMatrix*center;
}`;
const flameFragment=`
uniform float uTime;varying vec2 vUv;varying vec3 vFire;
void main(){
  float t=uTime+vFire.g*19.;
  float x=(vUv.x-.5)*2.+sin(vUv.y*7.-t*8.)*.13*vUv.y+sin(t*11.)*.04;
  float width=mix(.65,.03,pow(vUv.y,.8));
  float flame=(1.-smoothstep(width*.35,width,abs(x)))*smoothstep(0.,.13,vUv.y)*(1.-smoothstep(.78,1.,vUv.y));
  vec3 color=mix(vec3(1.,.82,.30),vec3(1.,.21,.025),vUv.y);
  gl_FragColor=vec4(color,flame*vFire.r);
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
  float radial=pow(max(0.,1.-dot(p,p)),2.);
  float flicker=.9+.06*sin(uTime*7.+vFire.g*20.)+.04*sin(uTime*13.+vFire.g*43.);
  float ribbons=.65+.35*sin(vUv.y*80.+sin(vUv.x*20.+uTime)*3.+uTime*3.);
  float alpha=radial*flicker*vFire.r*mix(.25,.18*ribbons,uWater);
  gl_FragColor=vec4(vec3(1.,.42,.09),alpha);
}`;
/** Three batched effects plus four shadow-free lights, independent of fence count. */
export class FenceTorches{
  private capacity=0;private flames:T.InstancedMesh|null=null;private ground:T.InstancedMesh|null=null;private water:T.InstancedMesh|null=null;
  private clock={value:0};private levels=new Map<string,number>();
  private lights:T.PointLight[]=[];
  private matrix=new T.Matrix4();private rotation=new T.Quaternion();private scale=new T.Vector3();private point=new T.Vector3();private color=new T.Color();
  private flameGeo=new T.PlaneGeometry(1,1);
  private glowGeo=new T.PlaneGeometry(1,1).rotateX(-Math.PI/2);
  private flameMat=new T.ShaderMaterial({uniforms:{uTime:this.clock},vertexShader:vertex,fragmentShader:flameFragment,transparent:true,depthWrite:false,side:T.DoubleSide,blending:T.AdditiveBlending,toneMapped:false});
  private groundMat=new T.ShaderMaterial({uniforms:{uTime:this.clock,uWater:{value:0}},vertexShader:glowVertex,fragmentShader:glowFragment,transparent:true,depthWrite:false,blending:T.AdditiveBlending,toneMapped:false});
  private waterMat=new T.ShaderMaterial({uniforms:{uTime:this.clock,uWater:{value:1}},vertexShader:glowVertex,fragmentShader:glowFragment,transparent:true,depthWrite:false,blending:T.AdditiveBlending,toneMapped:false});
  constructor(private scene:T.Scene){
    for(let i=0;i<4;i++){const light=new T.PointLight(0xffb45c,0,2.5,2);light.castShadow=false;scene.add(light);this.lights.push(light)}
  }
  private allocate(count:number){
    if(count<=this.capacity)return;
    for(const mesh of [this.flames,this.ground,this.water])if(mesh){this.scene.remove(mesh);mesh.dispose()}
    this.capacity=Math.max(32,2**Math.ceil(Math.log2(count)));
    this.flames=new T.InstancedMesh(this.flameGeo,this.flameMat,this.capacity);
    this.ground=new T.InstancedMesh(this.glowGeo,this.groundMat,this.capacity);
    this.water=new T.InstancedMesh(this.glowGeo,this.waterMat,this.capacity);
    for(const mesh of [this.flames,this.ground,this.water]){
      mesh.instanceMatrix.setUsage(T.DynamicDrawUsage);mesh.frustumCulled=false;mesh.count=0;mesh.setColorAt(0,new T.Color(0,0,0));this.scene.add(mesh);
    }
    this.flames.renderOrder=8;this.ground.renderOrder=3;this.water.renderOrder=4;
  }
  reset(){
    this.levels.clear();this.clock.value=0;
    for(const mesh of [this.flames,this.ground,this.water])if(mesh)mesh.count=0;
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
      this.rotation.identity();this.point.copy(anchor.position);this.point.y+=.045;
      this.matrix.compose(this.point,this.rotation,this.scale.set(.11,.23,.11));
      this.flames!.setMatrixAt(index,this.matrix);this.color.setRGB(level,phase,0);this.flames!.setColorAt(index,this.color);
      this.point.set(anchor.position.x-dx/len*.38,LAND_Y+.012,anchor.position.z-dz/len*.38);
      this.matrix.compose(this.point,this.rotation,this.scale.set(.72,1,.72));
      this.ground!.setMatrixAt(index,this.matrix);this.ground!.setColorAt(index,this.color);
      this.point.set(anchor.position.x+dx/len*.57,SEA_Y+.035,anchor.position.z+dz/len*.57);
      this.rotation.setFromAxisAngle(new T.Vector3(0,1,0),Math.atan2(dx,dz));
      this.matrix.compose(this.point,this.rotation,this.scale.set(.38,1,1.05));
      this.color.setRGB(level*(1-climate.winter.value*.9),phase,0);
      this.water!.setMatrixAt(index,this.matrix);this.water!.setColorAt(index,this.color);
      if(level>.01)candidates.push({anchor,level,distance:anchor.position.distanceToSquared(focus),phase});
    });
    for(const key of this.levels.keys())if(!live.has(key))this.levels.delete(key);
    for(const mesh of [this.flames,this.ground,this.water])if(mesh){
      mesh.count=anchors.length;mesh.instanceMatrix.needsUpdate=true;if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;
    }
    candidates.sort((a,b)=>a.distance-b.distance);
    this.lights.forEach((light,i)=>{
      const candidate=candidates[i];if(!candidate){light.intensity=0;return}
      light.position.copy(candidate.anchor.position);
      const flicker=.92+.05*Math.sin(this.clock.value*7+candidate.phase*20)+.03*Math.sin(this.clock.value*13+candidate.phase*43);
      light.intensity=candidate.level*flicker*.9;
    });
  }
}
