import { CENTER, adjacent, canGrow,axial } from './hex.ts';
export type Kind =
  | 'forest' | 'berry' | 'house' | 'lumber' | 'farm'
  | 'fisher' | 'store' | 'garden' | 'manor' | 'festival' | 'harvest';

export interface Card {
  id: Kind;
  name: string;
  cost: number;
  workers: number;
  desc: string;
  bonus: string;
  event?: boolean;
}

export const cards: Card[] = [
  { id:'fisher',name:'Balıkçı Kulübesi',cost:7,workers:1,desc:'+3 balık / teslimat',bonus:'Kıyıda iskele · olta balıkçılığı' },
  { id: 'forest', name: 'Orman', cost: 0, workers: 1, desc: '+2 odun / teslimat', bonus: 'Komşu orman +1 · oduncu kulübesi +2 odun' },
  { id: 'berry', name: 'Çilek Bahçesi', cost: 2, workers: 1, desc: '+4 yiyecek / teslimat', bonus: 'Komşu orman: +1 yiyecek' },
  { id: 'house', name: 'Ev', cost: 5, workers: 0, desc: '+2 nüfus · +2 işçi', bonus: 'Komşu bahçe: +1 refah / teslimat' },
  { id: 'lumber', name: 'Oduncu Kulübesi', cost: 5, workers: 0, desc: 'Komşu ormanlara +2 odun', bonus: 'Her komşu ormana +2 odun' },
  { id: 'farm', name: 'Çiftlik', cost: 7, workers: 2, desc: '+4 yiyecek / teslimat', bonus: 'Komşu depo: +2 yiyecek' },
  { id: 'store', name: 'Depo', cost: 6, workers: 0, desc: '3 altıgen toplama alanı', bonus: 'Ürünler teslim edilince depoya eklenir' },
  { id: 'garden', name: 'Bahçe', cost: 3, workers: 1, desc: '+2 refah / teslimat', bonus: 'Komşu ev başına +1 refah' },
  { id: 'manor', name: 'Büyük Ev', cost: 10, workers: 0, desc: '+4 nüfus · +4 işçi', bonus: 'Komşu bahçe: +1 refah / teslimat' },
  { id: 'festival', name: 'Şenlik', cost: 4, workers: 0, desc: '+16 refah · −3 yiyecek', bonus: 'Anında uygulanır · yer kaplamaz', event: true },
  { id: 'harvest', name: 'Acil Hasat', cost: 0, workers: 0, desc: '+12 yiyecek · −5 refah', bonus: 'Anında uygulanır · yer kaplamaz', event: true },
];

export interface Production {
  wood: number;
  food: number;
  happy: number;
  used: number;
  idle: number;
  rows: {
    i: number;
    wood: number;
    food: number;
    happy: number;
    active: boolean;
    bonus: boolean;
  }[];
}

export type Resource='wood'|'food'|'happy';
export type WorkCategory='wood'|'berry'|'farm'|'fish';
export type FoodKind='berry'|'wheat'|'fish';
export const WORK_CATEGORIES:WorkCategory[]=['wood','berry','farm','fish'];
export const STORAGE_RADIUS=3;
export const BUILDING_SCALE=.80;
export function hexDistance(a:number,b:number){
  const p=axial(a),q=axial(b);
  return Math.max(Math.abs(p.q-q.q),Math.abs(p.r-q.r),Math.abs(p.q+p.r-q.q-q.r));
}
export class Game {
  board=new Map<number,Kind>([[CENTER,'house']]);
  wood=18;happy=70;
  foods:Record<FoodKind,number>={berry:8,wheat:4,fish:0};
  priorities:Record<WorkCategory,number>={wood:35,berry:35,farm:20,fish:10};
  private meal=0;
  get food(){return this.foods.berry+this.foods.wheat+this.foods.fish}
  get foodPerMinute(){return this.people*2}
  consumeFood(amount:number){
    let eaten=0;
    while(eaten<amount&&this.food>0){
      const type=(Object.keys(this.foods) as FoodKind[]).sort((a,b)=>this.foods[b]-this.foods[a])[0];
      this.foods[type]--;eaten++;
    }
    return eaten;
  }
  tick(dt:number){
    this.meal+=dt*this.people/30;
    const due=Math.floor(this.meal);if(!due)return;
    this.meal-=due;const eaten=this.consumeFood(due);
    if(eaten<due)this.happy=Math.max(0,this.happy-(due-eaten)*.35);
  }
  categoryFor(id:number):WorkCategory|null{
    const kind=this.board.get(id);return kind==='forest'?'wood':kind==='berry'?'berry':kind==='farm'?'farm':kind==='fisher'?'fish':null;
  }
  workTargets(){
    const active=WORK_CATEGORIES.filter(category=>[...this.board.keys()].some(id=>this.categoryFor(id)===category&&this.storageFor(id).length));
    const result:Record<WorkCategory,number>={wood:0,berry:0,farm:0,fish:0};
    const sum=active.reduce((n,c)=>n+this.priorities[c],0);if(!sum)return result;
    const shares=active.map(c=>({c,raw:this.people*this.priorities[c]/sum}));
    for(const x of shares)result[x.c]=Math.floor(x.raw);
    let left=this.people-Object.values(result).reduce((a,b)=>a+b,0);
    for(const x of shares.sort((a,b)=>(b.raw%1)-(a.raw%1)))if(left-->0)result[x.c]++;
    return result;
  }
  setPriority(category:WorkCategory,value:number){
    value=Math.max(0,Math.min(100,Math.round(value)));const others=WORK_CATEGORIES.filter(c=>c!==category);
    const sum=others.reduce((n,c)=>n+this.priorities[c],0);this.priorities[category]=value;
    let rest=100-value;
    others.forEach((c,i)=>{const n=i===others.length-1?rest:Math.min(rest,Math.round((100-value)*(sum?this.priorities[c]/sum:1/others.length)));this.priorities[c]=n;rest-=n});
  }
  residents:{id:number;home:number}[]=[{id:0,home:CENTER}];
  get people(){return this.residents.length}
  hand:Card[]=[];
  rng:()=>number;
  constructor(rng=Math.random){this.rng=rng;this.hand=['forest','berry','house'].map(id=>cards.find(c=>c.id===id)!)}
  neighbors(i:number){return adjacent(i)}
  draw(){
    const pool=cards.filter(c=>!['farm','manor'].includes(c.id)||this.people>=3);
    this.hand=[];
    while(this.hand.length<3)this.hand.push(pool.splice(Math.floor(this.rng()*pool.length),1)[0]);
    if(!this.hand.some(c=>c.cost<=this.wood))this.hand[0]=cards.find(c=>c.id==='forest')!;
    if(this.people>=3&&![...this.board.values()].includes('fisher')&&!this.hand.some(c=>c.id==='fisher'))this.hand[2]=cards.find(c=>c.id==='fisher')!;
  }
  production():Production{return this.calculateProduction(this.board,this.people)}
  /** Pure evaluation shared by the actual turn and placement previews. */
  private calculateProduction(board: ReadonlyMap<number, Kind>, people: number): Production {
    let used = 0;
    const active = new Set<number>();
    const isFood = (kind: Kind | null) => kind === 'berry' || kind === 'farm' || kind === 'fisher';
    const priority = [...board].map(([i, k]) => ({ k, i }))
      .sort((a, b) => Number(isFood(b.k) || b.i === CENTER) - Number(isFood(a.k) || a.i === CENTER));
    for (const { k, i } of priority) {
      const card = cards.find(c => c.id === k);
      const workers = i === CENTER ? 0 : card?.workers;
      if (workers !== undefined && used + workers <= people) {
        used += workers;
        active.add(i);
      }
    }

    const rows = [...board].flatMap(([i, kind]) => {
      if (!kind) return [];
      const neighborIndices = this.neighbors(i);
      const neighbors = neighborIndices.map(j => board.get(j));
      let wood = 0, food = 0, happy = 0, bonus = false;
      if (active.has(i)) {
        
        if (kind === 'forest') {
          const count = neighborIndices.filter(j => board.get(j) === 'lumber' && active.has(j)).length;
          wood = 2 + count * 2 + neighbors.filter(k => k === 'forest').length;
          bonus = wood > 2;
        }
        if (kind === 'berry') {
          food = 4 + neighbors.filter(k => k === 'forest').length;
          bonus = food > 4;
        }
        
        if(kind==='fisher')food=3;
        if (kind === 'farm') {
          food = 4 + (neighbors.includes('store') ? 2 : 0);
          bonus = food > 9;
        }
        if (kind === 'garden') {
          happy = 2 + neighbors.filter(k => k === 'house' || k === 'manor').length;
          bonus = happy > 2;
        }
        if ((kind === 'house' || kind === 'manor') && neighbors.includes('garden')) {
          happy = 1;
          bonus = true;
        }
      }
      return [{ i, wood, food, happy, active: active.has(i), bonus }];
    });
    return {
      wood: rows.reduce((sum, row) => sum + row.wood, 0),
      food: rows.reduce((sum, row) => sum + row.food, 0),
      happy: rows.reduce((sum, row) => sum + row.happy, 0),
      used,
      idle: people - used,
      rows,
    };
  }

  valid(card:Card,i:number){
    return this.hand.includes(card)&&card.cost<=this.wood&&(card.id!=='festival'||this.food>=3)
      &&(card.event?this.board.has(i):canGrow(this.board,i))&&(card.id!=='fisher'||adjacent(i).some(n=>!this.board.has(n)));
  }
  preview(card:Card,i:number){
    if(!this.valid(card,i))return null;
    const near=adjacent(i).map(n=>this.board.get(n)),people=card.id==='house'?2:card.id==='manor'?4:0;
    const wood=card.id==='forest'?2+near.filter(k=>k==='forest').length+2*near.filter(k=>k==='lumber').length:0;
    const food=card.id==='berry'?4+near.filter(k=>k==='forest').length:card.id==='farm'?4+near.filter(k=>k==='store').length*2:card.id==='fisher'?3:0;
    const happy=card.id==='garden'?2+near.filter(k=>k==='house'||k==='manor').length:0;
    return {wood,food,happy,people,neighbors:adjacent(i).filter(n=>this.board.has(n)),localBonus:wood>2||food>4||happy>2};
  }
  play(card:Card,i=CENTER){
    if(!this.valid(card,i))return null;
    this.wood-=card.cost;
    if(!card.event)this.board.set(i,card.id);
    const count=card.id==='house'?2:card.id==='manor'?4:0;
    for(let j=0;j<count;j++)this.residents.push({id:this.residents.length,home:i});
    if(card.id==='festival'){this.happy=Math.min(100,this.happy+16);this.consumeFood(3)}
    if(card.id==='harvest'){this.foods.berry+=12;this.happy=Math.max(0,this.happy-5)}
    this.draw();return this.production();
  }
  remove(i:number){
    if(i===CENTER||!this.board.has(i))return false;
    this.board.delete(i);for(const r of this.residents)if(r.home===i)r.home=CENTER;
    return true;
  }
  productAt(id:number):{resource:Resource;amount:number;capacity:number}|null{
    const kind=this.board.get(id),near=adjacent(id).map(i=>this.board.get(i));
    if(kind==='fisher'&&adjacent(id).some(n=>!this.board.has(n)))return {resource:'food',amount:3,capacity:1};
    if(kind==='forest')return {resource:'wood',amount:2+near.filter(k=>k==='forest').length+2*near.filter(k=>k==='lumber').length,capacity:3};
    if(kind==='berry')return {resource:'food',amount:4+near.filter(k=>k==='forest').length,capacity:2};
    if(kind==='farm')return {resource:'food',amount:4+near.filter(k=>k==='store').length*2,capacity:2};
    if(kind==='garden')return {resource:'happy',amount:2+near.filter(k=>k==='house'||k==='manor').length,capacity:1};
    return null;
  }
  storageFor(source:number){
    return [...this.board].filter(([id,kind])=>(id===CENTER||kind==='store')&&hexDistance(source,id)<=(id===CENTER?2:STORAGE_RADIUS))
      .sort(([a],[b])=>hexDistance(source,a)-hexDistance(source,b)).map(([id])=>id);
  }
  deliver(source:number,store:number,resource:Resource,amount:number){
    const recipe=this.productAt(source);
    if(!recipe||recipe.resource!==resource||!this.storageFor(source).includes(store))return 0;
    const accepted=Math.max(0,Math.min(recipe.amount,Math.floor(amount)));
    if(resource==='happy'){const before=this.happy;this.happy=Math.min(100,this.happy+accepted);return Number((this.happy-before).toFixed(2))}
    if(resource==='food'){const kind=this.board.get(source);this.foods[kind==='fisher'?'fish':kind==='farm'?'wheat':'berry']+=accepted}else this.wood+=accepted;
    return accepted;
  }
}
