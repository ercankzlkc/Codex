import * as T from 'three';
import {gameSpeed} from './game-speed';
import {climate,seasonalSurface} from './climate';
import {coast,fromWorld,position,type ShoreEdge} from './hex';
import {LAND_Y,SEA_Y} from './scenery';
import type {Kind} from './game';

const seasons=[
  {name:'İlkbahar',symbol:'✿',color:'#8bce91',tint:'#d4efbd',hint:'Doğa uyanıyor'},
  {name:'Yaz',symbol:'☀',color:'#efc45e',tint:'#e9dc92',hint:'Uzun ve sıcak günler'},
  {name:'Sonbahar',symbol:'❧',color:'#df9764',tint:'#d88d45',hint:'Kış hazırlığı zamanı'},
  {name:'Kış',symbol:'❄',color:'#a3d8ee',tint:'#edf6fb',hint:'Kar ve donmuş kıyılar'},
] as const;
const mix=(a:number,b:number,t:number)=>a+(b-a)*t;
const DAY_SECONDS=200, DAYS_PER_SEASON=3;
const SEASON_SECONDS=DAY_SECONDS*DAYS_PER_SEASON, YEAR_SECONDS=SEASON_SECONDS*4;
/** Three days per season; each day represents a month. */
export class SeasonCycle{
  private elapsed=0;private lastSeason=-1;private lastPhase='';private scanClock=0;private hudClock=0;
  private sky=new T.Color('#93bfcb');private sunlight=new T.Color('#fff2da');
  private materials=new Map<T.MeshStandardMaterial,{base:T.Color;foliage:boolean;ground:boolean;window:boolean}>();
  private paths=new Set<T.MeshBasicMaterial>();
  private tint=new T.Color();private nightColor=new T.Color('#172c50');
  private hud:HTMLElement;private notice:HTMLElement;
  private snow:T.Points;private snowPositions:Float32Array;
  private ice=new T.Group();private iceMat=new T.MeshStandardMaterial({color:0xc9ecf4,transparent:true,opacity:0,roughness:.3,depthWrite:false});
  private iceGeo=new T.BoxGeometry(1,.025,.34);private shoreKey='';private shore:ShoreEdge[]=[];
  private iceChips:{mesh:T.Mesh<T.TetrahedronGeometry,T.MeshStandardMaterial>;velocity:T.Vector3;spin:T.Vector3;age:number;life:number}[]=[];
  private chipGeo=new T.TetrahedronGeometry(1);
  breakIce(id:number){
    const strength=climate.winter.value;if(strength<.08)return false;
    const center=position(id);
    for(const floe of this.ice.children)if(Math.hypot(floe.position.x-center.x,floe.position.z-center.z)<1.4)floe.visible=false;
    // Break the frozen surface inside the new hex, including open water away from shore floes.
    for(let i=0;i<48&&this.iceChips.length<180;i++){
      const angle=i/48*Math.PI*2+Math.random()*.12,r=Math.sqrt(Math.random())*.95;
      const mesh=new T.Mesh(this.chipGeo,new T.MeshStandardMaterial({color:0xd6edf5,roughness:.32,transparent:true,opacity:strength,depthWrite:false,flatShading:true}));
      mesh.userData.iceChip=true;
      mesh.position.set(center.x+Math.cos(angle)*r,SEA_Y+.035,center.z+Math.sin(angle)*r);
      mesh.scale.set(.13+Math.random()*.14,.025+Math.random()*.035,.12+Math.random()*.13);
      mesh.rotation.set(0,angle,0);this.scene.add(mesh);
      this.iceChips.push({mesh,velocity:new T.Vector3(Math.cos(angle)*(.4+Math.random()*.45),.22+Math.random()*.4,Math.sin(angle)*(.4+Math.random()*.45)),spin:new T.Vector3(Math.random()*2,Math.random(),Math.random()*2),age:0,life:.65+Math.random()*.35});
    }
    return true;
  }
  private clearIceChips(){for(const chip of this.iceChips){this.scene.remove(chip.mesh);chip.mesh.material.dispose()}this.iceChips=[]}
  constructor(private scene:T.Scene,private sun:T.DirectionalLight,private ambient:T.HemisphereLight){
    this.hud=document.createElement('section');this.hud.id='season-hud';this.hud.setAttribute('aria-label','Gün ve mevsim');
    this.hud.innerHTML='<div class="season-clock"><span class="clock-orbit">☀</span><span class="clock-center">✿</span></div><div class="season-copy"><small></small><strong></strong><span></span><div class="season-days"><i></i><i></i><i></i></div></div><div class="season-remaining"><b></b><div class="speed-controls" role="group" aria-label="Oyun hızı"><button type="button" data-speed="1" aria-label="Normal hız" aria-pressed="true">1×</button><button type="button" data-speed="2" aria-label="İki kat hız" aria-pressed="false">2×</button><button type="button" data-speed="3" aria-label="Üç kat hız" aria-pressed="false">3×</button><button type="button" data-speed="4" aria-label="Dört kat hız" aria-pressed="false">4×</button></div></div>';
    document.querySelector('#app')!.append(this.hud);
    this.hud.querySelectorAll<HTMLButtonElement>('[data-speed]').forEach(button=>{
      button.onclick=()=>{
        gameSpeed.value=Number(button.dataset.speed);
        this.hud.querySelectorAll('[data-speed]').forEach(option=>option.setAttribute('aria-pressed',String(option===button)));
      };
    });
    this.notice=document.createElement('aside');this.notice.id='season-notice';this.notice.setAttribute('role','status');document.querySelector('#app')!.append(this.notice);
    this.snowPositions=new Float32Array(240*3);
    for(let i=0;i<240;i++){this.snowPositions[i*3]=(Math.random()-.5)*18;this.snowPositions[i*3+1]=Math.random()*7;this.snowPositions[i*3+2]=(Math.random()-.5)*18}
    const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.BufferAttribute(this.snowPositions,3));
    this.snow=new T.Points(geometry,new T.PointsMaterial({color:0xf0f7ff,size:.025,transparent:true,opacity:0,depthWrite:false}));
    this.snow.frustumCulled=false;scene.add(this.snow,this.ice);
  }
  setPalette(sky:string,sun:string){this.sky.set(sky);this.sunlight.set(sun)}
  reset(){gameSpeed.value=1;this.hud.querySelectorAll('[data-speed]').forEach(button=>button.setAttribute('aria-pressed',String((button as HTMLElement).dataset.speed==='1')));this.clearIceChips();for(const path of this.paths)path.color.set(0xccbc95);this.paths.clear();climate.night.value=0;climate.winter.value=0;climate.autumn.value=0;climate.summer.value=0;for(const [material,state] of this.materials){material.color.copy(state.base);if(state.window)material.emissiveIntensity=0}this.materials.clear();this.elapsed=0;this.lastSeason=-1;this.scanClock=0;this.lastPhase='';this.shoreKey='';this.ice.clear()}
  private scan(){
    this.scene.traverse(object=>{
      if(!(object instanceof T.Mesh)||object.userData.iceChip)return;
      for(const material of Array.isArray(object.material)?object.material:[object.material]){
        if(material instanceof T.MeshBasicMaterial&&material.color.getHex()===0xccbc95)this.paths.add(material);
        if(material instanceof T.MeshStandardMaterial||material instanceof T.MeshLambertMaterial)seasonalSurface(material);
        if(!(material instanceof T.MeshStandardMaterial)||this.materials.has(material)||material===this.iceMat)continue;
        const base=material.color.clone(),hsl={h:0,s:0,l:0};base.getHSL(hsl);
        this.materials.set(material,{base,foliage:hsl.h>.16&&hsl.h<.43&&hsl.s>.12,ground:material.vertexColors,window:base.getHex()===0x84b4b7});
      }
    });
  }
  update(dt:number,board:ReadonlyMap<number,Kind>,focus:T.Vector3){
    dt=Number.isFinite(dt)?Math.max(0,Math.min(.26,dt)):0;
    if(!Number.isFinite(this.elapsed)||this.elapsed<0)this.elapsed=0;
    this.iceChips=this.iceChips.filter(chip=>{
      chip.age+=dt;const t=chip.age/chip.life;
      if(t>=1){this.scene.remove(chip.mesh);chip.mesh.material.dispose();return false}
      chip.velocity.y-=dt*1.7;chip.mesh.position.addScaledVector(chip.velocity,dt);
      // Let fragments sink beneath the sea before the land finishes rising.
      chip.mesh.rotation.x+=chip.spin.x*dt;chip.mesh.rotation.y+=chip.spin.y*dt;chip.mesh.rotation.z+=chip.spin.z*dt;
      chip.mesh.material.opacity=climate.winter.value*(1-T.MathUtils.smoothstep(t,.65,1));
      return true;
    });
    this.elapsed+=dt;this.scanClock-=dt;if(this.scanClock<=0){this.scanClock=.5;this.scan()}
    const season=Math.floor(this.elapsed/SEASON_SECONDS)%4,part=this.elapsed%SEASON_SECONDS;
    const day=Math.floor(part/DAY_SECONDS),cycle=(part%DAY_SECONDS)/DAY_SECONDS;
    const progress=part/SEASON_SECONDS,current=seasons[season];
    // Interpolate between seasonal midpoints: boundaries share the same palette.
    const from=progress<.5?(season+3)%4:season,to=progress<.5?season:(season+1)%4;
    const blend=T.MathUtils.smoothstep(progress<.5?progress+.5:progress-.5,0,1);
    const weights=[0,0,0,0];weights[from]=1-blend;weights[to]=blend;
    if(this.elapsed<SEASON_SECONDS*.5){weights[3]=0;weights[0]=1;}
    this.tint.set(seasons[from].tint).lerp(new T.Color(seasons[to].tint),blend);
    if(this.elapsed<SEASON_SECONDS*.5)this.tint.set(seasons[0].tint);
    const winter=weights[3],autumn=weights[2],summer=weights[1];
    // Dawn at the beginning of each day; warmer edges, a readable blue moonlit night.
    const elevation=Math.sin(cycle*Math.PI*2),daylight=T.MathUtils.smoothstep(elevation,-.18,.4),night=1-daylight;
    this.sun.intensity=mix(.16,2.5,daylight);
    this.sun.color.copy(this.sunlight).lerp(new T.Color('#ffc18b'),(1-Math.abs(elevation))*.55*daylight).lerp(new T.Color('#9bbcff'),night);
    this.sun.position.copy(this.sun.target.position).add(new T.Vector3(-6,3+Math.abs(elevation)*8,-4));
    this.ambient.intensity=mix(.32,1,daylight);this.ambient.color.set('#ddeaf1').lerp(new T.Color('#91acd9'),night);
    (this.scene.background as T.Color).copy(this.sky).lerp(new T.Color('#b7d4e4'),winter*.35).lerp(new T.Color('#d6bd9d'),autumn*.16).lerp(new T.Color('#74c4dc'),summer*.16).lerp(this.nightColor,night*.88);
    for(const path of this.paths){
      path.color.set(0xccbc95).lerp(new T.Color('#765a42'),winter*.8).multiplyScalar(mix(1,.11,night));
      path.opacity=mix(.28,.12,night);
    }
    climate.night.value=night;climate.winter.value=winter;
    climate.autumn.value=autumn;climate.summer.value=summer;
    for(const [material,state] of this.materials){
      material.color.copy(state.base);
      // Surface shaders colour grass and lay snow over vertex colours and roof textures.
      if(state.foliage)material.color.lerp(this.tint,.08+autumn*.27);
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
    this.hudClock-=dt;
    if(this.hudClock>0&&season===this.lastSeason)return;
    this.hudClock=.1;
    const phase=cycle<.08?'Şafak':cycle<.42?'Gündüz':cycle<.55?'Gün batımı':'Gece';
    this.hud.style.setProperty('--season-color',current.color);this.hud.style.setProperty('--day-progress',String(cycle));
    this.hud.querySelector('.clock-orbit')!.textContent=night>.5?'☾':'☀';
    (this.hud.querySelector('.clock-orbit') as HTMLElement).style.transform=`rotate(${cycle*360}deg) translateY(-14px) rotate(${-cycle*360}deg)`;
    this.hud.querySelector('.clock-center')!.textContent=current.symbol;
    this.hud.querySelector('.season-copy small')!.textContent=`YIL ${Math.floor(this.elapsed/YEAR_SECONDS)+1} · GÜN ${Math.floor(this.elapsed/DAY_SECONDS)+1}`;
    this.hud.querySelector('.season-copy strong')!.textContent=current.name;
    this.hud.querySelector('.season-copy>span')!.textContent=`${day+1}. gün / 3 · ${day+1}. ay`;
    // The daylight curve begins at dawn, so 06:00 is the start of each game day.
    const minutes=Math.floor((cycle*1440+360)%1440);
    this.hud.querySelector('.season-remaining b')!.textContent=`${String(Math.floor(minutes/60)).padStart(2,'0')}:${String(minutes%60).padStart(2,'0')}`;
    this.hud.querySelectorAll<HTMLElement>('.season-days i').forEach((dot,i)=>{dot.classList.toggle('complete',i<day);dot.style.setProperty('--fill',`${i<day?100:i===day?cycle*100:0}%`)});
    if(season!==this.lastSeason){
      this.lastSeason=season;this.notice.innerHTML=`<span>${current.symbol}</span><small>${Math.floor(this.elapsed/YEAR_SECONDS)+1}. YIL</small><strong>${current.name}</strong><p>${current.hint}</p>`;
      this.notice.getAnimations().forEach(a=>a.cancel());this.notice.animate([{opacity:0,transform:'translate(-50%,-12px)'},{opacity:1,transform:'translate(-50%,0)',offset:.12},{opacity:1,transform:'translate(-50%,0)',offset:.72},{opacity:0,transform:'translate(-50%,8px)'}],{duration:2600,fill:'both'});
      this.hud.animate([{transform:'translateY(-5px)',opacity:.5},{transform:'translateY(0)',opacity:1}],{duration:500});
    }
    if(phase!==this.lastPhase){this.lastPhase=phase;this.hud.querySelector('.clock-center')!.animate([{opacity:.3},{opacity:1}],{duration:450})}
  }
}
