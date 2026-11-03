/** Shared seconds: water gathers, land rises, then the building settles. */
export const LAND_START=.45, LAND_END=1.5, BUILD_START=1.05, BUILD_END=1.85;
export function easeBetween(time:number,start:number,end:number){
  const t=Math.max(0,Math.min(1,(time-start)/(end-start)));
  return t*t*(3-2*t);
}
