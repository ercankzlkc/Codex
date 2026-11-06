import {fromWorld,position} from './hex';
import {BUILDING_SCALE} from './game';
/** Sweep the entire hull and its berth, not only the nearest open neighbour. */
export function merchantRouteOpen(board:ReadonlyMap<number,unknown>,id:number,yaw:number){
  const p=position(id),c=Math.cos(yaw),s=Math.sin(yaw);
  for(let z=1.05;z<=11.2;z+=.24)for(let x=.38;x<=1.86;x+=.24){
    const wx=p.x+(x*c+z*s)*BUILDING_SCALE,wz=p.z+(-x*s+z*c)*BUILDING_SCALE;
    const cell=fromWorld(wx,wz);if(cell!==id&&board.has(cell))return false;
  }
  return true;
}
