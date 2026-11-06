import type {Kind} from './game';
const names=['Deniz','Defne','Ege','Ada','Toprak','Duru','Çınar','İpek','Aras','Lale','Kuzey','Nehir','Bora','Elif','Umut','Mavi'];
export const residentName=(id:number)=>names[id%names.length]+(id>=names.length?` ${Math.floor(id/names.length)+1}`:'');
export const wishes:{kind:Kind;text:string;thanks:string}[]=[
  {kind:'bench',text:'Denizi dinleyebileceğim bir bank olsa…',thanks:'Artık dinlenecek güzel bir köşem var.'},
  {kind:'lantern',text:'Akşam yürüyüşlerime bir fener eşlik etse…',thanks:'Köyümüz geceleri de sıcacık.'},
  {kind:'well',text:'Komşularımla kuyu başında buluşmak isterim.',thanks:'Kuyu başındaki sohbetleri seviyorum.'}
];
