import './style.css';
import {CENTER} from './hex';
import {Game,cards,type Card} from './game';
import {World} from './world';
import {CardDrag} from './drag';
import {TableSound} from './sound';

const paths: Record<string,string> = {
  wood:'M4 15 13 5c2-2 7 0 7 3l-9 11M4 15c2-3 7 0 7 3s-5 3-7 0c-1-1-1-2 0-3Zm9-5 3-3',
  food:'M6 21 18 4M10 16c-5 0-6-4-6-7 5 1 7 4 6 7Zm3-5c-3-1-4-4-3-7 3 1 4 4 3 7Zm0 3c4-4 6-4 9-4-1 4-5 6-9 4Z',
  people:'M8 7a4 4 0 1 0 8 0 4 4 0 1 0-8 0ZM4 21v-3a8 8 0 0 1 16 0v3M8 18v3m8-3v3',
  happy:'M12 20S3 14 3 8c0-5 6-6 9-1 3-5 9-4 9 1 0 6-9 12-9 12Z',
  crest:'M4 12 2 6l6 3 4-7 4 7 6-3-2 6-1 4H5ZM7 20h10',
  help:'M9 8c0-4 7-4 7 0 0 3-4 3-4 6m0 3v1',
  reset:'M4 10a8 8 0 1 1 1 8M4 4v6h6',
};
const icon=(id:string)=>`<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="${paths[id]}"/></svg>`;
const app=document.querySelector<HTMLElement>('#app')!;
app.innerHTML=`<div id="world" aria-label="Kartlarla genişleyen altıgen kıyı adası"></div>
 <div class="vignette"></div>
 <div class="kingdom-hud" aria-label="Krallığın durumu"><div id="stats" aria-label="Krallığın kaynakları"></div>
 <div class="run"><div id="turn"></div><small>Hedef · 10 nüfus / 50 refah</small></div></div>
 <div id="log" role="status"></div><div id="placement" aria-live="polite"></div>
 <button id="event-target" hidden>Anlık etkiyi burada kullan</button><div class="hand-wrap"><div class="hand-label"><i></i><span>Bir kartı adaya sürükle</span><i></i></div><div id="hand"></div></div>
 <div class="tools"><button id="help" aria-label="Oyun rehberi" title="Oyun rehberi">${icon('help')}</button><button id="restart" title="Yeni krallık" aria-label="Yeni krallık">${icon('reset')}</button></div>
 <section id="tile-editor" hidden aria-label="Yerleşimi düzenle"><div class="tile-editor-heading"><strong></strong><button data-tile-close aria-label="Düzenlemeyi kapat">×</button></div><small></small><div class="tile-editor-actions"><button data-tile-left aria-label="Yerleşimi sola döndür">↶ Döndür</button><button data-tile-right aria-label="Yerleşimi sağa döndür">Döndür ↷</button><button data-tile-delete>Yık ve sil</button></div></section>
 <dialog></dialog>`;
const get=<E extends HTMLElement=HTMLElement>(selector:string)=>app.querySelector<E>(selector)!;
const hand=get('#hand'), placement=get('#placement'), log=get('#log'), dialog=get<HTMLDialogElement>('dialog');
const world=new World(get('#world'));
const thumbs=world.thumbnails();
const sound=new TableSound();
let game=new Game();
let selected:Card|null=null,turnTimer:number|undefined,toastTimer:number|undefined,locked=false;
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
  if(!world.valid(i)){label(selected.event?'Mevcut karaya bırak':'Yalnızca kıyıdaki boş bir altıgene bırak');placement.dataset.valid='false';return}
  placement.dataset.valid='true';
  if(selected.event){label(selected.desc);return}
  const p=game.preview(selected,i)!;
  const effects=[p.wood&&`+${p.wood} odun`,p.food&&`+${p.food} yiyecek`,p.happy&&`+${p.happy} refah`,p.people&&`+${p.people} nüfus`].filter(Boolean);
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
  world.feedback(production,i,preview.neighbors);render();
  toast(game.log);
  hand.animate([{opacity:.35,transform:'translateY(17px)'},{opacity:1,transform:'translateY(0)'}],{duration:330,easing:'ease-out'});
  clearTimeout(turnTimer);turnTimer=window.setTimeout(settle,2000);return true;
}
function settle(){
  if(world.placing){turnTimer=window.setTimeout(settle,100);return}
  locked=false;
  if(game.over){finish();return}
  if(pendingPlacement!==null){const i=pendingPlacement;pendingPlacement=null;commit(i)}
}
world.onTileSelect=i=>{
  editedTile=i;const editor=get('#tile-editor');editor.hidden=i<0;
  if(i<0)return;
  get('#tile-editor strong').textContent=i===CENTER?'Krallık merkezi':cards.find(c=>c.id===game.board.get(i))?.name??'Yerleşim';
  get('#tile-editor small').textContent=i===CENTER?'Merkez korunur · R / tekerlek ile döndür':'R / tekerlek · Silmede kaynak iadesi yok';
  const remove=get<HTMLButtonElement>('[data-tile-delete]');remove.disabled=i===CENTER||game.over;
  remove.title=i===CENTER?'Krallık merkezi silinemez':game.over?'Koşu sona erdi':'Yapı ve toprak denize çöker';
};
get('[data-tile-left]').onclick=()=>world.rotateSelection(-1);
get('[data-tile-right]').onclick=()=>world.rotateSelection(1);
get('[data-tile-close]').onclick=()=>world.editTile(-1);
get('[data-tile-delete]').onclick=()=>{
  const id=editedTile;if(world.placing||!game.remove(id))return;
  locked=true;drag.cancel();select(null);world.demolish(game.board,id);render();toast('Yerleşim kaldırıldı · kaynak iadesi yok');
  clearTimeout(turnTimer);turnTimer=window.setTimeout(settle,1500);
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
  canStart:i=>pendingPlacement===null&&!game.over&&!dialog.open&&!!game.hand[i]&&affordable(game.hand[i]),
  start:i=>{sound.play('lift');select(game.hand[i],true)},
  move:(x,y)=>world.valid(dragPosition(x,y)),
  drop:(x,y)=>commit(dragPosition(x,y)),
  cancel:()=>{sound.play('invalid');select(null)},
  tap:i=>{const c=game.hand[i];select(selected===c?null:c)},
});
function render() {
  const p=game.production(),net=p.food-game.people;
  get('#stats').innerHTML=[
    ['wood','Odun',game.wood,`+${p.wood}/tur`],['food','Yiyecek',game.food,`${net>=0?'+':''}${net}/tur`],
    ['people','Nüfus',game.people,`${p.used}/${game.people} işçi`],['happy','Refah',game.happy,`+${p.happy}/tur`],
  ].map(([id,name,v,rate])=>`<div class="resource" data-resource="${id}" title="${name} · ${rate}">${icon(String(id))}<div><small>${name}</small><b>${v}</b></div><em>${rate}</em></div>`).join('');
  get('#turn').innerHTML=`<small>TUR</small> <b>${String(game.turn).padStart(2,'0')}</b><span> / 15</span>`;
  hand.innerHTML=game.hand.map((c,i)=>`<button class="card tone-${c.id}" data-card="${i}" aria-pressed="false" ${game.over||!affordable(c)?'disabled':''}>
    <span class="cost" title="${c.cost} odun">${icon('wood')}${c.cost}</span><span class="type">${c.event?'ANLIK':c.workers?`${c.workers} İŞÇİ`:'YERLEŞİM'}</span>
    <img src="${thumbs[c.id]}" alt="" draggable="false"><strong>${c.name}</strong><span class="rule"></span><span class="effect">${c.desc}</span><small>${c.bonus}</small>
  </button>`).join('');
}
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
function finish(){
  modal(`<small>YELKEN KOYU · TUR ${game.turn}</small><h1>${game.won?'Koyda hayat var.':'Bir mevsim sona erdi.'}</h1>
    <p>${game.won?'Köyün yeni mevsime hazır.':game.turn<15?'Halkın köyü terk etti.':'Hedef 10 nüfus ve 50 refahtı.'}</p><p>${game.people} nüfus · ${game.happy} refah · ${game.food} yiyecek</p><button data-new>Yeni krallık kur</button>`);
}
function reset(){
  clearTimeout(turnTimer);clearTimeout(toastTimer);log.classList.remove('visible');
  drag.cancel();sound.cancel();game=new Game();selected=null;locked=false;
  world.reset();world.sync(game.board);select(null);render();
}
get('#restart').onclick=()=>modal('<h1>Yeni krallık?</h1><p>Mevcut koşu sona erecek.</p><button data-new>Yeniden başla</button><button data-close>Oyuna dön</button>');
get('#help').onclick=()=>modal(`<small>YELKEN KOYU</small><h1>Adada yaşam</h1>
 <p>Kartı kıyıdaki boş bir altıgene bırak. Yeni kara denizden yükselir. Merkez her tur 2 odun ve bir işçiyle 4 yiyecek üretir. Anlık kartlar adanın herhangi bir hücresinde kullanılır. İstersen kartı seçip hücreye tıklayabilirsin. Esc seçimi iptal eder.</p>
 <p>Her tur önce üretim yapılır, ardından her kişi 1 yiyecek tüketir. İşçiler önce yiyecek yapılarına atanır. Kıtlık 1 nüfus ve 14 refah götürür.</p>
 <p>Komşu yapılar birbirini güçlendirir. Ormanlar oduncu kartlarını sıklaştırır. 6 nüfusta çiftlik ve büyük ev açılır. 15 tur sonunda 10 nüfus ve 50 refaha ulaş.</p>
 <p class="controls">Sağ tuş · döndür &nbsp; Orta tuş · kaydır<br>Tekerlek · yakınlaş &nbsp; H · kamerayı ortala<br>Kart seçiliyken tekerlek / R · döndür &nbsp; Shift + R · ters yön</p><div class="mixer">${(['master','sfx','ambience'] as const).map((bus,i)=>`<label>${['Genel ses','Efektler','Kıyı ambiyansı'][i]}<input data-level="${bus}" aria-label="${['Genel ses','Efektler','Kıyı ambiyansı'][i]}" type="range" min="0" max="100" value="${Math.round(sound.levels[bus]*100)}"></label>`).join('')}</div><button data-audio>Ses ${sound.muted?'kapalı':'açık'}</button><button data-close>Oyuna dön</button>`);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!dialog.open){drag.cancel();select(null)}});
reset();


