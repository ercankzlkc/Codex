import * as T from 'three';
import {fromWorld,position,corner,RADIUS,frontier} from './hex';
import {LAND_Y,SEA_Y} from './environment';

export function cellPosition(id:number,y=LAND_Y) {
  const {x,z}=position(id);return new T.Vector3(x,y,z);
}
function outline(radius:number) {
  return new T.BufferGeometry().setFromPoints(Array.from({length:6},(_,i)=>{
    const p=corner(i,radius);return new T.Vector3(p.x,0,p.z);
  }));
}
export class PlacementGrid {
  readonly root=new T.Group();
  private markers=new T.Group();
  private ray=new T.Raycaster();
  private plane=new T.Plane(new T.Vector3(0,1,0),-LAND_Y);
  private hit=new T.Vector3();
  private occupied=new Set<number>();
  private rim=outline(RADIUS*.94);
  private rimMat=new T.LineBasicMaterial({color:0xfcf6d8,transparent:true,opacity:.9,depthWrite:false});
  private fillGeo=new T.CircleGeometry(RADIUS*.94,6,Math.PI/2).rotateX(-Math.PI/2);
  private fillMat=new T.MeshBasicMaterial({color:0xc1e8bd,transparent:true,opacity:.16,depthWrite:false});
  private hoverMat=new T.MeshBasicMaterial({color:0xb8e79b,transparent:true,opacity:.48,depthWrite:false});
  private hover=new T.Mesh(this.fillGeo,this.hoverMat);
  constructor(scene:T.Scene){this.root.add(this.markers,this.hover);this.hover.visible=false;scene.add(this.root)}
  rebuild(board:ReadonlyMap<number,unknown>){
    this.occupied=new Set(board.keys());this.markers.clear();
    for(const id of frontier(board)){
      const tile=new T.Group();tile.position.copy(cellPosition(id,SEA_Y+.055));tile.userData.id=id;
      const fill=new T.Mesh(this.fillGeo,this.fillMat),line=new T.LineLoop(this.rim,this.rimMat);
      fill.renderOrder=4;line.renderOrder=5;tile.add(fill,line);this.markers.add(tile);
    }
  }
  pick(x:number,y:number,camera:T.Camera,element:HTMLElement){
    const r=element.getBoundingClientRect();
    this.ray.setFromCamera(new T.Vector2((x-r.left)/r.width*2-1,1-(y-r.top)/r.height*2),camera);
    this.plane.constant=-LAND_Y;
    if(!this.ray.ray.intersectPlane(this.plane,this.hit))return -1;
    const land=fromWorld(this.hit.x,this.hit.z);if(this.occupied.has(land))return land;
    this.plane.constant=-(SEA_Y+.055);
    return this.ray.ray.intersectPlane(this.plane,this.hit)?fromWorld(this.hit.x,this.hit.z):-1;
  }
  showAvailable(active:boolean,valid:(id:number)=>boolean){
    this.markers.visible=active;this.markers.children.forEach(m=>m.visible=valid(m.userData.id));
  }
  setHover(id:number,valid:boolean,selected:boolean){
    this.hover.visible=selected&&id>=0;if(!this.hover.visible)return;
    this.hover.position.copy(cellPosition(id,this.occupied.has(id)?LAND_Y+.012:SEA_Y+.067));
    this.hover.renderOrder=6;this.hoverMat.color.setHex(valid?0xb3e995:0xdf9788);
  }
}
