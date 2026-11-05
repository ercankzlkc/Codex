import {terrainGeometry} from './scenery';
import * as T from 'three';
import {FenceTorches} from './torches';
import {climate} from './climate';
import {gameSpeed} from './game-speed';
import {StaticInstances} from './static-instances';
import {SeasonCycle} from './seasons';
import {icon} from './icons';
import {SUN} from './lighting';
import { CameraController } from './camera';
import { Environment, LAND_Y, SEA_Y } from './environment';
import {CENTER, position, fromWorld,corner,RADIUS,adjacent,type ShoreEdge} from './hex';
import {BUILD_START,BUILD_END,SINK_START,SINK_END,DEMOLISH_END,easeBetween} from './emergence';
import { PlacementGrid, cellPosition } from './grid';
import { model, resourceModel, part, box } from './models';
import {Game,BUILDING_SCALE,cards,type Resource,type Card,type Kind,type Production} from './game';
import {Villagers} from './villagers';
import type {HarvestCue} from './harvest-audio';
import type {WalkPoint} from './navigation';

type Build = { id:number; group:T.Group; time:number; kind:Kind };
type Mote = { mesh:T.Mesh; velocity:T.Vector3; life:number;dust?:boolean };
type Leaf={mesh:T.Mesh;velocity:T.Vector3;spin:T.Vector3;age:number;life:number;size:number};
type Label = { el:HTMLElement; position:T.Vector3; life:number; delay:number };

function contactMaterial() {
  const canvas=document.createElement('canvas'); canvas.width=64; canvas.height=64;
  const ctx=canvas.getContext('2d')!;
  const blur=ctx.createRadialGradient(32,32,1,32,32,31);
  blur.addColorStop(0,'rgba(50,61,39,.43)');blur.addColorStop(.6,'rgba(55,63,39,.19)');blur.addColorStop(1,'rgba(58,65,42,0)');
  ctx.fillStyle=blur;ctx.fillRect(0,0,64,64);
  const map=new T.CanvasTexture(canvas);map.colorSpace=T.SRGBColorSpace;
  return new T.MeshBasicMaterial({map,transparent:true,depthWrite:false});
}

function villageHouse() {
  const g=model('house');
  // The starter home is the harbour hall, identified by its bell tower and pennant.
  const tower=new T.Group();tower.position.set(-.34,0,-.21);g.add(tower);
  part(tower,new T.CylinderGeometry(.205,.24,.77,8),0xe5d4ae,0,.405,0);
  part(tower,new T.CylinderGeometry(.24,.20,.065,8),0x957958,0,.812,0);
  part(tower,new T.CylinderGeometry(.16,.16,.29,8),0x687c74,0,.99,0);
  for(let i=0;i<4;i++){let a=i*Math.PI/2+.4;box(tower,0xbba177,Math.cos(a)*.172,.99,Math.sin(a)*.172,.038,.3,.038);}
  part(tower,new T.ConeGeometry(.29,.37,8),0x578080,0,1.29,0);
  box(tower,0x8f7856,0,1.58,0,.023,.23,.023);
  const pennant=new T.BufferGeometry();
  pennant.setAttribute('position',new T.Float32BufferAttribute([0,1.69,0,.26,1.62,.018,0,1.56,0],3));pennant.computeVertexNormals();
  const m=new T.Mesh(pennant,new T.MeshLambertMaterial({color:0xdba557,side:T.DoubleSide}));tower.add(m);
  return g;
}

export class World {
  readonly scene=new T.Scene();
  private readonly torches=new FenceTorches(this.scene);
  private readonly staticInstances=new StaticInstances(this.scene);
  readonly renderer=new T.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});
  readonly cameraControl:CameraController;
  readonly grid:PlacementGrid;
  readonly environment:Environment;
  readonly villagers:Villagers;
  private game:Game|null=null;
  private leaves:Leaf[]=[];
  private readonly leafGeo=(()=>{const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute([-.018,0,0,0,.006,.045,0,.009,0,0,.006,.045,.018,0,0,0,.009,0,.018,0,0,0,0,-.035,0,.009,0,0,0,-.035,-.018,0,0,0,.009,0],3));g.computeVertexNormals();return g})();
  private readonly leafMats=[0x719a53,0x9eb46c,0x557e4c,0xb2be77].map(color=>new T.MeshStandardMaterial({color,roughness:.88,side:T.DoubleSide}));
  private fullStores=new Map<number,HTMLElement>();
  private treeCycles=new Map<string,{id:number;tree:T.Object3D;age:number;scale:T.Vector3}>();
  private drops=new Map<string,{group:T.Group;age:number;claimed:boolean;pieces:{mesh:T.Object3D;velocity:T.Vector3;spin:T.Vector3}[]}>();
  private storageDecor=new Map<number,T.Group>();
  private fields=new Map<number,{stock:number;max:number;age:number}>();
  private harvestParts=new Map<string,{id:number;progress:number}>();
  private loaders=new Map<string,{id:number;el:HTMLElement;point:T.Vector3;total:number}>();
  private readonly trails=new T.InstancedMesh(new T.CircleGeometry(.055,5).rotateX(-Math.PI/2),new T.MeshBasicMaterial({color:0xccbc95,transparent:true,opacity:.42,depthWrite:false}),8000);
  private trailPoints:{tile:number;x:number;z:number}[]=[];
  private trailKeys=new Set<string>();
  private fisherOffset=0;
  private sparkMat=new T.MeshBasicMaterial({color:0xffdc8a});
  private stoneChipMat=new T.MeshStandardMaterial({color:0x99a6a0,roughness:1});
  private woodHits=new Map<T.Object3D,number>();
  private root=new T.Group();
  private buildings=new Map<number,T.Group>();
  private editing=-1;
  private rotationTargets=new Map<number,number>();
  private demolitions:{id:number;group:T.Group;time:number}[]=[];
  private ghost:T.Group|null=null;
  private ghostModel:T.Group|null=null;
  private desiredGhostYaw=0;
  private ghostManualCell=-1;
  private placedManualCell=-1;
  private lastRotationWake=0;
  private wheelRotation=0;
  private placementQueued=false;
  private previewLand:T.Mesh|null=null;
  private previewFade=0;
  private readonly previewLandMat=new T.MeshStandardMaterial({vertexColors:true,roughness:1,flatShading:false,side:T.FrontSide,transparent:true,opacity:0,depthWrite:true,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-1});
  private readonly seaRay=new T.Raycaster();
  private readonly seaPlane=new T.Plane(new T.Vector3(0,1,0),-SEA_Y);
  private readonly seaPoint=new T.Vector3();
  private readonly waterSunDirection=new T.Vector3();
  private lastSea:{x:number;z:number;time:number}|null=null;
  private seaPointerSpeed=0;
  private board:ReadonlyMap<number,Kind>=new Map();
  private sun=new T.DirectionalLight(SUN.color,SUN.intensity);
  private ghostPalette:{mat:T.MeshStandardMaterial;base:T.Color}[]=[];
  private readonly ghostTarget=new T.Vector3();
  private readonly contact=contactMaterial();
  private readonly contactGeo=new T.PlaneGeometry(1.48,1.26).rotateX(-Math.PI/2);
  private readonly moteGeo=new T.IcosahedronGeometry(.032,0);
  private readonly moteMats=[0xe9cb83,0xc5d99a,0xdab68a].map(color=>new T.MeshLambertMaterial({color}));
  private builds:Build[]=[];
  private motes:Mote[]=[];
  private labels:Label[]=[];
  private rings:{mesh:T.Mesh;time:number}[]=[];
  private readonly ringGeo=new T.RingGeometry(.47,.49,32).rotateX(-Math.PI/2);
  private readonly projection=new T.Vector3();
  private selected:Card|null=null;
  private previousTime=performance.now();
  private time=0;
  private readonly ambient=new T.HemisphereLight(0xddeaf1,0x8c957b,1);
  private readonly seasons:SeasonCycle;
  private detailTile=-1;
  private detailPointer:{x:number;y:number}|null=null;
  hover=-1;
  valid=(_i:number)=>false;
  onHover=(_i:number)=>{};
  onPick=(_i:number)=>{};
  onTileSelect=(_i:number)=>{};
  onSoundFrame=(_camera:T.OrthographicCamera,_focus:T.Vector3,_birds:readonly T.Object3D[],_shore:readonly ShoreEdge[],_land:ReadonlyMap<number,unknown>)=>{};
  onWorkSound=(_cue:HarvestCue,_at:T.Vector3)=>{};
  onPlacementSound=(_kind:Kind,_at:T.Vector3)=>{};
  onDelivery=(_source:number,_store:number,_resource:Resource,_amount:number)=>0;
  onInspect=(_id:number,_x:number,_y:number,_bounds:{left:number;right:number;top:number;bottom:number}|null)=>{};

  setPalette(colors:readonly string[],sky:string,sun:string,grade:{hue:number;saturation:number;brightness:number}){
    (this.scene.background as T.Color).set(sky);
    this.sun.color.set(sun);
    this.environment.setPalette(colors);
    this.seasons.setPalette(sky,sun);
    // Grade the complete rendered scene, including textures, vertex-coloured terrain,
    // villagers and objects created after the selection. No material mutation accumulates.
    this.renderer.domElement.style.filter=`hue-rotate(${grade.hue}deg) saturate(${grade.saturation}) brightness(${grade.brightness})`;
  }

  constructor(readonly el:HTMLElement) {
    this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));
    this.renderer.shadowMap.enabled=true;
    this.renderer.shadowMap.type=T.PCFSoftShadowMap;
    this.renderer.toneMapping=T.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure=1.03;
    el.append(this.renderer.domElement);
    this.cameraControl=new CameraController(this.renderer.domElement);
    this.scene.add(this.ambient,this.root);
    const sun=this.sun;
    sun.position.copy(SUN.offset);sun.castShadow=true;
    Object.assign(sun.shadow.camera,{left:-8,right:8,top:8,bottom:-8,near:1,far:31});
    sun.shadow.mapSize.set(2048,2048);sun.shadow.bias=-.00006;sun.shadow.normalBias=.006;
    this.scene.add(sun,sun.target);
    this.environment=new Environment(this.scene);this.environment.setSun(this.sun.position.clone().sub(this.sun.target.position));
    this.seasons=new SeasonCycle(this.scene,this.sun,this.ambient);
    this.villagers=new Villagers(this.scene,{
      ready:id=>this.ready(id),yaw:id=>this.buildings.get(id)?.rotation.y??0,resourceReady:id=>this.resourceReady(id),pickTree:(id,index)=>this.pickTree(id,index),workPoint:(id,index)=>this.workPoint(id,index),obstacles:id=>this.obstacles(id),pickup:(id,index,take)=>this.pickup(id,index,take),
      harvest:(id,resource,index,actor)=>this.harvest(id,resource,index,actor),
      harvestProgress:(id,actor,progress)=>{const key=`${id}:${actor}`;if(progress)this.harvestParts.set(key,{id,progress});else this.harvestParts.delete(key)},
      contactDistance:(id,index,point)=>{const rock=this.buildings.get(id)?.children.find(t=>t.userData.treeIndex===index);return rock?new T.Box3().setFromObject(rock).distanceToPoint(point):Infinity},
      fishingSpot:id=>this.fishingSpot(id),impact:(id,index)=>this.woodImpact(id,index),splash:(x,z)=>this.environment.stir(x,z,1,0,.45,.1),trail:points=>this.addTrail(points),deliver:(source,store,resource,amount)=>this.onDelivery(source,store,resource,amount),
    },this.el);
    this.scene.add(this.trails);
    this.trails.count=0;this.trails.frustumCulled=false;

    this.grid=new PlacementGrid(this.scene);
    const resize=()=>{const {clientWidth:w,clientHeight:h}=el;this.renderer.setSize(w,h);this.cameraControl.resize(w,h)};
    new ResizeObserver(resize).observe(el);resize();
    const canvas=this.renderer.domElement;
    canvas.addEventListener('wheel',()=>{this.lastSea=null;this.seaPointerSpeed=0},{passive:true});
    canvas.addEventListener('pointerdown',()=>{this.lastSea=null;this.seaPointerSpeed=0});
    canvas.addEventListener('pointermove',e=>{if(this.selected&&!e.buttons)this.point(e.clientX,e.clientY)});
    canvas.addEventListener('pointerleave',()=>{this.detailPointer=null;this.detailTile=-1;this.setHover(-1);this.lastSea=null;this.onInspect(-1,0,0,null)});
    canvas.addEventListener('pointermove',e=>{this.stirSea(e);this.inspectPointer(e)});
    canvas.addEventListener('click',e=>{
      if(e.button!==0)return;
      if(this.selected){const i=this.point(e.clientX,e.clientY);if(i>=0)this.onPick(i)}
      else if(!this.placing&&!document.querySelector('dialog[open]')){
        const i=this.grid.pick(e.clientX,e.clientY,this.cameraControl.camera,this.el);
        this.editTile(this.board.has(i)?i:-1);
      }
    });
    window.addEventListener('wheel',event=>{
      if(((!this.selected||this.selected.event)&&this.editing<0)||document.querySelector('dialog[open]'))return;
      event.preventDefault();event.stopImmediatePropagation();
      const delta=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?300:1);
      this.wheelRotation=T.MathUtils.clamp(this.wheelRotation+delta,-240,240);
      const steps=Math.trunc(this.wheelRotation/60);
      if(steps){this.wheelRotation-=steps*60;this.rotateSelection(steps)}
    },{capture:true,passive:false});
    window.addEventListener('keydown',event=>{
      if(event.key.toLowerCase()!=='r'||event.repeat||event.ctrlKey||event.metaKey||event.altKey||document.querySelector('dialog[open]'))return;
      if(event.target instanceof Element&&event.target.closest('input,textarea,select,[contenteditable]'))return;
      if((this.selected&&!this.selected.event)||this.editing>=0){event.preventDefault();this.rotateSelection(event.shiftKey?-1:1)}
    });
    this.renderer.setAnimationLoop(this.frame);
  }

  set onFenceBreak(callback:()=>void){this.environment.onFenceBreak=callback}
  set onFenceBuild(callback:()=>void){this.environment.onFenceBuild=callback}
  bindGame(game:Game){this.game=game;this.villagers.reset(game)}
  private ready(id:number){return this.board.has(id)&&this.buildings.has(id)&&!this.builds.some(b=>b.id===id)&&!this.demolitions.some(d=>d.id===id)}
  private pickTree(id:number,preferred:number){
    for(let j=0;j<3;j++){const index=(preferred+j)%3;if(!this.treeCycles.has(`${id}:${index}`)&&this.buildings.get(id)?.children.some(t=>t.userData.treeIndex===index))return index}
    return -1;
  }
  private workPoint(id:number,index:number){
    const p=position(id),g=this.buildings.get(id),tree=g?.children.find(t=>t.userData.treeIndex===index);
    if(tree){tree.updateWorldMatrix(true,false);const v=tree.getWorldPosition(new T.Vector3());const stone=this.board.get(id)==='stone';return new T.Vector3(v.x+.05,LAND_Y,v.z+(stone?.38:.26))}
    const kind=this.board.get(id),yaw=g?.rotation.y??0,x=kind==='farm'?(index%2?-.13:.13):kind==='berry'?(index%2?-.18:.18):0,z=kind==='farm'?.10:.62;
    return new T.Vector3(p.x+x*Math.cos(yaw)+z*Math.sin(yaw),LAND_Y,p.z-x*Math.sin(yaw)+z*Math.cos(yaw));
  }
  private obstacles(id:number){
    const g=this.buildings.get(id);if(!g)return [];
    return g.children.filter(t=>t.userData.treeIndex!==undefined&&t.visible&&!this.treeCycles.has(`${id}:${t.userData.treeIndex}`)).map(t=>{const p=t.getWorldPosition(new T.Vector3());return {x:p.x,z:p.z,r:this.board.get(id)==='stone'?.31:.14}});
  }
  private pickup(id:number,index:number,take:boolean){
    const key=`${id}:${index}`,drop=this.drops.get(key);if(!drop||drop.claimed)return null;
    const p=drop.group.position.clone();p.z+=.23;p.y=LAND_Y;
    if(take){if(drop.age<1.7)return null;drop.claimed=true;this.scene.remove(drop.group);this.drops.delete(key)}
    return p;
  }
  private dust(p:T.Vector3,count=18){
    for(let i=0;i<count;i++){
      const material=new T.MeshLambertMaterial({color:i%2?0xc4b38e:0xd5c6a6,transparent:true,opacity:.42,depthWrite:false});
      const mesh=new T.Mesh(this.moteGeo,material);mesh.position.copy(p);mesh.position.y+=.08;this.scene.add(mesh);
      this.motes.push({mesh,velocity:new T.Vector3((Math.random()-.5)*.65,.12+Math.random()*.22,(Math.random()-.5)*.65),life:1.3+Math.random()*.5,dust:true});
    }
  }
  upgradeStorage(id:number){
    const g=this.buildings.get(id);if(!g||!this.game)return;
    let decor=this.storageDecor.get(id);if(!decor){decor=new T.Group();g.add(decor);this.storageDecor.set(id,decor)}
    decor.clear();const level=this.game.storageLevels.get(id)??1;
    for(let i=0;i<Math.min(level-1,8);i++){
      const x=i%2?-.47:.47,z=-.24+Math.floor(i/2)*.16;
      box(decor,0xb38a56,x,.12,z,.19,.23,.14);box(decor,0x72533b,x,.12,z+.075,.20,.026,.018);
    }
    for(let i=0;i<Math.min(level,8);i++)part(decor,new T.OctahedronGeometry(.04),0xe6bd66,-.21+i*.06,.64,.34);
    decor.userData.upgradedAt=this.time;this.burst(id);
    const el=document.createElement('div');el.className='float bonus';el.textContent=`Depo seviye ${level} · ${this.game.storageCapacity(id)} kapasite`;this.el.append(el);this.labels.push({el,position:cellPosition(id,1.1),life:2.5,delay:0});
  }
  private harvest(id:number,resource:Resource,index:number,actor:number){
    this.harvestParts.delete(`${id}:${actor}`);
    if(!this.ready(id))return false;
    if(resource==='wood'||resource==='stone'){
      const key=`${id}:${index}`,tree=this.buildings.get(id)?.children.find(t=>t.userData.treeIndex===index);
      if(!tree||this.treeCycles.has(key))return false;
      this.onWorkSound(resource==='stone'?'stoneBreak':'woodBreak',tree.getWorldPosition(new T.Vector3()));
      this.woodHits.delete(tree);tree.rotation.x=0;
      this.treeCycles.set(key,{id,tree,age:0,scale:tree.scale.clone()});this.villagers.refreshNavigation();
      if(resource==='stone'){
        const at=tree.getWorldPosition(new T.Vector3());this.dust(at,20);
        for(let i=0;i<30;i++){
          const mesh=new T.Mesh(this.moteGeo,i%6===0?this.sparkMat:this.stoneChipMat);mesh.position.copy(at).add(new T.Vector3((Math.random()-.5)*.23,.12+Math.random()*.2,(Math.random()-.5)*.23));
          this.scene.add(mesh);this.motes.push({mesh,velocity:new T.Vector3((Math.random()-.5)*1.6,.65+Math.random()*1.25,(Math.random()-.5)*1.6),life:1.5+Math.random()*.7});
        }
      }
      if(resource==='wood'){
        this.fallLeaves(tree,12);
        const group=new T.Group();group.position.copy(tree.getWorldPosition(new T.Vector3()));group.position.z-=.12;
        const logs=resourceModel('wood');group.add(logs);logs.scale.setScalar(.85);
        const pieces=logs.children.map(mesh=>({mesh,velocity:new T.Vector3((Math.random()-.5)*.14,1+Math.random()*.35,(Math.random()-.5)*.14),spin:new T.Vector3(Math.random()*3,Math.random()*2,Math.random()*3)}));
        group.visible=false;this.scene.add(group);this.drops.set(key,{group,age:0,claimed:false,pieces});
      }
      tree.updateWorldMatrix(true,false);this.makeLoader(key,id,tree.getWorldPosition(new T.Vector3()).add(new T.Vector3(0,.5,0)),30);
    }else if(this.board.get(id)==='berry'||this.board.get(id)==='farm'||this.board.get(id)==='garden'){
      const field=this.fieldState(id);if(field.stock<=0)return false;field.stock--;
      const p=this.workPoint(id,index);this.onWorkSound(this.board.get(id)==='farm'?'wheatHarvest':'berryPick',p);this.dust(p,6);if(this.board.get(id)==='berry'){
        const plants=this.buildings.get(id)?.children.filter(p=>p.userData.plantOrder!==undefined)??[];
        plants.slice(Math.floor(field.stock/field.max*plants.length),Math.ceil((field.stock+1)/field.max*plants.length)).forEach(plant=>plant.userData.hitAt=this.time);
      }
      if(field.stock===0){field.age=0;const p=position(id);this.makeLoader(`field:${id}`,id,new T.Vector3(p.x,LAND_Y+.6,p.z),30)}
    }else if(this.board.get(id)==='fisher'&&!this.fishingSpot(id))return false;
    return true;
  }
  private updateStorageLabels(){
    const game=this.game;if(!game)return;
    const camera=this.cameraControl.camera,pixels=this.el.clientHeight/((camera.top-camera.bottom)/camera.zoom),fade=T.MathUtils.smoothstep(pixels,42,100);
    for(const [id,el] of this.fullStores)if(!game.storageStocks.has(id)||game.storageFree(id)>0){el.remove();this.fullStores.delete(id)}
    for(const id of game.storageStocks.keys()){
      if(game.storageFree(id)>0||!this.ready(id))continue;
      let el=this.fullStores.get(id);if(!el){el=document.createElement('div');el.className='storage-full';el.innerHTML=`${icon('full')}<span>Depo dolu</span>`;el.setAttribute('role','status');this.el.append(el);this.fullStores.set(id,el)}
      const p=this.screenPoint(id,1.1);el.style.left=`${p.x}px`;el.style.top=`${p.y}px`;el.style.opacity=String(fade);el.style.setProperty('--status-scale',String(.35+.65*fade));el.hidden=fade<.01||id!==this.detailTile;
    }
  }
  private fallLeaves(tree:T.Object3D,count:number){
    tree.updateWorldMatrix(true,true);const bounds=new T.Box3().setFromObject(tree),center=bounds.getCenter(new T.Vector3()),size=bounds.getSize(new T.Vector3());
    for(let i=0;i<count&&this.leaves.length<180;i++){
      const mesh=new T.Mesh(this.leafGeo,this.leafMats[Math.floor(Math.random()*this.leafMats.length)]);
      mesh.position.set(center.x+(Math.random()-.5)*size.x*.8,bounds.min.y+size.y*(.5+Math.random()*.4),center.z+(Math.random()-.5)*size.z*.8);
      mesh.rotation.set(Math.random()*Math.PI,Math.random()*Math.PI*2,Math.random()*Math.PI);const scale=.65+Math.random()*.8;mesh.scale.setScalar(scale);this.scene.add(mesh);
      this.leaves.push({mesh,velocity:new T.Vector3((Math.random()-.3)*.3,.08+Math.random()*.12,(Math.random()-.5)*.2),spin:new T.Vector3(1+Math.random()*3,Math.random()*2,Math.random()*3),age:0,life:3+Math.random()*1.5,size:scale});
    }
  }
  private woodImpact(id:number,index:number){
    const tree=this.buildings.get(id)?.children.find(t=>t.userData.treeIndex===index);if(!tree)return;
    this.woodHits.set(tree,.20);tree.updateWorldMatrix(true,false);const p=tree.getWorldPosition(new T.Vector3());
    const stone=this.board.get(id)==='stone';this.onWorkSound(stone?'stoneHit':'woodHit',p);
    if(stone)this.dust(p.clone().add(new T.Vector3(0,.14,.17)),4);else this.fallLeaves(tree,4);
    for(let i=0;i<(stone?14:7);i++){const mesh=new T.Mesh(this.moteGeo,stone?(i<2?this.sparkMat:this.stoneChipMat):this.moteMats[0]);mesh.scale.setScalar(.85);mesh.position.copy(p).add(new T.Vector3(.02,.22,.16));this.scene.add(mesh);this.motes.push({mesh,velocity:new T.Vector3((Math.random()-.5)*.9,.65+Math.random()*.55,.25+Math.random()*.65),life:stone?1.1:.7})}
  }
  private fieldState(id:number){if(!this.fields.has(id)){const max=this.board.get(id)==='farm'?4:3;this.fields.set(id,{stock:max,max,age:0})}return this.fields.get(id)!}
  private resourceReady(id:number){
    const kind=this.board.get(id);
    return (kind==='forest'||kind==='stone')?this.pickTree(id,0)>=0:kind==='berry'||kind==='farm'||kind==='garden'?this.fieldState(id).stock>0:kind==='fisher'?!!this.fishingSpot(id):true;
  }
  private coastalYaw(id:number,current=0,steps=0){
    const p=position(id),open=adjacent(id).filter(n=>!this.board.has(n)).map(n=>{const q=position(n);return Math.atan2(q.x-p.x,q.z-p.z)});
    if(!open.length)return current;
    const delta=(a:number,b:number)=>T.MathUtils.euclideanModulo(a-b+Math.PI,Math.PI*2)-Math.PI;
    let value=current;
    if(steps&&open.length>1){
      const sign=Math.sign(steps);
      for(let i=0;i<Math.abs(steps);i++){
        const next=open.map(a=>({a,d:T.MathUtils.euclideanModulo((a-value)*sign,Math.PI*2)})).filter(x=>x.d>.04).sort((a,b)=>a.d-b.d)[0];
        if(next)value+=next.d*sign;
      }
      return value;
    }
    const points=[...this.board.keys()].map(position),center=points.reduce((v,q)=>({x:v.x+q.x/points.length,z:v.z+q.z/points.length}),{x:0,z:0});
    const score=(a:number)=>{const x=p.x+Math.sin(a)*2.8,z=p.z+Math.cos(a)*2.8;return Math.min(...points.map(q=>Math.hypot(x-q.x,z-q.z)))+Math.hypot(x-center.x,z-center.z)*.15};
    const angle=open.sort((a,b)=>score(b)-score(a)||Math.abs(delta(a,current))-Math.abs(delta(b,current)))[0];return current+delta(angle,current);
  }
  private refreshFences(){
    const openings=new Map<number,number>();
    for(const [id,kind] of this.board)if(kind==='fisher'||kind==='harbor')openings.set(id,this.rotationTargets.get(id)??this.buildings.get(id)?.rotation.y??0);
    this.environment.setShoreOpenings(this.board,openings);
  }
  private alignFisheries(){
    for(const [id,kind] of this.board)if(kind==='fisher'||kind==='harbor'){
      const g=this.buildings.get(id);if(!g)continue;
      const current=this.rotationTargets.get(id)??g.rotation.y;
      if(g.userData.manualCoast){const p=position(id);if(!this.board.has(fromWorld(p.x+Math.sin(current)*1.75,p.z+Math.cos(current)*1.75)))continue;g.userData.manualCoast=false}
      const target=this.coastalYaw(id,current);
      if(Math.abs(target-current)>.01)this.rotationTargets.set(id,target);
    }
  }
  private fishingSpot(id:number){
    const g=this.buildings.get(id);if(!g||this.board.get(id)!=='fisher'||!this.ready(id))return null;
    const p=position(id),yaw=this.rotationTargets.get(id)??g.rotation.y,dx=Math.sin(yaw),dz=Math.cos(yaw),water=new T.Vector3(p.x+dx*1.75,SEA_Y+.03,p.z+dz*1.75);
    if(this.board.has(fromWorld(water.x,water.z)))return null;
    return {stand:new T.Vector3(p.x+dx*.94,LAND_Y,p.z+dz*.94),water};
  }
  private makeLoader(key:string,id:number,point:T.Vector3,total:number){
    this.loaders.get(key)?.el.remove();const el=document.createElement('div');el.className='regrowth-loader';el.hidden=true;el.innerHTML='<i></i><span></span>';el.setAttribute('aria-label','Yeniden büyüyor');this.el.append(el);this.loaders.set(key,{id,el,point,total});
  }
  private updateLoader(key:string,age:number){
    const loader=this.loaders.get(key);if(!loader)return;
    if(!this.board.has(loader.id)||age>=loader.total){loader.el.remove();this.loaders.delete(key);return}
    const camera=this.cameraControl.camera,pixels=this.el.clientHeight/((camera.top-camera.bottom)/camera.zoom),fade=T.MathUtils.smoothstep(pixels,42,100);loader.el.style.opacity=String(fade);loader.el.hidden=fade<.01||loader.id!==this.detailTile;
    const p=loader.point.clone().project(camera);loader.el.style.left=`${(p.x+1)*this.el.clientWidth/2}px`;loader.el.style.top=`${(1-p.y)*this.el.clientHeight/2}px`;
    loader.el.style.setProperty('--progress',`${age/loader.total*360}deg`);loader.el.querySelector('span')!.textContent=`${Math.ceil(loader.total-age)}s`;
  }
  private addTrail(points:WalkPoint[]){
    const object=new T.Object3D();
    for(let i=1;i<points.length;i++){
      const a=points[i-1],b=points[i],steps=Math.ceil(Math.hypot(b.x-a.x,b.z-a.z)/.16);
      for(let j=0;j<=steps;j++){const x=T.MathUtils.lerp(a.x,b.x,j/Math.max(1,steps)),z=T.MathUtils.lerp(a.z,b.z,j/Math.max(1,steps)),key=`${Math.round(x/.13)}:${Math.round(z/.13)}`;
        if(this.trailKeys.has(key)||this.trailPoints.length>=8000)continue;this.trailKeys.add(key);const tile=fromWorld(x,z);this.trailPoints.push({tile,x,z});
        object.position.set(x,LAND_Y+.007,z);object.rotation.y=i+j*.8;object.scale.set(1,.7,.8);object.updateMatrix();this.trails.setMatrixAt(this.trailPoints.length-1,object.matrix);
      }
    }
    this.trails.count=this.trailPoints.length;this.trails.instanceMatrix.needsUpdate=true;
  }
  screenPoint(id:number,y=.7){const p=position(id),v=new T.Vector3(p.x,y,p.z).project(this.cameraControl.camera);return {x:(v.x+1)*this.el.clientWidth/2,y:(1-v.y)*this.el.clientHeight/2}}
  private inspectPointer(event:PointerEvent){
    this.detailPointer=event.buttons?null:{x:event.clientX,y:event.clientY};
    if(this.selected||event.buttons||document.querySelector('dialog[open]')){this.onInspect(-1,0,0,null);return}
    const id=this.grid.pick(event.clientX,event.clientY,this.cameraControl.camera,this.el);
    if(!this.board.has(id)){this.onInspect(-1,0,0,null);this.renderer.domElement.style.cursor='';return}
    this.renderer.domElement.style.cursor='var(--cursor-point)';
    const p=position(id),points=Array.from({length:6},(_,i)=>{const c=corner(i),v=new T.Vector3(p.x+c.x,LAND_Y,p.z+c.z).project(this.cameraControl.camera);return {x:(v.x+1)*this.el.clientWidth/2,y:(1-v.y)*this.el.clientHeight/2}});
    this.onInspect(id,event.clientX,event.clientY,{left:Math.min(...points.map(p=>p.x)),right:Math.max(...points.map(p=>p.x)),top:Math.min(...points.map(p=>p.y))-35,bottom:Math.max(...points.map(p=>p.y))});
  }

  holdSelection(){this.placementQueued=true;this.cameraControl.setPlacement(false)}
  get placementRotation(){this.placedManualCell=this.ghostManualCell;return this.desiredGhostYaw}
  rotateSelection(steps:number){
    this.lastRotationWake=this.time-.06;this.villagers.refreshNavigation();
    if(this.selected&&!this.selected.event){if(['fisher','harbor'].includes(this.selected.id))this.ghostManualCell=this.hover;this.desiredGhostYaw=['fisher','harbor'].includes(this.selected.id)&&this.hover>=0?this.coastalYaw(this.hover,this.desiredGhostYaw,steps):this.desiredGhostYaw+steps*Math.PI/3}
    else if(this.editing>=0&&!this.placing){
      const g=this.buildings.get(this.editing);if(g){if(['fisher','harbor'].includes(this.board.get(this.editing)!))g.userData.manualCoast=true;const current=this.rotationTargets.get(this.editing)??g.rotation.y;this.rotationTargets.set(this.editing,['fisher','harbor'].includes(this.board.get(this.editing)!)?this.coastalYaw(this.editing,current,steps):current+steps*Math.PI/3)}
    }
    this.refreshFences();
  }
  get placing(){return this.builds.length>0||this.demolitions.length>0}
  editTile(id:number){
    this.editing=id;this.wheelRotation=0;
    this.grid.setHover(id,true,id>=0);this.onTileSelect(id);
  }
  demolish(board:ReadonlyMap<number,Kind>,id:number){
    const group=this.buildings.get(id);if(!group)return;
    this.editTile(-1);this.rotationTargets.delete(id);this.board=board;
    this.grid.rebuild(board);this.grid.showAvailable(false,this.valid);
    this.environment.demolish(board,id);this.demolitions.push({id,group,time:0});
  }

  point(x:number,y:number) {
    if(this.placementQueued)return this.hover;
    // Pointer capture delivers the gesture even over HUD. Only the visible sea/land is playable.
    const hit=document.elementFromPoint(x,y);
    let i=hit===this.renderer.domElement?this.grid.pick(x,y,this.cameraControl.camera,this.el):-1;
    if(hit===this.renderer.domElement&&this.selected&&!this.selected.event&&!this.valid(i)){
      const nearby=this.grid.nearestAvailable(x,y,this.cameraControl.camera,this.el,this.valid);if(nearby>=0)i=nearby;
    }
    this.setHover(i);return i;
  }
  private stirSea(event:PointerEvent){
    if(event.buttons||this.selected||this.editing>=0||this.game?.paused||document.hidden||document.querySelector('dialog[open]')||event.pointerType==='touch'){
      this.lastSea=null;this.seaPointerSpeed=0;return;
    }
    const r=this.renderer.domElement.getBoundingClientRect();
    if(r.width<=0||r.height<=0)return;
    this.seaRay.setFromCamera(new T.Vector2((event.clientX-r.left)/r.width*2-1,1-(event.clientY-r.top)/r.height*2),this.cameraControl.camera);
    if(!this.seaRay.ray.intersectPlane(this.seaPlane,this.seaPoint)||this.board.has(fromWorld(this.seaPoint.x,this.seaPoint.z))){
      this.lastSea=null;this.seaPointerSpeed=0;return;
    }
    const {x,z}=this.seaPoint,now=performance.now()/1000,previous=this.lastSea;
    if(!previous||now-previous.time>.24){
      this.lastSea={x,z,time:now};this.seaPointerSpeed=0;return;
    }
    const elapsed=now-previous.time,dx=x-previous.x,dz=z-previous.z,distance=Math.hypot(dx,dz);
    if(distance>1.5){this.lastSea={x,z,time:now};this.seaPointerSpeed=0;return}
    // Accumulate small movements instead of losing them on high-rate mice.
    if(elapsed<.105||distance<.018)return;
    this.lastSea={x,z,time:now};
    this.seaPointerSpeed=T.MathUtils.damp(this.seaPointerSpeed,distance/Math.max(.01,elapsed),9,elapsed);
    const strength=T.MathUtils.smoothstep(this.seaPointerSpeed,.08,5);
    const span=Math.min(distance,.5);
    if(this.environment.stir(x,z,dx/distance,dz/distance,strength,span)){
      // Sample the swept path too, so a passing stroke only startles fish it actually reaches.
      const samples=Math.max(1,Math.ceil(span/.18));
      for(let i=0;i<samples;i++){
        const offset=span*i/samples;
        this.environment.frightenFish(x-dx/distance*offset,z-dz/distance*offset,strength,span/samples);
      }
    }
  }
  private setHover(i:number,force=false) {
    if(this.editing>=0&&!this.selected){this.grid.setHover(this.editing,true,true);return}
    if(!force&&i===this.hover)return;
    this.hover=i;
    const valid=i>=0&&this.valid(i);
    this.grid.setHover(i,valid,!!this.selected);
    if(this.ghost){
      const wasVisible=this.ghost.visible;
      this.ghost.visible=i>=0;
      if(i>=0){
        this.previewFade=wasVisible?.3:0;
        if(this.selected&&['fisher','harbor'].includes(this.selected.id)&&this.ghostManualCell!==i)this.desiredGhostYaw=this.coastalYaw(i,this.desiredGhostYaw);
        this.ghostTarget.copy(cellPosition(i,this.board.has(i)?LAND_Y+.035:LAND_Y+.025));
        if(!wasVisible)this.ghost.position.copy(this.ghostTarget);
        this.ghostPalette.forEach(({mat,base})=>{
          mat.color.copy(base).lerp(new T.Color(valid?0xc5e7ae:0xe98875),valid?.04:.65);
          mat.opacity=0;mat.transparent=true;mat.depthWrite=true;
        });
      }
    }
    if(this.previewLand){this.scene.remove(this.previewLand);this.previewLand.geometry.dispose();this.previewLand=null}
    if(this.ghost&&valid&&!this.selected?.event&&!this.board.has(i)){
      const preview=new Map(this.board);preview.set(i,this.selected!.id as Kind);
      this.previewLand=new T.Mesh(terrainGeometry(i,preview,true),this.previewLandMat);
      this.previewLand.position.copy(this.ghost.position);this.previewLand.position.y=0;
      this.previewLand.castShadow=false;this.previewLand.receiveShadow=false;this.previewLand.renderOrder=3;this.scene.add(this.previewLand);
    }
    this.onHover(i);
  }
  setSelection(card:Card|null,carrying=false) {
    this.ghostManualCell=-1;
    this.editTile(-1);this.onInspect(-1,0,0,null);
    const same=!!card&&card===this.selected;
    const targetYaw=same?this.desiredGhostYaw:0,currentYaw=same?(this.ghostModel?.rotation.y??targetYaw):0;
    this.cameraControl.setPlacement(carrying);
    if(this.previewLand){this.scene.remove(this.previewLand);this.previewLand.geometry.dispose();this.previewLand=null}
    if(this.ghost){this.scene.remove(this.ghost);this.ghost=null}
    this.ghostPalette.forEach(p=>p.mat.dispose());this.ghostPalette=[];
    this.selected=card;this.fisherOffset=same?this.fisherOffset:0;this.placementQueued=false;this.ghostModel=null;this.desiredGhostYaw=targetYaw;this.wheelRotation=0;
    if(card){
      this.ghost=new T.Group();this.ghostModel=model(card.id);this.ghostModel.rotation.y=currentYaw;this.ghost.add(this.ghostModel);this.ghost.scale.setScalar(['house','manor','store','lumber','fisher','harbor'].includes(card.id)?BUILDING_SCALE:['berry','farm'].includes(card.id)?.75:1);
      this.ghost.traverse(o=>{if(o instanceof T.Mesh){
        const mat=(o.material as T.MeshStandardMaterial).clone();
        this.ghostPalette.push({mat,base:mat.color.clone()});mat.transparent=true;mat.opacity=.72;mat.depthWrite=false;
        o.material=mat;o.castShadow=false;o.receiveShadow=false;o.renderOrder=0;
      }});
      this.scene.add(this.ghost);this.ghost.visible=false;
    }
    this.grid.showAvailable(!!card&&!card.event,this.valid);this.setHover(-1,true);
  }
  private refreshMeadow(id:number){
    const group=this.buildings.get(id);if(!group)return;
    const scale=group.scale.clone(),y=group.position.y,kind=this.board.get(id)!;
    group.scale.setScalar(['house','manor','store','lumber','fisher','harbor'].includes(kind)?BUILDING_SCALE:['berry','farm'].includes(kind)?.75:1);group.position.y=LAND_Y;group.updateWorldMatrix(true,true);
    const center=position(id),boxes:T.Box3[]=[];
    group.traverse(o=>{if(o instanceof T.Mesh&&o.material!==this.contact){const b=new T.Box3().setFromObject(o);b.translate(new T.Vector3(-center.x,0,-center.z));boxes.push(b)}});
    this.environment.setMeadow(id,boxes);group.scale.copy(scale);group.position.y=y;group.updateWorldMatrix(true,true);
  }
  sync(board:ReadonlyMap<number,Kind>,placed=-1,rotation=0,refresh=false) {
    const opening=this.buildings.size===0;
    if(placed>=0&&!opening&&this.seasons.breakIce(placed))this.onWorkSound('iceBreak',cellPosition(placed,SEA_Y));
    this.board=board;this.villagers.refreshNavigation();
    if(this.trailPoints.some(p=>!board.has(p.tile))){
      const kept=this.trailPoints.filter(p=>board.has(p.tile));this.trailPoints=[];this.trailKeys.clear();this.trails.count=0;
      for(const point of kept)this.addTrail([point,{...point,x:point.x+.001}]);
    }
    if(opening||placed>=0||refresh){
      this.grid.rebuild(board);this.environment.sync(board,placed);
      const centers=[...board.keys()].map(position);
      this.cameraControl.frameIsland(centers,opening);
      const x=(Math.max(...centers.map(p=>p.x))+Math.min(...centers.map(p=>p.x)))/2;
      const z=(Math.max(...centers.map(p=>p.z))+Math.min(...centers.map(p=>p.z)))/2;
      const radius=Math.max(3,...centers.map(p=>Math.hypot(p.x-x,p.z-z)+2));
      this.sun.target.position.set(x,0,z);this.sun.position.copy(this.sun.target.position).add(SUN.offset);this.environment.setSun(this.sun.position.clone().sub(this.sun.target.position));
      Object.assign(this.sun.shadow.camera,{left:-radius,right:radius,top:radius,bottom:-radius,far:35+radius});
      this.sun.shadow.camera.updateProjectionMatrix();
    }
    board.forEach((kind,i)=>{
      const old=this.buildings.get(i);
      if(!kind){if(old){this.root.remove(old);this.buildings.delete(i)}return}
      if(old)return;
      const g=i===CENTER&&kind==='house'?villageHouse():model(kind);
      const shadow=new T.Mesh(this.contactGeo,this.contact);shadow.position.y=.0025;shadow.renderOrder=1;g.add(shadow);
      g.scale.setScalar(['house','manor','store','lumber','fisher','harbor'].includes(kind)?BUILDING_SCALE:['berry','farm'].includes(kind)?.75:1);
      g.position.copy(cellPosition(i));this.root.add(g);this.buildings.set(i,g);
      if(i===placed){if(['fisher','harbor'].includes(kind)&&this.placedManualCell===i)g.userData.manualCoast=true;g.rotation.y=rotation;g.scale.setScalar(.01);g.visible=false;g.position.y-=.74;this.builds.push({id:i,group:g,time:0,kind})}
    });
    this.alignFisheries();this.refreshFences();
    this.cameraControl.setClearance(Math.max(1.7,...[...this.buildings.values()].map(g=>new T.Box3().setFromObject(g).max.y)));
    if(opening||refresh)for(const id of board.keys())this.refreshMeadow(id);else if(placed>=0)this.refreshMeadow(placed);
  }
  private pulse(i:number,color:number) {
    const material=new T.MeshBasicMaterial({color,transparent:true,opacity:.8,depthWrite:false});
    const mesh=new T.Mesh(this.ringGeo,material);mesh.position.copy(cellPosition(i,LAND_Y+.024));mesh.renderOrder=4;
    this.scene.add(mesh);this.rings.push({mesh,time:0});
  }
  burst(i:number) {
    this.pulse(i,0xffdf9a);
    for(let j=0;j<14;j++){
      const angle=j/14*Math.PI*2;
      const mesh=new T.Mesh(this.moteGeo,this.moteMats[j%3]);mesh.position.copy(cellPosition(i,.18));
      mesh.position.x+=Math.cos(angle)*.22;mesh.position.z+=Math.sin(angle)*.22;
      this.scene.add(mesh);this.motes.push({mesh,velocity:new T.Vector3(Math.cos(angle)*.62,.62+Math.random()*.7,Math.sin(angle)*.62),life:1});
    }
  }
  feedback(p:Production,placed:number,bonuses:readonly number[]=[]) {
    p.rows.filter(r=>r.wood||r.food||r.happy||!r.active).forEach((r,j)=>{
      const el=document.createElement('div');el.className='float'+(r.bonus?' bonus':'');
      el.textContent=[r.wood&&`+${r.wood} odun`,r.food&&`+${r.food} yiyecek`,r.happy&&`+${r.happy} refah`,!r.active&&'İşçi bekliyor'].filter(Boolean).join(' · ');
      el.style.opacity='0';this.el.append(el);
      this.labels.push({el,position:cellPosition(r.i,1.05),life:1.4,delay:(r.i===placed?1.5:.1)+j*.035});
      if(bonuses.includes(r.i)||(r.bonus&&r.i===placed))this.pulse(r.i,0xf7d579);
    });
  }
  reset(){
    this.torches.reset();
    this.staticInstances.clear();
    this.seasons.reset();
    for(const el of this.fullStores.values())el.remove();this.fullStores.clear();this.placedManualCell=-1;
    this.detailTile=-1;this.detailPointer=null;this.setSelection(null);this.cameraControl.reset();this.treeCycles.clear();this.woodHits.clear();this.fields.clear();this.harvestParts.clear();
    this.loaders.forEach(l=>l.el.remove());this.loaders.clear();this.trailPoints=[];this.trailKeys.clear();this.trails.count=0;
    for(const d of this.drops.values())this.scene.remove(d.group);this.drops.clear();this.storageDecor.clear();this.root.clear();this.environment.reset();this.buildings.clear();this.builds=[];this.demolitions=[];this.rotationTargets.clear();
    for(const leaf of this.leaves)this.scene.remove(leaf.mesh);this.leaves=[];
    for(const {el} of this.labels)el.remove();this.labels=[];
    for(const {mesh,dust} of this.motes){this.scene.remove(mesh);if(dust)(mesh.material as T.Material).dispose()}this.motes=[];
    for(const {mesh} of this.rings){this.scene.remove(mesh);(mesh.material as T.Material).dispose()}this.rings=[];
  }
  private frame=(now:number)=>{
    const timestamp=Number.isFinite(now)?now:performance.now();
    const realDt=Math.max(0,Math.min(.065,(timestamp-this.previousTime)/1000));this.previousTime=timestamp;
    const dt=this.game?.paused||document.hidden?0:realDt*gameSpeed.value;this.time+=dt;
    this.cameraControl.update(realDt);this.environment.fitWaterView(this.cameraControl.camera,this.cameraControl.audioFocus);this.environment.update(this.time);this.onSoundFrame(this.cameraControl.camera,this.cameraControl.audioFocus,this.environment.soundBirds,this.environment.soundShore,this.board);
    this.grid.update(dt);
    this.seasons.update(this.game?.paused||document.hidden?0:dt,this.board,this.cameraControl.audioFocus);
    this.environment.setSun(this.waterSunDirection.subVectors(this.sun.position,this.sun.target.position));
    if(this.game){
      const anchors=this.torches.selectAnchors(this.environment.torchAnchors);
      if(dt>0)this.game.updateTorches(climate.night.value>.12,this.seasons.torchNight,[...new Set(anchors.map(anchor=>anchor.id))].sort((a,b)=>Number(b===CENTER)-Number(a===CENTER)||a-b));
      this.torches.update(dt,anchors,this.game,this.cameraControl.audioFocus);
    }
    if(this.ghost?.visible){
      this.previewFade=T.MathUtils.damp(this.previewFade,1,10,dt);
      const valid=this.valid(this.hover);
      for(const {mat} of this.ghostPalette)mat.opacity=this.previewFade*(valid?.78:.38);
      this.previewLandMat.opacity=this.previewFade*.76;
      this.ghost.position.lerp(this.ghostTarget,1-Math.exp(-16*dt));
      if(this.previewLand){this.previewLand.position.x=this.ghost.position.x;this.previewLand.position.z=this.ghost.position.z;}
      if(this.ghostModel){
        const difference=this.desiredGhostYaw-this.ghostModel.rotation.y;
        this.ghostModel.rotation.y+=difference*(1-Math.exp(-16*dt));
        if(Math.abs(difference)>.025&&this.time-this.lastRotationWake>.05&&this.valid(this.hover)){
          const angle=this.ghostModel.rotation.y,sign=Math.sign(difference),p=this.ghost.position;
          this.environment.stir(p.x+Math.cos(angle)*.68,p.z+Math.sin(angle)*.68,-Math.sin(angle)*sign,Math.cos(angle)*sign,.32,.10);
          this.lastRotationWake=this.time;
        }
      }
    }
    for(const [id,target] of this.rotationTargets){
      const g=this.buildings.get(id);if(!g){this.rotationTargets.delete(id);continue}
      this.villagers.refreshNavigation();
      const difference=target-g.rotation.y;
      g.rotation.y+=difference*(1-Math.exp(-16*dt));
      if(Math.abs(difference)<.001){g.rotation.y=target;this.rotationTargets.delete(id);this.refreshMeadow(id)}
      else if(this.time-this.lastRotationWake>.05){
        const a=g.rotation.y,sign=Math.sign(difference);
        this.environment.stir(g.position.x+Math.cos(a)*.8,g.position.z+Math.sin(a)*.8,-Math.sin(a)*sign,Math.cos(a)*sign,.35,.1);
        this.lastRotationWake=this.time;
      }
    }
    this.demolitions=this.demolitions.filter(d=>{
      d.time+=dt;const p=easeBetween(d.time,SINK_START,SINK_END);
      d.group.position.y=LAND_Y-1.6*p;d.group.scale.setScalar(1-.70*p);
      d.group.rotation.z=Math.sin(d.time*25)*Math.sin(p*Math.PI)*.035;
      if(d.time>=DEMOLISH_END){this.root.remove(d.group);this.buildings.delete(d.id);this.sync(this.board,-1,0,true);return false}
      return true;
    });
    this.builds=this.builds.filter(b=>{
      const previous=b.time;
      b.time=Math.min(BUILD_END,b.time+dt);
      b.group.visible=b.time>=BUILD_START;
      if(b.time<BUILD_START)return true;
      if(previous<BUILD_START+.28&&b.time>=BUILD_START+.28){this.burst(b.id);this.onPlacementSound(b.kind,cellPosition(b.id,LAND_Y+.2))}
      const growth=easeBetween(b.time,BUILD_START,BUILD_END);
      const bump=Math.sin(Math.PI*growth)*.14;
      const size=['house','manor','store','lumber','fisher','harbor'].includes(b.kind)?BUILDING_SCALE:['berry','farm'].includes(b.kind)?.75:1;
      b.group.scale.set(Math.max(.01,(growth+bump)*size),Math.max(.01,(growth+bump*1.6)*size),Math.max(.01,(growth+bump)*size));
      b.group.position.y=LAND_Y-.55*(1-growth);
      if(b.kind==='berry') b.group.children.forEach(child=>{
        if(child.userData.plantOrder!==undefined){
          const t=easeBetween(b.time,BUILD_START+child.userData.plantOrder*.018,BUILD_END);
          child.scale.setScalar(Math.max(.01,t));
        }
      });
      if(b.time>=BUILD_END){this.villagers.refreshNavigation();this.cameraControl.setClearance(Math.max(1.7,...[...this.buildings.values()].map(g=>new T.Box3().setFromObject(g).max.y)))}
      return b.time<BUILD_END;
    });
    for(const [key,drop] of this.drops){
      const id=Number(key.split(':')[0]);if(!this.board.has(id)){this.scene.remove(drop.group);this.drops.delete(key);continue}
      const before=drop.age;drop.age+=dt;drop.group.visible=drop.age>.85;
      if(before<=.85&&drop.age>.85){this.onWorkSound('woodLand',drop.group.position);this.dust(drop.group.position,32);for(let i=0;i<14;i++){const mesh=new T.Mesh(this.moteGeo,this.moteMats[2]);mesh.position.copy(drop.group.position).add(new T.Vector3(0,.1,0));this.scene.add(mesh);this.motes.push({mesh,velocity:new T.Vector3((Math.random()-.5)*1.2,.4+Math.random()*.8,(Math.random()-.5)*1.2),life:1.2})}}
      if(drop.age>.85)for(const piece of drop.pieces){
        piece.velocity.y-=dt*3.5;piece.mesh.position.addScaledVector(piece.velocity,dt);
        if(piece.mesh.position.y<.035){piece.mesh.position.y=.035;piece.velocity.y=Math.abs(piece.velocity.y)*.27;piece.velocity.x*=.75;piece.velocity.z*=.75;piece.spin.multiplyScalar(.65)}
        piece.velocity.x*=Math.exp(-dt*1.8);piece.velocity.z*=Math.exp(-dt*1.8);piece.mesh.rotation.x+=piece.spin.x*dt;piece.mesh.rotation.z+=piece.spin.z*dt;
      }
      for(let i=0;i<drop.pieces.length;i++)for(let j=i+1;j<drop.pieces.length;j++){
        const a=drop.pieces[i],b=drop.pieces[j],dx=b.mesh.position.x-a.mesh.position.x,dz=b.mesh.position.z-a.mesh.position.z,d=Math.hypot(dx,dz);
        if(d>0&&d<.07&&Math.abs(a.mesh.position.y-b.mesh.position.y)<.055){const push=(.07-d)*.5;a.mesh.position.x-=dx/d*push;b.mesh.position.x+=dx/d*push;a.mesh.position.z-=dz/d*push;b.mesh.position.z+=dz/d*push}
      }
      const center=position(id);
      for(const piece of drop.pieces){const wx=drop.group.position.x+piece.mesh.position.x*.85-center.x,wz=drop.group.position.z+piece.mesh.position.z*.85-center.z,r=Math.hypot(wx,wz);if(r>.63){piece.mesh.position.x=(center.x+wx/r*.63-drop.group.position.x)/.85;piece.mesh.position.z=(center.z+wz/r*.63-drop.group.position.z)/.85;piece.velocity.x*=-.2;piece.velocity.z*=-.2}}
    }
    for(const decor of this.storageDecor.values()){const t=this.time-(decor.userData.upgradedAt??-99);decor.scale.setScalar(1+(t<1?Math.sin(t*Math.PI)*.13:0))}
    let remaining=dt,firstStep=true;
    while(remaining>0){
      const step=Math.min(.065,remaining);this.villagers.update(step,firstStep?2:0);
      firstStep=false;remaining=Math.max(0,remaining-step);
    }
    for(const [id,kind] of this.board)if(kind==='harbor'){
      const ship=this.buildings.get(id)?.getObjectByName('merchant');if(!ship||!this.game)continue;
      const t=this.game.tradeClock;
      ship.visible=t<52;
      const approach=t<6?1-t/6:t>46?(t-46)/6:0;
      ship.position.set(.68,(SEA_Y-LAND_Y)/BUILDING_SCALE+.025*Math.sin(this.time*1.5),1.14+approach*4);
      ship.rotation.y=t>46?Math.PI:0;ship.rotation.z=Math.sin(this.time*1.2)*.035;
    }
    this.detailTile=this.detailPointer&&!this.selected&&!document.querySelector('dialog[open]')?this.grid.pick(this.detailPointer.x,this.detailPointer.y,this.cameraControl.camera,this.el):-1;
    this.villagers.updateStatuses(this.cameraControl.camera,this.el.clientWidth,this.el.clientHeight,this.detailTile);this.updateStorageLabels();
    for(const [tree,left] of this.woodHits){const remaining=left-dt;tree.rotation.x=Math.sin(remaining*45)*.035*Math.max(0,remaining/.2);if(remaining<=0){tree.rotation.x=0;this.woodHits.delete(tree)}else this.woodHits.set(tree,remaining)}
    for(const [key,cycle] of this.treeCycles){
      if(!this.board.has(cycle.id)){this.updateLoader(key,99);this.treeCycles.delete(key);continue}
      cycle.age+=dt;this.updateLoader(key,cycle.age);
      if(this.board.get(cycle.id)==='stone'&&cycle.age<.85){cycle.tree.scale.copy(cycle.scale).multiplyScalar(1-easeBetween(cycle.age,0,.85));cycle.tree.position.y=-.08*easeBetween(cycle.age,0,.85)}
      else if(cycle.age<.85){cycle.tree.rotation.z=easeBetween(cycle.age,0,.85)*1.5;cycle.tree.scale.copy(cycle.scale).multiplyScalar(1-.12*cycle.age/.85)}
      else if(cycle.age<26){cycle.tree.visible=false}
      else{cycle.tree.visible=true;cycle.tree.rotation.z=0;cycle.tree.position.y=0;cycle.tree.scale.copy(cycle.scale).multiplyScalar(Math.max(.01,easeBetween(cycle.age,26,30)))}
      if(cycle.age>=30){cycle.tree.scale.copy(cycle.scale);this.treeCycles.delete(key);this.villagers.refreshNavigation()}
    }
    for(const [id,field] of this.fields){
      if(!this.board.has(id)){this.updateLoader(`field:${id}`,99);this.fields.delete(id);continue}
      const kind=this.board.get(id),duration=30;
      if(field.stock===0){field.age+=dt;this.updateLoader(`field:${id}`,field.age);if(field.age>=duration){field.stock=field.max;field.age=0}}
      const partial=[...this.harvestParts.values()].filter(p=>p.id===id).reduce((n,p)=>n+p.progress,0);
      const available=field.stock===0?easeBetween(field.age,duration-4,duration):Math.max(0,(field.stock-partial)/field.max);
      const plants=this.buildings.get(id)?.children.filter(p=>p.userData.plantOrder!==undefined||p.userData.cropOrder!==undefined||p.userData.flowerOrder!==undefined)??[];
      plants.forEach((plant,index)=>{const hit=this.time-(plant.userData.hitAt??-99);plant.rotation.z=hit<.55?Math.sin(hit*30)*.16*(1-hit/.55):0;const fraction=T.MathUtils.clamp(available*plants.length-index,0,1);
        if(kind==='farm')plant.scale.y=(plant.userData.cropHeight??1)*(.08+.92*fraction);
        else plant.children.slice(1).forEach(fruit=>fruit.scale.setScalar(Math.max(.01,fraction)));
      });
    }
    this.leaves=this.leaves.filter(leaf=>{
      leaf.age+=dt;const flutter=Math.sin(leaf.age*7+leaf.life);
      leaf.velocity.y=Math.max(-.38,leaf.velocity.y-dt*.45);leaf.mesh.position.addScaledVector(leaf.velocity,dt);leaf.mesh.position.x+=dt*(.10+flutter*.10);leaf.mesh.position.z+=dt*.05*Math.cos(leaf.age*5);
      const land=this.board.has(fromWorld(leaf.mesh.position.x,leaf.mesh.position.z)),floor=land?LAND_Y+.012:SEA_Y+.015;
      if(leaf.mesh.position.y<=floor){leaf.mesh.position.y=floor;leaf.mesh.rotation.x*=Math.exp(-dt*6);leaf.mesh.rotation.z*=Math.exp(-dt*6);leaf.velocity.multiplyScalar(Math.exp(-dt*7))}
      else{leaf.mesh.rotation.x+=dt*leaf.spin.x;leaf.mesh.rotation.y+=dt*leaf.spin.y;leaf.mesh.rotation.z+=dt*leaf.spin.z*flutter}
      leaf.mesh.scale.setScalar(leaf.size*Math.min(1,Math.max(0,(leaf.life-leaf.age)/.65)));
      if(leaf.age>=leaf.life){this.scene.remove(leaf.mesh);return false}return true;
    });
    this.motes=this.motes.filter(m=>{
      m.life-=dt*(m.dust?1:1.15);m.velocity.y-=dt*(m.dust?.12:2.7);m.mesh.position.addScaledVector(m.velocity,dt);
      if(m.mesh.position.y<LAND_Y+.015){m.mesh.position.y=LAND_Y+.015;m.velocity.y=Math.abs(m.velocity.y)*.28;m.velocity.x*=.85;m.velocity.z*=.85}
      m.mesh.scale.setScalar(m.dust?2.5+(1.8-m.life)*3:Math.max(0,Math.min(1.5,m.life)));
      if(m.dust)(m.mesh.material as T.MeshBasicMaterial).opacity=Math.min(.42,m.life*.4);
      if(m.life<=0){this.scene.remove(m.mesh);if(m.dust)(m.mesh.material as T.Material).dispose()}return m.life>0;
    });
    this.rings=this.rings.filter(r=>{
      r.time+=dt*1.65;r.mesh.scale.setScalar(.4+r.time*1.15);const mat=r.mesh.material as T.MeshBasicMaterial;
      mat.opacity=Math.max(0,1-r.time)*.7;if(r.time>=1){this.scene.remove(r.mesh);mat.dispose()}return r.time<1;
    });
    this.labels=this.labels.filter(f=>{
      if(f.delay>0){f.delay-=dt;return true}f.life-=dt;f.position.y+=dt*.38;
      const v=this.projection.copy(f.position).project(this.cameraControl.camera);
      f.el.style.left=`${(v.x+1)*.5*this.el.clientWidth}px`;
      f.el.style.top=`${(1-v.y)*.5*this.el.clientHeight}px`;
      f.el.style.opacity=String(Math.max(0,Math.min(1,f.life*2.8)));
      if(f.life<=0)f.el.remove();return f.life>0;
    });
    this.staticInstances.sync(this.buildings,this.board);this.staticInstances.update();
    this.renderer.render(this.scene,this.cameraControl.camera);
  };
  thumbnails() {
    const images:Record<string,string>={};
    const scene=new T.Scene();scene.add(new T.HemisphereLight(0xfff3dd,0x829578,1.65));
    const light=new T.DirectionalLight(0xffe1b8,2.55);light.position.set(-3,5,4);scene.add(light);
    const camera=new T.OrthographicCamera(-.96,.96,.75,-.75,.1,20);
    camera.position.set(2.9,2.25,3.7);camera.lookAt(0,.43,0);
    const renderer=new T.WebGLRenderer({alpha:true,antialias:true});renderer.setSize(280,220);renderer.toneMapping=T.ACESFilmicToneMapping;
    for(const card of cards){
      const group=model(card.id);if(card.id==='harbor'){group.scale.setScalar(.64);group.position.z=-.22}part(group,new T.CylinderGeometry(.72,.75,.068,6),0x9db77c,0,-.034,0);scene.add(group);
      renderer.render(scene,camera);images[card.id]=renderer.domElement.toDataURL();scene.remove(group);
    }
    renderer.dispose();renderer.forceContextLoss();return images;
  }
}





