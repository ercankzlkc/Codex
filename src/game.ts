import { CENTER, adjacent, canGrow,axial } from './hex.ts';
export type Kind =
  | 'forest' | 'berry' | 'house' | 'lumber' | 'farm'
  | 'store' | 'garden' | 'manor' | 'festival' | 'harvest';

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
export const STORAGE_RADIUS=3;
export function hexDistance(a:number,b:number){
  const p=axial(a),q=axial(b);
  return Math.max(Math.abs(p.q-q.q),Math.abs(p.r-q.r),Math.abs(p.q+p.r-q.q-q.r));
}
export class Game {
  board=new Map<number,Kind>([[CENTER,'house']]);
  wood=18;food=12;happy=70;
  residents:{id:number;home:number}[]=[{id:0,home:CENTER}];
  get people(){return this.residents.length}
  hand:Card[]=[];
  rng:()=>number;
  constructor(rng=Math.random){this.rng=rng;this.hand=[cards[0],cards[1],cards[2]]}
  neighbors(i:number){return adjacent(i)}
  draw(){
    const pool=cards.filter(c=>!['farm','manor'].includes(c.id)||this.people>=3);
    this.hand=[];
    while(this.hand.length<3)this.hand.push(pool.splice(Math.floor(this.rng()*pool.length),1)[0]);
    if(!this.hand.some(c=>c.cost<=this.wood))this.hand[0]=cards[0];
  }
  production():Production{return this.calculateProduction(this.board,this.people)}
  /** Pure evaluation shared by the actual turn and placement previews. */
  private calculateProduction(board: ReadonlyMap<number, Kind>, people: number): Production {
    let used = 0;
    const active = new Set<number>();
    const isFood = (kind: Kind | null) => kind === 'berry' || kind === 'farm';
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
      &&(card.event?this.board.has(i):canGrow(this.board,i));
  }
  preview(card:Card,i:number){
    if(!this.valid(card,i))return null;
    const before=this.production(),board=new Map(this.board);
    if(!card.event)board.set(i,card.id);
    const people=card.id==='house'?2:card.id==='manor'?4:0;
    const after=this.calculateProduction(board,this.people+people);
    return {wood:after.wood-before.wood,food:after.food-before.food,happy:after.happy-before.happy,people,
      neighbors:adjacent(i).filter(n=>this.board.has(n)),localBonus:after.rows.find(r=>r.i===i)?.bonus??false};
  }
  play(card:Card,i=CENTER){
    if(!this.valid(card,i))return null;
    this.wood-=card.cost;
    if(!card.event)this.board.set(i,card.id);
    const count=card.id==='house'?2:card.id==='manor'?4:0;
    for(let j=0;j<count;j++)this.residents.push({id:this.residents.length,home:i});
    if(card.id==='festival'){this.happy=Math.min(100,this.happy+16);this.food-=3}
    if(card.id==='harvest'){this.food+=12;this.happy=Math.max(0,this.happy-5)}
    this.draw();return this.production();
  }
  remove(i:number){
    if(i===CENTER||!this.board.has(i))return false;
    this.board.delete(i);for(const r of this.residents)if(r.home===i)r.home=CENTER;
    return true;
  }
  productAt(id:number):{resource:Resource;amount:number;capacity:number}|null{
    const kind=this.board.get(id),near=adjacent(id).map(i=>this.board.get(i));
    if(kind==='forest')return {resource:'wood',amount:2+near.filter(k=>k==='forest').length+2*near.filter(k=>k==='lumber').length,capacity:1+near.filter(k=>k==='lumber').length};
    if(kind==='berry')return {resource:'food',amount:4+near.filter(k=>k==='forest').length,capacity:1};
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
    if(resource==='happy'){const before=this.happy;this.happy=Math.min(100,this.happy+accepted);return this.happy-before}
    this[resource]+=accepted;return accepted;
  }
}
