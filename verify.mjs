import assert from 'node:assert/strict';
import {Game,cards} from './src/game.ts';
import {key,axial,position,fromWorld,adjacent,frontier,coast,CENTER} from './src/hex.ts';

const card=id=>cards.find(c=>c.id===id);
const give=(g,id)=>{const c=card(id);g.hand=[c];return c};
const state=g=>JSON.stringify([[...g.board],g.turn,g.wood,g.food,g.people,g.happy,g.hand,g.log,g.over,g.won]);
const expectNoChange=(g,fn)=>{const before=state(g);fn();assert.equal(state(g),before)};
const start=new Game();
assert.deepEqual([...start.board],[[CENTER,'house']]);
assert.equal(start.production().wood,2);assert.equal(start.production().food,4);
assert.equal(frontier(start.board).length,6);
for(let q=-16;q<=16;q++)for(let r=-16;r<=16;r++){
  const id=key(q,r),p=position(id);
  assert.deepEqual(axial(id),{q,r});assert.equal(fromWorld(p.x,p.z),id);
  const neighbors=adjacent(id);assert.equal(new Set(neighbors).size,6);
  for(const n of neighbors){
    assert.ok(adjacent(n).includes(id));
    const b=position(n),toward=f=>fromWorld(p.x+(b.x-p.x)*f,p.z+(b.z-p.z)*f);
    assert.equal(toward(.495),id);assert.equal(toward(.505),n);
  }
}
const a=key(1,0),b=key(1,-1);
const board=new Map([[CENTER,'house']]);
assert.equal(coast(board).length,6);board.set(a,'forest');assert.equal(coast(board).length,10);
board.set(b,'forest');assert.equal(coast(board).length,12);
assert.ok(coast(board).every(e=>!board.has(adjacent(e.id)[e.side])));
assert.equal(frontier(board).length,new Set(frontier(board)).size);

{
  const g=new Game();const c=give(g,'house');
  for(const id of [CENTER,key(-2,2),key(1,1),-1,NaN,Infinity,1.2])expectNoChange(g,()=>{
    assert.equal(g.preview(c,id),null);assert.equal(g.play(c,id),null);
  });
  g.wood=c.cost-1;expectNoChange(g,()=>assert.equal(g.play(c,a),null));
  g.wood=20;const forest=give(g,'forest');assert.ok(g.play(forest,a));give(g,'forest');
  const before=g.production();const preview=g.preview(forest,b);assert.equal(preview.wood,4);
  assert.deepEqual(preview.neighbors,[a]);assert.equal(preview.localBonus,true);
  const after=g.play(forest,b);assert.equal(after.wood-before.wood,4);
  expectNoChange(g,()=>assert.equal(g.play(forest,b),null));
  const event=give(g,'festival'),land=[...g.board],oldTurn=g.turn;
  expectNoChange(g,()=>assert.equal(g.play(event,key(-1,0)),null));
  assert.ok(g.play(event,CENTER));assert.deepEqual([...g.board],land);assert.equal(g.turn,oldTurn+1);
}
{
  const g=new Game();
  g.board=new Map([[CENTER,'house'],[a,'forest'],[key(2,0),'lumber'],[b,'berry'],[key(-1,0),'farm']]);
  g.people=2;const p=g.production();assert.equal(p.used,2);assert.equal(p.wood,4);
  assert.equal(p.rows.find(r=>r.i===key(2,0)).active,false);
  assert.equal(p.rows.find(r=>r.i===b).food,5);
  const c=give(g,'manor'),target=key(0,-1),prev=g.preview(c,target);
  const next=g.play(c,target);assert.equal(next.food-p.food,prev.food);assert.equal(next.wood-p.wood,prev.wood);
  assert.equal(g.people,6);assert.ok(g.weights().some(x=>x.c.id==='farm'));
}
{
  const g=new Game();g.people=5;g.food=0;g.happy=10;
  g.play(give(g,'forest'),a);assert.equal(g.people,4);assert.equal(g.happy,0);assert.equal(g.over,true);
}
for(const [p,expected] of [[10,true],[4,false]]){
  const g=new Game();g.food=300;g.people=p;g.wood=100;
  for(let j=1;j<=15;j++){
    assert.ok(g.play(give(g,'forest'),key(-j,0)));assert.equal(g.board.size,j+1);
    assert.equal(g.over,j===15);
  }
  assert.equal(g.won,expected);expectNoChange(g,()=>assert.equal(g.play(g.hand[0],key(-16,0)),null));
}
let wins=0,complete=0;
for(let seed=1;seed<=100;seed++){
  let x=seed;const rng=()=>{x=(Math.imul(x,1664525)+1013904223)>>>0;return x/2**32};
  const g=new Game(rng);let moves=0;
  while(!g.over){
    assert.ok(++moves<=15);assert.equal(new Set(g.hand).size,3);
    const sites=frontier(g.board),target=sites[Math.floor(rng()*sites.length)];
    const order=g.food<g.people*2?['farm','berry','harvest','forest','garden']:g.people<10?['manor','house','berry','forest']:['garden','farm','berry','store','forest'];
    const rank=c=>order.indexOf(c.id)<0?99:order.indexOf(c.id);
    const c=[...g.hand].sort((a,b)=>rank(a)-rank(b)).find(c=>g.valid(c,c.event?CENTER:target));assert.ok(c);
    const id=c.event?CENTER:target,land=g.board.size,wood=g.wood,food=g.food,happy=g.happy;
    const mouths=g.people+(c.id==='manor'?4:c.id==='house'?2:0),before=g.production();
    let preview;expectNoChange(g,()=>preview=g.preview(c,id));const actual=g.play(c,id);assert.ok(actual);
    assert.equal(actual.wood-before.wood,preview.wood);assert.equal(actual.food-before.food,preview.food);
    assert.equal(actual.happy-before.happy,preview.happy);assert.equal(g.board.size,land+(c.event?0:1));
    const remainder=food+actual.food-mouths+(c.id==='harvest'?12:c.id==='festival'?-3:0);
    assert.equal(g.wood,wood-c.cost+actual.wood);assert.equal(g.food,Math.max(0,remainder));
    assert.equal(g.people,mouths-(remainder<0?1:0));
    assert.equal(g.happy,Math.max(0,Math.min(100,happy+actual.happy+(c.id==='festival'?16:c.id==='harvest'?-5:0)-(remainder<0?14:0))));
  }
  if(moves===15)complete++;if(g.won)wins++;
}
assert.equal(complete,100);
console.log('PASS: axial round trips, six sides, edge picking, outer coast, frontier, illegal and instant moves, previews, workers, food and forest bonuses, growth cap and both end states.');
console.log(`100 seeded runs: ${complete} reached turn 15; ${wins} won. Resource changes checked on every move.`);

{
  const g=new Game();g.board=new Map([[CENTER,'house'],[a,'house'],[b,'forest']]);
  g.wood=17;g.food=29;g.people=8;g.happy=63;g.turn=7;
  const counters=()=>[g.wood,g.food,g.people,g.happy,g.turn,g.over,g.won];
  const before=counters(),hand=g.hand,production=g.production();
  assert.equal(g.remove(CENTER),false);assert.equal(g.remove(-1),false);
  assert.equal(g.remove(b),true);assert.equal(g.board.has(b),false);
  assert.deepEqual(counters(),before);assert.equal(g.hand,hand);
  assert.equal(g.production().wood,production.wood-2);
  assert.equal(g.remove(b),false);
  g.hand=[cards[0]];assert.equal(g.valid(cards[0],b),true);
  assert.equal(g.remove(a),true);assert.deepEqual(counters(),before);
  g.over=true;assert.equal(g.remove(CENTER),false);
  g.board.set(a,'house');assert.equal(g.remove(a),false);assert.equal(g.board.has(a),true);
}
console.log('PASS: demolition removes land and future production without refunds, yields, population changes, redraws or turn advancement; centre and ended runs protected.');
