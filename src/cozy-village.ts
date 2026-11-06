import {residentIcon} from './resident-card';
import {cozyFlowerGeometry} from './models';
import {discoveryModel} from './discovery-model';
import * as T from 'three';
import {Game,cards} from './game';
import {position,fromWorld} from './hex';
import {LAND_Y,SEA_Y} from './scenery';
import {climate} from './climate';
import {residentName,wishes} from './village-personality';

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
  private completed=new Set<number>();private journal:string[]=[];private signature='';private clock=0;private nextDiscovery=35;
  private opening=-1;private rewarded=false;
  private discovery:T.Group|null=null;private discoveryType=0;private activeTab:'residents'|'discoveries'='residents';
  constructor(private scene:T.Scene,private sampleSea:(x:number,z:number)=>{height:number;dx:number;dz:number}){
    this.root.add(this.blooms);scene.add(this.root);
    const leafGeo=new T.BufferGeometry();leafGeo.setAttribute('position',new T.BufferAttribute(this.leafPositions,3));
    const fireGeo=new T.BufferGeometry();fireGeo.setAttribute('position',new T.BufferAttribute(this.firePositions,3));
    this.leaves=new T.Points(leafGeo,this.leafMat);this.fireflies=new T.Points(fireGeo,this.fireMat);this.root.add(this.leaves,this.fireflies);
    this.panel=document.createElement('section');this.panel.id='village-journal';this.panel.hidden=true;this.panel.setAttribute('aria-label','Köy defteri');
    this.toggle=document.createElement('button');this.toggle.id='village-journal-toggle';this.toggle.textContent='✿ Köy Defteri';this.toggle.setAttribute('aria-expanded','false');
    this.collect=document.createElement('button');this.collect.className='discovery-pick';this.collect.hidden=true;
    document.querySelector('#app')!.append(this.panel,this.toggle,this.collect);
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
  reset(){this.game=null;this.completed.clear();this.journal=[];this.signature='';this.clock=0;this.nextDiscovery=15;this.opening=-1;this.rewarded=false;this.panel.hidden=true;this.collect.hidden=true;this.clearBlooms();this.removeDiscovery()}
  private clearBlooms(){for(const child of this.blooms.children){if(child instanceof T.Mesh)child.geometry.dispose()}this.blooms.clear()}
  private removeDiscovery(){if(this.discovery){this.root.remove(this.discovery);this.discovery.traverse(o=>{if(o instanceof T.Mesh){o.geometry.dispose();(o.material as T.Material).dispose()}});this.discovery=null}}
  private render(){
    const game=this.game;if(!game)return;
    const residents=this.activeTab==='residents';
    this.panel.innerHTML=`<header><div><small>KIYIMIZIN HİKÂYELERİ</small><h2>Köy Defteri</h2></div><button data-journal-close aria-label="Kapat">×</button></header>
      <div class="journal-summary"><span>♧ <b>${game.people}</b> komşu</span><span>♥ <b>${this.completed.size}</b> mutlu dilek</span></div>
      <nav class="journal-tabs" aria-label="Defter bölümleri"><button data-journal-tab="residents" aria-pressed="${residents}">Komşularımız</button><button data-journal-tab="discoveries" aria-pressed="${!residents}">Kıyı keşifleri${this.journal.length?` · ${this.journal.length}`:''}</button></nav>
      ${residents?`<p class="journal-intro">Komşularını tanı, küçük dileklerine kulak ver.</p><div class="resident-pages">${game.residents.map(r=>{
        const wish=wishes[r.id%3],done=this.completed.has(r.id);
        return `<article class="resident-entry ${done?'wish-done':''}"><div class="resident-avatar tone-${r.id%4}"><img src="${residentIcon(r.id)}" alt="${residentName(r.id)} portresi"></div><div class="resident-story"><strong>${residentName(r.id)}</strong><small class="wish-badge">${done?'♥ Dileği gerçekleşti':'✧ Küçük bir dilek'}</small><p>“${done?wish.thanks:wish.text}”</p><span>${done?'Köyün refahına +3 katkı':`${cards.find(c=>c.id===wish.kind)!.name} kartı yerleştir · +3 refah`}</span></div></article>`
      }).join('')}</div>`:`<p class="journal-intro">Dalgaların getirdiği küçük sürprizler.</p>${this.journal.length?this.journal.map((entry,i)=>`<article class="discovery-entry"><span class="discovery-stamp">${['✉','✦','❧'][i%3]}</span><div><small>KIYIDAN BİR HATIRA</small><p>${entry}</p></div></article>`).join(''):'<div class="journal-empty"><span>✉</span><strong>İlk hikâye henüz kıyıya ulaşmadı.</strong><p>Denizde beliren şişe, sandık ve kabuklara tıkla. Buldukların burada hatıra olarak kalacak.</p></div>'}`}`;

  }
  private spawnDiscovery(){
    const game=this.game!;const points=[...game.board.keys()].map(position);if(!points.length)return;
    let location:T.Vector3|null=null;
    for(let i=0;i<30;i++){const p=points[Math.floor(Math.random()*points.length)],a=Math.random()*Math.PI*2,x=p.x+Math.cos(a)*2.6,z=p.z+Math.sin(a)*2.6;if(!game.board.has(fromWorld(x,z))){location=new T.Vector3(x,SEA_Y+.08,z);break}}
    if(!location)return;
    this.discoveryType=Math.floor(Math.random()*3);const group=discoveryModel(this.discoveryType);group.position.copy(location);this.root.add(group);this.discovery=group;this.opening=-1;this.rewarded=false;this.collect.disabled=false;
    this.collect.textContent=['✧ Mesaj şişesi','✧ Sürüklenen sandık','✧ Deniz kabuğu'][this.discoveryType];this.collect.hidden=false;
  }
  private claimDiscovery(){
    if(!this.game||!this.discovery||this.opening>=0)return;
    this.opening=0;this.collect.disabled=true;this.collect.textContent='✧ Açılıyor…';
  }
  private rewardDiscovery(){
    if(!this.game||!this.discovery||this.rewarded)return;this.rewarded=true;
    const gold=[3,6,2][this.discoveryType];this.game.gold+=gold;
    const stories=[`Bir denizci not bırakmış: “Yolum yine bu sakin koya düşsün.” +${gold} altın.`,`Sandıkta eski bir ticaret kesesi buldun. +${gold} altın.`,`İnci gibi bir kabuk… Köylüler onu köyün uğuru sayıyor. +${gold} altın.`];
    this.journal.unshift(stories[this.discoveryType]);this.journal=this.journal.slice(0,6);this.collect.textContent=`+${gold} altın · Kıyıdan bir hatıra`;this.nextDiscovery=this.clock+70+Math.random()*40;this.render();window.dispatchEvent(new CustomEvent('cozy-change',{detail:'Kıyıda küçük bir hazine buldun.'}));
  }
  update(dt:number,camera:T.Camera){
    const game=this.game;if(!game)return;this.clock+=dt;
    const signature=[...game.board].map(([id,k])=>`${id}:${k}`).join('|');
    if(signature!==this.signature){
      this.signature=signature;this.clearBlooms();
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
      const wave=this.sampleSea(this.discovery.position.x,this.discovery.position.z);
      this.discovery.position.y=SEA_Y+.035+wave.height;
      this.discovery.rotation.set(Math.atan(wave.dz),.15, -Math.atan(wave.dx));
      if(this.opening>=0){
        this.opening+=dt;const t=this.opening,lid=this.discovery.userData.lid as T.Group|undefined,prizes=this.discovery.userData.prizes as T.Group;
        if(lid)lid.rotation.x=-T.MathUtils.smoothstep(t,0,.8)*1.65;
        prizes.visible=t>.35;
        prizes.children.forEach((coin,i)=>{coin.visible=i<[3,6,2][this.discoveryType];const phase=coin.userData.phase,progress=T.MathUtils.clamp((t-.35-i*.04)/1.5,0,1);coin.position.set(Math.cos(phase)*progress*.22,.12+Math.sin(progress*Math.PI)*.4+progress*.12,Math.sin(phase)*progress*.22);coin.rotation.set(t*2,phase+t,t*.7);coin.scale.setScalar(1-T.MathUtils.smoothstep(t,1.8,2.5))});
        if(t>.8)this.rewardDiscovery();
        if(t>2.7){this.removeDiscovery();this.collect.hidden=true;this.opening=-1;return}
      }
      const p=this.discovery.position.clone().add(new T.Vector3(0,.35,0)).project(camera);this.collect.hidden=p.z< -1||p.z>1;this.collect.style.left=`${(p.x+1)*50}%`;this.collect.style.top=`${(1-p.y)*50}%`;
    }
    
  }
}
