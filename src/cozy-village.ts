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
  private flowerMat=new T.MeshLambertMaterial({color:0xf4bbbd,transparent:true,depthWrite:false});
  private leafMat=new T.PointsMaterial({color:0xd79750,size:.045,transparent:true,depthWrite:false});
  private fireMat=new T.PointsMaterial({color:0xe5dc94,size:.025,transparent:true,depthWrite:false});
  private leafPositions=new Float32Array(64*3);private firePositions=new Float32Array(32*3);
  private leaves:T.Points;private fireflies:T.Points;
  private panel:HTMLElement;private toggle:HTMLButtonElement;private collect:HTMLButtonElement;
  private completed=new Set<number>();private journal:string[]=[];private signature='';private clock=0;private nextDiscovery=35;
  private lamps:T.MeshStandardMaterial[]=[];
  private discovery:T.Group|null=null;private discoveryType=0;private uiClock=0;
  constructor(private scene:T.Scene){
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
    this.panel.addEventListener('click',event=>{
      const button=(event.target as Element).closest<HTMLButtonElement>('[data-decor]');
      if(button){window.dispatchEvent(new CustomEvent('cozy-card',{detail:button.dataset.decor}));this.panel.hidden=true;this.toggle.setAttribute('aria-expanded','false')}
      if((event.target as Element).closest('[data-journal-close]')){this.panel.hidden=true;this.toggle.setAttribute('aria-expanded','false')}
    });
  }
  bind(game:Game){this.reset();this.game=game;this.render()}
  reset(){this.game=null;this.completed.clear();this.journal=[];this.signature='';this.clock=0;this.nextDiscovery=35;this.panel.hidden=true;this.collect.hidden=true;this.clearBlooms();this.removeDiscovery()}
  private clearBlooms(){for(const child of this.blooms.children){if(child instanceof T.Mesh)child.geometry.dispose()}this.blooms.clear()}
  private removeDiscovery(){if(this.discovery){this.root.remove(this.discovery);this.discovery.traverse(o=>{if(o instanceof T.Mesh){o.geometry.dispose();(o.material as T.Material).dispose()}});this.discovery=null}}
  private render(){
    const game=this.game;if(!game)return;
    this.panel.innerHTML=`<header><div><small>YELKEN KOYU</small><h2>Köy Defteri</h2></div><button data-journal-close aria-label="Kapat">×</button></header><p class="journal-intro">Küçük güzellikler, yeni dostluklar.</p><h3>Dekorasyon kartları</h3><p>Bir kart seç; elindeki son normal kartın yerine gelir. Kaynaklar yalnızca yerleştirince harcanır.</p><div class="decor-picks">${cards.filter(c=>['bench','lantern','well'].includes(c.id)).map(c=>`<button data-decor="${c.id}"><b>${c.name}</b><span>${Object.entries(c.cost).map(([k,v])=>`${v} ${k==='wood'?'odun':'taş'}`).join(' · ')}</span></button>`).join('')}</div><h3>Komşular ve dilekleri</h3><div class="resident-pages">${game.residents.map(r=>{const wish=wishes[r.id%3],done=this.completed.has(r.id);return `<article><strong>${residentName(r.id)} <small>${done?'♥ Gerçekleşti':'Bir dilek'}</small></strong><p>${done?wish.thanks:wish.text}</p><span>${done?'+3 refah kazanıldı':`Köyüne ${cards.find(c=>c.id===wish.kind)!.name.toLocaleLowerCase('tr-TR')} ekle.`}</span></article>`}).join('')}</div><h3>Kıyıdan gelenler</h3>${this.journal.length?this.journal.map(entry=>`<p class="journal-entry">${entry}</p>`).join(''):'<p>Denize göz at. Bir şişe, sandık ya da deniz kabuğu kıyına ulaşabilir…</p>'}`;
  }
  private spawnDiscovery(){
    const game=this.game!;const points=[...game.board.keys()].map(position);if(!points.length)return;
    let location:T.Vector3|null=null;
    for(let i=0;i<30;i++){const p=points[Math.floor(Math.random()*points.length)],a=Math.random()*Math.PI*2,x=p.x+Math.cos(a)*2.6,z=p.z+Math.sin(a)*2.6;if(!game.board.has(fromWorld(x,z))){location=new T.Vector3(x,SEA_Y+.08,z);break}}
    if(!location)return;
    this.discoveryType=Math.floor(Math.random()*3);const group=new T.Group();group.position.copy(location);
    const material=new T.MeshStandardMaterial({color:[0x83b7a3,0xb48c5a,0xebd8b4][this.discoveryType],roughness:.65});
    const shape=this.discoveryType===0?new T.CylinderGeometry(.055,.065,.23,8):this.discoveryType===1?new T.BoxGeometry(.27,.16,.19):new T.SphereGeometry(.11,8,5);
    const object=new T.Mesh(shape,material);if(this.discoveryType===0)object.rotation.z=.7;if(this.discoveryType===2)object.scale.set(1,.35,1.2);group.add(object);this.root.add(group);this.discovery=group;
    this.collect.textContent=['✧ Mesaj şişesi','✧ Sürüklenen sandık','✧ Deniz kabuğu'][this.discoveryType];this.collect.hidden=false;
  }
  private claimDiscovery(){
    if(!this.game||!this.discovery)return;
    const gold=[3,6,2][this.discoveryType];this.game.gold+=gold;
    const stories=[`Bir denizci not bırakmış: “Yolum yine bu sakin koya düşsün.” +${gold} altın.`,`Sandıkta eski bir ticaret kesesi buldun. +${gold} altın.`,`İnci gibi bir kabuk… Köylüler onu köyün uğuru sayıyor. +${gold} altın.`];
    this.journal.unshift(stories[this.discoveryType]);this.journal=this.journal.slice(0,6);this.removeDiscovery();this.collect.hidden=true;this.nextDiscovery=this.clock+70+Math.random()*40;this.render();window.dispatchEvent(new CustomEvent('cozy-change',{detail:'Kıyıda küçük bir hazine buldun.'}));
  }
  update(dt:number,camera:T.Camera){
    const game=this.game;if(!game)return;this.clock+=dt;
    const signature=[...game.board].map(([id,k])=>`${id}:${k}`).join('|');
    if(signature!==this.signature){
      this.signature=signature;this.clearBlooms();
      const tiles=[...game.board.keys()].slice(0,40),flowers=new T.InstancedMesh(new T.SphereGeometry(.026,5,3),this.flowerMat,tiles.length*5),pose=new T.Object3D();let index=0;
      for(const id of tiles){const p=position(id);for(let j=0;j<5;j++){const a=j*2.4+id,r=.58+(j%2)*.08;pose.position.set(p.x+Math.cos(a)*r,LAND_Y+.045,p.z+Math.sin(a)*r);pose.scale.set(1,.5,1);pose.updateMatrix();flowers.setMatrixAt(index++,pose.matrix)}}
      flowers.instanceMatrix.needsUpdate=true;flowers.computeBoundingSphere();this.blooms.add(flowers);
      this.lamps=[];this.scene.traverse(object=>{if(object.userData.cozyLantern&&object instanceof T.Mesh)this.lamps.push(object.material as T.MeshStandardMaterial)});
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
    for(const mat of this.lamps){mat.emissive.set('#ffb650');mat.emissiveIntensity=climate.night.value*1.3}
    if(!this.discovery&&this.clock>=this.nextDiscovery){this.spawnDiscovery();this.nextDiscovery=this.clock+35}
    if(this.discovery){this.discovery.position.y=SEA_Y+.08+Math.sin(this.clock*1.5)*.025;this.discovery.rotation.z=Math.sin(this.clock*.8)*.08;
      const p=this.discovery.position.clone().add(new T.Vector3(0,.3,0)).project(camera);this.collect.hidden=p.z< -1||p.z>1;this.collect.style.left=`${(p.x+1)*50}%`;this.collect.style.top=`${(1-p.y)*50}%`;
    }
    
  }
}
