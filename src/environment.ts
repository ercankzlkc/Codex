import * as T from 'three';
import {CENTER,coast,position} from './hex';
import {TropicalWater} from './water/tropical-water';
import {terrainGeometry,terrainSignature,meadow,grassTime,LAND_Y,SEA_Y} from './scenery';
import {tree} from './models';
import {shoreFence} from './shore-fence';
import {Wildlife} from './wildlife';
import {Atmosphere} from './atmosphere';
import {LAND_START,LAND_END,SINK_START,SINK_END,DEMOLISH_END,easeBetween} from './emergence';
export {LAND_Y,SEA_Y};


type Patch={root:T.Group; surface:T.Mesh;signature:string;age:number;grass?:T.Group;fence?:T.Mesh;fenceSignature?:string};
export class Environment {
  readonly root=new T.Group();
  private readonly land=new Map<number,Patch>();
  private readonly water=new TropicalWater();
  private readonly landMat=new T.MeshStandardMaterial({vertexColors:true,roughness:1,flatShading:true,side:T.DoubleSide});

  private readonly fenceMat=new T.MeshStandardMaterial({vertexColors:true,roughness:.95,flatShading:true});
  private shoreOpenings=new Map<number,number>();
  private atmosphere:Atmosphere;
  private wildlife:Wildlife;
  private last=0;
  private sinking=new Map<number,number>();
  private pendingBoard:ReadonlyMap<number,unknown>|null=null;
  constructor(scene:T.Scene){
    scene.add(this.root);scene.background=new T.Color(0x93bfcb);
    this.atmosphere=new Atmosphere(scene);this.root.add(this.water.root);this.wildlife=new Wildlife(scene,(x,z)=>this.stir(x,z,1,0,.35,.1));
  }

  sync(board:ReadonlyMap<number,unknown>,placed:number){
    this.wildlife.sync(board);this.atmosphere.sync(board);
    for(const id of this.land.keys())if(!board.has(id))this.removeLand(id)
    this.pendingBoard=placed>=0?new Map(board):null;
    const edges=coast(board);
    this.water.sync(board,edges,placed);
    for(const id of board.keys()){
      const signature=terrainSignature(id,board);
      const old=this.land.get(id);
      if(old){if(placed<0&&old.signature!==signature){old.surface.geometry.dispose();old.surface.geometry=terrainGeometry(id,board);old.signature=signature}continue}
      const center=position(id),root=new T.Group();root.position.set(center.x,id===placed?-1.1:0,center.z);
      if(id===placed)root.scale.set(.35,1,.35);
      const surface=new T.Mesh(terrainGeometry(id,board),this.landMat);surface.castShadow=true;surface.receiveShadow=true;
      root.add(surface);
      if(id===CENTER){const sprig=new T.Group();sprig.position.set(.44,LAND_Y,-.37);tree(sprig,0,0,1,.47);root.add(sprig)}
      root.visible=id!==placed;
      this.root.add(root);this.land.set(id,{root,surface,signature,age:id===placed?0:LAND_END});
    }
  }

  setShoreOpenings(board:ReadonlyMap<number,unknown>,openings:Map<number,number>){
    this.shoreOpenings=openings;this.syncFences(board);
  }
  private syncFences(board:ReadonlyMap<number,unknown>){
    for(const [id,tile] of this.land){
      if(!board.has(id))continue;
      const result=shoreFence(id,board,this.shoreOpenings.get(id),tile.fenceSignature);
      if(result.geometry===undefined)continue;
      if(tile.fence){tile.root.remove(tile.fence);tile.fence.geometry.dispose();tile.fence=undefined}
      tile.fenceSignature=result.signature;
      if(result.geometry){const fence=new T.Mesh(result.geometry,this.fenceMat);fence.castShadow=true;fence.receiveShadow=true;tile.root.add(fence);tile.fence=fence}
    }
  }
  setMeadow(id:number,footprints:T.Box3[]){
    const tile=this.land.get(id);if(!tile)return;
    if(tile.grass){tile.root.remove(tile.grass);tile.grass.traverse(o=>{if(o instanceof T.Mesh){o.geometry.dispose();(o.material as T.Material).dispose()}})}
    const grass=meadow(id,(x,z)=>footprints.some(b=>x>b.min.x-.065&&x<b.max.x+.065&&z>b.min.z-.065&&z<b.max.z+.065)||(id===CENTER&&Math.hypot(x-.44,z+.37)<.24));
    grass.position.set(0,LAND_Y,0);tile.root.add(grass);tile.grass=grass;
  }
  demolish(board:ReadonlyMap<number,unknown>,id:number){
    this.pendingBoard=new Map(board);this.sinking.set(id,0);
    this.water.sync(board,coast(board),-1,id);
  }
  private removeLand(id:number){
    const tile=this.land.get(id);if(!tile)return;
    this.root.remove(tile.root);tile.surface.geometry.dispose();
    tile.root.traverse(o=>{if(o===tile.fence){tile.fence.geometry.dispose();return}if(o instanceof T.Mesh&&o!==tile.surface&&o.material.vertexColors){o.geometry.dispose();o.material.dispose()}});
    this.land.delete(id);
  }
  setSun(direction:T.Vector3){this.water.setSun(direction)}
  get soundBirds(){return this.wildlife.soundBirds}
  fitWaterView(camera:T.OrthographicCamera,focus:T.Vector3){this.water.fitView(camera,focus)}
  stir(x:number,z:number,dx:number,dz:number,strength:number,length:number){this.water.stir(x,z,dx,dz,strength,length)}
  update(time:number){
    grassTime.value=time;const dt=Math.max(0,time-this.last);this.last=time;this.water.update(time);this.wildlife.update(time,dt);this.atmosphere.update(Math.min(.1,dt));
    for(const tile of this.land.values())if(tile.age<LAND_END){
      tile.age=Math.min(LAND_END,tile.age+dt);
      const progress=easeBetween(tile.age,LAND_START,LAND_END);
      tile.root.visible=tile.age>=LAND_START;
      tile.root.position.y=-1.1*(1-progress);
      tile.root.scale.set(.35+.65*progress,1,.35+.65*progress);
    }
    for(const [id,age] of this.sinking){
      const next=age+dt;this.sinking.set(id,next);
      const tile=this.land.get(id),progress=easeBetween(next,SINK_START,SINK_END);
      if(tile){
        tile.root.position.y=-1.6*progress;tile.root.scale.set(1-.70*progress,1-.18*progress,1-.70*progress);
        tile.root.rotation.z=Math.sin(next*25)*Math.sin(progress*Math.PI)*.025;
      }
      if(next>=DEMOLISH_END){this.removeLand(id);this.sinking.delete(id)}
    }
    if(this.pendingBoard&&this.sinking.size===0&&[...this.land.values()].every(tile=>tile.age>=LAND_END)){
      const board=this.pendingBoard,edges=coast(board);
      for(const [id,tile] of this.land){
        const signature=terrainSignature(id,board);
        if(tile.signature!==signature){tile.surface.geometry.dispose();tile.surface.geometry=terrainGeometry(id,board);tile.signature=signature}
      }
      this.syncFences(board);this.pendingBoard=null;
    }
  }

  reset(){this.shoreOpenings.clear();this.atmosphere.reset();this.wildlife.reset();this.pendingBoard=null;this.sinking.clear();this.water.clearWakes();for(const id of this.land.keys())this.removeLand(id)}
}
