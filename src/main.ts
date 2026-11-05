import './style.css';
import {Vector3} from 'three';
import {CENTER,position} from './hex';
import {harvestSeconds,cards,MILESTONES,REROLL_COST,TRADE_GOODS,WORK_CATEGORIES,type WorkCategory,type Resource,type Card,type TradeGood} from './game';
import {World} from './world';
import {CardDrag} from './drag';
import {TableSound} from './sound';
import {setupSettings} from './settings';
import {createDemoGame} from './demo';

import {icon} from './icons';
const app=document.querySelector<HTMLElement>('#app')!;
app.addEventListener('dragstart',event=>event.preventDefault());
app.addEventListener('selectstart',event=>{if(!(event.target instanceof Element&&event.target.closest('input,textarea')))event.preventDefault()});
app.addEventListener('contextmenu',event=>event.preventDefault());
app.innerHTML=`<div id="world" aria-label="Kartlarla genişleyen altıgen kıyı adası"></div>
 <div class="vignette"></div>
 <div class="kingdom-hud" aria-label="Krallığın kaynakları"><div id="stats" aria-label="Krallığın kaynakları"></div></div>
 <div id="log" role="status"></div><div id="placement" aria-live="polite"></div>
 <button id="event-target" hidden>Anlık etkiyi burada kullan</button><div class="hand-wrap"><div class="hand-label"><button id="reroll-toggle" class="card-exchange" title="Bütün kartları 5 altına yenile"><span class="exchange-icon">${icon('reset')}</span><span>Kartları yenile</span><small>${icon('gold')} ${REROLL_COST}</small></button></div><div class="hand-dock"><div id="hand"></div></div></div>
 <div class="tools"><button id="help" aria-label="Oyun rehberi" title="Oyun rehberi">${icon('help')}</button><button id="settings" aria-label="Ayarlar" aria-haspopup="dialog" title="Ayarlar">${icon('settings')}</button><button id="restart" title="Yeni krallık" aria-label="Yeni krallık">${icon('reset')}</button></div>
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
let editedTile=-1;
let handBusy=false,handMotion=0;

function affordable(c:Card) { return game.canAfford(c); }
function select(c:Card|null,carrying=false) {
  if(!c)pendingPlacement=null;
  selected=c;get('#event-target').hidden=!c?.event;world.setSelection(c,carrying);
  hand.classList.toggle('choosing',!!c);
  hand.querySelectorAll<HTMLButtonElement>('[data-card]').forEach(b=>{
    const active=!!c&&game.hand[Number(b.dataset.card)]===c;
    b.classList.toggle('selected',active);b.setAttribute('aria-pressed',String(active));
  });
}
function label(text:string) {
  placement.textContent=text;placement.hidden=!text;
}
world.valid=i=>!!selected&&i>=0&&game.valid(selected,i);
world.onHover=i=>{
  if(!selected||i<0){label('');return}
  if(!world.valid(i)){label(selected.event?'Mevcut karaya bırak':game.wouldSealFishery(i)?'Liman ve balıkçı kıyısı açık kalmalı':'Yalnızca kıyıdaki boş bir altıgene bırak');placement.dataset.valid='false';return}
  placement.dataset.valid='true';
  if(selected.event){label(selected.desc);return}
  const p=game.preview(selected,i)!;
  const effects=[p.stone&&`+${p.stone} taş / teslimat`,p.wood&&`+${p.wood} odun / teslimat`,p.food&&`+${p.food} yiyecek / teslimat`,p.happy&&`+${p.happy} refah / teslimat`,p.people&&`+${p.people} nüfus`].filter(Boolean);
  const adjacentBonus=p.localBonus||p.neighbors.length>0;
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
  sound.play('hover',true);select(null);world.sync(game.board,card.event?-1:i,rotation);
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
  start:i=>select(game.hand[i],true),
  move:(x,y)=>world.valid(dragPosition(x,y)),
  drop:(x,y)=>commit(dragPosition(x,y)),
  cancel:()=>select(null),
  tap:i=>{const c=game.hand[i];select(selected===c?null:c)},
});
const workNames:Record<WorkCategory,string>={stone:'Taş çıkarma',wood:'Odunculuk',berry:'Çilek toplama',farm:'Buğday hasadı',fish:'Balıkçılık',garden:'Bahçe bakımı'};
const workIcons:Record<WorkCategory,string>={stone:'stone',wood:'wood',berry:'berry',farm:'wheat',fish:'fish',garden:'garden'};
get('#work-rows').innerHTML=WORK_CATEGORIES.map(category=>`<div class="work-row" data-work="${category}"><span class="work-symbol">${icon(workIcons[category])}</span><div class="work-description"><b>${workNames[category]}</b><small></small></div><div class="worker-stepper" role="group" aria-label="${workNames[category]} işçi sayısı"><button data-worker="${category}" data-delta="-1" aria-label="${workNames[category]} görevinden bir kişi çıkar">−</button><output aria-label="${workNames[category]} için ayrılan kişi">0</output><button data-worker="${category}" data-delta="1" aria-label="${workNames[category]} görevine bir kişi ekle">+</button></div></div>`).join('');
function renderWork(){
  const counts=world.villagers.assignedCounts(),targets=game.workTargets();
  const allocated=Object.values(targets).reduce((a,b)=>a+b,0),free=game.people-allocated;
  get('#work-summary').innerHTML=`<span><b>${game.people}</b> köylü</span><span class="free-workers"><b>${free}</b> boşta</span>`;
  get('#work-mode-label').textContent=game.autoWorkers?'Otomatik dağılım':'Elle dağılım';
  get<HTMLButtonElement>('[data-work-balance]').disabled=game.autoWorkers;
  get('#work-hint').textContent=WORK_CATEGORIES.some(c=>game.workCapacity(c))?'＋ Bir köylü ata · − Görevden çıkar. Boşta kimse yoksa + başka işten aktarır.':'Önce bir orman, bahçe veya üretim alanı kur.';
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
  const panel=get('#food-details');panel.innerHTML=(['berry','wheat','fish'] as const).map(kind=>`<span>${icon(kind)}<small>${kind==='berry'?'Çilek':kind==='wheat'?'Buğday':'Balık'}</small><b>${game.foods[kind]}</b></span>`).join('')+`<em>−${game.foodPerMinute} / dk · ${game.people} sakin</em>`;
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
function renderHud(){
  const stats=get('#stats');
  if(!stats.children.length)stats.innerHTML=[['wood','Odun'],['stone','Taş'],['food','Yiyecek'],['gold','Altın'],['people','Nüfus'],['happy','Refah']].map(([id,name])=>`<${id==='people'?'button type="button" aria-expanded="false" aria-controls="work-panel"':'div'} class="resource" data-resource="${id}">${icon(id)}<div><small>${name}</small><b>0</b></div><em></em>${id==='people'?'<span class="population-track" aria-hidden="true"><i></i></span>':''}</${id==='people'?'button':'div'}>`).join('');
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
  get<HTMLButtonElement>('#reroll-toggle').disabled=handBusy||locked||game.gold<REROLL_COST;
  get('#reroll-toggle').classList.toggle('refreshing',handBusy);
  get('#reroll-toggle').title=game.gold<REROLL_COST?`Kart değiştirmek için ${REROLL_COST} altın gerekir`:'Bütün kartları 5 altına yenile';
  renderWork();renderStorage();if(!get('#food-details').hidden)renderFood();
}
const resourceNames:Record<string,string>={wood:'odun',stone:'taş',food:'yiyecek',gold:'altın'};
function cardFace(c:Card){
  const costs=Object.entries(c.cost);
  const category=c.id==='harbor'?'Liman':c.event?'Etkinlik':c.workers?'Üretim':'Yapı';
  return `<span class="card-top"><span class="costs">${costs.map(([key,n])=>`<span title="${n} ${resourceNames[key]}" aria-label="${n} ${resourceNames[key]}">${icon(key)}<b>${n}</b></span>`).join('')}</span><span class="type">${category}</span></span>
    <span class="card-art"><img src="${thumbs[c.id]}" alt="" draggable="false"></span><strong>${c.name}</strong><span class="rule"></span><span class="effect">${c.desc}</span><small>${c.bonus}</small>`;
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
  const unlocked=cards.filter(c=>c.unlock===m.population);
  modal(`<div class="milestone-heading"><span class="milestone-seal">${icon('crest')}</span><small>YERLEŞİMİN GELİŞTİ · ${m.population} NÜFUS</small><h1>${m.name}</h1><p>${m.description}</p></div>
    <div class="milestone-reward">${icon('gold')} +${m.gold} altın <span>${m.population===60?'Liman kartı eline eklendi':'Hazinene eklendi'}</span></div>
    ${unlocked.length?`<p class="unlock-caption">${m.population===60?'SANA HEDİYE':'KART HAVUZUNA EKLENDİ'}</p><div class="modal-cards">${unlocked.map((c,i)=>`<article class="card tone-${c.id}" style="--unlock-delay:${180+i*180}ms">${cardFace(c)}</article>`).join('')}</div>`:'<p>Tüccar kapasitesi: ziyaret başına 40 ürün.</p>'}
    <div class="milestone-actions"><button data-close>Devam Et</button></div>`,'milestone');
  sound.play('reward');
}
function openProgress(){
  modal(`<small>YERLEŞİM YOLCULUĞU</small><h1>Köyden kıyı kasabasına</h1><div class="progress-list">${MILESTONES.map(m=>`<section class="${game.reached.has(m.population)?'reached':''}"><b>${m.population} nüfus · ${m.name}</b><span>${m.description}</span><small>${cards.filter(c=>c.unlock===m.population).map(c=>c.name).join(' · ')||'Gelişmiş ticaret'} · +${m.gold} altın</small></section>`).join('')}</div><button data-close>Oyuna dön</button>`,'progress');
}
function openTrade(){
  if(game.harborId===undefined){
    modal(`<small>DENİZ TİCARETİ</small><h1>Limanını kur</h1><p>60 nüfusta Liman kartı hediye edilir. Kıyıya ${icon('wood')} 24 odun ve ${icon('stone')} 16 taş karşılığında kurabilirsin.</p><div class="modal-cards"><article class="card tone-harbor">${cardFace(cards.find(c=>c.id==='harbor')!)}</article></div><p>Tüccar gemisi 2 dakikada bir gelir ve 40 saniye bekler. Fazla ürünlerini satarak altın kazanırsın.</p><button data-close>Oyuna dön</button>`,'trade');return;
  }
  modal(`<small>LİMAN · DENİZ TİCARETİ</small><h1>${game.merchantPresent?'Tüccar limanda':'Bir sonraki gemi yolda'}</h1><p>${game.merchantPresent?`Kalan süre ${game.merchantCountdown} saniye · ${game.tradeCapacity-game.tradeSold} ürün daha alabilir.`:`Gemi ${game.merchantCountdown} saniye sonra gelecek.`} Pencere açıkken oyun durur.</p><p class="milestone-reward">${icon('gold')} ${game.gold} altın</p><div class="trade-list">${TRADE_GOODS.map(item=>`<div>${icon(item.id)}<span><b>${item.name}</b><small>${game.tradeStock(item.id)} stok · tanesi ${item.price} altın</small></span><button data-sell="${item.id}" ${!game.merchantPresent||game.tradeStock(item.id)<1||game.tradeSold>=game.tradeCapacity?'disabled':''}>${Math.min(5,game.tradeStock(item.id),game.tradeCapacity-game.tradeSold)} adet sat</button></div>`).join('')}</div><p>Satış stoklarından düşer. Köylülerin yiyeceğini ve inşaat malzemelerini ayırmayı unutma.</p><button data-close>Oyuna dön</button>`,'trade');
  dialog.querySelectorAll<HTMLButtonElement>('[data-sell]').forEach(button=>button.onclick=()=>{if(game.sell(button.dataset.sell as TradeGood)){render();renderStorage();sound.play('reward');openTrade()}});
}
get('[data-progress]').onclick=()=>{closeWork();openProgress()};
get('#reroll-toggle').onclick=()=>{void refreshHand()};
get('#tile-trade').onclick=openTrade;

let deliveryHudFrame=0;
const deliveryPulses=new Map<Resource,number>();
world.onDelivery=(source,store,resource,amount)=>{
  const accepted=game.deliver(source,store,resource,amount);if(!accepted)return 0;
  if(!deliveryHudFrame)deliveryHudFrame=requestAnimationFrame(()=>{deliveryHudFrame=0;renderHud()});
  const now=performance.now();if(now-(deliveryPulses.get(resource)??-999)<140)return accepted;deliveryPulses.set(resource,now);
  sound.play('reward');if(document.querySelectorAll('.delivery-spark').length>=24)return accepted;
  const target=get(`[data-resource="${resource}"]`),rect=target.getBoundingClientRect(),from=world.screenPoint(store,.6);
  const spark=document.createElement('div');spark.className=`delivery-spark ${resource}`;spark.innerHTML=`${icon(resource==='food'?(game.board.get(source)==='fisher'?'fish':game.board.get(source)==='farm'?'wheat':'berry'):resource)}<b>+${accepted}</b>`;document.body.append(spark);
  const endX=rect.left+rect.width/2,endY=rect.top+rect.height/2;
  const motion=spark.animate([{transform:`translate(${from.x}px,${from.y}px) scale(.7)`,opacity:0},{transform:`translate(${from.x}px,${from.y-25}px) scale(1)`,opacity:1,offset:.2},{transform:`translate(${endX}px,${endY}px) scale(.5)`,opacity:0}],{duration:950,easing:'cubic-bezier(.3,.65,.3,1)'});
  void motion.finished.catch(()=>{}).then(()=>spark.remove());
  target.animate([{transform:'scale(1)',backgroundColor:'transparent'},{transform:'scale(1.10)',backgroundColor:'#d8e6b4'},{transform:'scale(1)',backgroundColor:'transparent'}],{duration:650});
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
  else if(kind==='harbor')lines.push(game.merchantPresent?'Tüccar limanda':`Gemi ${game.merchantCountdown} saniye sonra`,`${game.tradeCapacity-game.tradeSold} ürünlük alış kapasitesi`,'Limanı seçerek ticaret yap');
  else if(kind==='lumber')lines.push('Komşu ormanlara +2 odun','Oduncular komşu ormanlarda çalışır');
  else if(card)lines.push(card.desc,card.bonus);
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
window.setInterval(()=>{renderHud();showMilestones()},200);
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
  closeWork();game.paused=true;dialog.dataset.kind=kind;
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
  cancelAnimationFrame(deliveryHudFrame);deliveryHudFrame=0;deliveryPulses.clear();
  handMotion++;handBusy=false;hand.removeAttribute('data-cards');hand.getAnimations({subtree:true}).forEach(a=>a.cancel());
  clearTimeout(settleTimer);clearTimeout(toastTimer);log.classList.remove('visible');
  document.querySelectorAll('.delivery-spark').forEach(el=>el.remove());get('#food-details').hidden=true;get('#work-panel').hidden=true;closeWork();
  drag.cancel();sound.cancel();sound.resetAmbience();for(const state of counters.values())cancelAnimationFrame(state.frame);counters.clear();game=createDemoGame();selected=null;locked=false;
  world.reset();world.sync(game.board);world.bindGame(game);select(null);render(true);
}
get('#restart').onclick=()=>modal('<h1>Yeni krallık?</h1><p>Mevcut koşu sona erecek.</p><button data-new>Yeniden başla</button><button data-close>Oyuna dön</button>');
get('#help').onclick=()=>modal(`<small>YELKEN KOYU</small><h1>Yaşayan bir köy</h1>
 <p>Kartların üstündeki Kartları yenile düğmesi, bütün eli 5 altın karşılığında animasyonla yeniler. Nüfus eşikleri 10, 24, 40, 60 ve 100: yeni kartlar ve altın ödülleri açılır. 60 nüfusta Liman kartı hediye edilir; limanı kurup gelen tüccara ürün satarak altın kazanırsın. Kartların üstünde odun, taş, yiyecek ve altın maliyetleri gösterilir.</p>
 <p>Tur veya süre sınırı yok. Kartları kıyıdaki boş altıgenlere bırak. Her ev iki, büyük ev dört yeni sakin getirir. Boşta kalanlar dolaşır; uygun iş varsa yürüyerek çalışmaya giderler.</p>
 <p>Sakinler ormanda ağaç keser, çilek ve tarladan ürün toplar. Ağaçlar ve meyveler yeniden büyür. Depolar adanın her yerinden ürün kabul eder. Yalnızca depoya ulaşan ürünler kaynaklarına eklenir. Her sakin dakikada 2 yiyecek tüketir; yiyecek göstergesinin üzerine gelerek stokları görebilirsin.</p>
 <p>Üstteki nüfus göstergesine tıklayarak köylüleri yönetebilirsin. Her sayı bir kişidir. + bir köylüyü o işe geçirir, − boşta bırakır; boşta kimse yoksa + başka işten birini aktarır. Otomatik dağıt düğmesi açık işlere köylüleri kendisi yerleştirir. Limanı seçerek ticaret ekranını açabilirsin. Balıkçı kulübesini kıyıya bakacak şekilde yerleştir.</p>
 <p>Depoyu seçerek kapasitesini görebilir, odunla yükseltebilirsin. Altıgenin üzerine gelince bilgisi farenin yanında görünür. Tıklayarak döndürebilir ya da yıkabilirsin; yıkım kaynak vermez.</p>
 <p class="controls">Sağ tuş · 360° döndür &nbsp; Orta tuş · merkeze dön<br>Tekerlek · yakınlaş &nbsp; Home · ortala &nbsp; H · kaynaklara +1.000<br>Kart / yapı seçiliyken tekerlek veya R · döndür<br>Shift + R · ters yön &nbsp; Esc · seçimi bırak</p><button data-close>Oyuna dön</button>`);
document.addEventListener('keydown',e=>{
  if(e.key.toLowerCase()==='h'&&!e.repeat&&!e.ctrlKey&&!e.altKey&&!e.metaKey&&!dialog.open&&!(e.target instanceof Element&&e.target.closest('input,textarea,select,[contenteditable]'))){e.preventDefault();game.grantResources();renderHud();toast('Odun, taş, çilek, buğday, balık ve altın +1.000')}
  if(e.key==='Escape'&&!dialog.open){closeWork();drag.cancel();select(null)}});
setupSettings(world,sound,modal,dialog);
reset();


