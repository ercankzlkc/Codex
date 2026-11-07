/** Work rates use the calendar season, independently of the gradual visual snow. */
export type SeasonalWork='wood'|'stone'|'berry'|'farm'|'fish'|'garden';
export const SEASON_WORKS:readonly {id:SeasonalWork;name:string;graphic:string}[]=[
  {id:'berry',name:'Çilek',graphic:'berry'},{id:'farm',name:'Buğday',graphic:'wheat'},
  {id:'fish',name:'Balık',graphic:'fish'},{id:'wood',name:'Odun',graphic:'wood'},
  {id:'stone',name:'Taş',graphic:'stone'},{id:'garden',name:'Bahçe',graphic:'garden'},
];
export const SEASON_ECONOMY:readonly {name:string;symbol:string;hint:string;rates:Record<SeasonalWork,number>}[]=[
  {name:'İlkbahar',symbol:'✿',hint:'Çilek canlanır. Yeni sakinler için erzak biriktir.',rates:{berry:1.2,farm:1,fish:1,wood:1.1,stone:1,garden:1.2}},
  {name:'Yaz',symbol:'☀',hint:'Buğday ve balık verimli. Kış için depolarını büyüt.',rates:{berry:1,farm:1.25,fish:1.15,wood:1,stone:1,garden:1}},
  {name:'Sonbahar',symbol:'❧',hint:'Son buğday hasatlarını depola; kışın tarla durur.',rates:{berry:.75,farm:1.1,fish:1,wood:.9,stone:1,garden:.8}},
  {name:'Kış',symbol:'❄',hint:'Buğday durur. Çilek çok yavaşlar; erzak ve balıkçılıkla kışı geçir.',rates:{berry:.25,farm:0,fish:.8,wood:.75,stone:.9,garden:0}},
];
export const RENEWAL_SECONDS={wood:90,stone:150,field:30} as const;
export function seasonalRate(season:number,work:SeasonalWork|null){return work?SEASON_ECONOMY[season%4].rates[work]:1}
/** Display the change from normal speed consistently in every interface. */
export function rateLabel(rate:number,compact=false){
  if(rate===1)return compact?'—':'Normal';
  if(rate===0&&!compact)return 'Durur';
  return `${rate>1?'+':'−'}${Math.round(Math.abs(rate-1)*100)}%`;
}
