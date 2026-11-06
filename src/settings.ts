import type {World} from './world';
import type {TableSound} from './sound';

const palettes=[
  {id:'coast',grade:{hue:0,saturation:1,brightness:1},name:'Yelken Koyu',colors:['#87efd4','#20d0c6','#22b7c7','#318fc4'],sky:'#93bfcb',sun:'#fff2da',accent:'#355440',paper:'#f3ecd6'},
  {id:'tropical',grade:{hue:-18,saturation:1.3,brightness:1.04},name:'Tropik',colors:['#a1ffcb','#00e5a8','#00cbb8','#078bb8'],sky:'#83dcd4',sun:'#fff4cf',accent:'#006951',paper:'#e4fff0'},
  {id:'coral',grade:{hue:150,saturation:1.16,brightness:1.04},name:'Mercan',colors:['#ffd7ae','#ffaf9c','#e97e9a','#9c75bb'],sky:'#f4bdbe',sun:'#ffe1cd',accent:'#944859',paper:'#fff0e7'},
  {id:'azure',grade:{hue:28,saturation:1.12,brightness:1.03},name:'Mavi Rüya',colors:['#b1f6ff','#48d9fa','#299fe8','#3264bd'],sky:'#a1d3f4',sun:'#edf6ff',accent:'#24598a',paper:'#eaf5ff'},
  {id:'emerald',grade:{hue:-35,saturation:1.18,brightness:1},name:'Zümrüt',colors:['#b4f6ba','#43d99c','#1fa78d','#287b8b'],sky:'#a2cfbc',sun:'#f0ffdc',accent:'#23614a',paper:'#eaf5df'},
  {id:'sunset',grade:{hue:165,saturation:1.18,brightness:1.05},name:'Gün Batımı',colors:['#ffe3a1','#ffba78','#ed887b','#a068a5'],sky:'#efb694',sun:'#ffd09e',accent:'#8c4b38',paper:'#fff0d7'},
  {id:'lavender',grade:{hue:82,saturation:1.1,brightness:1.04},name:'Lavanta',colors:['#e1d4ff','#bda2fb','#997cdd','#6666b5'],sky:'#c7bde5',sun:'#f3e5ff',accent:'#65518b',paper:'#f2edff'},
  {id:'lemon',grade:{hue:-65,saturation:1.22,brightness:1.06},name:'Limon Bahçesi',colors:['#ebffb2','#ace66a','#59c5a3','#339cac'],sky:'#c2dfb5',sun:'#fff3b2',accent:'#526c28',paper:'#f8f8d9'},
  {id:'pink',grade:{hue:115,saturation:1.15,brightness:1.05},name:'Pembe Düş',colors:['#ffdbed','#f9a8d7','#d77bc3','#8b70ba'],sky:'#eec3dd',sun:'#ffe5ee',accent:'#8b4777',paper:'#fff0fa'},
  {id:'island',grade:{hue:8,saturation:1.42,brightness:1.05},name:'Canlı Ada',colors:['#a6ffdf','#10e8d4','#00bddc','#166fd0'],sky:'#8acfe6',sun:'#fff0c5',accent:'#056c78',paper:'#e5fbfa'},
] as const;
type Palette=typeof palettes[number];

export function setupSettings(world:World,sound:TableSound,modal:(html:string,kind?:string)=>void,dialog:HTMLDialogElement){
  let selected:Palette=palettes[0];
  const apply=(palette:Palette)=>{
    selected=palette;
    world.setPalette(palette.colors,palette.sky,palette.sun,palette.grade);
    const style=document.documentElement.style;
    style.setProperty('--settings-accent',palette.accent);style.setProperty('--settings-paper',palette.paper);
    style.setProperty('--pine',palette.accent);
    style.setProperty('--paper',palette.paper);
    style.setProperty('--ink',palette.accent);
    style.setProperty('--palette-accent',palette.accent);
    style.setProperty('--palette-paper',palette.paper);
    style.setProperty('--palette-image-filter',`hue-rotate(${palette.grade.hue}deg) saturate(${palette.grade.saturation}) brightness(${palette.grade.brightness})`);
  };
  try{apply(palettes.find(p=>p.id===localStorage.getItem('lk-palette-v1'))??palettes[0])}catch{apply(palettes[0])}
  document.querySelector<HTMLButtonElement>('#settings')!.onclick=()=>{
    modal(`<header class="settings-heading"><div><small>YELKEN KOYU</small><h1>Ayarlar</h1></div><button data-close aria-label="Ayarları kapat">×</button></header>
      <section class="settings-section"><h2>Ses</h2><div class="mixer">${(['master','sfx','ambience'] as const).map((bus,i)=>`<label><span>${['Genel ses','Efektler','Kıyı ambiyansı'][i]}</span><input data-level="${bus}" aria-label="${['Genel ses','Efektler','Kıyı ambiyansı'][i]}" type="range" min="0" max="100" value="${Math.round(sound.levels[bus]*100)}"><output>${Math.round(sound.levels[bus]*100)}%</output></label>`).join('')}</div><button data-audio aria-pressed="${sound.muted}">${sound.muted?'Sesi aç':'Sesi kapat'}</button></section>
      <section class="settings-section"><h2>Renk paleti <span>10 görünüm</span></h2><p>Köyün, doğanın ve kartlardaki modellerin renklerini seç. Değişiklik anında uygulanır.</p><div class="palette-grid" role="group" aria-label="Renk paleti">${palettes.map(p=>`<button class="palette-option" data-palette="${p.id}" aria-pressed="${p.id===selected.id}"><span class="palette-swatches" aria-hidden="true">${p.colors.map(c=>`<i style="background:${c}"></i>`).join('')}</span><span>${p.name}</span></button>`).join('')}</div><p class="settings-saved" role="status">Seçili palet: ${selected.name}</p></section>`,'settings');
    const mute=dialog.querySelector<HTMLButtonElement>('[data-audio]')!;
    mute.onclick=()=>{sound.toggle();mute.textContent=sound.muted?'Sesi aç':'Sesi kapat';mute.setAttribute('aria-pressed',String(sound.muted))};
    dialog.querySelectorAll<HTMLInputElement>('[data-level]').forEach(input=>{
      input.oninput=()=>{sound.set(input.dataset.level as 'master'|'sfx'|'ambience',Number(input.value)/100);input.nextElementSibling!.textContent=input.value+'%'};
    });
    dialog.querySelectorAll<HTMLButtonElement>('[data-palette]').forEach(button=>{
      button.onclick=()=>{
        const palette=palettes.find(p=>p.id===button.dataset.palette)!;apply(palette);
        try{localStorage.setItem('lk-palette-v1',palette.id)}catch{/* Preferences remain usable without storage. */}
        dialog.querySelectorAll('[data-palette]').forEach(option=>option.setAttribute('aria-pressed',String(option===button)));
        dialog.querySelector('.settings-saved')!.textContent='Seçili palet: '+palette.name;
      };
    });
  };
}
