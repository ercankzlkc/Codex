import { CENTER, adjacent, frontier, canGrow } from './hex.ts';
import {drawObjectives,type Objective} from './objectives.ts';
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
  { id: 'forest', name: 'Orman', cost: 0, workers: 0, desc: '+2 odun / tur', bonus: 'Orman +1 · çalışan oduncu +2 odun' },
  { id: 'berry', name: 'Çilek Bahçesi', cost: 2, workers: 1, desc: '+4 yiyecek / tur', bonus: 'Komşu orman: +1 yiyecek' },
  { id: 'house', name: 'Ev', cost: 5, workers: 0, desc: '+2 nüfus · +2 işçi', bonus: 'Komşu bahçe: +1 refah / tur' },
  { id: 'lumber', name: 'Oduncu Kulübesi', cost: 5, workers: 1, desc: '+2 odun / tur', bonus: 'Her komşu ormana +2 odun' },
  { id: 'farm', name: 'Çiftlik', cost: 7, workers: 2, desc: '+9 yiyecek / tur', bonus: 'Komşu depo: +2 yiyecek' },
  { id: 'store', name: 'Depo', cost: 6, workers: 0, desc: '+1 yiyecek / çalışan üretici', bonus: 'Komşu çiftliğe +2 yiyecek' },
  { id: 'garden', name: 'Bahçe', cost: 3, workers: 0, desc: '+2 refah / tur', bonus: 'Komşu ev başına +1 refah' },
  { id: 'manor', name: 'Büyük Ev', cost: 10, workers: 0, desc: '+4 nüfus · +4 işçi', bonus: 'Komşu bahçe: +1 refah / tur' },
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

const populationGain = (card: Card) => card.id === 'house' ? 2 : card.id === 'manor' ? 4 : 0;

export class Game {
  board = new Map<number, Kind>([[CENTER, 'house']]);
  wood = 10;
  food = 18;
  people = 4;
  happy = 70;
  turn = 1;
  over = false;
  won = false;
  hand: Card[] = [];
  log = 'Krallığın seni bekliyor.';
  rng: () => number;
  readonly objectiveOrder:readonly Objective[];
  completedObjectives=0;
  completedThisTurn:Objective|null=null;
  get activeObjective(){return this.objectiveOrder[this.completedObjectives]??null}
  get objectiveProgress(){const goal=this.activeObjective;return goal?Math.max(0,Math.min(goal.target,goal.progress(this))):0}

  constructor(rng = Math.random) {
    this.rng = rng;
    this.objectiveOrder=drawObjectives(rng);
    this.draw();
  }

  neighbors(i: number) { return adjacent(i); }

  get troubled() {
    return this.food < 8 || this.happy < 35;
  }

  get influence() {
    const forests = [...this.board.values()].filter(k => k === 'forest').length;
    return this.troubled ? 'Erzak sıkıntısı: Acil Hasat olasılığı arttı'
      : forests >= 3 ? 'Orman krallığı: Oduncu Kulübesi olasılığı arttı'
      : this.people >= 6 ? 'Büyüyen halk: Çiftlik ve Büyük Ev açıldı'
      : 'Yeni yerleşim: Orman, Ev ve Çilek ağırlıklı';
  }

  weights() {
    const forests = [...this.board.values()].filter(k => k === 'forest').length;
    return cards.filter(c => !['farm', 'manor'].includes(c.id) || this.people >= 6)
      .map(c => ({
        c,
        w: c.id === 'harvest' ? (this.troubled ? 9 : 1)
          : c.id === 'lumber' ? 1 + forests * 2
          : c.id === 'berry' && this.food < this.people * 2 ? 7
          : c.id === 'house' ? 4
          : c.id === 'farm' ? 5
          : c.id === 'forest' ? 4 : 2,
      }));
  }

  draw() {
    const pool = this.weights();
    this.hand = [];
    while (this.hand.length < 3) {
      let r = this.rng() * pool.reduce((sum, p) => sum + p.w, 0);
      const index = Math.max(0, pool.findIndex(p => (r -= p.w) < 0));
      this.hand.push(pool.splice(index, 1)[0].c);
    }
    // Always leave an affordable legal move, including when a festival lacks food.
    const empty = frontier(this.board)[0];
    if (!this.hand.some(c => this.valid(c, c.event ? CENTER : empty))) this.hand[0] = cards[0];
    if (this.food < this.people && !this.hand.some(c => c.id === 'harvest' || c.id === 'berry')) {
      this.hand[2] = cards[9];
    }
  }

  production(): Production {
    return this.calculateProduction(this.board, this.people);
  }

  /** Pure evaluation shared by the actual turn and placement previews. */
  private calculateProduction(board: ReadonlyMap<number, Kind>, people: number): Production {
    let used = 0;
    const active = new Set<number>();
    const isFood = (kind: Kind | null) => kind === 'berry' || kind === 'farm';
    const priority = [...board].map(([i, k]) => ({ k, i }))
      .sort((a, b) => Number(isFood(b.k) || b.i === CENTER) - Number(isFood(a.k) || a.i === CENTER));
    for (const { k, i } of priority) {
      const card = cards.find(c => c.id === k);
      const workers = i === CENTER ? 1 : card?.workers;
      if (workers !== undefined && used + workers <= people) {
        used += workers;
        active.add(i);
      }
    }

    const rows = [...board].flatMap(([i, kind]) => {
      if (!kind) return [];
      const neighborIndices = this.neighbors(i);
      const neighbors = neighborIndices.map(j => board.get(j));
      let wood = i === CENTER ? 2 : 0, food = 0, happy = 0, bonus = false;
      if (active.has(i)) {
        if (i === CENTER) food = 4;
        if (kind === 'forest') {
          const count = neighborIndices.filter(j => board.get(j) === 'lumber' && active.has(j)).length;
          wood = 2 + count * 2 + neighbors.filter(k => k === 'forest').length;
          bonus = wood > 2;
        }
        if (kind === 'berry') {
          food = 4 + neighbors.filter(k => k === 'forest').length;
          bonus = food > 4;
        }
        if (kind === 'lumber') wood = 2;
        if (kind === 'farm') {
          food = 9 + (neighbors.includes('store') ? 2 : 0);
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
    const producers = rows.filter(row => row.food > 0).length;
    for (const row of rows) {
      if (board.get(row.i) === 'store') row.food = producers;
    }
    return {
      wood: rows.reduce((sum, row) => sum + row.wood, 0),
      food: rows.reduce((sum, row) => sum + row.food, 0),
      happy: rows.reduce((sum, row) => sum + row.happy, 0),
      used,
      idle: people - used,
      rows,
    };
  }

  valid(card: Card, i: number) {
    return !this.over && this.hand.includes(card) && card.cost <= this.wood
      && (card.event ? this.board.has(i) : canGrow(this.board, i))
      && (card.id !== 'festival' || this.food >= 3);
  }

  preview(card: Card, i: number) {
    if (!this.valid(card, i)) return null;
    const before = this.production();
    const board = new Map(this.board);
    // Instant cards resolve on existing land without creating a tile.
    if (!card.event) board.set(i, card.id);
    const people = populationGain(card);
    const after = this.calculateProduction(board, this.people + people);
    return {
      wood: after.wood - before.wood,
      food: after.food - before.food,
      happy: after.happy - before.happy,
      people,
      consumption: people,
      neighbors: adjacent(i).filter(n => {
        const old = before.rows.find(row => row.i === n), next = after.rows.find(row => row.i === n);
        return !!old && !!next && (next.wood > old.wood || next.food > old.food || next.happy > old.happy);
      }),
      localBonus: !card.event && (after.rows.find(row => row.i === i)?.bonus ?? false),
    };
  }

  /** Demolition changes future production, without refunds, yields or a turn. */
  remove(i:number){
    if(this.over||i===CENTER||!this.board.has(i))return false;
    this.board.delete(i);
    return true;
  }

  play(card: Card, i = CENTER) {
    if (!this.valid(card, i)) return null;
    this.completedThisTurn=null;
    this.wood -= card.cost;
    if (!card.event) this.board.set(i, card.id);
    this.people += populationGain(card);
    if (card.id === 'festival') {
      this.happy += 16;
      this.food -= 3;
    }
    if (card.id === 'harvest') {
      this.food += 12;
      this.happy -= 5;
    }
    const production = this.production();
    const consumption = this.people;
    this.wood += production.wood;
    this.food += production.food - consumption;
    const shortage = this.food < 0;
    if (shortage) {
      this.people = Math.max(0, this.people - 1);
      this.food = 0;
    }
    this.happy = Math.max(0, Math.min(100, this.happy + production.happy - (shortage ? 14 : 0)));
    this.log = `+${production.wood} odun · +${production.food} hasat · −${consumption} tüketim${shortage ? ' · Açlık: −1 nüfus, −14 refah' : ''}`;
    const goal=this.activeObjective;
    if(this.people>0&&this.happy>0&&goal&&this.objectiveProgress>=goal.target){
      this.completedObjectives++;this.completedThisTurn=goal;
      this.wood+=goal.reward.wood;this.food+=goal.reward.food;
      this.happy=Math.min(100,this.happy+goal.reward.happy);
    }
    if (this.people <= 0 || this.happy <= 0) {
      this.over = true;
    } else if (this.turn === 15) {
      this.over = true;
      this.won = this.people >= 10 && this.happy >= 50;
    } else {
      this.turn++;
      this.draw();
    }
    return production;
  }
}


