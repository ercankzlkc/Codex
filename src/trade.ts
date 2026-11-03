export type Cargo='wood'|'stone'|'berry'|'wheat'|'fish';
export type TradeOrder={title:string;message:string;needs:Partial<Record<Cargo,number>>};
export const cargoNames:Record<Cargo,string>={wood:'Odun',stone:'Taş',berry:'Çilek',wheat:'Buğday',fish:'Balık'};
/** No deadlines: each route teaches one part of the village economy. */
export function tradeOrder(completed:number):TradeOrder{
  if(completed===0)return {title:'İlk sefer',message:'Orman ve çilek bahçesi kur; ürünleri depoda biriktir.',needs:{wood:24,berry:12}};
  if(completed===1)return {title:'Fırıncının siparişi',message:'Yeni bir tarla kur; köyün sofrasından artanı gönder.',needs:{wood:20,wheat:12}};
  if(completed===2)return {title:'Liman hazırlığı',message:'Taş ve balık üretimini birbirine bağla.',needs:{stone:16,fish:12}};
  const extra=Math.min(42,(completed-3)*3);
  return [
    {title:'Kıyı pazarı',message:'Düzenli üretimin meyvesini topla.',needs:{wood:28+extra,berry:18+extra}},
    {title:'Komşu köyün sofrası',message:'İki farklı yiyeceği birlikte yetiştir.',needs:{wheat:16+extra,fish:16+extra}},
    {title:'Ustanın malzemeleri',message:'Odun ve taş işlerini dengede tut.',needs:{wood:30+extra,stone:20+extra}},
  ][(completed-3)%3] as TradeOrder;
}
