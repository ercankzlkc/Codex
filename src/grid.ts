import * as T from 'three';
import {fromWorld,position,corner,RADIUS,frontier} from './hex';
import {LAND_Y,SEA_Y} from './scenery';
import {climate} from './climate';

export const PLACEMENT_Y=SEA_Y+.065;
export const PLACEMENT_EASE=22;
export function cellPosition(id:number,y=LAND_Y){
  const {x,z}=position(id);return new T.Vector3(x,y,z);
}

const markerVertex=/* glsl */ `
varying vec2 vLocal;
varying float vEnabled;
#ifdef USE_INSTANCING
  attribute float aEnabled;
#endif
void main(){
  vLocal=position.xz;vEnabled=1.;
  vec4 point=vec4(position,1.);
  #ifdef USE_INSTANCING
    vEnabled=aEnabled;point=instanceMatrix*point;
  #endif
  gl_Position=projectionMatrix*modelViewMatrix*point;
}`;
const markerFragment=/* glsl */ `
uniform float uOpacity,uFocus,uTime,uNight;
uniform vec3 uColor;
varying vec2 vLocal;
varying float vEnabled;
void main(){
  vec2 p=abs(vLocal);
  float radius=${RADIUS.toFixed(5)},apothem=radius*.8660254;
  float distance=max(p.x,p.x*.5+p.y*.8660254)-apothem;
  float aa=max(.003,fwidth(distance)*.8);
  float edge=1.-smoothstep(.004,.012+aa,abs(distance+.012));
  float cornerDistance=min(length(p-vec2(apothem,radius*.5)),length(p-vec2(0.,radius)));
  float corners=1.-smoothstep(radius*.13,radius*.29,cornerDistance);
  float inside=1.-smoothstep(-aa,aa,distance);
  float mist=exp(-abs(distance)*22.)*.10+inside*.025;
  float alpha=mix(edge*corners*.28,edge*.52+mist,uFocus);
  alpha*=uOpacity*vEnabled*(.96+.04*sin(uTime*1.5));
  if(alpha<.002)discard;
  gl_FragColor=vec4(uColor*mix(1.,.72,uNight),alpha);
  #include <colorspace_fragment>
}`;

/** One batched set of quiet corner marks and one easing active outline. */
export class PlacementGrid{
  readonly root=new T.Group();
  private cells:{id:number;point:T.Vector3}[]=[];
  private capacity=32;
  private geometry=new T.PlaneGeometry((RADIUS+.09)*2,(RADIUS+.09)*2).rotateX(-Math.PI/2);
  private enabled=new T.InstancedBufferAttribute(new Float32Array(this.capacity),1);
  private clock={value:0};
  private visibility=0;
  private available=false;
  private markerOpacity={value:0};
  private focusOpacity={value:0};
  private focusColor={value:new T.Color('#d6f0db')};
  private markerMaterial=this.material(false);
  private markers=new T.InstancedMesh(this.geometry,this.markerMaterial,this.capacity);
  private hoverMaterial=this.material(true);
  private hover=new T.Mesh(this.geometry.clone(),this.hoverMaterial);
  private hoverTarget=new T.Vector3();
  private hoverWanted=false;
  private ray=new T.Raycaster();
  private plane=new T.Plane(new T.Vector3(0,1,0),-LAND_Y);
  private hit=new T.Vector3();
  private occupied=new Set<number>();
  private valid:(id:number)=>boolean=()=>false;

  private material(focus:boolean){
    return new T.ShaderMaterial({
      uniforms:{uOpacity:focus?this.focusOpacity:this.markerOpacity,uFocus:{value:focus?1:0},
        uTime:this.clock,uNight:climate.night,uColor:focus?this.focusColor:{value:new T.Color('#d6e9dc')}},
      vertexShader:markerVertex,fragmentShader:markerFragment,
      transparent:true,depthWrite:false,depthTest:true,toneMapped:false,
    });
  }
  constructor(scene:T.Scene){
    this.geometry.setAttribute('aEnabled',this.enabled);this.markers.count=0;
    this.markers.renderOrder=3;this.hover.renderOrder=3;this.hover.visible=false;
    this.root.add(this.markers,this.hover);scene.add(this.root);
  }
  rebuild(board:ReadonlyMap<number,unknown>){
    this.occupied=new Set(board.keys());
    this.cells=frontier(board).map(id=>({id,point:cellPosition(id,PLACEMENT_Y)}));
    if(this.cells.length>this.capacity){
      this.capacity=2**Math.ceil(Math.log2(this.cells.length));
      this.root.remove(this.markers);this.markers.dispose();this.geometry.dispose();
      this.enabled=new T.InstancedBufferAttribute(new Float32Array(this.capacity),1);
      this.geometry.setAttribute('aEnabled',this.enabled);
      this.markers=new T.InstancedMesh(this.geometry,this.markerMaterial,this.capacity);
      this.markers.renderOrder=3;this.root.add(this.markers);
    }
    const matrix=new T.Matrix4();
    this.cells.forEach((cell,i)=>{
      this.markers.setMatrixAt(i,matrix.makeTranslation(cell.point.x,cell.point.y,cell.point.z));
      this.enabled.setX(i,this.valid(cell.id)?1:0);
    });
    this.markers.count=this.cells.length;this.markers.instanceMatrix.needsUpdate=true;
    this.enabled.needsUpdate=true;this.markers.computeBoundingSphere();
    if(!this.available)this.visibility=0;
    this.markers.visible=this.visibility>.002;
  }
  pick(x:number,y:number,camera:T.Camera,element:HTMLElement){
    const r=element.getBoundingClientRect();if(!r.width||!r.height)return -1;
    this.ray.setFromCamera(new T.Vector2((x-r.left)/r.width*2-1,1-(y-r.top)/r.height*2),camera);
    this.plane.constant=-LAND_Y;
    if(!this.ray.ray.intersectPlane(this.plane,this.hit))return -1;
    const land=fromWorld(this.hit.x,this.hit.z);if(this.occupied.has(land))return land;
    this.plane.constant=-PLACEMENT_Y;
    return this.ray.ray.intersectPlane(this.plane,this.hit)?fromWorld(this.hit.x,this.hit.z):-1;
  }
  nearestAvailable(x:number,y:number,camera:T.Camera,element:HTMLElement,valid:(id:number)=>boolean){
    const rect=element.getBoundingClientRect(),screen=new T.Vector3();let best=-1,distance=Infinity;
    for(const cell of this.cells){
      if(!valid(cell.id))continue;
      const point=cell.point;screen.copy(point).project(camera);if(screen.z< -1||screen.z>1)continue;
      const sx=rect.left+(screen.x+1)*rect.width/2,sy=rect.top+(1-screen.y)*rect.height/2;
      const d=Math.hypot(x-sx,y-sy);if(d>=distance)continue;
      let radius=0;
      for(let k=0;k<6;k++){
        const c=corner(k,RADIUS);screen.set(point.x+c.x,point.y,point.z+c.z).project(camera);
        radius=Math.max(radius,Math.hypot(rect.left+(screen.x+1)*rect.width/2-sx,rect.top+(1-screen.y)*rect.height/2-sy));
      }
      if(d<=radius*1.04){best=cell.id;distance=d}
    }
    return best;
  }
  showAvailable(active:boolean,valid:(id:number)=>boolean){
    this.available=active;this.valid=valid;
    if(active){this.cells.forEach((c,i)=>this.enabled.setX(i,valid(c.id)?1:0));this.enabled.needsUpdate=true}
  }
  update(dt:number){
    this.clock.value+=dt;
    this.visibility=T.MathUtils.damp(this.visibility,this.available?1:0,12,dt);
    this.markerOpacity.value=this.visibility;this.markers.visible=this.visibility>.002;
    this.focusOpacity.value=T.MathUtils.damp(this.focusOpacity.value,this.hoverWanted?1:0,18,dt);
    this.hover.visible=this.focusOpacity.value>.002;
    this.hover.position.lerp(this.hoverTarget,1-Math.exp(-PLACEMENT_EASE*dt));
  }
  setHover(id:number,valid:boolean,selected:boolean){
    this.hoverWanted=selected&&id>=0;if(!this.hoverWanted)return;
    this.hoverTarget.copy(cellPosition(id,this.occupied.has(id)?LAND_Y+.015:PLACEMENT_Y+.004));
    if(this.focusOpacity.value<.02)this.hover.position.copy(this.hoverTarget);
    this.focusColor.value.set(valid?'#d6f0db':'#d9a491');
  }
}
