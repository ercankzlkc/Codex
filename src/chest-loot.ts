import type {TradeGood} from './game';

export type ChestLoot={good:TradeGood|'gold';amount:number};

export const chestLootName:Record<ChestLoot['good'],string>={wood:'odun',stone:'taş',berry:'çilek',wheat:'buğday',fish:'balık',gold:'altın'};

/** Gold is a rare find; most floating cargo is useful village supplies. */
export function rollChestLoot():ChestLoot{
  const roll=Math.random();
  const good:ChestLoot['good']=roll<.08?'gold':roll<.35?'wood':roll<.58?'stone':roll<.74?'berry':roll<.88?'wheat':'fish';
  return {good,amount:good==='gold'?3+Math.floor(Math.random()*4):5+Math.floor(Math.random()*6)};
}
