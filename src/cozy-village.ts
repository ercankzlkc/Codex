import {resourceArt} from './resource-art';
import {icon} from './icons';
import {residentIcon} from './resident-card';
import {cozyFlowerGeometry} from './models';
import {discoveryModel} from './discovery-model';
import {chestLootName,rollChestLoot,type ChestLoot} from './chest-loot';
import * as T from 'three';
import {Game,cards} from './game';
import {position,fromWorld,RADIUS} from './hex';
import {LAND_Y,SEA_Y} from './scenery';
import {climate} from './climate';
import {residentName,wishes} from './village-personality';

const CHEST_SINK_SECONDS=8,CHEST_SINK_DEPTH=6;

/** Small, bounded ambient details and optional village stories. */
export class CozyVillage{
  private game:Game|null=null;
  private root=new T.Group();private blooms=new T.Group();
  private flowerMat=new T.MeshLambertMaterial({color:0xffffff,vertexColors:true,transparent:true,depthWrite:false});
  private leafMat=new T.PointsMaterial({color:0xd79750,size:.045,transparent:true,depthWrite:false});
  private fireMat=new T.PointsMaterial({color:0xe5dc94,size:.025,transparent:true,depthWrite:false});
  private leafPositions=new Float32Array(64*3);private firePositions=new Float32Array(32*3);
  private leaves:T.Points;private fireflies:T.Points;
  private panel:HTMLElement;private toggle:HTMLButtonElement;private collect:HTMLButtonElement;
  private completed=new Set<number>();private journal:{message:string;good:ChestLoot['good'];amount:number}[]=[];private signature='';private clock=0;private floatClock=0;private nextDiscovery=35;
  private opening=-1;private prizeTime=0;private sinkTime=-1;
  private loot:ChestLoot|null=null;private pendingLoot=false;private lootRequested=false;private generation=0;
  private floatY=0;private floatVelocity=0;private pitch=0;private roll=0;private pitchVelocity=0;private rollVelocity=0;
  private discovery:T.Group|null=null;private activeTab:'residents'|'discoveries'='residents';
  constructor(private scene:T.Scene,private sampleSea:(x:number,z:number)=>{height:number;dx:number;dz:number},private onLoot:(loot:ChestLoot,at:T.Vector3)=>Promise<number>){
    this.root.add(this.blooms);scene.add(this.root);
    const leafGeo=new T.BufferGeometry();leafGeo.setAttribute('position',new T.BufferAttribute(this.leafPositions,3));
    const fireGeo=new T.BufferGeometry();fireGeo.setAttribute('position',new T.BufferAttribute(this.firePositions,3));
    this.leaves=new T.Points(leafGeo,this.leafMat);this.fireflies=new T.Points(fireGeo,this.fireMat);this.root.add(this.leaves,this.fireflies);
    this.panel=document.createElement('section');this.panel.id='village-journal';this.panel.hidden=true;this.panel.setAttribute('aria-label','Köy defteri');
    this.toggle=document.createElement('button');this.toggle.id='village-journal-toggle';this.toggle.innerHTML=icon('journal');this.toggle.setAttribute('aria-label','Köy Defteri');this.toggle.setAttribute('aria-controls','village-journal');this.toggle.setAttribute('aria-expanded','false');
    this.collect=document.createElement('button');this.collect.className='discovery-pick';this.collect.hidden=true;
    document.querySelector('#app')!.append(this.panel,this.collect);document.querySelector('.tools')!.prepend(this.toggle);
    this.toggle.onclick=()=>{this.panel.hidden=!this.panel.hidden;this.toggle.setAttribute('aria-expanded',String(!this.panel.hidden));this.render()};
    this.collect.onclick=()=>this.claimDiscovery();
    window.addEventListener('resident-portrait',()=>{if(!this.panel.hidden)this.render()});
    this.panel.addEventListener('click',event=>{
      const tab=(event.target as Element).closest<HTMLButtonElement>('[data-journal-tab]');
      if(tab){this.activeTab=tab.dataset.journalTab as 'residents'|'discoveries';this.render()}
      if((event.target as Element).closest('[data-journal-close]')){this.panel.hidden=true;this.toggle.setAttribute('aria-expanded','false')}
    });
  }
  bind(game:Game){this.reset();this.game=game;this.render()}
  reset(){this.game=null;this.completed.clear();this.journal=[];this.signature='';this.clock=0;this.floatClock=0;this.nextDiscovery=15;this.opening=-1;this.prizeTime=0;this.sinkTime=-1;this.panel.hidden=true;this.toggle.setAttribute('aria-expanded','false');this.collect.hidden=true;this.clearBlooms();this.removeDiscovery();this.floatVelocity=this.pitchVelocity=this.rollVelocity=this.pitch=this.roll=0}
  private clearBlooms(){for(const child of this.blooms.children){if(child instanceof T.Mesh)child.geometry.dispose()}this.blooms.clear()}
  private removeDiscovery(){
    this.generation++;this.loot=null;this.pendingLoot=false;this.lootRequested=false;
    if(this.discovery){
      const geometries=new Set<T.BufferGeometry>(),materials=new Set<T.Material>();
      this.root.remove(this.discovery);this.discovery.traverse(o=>{if(o instanceof T.Mesh){geometries.add(o.geometry);for(const material of Array.isArray(o.material)?o.material:[o.material])materials.add(material)}});
      geometries.forEach(geometry=>geometry.dispose());materials.forEach(material=>material.dispose());this.discovery=null;
    }
  }
  private render(){
    const game=this.game;if(!game)return;
    const residents=this.activeTab==='residents';
    this.panel.innerHTML=`<header><div><small>KIYIMIZIN HİKÂYELERİ</small><h2>Köy Defteri</h2></div><button data-journal-close aria-label="Kapat">×</button></header>
      <div class="journal-summary"><span>♧ <b>${game.people}</b> komşu</span><span>♥ <b>${this.completed.size}</b> mutlu dilek</span></div>
      <nav class="journal-tabs" aria-label="Defter bölümleri"><button data-journal-tab="residents" aria-pressed="${residents}">Komşularımız</button><button data-journal-tab="discoveries" aria-pressed="${!residents}">Kıyı keşifleri${this.journal.length?` · ${this.journal.length}`:''}</button></nav>
      ${residents?`<p class="journal-intro">Komşularını tanı, küçük dileklerine kulak ver.</p><div class="resident-pages">${game.residents.map(r=>{
        const wish=wishes[r.id%3],done=this.completed.has(r.id);
        return `<article class="resident-entry ${done?'wish-done':''}"><div class="resident-avatar tone-${r.id%4}"><img src="${residentIcon(r.id)}" alt="${residentName(r.id)} portresi"></div><div class="resident-story"><strong>${residentName(r.id)}</strong><small class="wish-badge">${done?'♥ Dileği gerçekleşti':'✧ Küçük bir dilek'}</small><p>“${done?wish.thanks:wish.text}”</p><span>${done?'Köyün refahına +3 katkı':`${cards.find(c=>c.id===wish.kind)!.name} kartı yerleştir · +3 refah`}</span></div></article>`
      }).join('')}</div>`:`<p class="journal-intro">Dalgaların getirdiği küçük erzak sandıkları.</p>${this.journal.length?this.journal.map(entry=>`<article class="discovery-entry"><span class="discovery-stamp">${resourceArt(entry.good)}</span><div><small>DALGALARDAN GELEN BİR ARMAĞAN</small><p>${entry.message}</p></div></article>`).join(''):'<div class="journal-empty"><span>✦</span><strong>İlk sandık henüz kıyıya ulaşmadı.</strong><p>Denizde yüzen sandıklara tıkla. İçlerinden odun, taş, yiyecek ve nadiren altın çıkabilir.</p></div>'}`}`;

  }
  private clearSea(x:number,z:number){
    return !!this.game&&[...this.game.board.keys()].every(id=>{const p=position(id);return Math.hypot(p.x-x,p.z-z)>RADIUS+.8});
  }
  private keepDiscoveryAtSea(){
    const chest=this.discovery;if(!chest||this.clearSea(chest.position.x,chest.position.z))return;
    const origin=chest.position.clone(),limit=4+this.game!.board.size*RADIUS*2;
    for(let radius=.8;radius<=limit;radius+=.4)for(let i=0;i<36;i++){
      const angle=i*Math.PI/18,x=origin.x+Math.cos(angle)*radius,z=origin.z+Math.sin(angle)*radius;
      if(!this.clearSea(x,z))continue;
      chest.position.x=x;chest.position.z=z;this.floatY=this.sampleSea(x,z).height;this.floatVelocity=0;return;
    }
  }
  private spawnDiscovery(){
    const game=this.game!;const points=[...game.board.keys()].map(position);if(!points.length)return;
    let location:T.Vector3|null=null;
    for(let i=0;i<30;i++){
      const p=points[Math.floor(Math.random()*points.length)],a=Math.random()*Math.PI*2,x=p.x+Math.cos(a)*2.6,z=p.z+Math.sin(a)*2.6;
      if(this.clearSea(x,z)){location=new T.Vector3(x,SEA_Y+.08,z);break}
    }
    if(!location)return;
    this.loot=rollChestLoot();const group=discoveryModel(this.loot);group.position.copy(location);this.root.add(group);this.discovery=group;
    this.opening=-1;this.prizeTime=0;this.sinkTime=-1;this.lootRequested=false;this.pendingLoot=false;this.floatY=this.sampleSea(location.x,location.z).height;
    this.floatVelocity=this.pitchVelocity=this.rollVelocity=this.pitch=this.roll=0;this.collect.disabled=false;
    this.collect.textContent='✧ Sürüklenen sandık';this.collect.setAttribute('aria-label','Sürüklenen sandığı aç');this.collect.hidden=false;
  }
  private claimDiscovery(){
    if(!this.game||!this.discovery||this.pendingLoot||this.sinkTime>=0)return;
    this.collect.disabled=true;
    if(this.opening<0){this.opening=0;this.collect.textContent='✧ Açılıyor…'}
    else{this.prizeTime=0;void this.rewardDiscovery()}
  }
  private async rewardDiscovery(){
    if(!this.game||!this.discovery||!this.loot||this.pendingLoot||this.sinkTime>=0)return;
    const chest=this.discovery,game=this.game,generation=this.generation,offered={...this.loot};this.pendingLoot=true;this.lootRequested=true;
    this.collect.disabled=true;this.collect.innerHTML=`${resourceArt(offered.good)}<b>${offered.amount}</b><span>Taşınıyor…</span>`;this.collect.setAttribute('aria-label',`${offered.amount} ${chestLootName[offered.good]} köye taşınıyor`);
    const at=chest.getWorldPosition(new T.Vector3()).add(new T.Vector3(0,.34,0));
    let accepted=0;
    try{accepted=await this.onLoot(offered,at)}catch{
      if(generation!==this.generation||this.discovery!==chest||this.game!==game)return;
      this.pendingLoot=false;this.collect.disabled=false;this.collect.innerHTML=`${resourceArt(offered.good)}<b>${offered.amount}</b><span>Tekrar al</span>`;return;
    }
    if(generation!==this.generation||this.discovery!==chest||this.game!==game)return;
    accepted=Number.isFinite(accepted)?T.MathUtils.clamp(Math.floor(accepted),0,offered.amount):0;
    this.pendingLoot=false;this.loot!.amount-=accepted;
    if(accepted){
      const message=`Sandıktan ${accepted} ${chestLootName[offered.good]} köyüne ulaştı.`;
      this.journal.unshift({message,good:offered.good,amount:accepted});this.journal=this.journal.slice(0,6);this.render();window.dispatchEvent(new CustomEvent('cozy-change',{detail:message}));
    }
    if(this.loot!.amount){
      this.collect.disabled=false;this.collect.innerHTML=`${resourceArt(offered.good)}<b>${this.loot!.amount}</b><span>sandıkta · Depoda yer aç</span>`;this.collect.setAttribute('aria-label',`${this.loot!.amount} ${chestLootName[offered.good]} sandıkta. Depoda yer açıp al.`);
    }else{
      // The HUD flight must finish before the empty chest gently leaves the surface.
      this.sinkTime=0;this.collect.hidden=true;this.nextDiscovery=this.clock+70+Math.random()*40;
    }
  }
  private floatDiscovery(dt:number){
    const chest=this.discovery!,x=chest.position.x,z=chest.position.z,wave=this.sampleSea(x,z);
    const left=this.sampleSea(x-.16,z),right=this.sampleSea(x+.16,z),front=this.sampleSea(x,z+.11),back=this.sampleSea(x,z-.11);
    const targetY=wave.height*.5+(left.height+right.height+front.height+back.height)*.125;
    const dx=wave.dx*.4+(right.height-left.height)/.32*.6,dz=wave.dz*.4+(front.height-back.height)/.22*.6,yaw=.15;
    const targetPitch=T.MathUtils.clamp(-Math.atan(dx*Math.sin(yaw)+dz*Math.cos(yaw)),-.3,.3);
    const targetRoll=T.MathUtils.clamp(Math.atan(dx*Math.cos(yaw)-dz*Math.sin(yaw)),-.3,.3);
    // Small integration steps keep a dragged wake buoyant at every game speed.
    const elapsed=Math.min(Math.max(0,dt),.3),steps=Math.max(1,Math.ceil(elapsed*120)),step=elapsed/steps;
    for(let i=0;i<steps;i++){
      this.floatVelocity+=((targetY-this.floatY)*48-this.floatVelocity*10)*step;this.floatY+=this.floatVelocity*step;
      this.pitchVelocity+=((targetPitch-this.pitch)*30-this.pitchVelocity*7)*step;this.pitch+=this.pitchVelocity*step;
      this.rollVelocity+=((targetRoll-this.roll)*30-this.rollVelocity*7)*step;this.roll+=this.rollVelocity*step;
    }
    const sink=this.sinkTime<0?0:T.MathUtils.smoothstep(this.sinkTime,0,CHEST_SINK_SECONDS);
    chest.position.y=SEA_Y+.035+this.floatY-sink*CHEST_SINK_DEPTH;chest.rotation.set(this.pitch+sink*.18,yaw,this.roll+sink*.1);
    if(sink>0){const opacity=1-T.MathUtils.smoothstep(sink,.7,1);chest.traverse(object=>{if(object instanceof T.Mesh)for(const material of Array.isArray(object.material)?object.material:[object.material]){material.transparent=true;material.opacity=opacity;material.depthWrite=true}})}
  }
  update(dt:number,camera:T.Camera,visualDt=dt){
    const game=this.game;if(!game)return;this.clock+=dt;this.floatClock+=visualDt;
    const signature=[...game.board].map(([id,k])=>`${id}:${k}`).join('|');
    if(signature!==this.signature){
      this.signature=signature;this.keepDiscoveryAtSea();this.clearBlooms();
      const tiles=[...game.board.keys()].slice(0,40),flowers=new T.InstancedMesh(cozyFlowerGeometry(),this.flowerMat,tiles.length*5),pose=new T.Object3D();let index=0;
      for(const id of tiles){const p=position(id);for(let j=0;j<5;j++){const a=j*2.4+id,r=.58+(j%2)*.08;pose.position.set(p.x+Math.cos(a)*r,LAND_Y+.005,p.z+Math.sin(a)*r);pose.scale.setScalar(.85+(j%3)*.12);pose.updateMatrix();flowers.setMatrixAt(index++,pose.matrix)}}
      flowers.instanceMatrix.needsUpdate=true;flowers.computeBoundingSphere();this.blooms.add(flowers);
      for(const resident of game.residents){if(!this.completed.has(resident.id)&&[...game.board.values()].includes(wishes[resident.id%3].kind)){this.completed.add(resident.id);game.happy=Math.min(100,game.happy+3);window.dispatchEvent(new CustomEvent('cozy-change',{detail:`${residentName(resident.id)}: “${wishes[resident.id%3].thanks}” +3 refah`}))}}
      this.render();
    }
    const spring=Math.max(0,1-climate.winter.value-climate.autumn.value-climate.summer.value);
    this.flowerMat.opacity=spring*.9;this.blooms.visible=spring>.01;
    const origin=position([...game.board.keys()][0]);
    for(let i=0;i<64;i++){const a=i*2.399+this.clock*.03,r=1+(i%11)*.42;this.leafPositions[i*3]=origin.x+Math.sin(a)*r;this.leafPositions[i*3+1]=((i*.31-this.clock*.3)%3+3)%3;this.leafPositions[i*3+2]=origin.z+Math.cos(a)*r}
    for(let i=0;i<32;i++){const a=i*2.4+this.clock*.06;this.firePositions[i*3]=origin.x+Math.sin(a)*(1+i%5);this.firePositions[i*3+1]=.3+Math.sin(this.clock*1.2+i)*.12;this.firePositions[i*3+2]=origin.z+Math.cos(a)*(1+i%5)}
    this.leaves.geometry.getAttribute('position').needsUpdate=true;this.fireflies.geometry.getAttribute('position').needsUpdate=true;
    this.leafMat.opacity=climate.autumn.value*.65*(1-climate.night.value*.8);this.fireMat.opacity=climate.summer.value*climate.night.value*.65;
    this.leaves.visible=this.leafMat.opacity>.01;this.fireflies.visible=this.fireMat.opacity>.01;
    if(!this.discovery&&this.clock>=this.nextDiscovery){this.spawnDiscovery();this.nextDiscovery=this.clock+35}
    if(this.discovery){
      if(this.sinkTime>=0){this.sinkTime+=visualDt;if(this.sinkTime>=CHEST_SINK_SECONDS){this.removeDiscovery();this.collect.hidden=true;this.opening=-1;return}}
      this.floatDiscovery(visualDt);
      if(this.opening>=0){
        this.opening+=visualDt;const t=this.opening,lid=this.discovery.userData.lid as T.Group|undefined,prizes=this.discovery.userData.prizes as T.Group;
        if(lid)lid.rotation.x=-T.MathUtils.smoothstep(t,0,.8)*1.65;
        prizes.visible=t>.35;
        if(t>.35)this.prizeTime+=visualDt;
        prizes.children.forEach((prize,i)=>{
          prize.visible=i<Math.min(this.loot?.amount??0,6);const phase=prize.userData.phase as number,progress=T.MathUtils.clamp((this.prizeTime-i*.04)/1.1,0,1);
          if(this.lootRequested&&!this.pendingLoot&&this.sinkTime<0){prize.position.set(Math.cos(phase)*.08,.08+Math.sin(this.floatClock*1.4+i)*.008,Math.sin(phase)*.065);prize.scale.setScalar(.85)}
          else{prize.position.set(Math.cos(phase)*progress*.15,.12+Math.sin(progress*Math.PI)*.32+progress*.16,Math.sin(phase)*progress*.15);prize.scale.setScalar(1-T.MathUtils.smoothstep(this.prizeTime,1.1,1.65))}
          prize.rotation.set(.2,phase+this.floatClock*.5,.1);
        });
        if(t>.8&&!this.lootRequested)void this.rewardDiscovery();
      }
      const p=this.discovery.position.clone().add(new T.Vector3(0,.35,0)).project(camera);
      this.collect.style.left=`${(p.x+1)*50}%`;this.collect.style.top=`${(1-p.y)*50}%`;
      this.collect.hidden=this.sinkTime>=0||p.z< -1||p.z>1||!!document.querySelector('dialog[open]');
      if(!this.collect.hidden){
        const label=this.collect.getBoundingClientRect(),hud=document.querySelector('.hud-rail')?.getBoundingClientRect();
        const overlapsHud=hud&&label.left<hud.right+8&&label.right>hud.left-8&&label.top<hud.bottom+8&&label.bottom>hud.top-8;
        this.collect.hidden=!!overlapsHud||label.left<8||label.right>innerWidth-8||label.top<8||label.bottom>innerHeight-8;
      }
    }
    
  }
}
