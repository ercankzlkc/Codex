import {tradeOrder,type Cargo} from './trade';
import { CENTER, adjacent, canGrow,axial } from './hex.ts';
export type Kind =
  | 'stone' | 'forest' | 'berry' | 'house' | 'lumber' | 'farm'
  | 'empty' | 'fisher' | 'store' | 'garden' | 'manor' | 'festival' | 'harvest';

export interface Card {
  id: Kind;
  name: string;
  cost: number;
  workers: number;
  stoneCost?:number;
  foodCost?:number;
  desc: string;
  bonus: string;
  event?: boolean;
}

export const cards: Card[] = [
  {id:'stone',name:'Taş Ocağı',cost:4,workers:2,desc:'+3 taş / teslimat',bonus:'Kazmayla çıkarılır · yeniden oluşur'},
  { id:'fisher',name:'Balıkçı Kulübesi',cost:8,stoneCost:2,workers:1,desc:'+3 balık / teslimat',bonus:'Kıyıda iskele · olta balıkçılığı' },
  { id: 'forest', name: 'Orman', cost: 0, workers: 1, desc: '+2 odun / teslimat', bonus: '35 sn büyür · komşu orman verimi artırır' },
  { id: 'berry', name: 'Çilek Bahçesi', cost: 2, workers: 1, desc: '+4 yiyecek / teslimat', bonus: 'Komşu orman: +1 yiyecek' },
  { id: 'house', name: 'Ev', cost: 8, stoneCost:2, foodCost:4, workers: 0, desc: '2 kişilik yuva', bonus: 'Erzak ve 65 refahla sakinler zamanla gelir' },
  { id: 'lumber', name: 'Oduncu Kulübesi', cost: 8, stoneCost:3, workers: 0, desc: 'Komşu ormanlara +2 odun', bonus: 'Her komşu ormana +2 odun' },
  { id: 'farm', name: 'Çiftlik', cost: 8, stoneCost:3, workers: 2, desc: '+4 yiyecek / teslimat', bonus: 'Komşu depo: +2 yiyecek' },
  { id: 'store', name: 'Depo', cost: 8, stoneCost:4, workers: 0, desc: '60 ürün kapasitesi', bonus: 'Üretime yakın kur · taşıma yolu kısalır' },
  { id: 'garden', name: 'Bahçe', cost: 5, stoneCost:2, workers: 1, desc: '+2 refah / teslimat', bonus: 'Komşu ev başına +1 refah' },
  { id: 'manor', name: 'Büyük Ev', cost: 16, stoneCost:8, foodCost:8, workers: 0, desc: '4 kişilik yuva', bonus: 'Kalabalık köy için · sakinler zamanla gelir' },
  { id: 'festival', name: 'Şenlik', cost: 4, workers: 0, desc: '+16 refah · −3 yiyecek', bonus: 'Anında uygulanır · yer kaplamaz', event: true },
  { id: 'harvest', name: 'Acil Hasat', cost: 0, workers: 0, desc: '+12 yiyecek · −5 refah', bonus: 'En fazla 12 · 90 saniyede yenilenir', event: true },
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

export type Resource='wood'|'stone'|'food'|'happy';
export type WorkCategory='stone'|'wood'|'berry'|'farm'|'fish';
export type FoodKind='berry'|'wheat'|'fish';
export const WORK_CATEGORIES:WorkCategory[]=['wood','stone','berry','farm','fish'];
export const BUILDING_SCALE=.80;
export function hexDistance(a:number,b:number){
  const p=axial(a),q=axial(b);
  return Math.max(Math.abs(p.q-q.q),Math.abs(p.r-q.r),Math.abs(p.q+p.r-q.q-q.r));
}
export class Game {
  board=new Map<number,Kind>([[CENTER,'house'],...adjacent(CENTER).map(id=>[id,'empty'] as [number,Kind])]);
  wood=18;stone=0;happy=70;
  foods:Record<FoodKind,number>={berry:8,wheat:4,fish:0};
  priorities:Record<WorkCategory,number>={wood:30,stone:15,berry:30,farm:15,fish:10};
  elapsed=0;
  hunger=0;
  landPermits=0;
  upgradePermits=0;
  planReadyAt=0;
  arrivalProgress=0;
  readonly buildingLevels=new Map<number,number>([[CENTER,1]]);
  readonly maturing=new Map<number,number>();
  private townEvents:string[]=[];
  get emptyLand(){return [...this.board.values()].filter(k=>k==='empty').length}
  get stage(){
    return [...[{at:0,name:'İlk yerleşim'},{at:3,name:'Kıyı köyü'},{at:6,name:'Ticaret limanı'},{at:10,name:'Küçük kasaba'},{at:16,name:'Canlı koy'}]].reverse().find(s=>this.tradeCompleted>=s.at)!;
  }
  get nextStage(){return [{at:3,name:'Kıyı köyü',perk:'Büyük ev planları'},{at:6,name:'Ticaret limanı',perk:'Seviye 3 yükseltmeler'},{at:10,name:'Küçük kasaba',perk:'Merkeze +80 depo kapasitesi'},{at:16,name:'Canlı koy',perk:'Koyun ustalık rozeti'}].find(s=>s.at>this.tradeCompleted)}
  level(id:number){return this.buildingLevels.get(id)??1}
  bedsAt(id:number){const kind=this.board.get(id);return kind==='house'?(id===CENTER?3:2)+(this.level(id)-1):kind==='manor'?4+(this.level(id)-1)*2:0}
  get housingCapacity(){return [...this.board.keys()].reduce((n,id)=>n+this.bedsAt(id),0)}
  get arrivalReason(){
    if(this.people>=this.housingCapacity)return 'Evlerde boş yatak yok';
    if(this.happy<65)return '65 refah gerekiyor';
    if(this.reserveSeconds<90)return 'En az 90 saniyelik erzak gerekiyor';
    return '';
  }
  get targetHappiness(){
    const variety=Object.values(this.foods).filter(n=>n>0).length;
    const gardens=[...this.board].filter(([,k])=>k==='garden').length;
    const housing=Math.max(0,this.people-this.housingCapacity);
    return Math.max(20,Math.min(90,55+(this.reserveSeconds>=120?15:this.reserveSeconds>=60?5:-15)+Math.max(0,variety-1)*4+Math.min(12,gardens*6)-housing*8));
  }
  takeTownEvents(){const events=this.townEvents;this.townEvents=[];return events}
  chooseDevelopment(choice:'land'|'upgrade'){
    if(!this.tradeRewardPending)return false;
    if(choice==='land')this.landPermits++;else this.upgradePermits++;
    this.tradeRewardPending=false;this.draw();return true;
  }
  canExpand(id:number){return this.landPermits>0&&canGrow(this.board,id)&&!this.wouldSealFishery(id)}
  expand(id:number){if(!this.canExpand(id))return false;this.landPermits--;this.board.set(id,'empty');return true}
  upgradePrice(id:number){return {wood:6*this.level(id),stone:2*this.level(id)}}
  upgradeReason(id:number){
    const kind=this.board.get(id);if(!kind||kind==='empty')return 'Önce bu arsaya yapı kur';
    if(this.level(id)>=3)return 'En yüksek seviye';
    if(this.level(id)===2&&this.tradeCompleted<6)return 'Seviye 3 için Ticaret Limanı · 6 sefer';
    if(this.maturing.has(id))return 'Önce ağaçlar büyüsün';
    if(this.upgradePermits<1)return 'Ticaretten bir yükseltme hakkı seç';
    const price=this.upgradePrice(id);
    if(this.wood<price.wood||this.stone<price.stone)return `${price.wood} odun ve ${price.stone} taş gerekiyor`;
    return '';
  }
  upgradeEffect(id:number){
    const kind=this.board.get(id);return this.bedsAt(id)?`+${kind==='manor'?2:1} yatak${id===CENTER?' · +80 depo kapasitesi':''}`:kind==='store'?'+60 depo kapasitesi':kind==='lumber'?'+2 odun / komşu orman teslimatı':kind==='garden'?'+1 refah / teslimat':'+2 ürün / teslimat';
  }
  upgradeBuilding(id:number){
    if(this.upgradeReason(id))return false;const price=this.upgradePrice(id);this.spendWood(price.wood);this.spendStone(price.stone);this.upgradePermits--;this.buildingLevels.set(id,this.level(id)+1);
    if(this.storageStocks.has(id))this.storageLevels.set(id,(this.storageLevels.get(id)??1)+1);return true;
  }
  refreshPlans(){if(this.elapsed<this.planReadyAt)return false;this.planReadyAt=this.elapsed+20;this.draw();return true}

  tradeCompleted=0;
  tradeRewardPending=false;
  reliefReadyAt=0;
  private foodDeliveries:{time:number;amount:number}[]=[];
  readonly haulStats=new Map<number,{seconds:number;walk:number;trips:number}>();
  get order(){return tradeOrder(this.tradeCompleted-(this.tradeRewardPending?1:0))}
  get workPace(){return 1-this.hunger*.25}
  get reserveSeconds(){return Math.floor(this.food/Math.max(1,this.foodPerMinute)*60)}
  get foodIncome(){return this.foodDeliveries.reduce((n,d)=>n+d.amount,0)*60/Math.max(30,Math.min(60,this.elapsed))}
  get foodNet(){return this.foodIncome-this.foodPerMinute}
  get foodState(){return this.food===0?'empty':this.reserveSeconds<60?'low':this.elapsed>=60&&this.foodNet<0?'watch':'steady'}
  housingFoodCost(card:Card){return card.foodCost??0}
  cardReason(card:Card){
    if(card.cost>this.wood)return `${card.cost} odun gerekiyor`;
    if((card.stoneCost??0)>this.stone)return `${card.stoneCost} taş gerekiyor`;
    const provision=this.housingFoodCost(card);
    if(provision&&this.food<provision+this.people)return `${provision} hazırlık yiyeceği + ${this.people} köy payı gerekiyor`;
    if(card.id==='festival'&&this.food<3+this.people)return 'Şenlikten sonra köye 30 saniyelik yiyecek kalmalı';
    if(card.id==='harvest'&&this.elapsed<this.reliefReadyAt)return `Acil hasat ${Math.ceil(this.reliefReadyAt-this.elapsed)} sn sonra hazır`;
    if(card.id==='harvest'&&![...this.storageStocks.keys()].some(id=>this.storageFree(id)>0))return 'Erzak için depoda yer aç';
    return '';
  }
  emergencyHarvest(){
    const card=cards.find(c=>c.id==='harvest')!;if(this.cardReason(card))return 0;
    const before=this.food;this.addFood('berry',12);this.reliefReadyAt=this.elapsed+90;this.happy=Math.max(0,this.happy-5);return this.food-before;
  }
  cargoAmount(cargo:Cargo){return cargo==='wood'?this.wood:cargo==='stone'?this.stone:this.foods[cargo]}
  get tradeReason(){
    if(this.tradeRewardPending)return 'Önce gelişim ödülünü seç';
    const needs=this.order.needs;
    if((Object.entries(needs) as [Cargo,number][]).some(([c,n])=>this.cargoAmount(c)<n))return 'Ürünlerin depoya ulaşmasını bekle';
    const foodCost=(needs.berry??0)+(needs.wheat??0)+(needs.fish??0);
    if(this.food-foodCost<this.people)return `Gönderimden sonra köye ${this.people} yiyecek kalmalı`;
    return '';
  }
  shipTrade(){
    if(this.tradeReason)return false;const previousStage=this.stage.at;
    for(const [cargo,amount] of Object.entries(this.order.needs) as [Cargo,number][]){
      if(cargo==='wood')this.wood-=amount;else if(cargo==='stone')this.stone-=amount;else this.foods[cargo]-=amount;
      let left=amount;for(const stock of this.storageStocks.values()){const take=Math.min(left,stock[cargo]);stock[cargo]-=take;left-=take;if(!left)break}
    }
    this.tradeCompleted++;this.tradeRewardPending=true;this.happy=Math.min(100,this.happy+4);if(this.stage.at!==previousStage)this.townEvents.push(`Yeni aşama · ${this.stage.name}`);return true;
  }
  haulInfo(source:number){
    const store=this.storageFor(source)[0];const distance=store===undefined?Infinity:hexDistance(source,store);
    return {store,distance,label:distance<=1?'Depo yakın':distance<=2?'Orta taşıma yolu':'Uzun taşıma yolu',stats:this.haulStats.get(source)};
  }
  noteTrip(source:number,seconds:number,walk:number){
    const old=this.haulStats.get(source),weight=old?Math.min(5,old.trips):0;
    this.haulStats.set(source,{seconds:((old?.seconds??0)*weight+seconds)/(weight+1),walk:((old?.walk??0)*weight+walk)/(weight+1),trips:(old?.trips??0)+1});
  }
  private meal=0;
  private mealPerson=0;
  private meals:{id:number;ate:boolean}[]=[];
  storageLevels=new Map<number,number>([[CENTER,1]]);
  storageStocks=new Map<number,{wood:number;stone:number;berry:number;wheat:number;fish:number}>([[CENTER,{wood:18,stone:0,berry:8,wheat:4,fish:0}]]);
  storageCapacity(id:number){return this.storageStocks.has(id)?(id===CENTER?80:60)*(this.storageLevels.get(id)??1)+(id===CENTER&&this.tradeCompleted>=10?80:0):0}
  storageUsed(id:number){const stock=this.storageStocks.get(id);return stock?Object.values(stock).reduce((a,b)=>a+b,0):0}
  storageFree(id:number){return Math.max(0,this.storageCapacity(id)-this.storageUsed(id))}
  canStore(id:number,resource:Resource){return this.storageStocks.has(id)&&(resource==='happy'||this.storageFree(id)>0)}
  upgradeCost(id:number){return 12*(this.storageLevels.get(id)??1)}
  upgradeStore(id:number){return this.storageStocks.has(id)&&this.upgradeBuilding(id)}
  private spendStone(amount:number){this.stone-=amount;let left=amount;for(const stock of this.storageStocks.values()){const take=Math.min(left,stock.stone);stock.stone-=take;left-=take;if(!left)break}}
  private spendWood(amount:number){
    this.wood-=amount;let left=amount;
    for(const stock of this.storageStocks.values()){const take=Math.min(left,stock.wood);stock.wood-=take;left-=take;if(!left)break}
  }
  private addFood(kind:FoodKind,amount:number){
    for(const [id,stock] of this.storageStocks){const take=Math.min(amount,this.storageFree(id));stock[kind]+=take;this.foods[kind]+=take;amount-=take;if(!amount)break}
  }
  takeMeals(){const events=this.meals;this.meals=[];return events}
  wouldSealFishery(id:number){return [...this.board].some(([cell,kind])=>kind==='fisher'&&adjacent(cell).every(n=>n===id||this.board.has(n)))}
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
    this.elapsed+=dt;
    for(const [id,left] of this.maturing){if(left<=dt){this.maturing.delete(id);this.townEvents.push('Orman büyüdü · oduncular çalışmaya başlayabilir')}else this.maturing.set(id,left-dt)}
    this.happy+=(this.targetHappiness-this.happy)*(1-Math.exp(-dt/55));
    if(!this.arrivalReason){
      this.arrivalProgress+=dt;
      if(this.arrivalProgress>=55){
        const home=[...this.board.keys()].find(id=>this.residents.filter(r=>r.home===id).length<this.bedsAt(id));
        if(home!==undefined){this.residents.push({id:this.residents.length,home});this.townEvents.push(`Yeni sakin geldi · ${this.people} kişi`)}this.arrivalProgress=0;
      }
    }else this.arrivalProgress=Math.max(0,this.arrivalProgress-dt*.2);
    this.foodDeliveries=this.foodDeliveries.filter(d=>d.time>this.elapsed-60);
    if(this.food>0)this.hunger=Math.max(0,this.hunger-dt*.012);
    this.meal+=dt*this.people/30;
    const due=Math.floor(this.meal);if(!due)return;
    this.meal-=due;
    for(let i=0;i<due;i++){
      const ate=this.consumeFood(1)>0,id=this.residents[this.mealPerson++%this.people].id;this.meals.push({id,ate});
      if(!ate){this.happy=Math.max(0,this.happy-.6);this.hunger=Math.min(1,this.hunger+.2)}
    }
  }
  categoryFor(id:number):WorkCategory|null{
    const kind=this.board.get(id);return kind==='stone'?'stone':kind==='forest'?'wood':kind==='berry'?'berry':kind==='farm'?'farm':kind==='fisher'?'fish':null;
  }
  workTargets(){
    const active=WORK_CATEGORIES.filter(category=>[...this.board.keys()].some(id=>this.categoryFor(id)===category&&!this.maturing.has(id)&&this.storageFor(id).length));
    const result:Record<WorkCategory,number>={wood:0,stone:0,berry:0,farm:0,fish:0};
    const sum=active.reduce((n,c)=>n+this.priorities[c],0);if(!sum)return result;
    const shares=active.map(c=>({c,raw:this.people*this.priorities[c]/sum}));
    for(const x of shares)result[x.c]=Math.floor(x.raw);
    let left=this.people-Object.values(result).reduce((a,b)=>a+b,0);
    for(const x of shares.sort((a,b)=>(b.raw%1)-(a.raw%1)))if(left-->0)result[x.c]++;
    // A small safety net: one worker feeds the village when the pantry is low.
    const foodCategories=active.filter(c=>['berry','farm','fish'].includes(c)&&this.priorities[c]>0);
    if(this.reserveSeconds<60&&foodCategories.length&&!foodCategories.some(c=>result[c]>0)){
      const donor=active.filter(c=>result[c]>0).sort((a,b)=>result[b]-result[a])[0];
      if(donor){result[donor]--;const food=foodCategories.sort((a,b)=>this.priorities[b]-this.priorities[a])[0];result[food]++}
    }
    return result;
  }
  setPriority(category:WorkCategory,value:number){
    value=Math.max(0,Math.min(100,Math.round(value)));const others=WORK_CATEGORIES.filter(c=>c!==category);
    const sum=others.reduce((n,c)=>n+this.priorities[c],0);this.priorities[category]=value;
    let rest=100-value;
    others.forEach((c,i)=>{const n=i===others.length-1?rest:Math.min(rest,Math.round((100-value)*(sum?this.priorities[c]/sum:1/others.length)));this.priorities[c]=n;rest-=n});
  }
  residents:{id:number;home:number}[]=[{id:0,home:CENTER},{id:1,home:CENTER}];
  get people(){return this.residents.length}
  hand:Card[]=[];
  rng:()=>number;
  constructor(rng=Math.random){this.rng=rng;this.hand=['forest','berry','stone'].map(id=>cards.find(c=>c.id===id)!)}
  neighbors(i:number){return adjacent(i)}
  draw(){
    const pool=cards.filter(c=>(!['farm','fisher','stone','manor'].includes(c.id)||this.tradeCompleted>=(c.id==='manor'?3:c.id==='stone'?0:1))&&(c.id!=='harvest'||this.elapsed>=this.reliefReadyAt));
    this.hand=[];
    while(this.hand.length<3)this.hand.push(pool.splice(Math.floor(this.rng()*pool.length),1)[0]);
    if(!this.hand.some(c=>c.cost<=this.wood))this.hand[0]=cards.find(c=>c.id==='forest')!;
    const essential:Kind[]=[];
    if(![...this.board.values()].includes('forest'))essential.push('forest');
    if(![...this.board.values()].some(k=>['berry','farm','fisher'].includes(k)))essential.push('berry');
    for(const cargo of Object.keys(this.order.needs) as Cargo[]){const producer:Kind=cargo==='wheat'?'farm':cargo==='fish'?'fisher':cargo==='stone'?'stone':cargo==='wood'?'forest':'berry';if(![...this.board.values()].includes(producer)&&!essential.includes(producer))essential.push(producer)}
    if(![...this.board.values()].includes('stone')&&essential.length<3)essential.push('stone');
    if(this.people>=this.housingCapacity&&essential.length<3)essential.push('house');
    for(const [slot,kind] of essential.slice(0,3).entries()){
      const at=this.hand.findIndex(c=>c.id===kind);
      if(at>=0)[this.hand[slot],this.hand[at]]=[this.hand[at],this.hand[slot]];else this.hand[slot]=cards.find(c=>c.id===kind)!;
    }
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
    return this.hand.includes(card)&&!this.cardReason(card)
      &&(card.event?this.board.has(i):this.board.get(i)==='empty')&&(card.id!=='fisher'||adjacent(i).some(n=>!this.board.has(n)));
  }
  preview(card:Card,i:number){
    if(!this.valid(card,i))return null;
    const near=adjacent(i).map(n=>this.board.get(n)),people=0,beds=card.id==='house'?2:card.id==='manor'?4:0;
    const wood=card.id==='forest'?2+near.filter(k=>k==='forest').length+2*adjacent(i).filter(n=>this.board.get(n)==='lumber').reduce((n,cell)=>n+this.level(cell),0):0;
    const food=card.id==='berry'?4+near.filter(k=>k==='forest').length:card.id==='farm'?4+near.filter(k=>k==='store').length*2:card.id==='fisher'?3:0;
    const stone=card.id==='stone'?3:0;
    const happy=card.id==='garden'?2+near.filter(k=>k==='house'||k==='manor').length:0;
    return {wood,stone,food,happy,people,beds,neighbors:adjacent(i).filter(n=>this.board.has(n)),localBonus:wood>2||food>4||happy>2};
  }
  play(card:Card,i=CENTER){
    if(!this.valid(card,i))return null;
    this.spendWood(card.cost);this.spendStone(card.stoneCost??0);this.consumeFood(this.housingFoodCost(card));
    if(!card.event){this.board.set(i,card.id);this.buildingLevels.set(i,1);if(card.id==='forest')this.maturing.set(i,35)}
    if(card.id==='store'){this.storageLevels.set(i,1);this.storageStocks.set(i,{wood:0,stone:0,berry:0,wheat:0,fish:0})}
    if(card.id==='festival'){this.happy=Math.min(100,this.happy+16);this.consumeFood(3)}
    if(card.id==='harvest')this.emergencyHarvest();
    this.draw();return this.production();
  }
  remove(i:number){
    if(i===CENTER||!this.board.has(i)||this.board.get(i)==='empty')return false;
    const stock=this.storageStocks.get(i);
    if(stock){this.wood-=stock.wood;this.stone-=stock.stone;for(const kind of ['berry','wheat','fish'] as const)this.foods[kind]-=stock[kind];this.storageStocks.delete(i);this.storageLevels.delete(i)}
    this.haulStats.delete(i);this.maturing.delete(i);this.buildingLevels.delete(i);this.board.set(i,'empty');for(const r of this.residents)if(r.home===i)r.home=[...this.board.keys()].find(id=>this.residents.filter(other=>other!==r&&other.home===id).length<this.bedsAt(id))??CENTER;
    return true;
  }
  productAt(id:number):{resource:Resource;amount:number;capacity:number}|null{
    const kind=this.board.get(id),near=adjacent(id).map(i=>this.board.get(i)),bonus=(this.level(id)-1)*2;
    if(this.maturing.has(id))return null;
    if(kind==='fisher'&&adjacent(id).some(n=>!this.board.has(n)))return {resource:'food',amount:3+bonus,capacity:1};
    if(kind==='stone')return {resource:'stone',amount:3+bonus,capacity:2};
    if(kind==='forest')return {resource:'wood',amount:2+bonus+near.filter(k=>k==='forest').length+2*adjacent(id).filter(n=>this.board.get(n)==='lumber').reduce((n,cell)=>n+this.level(cell),0),capacity:3};
    if(kind==='berry')return {resource:'food',amount:4+bonus+near.filter(k=>k==='forest').length,capacity:2};
    if(kind==='farm')return {resource:'food',amount:4+bonus+near.filter(k=>k==='store').length*2,capacity:2};
    if(kind==='garden')return {resource:'happy',amount:2+bonus/2+near.filter(k=>k==='house'||k==='manor').length,capacity:1};
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
    if(resource==='food'){const kind=this.board.get(source),food:FoodKind=kind==='fisher'?'fish':kind==='farm'?'wheat':'berry';this.foods[food]+=accepted;stock[food]+=accepted;if(accepted>0)this.foodDeliveries.push({time:this.elapsed,amount:accepted})}else if(resource==='stone'){this.stone+=accepted;stock.stone+=accepted}else{this.wood+=accepted;stock.wood+=accepted}
    return accepted;
  }
}
