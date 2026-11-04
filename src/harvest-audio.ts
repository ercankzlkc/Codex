/** Short, local CC0 foley. Keys omit the /audio/ prefix and .ogg extension. */
export const harvestAudio = {
  woodHit: { files: ['harvest-chop'], volume: 0.22, rate: [0.94, 1.06] },
  woodBreak: { files: ['harvest-wood-break-1', 'harvest-wood-break-2'], volume: 0.28, rate: [0.83, 0.96] },
  stoneHit: { files: ['harvest-mining-1', 'harvest-mining-2'], volume: 0.19, rate: [0.94, 1.06] },
  stoneBreak: { files: ['harvest-stone-crumble'], volume: 0.29, rate: [0.8, 0.94] },
  berryPick: { files: ['harvest-leaves-1', 'harvest-leaves-2'], volume: 0.18, rate: [1.12, 1.28] },
  wheatHarvest: { files: ['harvest-wheat-cut'], volume: 0.16, rate: [0.83, 0.96] },
} as const;

export type HarvestCue = keyof typeof harvestAudio;
