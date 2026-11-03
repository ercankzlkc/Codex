import * as T from 'three';
import { CameraController } from './camera';
import { Environment, LAND_Y, SEA_Y } from './environment';
import {CENTER, position, fromWorld,corner,RADIUS,adjacent} from './hex';
import {terrainGeometry} from './scenery';
import {BUILD_START,BUILD_END,SINK_START,SINK_END,DEMOLISH_END,easeBetween} from './emergence';
import { PlacementGrid, cellPosition } from './grid';
import { model, part, box } from './models';
import {Game,STORAGE_RADIUS,BUILDING_SCALE,hexDistance,cards,type Resource,type Card,type Kind,type Production} from './game';
import {Villagers} from './villagers';
import type {WalkPoint} from './navigation';

type Build = { id:number; group:T.Group; time:number; kind:Kind };
type Mote = { mesh:T.Mesh; velocity:T.Vector3; life:number };
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
  readonly renderer=new T.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});
  readonly cameraControl:CameraController;
  readonly grid:PlacementGrid;
  readonly environment:Environment;
  readonly villagers:Villagers;
  private game:Game|null=null;
  private readonly storageRange=new T.Group();
  private treeCycles=new Map<string,{id:number;tree:T.Object3D;age:number;scale:T.Vector3}>();
  private fields=new Map<number,{stock:number;max:number;age:number}>();
  private harvestParts=new Map<string,{id:number;progress:number}>();
  private loaders=new Map<string,{id:number;el:HTMLElement;point:T.Vector3;total:number}>();
  private readonly coveredTiles=new T.Group();
  private readonly coverageGeo=new T.CircleGeometry(RADIUS*.90,6,Math.PI/2).rotateX(-Math.PI/2);
  private readonly coverageFill=new T.MeshBasicMaterial({color:0xd4edaa,transparent:true,opacity:.11,depthWrite:false,depthTest:false,side:T.DoubleSide});
  private readonly coverageLine=new T.LineBasicMaterial({color:0xf6edbd,transparent:true,opacity:.85,depthWrite:false,depthTest:false});
  private readonly coverageRim=new T.BufferGeometry().setFromPoints(Array.from({length:6},(_,i)=>{const p=corner(i,RADIUS*.94);return new T.Vector3(p.x,0,p.z)}));
  private readonly trails=new T.InstancedMesh(new T.CircleGeometry(.055,5).rotateX(-Math.PI/2),new T.MeshBasicMaterial({color:0xccbc95,transparent:true,opacity:.42,depthWrite:false}),8000);
  private trailPoints:{tile:number;x:number;z:number}[]=[];
  private trailKeys=new Set<string>();
  private fisherOffset=0;
  private woodHits=new Map<T.Object3D,number>();
  private root=new T.Group();
  private buildings=new Map<number,T.Group>();
  private editing=-1;
  private rotationTargets=new Map<number,number>();
  private demolitions:{id:number;group:T.Group;time:number}[]=[];
  private ghost:T.Group|null=null;
  private ghostModel:T.Group|null=null;
  private desiredGhostYaw=0;
  private lastRotationWake=0;
  private wheelRotation=0;
  private placementQueued=false;
  private previewLand:T.Mesh|null=null;
  private readonly previewLandMat=new T.MeshStandardMaterial({vertexColors:true,roughness:1,flatShading:true,side:T.DoubleSide});
  private readonly seaRay=new T.Raycaster();
  private readonly seaPlane=new T.Plane(new T.Vector3(0,1,0),-SEA_Y);
  private readonly seaPoint=new T.Vector3();
  private lastSea:{x:number;z:number;time:number}|null=null;
  private board:ReadonlyMap<number,Kind>=new Map();
  private sun=new T.DirectionalLight(0xffe1b7,2.35);
  private ghostPalette:{mat:T.MeshStandardMaterial;base:T.Color}[]=[];
  private readonly ghostTarget=new T.Vector3();
  private readonly contact=contactMaterial();
  private readonly contactGeo=new T.PlaneGeometry(1.48,1.26).rotateX(-Math.PI/2);
  private readonly moteGeo=new T.IcosahedronGeometry(.032,0);
  private readonly moteMats=[0xe9cb83,0xc5d99a,0xdab68a].map(color=>new T.MeshBasicMaterial({color}));
  private builds:Build[]=[];
  private motes:Mote[]=[];
  private labels:Label[]=[];
  private rings:{mesh:T.Mesh;time:number}[]=[];
  private readonly ringGeo=new T.RingGeometry(.47,.49,32).rotateX(-Math.PI/2);
  private readonly projection=new T.Vector3();
  private selected:Card|null=null;
  private previousTime=performance.now();
  private time=0;
  hover=-1;
  valid=(_i:number)=>false;
  onHover=(_i:number)=>{};
  onPick=(_i:number)=>{};
  onTileSelect=(_i:number)=>{};
  onDelivery=(_source:number,_store:number,_resource:Resource,_amount:number)=>{};
  onInspect=(_id:number,_x:number,_y:number,_bounds:{left:number;right:number;top:number;bottom:number}|null)=>{};

  constructor(readonly el:HTMLElement) {
    this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));
    this.renderer.shadowMap.enabled=true;
    this.renderer.shadowMap.type=T.PCFSoftShadowMap;
    this.renderer.toneMapping=T.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure=1.03;
    el.append(this.renderer.domElement);
    this.cameraControl=new CameraController(this.renderer.domElement);
    this.scene.add(new T.HemisphereLight(0xfff1d8,0x849880,1.55),this.root);
    const sun=this.sun;
    sun.position.set(-5,10,4);sun.castShadow=true;
    Object.assign(sun.shadow.camera,{left:-8,right:8,top:8,bottom:-8,near:1,far:31});
    sun.shadow.mapSize.set(2048,2048);sun.shadow.bias=-.00012;sun.shadow.normalBias=.015;
    this.scene.add(sun,sun.target);
    this.environment=new Environment(this.scene);
    this.villagers=new Villagers(this.scene,{
      ready:id=>this.ready(id),yaw:id=>this.buildings.get(id)?.rotation.y??0,resourceReady:id=>this.resourceReady(id),pickTree:(id,index)=>this.pickTree(id,index),workPoint:(id,index)=>this.workPoint(id,index),
      harvest:(id,resource,index,actor)=>this.harvest(id,resource,index,actor),
      harvestProgress:(id,actor,progress)=>{const key=`${id}:${actor}`;if(progress)this.harvestParts.set(key,{id,progress});else this.harvestParts.delete(key)},
      fishingSpot:id=>this.fishingSpot(id),impact:(id,index)=>this.woodImpact(id,index),splash:(x,z)=>this.environment.stir(x,z,1,0,.45,.1),trail:points=>this.addTrail(points),deliver:(source,store,resource,amount)=>this.onDelivery(source,store,resource,amount),
    });
    const radius=RADIUS*Math.sqrt(3)*STORAGE_RADIUS+.55;
    const fill=new T.Mesh(new T.CircleGeometry(radius,6).rotateX(-Math.PI/2),new T.MeshBasicMaterial({color:0xf4db99,transparent:true,opacity:.065,depthWrite:false,side:T.DoubleSide}));
    const outline=new T.LineLoop(new T.BufferGeometry().setFromPoints(Array.from({length:6},(_,i)=>new T.Vector3(Math.cos(i*Math.PI/3)*radius,0,Math.sin(i*Math.PI/3)*radius))),new T.LineBasicMaterial({color:0xffe7ac,transparent:true,opacity:.75,depthWrite:false}));
    this.storageRange.add(fill,outline);this.storageRange.visible=false;this.scene.add(this.storageRange,this.coveredTiles,this.trails);
    this.trails.count=0;this.trails.frustumCulled=false;

    this.grid=new PlacementGrid(this.scene);
    const resize=()=>{const {clientWidth:w,clientHeight:h}=el;this.renderer.setSize(w,h);this.cameraControl.resize(w,h)};
    new ResizeObserver(resize).observe(el);resize();
    const canvas=this.renderer.domElement;
    canvas.addEventListener('pointermove',e=>{if(this.selected&&!e.buttons)this.point(e.clientX,e.clientY)});
    canvas.addEventListener('pointerleave',()=>{this.setHover(-1);this.lastSea=null;this.onInspect(-1,0,0,null)});
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

  bindGame(game:Game){this.game=game;this.villagers.reset(game)}
  private ready(id:number){return this.board.has(id)&&this.buildings.has(id)&&!this.builds.some(b=>b.id===id)&&!this.demolitions.some(d=>d.id===id)}
  private pickTree(id:number,preferred:number){
    for(let j=0;j<3;j++){const index=(preferred+j)%3;if(!this.treeCycles.has(`${id}:${index}`)&&this.buildings.get(id)?.children.some(t=>t.userData.treeIndex===index))return index}
    return -1;
  }
  private workPoint(id:number,index:number){
    const p=position(id),g=this.buildings.get(id),tree=g?.children.find(t=>t.userData.treeIndex===index);
    if(tree){tree.updateWorldMatrix(true,false);const v=tree.getWorldPosition(new T.Vector3());return new T.Vector3(v.x+.18,LAND_Y,v.z+.18)}
    const yaw=g?.rotation.y??0,x=['farm','berry'].includes(this.board.get(id)??'')?(index%2?-.18:.18):0,z=.62;
    return new T.Vector3(p.x+x*Math.cos(yaw)+z*Math.sin(yaw),LAND_Y,p.z-x*Math.sin(yaw)+z*Math.cos(yaw));
  }
  private harvest(id:number,resource:Resource,index:number,actor:number){
    this.harvestParts.delete(`${id}:${actor}`);
    if(!this.ready(id))return false;
    if(resource==='wood'){
      const key=`${id}:${index}`,tree=this.buildings.get(id)?.children.find(t=>t.userData.treeIndex===index);
      if(!tree||this.treeCycles.has(key))return false;
      this.treeCycles.set(key,{id,tree,age:0,scale:tree.scale.clone()});
      tree.updateWorldMatrix(true,false);this.makeLoader(key,id,tree.getWorldPosition(new T.Vector3()).add(new T.Vector3(0,.5,0)),14);
    }else if(this.board.get(id)==='berry'||this.board.get(id)==='farm'){
      const field=this.fieldState(id);if(field.stock<=0)return false;field.stock--;
      if(field.stock===0){field.age=0;const p=position(id);this.makeLoader(`field:${id}`,id,new T.Vector3(p.x,LAND_Y+.6,p.z),this.board.get(id)==='berry'?12:18)}
    }else if(this.board.get(id)==='fisher'&&!this.fishingSpot(id))return false;
    return true;
  }
  showStorageRange(id:number,preview=false){
    const show=id>=0&&(preview||id===CENTER||this.board.get(id)==='store');this.storageRange.visible=show;this.coveredTiles.clear();
    if(!show)return;
    const range=id===CENTER&&!preview?2:STORAGE_RADIUS,p=position(id);this.storageRange.position.set(p.x,LAND_Y+.025,p.z);this.storageRange.scale.setScalar(range/STORAGE_RADIUS);
    for(const cell of new Set([...this.board.keys(),...(preview?[id]:[])]))if(hexDistance(id,cell)<=range){
      const p=position(cell),root=new T.Group();root.position.set(p.x,LAND_Y+.045,p.z);
      const fill=new T.Mesh(this.coverageGeo,this.coverageFill),rim=new T.LineLoop(this.coverageRim,this.coverageLine);fill.renderOrder=8;rim.renderOrder=9;root.add(fill,rim);this.coveredTiles.add(root);
    }
  }
  private woodImpact(id:number,index:number){
    const tree=this.buildings.get(id)?.children.find(t=>t.userData.treeIndex===index);if(!tree)return;
    this.woodHits.set(tree,.20);tree.updateWorldMatrix(true,false);const p=tree.getWorldPosition(new T.Vector3());
    for(let i=0;i<3;i++){const mesh=new T.Mesh(this.moteGeo,this.moteMats[0]);mesh.scale.setScalar(.45);mesh.position.copy(p).add(new T.Vector3(0,.25,0));this.scene.add(mesh);this.motes.push({mesh,velocity:new T.Vector3((Math.random()-.5)*.45,.35+Math.random()*.25,(Math.random()-.5)*.45),life:.3})}
  }
  private fieldState(id:number){if(!this.fields.has(id)){const max=this.board.get(id)==='farm'?4:3;this.fields.set(id,{stock:max,max,age:0})}return this.fields.get(id)!}
  private resourceReady(id:number){
    const kind=this.board.get(id);
    return kind==='forest'?this.pickTree(id,0)>=0:kind==='berry'||kind==='farm'?this.fieldState(id).stock>0:kind==='fisher'?!!this.fishingSpot(id):true;
  }
  private fishingYaw(id:number){const p=position(id),sea=adjacent(id).find(n=>!this.board.has(n));if(sea===undefined)return 0;const q=position(sea);return Math.atan2(q.x-p.x,q.z-p.z)}
  private fishingSpot(id:number){
    const g=this.buildings.get(id);if(!g||this.board.get(id)!=='fisher'||!this.ready(id))return null;
    const p=position(id),dx=Math.sin(g.rotation.y),dz=Math.cos(g.rotation.y),water=new T.Vector3(p.x+dx*1.75,SEA_Y+.03,p.z+dz*1.75);
    if(this.board.has(fromWorld(water.x,water.z)))return null;
    return {stand:new T.Vector3(p.x+dx*.70,LAND_Y,p.z+dz*.70),water};
  }
  private makeLoader(key:string,id:number,point:T.Vector3,total:number){
    this.loaders.get(key)?.el.remove();const el=document.createElement('div');el.className='regrowth-loader';el.innerHTML='<i></i><span></span>';el.setAttribute('aria-label','Yeniden büyüyor');this.el.append(el);this.loaders.set(key,{id,el,point,total});
  }
  private updateLoader(key:string,age:number){
    const loader=this.loaders.get(key);if(!loader)return;
    if(!this.board.has(loader.id)||age>=loader.total){loader.el.remove();this.loaders.delete(key);return}
    const p=loader.point.clone().project(this.cameraControl.camera);loader.el.style.left=`${(p.x+1)*this.el.clientWidth/2}px`;loader.el.style.top=`${(1-p.y)*this.el.clientHeight/2}px`;
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
    if(this.selected||event.buttons||document.querySelector('dialog[open]')){this.onInspect(-1,0,0,null);return}
    const id=this.grid.pick(event.clientX,event.clientY,this.cameraControl.camera,this.el);
    if(!this.board.has(id)){this.onInspect(-1,0,0,null);this.renderer.domElement.style.cursor='';return}
    this.renderer.domElement.style.cursor='pointer';
    const p=position(id),points=Array.from({length:6},(_,i)=>{const c=corner(i),v=new T.Vector3(p.x+c.x,LAND_Y,p.z+c.z).project(this.cameraControl.camera);return {x:(v.x+1)*this.el.clientWidth/2,y:(1-v.y)*this.el.clientHeight/2}});
    this.onInspect(id,event.clientX,event.clientY,{left:Math.min(...points.map(p=>p.x)),right:Math.max(...points.map(p=>p.x)),top:Math.min(...points.map(p=>p.y))-35,bottom:Math.max(...points.map(p=>p.y))});
  }

  holdSelection(){this.placementQueued=true;this.cameraControl.setPlacement(false)}
  get placementRotation(){return this.desiredGhostYaw}
  rotateSelection(steps:number){
    this.lastRotationWake=this.time-.06;this.villagers.refreshNavigation();
    if(this.selected&&!this.selected.event){this.desiredGhostYaw+=steps*Math.PI/3;if(this.selected.id==='fisher')this.fisherOffset+=steps*Math.PI/3}
    else if(this.editing>=0&&!this.placing){
      const g=this.buildings.get(this.editing);if(g)this.rotationTargets.set(this.editing,(this.rotationTargets.get(this.editing)??g.rotation.y)+steps*Math.PI/3);
    }
  }
  get placing(){return this.builds.length>0||this.demolitions.length>0}
  editTile(id:number){
    this.editing=id;this.wheelRotation=0;
    this.grid.setHover(id,true,id>=0);this.showStorageRange(id);this.onTileSelect(id);
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
    const i=hit===this.renderer.domElement?this.grid.pick(x,y,this.cameraControl.camera,this.el):-1;
    this.setHover(i);return i;
  }
  private stirSea(event:PointerEvent){
    if(event.buttons||this.selected||event.pointerType==='touch'){this.lastSea=null;return}
    const r=this.renderer.domElement.getBoundingClientRect();
    this.seaRay.setFromCamera(new T.Vector2((event.clientX-r.left)/r.width*2-1,1-(event.clientY-r.top)/r.height*2),this.cameraControl.camera);
    if(!this.seaRay.ray.intersectPlane(this.seaPlane,this.seaPoint)||this.board.has(fromWorld(this.seaPoint.x,this.seaPoint.z))){this.lastSea=null;return}
    const {x,z}=this.seaPoint,now=performance.now()/1000,previous=this.lastSea;
    if(previous&&now-previous.time<.04)return;
    this.lastSea={x,z,time:now};
    if(!previous||now-previous.time>.25)return;
    const dx=x-previous.x,dz=z-previous.z,distance=Math.hypot(dx,dz);
    if(distance<.025||distance>2)return;
    this.environment.stir(x,z,dx/distance,dz/distance,Math.min(1,distance/(now-previous.time)/12),distance);
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
        if(this.selected?.id==='fisher'){const target=this.fishingYaw(i)+this.fisherOffset;this.desiredGhostYaw+=T.MathUtils.euclideanModulo(target-this.desiredGhostYaw+Math.PI,Math.PI*2)-Math.PI}
        this.ghostTarget.copy(cellPosition(i,this.board.has(i)?LAND_Y+.035:LAND_Y+.025));
        if(!wasVisible)this.ghost.position.copy(this.ghostTarget);
        this.ghostPalette.forEach(({mat,base})=>{
          mat.color.copy(base).lerp(new T.Color(valid?0xc5e7ae:0xe98875),valid?.04:.65);
          mat.opacity=valid?1:.45;mat.transparent=!valid;mat.depthWrite=valid;
        });
      }
    }
    if(this.previewLand){this.ghost?.remove(this.previewLand);this.previewLand.geometry.dispose();this.previewLand=null}
    if(this.ghost&&valid&&!this.selected?.event&&!this.board.has(i)){
      const preview=new Map(this.board);preview.set(i,this.selected!.id as Kind);
      this.previewLand=new T.Mesh(terrainGeometry(i,preview),this.previewLandMat);
      this.previewLand.position.y=-LAND_Y-.025/.70;
      this.previewLand.receiveShadow=true;this.ghost.add(this.previewLand);
    }
    if(this.selected?.id==='store')this.showStorageRange(valid?i:-1,true);
    this.onHover(i);
  }
  setSelection(card:Card|null,carrying=false) {
    this.editTile(-1);this.onInspect(-1,0,0,null);
    const same=!!card&&card===this.selected;
    const targetYaw=same?this.desiredGhostYaw:0,currentYaw=same?(this.ghostModel?.rotation.y??targetYaw):0;
    this.cameraControl.setPlacement(carrying);
    if(this.previewLand){this.previewLand.geometry.dispose();this.previewLand=null}
    if(this.ghost){this.scene.remove(this.ghost);this.ghost=null}
    this.ghostPalette.forEach(p=>p.mat.dispose());this.ghostPalette=[];
    this.selected=card;this.fisherOffset=same?this.fisherOffset:0;this.placementQueued=false;this.ghostModel=null;this.desiredGhostYaw=targetYaw;this.wheelRotation=0;
    if(card){
      this.ghost=new T.Group();this.ghostModel=model(card.id);this.ghostModel.rotation.y=currentYaw;this.ghost.add(this.ghostModel);this.ghost.scale.setScalar(.70);
      this.ghost.traverse(o=>{if(o instanceof T.Mesh){
        const mat=(o.material as T.MeshStandardMaterial).clone();
        this.ghostPalette.push({mat,base:mat.color.clone()});mat.transparent=true;mat.opacity=.72;mat.depthWrite=false;
        o.material=mat;o.castShadow=false;o.receiveShadow=false;o.renderOrder=0;
      }});
      this.scene.add(this.ghost);this.ghost.visible=false;
    }
    this.grid.showAvailable(!!card&&!card.event,this.valid);this.setHover(-1,true);
  }
  sync(board:ReadonlyMap<number,Kind>,placed=-1,rotation=0,refresh=false) {
    const opening=this.buildings.size===0;
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
      this.sun.target.position.set(x,0,z);this.sun.position.set(x-5,10,z+4);
      Object.assign(this.sun.shadow.camera,{left:-radius,right:radius,top:radius,bottom:-radius,far:35+radius});
      this.sun.shadow.camera.updateProjectionMatrix();
    }
    board.forEach((kind,i)=>{
      const old=this.buildings.get(i);
      if(!kind){if(old){this.root.remove(old);this.buildings.delete(i)}return}
      if(old)return;
      const g=i===CENTER&&kind==='house'?villageHouse():model(kind);
      const shadow=new T.Mesh(this.contactGeo,this.contact);shadow.position.y=.0025;shadow.renderOrder=1;g.add(shadow);
      g.scale.setScalar(['house','manor','store','lumber','fisher'].includes(kind)?BUILDING_SCALE:['berry','farm'].includes(kind)?.75:1);
      g.position.copy(cellPosition(i));this.root.add(g);this.buildings.set(i,g);
      if(i===placed){g.rotation.y=rotation;g.scale.setScalar(.01);g.visible=false;g.position.y-=.74;this.builds.push({id:i,group:g,time:0,kind})}
    });
    if(placed>=0&&board.get(placed)==='store')this.showStorageRange(placed);
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
    this.setSelection(null);this.cameraControl.reset();this.treeCycles.clear();this.woodHits.clear();this.fields.clear();this.harvestParts.clear();
    this.loaders.forEach(l=>l.el.remove());this.loaders.clear();this.trailPoints=[];this.trailKeys.clear();this.trails.count=0;
    this.root.clear();this.environment.reset();this.buildings.clear();this.builds=[];this.demolitions=[];this.rotationTargets.clear();
    for(const {el} of this.labels)el.remove();this.labels=[];
    for(const {mesh} of this.motes)this.scene.remove(mesh);this.motes=[];
    for(const {mesh} of this.rings){this.scene.remove(mesh);(mesh.material as T.Material).dispose()}this.rings=[];
  }
  private frame=(now:number)=>{
    const dt=Math.min(.065,(now-this.previousTime)/1000);this.previousTime=now;this.time+=dt;
    this.cameraControl.update(dt);this.environment.update(this.time);
    if(this.ghost?.visible){
      this.ghost.position.lerp(this.ghostTarget,1-Math.exp(-32*dt));
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
      if(Math.abs(difference)<.001){g.rotation.y=target;this.rotationTargets.delete(id)}
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
      if(previous<1.42&&b.time>=1.42)this.burst(b.id);
      const growth=easeBetween(b.time,BUILD_START,BUILD_END);
      const bump=Math.sin(Math.PI*growth)*.14;
      const size=['house','manor','store','lumber','fisher'].includes(b.kind)?BUILDING_SCALE:['berry','farm'].includes(b.kind)?.75:1;
      b.group.scale.set(Math.max(.01,(growth+bump)*size),Math.max(.01,(growth+bump*1.6)*size),Math.max(.01,(growth+bump)*size));
      b.group.position.y=LAND_Y-.24*(1-growth);
      if(b.kind==='berry') b.group.children.forEach(child=>{
        if(child.userData.plantOrder!==undefined){
          const t=easeBetween(b.time,BUILD_START+child.userData.plantOrder*.018,BUILD_END);
          child.scale.setScalar(Math.max(.01,t));
        }
      });
      if(b.time>=BUILD_END)this.villagers.refreshNavigation();
      return b.time<BUILD_END;
    });
    this.villagers.update(document.hidden?0:dt);
    for(const [tree,left] of this.woodHits){const remaining=left-dt;tree.rotation.x=Math.sin(remaining*45)*.035*Math.max(0,remaining/.2);if(remaining<=0){tree.rotation.x=0;this.woodHits.delete(tree)}else this.woodHits.set(tree,remaining)}
    for(const [key,cycle] of this.treeCycles){
      if(!this.board.has(cycle.id)){this.updateLoader(key,99);this.treeCycles.delete(key);continue}
      cycle.age+=dt;this.updateLoader(key,cycle.age);
      if(cycle.age<.6){cycle.tree.rotation.z=easeBetween(cycle.age,0,.6)*1.5;cycle.tree.scale.copy(cycle.scale).multiplyScalar(1-.12*cycle.age/.6)}
      else if(cycle.age<11){cycle.tree.visible=false}
      else{cycle.tree.visible=true;cycle.tree.rotation.z=0;cycle.tree.scale.copy(cycle.scale).multiplyScalar(Math.max(.01,easeBetween(cycle.age,11,14)))}
      if(cycle.age>=14){cycle.tree.scale.copy(cycle.scale);this.treeCycles.delete(key)}
    }
    for(const [id,field] of this.fields){
      if(!this.board.has(id)){this.updateLoader(`field:${id}`,99);this.fields.delete(id);continue}
      const kind=this.board.get(id),duration=kind==='berry'?12:18;
      if(field.stock===0){field.age+=dt;this.updateLoader(`field:${id}`,field.age);if(field.age>=duration){field.stock=field.max;field.age=0}}
      const partial=[...this.harvestParts.values()].filter(p=>p.id===id).reduce((n,p)=>n+p.progress,0);
      const available=field.stock===0?easeBetween(field.age,duration-4,duration):Math.max(0,(field.stock-partial)/field.max);
      const plants=this.buildings.get(id)?.children.filter(p=>p.userData.plantOrder!==undefined||p.userData.cropOrder!==undefined)??[];
      plants.forEach((plant,index)=>{const fraction=T.MathUtils.clamp(available*plants.length-index,0,1);
        if(kind==='farm')plant.scale.y=.08+.92*fraction;
        else plant.children.slice(1).forEach(fruit=>fruit.scale.setScalar(Math.max(.01,fraction)));
      });
    }
    this.motes=this.motes.filter(m=>{
      m.life-=dt*1.65;m.velocity.y-=dt*2.7;m.mesh.position.addScaledVector(m.velocity,dt);
      m.mesh.scale.setScalar(Math.max(0,m.life));if(m.life<=0)this.scene.remove(m.mesh);return m.life>0;
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
      const group=model(card.id);part(group,new T.CylinderGeometry(.72,.75,.068,6),0x9db77c,0,-.034,0);scene.add(group);
      renderer.render(scene,camera);images[card.id]=renderer.domElement.toDataURL();scene.remove(group);
    }
    renderer.dispose();renderer.forceContextLoss();return images;
  }
}





