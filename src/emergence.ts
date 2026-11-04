/** Shared seconds: water gathers, land rises, then the building settles. */
export const LAND_START=.6, LAND_END=1.45, BUILD_START=1.5, BUILD_END=2.35;
export function easeBetween(time:number,start:number,end:number){
  const t=Math.max(0,Math.min(1,(time-start)/(end-start)));
  return t*t*(3-2*t);
}
export const SINK_START=.10, SINK_END=1.25, DEMOLISH_END=1.4;
