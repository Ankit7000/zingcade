import { InputManager } from "../../../_shared/phaser/systems/InputManager.js";
import { SceneTransitions } from "../../../_shared/phaser/systems/SceneTransitions.js";
import { CFG, H, LANE_HALF_W, LANE_REL, PATTERNS, STAGES, TRACK_D, VPX, VPY, W, project } from "../config.js";

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
      warnings: [],       // { lanes, t, maxT, color }
      nearMissT: 0, nearMissCombo: 0, nearMissText: "",
      nearMissX: VPX, nearMissY: VPY + TRACK_D * CFG.playerZ - 68,
      sideTrains: [], sideTrainTimer: 2.2,
      patternCooldown: 11, patternQueue: [],
      crashFlashT: 0,
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
    this.spawnParticles(p.x, p.y - 30, 0x8cf5da, 4, 70);
  }

  jump() {
    if (this.state.jumpProg > 0 || this.state.slideProg > 0) return;
    this.state.jumpProg = 0.001;
    this.audio.play("jump");
    const p = project(LANE_REL[this.state.targetLane], CFG.playerZ);
    this.spawnParticles(p.x, p.y - 12, 0x77b8ff, 6, 90);
  }

  slide() {
    if (this.state.jumpProg > 0 || this.state.slideProg > 0) return;
    this.state.slideProg = 0.001;
    this.audio.play("slide");
    const p = project(LANE_REL[this.state.targetLane], CFG.playerZ);
    this.spawnParticles(p.x, p.y - 10, 0xbb78ff, 5, 80);
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
      SceneTransitions.flash(this, 0x8cf5da, 180, 0.35);
    }
    s.stageFlash = Math.max(0, s.stageFlash - dt);
    this.updatePlayer(dt);

    const zSpeed = worldSpeed / TRACK_D;
    s.obstacles.forEach(o => {
      o.z += dt * zSpeed;
      // Sliding train: shifts lane as it approaches
      if (o.slideDir && o.srcLane !== undefined) {
        o.slideProg = Math.min(1, (o.slideProg || 0) + dt * 0.5);
        const destLane = PhaserMath.Clamp(o.srcLane + o.slideDir, 0, 2);
        if (o.slideProg >= 0.5 && !o.laneShifted) {
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
    if (s.crashFlashT > 0) { s.crashFlashT = Math.max(0, s.crashFlashT - dt); }
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
  }

  updateSpawns(dt) {
    const s = this.state;
    // Drain pattern queue
    const remaining = [];
    for (const item of s.patternQueue) {
      if (s.time >= item.triggerTime) {
        item.obstacles.forEach(o => this.spawnSpecific(o.type, o.lanes, o.slideDir));
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
      s.patternQueue.push({ triggerTime: s.time + group.delay, obstacles: group.obstacles });
    });
  }

  spawnObstacle() {
    // Weights per stage: [barrier, beam, block, double, lowBar, train]
    const weightTable = [
      [4, 1, 2, 0, 2, 0],
      [3, 2, 2, 1, 2, 1],
      [2, 2, 3, 2, 2, 2],
      [1, 2, 2, 3, 2, 3]
    ];
    const weights = weightTable[this.state.stageIndex];
    const types = ["barrier", "beam", "block", "double", "lowBar", "train"];
    let roll = Math.random() * weights.reduce((s, v) => s + v, 0);
    let type = "barrier";
    for (let i = 0; i < weights.length; i++) { roll -= weights[i]; if (roll <= 0) { type = types[i]; break; } }
    const clear = PhaserMath.Between(0, 2);
    const lanes = type === "double" ? [0, 1, 2].filter(l => l !== clear) : [PhaserMath.Between(0, 2)];
    this.spawnSpecific(type, lanes, 0);
  }

  spawnSpecific(type, lanes, slideDir = 0) {
    const o = { type, lanes: lanes.slice(), z: CFG.spawnZStart, hit: false, passed: false };
    // Train: optional lateral drift across lanes
    if (type === "train") {
      const dir = (slideDir !== undefined && slideDir !== 0) ? slideDir
        : (Math.random() < 0.28 ? (lanes[0] === 0 ? 1 : lanes[0] === 2 ? -1 : (Math.random() < 0.5 ? -1 : 1)) : 0);
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
    const warnColor = type === "train" ? 0xffc672 : type === "beam" ? 0xbb78ff
      : (type === "block" || type === "double") ? 0xff5050 : 0xff7d6c;
    const warnLanes = (type === "train" && o.slideDir)
      ? [o.srcLane, PhaserMath.Clamp(o.srcLane + o.slideDir, 0, 2)]
      : lanes;
    this.state.warnings.push({ lanes: warnLanes, t: CFG.trainWarnDur, maxT: CFG.trainWarnDur, color: warnColor });
  }

  spawnCoins() {
    const lane = PhaserMath.Between(0, 2);
    const floatH = Math.random() < 0.22 ? 55 : 18;
    for (let i = 0; i < 5; i++) {
      this.state.coins.push({ lane, z: CFG.spawnZStart + i * 0.028, floatH, rot: 0, collected: false });
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
      if ((o.type === "beam"    || o.type === "lowBar") && s.slideProg > 0.05 && s.slideProg < CFG.slideCollideWindow) safe = true;
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
    s.nearMissCombo = Math.min(s.nearMissCombo + 1, 5);
    const coins = s.nearMissCombo;
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
    [-65, 65, -210, 210].forEach(relX => {
      const top = project(relX, 0.04), bot = project(relX, 1);
      const outer = Math.abs(relX) > 100;
      g.lineStyle(outer ? 3 : 1.5, 0x8cf5da, outer ? 0.55 : 0.18);
      g.lineBetween(top.x, top.y, bot.x, bot.y);
    });
  }

  drawWarnings(g) {
    this.state.warnings.forEach(w => {
      const blink = Math.sin(w.t * 18) > 0;
      const alpha = (w.t / w.maxT) * (blink ? 0.9 : 0.25);
      w.lanes.forEach(lane => {
        const pos = project(LANE_REL[lane], 0.09);
        const sz = 14;
        g.fillStyle(w.color, alpha);
        g.beginPath();
        g.moveTo(pos.x, pos.y + sz);
        g.lineTo(pos.x - sz, pos.y);
        g.lineTo(pos.x + sz, pos.y);
        g.closePath(); g.fillPath();
      });
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

      if (obstacle.type === "beam") {
        g.fillStyle(0xbb78ff, 0.95);
        g.fillRect(cx - w / 2, groundY - 88 * z, w, 18 * z);
        g.fillStyle(0xffffff, 0.5);
        g.fillRect(cx - w / 2 + 2, groundY - 83 * z, w - 4, 6 * z);
        return;
      }
      if (obstacle.type === "train") {
        const th = 95 * z;
        g.fillStyle(0xe8a020, 0.96);
        g.fillRect(cx - w / 2, groundY - th, w, th);
        g.fillStyle(0xb07010, 0.8);
        g.fillRect(cx - w / 2, groundY - th * 0.35, w, th * 0.35);
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
      if (obstacle.type === "lowBar") {
        const h = 22 * z;
        g.fillStyle(0xff9944, 0.92);
        g.fillRect(cx - w / 2, groundY - h, w, h);
        g.lineStyle(1.5 * z, 0xffcc88, 0.55);
        g.strokeRect(cx - w / 2, groundY - h, w, h);
        return;
      }
      // barrier / block / double
      const h = obstacle.type === "barrier" ? 42 * z : 90 * z;
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
    g.lineStyle(3 * z, color, this.state.invulnT > 0 ? 0.7 : 1);
    g.fillStyle(color, 1);
    if (this.state.slideProg > 0.04 && this.state.slideProg < 0.96) {
      g.fillRect(pos.x - 21 * z, groundY - 16 * z, 42 * z, 16 * z);
      g.fillCircle(pos.x + 15 * z, groundY - 20 * z, 9 * z);
    } else {
      const hipY = groundY - 22 * z, shoulderY = hipY - 28 * z, headY = shoulderY - 13 * z;
      const swing = Math.sin(this.state.runCycle * Math.PI * 2) * 13 * z;
      g.lineBetween(pos.x, hipY, pos.x, shoulderY);
      g.lineBetween(pos.x, hipY, pos.x - swing, groundY);
      g.lineBetween(pos.x, hipY, pos.x + swing, groundY);
      g.lineBetween(pos.x, shoulderY + 6 * z, pos.x + swing, shoulderY + 22 * z);
      g.lineBetween(pos.x, shoulderY + 6 * z, pos.x - swing, shoulderY + 22 * z);
      g.fillCircle(pos.x, headY, 11 * z);
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
