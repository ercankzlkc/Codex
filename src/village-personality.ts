import type {Kind} from './game';
const names=['Deniz','Defne','Ege','Ada','Toprak','Duru','Çınar','İpek','Aras','Lale','Kuzey','Nehir','Bora','Elif','Umut','Mavi'];
export const residentName=(id:number)=>names[id%names.length]+(id>=names.length?` ${Math.floor(id/names.length)+1}`:'');
export const wishes:{kind:Kind;text:string;thanks:string}[]=[
  {kind:'garden',text:'Köyümüzde çiçeklerle dolu bir bahçe olsa…',thanks:'Bahçemizdeki çiçekler içimi açıyor.'},
  {kind:'forest',text:'Ağaçların gölgesinde yürümek isterim.',thanks:'Ormanın kokusunu çok seviyorum.'},
  {kind:'fisher',text:'Kıyıda balık tutanları izlemek isterim.',thanks:'Kıyımız artık daha da canlı.'}
];
