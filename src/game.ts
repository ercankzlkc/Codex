import { CENTER, adjacent, canGrow,axial } from './hex.ts';
export type Kind =
  | 'stone' | 'forest' | 'berry' | 'house' | 'lumber' | 'farm'
  | 'harbor' | 'fisher' | 'store' | 'garden' | 'manor' | 'festival' | 'harvest';

export type CostResource='wood'|'stone'|'food'|'gold';
export const REROLL_COST=5;
/** Harvest effort scales with the actual load, including adjacency bonuses. */
export function harvestSeconds(category:string|null,amount:number){
  return category==='berry'?amount*1.5:category==='farm'?amount*2:2.4;
}
export interface Card {
  id: Kind;
  name: string;
  cost: Partial<Record<CostResource,number>>;
  unlock?: number;
  workers: number;
  desc: string;
  bonus: string;
  event?: boolean;
}

export const cards: Card[] = [
  {id:'harbor',name:'Liman',cost:{wood:24,stone:16},unlock:60,workers:0,desc:'Tüccar gemisi · ürün satışı',bonus:'Köyde yalnızca bir liman · ilk gemi hemen gelir'},
  {id:'stone',name:'Taş Ocağı',cost:{wood:3},workers:2,desc:'+3 taş / teslimat',bonus:'Kazmayla çıkarılır · yeniden oluşur'},
  { id:'fisher',name:'Balıkçı Kulübesi',cost:{wood:7,stone:2},workers:1,desc:'+3 balık / teslimat',bonus:'Kıyıda iskele · olta balıkçılığı' },
  { id: 'forest', name: 'Orman', cost: {wood:2}, workers: 1, desc: '+2 odun / teslimat', bonus: 'Komşu orman +1 · oduncu kulübesi +2 odun' },
  { id: 'berry', name: 'Çilek Bahçesi', cost: {wood:3}, workers: 1, desc: '+4 çilek / teslimat · 6 sn', bonus: 'Komşu orman: +1 çilek · +1,5 sn' },
  { id: 'house', name: 'Ev', cost: {wood:5}, workers: 0, desc: '+2 nüfus · +2 işçi', bonus: 'Komşu bahçe: +1 refah / teslimat' },
  { id: 'lumber',unlock:10, name: 'Oduncu Kulübesi', cost: {wood:6,stone:2}, workers: 0, desc: 'Komşu ormanlara +2 odun', bonus: 'Her komşu ormana +2 odun' },
  { id: 'farm',unlock:24, name: 'Çiftlik', cost: {wood:7,stone:3}, workers: 2, desc: '+4 buğday / teslimat · 8 sn', bonus: 'Komşu depo: +2 buğday · +4 sn' },
  { id: 'store',unlock:10, name: 'Depo', cost: {wood:8,stone:4}, workers: 0, desc: '60 ürün kapasitesi', bonus: 'Ürünler teslim edilince depoya eklenir' },
  { id: 'garden',unlock:24, name: 'Bahçe', cost: {stone:4,food:2}, workers: 1, desc: '+2 refah / teslimat', bonus: 'Komşu ev başına +1 refah' },
  { id: 'manor',unlock:40, name: 'Büyük Ev', cost: {wood:14,stone:10}, workers: 0, desc: '+4 nüfus · +4 işçi', bonus: 'Komşu bahçe: +1 refah / teslimat' },
  { id: 'festival',unlock:40, name: 'Şenlik', cost: {food:6,gold:2}, workers: 0, desc: '+16 refah', bonus: 'Anında uygulanır · yer kaplamaz', event: true },
  { id: 'harvest', name: 'Acil Hasat', cost: {wood:2}, workers: 0, desc: '+12 yiyecek · −5 refah', bonus: 'Anında uygulanır · yer kaplamaz', event: true },
];

export const MILESTONES=[
  {population:10,name:'Küçük Yerleşim',gold:10,description:'Depoları büyüt, odun üretimini güçlendir.'},
  {population:24,name:'Köy',gold:15,description:'Tarlalar ve bahçelerle köyünü besle.'},
  {population:40,name:'Gelişen Köy',gold:20,description:'Büyük evlerle büyü, şenlikle refahı artır.'},
  {population:60,name:'Kıyı Kasabası',gold:25,description:'Liman kartın hazır. Limanı kur, tüccarlara ürün sat.'},
  {population:100,name:'Ticaret Kasabası',gold:40,description:'Tüccarların alış kapasitesi ziyaret başına 40 ürüne yükseldi.'},
] as const;
export type Milestone=typeof MILESTONES[number];
export const TRADE_GOODS=[
  {id:'wood',name:'Odun',price:1},{id:'stone',name:'Taş',price:2},
  {id:'berry',name:'Çilek',price:1},{id:'wheat',name:'Buğday',price:2},{id:'fish',name:'Balık',price:3},
] as const;
export type TradeGood=typeof TRADE_GOODS[number]['id'];

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

export type Resource='wood'|'stone'|'food'|'happy';
export type WorkCategory='stone'|'wood'|'berry'|'farm'|'fish'|'garden';
export type FoodKind='berry'|'wheat'|'fish';
export const WORK_CATEGORIES:WorkCategory[]=['wood','stone','berry','farm','fish','garden'];
export const BUILDING_SCALE=.80;
export function hexDistance(a:number,b:number){
  const p=axial(a),q=axial(b);
  return Math.max(Math.abs(p.q-q.q),Math.abs(p.r-q.r),Math.abs(p.q+p.r-q.q-q.r));
}
export class Game {
  board=new Map<number,Kind>([[CENTER,'house']]);
  wood=18;stone=0;happy=70;gold=10;
  paused=false;
  peakPopulation=1;
  reached=new Set<number>();
  milestoneQueue:Milestone[]=[];
  harborReward=false;
  tradeClock=0;
  tradeSold=0;
  get harborId(){return [...this.board].find(([,kind])=>kind==='harbor')?.[0]}
  get merchantPresent(){return this.harborId!==undefined&&this.tradeClock>=6&&this.tradeClock<46}
  get tradeCapacity(){return this.reached.has(100)?40:20}
  get merchantCountdown(){return Math.ceil(this.merchantPresent?46-this.tradeClock:this.tradeClock<6?6-this.tradeClock:126-this.tradeClock)}
  get nextMilestone(){return MILESTONES.find(m=>!this.reached.has(m.population))}
  private unlockMilestones(){
    this.peakPopulation=Math.max(this.peakPopulation,this.people);
    for(const m of MILESTONES)if(this.peakPopulation>=m.population&&!this.reached.has(m.population)){
      this.reached.add(m.population);this.gold+=m.gold;this.milestoneQueue.push(m);
      if(m.population===60)this.harborReward=true;
    }
  }
  availableCards(){return cards.filter(c=>c.id!=='harbor'&&(!c.unlock||this.reached.has(c.unlock)))}
  canAfford(card:Card){
    if(!Object.entries(card.cost).every(([key,n])=>this[key as CostResource]>=n))return false;
    // Keep enough wood to establish the first renewable wood source.
    return card.id==='forest'||[...this.board.values()].includes('forest')||this.wood-(card.cost.wood??0)>=2;
  }
  rerollHand(){
    if(this.gold<REROLL_COST)return false;
    const old=this.hand.filter(c=>c.id!=='harbor');
    this.gold-=REROLL_COST;this.draw(old);return true;
  }
  tradeStock(good:TradeGood){return good==='wood'||good==='stone'?this[good]:this.foods[good]}
  sell(good:TradeGood,amount=5){
    if(!this.merchantPresent)return 0;
    const item=TRADE_GOODS.find(g=>g.id===good);if(!item)return 0;
    const count=Math.max(0,Math.min(Math.floor(amount),this.tradeStock(good),this.tradeCapacity-this.tradeSold));
    if(!count)return 0;this.spendStock(good,count);this.tradeSold+=count;this.gold+=count*item.price;return count;
  }
  private spendStock(good:TradeGood,amount:number){
    if(good==='wood'||good==='stone')this[good]-=amount;else this.foods[good]-=amount;
    let left=amount;for(const stock of this.storageStocks.values()){const take=Math.min(left,stock[good]);stock[good]-=take;left-=take;if(!left)break}
  }
  foods:Record<FoodKind,number>={berry:8,wheat:4,fish:0};
  autoWorkers=true;
  assignments:Record<WorkCategory,number>={wood:0,stone:0,berry:0,farm:0,fish:0,garden:0};
  private meal=0;
  private mealPerson=0;
  private meals:{id:number;ate:boolean}[]=[];
  storageLevels=new Map<number,number>([[CENTER,1]]);
  storageStocks=new Map<number,{wood:number;stone:number;berry:number;wheat:number;fish:number}>([[CENTER,{wood:18,stone:0,berry:8,wheat:4,fish:0}]]);
  storageCapacity(id:number){return this.storageStocks.has(id)?(id===CENTER?80:60)*(this.storageLevels.get(id)??1):0}
  storageUsed(id:number){const stock=this.storageStocks.get(id);return stock?Object.values(stock).reduce((a,b)=>a+b,0):0}
  storageFree(id:number){return Math.max(0,this.storageCapacity(id)-this.storageUsed(id))}
  canStore(id:number,resource:Resource){return this.storageStocks.has(id)&&(resource==='happy'||this.storageFree(id)>0)}
  upgradeCost(id:number){return 12*(this.storageLevels.get(id)??1)}
  upgradeStore(id:number){
    if(!this.storageStocks.has(id)||this.wood<this.upgradeCost(id))return false;
    this.spendWood(this.upgradeCost(id));this.storageLevels.set(id,(this.storageLevels.get(id)??1)+1);return true;
  }
  private spendWood(amount:number){
    this.spendStock('wood',amount);
  }
  private addFood(kind:FoodKind,amount:number){
    for(const [id,stock] of this.storageStocks){const take=Math.min(amount,this.storageFree(id));stock[kind]+=take;this.foods[kind]+=take;amount-=take;if(!amount)break}
  }
  grantResources(amount=1000){
    const stock=this.storageStocks.get(CENTER)!;
    this.wood+=amount;this.stone+=amount;this.gold+=amount;stock.wood+=amount;stock.stone+=amount;
    for(const food of ['berry','wheat','fish'] as const){this.foods[food]+=amount;stock[food]+=amount}
    this.storageLevels.set(CENTER,Math.max(this.storageLevels.get(CENTER)??1,Math.ceil(this.storageUsed(CENTER)/80)));
  }
  takeMeals(){const events=this.meals;this.meals=[];return events}
  wouldSealFishery(id:number){return [...this.board].some(([cell,kind])=>(kind==='fisher'||kind==='harbor')&&adjacent(cell).every(n=>n===id||this.board.has(n)))}
  get food(){return this.foods.berry+this.foods.wheat+this.foods.fish}
  get foodPerMinute(){return this.people*2}
  consumeFood(amount:number){
    let eaten=0;
    while(eaten<amount&&this.food>0){
      const type=(Object.keys(this.foods) as FoodKind[]).sort((a,b)=>this.foods[b]-this.foods[a])[0];
      this.foods[type]--;for(const stock of this.storageStocks.values())if(stock[type]>0){stock[type]--;break}eaten++;
    }
    return eaten;
  }
  tick(dt:number){
    if(this.paused)return;
    if(this.harborId!==undefined){const next=this.tradeClock+dt;if(next>=120)this.tradeSold=0;this.tradeClock=next%120}
    this.meal+=dt*this.people/30;
    const due=Math.floor(this.meal);if(!due)return;
    this.meal-=due;
    for(let i=0;i<due;i++){
      const ate=this.consumeFood(1)>0,id=this.residents[this.mealPerson++%this.people].id;this.meals.push({id,ate});
      if(!ate)this.happy=Math.max(0,this.happy-.35);
    }
  }
  categoryFor(id:number):WorkCategory|null{
    const kind=this.board.get(id);return kind==='stone'?'stone':kind==='forest'?'wood':kind==='berry'?'berry':kind==='farm'?'farm':kind==='fisher'?'fish':kind==='garden'?'garden':null;
  }
  private capacitySize=-1;
  private capacities:Record<WorkCategory,number>={wood:0,stone:0,berry:0,farm:0,fish:0,garden:0};
  workCapacity(category:WorkCategory){
    if(this.capacitySize!==this.board.size){
      this.capacities={wood:0,stone:0,berry:0,farm:0,fish:0,garden:0};
      for(const id of this.board.keys()){const kind=this.categoryFor(id);if(kind)this.capacities[kind]+=this.productAt(id)?.capacity??0}
      this.capacitySize=this.board.size;
    }
    return this.capacities[category];
  }
  workTargets(){
    const result:Record<WorkCategory,number>={wood:0,stone:0,berry:0,farm:0,fish:0,garden:0};
    let left=this.people;
    if(!this.autoWorkers){
      for(const c of WORK_CATEGORIES){result[c]=Math.min(left,this.workCapacity(c),this.assignments[c]);left-=result[c]}
      return result;
    }
    // Assign whole people, one place at a time. A single resident can fill only one job.
    const order:WorkCategory[]=['wood','berry','stone','farm','fish','garden'];
    const capacity=new Map(order.map(c=>[c,this.workCapacity(c)]));
    while(left>0){
      let assigned=false;
      for(const c of order)if(left>0&&result[c]<capacity.get(c)!){result[c]++;left--;assigned=true}
      if(!assigned)break;
    }
    return result;
  }
  changeWorkers(category:WorkCategory,delta:-1|1){
    const targets=this.workTargets(),used=Object.values(targets).reduce((a,b)=>a+b,0);
    if(delta<0&&targets[category]===0||delta>0&&targets[category]>=this.workCapacity(category))return false;
    if(delta>0&&used>=this.people){
      const donor=WORK_CATEGORIES.filter(c=>c!==category&&targets[c]>0).sort((a,b)=>targets[b]-targets[a])[0];
      if(!donor)return false;targets[donor]--;
    }
    this.assignments={...targets,[category]:targets[category]+delta};this.autoWorkers=false;return true;
  }
  residents:{id:number;home:number}[]=[{id:0,home:CENTER}];
  get people(){return this.residents.length}
  hand:Card[]=[];
  rng:()=>number;
  constructor(rng=Math.random){this.rng=rng;this.hand=['forest','berry','house'].map(id=>cards.find(c=>c.id===id)!)}
  neighbors(i:number){return adjacent(i)}
  draw(previous:Card[]=[]){
    const available=this.availableCards(),fresh=available.filter(c=>!previous.includes(c));
    const pool=fresh.length>=3?fresh:available;
    this.hand=[];
    while(this.hand.length<3)this.hand.push(pool.splice(Math.floor(this.rng()*pool.length),1)[0]);
    if(!this.hand.some(c=>this.canAfford(c))){
      const affordable=available.filter(c=>this.canAfford(c));
      if(affordable.length)this.hand[0]=affordable[Math.floor(this.rng()*affordable.length)];
      else if(![...this.board.values()].includes('forest'))this.hand[0]=cards.find(c=>c.id==='forest')!;
    }
    if(this.harborReward&&this.harborId===undefined)this.hand.push(cards.find(c=>c.id==='harbor')!);
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
          food = 4 + neighbors.filter(k => k === 'store').length * 2;
          bonus = food > 4;
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
    return this.hand.includes(card)&&this.canAfford(card)&&(card.id!=='harbor'||this.harborId===undefined)
      &&(card.event?this.board.has(i):canGrow(this.board,i)&&!this.wouldSealFishery(i))&&(!['fisher','harbor'].includes(card.id)||adjacent(i).some(n=>!this.board.has(n)));
  }
  preview(card:Card,i:number){
    if(!this.valid(card,i))return null;
    const near=adjacent(i).map(n=>this.board.get(n)),people=card.id==='house'?2:card.id==='manor'?4:0;
    const wood=card.id==='forest'?2+near.filter(k=>k==='forest').length+2*near.filter(k=>k==='lumber').length:0;
    const food=card.id==='berry'?4+near.filter(k=>k==='forest').length:card.id==='farm'?4+near.filter(k=>k==='store').length*2:card.id==='fisher'?3:0;
    const stone=card.id==='stone'?3:0;
    const happy=card.id==='garden'?2+near.filter(k=>k==='house'||k==='manor').length:0;
    return {wood,stone,food,happy,people,neighbors:adjacent(i).filter(n=>this.board.has(n)),localBonus:wood>2||food>4||happy>2};
  }
  play(card:Card,i=CENTER){
    this.capacitySize=-1;
    if(!this.valid(card,i))return null;
    for(const [key,n] of Object.entries(card.cost)){if(key==='wood')this.spendWood(n);else if(key==='stone')this.spendStock('stone',n);else if(key==='food')this.consumeFood(n);else if(key==='gold')this.gold-=n}
    if(card.id==='harbor'){this.harborReward=false;this.tradeClock=0;this.tradeSold=0}
    if(!card.event)this.board.set(i,card.id);
    if(card.id==='store'){this.storageLevels.set(i,1);this.storageStocks.set(i,{wood:0,stone:0,berry:0,wheat:0,fish:0})}
    const count=card.id==='house'?2:card.id==='manor'?4:0;
    for(let j=0;j<count;j++)this.residents.push({id:this.residents.length,home:i});
    if(card.id==='festival'){this.happy=Math.min(100,this.happy+16);}
    if(card.id==='harvest'){this.addFood('berry',12);this.happy=Math.max(0,this.happy-5)}
    if(!this.autoWorkers)this.assignments=this.workTargets();
    this.unlockMilestones();this.draw();return this.production();
  }
  remove(i:number){
    this.capacitySize=-1;
    if(i===CENTER||!this.board.has(i))return false;
    if(this.board.get(i)==='forest'&&this.wood<2&&[...this.board.values()].filter(k=>k==='forest').length===1)return false;
    const stock=this.storageStocks.get(i);
    if(stock){this.wood-=stock.wood;this.stone-=stock.stone;for(const kind of ['berry','wheat','fish'] as const)this.foods[kind]-=stock[kind];this.storageStocks.delete(i);this.storageLevels.delete(i)}
    if(this.board.get(i)==='harbor')this.harborReward=true;
    this.board.delete(i);if(!this.autoWorkers)this.assignments=this.workTargets();for(const r of this.residents)if(r.home===i)r.home=CENTER;
    if(this.harborReward&&!this.hand.some(c=>c.id==='harbor'))this.hand.push(cards.find(c=>c.id==='harbor')!);
    return true;
  }
  productAt(id:number):{resource:Resource;amount:number;capacity:number}|null{
    const kind=this.board.get(id),near=adjacent(id).map(i=>this.board.get(i));
    if(kind==='fisher'&&adjacent(id).some(n=>!this.board.has(n)))return {resource:'food',amount:3,capacity:1};
    if(kind==='stone')return {resource:'stone',amount:3,capacity:2};
    if(kind==='forest')return {resource:'wood',amount:2+near.filter(k=>k==='forest').length+2*near.filter(k=>k==='lumber').length,capacity:3};
    if(kind==='berry')return {resource:'food',amount:4+near.filter(k=>k==='forest').length,capacity:2};
    if(kind==='farm')return {resource:'food',amount:4+near.filter(k=>k==='store').length*2,capacity:2};
    if(kind==='garden')return {resource:'happy',amount:2+near.filter(k=>k==='house'||k==='manor').length,capacity:1};
    return null;
  }
  storageFor(source:number){
    return [...this.board].filter(([id,kind])=>(id===CENTER||kind==='store'))
      .sort(([a],[b])=>hexDistance(source,a)-hexDistance(source,b)).map(([id])=>id);
  }
  deliver(source:number,store:number,resource:Resource,amount:number){
    const recipe=this.productAt(source);
    if(!recipe||recipe.resource!==resource||!this.storageFor(source).includes(store))return 0;
    const accepted=Math.max(0,Math.min(recipe.amount,Math.floor(amount),resource==='happy'?Infinity:this.storageFree(store)));
    if(resource==='happy'){const before=this.happy;this.happy=Math.min(100,this.happy+accepted);return Number((this.happy-before).toFixed(2))}
    const stock=this.storageStocks.get(store);if(!stock)return 0;
    if(resource==='food'){const kind=this.board.get(source),food:FoodKind=kind==='fisher'?'fish':kind==='farm'?'wheat':'berry';this.foods[food]+=accepted;stock[food]+=accepted}else if(resource==='stone'){this.stone+=accepted;stock.stone+=accepted}else{this.wood+=accepted;stock.wood+=accepted}
    return accepted;
  }
}
