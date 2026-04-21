export const W = 420;
export const H = 720;
export const VPX = W / 2;
export const VPY = H * 0.34;
export const TRACK_D = H - VPY;
export const LANE_REL = [-133, 0, 133];
export const LANE_HALF_W = 133;

export const CFG = {
  baseSpeed: 380,
  maxSpeed: 1060,
  boostMult: 1.42,
  playerZ: 0.83,
  laneSwapTime: 0.105,
  jumpDur: 0.39,
  jumpH: 118,
  slideDur: 0.44,
  slideCollideWindow: 0.72,
  spawnZStart: 0.02,
  despawnZ: 1.08,
  coinSpawnInterval: [1.8, 3.5],
  obstSpawnInterval: [2.1, 4.5]
};

export const STAGES = [
  { label: "City Night", t: 0, mult: 1, sky0: 0x081530, sky1: 0x151a42, build: 0x0d1826, accel: 6 },
  { label: "Storm Grid", t: 22, mult: 1.22, sky0: 0x101839, sky1: 0x1c1248, build: 0x111830, accel: 8 },
  { label: "Neon Surge", t: 48, mult: 1.48, sky0: 0x180f36, sky1: 0x2a0a3a, build: 0x190e2e, accel: 11 },
  { label: "Overdrive", t: 80, mult: 1.78, sky0: 0x27102e, sky1: 0x3a0a1a, build: 0x220b20, accel: 15 }
];

export function project(relX, z) {
  return {
    x: VPX + relX * z,
    y: VPY + TRACK_D * z,
    s: z
  };
}

export function hexToCss(hex) {
  return `#${hex.toString(16).padStart(6, "0")}`;
}
