import type { Kind } from './game';

export interface PlacementAudioCue {
  /** Shared /audio/ prefix and .ogg extension are added by the audio loader. */
  files: readonly string[];
  volume: number;
  rate: readonly [number, number];
}

/** One short positional material voice as each tile emerges. */
export const placementAudio: Readonly<Record<Kind, PlacementAudioCue>> = {
  bench:{files:['placement-timber-1'],volume:.25,rate:[.95,1.05]},
  lantern:{files:['placement-door'],volume:.22,rate:[1,1]},
  well:{files:['placement-stone'],volume:.25,rate:[1,1]},
  forest: { files: ['harvest-leaves-1', 'harvest-leaves-2'], volume: .22, rate: [.94, 1.08] },
  stone: { files: ['placement-stone', 'harvest-stone-crumble'], volume: .24, rate: [.86, 1.00] },
  berry: { files: ['harvest-leaves-1', 'harvest-leaves-2'], volume: .18, rate: [1.10, 1.22] },
  farm: { files: ['placement-straw-1', 'placement-straw-2'], volume: .28, rate: [.92, 1.04] },
  garden: { files: ['harvest-leaves-1', 'harvest-leaves-2'], volume: .16, rate: [1.16, 1.28] },
  house: { files: ['placement-door'], volume: .22, rate: [.95, 1.05] },
  lumber: { files: ['impactWood_light_000', 'impactWood_light_003'], volume: .28, rate: [.88, 1.04] },
  store: { files: ['impactWood_light_000', 'impactWood_light_003'], volume: .28, rate: [.78, .92] },
  manor: { files: ['placement-door'], volume: .26, rate: [.78, .90] },
  fisher: { files: ['placement-timber-1', 'placement-timber-2'], volume: .22, rate: [.96, 1.08] },
  harbor: { files: ['placement-timber-1', 'placement-timber-2'], volume: .26, rate: [.82, .96] },
  harvest: { files: ['placement-straw-1', 'placement-straw-2'], volume: .26, rate: [1.04, 1.14] },
  festival: { files: ['chips-stack-3'], volume: .20, rate: [1.04, 1.12] },
};

export const placementAudioFiles = [...new Set(
  Object.values(placementAudio).flatMap(cue => cue.files),
)];
