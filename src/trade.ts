import type {Kind} from './game';
export type Cargo='wood'|'stone'|'berry'|'wheat'|'fish';
export type TradeOrder={title:string;message:string;needs:Partial<Record<Cargo,number>>;choices:Kind[]};
export const cargoNames:Record<Cargo,string>={wood:'Odun',stone:'Taş',berry:'Çilek',wheat:'Buğday',fish:'Balık'};
/** No deadlines: each route teaches one part of the village economy. */
export function tradeOrder(completed:number):TradeOrder{
  if(completed===0)return {title:'İlk sefer',message:'Orman ve çilek bahçesi kur; ürünleri depoda biriktir.',needs:{wood:20,berry:10},choices:['farm','fisher','store']};
  if(completed===1)return {title:'Fırıncının siparişi',message:'Yeni bir tarla kur; köyün sofrasından artanı gönder.',needs:{wood:14,wheat:8},choices:['stone','house','store']};
  if(completed===2)return {title:'Liman hazırlığı',message:'Taş ve balık üretimini birbirine bağla.',needs:{stone:10,fish:8},choices:['manor','lumber','garden']};
  const extra=Math.min(12,(completed-3)*2);
  return [
    {title:'Kıyı pazarı',message:'Düzenli üretimin meyvesini topla.',needs:{wood:18+extra,berry:12+extra},choices:['house','store','lumber']},
    {title:'Komşu köyün sofrası',message:'İki farklı yiyeceği birlikte yetiştir.',needs:{wheat:10+extra,fish:10+extra},choices:['farm','fisher','garden']},
    {title:'Ustanın malzemeleri',message:'Odun ve taş işlerini dengede tut.',needs:{wood:22+extra,stone:14+extra},choices:['manor','store','lumber']},
  ][(completed-3)%3] as TradeOrder;
}
