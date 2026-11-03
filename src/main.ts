import './style.css';
import {CENTER} from './hex';
import {Game,cards,WORK_CATEGORIES,type WorkCategory,type Resource,type Card} from './game';
import {World} from './world';
import {CardDrag} from './drag';
import {TableSound} from './sound';

import {icon} from './icons';
const app=document.querySelector<HTMLElement>('#app')!;
app.innerHTML=`<div id="world" aria-label="Kartlarla genişleyen altıgen kıyı adası"></div>
 <div class="vignette"></div>
 <div class="kingdom-hud" aria-label="Krallığın kaynakları"><div id="stats" aria-label="Krallığın kaynakları"></div></div>
 <div id="log" role="status"></div><div id="placement" aria-live="polite"></div>
 <button id="event-target" hidden>Anlık etkiyi burada kullan</button><div class="hand-wrap"><div class="hand-label"><i></i><span>Bir kartı adaya sürükle</span><i></i></div><div id="hand"></div></div>
 <div class="tools"><button id="help" aria-label="Oyun rehberi" title="Oyun rehberi">${icon('help')}</button><button id="restart" title="Yeni krallık" aria-label="Yeni krallık">${icon('reset')}</button></div>
 <section id="tile-editor" hidden aria-label="Yerleşimi düzenle"><div class="tile-editor-heading"><strong></strong><button data-tile-close aria-label="Düzenlemeyi kapat">×</button></div><small></small><div id="storage-upgrade" hidden><div><span id="storage-meter"></span><button id="upgrade-store"></button></div><progress id="storage-progress" value="0" max="1" aria-label="Depo kapasitesi"></progress></div><div class="tile-editor-actions"><button data-tile-left aria-label="Yerleşimi sola döndür">↶ Döndür</button><button data-tile-right aria-label="Yerleşimi sağa döndür">Döndür ↷</button><button data-tile-delete>Yık ve sil</button></div></section>
 <button id="population-toggle" aria-expanded="false" aria-controls="work-panel">${icon('people')}<span>Görevler</span><b id="population-badge">1</b></button>
 <section id="work-panel" hidden aria-label="Nüfus görev dağılımı"><header><strong>İş öncelikleri</strong><button data-work-balance>Dengele</button><button data-work-close aria-label="Kapat">×</button></header><p id="work-summary"></p><div id="work-rows"></div></section>
 <aside id="food-details" hidden role="tooltip"></aside>
 <aside id="tile-tooltip" hidden><strong></strong><div></div></aside><dialog></dialog>`;
const get=<E extends HTMLElement=HTMLElement>(selector:string)=>app.querySelector<E>(selector)!;
const hand=get('#hand'), placement=get('#placement'), log=get('#log'), dialog=get<HTMLDialogElement>('dialog');
const world=new World(get('#world'));
const thumbs=world.thumbnails();
const sound=new TableSound();
world.onSoundFrame=(camera,focus,birds)=>sound.updateSpatial(camera,focus,birds);
let game=new Game();
let selected:Card|null=null,settleTimer:number|undefined,toastTimer:number|undefined,locked=false;
let pendingPlacement:number|null=null;
let editedTile=-1;

function affordable(c:Card) { return c.cost<=game.wood&&(c.id!=='festival'||game.food>=3); }
function select(c:Card|null,carrying=false) {
  if(!c)pendingPlacement=null;
  selected=c;get('#event-target').hidden=!c?.event;world.setSelection(c,carrying);
  hand.classList.toggle('choosing',!!c);
  hand.querySelectorAll<HTMLButtonElement>('[data-card]').forEach(b=>{
    const active=!!c&&game.hand[Number(b.dataset.card)]===c;
    b.classList.toggle('selected',active);b.setAttribute('aria-pressed',String(active));
  });
  get('.hand-label span').textContent=c?(c.event?'Adanın üzerine bırak':'Kıyıya bırak · Tekerlek / R ile döndür'):'Bir kartı adaya sürükle';
}
function label(text:string) {
  placement.textContent=text;placement.hidden=!text;
}
world.valid=i=>!!selected&&i>=0&&game.valid(selected,i);
world.onHover=i=>{
  if(!selected||i<0){label('');return}
  if(!world.valid(i)){label(selected.event?'Mevcut karaya bırak':game.wouldSealFishery(i)?'Balıkçının son kıyısı açık kalmalı':'Yalnızca kıyıdaki boş bir altıgene bırak');placement.dataset.valid='false';return}
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
  if(!selected||i<0||!world.valid(i))return false;
  if(locked){pendingPlacement=i;world.holdSelection();label('Ada hazırlanıyor…');return true}
  const rotation=world.placementRotation;
  const card=selected,preview=game.preview(card,i)!;
  const production=game.play(card,i);
  if(!production)return false;
  locked=true;
  sound.sequence(!!card.event,['house','manor','store','lumber'].includes(card.id),preview.localBonus||preview.neighbors.length>0);select(null);world.sync(game.board,card.event?-1:i,rotation);
  if(card.event)world.burst(i);
  render();
  toast(card.event?`${card.name} uygulandı`:`${card.name} · yerleşim hazırlanıyor`);
  hand.animate([{opacity:.35,transform:'translateY(17px)'},{opacity:1,transform:'translateY(0)'}],{duration:330,easing:'ease-out'});
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
  canStart:i=>pendingPlacement===null&&!dialog.open&&!!game.hand[i]&&affordable(game.hand[i]),
  start:i=>{sound.play('lift');select(game.hand[i],true)},
  move:(x,y)=>world.valid(dragPosition(x,y)),
  drop:(x,y)=>commit(dragPosition(x,y)),
  cancel:()=>{sound.play('invalid');select(null)},
  tap:i=>{const c=game.hand[i];select(selected===c?null:c)},
});
const workNames:Record<WorkCategory,string>={stone:'Taş',wood:'Odun',berry:'Çilek',farm:'Buğday',fish:'Balık'};
const workIcons:Record<WorkCategory,string>={stone:'stone',wood:'wood',berry:'berry',farm:'wheat',fish:'fish'};
get('#work-rows').innerHTML=WORK_CATEGORIES.map(category=>`<label class="work-row" data-work="${category}"><span>${icon(workIcons[category])}<b>${workNames[category]}</b><small></small><em></em></span><input type="range" min="0" max="100" value="${game.priorities[category]}" aria-label="${workNames[category]} iş önceliği" data-priority="${category}"></label>`).join('');
function renderWork(){
  const counts=world.villagers.assignedCounts(),targets=game.workTargets();
  get('#population-badge').textContent=String(game.people);get('#work-summary').textContent=`${world.villagers.working} çalışıyor · ${Math.max(0,game.people-world.villagers.working)} boşta`;
  for(const category of WORK_CATEGORIES){
    const row=get(`[data-work="${category}"]`),input=row.querySelector<HTMLInputElement>('input')!;
    if(document.activeElement!==input)input.value=String(game.priorities[category]);
    row.querySelector('small')!.textContent=`${counts[category]} / ${targets[category]} kişi`;
    row.querySelector('em')!.textContent=`%${game.priorities[category]}`;
    row.classList.toggle('inactive',![...game.board.keys()].some(id=>game.categoryFor(id)===category));
  }
}
function toggleWork(){const panel=get('#work-panel');panel.hidden=!panel.hidden;get('#population-toggle').setAttribute('aria-expanded',String(!panel.hidden));renderWork()}
get('#population-toggle').onclick=toggleWork;
get('[data-work-close]').onclick=()=>{get('#work-panel').hidden=true;get('#population-toggle').setAttribute('aria-expanded','false')};
get('[data-work-balance]').onclick=()=>{game.priorities={wood:20,stone:20,berry:20,farm:20,fish:20};world.villagers.rebalance();renderWork()};
app.querySelectorAll<HTMLInputElement>('[data-priority]').forEach(input=>input.oninput=()=>{game.setPriority(input.dataset.priority as WorkCategory,Number(input.value));world.villagers.rebalance();renderWork()});
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
  if(!stats.children.length)stats.innerHTML=[['wood','Odun'],['stone','Taş'],['food','Yiyecek'],['people','Nüfus'],['happy','Refah']].map(([id,name])=>`<div class="resource" data-resource="${id}">${icon(id)}<div><small>${name}</small><b>0</b></div><em></em></div>`).join('');
  const foodStat=get('[data-resource="food"]');
  foodStat.onmouseenter=showFood;foodStat.onmouseleave=()=>get('#food-details').hidden=true;foodStat.onfocus=showFood;foodStat.onblur=()=>get('#food-details').hidden=true;foodStat.tabIndex=0;foodStat.setAttribute('aria-describedby','food-details');
  get('[data-resource="people"]').onclick=toggleWork;
  for(const id of ['wood','stone','food','people','happy'] as const){
    animateCounter(id,id==='happy'?Math.round(game.happy):game[id]);
    get(`[data-resource="${id}"] em`).textContent=id==='people'?`${world.villagers.working}/${game.people} çalışıyor`:id==='happy'?'Köyün ruhu':id==='food'?`−${game.foodPerMinute}/dk`:'Depoda';
  }
  hand.querySelectorAll<HTMLButtonElement>('[data-card]').forEach(b=>{const c=game.hand[Number(b.dataset.card)];b.disabled=!c||!affordable(c)});
  renderWork();renderStorage();if(!get('#food-details').hidden)renderFood();
}
function render(){
  renderHud();
  hand.innerHTML=game.hand.map((c,i)=>`<button class="card tone-${c.id}" data-card="${i}" aria-pressed="false" ${!affordable(c)?'disabled':''}>
    <span class="cost" title="${c.cost} odun">${icon('wood')}${c.cost}</span><span class="type">${c.event?'ANLIK':c.workers?'ÜRETİM':'YERLEŞİM'}</span>
    <img src="${thumbs[c.id]}" alt="" draggable="false"><strong>${c.name}</strong><span class="rule"></span><span class="effect">${c.desc}</span><small>${c.bonus}</small>
  </button>`).join('');
}
world.onDelivery=(source,store,resource,amount)=>{
  const accepted=game.deliver(source,store,resource,amount);if(!accepted)return 0;
  renderHud();sound.play('reward');
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
  else if(product){lines.push(`+${product.amount} ${product.resource==='stone'?'taş':product.resource==='wood'?'odun':product.resource==='food'?(kind==='fisher'?'balık':kind==='farm'?'buğday':'çilek'):'refah'} / teslimat`,`${world.villagers.assignedTo(id)} / ${product.capacity} çalışan`,'Ürünler depoya taşınır');}
  else if(kind==='house'||kind==='manor')lines.push(`${game.residents.filter(r=>r.home===id).length} sakinin evi`,'Sakinler yakındaki işlere yürüyerek gider');
  else if(kind==='lumber')lines.push('Komşu ormanlara +2 odun','Oduncular komşu ormanlarda çalışır');
  else if(card)lines.push(card.desc,card.bonus);
  const graphic=id===CENTER?'crest':({forest:'wood',stone:'stone',berry:'berry',farm:'wheat',fisher:'fish',store:'carry',house:'people',manor:'people',lumber:'wood',garden:'garden'} as Record<string,string>)[kind??'']??'garden';
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
window.setInterval(renderHud,200);
function modal(html:string) {
  drag.cancel();select(null);dialog.innerHTML=html;if(!dialog.open)dialog.showModal();
  const audioButton=dialog.querySelector<HTMLButtonElement>('[data-audio]');
  if(audioButton)audioButton.onclick=()=>{sound.toggle();audioButton.textContent=sound.muted?'Ses kapalı':'Ses açık'};
  dialog.querySelectorAll<HTMLInputElement>('input[data-level]').forEach(input=>{
    input.oninput=()=>sound.set(input.dataset.level as 'master'|'sfx'|'ambience',Number(input.value)/100);
  });
  dialog.querySelector('[data-close]')?.addEventListener('click',()=>dialog.close());
  dialog.querySelector('[data-new]')?.addEventListener('click',()=>{dialog.close();reset()});
}
function reset(){
  clearTimeout(settleTimer);clearTimeout(toastTimer);log.classList.remove('visible');
  document.querySelectorAll('.delivery-spark').forEach(el=>el.remove());get('#food-details').hidden=true;get('#work-panel').hidden=true;get('#population-toggle').setAttribute('aria-expanded','false');
  drag.cancel();sound.cancel();sound.resetAmbience();for(const state of counters.values())cancelAnimationFrame(state.frame);counters.clear();game=new Game();selected=null;locked=false;
  world.reset();world.sync(game.board);world.bindGame(game);select(null);render();
}
get('#restart').onclick=()=>modal('<h1>Yeni krallık?</h1><p>Mevcut koşu sona erecek.</p><button data-new>Yeniden başla</button><button data-close>Oyuna dön</button>');
get('#help').onclick=()=>modal(`<small>YELKEN KOYU</small><h1>Yaşayan bir köy</h1>
 <p>Tur veya süre sınırı yok. Kartları kıyıdaki boş altıgenlere bırak. Her ev iki, büyük ev dört yeni sakin getirir. Boşta kalanlar dolaşır; uygun iş varsa yürüyerek çalışmaya giderler.</p>
 <p>Sakinler ormanda ağaç keser, çilek ve tarladan ürün toplar. Ağaçlar ve meyveler yeniden büyür. Depolar adanın her yerinden ürün kabul eder. Yalnızca depoya ulaşan ürünler kaynaklarına eklenir. Her sakin dakikada 2 yiyecek tüketir; yiyecek göstergesinin üzerine gelerek stokları görebilirsin.</p>
 <p>Sağ alttaki Görevler panelinden odun, taş, çilek, buğday ve balık işlerinin önceliğini değiştirebilirsin. Balıkçı kulübesini kıyıya bakacak şekilde yerleştir.</p>
 <p>Depoyu seçerek kapasitesini görebilir, odunla yükseltebilirsin. Altıgenin üzerine gelince bilgisi farenin yanında görünür. Tıklayarak döndürebilir ya da yıkabilirsin; yıkım kaynak vermez.</p>
 <p class="controls">Sağ tuş · 360° döndür &nbsp; Orta tuş · kaydır<br>Tekerlek · yakınlaş &nbsp; H · ortala<br>Kart / yapı seçiliyken tekerlek veya R · döndür<br>Shift + R · ters yön &nbsp; Esc · seçimi bırak</p><div class="mixer">${(['master','sfx','ambience'] as const).map((bus,i)=>`<label>${['Genel ses','Efektler','Kıyı ambiyansı'][i]}<input data-level="${bus}" aria-label="${['Genel ses','Efektler','Kıyı ambiyansı'][i]}" type="range" min="0" max="100" value="${Math.round(sound.levels[bus]*100)}"></label>`).join('')}</div><button data-audio>Ses ${sound.muted?'kapalı':'açık'}</button><button data-close>Oyuna dön</button>`);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!dialog.open){drag.cancel();select(null)}});
reset();


