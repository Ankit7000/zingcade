import { InputManager } from "../../../_shared/phaser/systems/InputManager.js?v=2";
import { SceneTransitions } from "../../../_shared/phaser/systems/SceneTransitions.js?v=2";
import { CFG, H, LANE_HALF_W, LANE_REL, PATTERNS, STAGES, TRACK_D, VPX, VPY, W, project } from "../config.js?v=3";

const PhaserScene = globalThis.Phaser.Scene;
const PhaserMath = globalThis.Phaser.Math;

export class GameScene extends PhaserScene {
  constructor() { super("GameScene"); }

  create() {
    this.g = this.add.graphics();
    this.nearMissLabel = this.add.text(VPX, VPY + TRACK_D * CFG.playerZ - 68, "", {
      fontFamily: "Orbitron, sans-serif", fontSize: "15px", color: "#8cf5da",
      stroke: "#040a12", strokeThickness: 4
    }).setOrigin(0.5, 1).setDepth(10).setAlpha(0);
    this.audio = this.registry.get("audio");
    this.score = this.registry.get("score");
    this.inputManager = new InputManager(this, {
      left: () => this.handleInput("left"), right: () => this.handleInput("right"),
      up: () => this.handleInput("jump"),   down: () => this.handleInput("slide"),
      primary: () => this.handleInput("primary"), pause: () => this.togglePause()
    });
    this.game.events.on("nd:start-run", this.startRun, this);
    this.game.events.on("nd:continue-run", this.continueRun, this);
    this.game.events.on("nd:toggle-pause", this.togglePause, this);
    this.game.events.on("nd:pause", this.pauseRun, this);
    this.game.events.on("nd:resume", this.resumeRun, this);
    this.game.events.on("nd:input", this.handleInput, this);
    this.events.once("shutdown", () => this.shutdown());
    this.resetWorld("start");
  }

  resetWorld(mode = "playing") {
    this.state = {
      mode, time: 0, dist: 0, speed: CFG.baseSpeed,
      stageIndex: 0, stageFlash: 0,
      lane: 1, targetLane: 1, prevLane: 1, laneT: 1,
      jumpProg: 0, jumpOffset: 0, slideProg: 0, runCycle: 0,
      shield: false, magnetT: 0, boostT: 0, invulnT: 0,
      obstacles: [], coins: [], powers: [], particles: [],
      obstacleTimer: 1.8, coinTimer: 1.2, continueUsed: false,
      tip: "Keep your eyes on the horizon - the faster you are, the earlier you must react.",
      // Spectacle additions
      warnings: [],       // { lanes, t, maxT, color, type, dir }
      nearMissT: 0, nearMissCombo: 0, nearMissResetT: 0, nearMissText: "",
      nearMissX: VPX, nearMissY: VPY + TRACK_D * CFG.playerZ - 68,
      sideTrains: [], sideTrainTimer: 2.2,
      patternCooldown: 11, patternQueue: [],
      crashFlashT: 0, laneFlash: [0, 0, 0], actionPulseT: 0, speedPulseT: 0,
    };
    this.score.reset();
    this.registry.set("gameState", mode);
    if (this.nearMissLabel) this.nearMissLabel.setAlpha(0);
    this.emitHud();
  }

  startRun() {
    this.audio.play("start");
    this.resetWorld("playing");
    this.game.events.emit("nd:hide-overlay");
    SceneTransitions.flash(this, 0x8cf5da, 150, 0.32);
  }

  pauseRun() {
    if (this.state.mode !== "playing") return;
    this.state.mode = "paused";
    this.registry.set("gameState", "paused");
    this.audio.play("pause");
    this.game.events.emit("nd:show-pause");
  }

  resumeRun() {
    if (this.state.mode !== "paused") return;
    this.state.mode = "playing";
    this.registry.set("gameState", "playing");
    this.game.events.emit("nd:hide-overlay");
    document.getElementById("pauseBtn").textContent = "Pause";
  }

  togglePause() {
    if (this.state.mode === "playing") this.pauseRun();
    else if (this.state.mode === "paused") this.resumeRun();
  }

  continueRun() {
    if (this.state.mode !== "gameover" || this.state.continueUsed) return;
    this.state.mode = "playing";
    this.registry.set("gameState", "playing");
    this.state.continueUsed = true;
    this.state.invulnT = 2;
    this.state.obstacles = this.state.obstacles.filter(o => o.z < CFG.playerZ - 0.15 || o.z > CFG.playerZ + 0.15);
    this.game.events.emit("nd:hide-overlay");
    document.getElementById("pauseBtn").textContent = "Pause";
  }

  handleInput(action) {
    if (this.state.mode === "start" || this.state.mode === "gameover") {
      this.game.events.emit("nd:start-run"); return;
    }
    if (this.state.mode === "paused") { this.resumeRun(); return; }
    if (this.state.mode !== "playing") return;
    if (action === "left")  this.moveLane(-1);
    if (action === "right") this.moveLane(1);
    if (action === "jump")  this.jump();
    if (action === "slide") this.slide();
  }

  moveLane(dir) {
    const next = PhaserMath.Clamp(this.state.targetLane + dir, 0, 2);
    if (next === this.state.targetLane) return;
    this.state.prevLane = this.state.lane;
    this.state.targetLane = next;
    this.state.laneT = 0;
    this.audio.play("move");
    const p = project(LANE_REL[next], CFG.playerZ);
    this.state.laneFlash[next] = 0.26;
    this.state.actionPulseT = 0.16;
    this.spawnParticles(p.x, p.y - 30, 0x8cf5da, 7, 95);
  }

  jump() {
    if (this.state.jumpProg > 0 || this.state.slideProg > 0) return;
    this.state.jumpProg = 0.001;
    this.state.actionPulseT = 0.22;
    this.audio.play("jump");
    const p = project(LANE_REL[this.state.targetLane], CFG.playerZ);
    this.spawnParticles(p.x, p.y - 12, 0x77b8ff, 12, 135);
  }

  slide() {
    if (this.state.jumpProg > 0 || this.state.slideProg > 0) return;
    this.state.slideProg = 0.001;
    this.state.actionPulseT = 0.2;
    this.audio.play("slide");
    const p = project(LANE_REL[this.state.targetLane], CFG.playerZ);
    this.spawnParticles(p.x, p.y - 8, 0xbb78ff, 10, 125);
  }

  update(_, deltaMs) {
    const dt = Math.min(deltaMs / 1000, 0.05);
    if (this.state.mode === "playing") this.updateRun(dt);
    this.updateParticles(dt);
    this.draw();
  }

  updateRun(dt) {
    const s = this.state;
    s.time += dt;
    const stage = STAGES[s.stageIndex];
    const targetSpeed = Math.min(CFG.maxSpeed, CFG.baseSpeed + s.time * stage.accel);
    s.speed = PhaserMath.Linear(s.speed, targetSpeed, dt * 0.4);
    const worldSpeed = s.speed * (s.boostT > 0 ? CFG.boostMult : 1);
    s.dist += dt * worldSpeed;
    this.score.updateDistance(dt * worldSpeed);

    let nextStage = 0;
    STAGES.forEach((item, index) => { if (s.time >= item.t) nextStage = index; });
    if (nextStage !== s.stageIndex) {
      s.stageIndex = nextStage;
      s.stageFlash = 1.4;
      s.speedPulseT = 1.1;
      SceneTransitions.flash(this, 0x8cf5da, 180, 0.35);
    }
    s.stageFlash = Math.max(0, s.stageFlash - dt);
    this.updatePlayer(dt);

    const zSpeed = worldSpeed / TRACK_D;
    s.obstacles.forEach(o => {
      o.z += dt * zSpeed;
      // Sliding threats use depth-based progress so readability stays consistent as speed rises.
      if (o.slideDir && o.srcLane !== undefined) {
        const startZ = o.type === "drifter" ? 0.16 : 0.13;
        const endZ = o.type === "drifter" ? 0.66 : 0.72;
        o.slideProg = PhaserMath.Clamp((o.z - startZ) / (endZ - startZ), 0, 1);
        const destLane = PhaserMath.Clamp(o.srcLane + o.slideDir, 0, 2);
        const commit = o.type === "drifter" ? 0.62 : 0.68;
        if (o.slideProg >= commit && !o.laneShifted) {
          o.lanes = [destLane]; o.laneShifted = true;
        }
      }
    });
    s.coins.forEach(c => { c.z += dt * zSpeed; c.rot += dt * 4.5; });
    s.powers.forEach(p => { p.z += dt * zSpeed; });
    s.obstacles = s.obstacles.filter(o => o.z < CFG.despawnZ && !o.hit);
    s.coins    = s.coins.filter(c => c.z < CFG.despawnZ && !c.collected);
    s.powers   = s.powers.filter(p => p.z < CFG.despawnZ && !p.collected);
    this.checkCollisions();
    this.updateSpawns(dt);

    // Timers
    s.warnings = s.warnings.filter(w => { w.t -= dt; return w.t > 0; });
    if (s.nearMissT > 0) { s.nearMissT = Math.max(0, s.nearMissT - dt); }
    if (s.nearMissResetT > 0) {
      s.nearMissResetT = Math.max(0, s.nearMissResetT - dt);
      if (s.nearMissResetT <= 0) s.nearMissCombo = 0;
    }
    if (s.crashFlashT > 0) { s.crashFlashT = Math.max(0, s.crashFlashT - dt); }
    if (s.speedPulseT > 0) { s.speedPulseT = Math.max(0, s.speedPulseT - dt); }
    this.updateSideTrains(dt);

    // Pattern cooldown
    s.patternCooldown -= dt;
    if (s.patternCooldown <= 0 && s.patternQueue.length === 0) {
      this.triggerPattern();
      const mult = STAGES[s.stageIndex].mult;
      s.patternCooldown = PhaserMath.FloatBetween(9, 17) / mult;
    }
    this.emitHud();
  }

  updatePlayer(dt) {
    const s = this.state;
    if (s.laneT < 1) {
      s.laneT = Math.min(1, s.laneT + dt / CFG.laneSwapTime);
      if (s.laneT >= 1) { s.lane = s.targetLane; s.prevLane = s.targetLane; }
    }
    if (s.jumpProg > 0) {
      s.jumpProg = Math.min(1, s.jumpProg + dt / CFG.jumpDur);
      s.jumpOffset = Math.sin(s.jumpProg * Math.PI) * CFG.jumpH;
      if (s.jumpProg >= 1) { s.jumpProg = 0; s.jumpOffset = 0; }
    }
    if (s.slideProg > 0) {
      s.slideProg = Math.min(1, s.slideProg + dt / CFG.slideDur);
      if (s.slideProg >= 1) s.slideProg = 0;
    }
    s.runCycle = (s.runCycle + dt * (1 + s.speed / 600)) % 1;
    s.magnetT  = Math.max(0, s.magnetT - dt);
    s.boostT   = Math.max(0, s.boostT - dt);
    s.invulnT  = Math.max(0, s.invulnT - dt);
    s.actionPulseT = Math.max(0, s.actionPulseT - dt);
    for (let i = 0; i < s.laneFlash.length; i++) {
      s.laneFlash[i] = Math.max(0, s.laneFlash[i] - dt);
    }
  }

  updateSpawns(dt) {
    const s = this.state;
    // Drain pattern queue
    const remaining = [];
    for (const item of s.patternQueue) {
      if (s.time >= item.triggerTime) {
        item.obstacles.forEach(o => this.spawnSpecific(o.type, o.lanes, o.slideDir));
        (item.coins || []).forEach(c => this.spawnCoinLine(c.lane, c.count, c.floatH, c.spacing));
      } else { remaining.push(item); }
    }
    s.patternQueue = remaining;

    s.obstacleTimer -= dt;
    if (s.obstacleTimer <= 0) {
      const nearPattern = s.patternQueue.some(item => item.triggerTime - s.time < 1.4);
      if (!nearPattern) this.spawnObstacle();
      const mult = STAGES[s.stageIndex].mult;
      s.obstacleTimer = Math.max(0.65, PhaserMath.FloatBetween(
        CFG.obstSpawnInterval[0] / mult, CFG.obstSpawnInterval[1] / mult) * 0.98);
    }
    s.coinTimer -= dt;
    if (s.coinTimer <= 0) {
      this.spawnCoins();
      if (Math.random() < 0.12) this.spawnPowerup();
      s.coinTimer = PhaserMath.FloatBetween(CFG.coinSpawnInterval[0], CFG.coinSpawnInterval[1]);
    }
  }

  triggerPattern() {
    const s = this.state;
    const available = PATTERNS.filter(p => p.minStage <= s.stageIndex);
    if (!available.length) return;
    const pat = available[PhaserMath.Between(0, available.length - 1)];
    pat.groups.forEach(group => {
      s.patternQueue.push({
        triggerTime: s.time + group.delay,
        obstacles: group.obstacles || [],
        coins: group.coins || []
      });
    });
  }

  spawnObstacle() {
    // Weights per stage: [barrier, highBar, block, double, lowBar, train, drifter]
    const weightTable = [
      [2, 1, 2, 0, 3, 0, 0],
      [2, 2, 2, 1, 3, 1, 0],
      [1, 2, 3, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 3, 1]
    ];
    const weights = weightTable[this.state.stageIndex];
    const types = ["barrier", "highBar", "block", "double", "lowBar", "train", "drifter"];
    let roll = Math.random() * weights.reduce((s, v) => s + v, 0);
    let type = "barrier";
    for (let i = 0; i < weights.length; i++) { roll -= weights[i]; if (roll <= 0) { type = types[i]; break; } }
    const clear = PhaserMath.Between(0, 2);
    const lanes = type === "double" ? [0, 1, 2].filter(l => l !== clear) : [PhaserMath.Between(0, 2)];
    const slideDir = type === "drifter" ? driftDirForLane(lanes[0]) : 0;
    this.spawnSpecific(type, lanes, slideDir);
  }

  spawnSpecific(type, lanes, slideDir = 0) {
    const o = { type, lanes: lanes.slice(), z: CFG.spawnZStart, hit: false, passed: false };
    // Major threats and drifters can move laterally, but always telegraph the affected lanes.
    if (type === "train" || type === "drifter") {
      const dir = (slideDir !== undefined && slideDir !== 0) ? slideDir
        : (type === "train" && Math.random() < 0.14 ? driftDirForLane(lanes[0]) : 0);
      if (dir !== 0) {
        const dest = PhaserMath.Clamp(lanes[0] + dir, 0, 2);
        if (dest !== lanes[0]) {
          o.slideDir = dir; o.srcLane = lanes[0];
          o.slideProg = 0; o.laneShifted = false;
        }
      }
    }
    this.state.obstacles.push(o);
    // Warning indicator at horizon for this obstacle
    const warnColor = type === "train" ? 0xffc672 : (type === "beam" || type === "highBar") ? 0xbb78ff
      : type === "drifter" ? 0x77b8ff : (type === "block" || type === "double") ? 0xff5050 : 0xff7d6c;
    const warnLanes = ((type === "train" || type === "drifter") && o.slideDir)
      ? [o.srcLane, PhaserMath.Clamp(o.srcLane + o.slideDir, 0, 2)]
      : lanes;
    this.state.warnings.push({ lanes: warnLanes, t: CFG.trainWarnDur, maxT: CFG.trainWarnDur, color: warnColor, type, dir: o.slideDir || 0 });
  }

  spawnCoins() {
    const lane = PhaserMath.Between(0, 2);
    const floatH = Math.random() < 0.22 ? 55 : 18;
    this.spawnCoinLine(lane, 5, floatH);
  }

  spawnCoinLine(lane, count = 5, floatH = 18, spacing = 0.028) {
    for (let i = 0; i < count; i++) {
      this.state.coins.push({ lane, z: CFG.spawnZStart + i * spacing, floatH, rot: 0, collected: false });
    }
  }

  spawnPowerup() {
    const types = ["shield", "magnet", "boost"];
    this.state.powers.push({ type: types[PhaserMath.Between(0, 2)], lane: PhaserMath.Between(0, 2), z: CFG.spawnZStart, collected: false });
  }

  checkCollisions() {
    const s = this.state;
    const playerLane = s.laneT > 0.35 ? s.targetLane : s.prevLane;

    s.obstacles.forEach(o => {
      if (o.hit || o.passed || o.z < CFG.playerZ - 0.04 || o.z > CFG.playerZ + 0.06) return;
      const laneHit = o.lanes.includes(playerLane);

      // Lane-shift near-miss: player was in obstacle's lane but just shifted out
      if (!laneHit && s.laneT < 0.45 && o.lanes.includes(s.prevLane) && !o.nearMissChecked) {
        o.nearMissChecked = true;
        if (o.z > CFG.playerZ - 0.02 && o.z < CFG.playerZ + 0.05) this.triggerNearMiss(playerLane);
      }
      if (!laneHit) { if (o.z > CFG.playerZ + 0.02) o.passed = true; return; }

      let safe = false;
      if ((o.type === "barrier" || o.type === "lowBar") && s.jumpOffset > 20) safe = true;
      if ((o.type === "beam" || o.type === "highBar") && s.slideProg > 0.05 && s.slideProg < CFG.slideCollideWindow) safe = true;
      if (safe) {
        if (!o.nearMissChecked && o.z > CFG.playerZ + 0.01) {
          o.nearMissChecked = true;
          this.triggerNearMiss(playerLane);
        }
        if (o.z > CFG.playerZ + 0.02) o.passed = true;
        return;
      }
      // Hit
      o.hit = true;
      const hitRelX = LANE_REL[o.lanes[0]];
      const p = project(hitRelX, CFG.playerZ);
      this.spawnParticles(p.x, p.y - 35, 0xff7d6c, 22, 220);
      this.spawnParticles(p.x, p.y - 20, 0xff3030, 10, 140);
      SceneTransitions.shake(this, 230, 0.022);
      s.crashFlashT = 0.45;
      if (s.invulnT > 0 || s.boostT > 0) return;
      if (s.shield) { s.shield = false; s.invulnT = 1.2; return; }
      this.endRun();
    });

    s.coins.forEach(coin => {
      if (coin.collected || coin.z < CFG.playerZ - 0.06 || coin.z > CFG.playerZ + 0.05) return;
      if (s.magnetT <= 0 && coin.lane !== playerLane) return;
      if (coin.floatH > 40 && s.magnetT <= 0 && s.jumpOffset < 28) return;
      coin.collected = true;
      this.score.addCoins(1);
      this.audio.play("coin");
      this.game.events.emit("nd:coin");
      const p = project(LANE_REL[coin.lane], coin.z);
      this.spawnParticles(p.x, p.y - coin.floatH * coin.z, 0xffc672, 6, 90);
    });

    s.powers.forEach(power => {
      if (power.collected || power.z < CFG.playerZ - 0.04 || power.z > CFG.playerZ + 0.04 || power.lane !== playerLane) return;
      power.collected = true;
      if (power.type === "shield") s.shield = true;
      if (power.type === "magnet") s.magnetT = 6;
      if (power.type === "boost") { s.boostT = 3; s.invulnT = 3; }
      s.tip = power.type === "shield" ? "Shield armed. One free hit - still read the lane."
        : power.type === "magnet" ? "Magnet online. Cut through coin lines while it lasts."
        : "Boost online. Briefly invincible - use it to reset your lane.";
      this.audio.play("power");
      this.game.events.emit("nd:power");
      const p = project(LANE_REL[power.lane], CFG.playerZ);
      this.spawnParticles(p.x, p.y - 30, powerColor(power.type), 14, 120);
    });
  }

  triggerNearMiss(lane) {
    const s = this.state;
    s.nearMissCombo = Math.min(s.nearMissCombo + 1, 4);
    s.nearMissResetT = CFG.comboResetTime;
    const coins = Math.min(s.nearMissCombo, 3);
    this.score.addCoins(coins);
    s.nearMissT = 1.3;
    s.nearMissText = s.nearMissCombo > 1 ? `NEAR MISS x${s.nearMissCombo}` : "NEAR MISS!";
    const p = project(LANE_REL[lane], CFG.playerZ);
    s.nearMissX = p.x; s.nearMissY = p.y - 68;
    if (this.nearMissLabel) {
      this.nearMissLabel.setText(s.nearMissText);
      this.nearMissLabel.setPosition(s.nearMissX, s.nearMissY);
      this.nearMissLabel.setAlpha(1);
    }
    this.spawnParticles(p.x, p.y - 50, 0x8cf5da, 10, 110);
    this.game.events.emit("nd:coin");
    this.game.events.emit("nd:score-pulse");
  }

  endRun() {
    if (this.state.mode === "gameover") return;
    this.state.mode = "gameover";
    this.state.nearMissCombo = 0;
    this.registry.set("gameState", "gameover");
    this.audio.play("crash");
    SceneTransitions.shake(this, 280, 0.026);
    SceneTransitions.flash(this, 0xff3030, 210, 0.5);
    this.state.crashFlashT = 0.65;
    const run = { ...this.score.finish(), stageIndex: this.state.stageIndex, continueUsed: this.state.continueUsed };
    const bestCoins = this.registry.get("storage").setBest("best-coins", run.coins);
    const result = window.Zingcade ? window.Zingcade.postRun("neon-dash", {
      score: run.score, coins: run.coins, bestCoins, stage: STAGES[this.state.stageIndex].label
    }) : null;
    this.scene.launch("GameOverScene", { run, result });
  }

  emitHud() {
    this.game.events.emit("nd:hud", {
      score: this.score.score, best: this.score.best, coins: this.score.coins,
      stage: STAGES[this.state.stageIndex].label, speed: this.state.speed,
      tip: this.state.mode === "gameover"
        ? "Crash logged. Restart instantly and keep one escape lane open before the next counter."
        : this.state.tip,
      shield: this.state.shield, magnetT: this.state.magnetT, boostT: this.state.boostT
    });
  }

  updateSideTrains(dt) {
    const s = this.state;
    s.sideTrainTimer -= dt;
    if (s.sideTrainTimer <= 0) {
      const side = Math.random() < 0.5 ? "left" : "right";
      s.sideTrains.push({
        side, y: VPY + PhaserMath.FloatBetween(-10, 20),
        speed: s.speed * PhaserMath.FloatBetween(0.5, 0.75),
        height: PhaserMath.FloatBetween(55, 130),
        color: [0x1a3050, 0x0d2240, 0x223040, 0x152035][PhaserMath.Between(0, 3)],
        accent: [0x8cf5da, 0x77b8ff, 0xffc672, 0xbb78ff][PhaserMath.Between(0, 3)],
        lit: Math.random() < 0.65,
      });
      s.sideTrainTimer = PhaserMath.FloatBetween(1.1, 2.8);
    }
    s.sideTrains.forEach(t => { t.y += dt * t.speed; });
    s.sideTrains = s.sideTrains.filter(t => t.y < H + 180);
  }

  spawnParticles(x, y, color, count, speedMax) {
    for (let i = 0; i < count; i++) {
      const angle = PhaserMath.FloatBetween(0, Math.PI * 2);
      const speed = PhaserMath.FloatBetween(30, speedMax);
      this.state.particles.push({
        x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 30,
        life: PhaserMath.FloatBetween(0.35, 0.8), maxLife: 0.8,
        size: PhaserMath.FloatBetween(2, 5), color
      });
    }
  }

  updateParticles(dt) {
    this.state.particles.forEach(p => {
      p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 190 * dt; p.life -= dt;
    });
    this.state.particles = this.state.particles.filter(p => p.life > 0);
  }

  draw() {
    const g = this.g;
    const s = this.state;
    const stage = STAGES[s.stageIndex];
    g.clear();
    g.fillGradientStyle(stage.sky0, stage.sky0, stage.sky1, stage.sky1, 1);
    g.fillRect(0, 0, W, H);
    this.drawHorizon(g);
    this.drawSpeedStreaks(g);
    this.drawSideTrains(g);
    this.drawTrack(g);
    this.drawWarnings(g);
    const objects = [...s.obstacles, ...s.coins, ...s.powers]
      .filter(item => !item.collected && !item.hit).sort((a, b) => a.z - b.z);
    objects.forEach(obj => {
      if (obj.lanes) this.drawObstacle(g, obj);
      else if (obj.type) this.drawPower(g, obj);
      else this.drawCoin(g, obj);
    });
    this.drawPlayer(g);
    this.drawParticles(g);
    this.drawOverlayEffects(g);
    if (s.stageFlash > 0) {
      g.fillStyle(0x8cf5da, s.stageFlash * 0.14);
      g.fillRect(0, 0, W, H);
    }
    // Update near-miss label position/alpha if active
    if (this.nearMissLabel && s.nearMissT > 0) {
      const elapsed = 1.3 - s.nearMissT;
      this.nearMissLabel.setAlpha(Math.min(1, s.nearMissT * 2.5));
      this.nearMissLabel.setPosition(s.nearMissX, s.nearMissY - elapsed * 22);
    } else if (this.nearMissLabel && s.nearMissT <= 0) {
      this.nearMissLabel.setAlpha(0);
    }
  }

  drawSideTrains(g) {
    this.state.sideTrains.forEach(train => {
      // Side strips outside the track convergence lines
      // Left strip: x=0 to ~40px, Right strip: x=~380 to 420px (approximate)
      const stripW = 38;
      const x = train.side === "left" ? 0 : W - stripW;
      g.fillStyle(train.color, 0.75);
      g.fillRect(x, train.y, stripW, train.height);
      if (train.lit) {
        g.fillStyle(train.accent, 0.5);
        for (let wy = train.y + 7; wy < train.y + train.height - 8; wy += 15) {
          g.fillRect(x + 4, wy, stripW - 8, 6);
        }
      }
      g.lineStyle(1, train.accent, 0.3);
      g.strokeRect(x, train.y, stripW, train.height);
    });
  }

  drawHorizon(g) {
    const s = this.state;
    const stage = STAGES[s.stageIndex];
    const pulse = 0.5 + Math.sin(s.time * 3.2) * 0.5;
    g.fillStyle(0x8cf5da, 0.045 + pulse * 0.025);
    g.fillEllipse(VPX, VPY + 8, 310, 38);
    g.lineStyle(1, 0x8cf5da, 0.2 + pulse * 0.12);
    g.lineBetween(34, VPY + 12, W - 34, VPY + 12);

    for (let i = 0; i < 14; i++) {
      const x = (i * 48 + Math.floor(s.dist * 0.012)) % (W + 80) - 40;
      const h = 26 + ((i * 19 + s.stageIndex * 13) % 62);
      const top = VPY + 10 - h;
      g.fillStyle(stage.build, 0.68);
      g.fillRect(x, top, 22 + (i % 3) * 7, h);
      if (i % 3 !== 1) {
        g.fillStyle(i % 2 ? 0xbb78ff : 0x8cf5da, 0.18);
        g.fillRect(x + 4, top + 8, 14, 3);
        g.fillRect(x + 4, top + 19, 14, 3);
      }
    }

    if (s.stageIndex >= 1) {
      for (let z = (s.dist * 0.0012) % 0.24 + 0.08; z < 0.95; z += 0.24) {
        const left = project(-235, z);
        const right = project(235, z);
        const top = project(0, z * 0.58);
        const alpha = PhaserMath.Clamp(z * 0.12, 0.02, 0.1);
        g.lineStyle(Math.max(1, z * 2.2), s.stageIndex >= 3 ? 0xff7d6c : 0x77b8ff, alpha);
        g.beginPath();
        g.moveTo(left.x, left.y);
        g.lineTo(top.x, top.y - 35 * z);
        g.lineTo(right.x, right.y);
        g.strokePath();
      }
    }
  }

  drawSpeedStreaks(g) {
    const s = this.state;
    const intensity = PhaserMath.Clamp((s.speed - CFG.baseSpeed) / (CFG.maxSpeed - CFG.baseSpeed), 0, 1);
    const boost = s.boostT > 0 ? 0.22 : 0;
    const pulse = s.speedPulseT > 0 ? s.speedPulseT * 0.08 : 0;
    const alpha = 0.06 + intensity * 0.09 + boost + pulse;
    for (let i = 0; i < 12; i++) {
      const z = ((s.dist * 0.0026 + i * 0.071) % 1);
      if (z < 0.12) continue;
      const side = i % 2 === 0 ? -1 : 1;
      const rel = side * (225 + (i % 4) * 18);
      const p1 = project(rel, z);
      const p2 = project(rel * 0.92, Math.min(1, z + 0.08 + intensity * 0.06));
      g.lineStyle(Math.max(1, z * 3.5), i % 3 === 0 ? 0xbb78ff : 0x8cf5da, alpha * z);
      g.lineBetween(p1.x, p1.y, p2.x, p2.y);
    }
  }

  drawTrack(g) {
    g.fillStyle(0x060d18, 1);
    g.beginPath();
    g.moveTo(project(-210, 0.01).x, project(-210, 0.01).y);
    g.lineTo(project(210, 0.01).x, project(210, 0.01).y);
    g.lineTo(project(210, 1).x, project(210, 1).y);
    g.lineTo(project(-210, 1).x, project(-210, 1).y);
    g.closePath(); g.fillPath();
    for (let z = (this.state.dist * 0.00195) % 0.052 + 0.01; z < 1; z += 0.052) {
      const l = project(-210, z), r = project(210, z);
      g.lineStyle(Math.max(1, z * 2.8), 0x8cf5da, PhaserMath.Clamp(z * 0.26, 0, 0.2));
      g.lineBetween(l.x, l.y, r.x, r.y);
    }
    for (let z = (this.state.dist * 0.00105) % 0.18 + 0.03; z < 1; z += 0.18) {
      const left = project(-200, z), right = project(200, z);
      const alpha = PhaserMath.Clamp(z * 0.09, 0.018, 0.08);
      g.fillStyle(this.state.stageIndex >= 3 ? 0xff7d6c : 0x77b8ff, alpha);
      g.fillTriangle(left.x, left.y, right.x, right.y, project(0, Math.min(1, z + 0.07)).x, project(0, Math.min(1, z + 0.07)).y);
    }
    [-65, 65, -210, 210].forEach(relX => {
      const top = project(relX, 0.04), bot = project(relX, 1);
      const outer = Math.abs(relX) > 100;
      g.lineStyle(outer ? 3 : 1.5, 0x8cf5da, outer ? 0.55 : 0.18);
      g.lineBetween(top.x, top.y, bot.x, bot.y);
    });
    this.state.laneFlash.forEach((flash, lane) => {
      if (flash <= 0) return;
      const left = LANE_REL[lane] - LANE_HALF_W * 0.44;
      const right = LANE_REL[lane] + LANE_HALF_W * 0.44;
      const nearL = project(left, CFG.playerZ + 0.06);
      const nearR = project(right, CFG.playerZ + 0.06);
      const farR = project(right * 0.86, 0.18);
      const farL = project(left * 0.86, 0.18);
      g.fillStyle(0x8cf5da, flash * 0.25);
      g.beginPath();
      g.moveTo(farL.x, farL.y);
      g.lineTo(farR.x, farR.y);
      g.lineTo(nearR.x, nearR.y);
      g.lineTo(nearL.x, nearL.y);
      g.closePath();
      g.fillPath();
    });
  }

  drawWarnings(g) {
    this.state.warnings.forEach(w => {
      const blink = Math.sin(w.t * 18) > 0;
      const alpha = (w.t / w.maxT) * (blink ? 0.9 : 0.25);
      w.lanes.forEach(lane => {
        const pos = project(LANE_REL[lane], 0.09);
        const laneNear = project(LANE_REL[lane], 0.34);
        g.lineStyle(5, w.color, alpha * 0.18);
        g.lineBetween(pos.x, pos.y + 6, laneNear.x, laneNear.y);
        const sz = w.type === "train" ? 18 : 14;
        g.fillStyle(w.color, alpha);
        g.beginPath();
        g.moveTo(pos.x, pos.y + sz);
        g.lineTo(pos.x - sz, pos.y);
        g.lineTo(pos.x + sz, pos.y);
        g.closePath(); g.fillPath();
        if (w.type === "highBar") {
          g.lineStyle(2, 0xffffff, alpha * 0.55);
          g.lineBetween(pos.x - 10, pos.y + 17, pos.x + 10, pos.y + 17);
        }
      });
      if (w.dir) {
        const from = project(LANE_REL[w.lanes[0]], 0.13);
        const to = project(LANE_REL[w.lanes[w.lanes.length - 1]], 0.13);
        const dir = Math.sign(to.x - from.x) || w.dir;
        const ax = PhaserMath.Linear(from.x, to.x, 0.5);
        const ay = from.y + 24;
        g.fillStyle(w.color, alpha * 0.75);
        g.beginPath();
        g.moveTo(ax + dir * 16, ay);
        g.lineTo(ax - dir * 8, ay - 9);
        g.lineTo(ax - dir * 8, ay + 9);
        g.closePath();
        g.fillPath();
      }
    });
  }

  drawObstacle(g, obstacle) {
    const z = obstacle.z;
    if (z < 0.02 || z > 1.02) return;
    const groundY = VPY + TRACK_D * z;

    // Resolve draw x - sliding trains interpolate between lane positions
    const getLaneX = (lane) => VPX + LANE_REL[lane] * z;
    obstacle.lanes.forEach(lane => {
      let cx = getLaneX(lane);
      // Override for sliding trains - smooth visual position
      if (obstacle.slideDir && obstacle.srcLane !== undefined) {
        const destLane = PhaserMath.Clamp(obstacle.srcLane + obstacle.slideDir, 0, 2);
        const t = PhaserMath.Easing.Cubic.InOut(obstacle.slideProg || 0);
        cx = PhaserMath.Linear(getLaneX(obstacle.srcLane), getLaneX(destLane), t);
      }
      const w = LANE_HALF_W * 2 * z * 0.88;

      if (obstacle.type === "beam" || obstacle.type === "highBar") {
        const beamY = groundY - 86 * z;
        g.fillStyle(0xbb78ff, 0.15);
        g.fillRect(cx - w / 2, beamY - 20 * z, w, 48 * z);
        g.fillStyle(0xbb78ff, 0.96);
        g.fillRect(cx - w / 2, beamY, w, 18 * z);
        g.fillStyle(0xffffff, 0.58);
        g.fillRect(cx - w / 2 + 2, beamY + 5 * z, w - 4, 5 * z);
        g.lineStyle(2 * z, 0xbb78ff, 0.75);
        g.lineBetween(cx - w / 2, groundY - 10 * z, cx - w / 2, beamY + 18 * z);
        g.lineBetween(cx + w / 2, groundY - 10 * z, cx + w / 2, beamY + 18 * z);
        for (let mark = -1; mark <= 1; mark += 1) {
          const mx = cx + mark * w * 0.22;
          g.fillStyle(0xffffff, 0.28);
          g.beginPath();
          g.moveTo(mx, beamY + 31 * z);
          g.lineTo(mx - 7 * z, beamY + 20 * z);
          g.lineTo(mx + 7 * z, beamY + 20 * z);
          g.closePath();
          g.fillPath();
        }
        return;
      }
      if (obstacle.type === "train") {
        const th = 112 * z;
        const nose = 16 * z;
        g.fillStyle(0x120d18, 0.34);
        g.fillEllipse(cx, groundY + 4 * z, w * 1.08, 18 * z);
        g.fillStyle(0xe8a020, 0.98);
        g.fillRect(cx - w / 2, groundY - th, w, th - nose);
        g.fillStyle(0xb07010, 0.95);
        g.fillTriangle(cx - w / 2, groundY - nose, cx + w / 2, groundY - nose, cx, groundY);
        g.fillStyle(0x3a2210, 0.55);
        g.fillRect(cx - w / 2, groundY - th * 0.34, w, th * 0.28);
        // Windows
        const ww = w * 0.3, wh = 13 * z, wy = groundY - th + 8 * z;
        g.fillStyle(0x8cf5da, 0.78);
        g.fillRect(cx - w / 2 + 6 * z, wy, ww, wh);
        g.fillRect(cx + w / 2 - 6 * z - ww, wy, ww, wh);
        // Warning stripe top
        g.fillStyle(0xff3030, 0.65);
        g.fillRect(cx - w / 2, groundY - th, w, 5 * z);
        // Border glow
        g.lineStyle(2.5 * z, 0xffd060, 0.9);
        g.strokeRect(cx - w / 2, groundY - th, w, th);
        g.fillStyle(0xfff1a8, 0.9);
        g.fillCircle(cx - w * 0.28, groundY - 22 * z, 6 * z);
        g.fillCircle(cx + w * 0.28, groundY - 22 * z, 6 * z);
        // Slide direction arrow
        if (obstacle.slideDir && !obstacle.laneShifted && (obstacle.slideProg || 0) < 0.65) {
          const arrAlpha = 1 - (obstacle.slideProg || 0) / 0.65;
          const ax = cx + (obstacle.slideDir > 0 ? w / 2 + 10 * z : -w / 2 - 10 * z);
          const ay = groundY - th / 2;
          const as = 9 * z;
          g.fillStyle(0xffd060, arrAlpha);
          g.beginPath();
          if (obstacle.slideDir > 0) {
            g.moveTo(ax - as, ay - as); g.lineTo(ax + as, ay); g.lineTo(ax - as, ay + as);
          } else {
            g.moveTo(ax + as, ay - as); g.lineTo(ax - as, ay); g.lineTo(ax + as, ay + as);
          }
          g.closePath(); g.fillPath();
        }
        return;
      }
      if (obstacle.type === "drifter") {
        const h = 70 * z;
        const tilt = (obstacle.slideDir || 0) * 10 * z * (1 - Math.abs((obstacle.slideProg || 0) - 0.5));
        g.fillStyle(0x77b8ff, 0.18);
        g.fillRect(cx - w / 2 - tilt, groundY - h - 8 * z, w, h + 10 * z);
        g.fillStyle(0xff5050, 0.94);
        g.beginPath();
        g.moveTo(cx - w / 2 + tilt, groundY - h);
        g.lineTo(cx + w / 2 + tilt, groundY - h + 8 * z);
        g.lineTo(cx + w / 2 - tilt, groundY);
        g.lineTo(cx - w / 2 - tilt, groundY - 8 * z);
        g.closePath();
        g.fillPath();
        g.fillStyle(0x77b8ff, 0.72);
        g.fillRect(cx - w * 0.34, groundY - h + 11 * z, w * 0.68, 8 * z);
        g.lineStyle(2 * z, 0xffffff, 0.24);
        g.strokeRect(cx - w / 2, groundY - h, w, h);
        if (obstacle.slideDir) {
          const ghostX = cx - obstacle.slideDir * 28 * z;
          g.lineStyle(2 * z, 0x77b8ff, 0.24);
          g.lineBetween(ghostX, groundY - h * 0.5, cx, groundY - h * 0.5);
        }
        return;
      }
      if (obstacle.type === "lowBar") {
        const h = 26 * z;
        g.fillStyle(0x2a1208, 0.3);
        g.fillEllipse(cx, groundY + 3 * z, w * 0.92, 12 * z);
        g.fillStyle(0xff9944, 0.92);
        g.fillRect(cx - w / 2, groundY - h, w, h);
        g.lineStyle(1.5 * z, 0xffcc88, 0.55);
        g.strokeRect(cx - w / 2, groundY - h, w, h);
        for (let stripe = -2; stripe <= 2; stripe += 1) {
          const x = cx + stripe * w * 0.18;
          g.lineStyle(1.2 * z, 0x3a1608, 0.55);
          g.lineBetween(x - 7 * z, groundY - h + 4 * z, x + 7 * z, groundY - 4 * z);
        }
        return;
      }
      // barrier / block / double
      const h = obstacle.type === "barrier" ? 42 * z : 90 * z;
      g.fillStyle(0x12080a, 0.28);
      g.fillEllipse(cx, groundY + 3 * z, w * 0.94, 14 * z);
      g.fillStyle(obstacle.type === "barrier" ? 0xff7d6c : 0xff5050, 0.94);
      g.fillRect(cx - w / 2, groundY - h, w, h);
      g.lineStyle(2 * z, 0xffffff, 0.24);
      g.strokeRect(cx - w / 2, groundY - h, w, h);
      if (obstacle.type !== "barrier") {
        g.lineBetween(cx - w / 2 + 8, groundY - h + 8, cx + w / 2 - 8, groundY - 8);
        g.lineBetween(cx + w / 2 - 8, groundY - h + 8, cx - w / 2 + 8, groundY - 8);
      }
    });
  }

  drawCoin(g, coin) {
    const pos = project(LANE_REL[coin.lane], coin.z);
    const y = pos.y - coin.floatH * coin.z;
    g.fillStyle(0xffc672, 0.95);
    g.fillEllipse(pos.x, y, Math.max(3, 16 * coin.z * Math.abs(Math.cos(coin.rot))), Math.max(4, 18 * coin.z));
  }

  drawPower(g, power) {
    const pos = project(LANE_REL[power.lane], power.z);
    const y = pos.y - 30 * power.z;
    const color = powerColor(power.type);
    g.lineStyle(3 * power.z, color, 0.95);
    g.strokeCircle(pos.x, y, 12 * power.z);
    g.fillStyle(color, 0.28);
    g.fillCircle(pos.x, y, 8 * power.z);
  }

  drawPlayer(g) {
    if (this.state.mode === "start") return;
    const z = CFG.playerZ;
    const lx = PhaserMath.Linear(
      LANE_REL[this.state.prevLane], LANE_REL[this.state.targetLane],
      PhaserMath.Easing.Cubic.Out(this.state.laneT)
    );
    const pos = project(lx, z);
    const groundY = pos.y - this.state.jumpOffset;
    const color = this.state.shield ? 0x77b8ff : this.state.boostT > 0 ? 0xcc88ff : 0x8cf5da;
    const pulse = this.state.actionPulseT > 0 ? this.state.actionPulseT / 0.22 : 0;
    g.fillStyle(0x8cf5da, 0.08 + pulse * 0.18);
    g.fillEllipse(pos.x, pos.y + 4 * z, (64 + pulse * 34) * z, (16 + pulse * 8) * z);
    g.lineStyle(3 * z, color, this.state.invulnT > 0 ? 0.7 : 1);
    g.fillStyle(color, 1);
    if (this.state.slideProg > 0.04 && this.state.slideProg < 0.96) {
      g.fillRect(pos.x - 21 * z, groundY - 16 * z, 42 * z, 16 * z);
      g.fillCircle(pos.x + 15 * z, groundY - 20 * z, 9 * z);
      g.lineStyle(2 * z, 0xbb78ff, 0.35);
      g.lineBetween(pos.x - 34 * z, groundY - 6 * z, pos.x + 24 * z, groundY - 6 * z);
    } else {
      const hipY = groundY - 22 * z, shoulderY = hipY - 28 * z, headY = shoulderY - 13 * z;
      const swing = Math.sin(this.state.runCycle * Math.PI * 2) * 13 * z;
      g.lineBetween(pos.x, hipY, pos.x, shoulderY);
      g.lineBetween(pos.x, hipY, pos.x - swing, groundY);
      g.lineBetween(pos.x, hipY, pos.x + swing, groundY);
      g.lineBetween(pos.x, shoulderY + 6 * z, pos.x + swing, shoulderY + 22 * z);
      g.lineBetween(pos.x, shoulderY + 6 * z, pos.x - swing, shoulderY + 22 * z);
      g.fillCircle(pos.x, headY, 11 * z);
      if (this.state.jumpOffset > 12) {
        g.lineStyle(2 * z, 0x77b8ff, 0.28);
        g.lineBetween(pos.x - 18 * z, groundY + 12 * z, pos.x + 18 * z, groundY + 12 * z);
      }
    }
    if (this.state.shield) {
      g.lineStyle(2.5 * z, 0x77b8ff, 0.5);
      g.strokeCircle(pos.x, groundY - 28 * z, 44 * z);
    }
  }

  drawParticles(g) {
    this.state.particles.forEach(p => {
      g.fillStyle(p.color, Math.max(0, p.life / p.maxLife));
      g.fillCircle(p.x, p.y, p.size * Math.max(0.4, p.life / p.maxLife));
    });
  }

  drawOverlayEffects(g) {
    const s = this.state;
    if (s.crashFlashT > 0) {
      g.fillStyle(0xff1515, s.crashFlashT * 0.48);
      g.fillRect(0, 0, W, H);
    }
  }

  shutdown() {
    this.inputManager?.destroy();
    this.game.events.off("nd:start-run", this.startRun, this);
    this.game.events.off("nd:continue-run", this.continueRun, this);
    this.game.events.off("nd:toggle-pause", this.togglePause, this);
    this.game.events.off("nd:pause", this.pauseRun, this);
    this.game.events.off("nd:resume", this.resumeRun, this);
    this.game.events.off("nd:input", this.handleInput, this);
  }
}

function powerColor(type) {
  if (type === "shield") return 0x77b8ff;
  if (type === "magnet") return 0xffc672;
  return 0xbb78ff;
}

function driftDirForLane(lane) {
  if (lane <= 0) return 1;
  if (lane >= 2) return -1;
  return Math.random() < 0.5 ? -1 : 1;
}
