export type MarketSide='buy'|'sell';
const clampPressure=(value:number)=>Math.max(-60,Math.min(60,value));
/** Bid/ask spread prevents profitable instant buybacks; all amounts stay whole gold. */
export function marketPrice(base:number,side:MarketSide,pressure:number){
  const mid=base*Math.max(.25,Math.min(3,Math.exp(clampPressure(pressure)*.035)));
  return side==='sell'?Math.max(1,Math.floor(mid*.85)):Math.max(2,Math.ceil(mid*1.15));
}
export function quoteMarket(base:number,side:MarketSide,requested:number,pressure:number,limit:number,gold=Infinity){
  const desired=Number.isFinite(requested)?Math.max(0,Math.min(100,Math.floor(requested))):0;
  const max=Math.max(0,Math.min(desired,Math.floor(limit)));let count=0,total=0,p=pressure;
  const first=marketPrice(base,side,p);
  for(let i=0;i<max;i++){
    const price=marketPrice(base,side,p);if(side==='buy'&&total+price>gold)break;
    total+=price;count++;p=clampPressure(p+(side==='buy'?1:-1));
  }
  return {count,total,first,next:marketPrice(base,side,p),pressure:p};
}
