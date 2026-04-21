export const W = 420;
export const H = 720;

export const CFG = {
  playerY: 612,
  playerRadius: 18,
  moveSpeed: 430,
  pointerEase: 18,
  wallPad: 24,
  startLives: 3,
  spawnLead: 0.92,
  pickupLead: 5.2,
  invulnAfterHit: 1.35,
  shieldInvuln: 1.0,
  slowDuration: 4.4,
  ghostDuration: 3.4,
  scoreDivisor: 10
};

export const STAGES = [
  {
    name: "Warmup",
    start: 0,
    speed: 230,
    spawnMin: 1.18,
    spawnMax: 1.55,
    note: "Warmup gives you space to read the first telegraphs before the pressure climbs.",
    colors: [0x0d2134, 0x07111d]
  },
  {
    name: "Heated",
    start: 18,
    speed: 275,
    spawnMin: 1.02,
    spawnMax: 1.3,
    note: "Heated shortens the recovery gap and starts leaning on heavier blocks.",
    colors: [0x14233f, 0x0a1322]
  },
  {
    name: "Frenzy",
    start: 36,
    speed: 325,
    spawnMin: 0.92,
    spawnMax: 1.16,
    note: "Frenzy adds spinners, tighter gates, and the first real traffic stacks.",
    colors: [0x1c2747, 0x0a1020]
  },
  {
    name: "Overdrive",
    start: 56,
    speed: 380,
    spawnMin: 0.84,
    spawnMax: 1.05,
    note: "Overdrive punishes lazy resets. You need shorter moves and cleaner exits.",
    colors: [0x231f44, 0x0a0e1c]
  },
  {
    name: "Redline",
    start: 80,
    speed: 430,
    spawnMin: 0.78,
    spawnMax: 0.98,
    note: "Redline stacks sweepers with split gates and forces quick follow-up reads.",
    colors: [0x311a40, 0x100814]
  },
  {
    name: "Meltdown",
    start: 108,
    speed: 485,
    spawnMin: 0.74,
    spawnMax: 0.92,
    note: "Meltdown is the stress test. Save one power-up if you can.",
    colors: [0x3b162f, 0x13050d]
  }
];

export const POWER_COLORS = {
  shield: 0x8cf5da,
  slow: 0xffc672,
  ghost: 0xc5a6ff
};

export const HAZARD_COLORS = {
  bar: 0xff7d6c,
  heavy: 0xff5050,
  gate: 0xff9a6f,
  sweeper: 0xffc672,
  spinner: 0xff6254
};

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function random(min, max) {
  return Math.random() * (max - min) + min;
}
