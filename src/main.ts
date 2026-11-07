import type {ChestLoot} from './chest-loot';
import {resourceArt} from './resource-art';
import './style.css';
import './ui-shell.css';
import './ui-cards.css';
import './ui-dialogs.css';
import './ui-panels.css';
import './ui-materials.css';
import {Vector3} from 'three';
import {CENTER,position} from './hex';
import {harvestSeconds,cards,MILESTONES,REROLL_COST,TRADE_GOODS,WORK_CATEGORIES,type WorkCategory,type Resource,type Card,type TradeGood} from './game';
import {World} from './world';
import {CardDrag} from './drag';
import {TableSound} from './sound';
import {setupSettings} from './settings';
import {createDemoGame} from './demo';

import {icon} from './icons';
import {gameSpeed} from './game-speed';
const app=document.querySelector<HTMLElement>('#app')!;
app.addEventListener('dragstart',event=>event.preventDefault());
app.addEventListener('selectstart',event=>{if(!(event.target instanceof Element&&event.target.closest('input,textarea')))event.preventDefault()});
app.addEventListener('contextmenu',event=>event.preventDefault());
app.innerHTML=`<div id="world" aria-label="Kartlarla genişleyen altıgen kıyı adası"></div>
 <div class="vignette"></div>
 <div class="hud-rail" aria-hidden="true"></div>
 <div class="kingdom-hud" aria-label="Krallığın kaynakları"><div id="stats" aria-label="Krallığın kaynakları"></div></div>
 <div id="log" role="status"></div><div id="placement" aria-live="polite"></div>
 <button id="event-target" hidden>Anlık etkiyi burada kullan</button><div class="hand-wrap"><div class="hand-label"><span class="hand-instruction">Bir kart seç ve kıyıya yerleştir</span><button id="reroll-toggle" class="card-exchange" title="Bütün kartları 5 altına yenile"><span class="exchange-icon">${icon('reset')}</span><span>Kartları yenile</span><small>${resourceArt('gold')} ${REROLL_COST}</small></button></div><div class="hand-dock"><div id="hand"></div></div></div>
 <div class="tools"><button id="trade-open" aria-label="Deniz ticareti" title="Deniz ticareti">${icon('harbor')}</button><button id="help" aria-label="Oyun rehberi" title="Oyun rehberi">${icon('help')}</button><button id="settings" aria-label="Ayarlar" aria-haspopup="dialog" title="Ayarlar">${icon('settings')}</button><button id="restart" title="Yeni krallık" aria-label="Yeni krallık">${icon('reset')}</button></div>
 <section id="tile-editor" hidden aria-label="Yerleşimi düzenle"><div class="tile-editor-heading"><strong></strong><button data-tile-close aria-label="Düzenlemeyi kapat">×</button></div><small></small><div id="storage-upgrade" hidden><div><span id="storage-meter"></span><button id="upgrade-store"></button></div><progress id="storage-progress" value="0" max="1" aria-label="Depo kapasitesi"></progress></div><button id="tile-trade" hidden>Tüccarla ticaret yap</button><div class="tile-editor-actions"><button data-tile-left aria-label="Yerleşimi sola döndür">↶ Döndür</button><button data-tile-right aria-label="Yerleşimi sağa döndür">Döndür ↷</button><button data-tile-delete>Yık ve sil</button></div></section>
 <section id="work-panel" hidden aria-label="Köylü görevleri"><header><div><small>KÖY YÖNETİMİ</small><strong>Köylüler</strong></div><button data-work-close aria-label="Kapat">×</button></header><div id="work-summary"></div><div class="work-mode"><span id="work-mode-label"></span><button data-work-balance>Otomatik dağıt</button></div><div id="work-rows"></div><p id="work-hint"></p><button data-progress>Yerleşim gelişimi <span>→</span></button></section>
 <aside id="food-details" hidden role="tooltip"></aside>
 <aside id="tile-tooltip" hidden><strong></strong><div></div></aside><dialog></dialog>`;
const get=<E extends HTMLElement=HTMLElement>(selector:string)=>app.querySelector<E>(selector)!;
const hand=get('#hand'), placement=get('#placement'), log=get('#log'), dialog=get<HTMLDialogElement>('dialog');
const world=new World(get('#world'));
const thumbs=world.thumbnails();
const sound=new TableSound();
world.onSoundFrame=(camera,focus,birds,shore,land)=>sound.updateSpatial(camera,focus,birds,shore,land);
world.onWorkSound=(cue,at)=>sound.work(cue,at);
world.onPlacementSound=(kind,at)=>sound.placement(kind,at);
world.onFenceBuild=()=>sound.play('fence');
world.onFenceBreak=()=>sound.play('fenceBreak');
let game=createDemoGame();
let selected:Card|null=null,settleTimer:number|undefined,toastTimer:number|undefined,locked=false;
let pendingPlacement:number|null=null;
let previewCell=-1;
let editedTile=-1;
let handBusy=false,handMotion=0;

function affordable(c:Card) { return game.canAfford(c); }
function select(c:Card|null,carrying=false) {
  if(!c)pendingPlacement=null;
  previewCell=-1;
  selected=c;document.body.classList.toggle('is-placing',!!c);get('#event-target').hidden=!c?.event;world.setSelection(c,carrying);
  hand.classList.toggle('choosing',!!c);
  hand.querySelectorAll<HTMLButtonElement>('[data-card]').forEach(b=>{
    const active=!!c&&game.hand[Number(b.dataset.card)]===c;
    b.classList.toggle('selected',active);b.setAttribute('aria-pressed',String(active));
  });
}
function label(text:string){
  const card=selected?.id??'';
  if(placement.dataset.message===text&&placement.dataset.card===card)return;
  placement.dataset.message=text;placement.dataset.card=card;placement.hidden=!text;
  placement.replaceChildren();if(!text)return;
  const name=document.createElement('strong'),detail=document.createElement('span'),keys=document.createElement('small');
  name.textContent=selected?.name??'';detail.textContent=text;
  keys.textContent=selected?.event?'Esc · iptal':'R / tekerlek · döndür     Esc · iptal';
  placement.append(name,detail,keys);
}
world.valid=i=>!!selected&&i>=0&&game.valid(selected,i);
world.onHover=i=>{
  if(!selected){previewCell=-1;label('');return}
  if(i<0){previewCell=-1;placement.dataset.valid='true';label(selected.event?'Mevcut bir karoya bırak':'Kıyıda boş bir yer seç');return}
  if(!world.valid(i)){previewCell=-1;label(selected.event?'Mevcut karaya bırak':game.wouldSealFishery(i)?'Liman ve balıkçı kıyısı açık kalmalı':'Yalnızca kıyıdaki boş bir altıgene bırak');placement.dataset.valid='false';return}
  placement.dataset.valid='true';
  if(selected.event){label(selected.desc);return}
  const p=game.preview(selected,i)!;
  const effects=[p.stone&&`+${p.stone} taş / teslimat`,p.wood&&`+${p.wood} odun / teslimat`,p.food&&`+${p.food} yiyecek / teslimat`,p.happy&&`+${p.happy} refah / teslimat`,p.people&&`+${p.people} nüfus`].filter(Boolean);
  const adjacentBonus=p.localBonus||p.neighbors.length>0;
  if(previewCell!==i){previewCell=i;const point=position(i);sound.placementFocus(new Vector3(point.x,0,point.z),i,!!adjacentBonus)}
  label((adjacentBonus?'Komşuluk · ':'')+(effects.join('  ·  ')||'Yerleşime uygun'));
};
function toast(text:string) {
  clearTimeout(toastTimer);log.textContent=text;log.classList.add('visible');
  toastTimer=window.setTimeout(()=>log.classList.remove('visible'),2400);
}
function commit(i:number) {
  if(handBusy||dialog.open||!selected||i<0||!world.valid(i))return false;
  if(locked){pendingPlacement=i;world.holdSelection();label('Ada hazırlanıyor…');return true}
  const rotation=world.placementRotation;
  const card=selected,preview=game.preview(card,i)!;
  const production=game.play(card,i);
  if(!production)return false;
  locked=true;
  sound.play('drop',true);select(null);world.sync(game.board,card.event?-1:i,rotation);
  if(!card.event){const p=position(i);sound.landingWave(new Vector3(p.x,0,p.z))}
  if(card.event){world.burst(i);const p=position(i);sound.placement(card.id,new Vector3(p.x,.3,p.z))}
  render(true);
  toast(card.event?`${card.name} uygulandı`:`${card.name} · yerleşim hazırlanıyor`);
  clearTimeout(settleTimer);settleTimer=window.setTimeout(settle,2000);return true;
}
function settle(){
  if(world.placing){settleTimer=window.setTimeout(settle,100);return}
  locked=false;
  if(pendingPlacement!==null){const i=pendingPlacement;pendingPlacement=null;commit(i)}
}
world.onTileSelect=i=>{
  editedTile=i;const editor=get('#tile-editor');editor.hidden=i<0;
  if(i<0){get('#storage-upgrade').hidden=true;return}
  get('#tile-editor strong').textContent=i===CENTER?'Krallık merkezi':cards.find(c=>c.id===game.board.get(i))?.name??'Yerleşim';
  get('#tile-editor small').textContent=i===CENTER?'Merkez korunur · R / tekerlek ile döndür':'R / tekerlek · Silmede kaynak iadesi yok';
  get('#tile-trade').hidden=game.board.get(i)!=='harbor';
  const remove=get<HTMLButtonElement>('[data-tile-delete]');remove.disabled=i===CENTER;
  remove.title=i===CENTER?'Krallık merkezi silinemez':'Yapı ve toprak denize çöker';renderStorage();
};
function renderStorage(){
  const panel=get('#storage-upgrade'),id=editedTile;panel.hidden=!game.storageStocks.has(id);if(panel.hidden)return;
  const used=game.storageUsed(id),max=game.storageCapacity(id),cost=game.upgradeCost(id);
  get('#storage-meter').textContent=`Seviye ${game.storageLevels.get(id)} · ${used} / ${max} dolu`;
  const progress=get<HTMLProgressElement>('#storage-progress');progress.max=max;progress.value=used;
  const button=get<HTMLButtonElement>('#upgrade-store');button.innerHTML=`${icon('carry')} ${max} → ${max+(id===CENTER?80:60)} kapasite <span>${icon('wood')} ${cost} · Yükselt</span>`;button.disabled=game.wood<cost;button.title=`Kapasite +${id===CENTER?80:60}`;
}
get('#upgrade-store').onclick=()=>{if(game.upgradeStore(editedTile)){world.upgradeStorage(editedTile);renderHud();renderStorage();sound.play('build');toast(`Depo yükseltildi · Seviye ${game.storageLevels.get(editedTile)} · ${game.storageCapacity(editedTile)} kapasite`)}};
get('[data-tile-left]').onclick=()=>world.rotateSelection(-1);
get('[data-tile-right]').onclick=()=>world.rotateSelection(1);
get('[data-tile-close]').onclick=()=>world.editTile(-1);
get('[data-tile-delete]').onclick=()=>{
  const id=editedTile;if(world.placing||!game.remove(id))return;
  locked=true;drag.cancel();select(null);world.demolish(game.board,id);render();toast('Yerleşim kaldırıldı · kaynak iadesi yok');
  clearTimeout(settleTimer);settleTimer=window.setTimeout(settle,1500);
};

world.onPick=commit;
get('#event-target').onclick=()=>{if(selected?.event)commit(CENTER)};
function dragPosition(x:number,y:number){
  if(selected?.event&&document.elementFromPoint(x,y)?.closest('#event-target'))return CENTER;
  return world.point(x,y);
}
hand.addEventListener('pointerover',event=>{
  const b=(event.target as Element).closest('button');
  if(b&&!b.disabled&&!b.contains(event.relatedTarget as Node|null)&&!locked&&!selected)sound.play('hover');
});
const drag=new CardDrag(hand,{
  canStart:i=>!handBusy&&pendingPlacement===null&&!dialog.open&&!!game.hand[i]&&affordable(game.hand[i]),
  start:i=>{const card=game.hand[i];select(card,true);void sound.dragCard(card.id)},
  move:(x,y)=>world.valid(dragPosition(x,y)),
  drop:(x,y)=>commit(dragPosition(x,y)),
  cancel:()=>select(null),
  tap:i=>{const c=game.hand[i];select(selected===c?null:c)},
});
const workNames:Record<WorkCategory,string>={stone:'Taş çıkarma',wood:'Odunculuk',berry:'Çilek toplama',farm:'Buğday hasadı',fish:'Balıkçılık',garden:'Bahçe bakımı'};
const workIcons:Record<WorkCategory,string>={stone:'stone',wood:'wood',berry:'berry',farm:'wheat',fish:'fish',garden:'garden'};
get('#work-rows').innerHTML=WORK_CATEGORIES.map(category=>`<div class="work-row" data-work="${category}"><span class="work-symbol">${resourceArt(workIcons[category])||icon(workIcons[category])}</span><div class="work-description"><b>${workNames[category]}</b><small></small></div><div class="worker-stepper" role="group" aria-label="${workNames[category]} işçi sayısı"><button data-worker="${category}" data-delta="-1" aria-label="${workNames[category]} görevinden bir kişi çıkar">−</button><output aria-label="${workNames[category]} için ayrılan kişi">0</output><button data-worker="${category}" data-delta="1" aria-label="${workNames[category]} görevine bir kişi ekle">+</button></div></div>`).join('');
function renderWork(){
  const counts=world.villagers.assignedCounts(),targets=game.workTargets();
  const allocated=Object.values(targets).reduce((a,b)=>a+b,0),free=game.people-allocated;
  get('#work-summary').innerHTML=`<span>${resourceArt('people')}<b>${game.people}</b> köylü</span><span class="free-workers">${icon('rest')}<b>${free}</b> boşta</span>`;
  get('#work-mode-label').textContent=game.autoWorkers?'Otomatik dağılım':'Elle dağılım';
  get<HTMLButtonElement>('[data-work-balance]').disabled=game.autoWorkers;
  get('#work-hint').textContent=game.dockPending?`${game.dockPending} ürün iskeleye taşınmak için ayrıldı.`:WORK_CATEGORIES.some(c=>game.workCapacity(c))?'＋ Bir köylü ata · − Görevden çıkar. Boşta kimse yoksa + başka işten aktarır.':'Önce bir orman, bahçe veya üretim alanı kur.';
  for(const category of WORK_CATEGORIES){
    const row=get(`[data-work="${category}"]`),capacity=game.workCapacity(category),count=targets[category];
    row.hidden=capacity===0;
    row.querySelector('output')!.textContent=String(count);
    row.querySelector('small')!.textContent=!capacity?'Önce çalışma alanı kur':counts[category]>count?'Son teslimatını bitiriyor':counts[category]<count?`${counts[category]} çalışıyor · ${count-counts[category]} hazırlanıyor`:`${counts[category]} çalışıyor · ${capacity} kişilik yer`;
    row.querySelector<HTMLButtonElement>('[data-delta="-1"]')!.disabled=count===0;
    const add=row.querySelector<HTMLButtonElement>('[data-delta="1"]')!;add.disabled=count>=capacity||game.people===0;
    add.title=free?'Boştaki bir köylüyü ata':'Başka görevden bir köylüyü buraya aktar';
    row.classList.toggle('inactive',!capacity);row.classList.toggle('staffed',count>0);
  }
  if(!get('#work-panel').hidden)positionWork();
}
function positionWork(){
  const panel=get('#work-panel'),rect=get('[data-resource="people"]').getBoundingClientRect();
  panel.style.left=`${Math.max(16,Math.min(innerWidth-panel.offsetWidth-16,rect.left+rect.width/2-panel.offsetWidth/2))}px`;
  panel.style.top=`${rect.bottom+14}px`;
}
function closeWork(){get('#work-panel').hidden=true;get('#stats').querySelector('[data-resource="people"]')?.setAttribute('aria-expanded','false')}
function toggleWork(){const panel=get('#work-panel');panel.hidden=!panel.hidden;get('[data-resource="people"]').setAttribute('aria-expanded',String(!panel.hidden));renderWork()}
get('[data-work-close]').onclick=closeWork;
get('[data-work-balance]').onclick=()=>{game.autoWorkers=true;world.villagers.rebalance();renderWork()};
app.querySelectorAll<HTMLButtonElement>('[data-worker]').forEach(button=>button.onclick=()=>{
  if(game.changeWorkers(button.dataset.worker as WorkCategory,Number(button.dataset.delta) as -1|1)){world.villagers.rebalance();renderWork()}
});
document.addEventListener('pointerdown',e=>{if(!(e.target as Element).closest('#work-panel,[data-resource="people"]'))closeWork()});
function renderFood(){
  const panel=get('#food-details');panel.innerHTML=(['berry','wheat','fish'] as const).map(kind=>`<span>${resourceArt(kind)}<small>${kind==='berry'?'Çilek':kind==='wheat'?'Buğday':'Balık'}</small><b>${game.foods[kind]}</b></span>`).join('')+`<em>−${game.foodPerMinute} / dk · ${game.people} sakin</em>`;
}
function showFood(){
  const panel=get('#food-details'),rect=get('[data-resource="food"]').getBoundingClientRect();renderFood();panel.hidden=false;
  panel.style.left=`${Math.max(12,Math.min(innerWidth-panel.offsetWidth-12,rect.left+rect.width/2-panel.offsetWidth/2))}px`;panel.style.top=`${rect.bottom+14}px`;
}
const counters=new Map<string,{value:number;target:number;frame:number}>();
function animateCounter(id:string,target:number){
  const el=get(`[data-resource="${id}"] b`),state=counters.get(id);
  if(!state){el.textContent=String(target);counters.set(id,{value:target,target,frame:0});return}
  if(state.target===target)return;
  cancelAnimationFrame(state.frame);const from=state.value,previous=state.target,start=performance.now();state.target=target;
  el.dataset.change=target>previous?'up':'down';
  const tick=(now:number)=>{const t=Math.min(1,(now-start)/550);state.value=from+(target-from)*(1-(1-t)**3);el.textContent=String(Math.round(state.value));if(t<1)state.frame=requestAnimationFrame(tick);else{el.textContent=String(target);window.setTimeout(()=>{if(state.target===target)delete el.dataset.change},500)}};
  state.frame=requestAnimationFrame(tick);
}
function pulseHudResource(target:HTMLElement){
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const art=target.querySelector<HTMLElement>('.resource-art');if(!art)return;
  art.getAnimations().forEach(animation=>animation.cancel());
  const motion=art.animate([
    {transform:'translateY(0) scale(1)'},
    {transform:'translateY(-2px) scale(1.16)'},
    {transform:'translateY(0) scale(1)'}
  ],{duration:360,easing:'cubic-bezier(.2,.7,.3,1)'});
  void motion.finished.catch(()=>{});
}
function renderHud(){
  const stats=get('#stats');
  if(!stats.children.length)stats.innerHTML=[['wood','Odun'],['stone','Taş'],['food','Yiyecek'],['gold','Altın'],['people','Nüfus'],['happy','Refah']].map(([id,name])=>`<${id==='people'?'button type="button" aria-expanded="false" aria-controls="work-panel"':'div'} class="resource" data-resource="${id}">${resourceArt(id)}<div><small>${name}</small><b>0</b></div><em></em>${id==='people'?'<span class="population-track" aria-hidden="true"><i></i></span>':''}</${id==='people'?'button':'div'}>`).join('');
  const foodStat=get('[data-resource="food"]');
  foodStat.onmouseenter=showFood;foodStat.onmouseleave=()=>get('#food-details').hidden=true;foodStat.onfocus=showFood;foodStat.onblur=()=>get('#food-details').hidden=true;foodStat.tabIndex=0;foodStat.setAttribute('aria-describedby','food-details');
  get('[data-resource="people"]').onclick=toggleWork;
  const actual=world.villagers.assignedCounts();
  const details:Record<string,string>={wood:`${actual.wood} oduncu çalışıyor`,stone:`${actual.stone} madenci çalışıyor`,food:`Tüketim ${game.foodPerMinute} / dk`,gold:'5 altın · yeni el',people:game.nextMilestone?`Sonraki ödül · ${game.nextMilestone.population}`:'Tüm ödüller açık',happy:game.happy>=70?'Köylüler mutlu':game.happy>=40?'Köylüler sakin':'Köylüler huzursuz'};
  for(const id of ['wood','stone','food','gold','people','happy'] as const){
    animateCounter(id,id==='happy'?Math.round(game.happy):game[id]);
    get(`[data-resource="${id}"] em`).textContent=details[id];
  }
  hand.querySelectorAll<HTMLButtonElement>('[data-card]').forEach(b=>{const c=game.hand[Number(b.dataset.card)];b.disabled=!c||!affordable(c)});
  const next=game.nextMilestone,population=get('[data-resource="people"]');
  population.title=`Köylü görevleri${next?` · ${next.population} nüfusta ${next.name}`:' · Tüm gelişim ödülleri açıldı'}`;
  population.querySelector<HTMLElement>('.population-track i')!.style.width=`${next?Math.min(100,game.people/next.population*100):100}%`;
  const trade=get('#trade-open');
  const tradeState=game.harborId===undefined?'unbuilt':!game.merchantRouteOpen?'blocked':game.merchantPresent?'ready':'waiting';
  const tradeLabel=tradeState==='ready'?'Deniz ticareti · Gemi iskelende':tradeState==='blocked'?'Deniz ticareti · Gemi yolu kapalı':tradeState==='unbuilt'?'Deniz ticareti · İskele kur':'Deniz ticareti · Gemi bekleniyor';
  trade.dataset.state=tradeState;trade.title=tradeLabel;trade.setAttribute('aria-label',tradeLabel);
  get<HTMLButtonElement>('#reroll-toggle').disabled=handBusy||locked||game.gold<REROLL_COST;
  get('#reroll-toggle').classList.toggle('refreshing',handBusy);
  get('#reroll-toggle').title=game.gold<REROLL_COST?`Kart değiştirmek için ${REROLL_COST} altın gerekir`:'Bütün kartları 5 altına yenile';
  renderWork();renderStorage();if(!get('#food-details').hidden)renderFood();
}
const resourceNames:Record<string,string>={wood:'odun',stone:'taş',food:'yiyecek',gold:'altın'};
function illustratedText(text:string){
  const goods:Record<string,string>={'odun':'wood','taş':'stone','çilek':'berry','buğday':'wheat','balık':'fish','yiyecek':'food','altın':'gold','nüfus':'people','sakin':'people','refah':'happy'};
  return text.replace(/odun|taş|çilek|buğday|balık|yiyecek|altın|nüfus|sakin|refah/gi,word=>`<span class="illustrated-word">${resourceArt(goods[word.toLocaleLowerCase('tr-TR')])}${word}</span>`);
}
function cardFace(c:Card){
  const costs=Object.entries(c.cost);
  const category=c.id==='harbor'?'Liman':c.event?'Etkinlik':c.workers?'Üretim':'Yapı';
  return `<span class="card-top"><span class="costs">${costs.map(([key,n])=>`<span title="${n} ${resourceNames[key]}" aria-label="${n} ${resourceNames[key]}">${resourceArt(key)}<b>${n}</b></span>`).join('')}</span><span class="type">${category}</span></span>
    <span class="card-art"><img src="${thumbs[c.id]}" alt="" draggable="false"></span><strong>${c.name}</strong><span class="effect">${illustratedText(c.desc)}</span><small>${illustratedText(c.bonus)}</small>`;
}
function render(deal=false,withSound=false){
  renderHud();
  const key=game.hand.map(c=>c.id).join(',');
  if(!deal&&hand.dataset.cards===key)return;
  hand.dataset.cards=key;
  hand.innerHTML=game.hand.map((c,i)=>`<button class="card tone-${c.id}" title="${c.name} · ${c.desc} · ${c.bonus}" data-card="${i}" aria-pressed="false" ${!affordable(c)?'disabled':''}>${cardFace(c)}</button>`).join('');
  if(!deal)return;
  const sequence=++handMotion;handBusy=true;hand.setAttribute('aria-busy','true');renderHud();
  const animations=Array.from(hand.querySelectorAll<HTMLElement>('.card')).map((card,i)=>{
    if(withSound)window.setTimeout(()=>{if(sequence===handMotion)sound.play('hover',true)},i*200);
    const style=getComputedStyle(card),tilt=style.getPropertyValue('--tilt').trim()||'0deg',opacity=Number(style.opacity);
    return card.animate([{opacity:0,transform:`translateY(65px) rotate(-6deg) scale(.92)`},{opacity,transform:`translateY(0) rotate(${tilt}) scale(1)`}],{duration:480,delay:i*200,easing:'cubic-bezier(.18,.8,.26,1)',fill:'backwards'}).finished.catch(()=>{});
  });
  void Promise.all(animations).then(()=>{if(sequence===handMotion){handBusy=false;hand.setAttribute('aria-busy','false');renderHud()}});
}
async function refreshHand(){
  if(handBusy||dialog.open||locked||game.gold<REROLL_COST)return;
  drag.cancel();select(null);const sequence=++handMotion;handBusy=true;hand.setAttribute('aria-busy','true');renderHud();
  await Promise.all(Array.from(hand.querySelectorAll<HTMLElement>('.card')).map((card,i)=>card.animate([{opacity:Number(getComputedStyle(card).opacity)},{opacity:0,transform:'translateY(30px) rotate(4deg) scale(.95)'}],{duration:180,delay:i*35,easing:'ease-in',fill:'forwards'}).finished.catch(()=>{})));
  if(sequence!==handMotion)return;
  if(game.rerollHand())render(true,true);else render(true);
}

function showMilestones(){
  if(dialog.open||!game.milestoneQueue.length)return;
  const m=game.milestoneQueue.shift()!;
  const unlocked=cards.filter(c=>c.unlock===m.population||m.population===60&&c.id==='harbor'&&game.harborId===undefined);
  modal(`<div class="milestone-heading"><span class="milestone-seal">${icon('crest')}</span><small>YERLEŞİMİN GELİŞTİ · ${m.population} NÜFUS</small><h1>${m.name}</h1><p>${m.description}</p></div>
    <div class="milestone-reward">${icon('gold')} +${m.gold} altın <span>${m.population===60&&game.harborId===undefined?'İskele kartı eline eklendi':'Hazinene eklendi'}</span></div>
    ${unlocked.length?`<p class="unlock-caption">${m.population===60?'SANA HEDİYE':'KART HAVUZUNA EKLENDİ'}</p><div class="modal-cards">${unlocked.map((c,i)=>`<article class="card tone-${c.id}" style="--unlock-delay:${180+i*180}ms">${cardFace(c)}</article>`).join('')}</div>`:`<p>Tüccar alış kapasitesi: ziyaret başına ${game.tradeCapacity} ürün.</p>`}
    <div class="milestone-actions"><button data-close>Devam Et</button></div>`,'milestone');
  sound.play('reward');
}
function openProgress(){
  modal(`<small>YERLEŞİM YOLCULUĞU</small><h1>Köyden kıyı kasabasına</h1><div class="progress-list">${MILESTONES.map(m=>{
    const reached=game.reached.has(m.population),unlocks=cards.filter(c=>c.unlock===m.population||m.population===60&&c.id==='harbor');
    return `<section class="${reached?'reached':''}"><header><span class="progress-population">${resourceArt('people')} ${m.population}</span><b>${m.name}</b><span class="progress-check" aria-label="${reached?'Tamamlandı':'Kilitli'}">${reached?'✓':icon('full')}</span></header><div class="progress-rewards">${unlocks.length?unlocks.map(c=>`<span class="progress-unlock"><img src="${thumbs[c.id]}" alt=""><span>${c.name}</span></span>`).join(''):`<span class="progress-unlock">${icon('harbor')}<span>80 ürünlük ticaret</span></span>`}<span class="progress-gold">${resourceArt('gold')} +${m.gold}</span></div></section>`;
  }).join('')}</div><button data-close>Oyuna dön</button>`,'progress');
}
let tradeQuantity=5;let tradeMode:'sell'|'buy'='sell';
let tradeViewSignature='';
function tradeSnapshot(){
  const manifest=game.merchantManifest;
  return JSON.stringify([game.harborId,game.merchantPresent,game.merchantDeparting,game.merchantAge>=0,game.merchantRouteOpen,game.gold,game.totalStorageFree,tradeMode,tradeQuantity,TRADE_GOODS.map(item=>[game.tradeStock(item.id),manifest.demand[item.id],manifest.cargo[item.id],game.dockAmount(item.id),game.dockAmount(item.id,true),game.marketPressure[item.id]])]);
}
function shipCountdown(){return `${String(Math.floor(game.merchantCountdown/60)).padStart(2,'0')}:${String(game.merchantCountdown%60).padStart(2,'0')}`}

function openTrade(){
  tradeViewSignature=tradeSnapshot();
  const focused=dialog.contains(document.activeElement)?document.activeElement as HTMLElement:null;
  const focusAttribute=['data-exchange','data-prepare','data-trade-mode','data-quantity','data-close'].find(attribute=>focused?.hasAttribute(attribute));
  const focusValue=focusAttribute?focused?.getAttribute(focusAttribute):null;
  const continuing=dialog.open&&dialog.dataset.kind==='trade',basketScroll=continuing?dialog.querySelector('.trade-basket')?.scrollTop??0:0;
  dialog.dataset.tradeView=game.harborId===undefined?'harbor':'market';
  if(game.harborId===undefined){
    modal(`<div class="merchant-heading"><span>${icon('harbor')}</span><small>KIYIDAN UZAK LİMANLARA</small><h1>Bir ticaret iskelesi kur</h1><p>Gemi için kıyıya bir iskele kur.</p></div><div class="dock-blueprint"><img src="${thumbs.harbor}" alt="Ticaret iskelesi önizlemesi"><div><b>Ticaret İskelesi</b><p>${resourceArt('wood')} 12 &nbsp; ${resourceArt('stone')} 6</p></div></div><button data-dock-card>İskele kartını elime al</button><button data-close>Oyuna dön</button>`,'trade');
    dialog.querySelector('[data-dock-card]')!.addEventListener('click',()=>{
      const card=cards.find(c=>c.id==='harbor')!;if(!game.hand.includes(card))game.hand.push(card);render(true);void closeDialog();toast('Ticaret İskelesi kartı eline eklendi');
    });return;
  }
  const active=game.merchantPresent,blocked=!game.merchantRouteOpen,manifest=game.merchantManifest;
  modal(`<div class="trade-layout${continuing?'':' trade-enter'}">
    <aside class="trade-sidebar">
      <div class="trade-story"><div class="trade-ports"><span data-village-ledger>${icon('crest')}<small>Senin köyün</small></span><span class="trade-sea" aria-hidden="true">∿ ∿</span><span data-ship-ledger>${icon('harbor')}<small>Gezgin tüccar</small></span></div><small class="trade-eyebrow">YELKEN KOYU · TİCARET</small><h1>${blocked?'Su yolu kapalı':active?'Deniz ticareti':'Tüccar gemisi'}</h1><div class="trade-countdown" role="timer" aria-label="Gemi sayacı">${icon('harbor')} <b>${shipCountdown()}</b><small>${gameSpeed.value===0?'Oyun duraklatıldı':blocked?'Su yolunu aç':active?'Ayrılmasına':game.merchantDeparting?'Sonraki gemi':'Yanaşmasına'}</small></div><p class="trade-dock-summary">${icon('carry')} ${game.dockPending} yolda · ${TRADE_GOODS.reduce((sum,item)=>sum+game.dockAmount(item.id,true),0)} iskelede</p></div>
      <div class="trade-purse"><span data-gold-ledger>${resourceArt('gold')}<span><small>Hazinen</small><b>${game.gold}</b> altın</span></span><span class="trade-storage">${icon('carry')}<span><b>${game.totalStorageFree}</b> boş depo yeri</span></span></div>
      <div class="trade-market-note"><span class="trade-status${blocked?' is-blocked':active?' is-ready':''}"><i></i>${blocked?'Gemi yolu kapalı':active?'Gemi iskelende':game.merchantDeparting?'Gemi ayrılıyor':'Gemi yolda'}</span>${active?`<p>Bu ziyarette <b>${Object.values(game.merchantDemand).reduce((sum,count)=>sum+count,0)} ürün</b> daha satabilirsin.</p>`:''}</div>

    </aside>
    <section class="trade-main">
      <header class="trade-toolbar"><div class="trade-topline"><div><h2>${tradeMode==='sell'?'Ürün sat':'Ürün satın al'}</h2></div><span class="trade-visit-label">MEVSİMLİK PAZAR</span></div><div class="trade-controls"><div class="trade-choice" aria-label="Alışveriş yönü"><button data-trade-mode="sell" aria-pressed="${tradeMode==='sell'}">${icon('crest')} Sat</button><button data-trade-mode="buy" aria-pressed="${tradeMode==='buy'}">${icon('harbor')} Al</button></div><div class="trade-quantity" aria-label="İşlem miktarı"><span>Adet</span>${[1,5,10].map(n=>`<button data-quantity="${n}" aria-label="${n} adet" aria-pressed="${tradeQuantity===n}">${n}</button>`).join('')}</div></div></header>
      <div class="trade-basket trade-ledger" tabindex="0" aria-label="Tüccar talepleri ve ürünler">
        <h3>${game.merchantAge>=0?'Geminin talepleri':'Son gün gelecek gemi'}</h3>
        <table><thead><tr><th scope="col">Ürün</th><th scope="col">${icon('crest')} Sende</th><th scope="col">${icon('harbor')} Talep</th><th scope="col">${icon('carry')} Hazır</th><th scope="col">Eksik</th><th scope="col">${icon('carry')} ${game.merchantAge>=0?'Gemide':'Getirecek'}</th><th scope="col">${tradeMode==='sell'?'Sat':'Al'}</th></tr></thead><tbody>${TRADE_GOODS.map(item=>{
          const selling=tradeMode==='sell',quote=game.tradeQuote(item.id,tradeMode,tradeQuantity),amount=quote.count;
          const reserved=game.dockAmount(item.id),staged=game.dockAmount(item.id,true),needed=Math.max(0,manifest.demand[item.id]-reserved),preparable=needed>0&&game.tradeStock(item.id)>=needed?needed:0;
          const missing=Math.max(0,needed-game.tradeStock(item.id));
          const hint=!active?(blocked?'Yol kapalı':'Gemi yok'):selling?(game.merchantDemand[item.id]===0?'Talep yok':game.tradeStock(item.id)===0?'Stok yok':'Yük dolu'):!game.totalStorageFree?'Depo dolu':!game.merchantCargo[item.id]?'Stok yok':'Altın az';
          return `<tr><th scope="row"><span class="trade-good-name">${resourceArt(item.id)}<span>${item.name}<small>${quote.first} ${icon('gold')} / adet</small></span></span></th><td>${game.tradeStock(item.id)}</td><td>${manifest.demand[item.id]||'—'}</td><td><b>${staged}</b>${reserved>staged?`<small class="trade-in-transit">${reserved-staged} yolda</small>`:''}</td><td class="${missing?'trade-missing':'trade-prepared'}">${manifest.demand[item.id]?(missing||'✓'):'—'}</td><td>${manifest.cargo[item.id]}</td><td class="trade-row-actions"><div class="trade-action-group"><button data-exchange="${item.id}" aria-label="${item.name}: ${active&&amount>0?`${amount} adet ${selling?'sat':'al'}, ${quote.total} altın`:hint}" ${!active||amount<=0?'disabled':''}>${active&&amount>0?`<b>${amount} ${selling?'sat':'al'}</b><small>${selling?'+':'−'}${quote.total} ${icon('gold')}</small>`:hint}</button>${selling?`<button class="trade-prepare" data-prepare="${item.id}" aria-label="${item.name}: ${preparable} adet ürünün tamamını iskeleye taşı" ${preparable<=0||game.merchantDeparting?'disabled':''}>${icon('carry')} ${needed>0?needed:''} Teslim et</button>`:''}</div></td></tr>`;
        }).join('')}</tbody></table>
      </div>
      <footer class="trade-footer"><div class="trade-receipt" role="status" aria-live="polite">${active?'Fiyatlar alışverişle değişir.':'Taşı: iskeleye ayır. Gemi gelince otomatik satılır.'}</div><button data-close>Oyuna dön <span aria-hidden="true">↗</span></button></footer>
    </section>
  </div>`,'trade');
  dialog.querySelector('.trade-basket')!.scrollTop=basketScroll;
  dialog.querySelectorAll<HTMLButtonElement>('[data-trade-mode]').forEach(button=>button.onclick=()=>{tradeMode=button.dataset.tradeMode as 'sell'|'buy';openTrade();dialog.querySelector<HTMLButtonElement>(`[data-trade-mode="${tradeMode}"]`)!.focus({preventScroll:true})});
  dialog.querySelectorAll<HTMLButtonElement>('[data-quantity]').forEach(button=>button.onclick=()=>{tradeQuantity=Number(button.dataset.quantity);openTrade();dialog.querySelector<HTMLButtonElement>(`[data-quantity="${tradeQuantity}"]`)!.focus({preventScroll:true})});
  dialog.querySelectorAll<HTMLButtonElement>('[data-prepare]').forEach(button=>button.onclick=()=>{
    const good=button.dataset.prepare as TradeGood,count=game.prepareDock(good);
    if(count){renderHud();openTrade();dialog.querySelector('.trade-receipt')!.textContent=`${count} ${TRADE_GOODS.find(item=>item.id===good)!.name} iskele için ayrıldı.`}
  });
  dialog.querySelectorAll<HTMLButtonElement>('[data-exchange]').forEach(button=>button.onclick=()=>{
    const good=button.dataset.exchange as TradeGood,selling=tradeMode==='sell',quote=game.tradeQuote(good,tradeMode,tradeQuantity),count=selling?game.sell(good,tradeQuantity):game.buy(good,tradeQuantity);
    if(count){world.showTradeTransfer(selling);renderHud();renderStorage();sound.play('reward');openTrade();animateTrade(good,count,selling,quote.total);dialog.querySelector<HTMLButtonElement>(`[data-exchange="${good}"]:not(:disabled)`)?.focus({preventScroll:true})}
  });
  if(focusAttribute)dialog.querySelector<HTMLButtonElement>(`[${focusAttribute}="${CSS.escape(focusValue??'')}"]:not(:disabled)`)?.focus({preventScroll:true});
}
function animateTrade(good:TradeGood,count:number,selling:boolean,total:number){
  const origin=dialog.getBoundingClientRect(),village=dialog.querySelector('[data-village-ledger]')!.getBoundingClientRect(),ship=dialog.querySelector('[data-ship-ledger]')!.getBoundingClientRect(),wallet=dialog.querySelector('[data-gold-ledger]')!.getBoundingClientRect();
  const point=(rect:DOMRect)=>({x:rect.left+rect.width/2-origin.left-dialog.clientLeft+dialog.scrollLeft,y:rect.top+rect.height/2-origin.top-dialog.clientTop+dialog.scrollTop});
  const fly=(graphic:string,from:DOMRect,to:DOMRect,index:number)=>{
    if(dialog.querySelectorAll('.trade-flight').length>=24)return;
    const a=point(from),b=point(to),node=document.createElement('span');node.className='trade-flight';node.innerHTML=resourceArt(graphic)||icon(graphic);dialog.append(node);
    const animation=node.animate([{transform:`translate(${a.x}px,${a.y}px) scale(.6)`,opacity:0},{transform:`translate(${a.x}px,${a.y-14}px) scale(1)`,opacity:1,offset:.15},{transform:`translate(${(a.x+b.x)/2}px,${Math.max(18,Math.min(a.y,b.y)-36-index*3)}px) scale(1.1)`,opacity:1,offset:.5},{transform:`translate(${b.x}px,${b.y}px) scale(.45)`,opacity:0}],{duration:850,delay:index*95,easing:'cubic-bezier(.2,.65,.3,1)',fill:'both'});
    void animation.finished.catch(()=>{}).then(()=>node.remove());
  };
  for(let i=0;i<Math.min(4,count);i++){fly(good,selling?village:ship,selling?ship:village,i);fly('gold',selling?ship:wallet,selling?wallet:ship,i+2)}
  const receipt=dialog.querySelector('.trade-receipt')!;receipt.textContent=`${count} ${TRADE_GOODS.find(item=>item.id===good)!.name.toLocaleLowerCase('tr-TR')} ${selling?`satıldı · +${total} altın`:`alındı · −${total} altın`}`;
  receipt.animate([{opacity:0,transform:'translateY(5px)'},{opacity:1,transform:'translateY(0)'}],{duration:350});
}
window.addEventListener('merchant-blocked',()=>toast('Gemi yolu kapalı · İskele yönünde açık denize uzanan geniş bir geçit bırak'));
window.addEventListener('merchant-arrived',()=>toast('Ticaret gemisi yanaştı · Gemiye tıklayarak alışveriş yapabilirsin'));
world.onMerchant=()=>{if(!handBusy&&!locked)openTrade()};
get('[data-progress]').onclick=()=>{closeWork();openProgress()};
get('#reroll-toggle').onclick=()=>{void refreshHand()};
get('#tile-trade').onclick=openTrade;
get('#trade-open').onclick=openTrade;

let chestRewardEpoch=0;
const chestFlights=new Map<Animation,HTMLElement>();
world.onChestReward=async(loot:ChestLoot,at:Vector3)=>{
  const currentGame=game,epoch=chestRewardEpoch,requested=Math.max(0,Math.floor(loot.amount));
  const count=loot.good==='gold'?requested:Math.min(requested,game.totalStorageFree);
  if(!count)return 0;
  const hudKind=['berry','wheat','fish'].includes(loot.good)?'food':loot.good;
  const target=get(`[data-resource="${hudKind}"]`),rect=target.getBoundingClientRect(),from=world.projectToScreen(at);
  const destination={x:rect.left+rect.width/2,y:rect.top+rect.height/2};
  const pieces=Math.min(5,count),reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  await Promise.all(Array.from({length:pieces},(_,index)=>{
    const spark=document.createElement('span');spark.className='chest-reward-flight';spark.setAttribute('aria-hidden','true');spark.innerHTML=resourceArt(loot.good);document.body.append(spark);
    const side=(index-(pieces-1)/2)*14;
    const animation=spark.animate([
      {transform:`translate(${from.x+side}px,${from.y}px) scale(.35)`,opacity:0},
      {transform:`translate(${from.x+side*1.3}px,${from.y-38-index*4}px) scale(1)`,opacity:1,offset:.2},
      {transform:`translate(${from.x+(destination.x-from.x)*.55+side}px,${Math.min(from.y,destination.y)-28}px) scale(.9)`,opacity:1,offset:.65},
      {transform:`translate(${destination.x}px,${destination.y}px) scale(.35)`,opacity:0}
    ],{duration:reduced?100:1050,delay:reduced?0:index*65,easing:'cubic-bezier(.25,.65,.3,1)',fill:'both'});
    chestFlights.set(animation,spark);
    return animation.finished.catch(()=>{}).then(()=>{chestFlights.delete(animation);spark.remove()});
  }));
  if(currentGame!==game||epoch!==chestRewardEpoch)return 0;
  const accepted=game.receiveDiscoveryLoot(loot.good,count);
  if(accepted){
    renderHud();renderStorage();sound.play('reward');
    pulseHudResource(target);
    const names:Record<string,string>={wood:'odun',stone:'taş',berry:'çilek',wheat:'buğday',fish:'balık',gold:'altın'};
    toast(`Sandıktan +${accepted} ${names[loot.good]}`);
  }
  return accepted;
};

let deliveryHudFrame=0;
const deliveryPulses=new Map<Resource,number>();
world.onDelivery=(source,store,resource,amount)=>{
  const accepted=game.deliver(source,store,resource,amount);if(!accepted)return 0;
  const deliveryPoint=position(store);sound.delivery(new Vector3(deliveryPoint.x,.3,deliveryPoint.z));
  if(!deliveryHudFrame)deliveryHudFrame=requestAnimationFrame(()=>{deliveryHudFrame=0;renderHud()});
  const now=performance.now();if(now-(deliveryPulses.get(resource)??-999)<140)return accepted;deliveryPulses.set(resource,now);
  if(document.querySelectorAll('.delivery-spark').length>=24)return accepted;
  const target=get(`[data-resource="${resource}"]`),rect=target.getBoundingClientRect(),from=world.screenPoint(store,.6);
  const spark=document.createElement('div');spark.className=`delivery-spark ${resource}`;spark.innerHTML=`${icon(resource==='food'?(game.board.get(source)==='fisher'?'fish':game.board.get(source)==='farm'?'wheat':'berry'):resource)}<b>+${accepted}</b>`;document.body.append(spark);
  const endX=rect.left+rect.width/2,endY=rect.top+rect.height/2;
  const motion=spark.animate([{transform:`translate(${from.x}px,${from.y}px) scale(.7)`,opacity:0},{transform:`translate(${from.x}px,${from.y-25}px) scale(1)`,opacity:1,offset:.2},{transform:`translate(${endX}px,${endY}px) scale(.5)`,opacity:0}],{duration:950,easing:'cubic-bezier(.3,.65,.3,1)'});
  void motion.finished.catch(()=>{}).then(()=>spark.remove());
  pulseHudResource(target);
  return accepted;
};
world.onInspect=(id,x,y,bounds)=>{
  const tooltip=get('#tile-tooltip');
  if(id<0||!bounds||selected||dialog.open){tooltip.hidden=true;return}
  const kind=game.board.get(id),card=cards.find(c=>c.id===kind),product=game.productAt(id);
  const lines:string[]=[];
  if(id===CENTER)lines.push('Merkez deposu',`${game.storageUsed(id)} / ${game.storageCapacity(id)} dolu`);
  else if(kind==='store')lines.push(`${game.storageUsed(id)} / ${game.storageCapacity(id)} dolu`,'Tıkla · kapasiteyi yükselt');
  else if(product){lines.push(`+${product.amount} ${product.resource==='stone'?'taş':product.resource==='wood'?'odun':product.resource==='food'?(kind==='fisher'?'balık':kind==='farm'?'buğday':'çilek'):'refah'} / teslimat`,`${world.villagers.assignedTo(id)} / ${product.capacity} çalışan`,...(['berry','farm'].includes(kind??'')?[`Toplama: ${harvestSeconds(kind==='farm'?'farm':'berry',product.amount).toLocaleString('tr-TR')} sn / çalışan · yol hariç`]:[]),'Ürünler depoya taşınır');}
  else if(kind==='house'||kind==='manor')lines.push(`${game.residents.filter(r=>r.home===id).length} sakinin evi`,'Sakinler yakındaki işlere yürüyerek gider');
  else if(kind==='harbor')lines.push(!game.merchantRouteOpen?'Su yolu kapalı · İskele yönünde geniş bir geçit aç':game.merchantPresent?'Tüccar limanda':`Gemi ${game.merchantCountdown} saniye sonra`,`${game.tradeCapacity-game.tradeSold} ürünlük alış kapasitesi`,'Limanı seçerek ticaret yap');
  else if(kind==='lumber')lines.push('Komşu ormanlara +2 odun','Oduncular komşu ormanlarda çalışır');
  else if(card)lines.push(card.desc,card.bonus);
  if(game.hasTorches(id))lines.push('Meşaleler · yakıt gerektirmez',game.torchLit(id)?'Meşaleler yanıyor · gece üretimi normal':'Gece otomatik yanar');
  if(product&&game.nightWorkRate(id)<1)lines.push('Karanlık · gece çalışma hızı %65');
  const graphic=id===CENTER?'crest':({harbor:'harbor',forest:'wood',stone:'stone',berry:'berry',farm:'wheat',fisher:'fish',store:'carry',house:'people',manor:'people',lumber:'wood',garden:'garden'} as Record<string,string>)[kind??'']??'garden';
  tooltip.querySelector('strong')!.innerHTML=`${icon(graphic)}<span>${id===CENTER?'Krallık merkezi':card?.name??'Yerleşim'}</span>`;
  tooltip.querySelector('div')!.innerHTML=lines.map(line=>`<span>${line}</span>`).join('');tooltip.hidden=false;
  const width=tooltip.offsetWidth,height=tooltip.offsetHeight,pad=14;
  let left=x+26,top=y+22;
  const overlap=()=>left<bounds.right+8&&left+width>bounds.left-8&&top<bounds.bottom+8&&top+height>bounds.top-8;
  if(overlap()){left=bounds.right+pad;top=y-height/2}
  if(left+width>innerWidth-pad){left=bounds.left-width-pad;top=y-height/2}
  if(left<pad){left=Math.max(pad,Math.min(innerWidth-width-pad,x-width/2));top=bounds.top-height-pad;if(top<pad)top=bounds.bottom+pad}
  tooltip.style.left=`${Math.max(pad,Math.min(innerWidth-width-pad,left))}px`;
  tooltip.style.top=`${Math.max(pad,Math.min(innerHeight-height-pad,top))}px`;
};
window.setInterval(()=>{
  renderHud();
  if(dialog.open&&dialog.dataset.kind==='trade'&&dialog.dataset.tradeView==='market'){
    if(tradeSnapshot()!==tradeViewSignature)openTrade();
    const countdown=dialog.querySelector('.trade-countdown b');if(countdown)countdown.textContent=shipCountdown();
  }
  showMilestones();
},200);
dialog.addEventListener('close',()=>{game.paused=false;window.setTimeout(showMilestones,0)});
let modalMotion=0;
async function closeDialog(){
  if(!dialog.open||dialog.classList.contains('closing'))return;
  if(dialog.dataset.kind!=='milestone'){dialog.close();return}
  const sequence=++modalMotion;dialog.classList.add('closing');
  await dialog.animate([{opacity:1,transform:'translateY(0) scale(1)'},{opacity:0,transform:'translateY(18px) scale(.96)'}],{duration:260,easing:'cubic-bezier(.4,0,1,1)',fill:'forwards'}).finished.catch(()=>{});
  if(sequence===modalMotion){dialog.close();dialog.classList.remove('closing');dialog.getAnimations().forEach(a=>a.cancel())}
}
dialog.addEventListener('cancel',e=>{if(dialog.dataset.kind==='milestone'){e.preventDefault();void closeDialog()}});
function modal(html:string,kind='standard') {
  modalMotion++;dialog.classList.remove('closing');dialog.getAnimations({subtree:true}).forEach(a=>a.cancel());
  closeWork();game.paused=kind!=='trade';dialog.dataset.kind=kind;
  drag.cancel();select(null);dialog.innerHTML=html;if(!dialog.open)dialog.showModal();
  const audioButton=dialog.querySelector<HTMLButtonElement>('[data-audio]');
  if(audioButton)audioButton.onclick=()=>{sound.toggle();audioButton.textContent=sound.muted?'Ses kapalı':'Ses açık'};
  dialog.querySelectorAll<HTMLInputElement>('input[data-level]').forEach(input=>{
    input.oninput=()=>sound.set(input.dataset.level as 'master'|'sfx'|'ambience',Number(input.value)/100);
  });
  dialog.querySelector('[data-close]')?.addEventListener('click',()=>{void closeDialog()});
  dialog.querySelector('[data-new]')?.addEventListener('click',()=>{dialog.close();reset()});
}
function reset(){
  chestRewardEpoch++;for(const [animation,node] of chestFlights){animation.cancel();node.remove()}chestFlights.clear();
  cancelAnimationFrame(deliveryHudFrame);deliveryHudFrame=0;deliveryPulses.clear();
  handMotion++;handBusy=false;hand.removeAttribute('data-cards');hand.getAnimations({subtree:true}).forEach(a=>a.cancel());
  clearTimeout(settleTimer);clearTimeout(toastTimer);log.classList.remove('visible');
  document.querySelectorAll('.delivery-spark').forEach(el=>el.remove());get('#food-details').hidden=true;get('#work-panel').hidden=true;closeWork();
  drag.cancel();sound.cancel();sound.resetAmbience();for(const state of counters.values())cancelAnimationFrame(state.frame);counters.clear();game=createDemoGame();selected=null;locked=false;
  world.reset();world.sync(game.board);world.bindGame(game);select(null);render(true);
}
get('#restart').onclick=()=>modal('<h1>Yeni krallık?</h1><p>Mevcut koşu sona erecek.</p><button data-new>Yeniden başla</button><button data-close>Oyuna dön</button>');
get('#help').onclick=()=>modal(`<small>YELKEN KOYU</small><h1>Yaşayan bir köy</h1>
 <p>Sol alttaki Köy Defteri’nden köylülerin portrelerini, isimlerini, dileklerini ve kıyı keşiflerini görebilirsin. Dilekleri gerçekleştirmek refah kazandırır. Denizde beliren sandıklara tıklayarak kaynaklar ve nadiren altın toplayabilirsin.</p><p>Kartların üstündeki Kartları yenile düğmesi, bütün eli 5 altın karşılığında animasyonla yeniler. Nüfus eşikleri 10, 24, 40, 60 ve 100: yeni kartlar ve altın ödülleri açılır. Deniz ticareti düğmesinden iskele kartını alıp kıyıya kurabilirsin. Her mevsimin 3. günü gemi gelir; gemiye tıklayıp alış ve satış yapabilirsin. Kartların üstünde odun, taş, yiyecek ve altın maliyetleri gösterilir.</p>
 <p>Tur veya süre sınırı yok. Kartları kıyıdaki boş altıgenlere bırak. Her ev iki, büyük ev dört yeni sakin getirir. Boşta kalanlar dolaşır; uygun iş varsa yürüyerek çalışmaya giderler.</p>
 <p>Sakinler ormanda ağaç keser, çilek ve tarladan ürün toplar. Ağaçlar ve meyveler yeniden büyür. Depolar adanın her yerinden ürün kabul eder. Yalnızca depoya ulaşan ürünler kaynaklarına eklenir. Her sakin dakikada 4 yiyecek tüketir; yiyecek göstergesinin üzerine gelerek stokları görebilirsin.</p>
 <p>Üstteki nüfus göstergesine tıklayarak köylüleri yönetebilirsin. Her sayı bir kişidir. + bir köylüyü o işe geçirir, − boşta bırakır; boşta kimse yoksa + başka işten birini aktarır. Otomatik dağıt düğmesi açık işlere köylüleri kendisi yerleştirir. Limanı seçerek ticaret ekranını açabilirsin. Balıkçı kulübesini kıyıya bakacak şekilde yerleştir.</p>
 <p>Depoyu seçerek kapasitesini görebilir, odunla yükseltebilirsin. Altıgenin üzerine gelince bilgisi farenin yanında görünür. Tıklayarak döndürebilir ya da yıkabilirsin; yıkım kaynak vermez.</p>
 <p>Çitlerdeki meşaleler geceleri ücretsiz yanar; odun tüketmez. Aydınlanan işyerleri normal hızda, karanlıktakiler %65 hızda çalışır.</p>\n <p class="controls">Sağ tuş · 360° döndür &nbsp; Orta tuş + sürükle · haritayı kaydır<br>Tekerlek · yakınlaş &nbsp; Home · ortala &nbsp; H · kaynaklara +1.000<br>Kart / yapı seçiliyken tekerlek veya R · döndür<br>Shift + R · ters yön &nbsp; Esc · seçimi bırak</p><button data-close>Oyuna dön</button>`);
document.addEventListener('keydown',e=>{
  if(e.key.toLowerCase()==='h'&&!e.repeat&&!e.ctrlKey&&!e.altKey&&!e.metaKey&&!dialog.open&&!(e.target instanceof Element&&e.target.closest('input,textarea,select,[contenteditable]'))){e.preventDefault();game.grantResources();renderHud();toast('Odun, taş, çilek, buğday, balık ve altın +1.000')}
  if(e.key==='Escape'&&!dialog.open){closeWork();drag.cancel();select(null)}});
window.addEventListener('cozy-change',event=>{renderHud();toast((event as CustomEvent).detail)});
setupSettings(world,sound,modal,dialog);
reset();


