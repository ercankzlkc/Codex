import * as T from 'three';
import {CENTER,coast,position} from './hex';
import {TropicalWater} from './water/tropical-water';
import {terrainGeometry,meadow,LAND_Y,SEA_Y} from './scenery';
import {box,ball,tree} from './models';
export {LAND_Y,SEA_Y};


type Patch={root:T.Group; surface:T.Mesh;signature:string;age:number};
export class Environment {
  readonly root=new T.Group();
  private readonly land=new Map<number,Patch>();
  private readonly water=new TropicalWater();
  private readonly landMat=new T.MeshStandardMaterial({vertexColors:true,roughness:1,flatShading:true,side:T.DoubleSide});

  private readonly harbour=new T.Group();
  private readonly boat=new T.Group();
  private last=0;
  constructor(scene:T.Scene){
    scene.add(this.root);scene.background=new T.Color(0x93bfcb);
    this.root.add(this.water.root,this.harbour);
    // A small jetty turns toward an exposed harbour edge as the kingdom grows.
    for(let j=0;j<6;j++)box(this.harbour,j%2?0xb6996e:0xc8a97c,.08+j*.10,-.06,0,.092,.045,.35);
    for(const x of [.1,.59])for(const z of [-.13,.13])box(this.harbour,0x876f52,x,-.215,z,.04,.39,.04);
    const hull=ball(this.boat,0x8c6348,0,.005,0,.26);hull.scale.set(1.35,.48,.64);
    box(this.boat,0xd8b98b,0,.07,0,.06,.032,.24);box(this.boat,0xc9a575,.16,.06,0,.05,.025,.18);
    this.boat.position.set(.37,SEA_Y+.06,.46);this.harbour.add(this.boat);
  }
  sync(board:ReadonlyMap<number,unknown>,placed:number){
    for(const [id,tile] of this.land)if(!board.has(id)){this.root.remove(tile.root);tile.surface.geometry.dispose();this.land.delete(id)}
    const edges=coast(board);
    this.water.sync(board,edges,placed);
    for(const id of board.keys()){
      const signature=edges.filter(e=>e.id===id).map(e=>e.side).join(',');
      const old=this.land.get(id);
      if(old){if(old.signature!==signature){old.surface.geometry.dispose();old.surface.geometry=terrainGeometry(id,board);old.signature=signature}continue}
      const center=position(id),root=new T.Group();root.position.set(center.x,id===placed?-.74:0,center.z);
      const surface=new T.Mesh(terrainGeometry(id,board),this.landMat);surface.castShadow=true;surface.receiveShadow=true;
      const grass=meadow(id);grass.position.set(0,LAND_Y,0);root.add(surface,grass);
      if(id===CENTER){const sprig=new T.Group();sprig.position.set(.44,LAND_Y,-.37);tree(sprig,0,0,1,.47);root.add(sprig)}
      this.root.add(root);this.land.set(id,{root,surface,signature,age:id===placed?0:1});
    }
    const dockEdge=edges.find(e=>e.id===CENTER&&e.side===1)??edges.find(e=>e.id===CENTER)??edges[0];
    this.harbour.position.set((dockEdge.ax+dockEdge.bx)/2,0,(dockEdge.az+dockEdge.bz)/2);
    this.harbour.rotation.y=-dockEdge.side*Math.PI/3;
  }
  update(time:number){
    const dt=Math.max(0,time-this.last);this.last=time;this.water.update(time);
    this.boat.position.y=SEA_Y+.07+Math.sin(time*1.3)*.014;this.boat.rotation.x=Math.sin(time*.84)*.045;
    for(const tile of this.land.values())if(tile.age<1){
      tile.age=Math.min(1,tile.age+dt/.53);
      const t=tile.age;tile.root.position.y=-.74*(1-t*t*(3-2*t));
    }
  }
  reset(){for(const tile of this.land.values()){this.root.remove(tile.root);tile.surface.geometry.dispose();tile.root.traverse(o=>{if(o instanceof T.Mesh&&o.material.vertexColors&&o!==tile.surface){o.geometry.dispose();o.material.dispose()}})}this.land.clear()}
}

