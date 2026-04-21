import { InputManager } from "../../../_shared/phaser/systems/InputManager.js";
import { SceneTransitions } from "../../../_shared/phaser/systems/SceneTransitions.js";
import { CFG, H, LANE_HALF_W, LANE_REL, STAGES, TRACK_D, VPX, VPY, W, project } from "../config.js";

const PhaserScene = globalThis.Phaser.Scene;
const PhaserMath = globalThis.Phaser.Math;

export class GameScene extends PhaserScene {
  constructor() {
    super("GameScene");
  }

  create() {
    this.g = this.add.graphics();
    this.audio = this.registry.get("audio");
    this.score = this.registry.get("score");
    this.inputManager = new InputManager(this, {
      left: () => this.handleInput("left"),
      right: () => this.handleInput("right"),
      up: () => this.handleInput("jump"),
      down: () => this.handleInput("slide"),
      primary: () => this.handleInput("primary"),
      pause: () => this.togglePause()
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
      mode,
      time: 0,
      dist: 0,
      speed: CFG.baseSpeed,
      stageIndex: 0,
      stageFlash: 0,
      lane: 1,
      targetLane: 1,
      prevLane: 1,
      laneT: 1,
      jumpProg: 0,
      jumpOffset: 0,
      slideProg: 0,
      runCycle: 0,
      shield: false,
      magnetT: 0,
      boostT: 0,
      invulnT: 0,
      obstacles: [],
      coins: [],
      powers: [],
      particles: [],
      obstacleTimer: 1.8,
      coinTimer: 1.2,
      continueUsed: false,
      tip: "Keep your eyes on the horizon - the faster you are, the earlier you must react."
    };
    this.score.reset();
    this.registry.set("gameState", mode);
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
    this.state.obstacles = this.state.obstacles.filter((o) => o.z < CFG.playerZ - 0.15 || o.z > CFG.playerZ + 0.15);
    this.game.events.emit("nd:hide-overlay");
    document.getElementById("pauseBtn").textContent = "Pause";
  }

  handleInput(action) {
    if (this.state.mode === "start" || this.state.mode === "gameover") {
      this.game.events.emit("nd:start-run");
      return;
    }
    if (this.state.mode === "paused") {
      this.resumeRun();
      return;
    }
    if (this.state.mode !== "playing") return;
    if (action === "left") this.moveLane(-1);
    if (action === "right") this.moveLane(1);
    if (action === "jump") this.jump();
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
    STAGES.forEach((item, index) => {
      if (s.time >= item.t) nextStage = index;
    });
    if (nextStage !== s.stageIndex) {
      s.stageIndex = nextStage;
      s.stageFlash = 1.4;
      SceneTransitions.flash(this, 0x8cf5da, 180, 0.35);
    }
    s.stageFlash = Math.max(0, s.stageFlash - dt);

    this.updatePlayer(dt);
    const zSpeed = worldSpeed / TRACK_D;
    s.obstacles.forEach((o) => { o.z += dt * zSpeed; });
    s.coins.forEach((c) => { c.z += dt * zSpeed; c.rot += dt * 4.5; });
    s.powers.forEach((p) => { p.z += dt * zSpeed; });
    s.obstacles = s.obstacles.filter((o) => o.z < CFG.despawnZ && !o.hit);
    s.coins = s.coins.filter((c) => oob(c));
    s.powers = s.powers.filter((p) => oob(p));
    this.checkCollisions();
    this.updateSpawns(dt);
    this.emitHud();

    function oob(item) {
      return item.z < CFG.despawnZ && !item.collected;
    }
  }

  updatePlayer(dt) {
    const s = this.state;
    if (s.laneT < 1) {
      s.laneT = Math.min(1, s.laneT + dt / CFG.laneSwapTime);
      if (s.laneT >= 1) {
        s.lane = s.targetLane;
        s.prevLane = s.targetLane;
      }
    }
    if (s.jumpProg > 0) {
      s.jumpProg = Math.min(1, s.jumpProg + dt / CFG.jumpDur);
      s.jumpOffset = Math.sin(s.jumpProg * Math.PI) * CFG.jumpH;
      if (s.jumpProg >= 1) {
        s.jumpProg = 0;
        s.jumpOffset = 0;
      }
    }
    if (s.slideProg > 0) {
      s.slideProg = Math.min(1, s.slideProg + dt / CFG.slideDur);
      if (s.slideProg >= 1) s.slideProg = 0;
    }
    s.runCycle = (s.runCycle + dt * (1 + s.speed / 600)) % 1;
    s.magnetT = Math.max(0, s.magnetT - dt);
    s.boostT = Math.max(0, s.boostT - dt);
    s.invulnT = Math.max(0, s.invulnT - dt);
  }

  updateSpawns(dt) {
    const s = this.state;
    s.obstacleTimer -= dt;
    if (s.obstacleTimer <= 0) {
      this.spawnObstacle();
      const mult = STAGES[s.stageIndex].mult;
      s.obstacleTimer = Math.max(0.65, PhaserMath.FloatBetween(CFG.obstSpawnInterval[0] / mult, CFG.obstSpawnInterval[1] / mult) * 0.98);
    }
    s.coinTimer -= dt;
    if (s.coinTimer <= 0) {
      this.spawnCoins();
      if (Math.random() < 0.12) this.spawnPowerup();
      s.coinTimer = PhaserMath.FloatBetween(CFG.coinSpawnInterval[0], CFG.coinSpawnInterval[1]);
    }
  }

  spawnObstacle() {
    const weights = [[4, 1, 2, 0], [3, 2, 2, 1], [2, 2, 3, 2], [1, 2, 2, 3]][this.state.stageIndex];
    const types = ["barrier", "beam", "block", "double"];
    let roll = Math.random() * weights.reduce((sum, value) => sum + value, 0);
    let type = "barrier";
    for (let i = 0; i < weights.length; i += 1) {
      roll -= weights[i];
      if (roll <= 0) {
        type = types[i];
        break;
      }
    }
    const clear = PhaserMath.Between(0, 2);
    const lanes = type === "double" ? [0, 1, 2].filter((lane) => lane !== clear) : [PhaserMath.Between(0, 2)];
    this.state.obstacles.push({ type, lanes, z: CFG.spawnZStart, hit: false, passed: false });
  }

  spawnCoins() {
    const lane = PhaserMath.Between(0, 2);
    const floatH = Math.random() < 0.22 ? 55 : 18;
    for (let i = 0; i < 5; i += 1) {
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
    s.obstacles.forEach((o) => {
      if (o.hit || o.passed || o.z < CFG.playerZ - 0.04 || o.z > CFG.playerZ + 0.06) return;
      const laneHit = o.lanes.includes(playerLane);
      if (!laneHit) {
        if (o.z > CFG.playerZ + 0.02) o.passed = true;
        return;
      }
      let safe = false;
      if (o.type === "barrier" && s.jumpOffset > 32) safe = true;
      if (o.type === "beam" && s.slideProg > 0.05 && s.slideProg < CFG.slideCollideWindow) safe = true;
      if (safe) {
        if (o.z > CFG.playerZ + 0.02) o.passed = true;
        return;
      }
      o.hit = true;
      const p = project(LANE_REL[o.lanes[0]], CFG.playerZ);
      this.spawnParticles(p.x, p.y - 35, 0xff7d6c, 18, 180);
      SceneTransitions.shake(this, 180, 0.018);
      if (s.invulnT > 0 || s.boostT > 0) return;
      if (s.shield) {
        s.shield = false;
        s.invulnT = 1.2;
        return;
      }
      this.endRun();
    });

    s.coins.forEach((coin) => {
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

    s.powers.forEach((power) => {
      if (power.collected || power.z < CFG.playerZ - 0.04 || power.z > CFG.playerZ + 0.04 || power.lane !== playerLane) return;
      power.collected = true;
      if (power.type === "shield") s.shield = true;
      if (power.type === "magnet") s.magnetT = 6;
      if (power.type === "boost") {
        s.boostT = 3;
        s.invulnT = 3;
      }
      s.tip = power.type === "shield"
        ? "Shield armed. You can absorb one hit, but clean reads still score faster."
        : power.type === "magnet"
          ? "Magnet online. Cut through coin lines while it lasts."
          : "Boost online. You are briefly invincible - use it to reset your lane.";
      this.audio.play("power");
      this.game.events.emit("nd:power");
      const p = project(LANE_REL[power.lane], CFG.playerZ);
      this.spawnParticles(p.x, p.y - 30, powerColor(power.type), 14, 120);
    });
  }

  endRun() {
    if (this.state.mode === "gameover") return;
    this.state.mode = "gameover";
    this.registry.set("gameState", "gameover");
    this.audio.play("crash");
    SceneTransitions.shake(this, 220, 0.02);
    const run = {
      ...this.score.finish(),
      stageIndex: this.state.stageIndex,
      continueUsed: this.state.continueUsed
    };
    const bestCoins = this.registry.get("storage").setBest("best-coins", run.coins);
    const result = window.Zingcade
      ? window.Zingcade.postRun("neon-dash", {
          score: run.score,
          coins: run.coins,
          bestCoins,
          stage: STAGES[this.state.stageIndex].label
        })
      : null;
    this.scene.launch("GameOverScene", { run, result });
  }

  emitHud() {
    this.game.events.emit("nd:hud", {
      score: this.score.score,
      best: this.score.best,
      coins: this.score.coins,
      stage: STAGES[this.state.stageIndex].label,
      speed: this.state.speed,
      tip: this.state.mode === "gameover" ? "Crash logged. Restart instantly and keep one escape lane open before the next counter." : this.state.tip,
      shield: this.state.shield,
      magnetT: this.state.magnetT,
      boostT: this.state.boostT
    });
  }

  spawnParticles(x, y, color, count, speedMax) {
    for (let i = 0; i < count; i += 1) {
      const angle = PhaserMath.FloatBetween(0, Math.PI * 2);
      const speed = PhaserMath.FloatBetween(30, speedMax);
      this.state.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 30,
        life: PhaserMath.FloatBetween(0.35, 0.8),
        maxLife: 0.8,
        size: PhaserMath.FloatBetween(2, 5),
        color
      });
    }
  }

  updateParticles(dt) {
    this.state.particles.forEach((p) => {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 190 * dt;
      p.life -= dt;
    });
    this.state.particles = this.state.particles.filter((p) => p.life > 0);
  }

  draw() {
    const g = this.g;
    const s = this.state;
    const stage = STAGES[s.stageIndex];
    g.clear();
    g.fillGradientStyle(stage.sky0, stage.sky0, stage.sky1, stage.sky1, 1);
    g.fillRect(0, 0, W, H);
    this.drawTrack(g);
    const objects = [...s.obstacles, ...s.coins, ...s.powers].filter((item) => !item.collected && !item.hit).sort((a, b) => a.z - b.z);
    objects.forEach((obj) => {
      if (obj.lanes) this.drawObstacle(g, obj);
      else if (obj.type) this.drawPower(g, obj);
      else this.drawCoin(g, obj);
    });
    this.drawPlayer(g);
    this.drawParticles(g);
    if (s.stageFlash > 0) {
      g.fillStyle(0x8cf5da, s.stageFlash * 0.14);
      g.fillRect(0, 0, W, H);
    }
  }

  drawTrack(g) {
    g.fillStyle(0x060d18, 1);
    g.beginPath();
    g.moveTo(project(-210, 0.01).x, project(-210, 0.01).y);
    g.lineTo(project(210, 0.01).x, project(210, 0.01).y);
    g.lineTo(project(210, 1).x, project(210, 1).y);
    g.lineTo(project(-210, 1).x, project(-210, 1).y);
    g.closePath();
    g.fillPath();
    for (let z = (this.state.dist * 0.00195) % 0.052 + 0.01; z < 1; z += 0.052) {
      const l = project(-210, z);
      const r = project(210, z);
      g.lineStyle(Math.max(1, z * 2.8), 0x8cf5da, PhaserMath.Clamp(z * 0.26, 0, 0.2));
      g.lineBetween(l.x, l.y, r.x, r.y);
    }
    [-65, 65, -210, 210].forEach((relX) => {
      const top = project(relX, 0.04);
      const bot = project(relX, 1);
      g.lineStyle(relX > 100 || relX < -100 ? 3 : 1.5, 0x8cf5da, relX > 100 || relX < -100 ? 0.55 : 0.18);
      g.lineBetween(top.x, top.y, bot.x, bot.y);
    });
  }

  drawObstacle(g, obstacle) {
    obstacle.lanes.forEach((lane) => {
      const z = obstacle.z;
      if (z < 0.02 || z > 1.02) return;
      const groundY = VPY + TRACK_D * z;
      const cx = VPX + LANE_REL[lane] * z;
      const width = LANE_HALF_W * 2 * z * 0.88;
      if (obstacle.type === "beam") {
        g.fillStyle(0xbb78ff, 0.95);
        g.fillRect(cx - width / 2, groundY - 88 * z, width, 18 * z);
        g.fillStyle(0xffffff, 0.5);
        g.fillRect(cx - width / 2 + 2, groundY - 83 * z, width - 4, 6 * z);
        return;
      }
      const height = obstacle.type === "barrier" ? 42 * z : 90 * z;
      g.fillStyle(obstacle.type === "barrier" ? 0xff7d6c : 0xff5050, 0.94);
      g.fillRect(cx - width / 2, groundY - height, width, height);
      g.lineStyle(2 * z, 0xffffff, 0.24);
      g.strokeRect(cx - width / 2, groundY - height, width, height);
      if (obstacle.type !== "barrier") {
        g.lineBetween(cx - width / 2 + 8, groundY - height + 8, cx + width / 2 - 8, groundY - 8);
        g.lineBetween(cx + width / 2 - 8, groundY - height + 8, cx - width / 2 + 8, groundY - 8);
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
    const lx = PhaserMath.Linear(LANE_REL[this.state.prevLane], LANE_REL[this.state.targetLane], PhaserMath.Easing.Cubic.Out(this.state.laneT));
    const pos = project(lx, z);
    const groundY = pos.y - this.state.jumpOffset;
    const color = this.state.shield ? 0x77b8ff : this.state.boostT > 0 ? 0xcc88ff : 0x8cf5da;
    g.lineStyle(3 * z, color, this.state.invulnT > 0 ? 0.7 : 1);
    g.fillStyle(color, 1);
    if (this.state.slideProg > 0.04 && this.state.slideProg < 0.96) {
      g.fillRect(pos.x - 21 * z, groundY - 16 * z, 42 * z, 16 * z);
      g.fillCircle(pos.x + 15 * z, groundY - 20 * z, 9 * z);
    } else {
      const hipY = groundY - 22 * z;
      const shoulderY = hipY - 28 * z;
      const headY = shoulderY - 13 * z;
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
    this.state.particles.forEach((p) => {
      g.fillStyle(p.color, Math.max(0, p.life / p.maxLife));
      g.fillCircle(p.x, p.y, p.size * Math.max(0.4, p.life / p.maxLife));
    });
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
