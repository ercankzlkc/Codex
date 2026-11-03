import * as T from 'three';
import { CameraController } from './camera';
import { Environment, LAND_Y, SEA_Y } from './environment';
import {CENTER, position, fromWorld} from './hex';
import {terrainGeometry} from './scenery';
import {BUILD_START,BUILD_END,easeBetween} from './emergence';
import { PlacementGrid, cellPosition } from './grid';
import { model, part, box } from './models';
import { cards, type Card, type Kind, type Production } from './game';

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
  private root=new T.Group();
  private buildings=new Map<number,T.Group>();
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

    this.grid=new PlacementGrid(this.scene);
    const resize=()=>{const {clientWidth:w,clientHeight:h}=el;this.renderer.setSize(w,h);this.cameraControl.resize(w,h)};
    new ResizeObserver(resize).observe(el);resize();
    const canvas=this.renderer.domElement;
    canvas.addEventListener('pointermove',e=>{if(this.selected&&!e.buttons)this.point(e.clientX,e.clientY)});
    canvas.addEventListener('pointerleave',()=>{this.setHover(-1);this.lastSea=null});
    canvas.addEventListener('pointermove',e=>this.stirSea(e));
    canvas.addEventListener('click',e=>{if(e.button===0&&this.selected){const i=this.point(e.clientX,e.clientY);if(i>=0)this.onPick(i)}});
    window.addEventListener('wheel',event=>{
      if(!this.selected||this.selected.event||document.querySelector('dialog[open]'))return;
      event.preventDefault();event.stopImmediatePropagation();
      const delta=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?300:1);
      this.wheelRotation=T.MathUtils.clamp(this.wheelRotation+delta,-240,240);
      const steps=Math.trunc(this.wheelRotation/60);
      if(steps){this.wheelRotation-=steps*60;this.rotateSelection(steps)}
    },{capture:true,passive:false});
    window.addEventListener('keydown',event=>{
      if(event.key.toLowerCase()!=='r'||event.repeat||event.ctrlKey||event.metaKey||event.altKey||document.querySelector('dialog[open]'))return;
      if(event.target instanceof Element&&event.target.closest('input,textarea,select,[contenteditable]'))return;
      if(this.selected&&!this.selected.event){event.preventDefault();this.rotateSelection(event.shiftKey?-1:1)}
    });
    this.renderer.setAnimationLoop(this.frame);
  }

  holdSelection(){this.placementQueued=true;this.cameraControl.setPlacement(false)}
  get placementRotation(){return this.desiredGhostYaw}
  rotateSelection(steps:number){
    if(this.selected&&!this.selected.event)this.desiredGhostYaw+=steps*Math.PI/3;
  }
  get placing(){return this.builds.length>0}

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
    if(!force&&i===this.hover)return;
    this.hover=i;
    const valid=i>=0&&this.valid(i);
    this.grid.setHover(i,valid,!!this.selected);
    if(this.ghost){
      const wasVisible=this.ghost.visible;
      this.ghost.visible=i>=0;
      if(i>=0){
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
    this.onHover(i);
  }
  setSelection(card:Card|null,carrying=false) {
    const same=!!card&&card===this.selected;
    const targetYaw=same?this.desiredGhostYaw:0,currentYaw=same?(this.ghostModel?.rotation.y??targetYaw):0;
    this.cameraControl.setPlacement(carrying);
    if(this.previewLand){this.previewLand.geometry.dispose();this.previewLand=null}
    if(this.ghost){this.scene.remove(this.ghost);this.ghost=null}
    this.ghostPalette.forEach(p=>p.mat.dispose());this.ghostPalette=[];
    this.selected=card;this.placementQueued=false;this.ghostModel=null;this.desiredGhostYaw=targetYaw;this.wheelRotation=0;
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
  sync(board:ReadonlyMap<number,Kind>,placed=-1,rotation=0) {
    const opening=this.buildings.size===0;
    this.board=board;
    if(opening||placed>=0){
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
      g.position.copy(cellPosition(i));this.root.add(g);this.buildings.set(i,g);
      if(i===placed){g.rotation.y=rotation;g.scale.setScalar(.01);g.visible=false;g.position.y-=.74;this.builds.push({id:i,group:g,time:0,kind})}
    });
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
    this.setSelection(null);this.cameraControl.reset();
    this.root.clear();this.environment.reset();this.buildings.clear();this.builds=[];
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
    this.builds=this.builds.filter(b=>{
      const previous=b.time;
      b.time=Math.min(BUILD_END,b.time+dt);
      b.group.visible=b.time>=BUILD_START;
      if(b.time<BUILD_START)return true;
      if(previous<1.42&&b.time>=1.42)this.burst(b.id);
      const growth=easeBetween(b.time,BUILD_START,BUILD_END);
      const bump=Math.sin(Math.PI*growth)*.14;
      b.group.scale.set(Math.max(.01,growth+bump),Math.max(.01,growth+bump*1.6),Math.max(.01,growth+bump));
      b.group.position.y=LAND_Y-.24*(1-growth);
      if(b.kind==='berry') b.group.children.forEach(child=>{
        if(child.userData.plantOrder!==undefined){
          const t=easeBetween(b.time,BUILD_START+child.userData.plantOrder*.018,BUILD_END);
          child.scale.setScalar(Math.max(.01,t));
        }
      });
      return b.time<BUILD_END;
    });
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





