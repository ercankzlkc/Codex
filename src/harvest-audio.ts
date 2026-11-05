/** Supplied MP3 recordings plus the existing local harvest foley. */
export const harvestAudio = {
  woodHit: { files: ['wood-hit-1','wood-hit-2','wood-hit-3','wood-hit-4'], volume: 0.36, rate: [1,1], fullLength:true },
  woodBreak: { files: ['wood-fall-1','wood-fall-2','wood-fall-3','wood-fall-4'], volume: 0.38, rate: [1,1], fullLength:true },
  woodLand: { files: ['wood-land-1','wood-land-2','wood-land-3','wood-land-4'], volume: 0.38, rate: [1,1], fullLength:true },
  stoneHit: { files: ['stone-hit-1','stone-hit-2','stone-hit-3','stone-hit-4'], volume: 0.34, rate: [1,1], fullLength:true },
  stoneBreak: { files: ['stone-break-1','stone-break-2','stone-break-3'], volume: 0.40, rate: [1,1], fullLength:true },
  berryPick: { files: ['harvest-leaves-1', 'harvest-leaves-2'], volume: 0.18, rate: [1.12, 1.28] },
  wheatHarvest: { files: ['harvest-wheat-cut'], volume: 0.16, rate: [0.83, 0.96] },
} as const;

export type HarvestCue = keyof typeof harvestAudio;
