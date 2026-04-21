export const W = 420;
export const H = 720;
export const VPX = W / 2;
export const VPY = H * 0.34;
export const TRACK_D = H - VPY;
export const LANE_REL = [-133, 0, 133];
export const LANE_HALF_W = 133;

export const CFG = {
  baseSpeed: 390,
  maxSpeed: 1100,
  boostMult: 1.42,
  playerZ: 0.83,
  laneSwapTime: 0.105,
  jumpDur: 0.39,
  jumpH: 118,
  slideDur: 0.44,
  slideCollideWindow: 0.72,
  spawnZStart: 0.02,
  despawnZ: 1.08,
  coinSpawnInterval: [1.7, 3.2],
  obstSpawnInterval: [1.95, 3.95],
  nearMissBonus: 1,
  trainWarnDur: 1.12,
  comboResetTime: 1.9
};

export const STAGES = [
  { label: "City Night", t: 0,  mult: 1,    sky0: 0x081530, sky1: 0x151a42, build: 0x0d1826, accel: 6 },
  { label: "Storm Grid", t: 22, mult: 1.22, sky0: 0x101839, sky1: 0x1c1248, build: 0x111830, accel: 8 },
  { label: "Neon Surge", t: 48, mult: 1.48, sky0: 0x180f36, sky1: 0x2a0a3a, build: 0x190e2e, accel: 11 },
  { label: "Overdrive",  t: 80, mult: 1.78, sky0: 0x27102e, sky1: 0x3a0a1a, build: 0x220b20, accel: 15 }
];

// Authored encounter patterns: minStage = earliest stage that allows this pattern
export const PATTERNS = [
  { name: "SPLIT_JUMP", minStage: 0, groups: [
    { delay: 0, obstacles: [{ type: "lowBar", lanes: [0] }, { type: "lowBar", lanes: [2] }], coins: [{ lane: 1, count: 5, floatH: 18 }] }
  ]},
  { name: "ZIGZAG", minStage: 0, groups: [
    { delay: 0,   obstacles: [{ type: "block", lanes: [0] }], coins: [{ lane: 1, count: 3, floatH: 18 }] },
    { delay: 0.98, obstacles: [{ type: "block", lanes: [2] }], coins: [{ lane: 1, count: 3, floatH: 18 }] },
    { delay: 1.96, obstacles: [{ type: "block", lanes: [0] }], coins: [{ lane: 2, count: 3, floatH: 18 }] }
  ]},
  { name: "JUMP_RUSH", minStage: 0, groups: [
    { delay: 0,   obstacles: [{ type: "lowBar", lanes: [1] }] },
    { delay: 1.05, obstacles: [{ type: "lowBar", lanes: [0] }, { type: "lowBar", lanes: [2] }], coins: [{ lane: 1, count: 5, floatH: 55 }] }
  ]},
  { name: "DUCK_POP", minStage: 0, groups: [
    { delay: 0, obstacles: [{ type: "highBar", lanes: [1] }], coins: [{ lane: 1, count: 4, floatH: 18 }] },
    { delay: 1.15, obstacles: [{ type: "lowBar", lanes: [1] }], coins: [{ lane: 1, count: 4, floatH: 55 }] }
  ]},
  { name: "TRAIN_RUSH", minStage: 1, groups: [
    { delay: 0,   obstacles: [{ type: "train", lanes: [1] }], coins: [{ lane: 2, count: 5, floatH: 18 }] },
    { delay: 1.55, obstacles: [{ type: "train", lanes: [0] }], coins: [{ lane: 1, count: 4, floatH: 18 }] }
  ]},
  { name: "PRESSURE", minStage: 1, groups: [
    { delay: 0,   obstacles: [{ type: "block", lanes: [0] }, { type: "block", lanes: [1] }] },
    { delay: 1.8, obstacles: [{ type: "highBar", lanes: [2] }], coins: [{ lane: 2, count: 5, floatH: 18 }] }
  ]},
  { name: "SQUEEZE", minStage: 1, groups: [
    { delay: 0,   obstacles: [{ type: "lowBar", lanes: [0] }, { type: "lowBar", lanes: [2] }], coins: [{ lane: 1, count: 4, floatH: 18 }] },
    { delay: 1.25, obstacles: [{ type: "highBar", lanes: [1] }] }
  ]},
  { name: "TRIPLE_TAP", minStage: 2, groups: [
    { delay: 0,   obstacles: [{ type: "lowBar", lanes: [1] }] },
    { delay: 0.88,obstacles: [{ type: "highBar", lanes: [0] }] },
    { delay: 1.76, obstacles: [{ type: "block", lanes: [2] }] }
  ]},
  { name: "TRAIN_SLIDE", minStage: 2, groups: [
    { delay: 0,   obstacles: [{ type: "train", lanes: [0], slideDir: 1 }], coins: [{ lane: 2, count: 5, floatH: 18 }] },
    { delay: 1.7, obstacles: [{ type: "highBar",  lanes: [2] }] }
  ]},
  { name: "DRIFTER_SPLIT", minStage: 2, groups: [
    { delay: 0, obstacles: [{ type: "drifter", lanes: [2], slideDir: -1 }], coins: [{ lane: 0, count: 5, floatH: 18 }] },
    { delay: 1.42, obstacles: [{ type: "lowBar", lanes: [1] }] }
  ]},
  { name: "OVERDRIVE_RUN", minStage: 3, groups: [
    { delay: 0,   obstacles: [{ type: "train", lanes: [0] }, { type: "train", lanes: [2] }] },
    { delay: 2.05, obstacles: [{ type: "highBar",  lanes: [1] }], coins: [{ lane: 1, count: 6, floatH: 18 }] }
  ]},
  { name: "GAUNTLET", minStage: 3, groups: [
    { delay: 0,   obstacles: [{ type: "block", lanes: [0] }] },
    { delay: 0.9, obstacles: [{ type: "drifter", lanes: [2], slideDir: -1 }] },
    { delay: 1.88, obstacles: [{ type: "train", lanes: [1], slideDir: -1 }], coins: [{ lane: 2, count: 4, floatH: 18 }] }
  ]}
];

export function project(relX, z) {
  return { x: VPX + relX * z, y: VPY + TRACK_D * z, s: z };
}

export function hexToCss(hex) {
  return `#${hex.toString(16).padStart(6, "0")}`;
}
