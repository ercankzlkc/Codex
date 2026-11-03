import {CENTER,adjacent} from './hex.ts';
import type {Game,Kind} from './game.ts';

export type ObjectiveReward={wood:number;food:number;happy:number};
export interface Objective {
  id:string;
  title:string;
  description:string;
  target:number;
  order:number;
  reward:ObjectiveReward;
  progress(game:Game):number;
}
const hasPair=(g:Game,a:Kind,b:Kind)=>[...g.board].some(([i,k])=>k===a&&adjacent(i).some(n=>g.board.get(n)===b));
const count=(g:Game,kind:Kind)=>[...g.board.values()].filter(k=>k===kind).length;
export const objectives:readonly Objective[]=[
  {id:'forest-neighbours',title:'Orman komşuları',description:'İki ormanı yan yana yerleştir.',target:2,order:0,reward:{wood:3,food:0,happy:0},progress:g=>hasPair(g,'forest','forest')?2:Math.min(1,count(g,'forest'))},
  {id:'forest-garden',title:'Ormanın armağanı',description:'Çilek bahçesini bir ormana komşu yap.',target:2,order:0,reward:{wood:0,food:4,happy:0},progress:g=>hasPair(g,'berry','forest')?2:Number(count(g,'berry')+count(g,'forest')>0)},
  {id:'cozy-homes',title:'Çiçekli kapılar',description:'Bir evin yanına bahçe yerleştir.',target:2,order:0,reward:{wood:0,food:0,happy:3},progress:g=>(hasPair(g,'garden','house')||hasPair(g,'garden','manor'))?2:Number([...g.board.values()].some(k=>k==='house'||k==='manor'||k==='garden'))},
  {id:'growing-village',title:'Yeni komşular',description:'Nüfusu en az 6 kişiye ulaştır.',target:6,order:1,reward:{wood:0,food:3,happy:0},progress:g=>g.people},
  {id:'full-table',title:'Bereketli sofra',description:'Turda tüketimden 2 fazla yiyecek üret.',target:2,order:1,reward:{wood:3,food:0,happy:0},progress:g=>g.production().food-g.people},
  {id:'varied-village',title:'Renkli bir köy',description:'Merkez dışında 4 farklı yapı türü kur.',target:4,order:2,reward:{wood:0,food:0,happy:4},progress:g=>new Set([...g.board].filter(([id])=>id!==CENTER).map(([,kind])=>kind)).size},
];

/** Three distinct goals, with the simpler ones presented first. */
export function drawObjectives(rng:()=>number):readonly Objective[]{
  const pool=[...objectives];
  for(let i=pool.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]]}
  return pool.slice(0,3).sort((a,b)=>a.order-b.order);
}
export function rewardLabel(reward:ObjectiveReward){
  return [reward.wood&&`+${reward.wood} odun`,reward.food&&`+${reward.food} yiyecek`,reward.happy&&`+${reward.happy} refah`].filter(Boolean).join(' · ');
}
