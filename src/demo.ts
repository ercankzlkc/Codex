import {Game,MILESTONES,type Kind} from './game';
import {CENTER,adjacent,frontier} from './hex';

// Temporary crowd preview. Set to 0 to restore the normal single-tile start.
export const DEMO_EXTRA_TILES=100;
export function createDemoGame(){
  const game=new Game();
  if(!DEMO_EXTRA_TILES)return game;
  const kinds:Kind[]=[
    ...Array<Kind>(10).fill('house'),...Array<Kind>(3).fill('manor'),
    ...Array<Kind>(4).fill('forest'),...Array<Kind>(3).fill('berry'),
    ...Array<Kind>(3).fill('farm'),...Array<Kind>(2).fill('store'),
    ...Array<Kind>(2).fill('stone'),...Array<Kind>(2).fill('garden'),'lumber',
  ];
  for(let i=kinds.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[kinds[i],kinds[j]]=[kinds[j],kinds[i]]}
  for(let i=0;i<DEMO_EXTRA_TILES;i++){
    const choices=frontier(game.board);
    // Prefer joined clusters while leaving enough randomness to vary the coastline.
    const weights=choices.map(id=>1+adjacent(id).filter(n=>game.board.has(n)).length**2);
    let roll=Math.random()*weights.reduce((a,b)=>a+b,0),index=0;
    while(index<weights.length-1&&roll>=weights[index]){roll-=weights[index];index++}
    game.board.set(choices[index],kinds[i%kinds.length]);
  }
  const coastal=[...game.board].filter(([id,kind])=>id!==CENTER&&['forest','berry','farm','garden','stone','lumber'].includes(kind)&&adjacent(id).some(n=>!game.board.has(n)));
  for(let i=coastal.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[coastal[i],coastal[j]]=[coastal[j],coastal[i]]}
  for(const [id] of coastal.slice(0,2))game.board.set(id,'fisher');
  for(const [id,kind] of game.board){
    if(id===CENTER)continue;
    if(kind==='store'){game.storageLevels.set(id,2);game.storageStocks.set(id,{wood:0,stone:0,berry:0,wheat:0,fish:0})}
    const residents=kind==='house'?2:kind==='manor'?4:0;
    for(let i=0;i<residents;i++)game.residents.push({id:game.residents.length,home:id});
  }
  // Keep the preview running without milestone popups interrupting the seasons.
  game.peakPopulation=game.people;
  for(const milestone of MILESTONES)if(game.people>=milestone.population)game.reached.add(milestone.population);
  game.grantResources(150);
  return game;
}
