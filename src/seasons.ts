import * as T from 'three';
import {coast,fromWorld,type ShoreEdge} from './hex';
import {LAND_Y,SEA_Y} from './scenery';
import type {Kind} from './game';

const seasons=[
  {name:'İlkbahar',symbol:'✿',color:'#8bce91',tint:'#d4efbd',hint:'Doğa uyanıyor'},
  {name:'Yaz',symbol:'☀',color:'#efc45e',tint:'#e9dc92',hint:'Uzun ve sıcak günler'},
  {name:'Sonbahar',symbol:'❧',color:'#df9764',tint:'#d88d45',hint:'Kış hazırlığı zamanı'},
  {name:'Kış',symbol:'❄',color:'#a3d8ee',tint:'#edf6fb',hint:'Kar ve donmuş kıyılar'},
] as const;
const mix=(a:number,b:number,t:number)=>a+(b-a)*t;
/** Accelerated visual preview: three ten-second days per thirty-second season. */
export class SeasonCycle{
  private elapsed=0;private lastSeason=-1;private lastPhase='';private scanClock=0;
  private sky=new T.Color('#93bfcb');private sunlight=new T.Color('#fff2da');
  private materials=new Map<T.MeshStandardMaterial,{base:T.Color;foliage:boolean;ground:boolean;window:boolean}>();
  private tint=new T.Color();private nightColor=new T.Color('#172c50');
  private hud:HTMLElement;private notice:HTMLElement;
  private snow:T.Points;private snowPositions:Float32Array;
  private ice=new T.Group();private iceMat=new T.MeshStandardMaterial({color:0xc9ecf4,transparent:true,opacity:0,roughness:.3,depthWrite:false});
  private iceGeo=new T.BoxGeometry(1,.025,.34);private shoreKey='';private shore:ShoreEdge[]=[];
  constructor(private scene:T.Scene,private sun:T.DirectionalLight,private ambient:T.HemisphereLight){
    this.hud=document.createElement('section');this.hud.id='season-hud';this.hud.setAttribute('aria-label','Gün ve mevsim');
    this.hud.innerHTML='<div class="season-clock"><span class="clock-orbit">☀</span><span class="clock-center">✿</span></div><div class="season-copy"><small></small><strong></strong><span></span><div class="season-days"><i></i><i></i><i></i></div></div><div class="season-remaining"><b></b><small>sonraki mevsim</small></div>';
    document.querySelector('#app')!.append(this.hud);
    this.notice=document.createElement('aside');this.notice.id='season-notice';this.notice.setAttribute('role','status');document.querySelector('#app')!.append(this.notice);
    this.snowPositions=new Float32Array(240*3);
    for(let i=0;i<240;i++){this.snowPositions[i*3]=(Math.random()-.5)*18;this.snowPositions[i*3+1]=Math.random()*7;this.snowPositions[i*3+2]=(Math.random()-.5)*18}
    const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.BufferAttribute(this.snowPositions,3));
    this.snow=new T.Points(geometry,new T.PointsMaterial({color:0xf0f7ff,size:.025,transparent:true,opacity:0,depthWrite:false}));
    this.snow.frustumCulled=false;scene.add(this.snow,this.ice);
  }
  setPalette(sky:string,sun:string){this.sky.set(sky);this.sunlight.set(sun)}
  reset(){for(const [material,state] of this.materials){material.color.copy(state.base);if(state.window)material.emissiveIntensity=0}this.materials.clear();this.elapsed=0;this.lastSeason=-1;this.scanClock=0;this.lastPhase='';this.shoreKey='';this.ice.clear()}
  private scan(){
    this.scene.traverse(object=>{
      if(!(object instanceof T.Mesh))return;
      for(const material of Array.isArray(object.material)?object.material:[object.material]){
        if(!(material instanceof T.MeshStandardMaterial)||this.materials.has(material)||material===this.iceMat)continue;
        const base=material.color.clone(),hsl={h:0,s:0,l:0};base.getHSL(hsl);
        this.materials.set(material,{base,foliage:hsl.h>.16&&hsl.h<.43&&hsl.s>.12,ground:material.vertexColors,window:base.getHex()===0x84b4b7});
      }
    });
  }
  update(dt:number,board:ReadonlyMap<number,Kind>,focus:T.Vector3){
    dt=Number.isFinite(dt)?Math.max(0,Math.min(.1,dt)):0;
    if(!Number.isFinite(this.elapsed)||this.elapsed<0)this.elapsed=0;
    this.elapsed+=dt;this.scanClock-=dt;if(this.scanClock<=0){this.scanClock=.5;this.scan()}
    const season=Math.floor(this.elapsed/30)%4,part=this.elapsed%30,day=Math.floor(part/10),cycle=(this.elapsed%10)/10;
    const blend=T.MathUtils.smoothstep(part,0,2.5),previous=seasons[(season+3)%4],current=seasons[season];
    this.tint.set(previous.tint).lerp(new T.Color(current.tint),this.elapsed<2.5&&season===0?1:blend);
    const winter=season===3?blend:season===0&&this.elapsed>=120?1-blend:0;
    // Dawn at the beginning of each day; warmer edges, a readable blue moonlit night.
    const elevation=Math.sin(cycle*Math.PI*2),daylight=T.MathUtils.smoothstep(elevation,-.18,.4),night=1-daylight;
    this.sun.intensity=mix(.16,2.5,daylight);
    this.sun.color.copy(this.sunlight).lerp(new T.Color('#ffc18b'),(1-Math.abs(elevation))*.55*daylight).lerp(new T.Color('#9bbcff'),night);
    this.sun.position.copy(this.sun.target.position).add(new T.Vector3(-6,3+Math.abs(elevation)*8,-4));
    this.ambient.intensity=mix(.32,1,daylight);this.ambient.color.set(night>.5?'#91acd9':'#ddeaf1');
    (this.scene.background as T.Color).copy(this.sky).lerp(this.nightColor,night*.88);
    for(const [material,state] of this.materials){
      material.color.copy(state.base);
      if(state.ground)material.color.lerp(this.tint,winter>.01?mix(.24,.85,winter):.24);
      else if(state.foliage)material.color.lerp(this.tint,season===2?.72:mix(.12,.9,winter));
      if(state.window){material.emissive.set('#ffbd62');material.emissiveIntensity=night*1.8;material.color.copy(state.base).lerp(new T.Color('#ffd48a'),night)}
    }
    const key=[...board.keys()].join(',');
    if(key!==this.shoreKey){
      this.shoreKey=key;this.shore=coast(board);this.ice.clear();
      for(const edge of this.shore){
        const dx=edge.bx-edge.ax,dz=edge.bz-edge.az,len=Math.hypot(dx,dz),x=(edge.ax+edge.bx)/2,z=(edge.az+edge.bz)/2;
        const sign=board.has(fromWorld(x-dz/len*.2,z+dx/len*.2))?-1:1;
        const floe=new T.Mesh(this.iceGeo,this.iceMat);floe.position.set(x-dz/len*.3*sign,SEA_Y+.025,z+dx/len*.3*sign);floe.rotation.y=-Math.atan2(dz,dx);floe.scale.x=len*.9;this.ice.add(floe);
      }
    }
    this.ice.visible=winter>.01;this.iceMat.opacity=winter*.75;
    this.snow.visible=winter>.01;(this.snow.material as T.PointsMaterial).opacity=winter*.7;
    this.snow.position.set(focus.x,0,focus.z);
    for(let i=0;i<240;i++){this.snowPositions[i*3]+=dt*.11;this.snowPositions[i*3+1]-=dt*(.4+(i%5)*.06);if(this.snowPositions[i*3+1]<0)this.snowPositions[i*3+1]=7;if(this.snowPositions[i*3]>9)this.snowPositions[i*3]=-9}
    this.snow.geometry.getAttribute('position').needsUpdate=true;
    const phase=cycle<.08?'Şafak':cycle<.42?'Gündüz':cycle<.55?'Gün batımı':'Gece';
    this.hud.style.setProperty('--season-color',current.color);this.hud.style.setProperty('--day-progress',String(cycle));
    this.hud.querySelector('.clock-orbit')!.textContent=night>.5?'☾':'☀';
    (this.hud.querySelector('.clock-orbit') as HTMLElement).style.transform=`rotate(${cycle*360}deg) translateY(-22px) rotate(${-cycle*360}deg)`;
    this.hud.querySelector('.clock-center')!.textContent=current.symbol;
    this.hud.querySelector('.season-copy small')!.textContent=`YIL ${Math.floor(this.elapsed/120)+1} · GÜN ${Math.floor(this.elapsed/10)+1}`;
    this.hud.querySelector('.season-copy strong')!.textContent=current.name;
    this.hud.querySelector('.season-copy>span')!.textContent=`${day+1}. gün / 3 · ${phase}`;
    this.hud.querySelector('.season-remaining b')!.textContent=`${Math.ceil(30-part)} sn`;
    this.hud.querySelectorAll<HTMLElement>('.season-days i').forEach((dot,i)=>{dot.classList.toggle('complete',i<day);dot.style.setProperty('--fill',`${i<day?100:i===day?cycle*100:0}%`)});
    if(season!==this.lastSeason){
      this.lastSeason=season;this.notice.innerHTML=`<span>${current.symbol}</span><small>${Math.floor(this.elapsed/120)+1}. YIL</small><strong>${current.name}</strong><p>${current.hint}</p>`;
      this.notice.getAnimations().forEach(a=>a.cancel());this.notice.animate([{opacity:0,transform:'translate(-50%,-12px)'},{opacity:1,transform:'translate(-50%,0)',offset:.12},{opacity:1,transform:'translate(-50%,0)',offset:.72},{opacity:0,transform:'translate(-50%,8px)'}],{duration:2600,fill:'both'});
      this.hud.animate([{transform:'translateY(-5px)',opacity:.5},{transform:'translateY(0)',opacity:1}],{duration:500});
    }
    if(phase!==this.lastPhase){this.lastPhase=phase;this.hud.querySelector('.clock-center')!.animate([{opacity:.3},{opacity:1}],{duration:450})}
  }
}
