const positions:Record<string,number>={wood:0,stone:1,food:2,gold:3,people:4,happy:5,berry:6,wheat:7,fish:8};
/** One shared generated atlas, with a stable three-by-three layout. */
export function resourceArt(id:string){
  const cell=positions[id];if(cell===undefined)return '';
  return `<span class="resource-art art-${id}" style="--art-x:${cell%3*50}%;--art-y:${Math.floor(cell/3)*50}%" aria-hidden="true"></span>`;
}
