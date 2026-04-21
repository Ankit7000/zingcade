import { InputManager } from "../../../_shared/phaser/systems/InputManager.js?v=2";
import { SceneTransitions } from "../../../_shared/phaser/systems/SceneTransitions.js?v=2";
import { CFG, H, HAZARD_COLORS, POWER_COLORS, STAGES, W, clamp, random } from "../config.js?v=1";

const PhaserScene = globalThis.Phaser.Scene;
const PhaserMath = globalThis.Phaser.Math;

export class GameScene extends PhaserScene {
  constructor() {
    super("GameScene");
  }

  create() {
    this.g = this.add.graphics();
    this.stageText = this.add.text(W / 2, 174, "", {
      fontFamily: "Orbitron, sans-serif",
      fontSize: "34px",
      fontStyle: "900",
      color: "#8cf5da",
      stroke: "#040a12",
      strokeThickness: 5
    }).setOrigin(0.5).setDepth(10).setAlpha(0);
    this.score = this.registry.get("score");
    this.audio = this.registry.get("audio");
    this.inputState = { left: false, right: false, pointer: false, pointerX: W / 2 };

    this.inputManager = new InputManager(this, {
      left: () => this.handleInput("left"),
      right: () => this.handleInput("right"),
      primary: () => this.handlePrimary(),
      pause: () => this.togglePause()
    });

    this.keyDown = (event) => this.setKey(event.code, true);
    this.keyUp = (event) => this.setKey(event.code, false);
    this.input.keyboard.on("keydown", this.keyDown);
    this.input.keyboard.on("keyup", this.keyUp);
    this.input.on("pointerdown", this.pointerDown, this);
    this.input.on("pointermove", this.pointerMove, this);
    this.input.on("pointerup", this.pointerUp, this);
    this.input.on("pointercancel", this.pointerUp, this);

    this.game.events.on("dsb:start-run", this.startRun, this);
    this.game.events.on("dsb:primary", this.handlePrimary, this);
    this.game.events.on("dsb:toggle-pause", this.togglePause, this);
    this.game.events.on("dsb:pause", this.pauseRun, this);
    this.game.events.on("dsb:resume", this.resumeRun, this);
    this.game.events.on("dsb:input", this.handleInput, this);
    this.events.once("shutdown", () => this.shutdown());
    this.resetWorld("start");
  }

  resetWorld(mode = "playing") {
    this.state?.labels?.forEach((label) => label.obj?.destroy());
    this.state = {
      mode,
      time: 0,
      lives: CFG.startLives,
      streak: 0,
      bestStreak: 0,
      stageIndex: 0,
      stageFlashT: mode === "playing" ? 1.2 : 0,
      stageFlashText: STAGES[0].name,
      stageFlashColor: 0x8cf5da,
      spawnTimer: CFG.spawnLead,
      pickupTimer: CFG.pickupLead,
      damageFlashT: 0,
      shakeT: 0,
      newBest: false,
      previousBest: this.score.best,
      player: {
        x: W / 2,
        targetX: W / 2,
        y: CFG.playerY,
        radius: CFG.playerRadius,
        vx: 0,
        invulnT: 0,
        shield: 0,
        slowT: 0,
        ghostT: 0
      },
      obstacles: [],
      pickups: [],
      particles: [],
      labels: [],
      stars: Array.from({ length: 42 }, () => ({
        x: random(18, W - 18),
        y: random(0, H),
        size: random(1, 2.3),
        speed: random(12, 34),
        alpha: random(0.18, 0.52)
      })),
      ribbons: Array.from({ length: 5 }, (_, index) => ({
        y: 96 + index * 112,
        offset: random(0, Math.PI * 2),
        alpha: random(0.035, 0.1)
      }))
    };
    this.inputState.left = false;
    this.inputState.right = false;
    this.inputState.pointer = false;
    this.inputState.pointerX = W / 2;
    this.score.reset();
    this.registry.set("gameState", mode);
    this.emitHud();
  }

  startRun() {
    this.audio.play("start");
    this.resetWorld("playing");
    this.game.events.emit("dsb:hide-overlay");
    SceneTransitions.flash(this, 0x8cf5da, 150, 0.25);
  }

  handlePrimary() {
    if (this.state.mode === "start" || this.state.mode === "gameover") {
      this.game.events.emit("dsb:start-run");
      return;
    }
    if (this.state.mode === "paused") this.resumeRun();
  }

  pauseRun() {
    if (this.state.mode !== "playing") return;
    this.state.mode = "paused";
    this.registry.set("gameState", "paused");
    this.audio.play("pause");
    this.game.events.emit("dsb:show-pause");
  }

  resumeRun() {
    if (this.state.mode !== "paused") return;
    this.state.mode = "playing";
    this.registry.set("gameState", "playing");
    this.game.events.emit("dsb:hide-overlay");
  }

  togglePause() {
    if (this.state.mode === "playing") this.pauseRun();
    else if (this.state.mode === "paused") this.resumeRun();
  }

  handleInput(action) {
    if (action === "left") this.nudge(-1);
    if (action === "right") this.nudge(1);
    if (action === "leftStart") this.inputState.left = true;
    if (action === "leftEnd") this.inputState.left = false;
    if (action === "rightStart") this.inputState.right = true;
    if (action === "rightEnd") this.inputState.right = false;
  }

  setKey(code, pressed) {
    if (code === "ArrowLeft" || code === "KeyA") this.inputState.left = pressed;
    if (code === "ArrowRight" || code === "KeyD") this.inputState.right = pressed;
  }

  nudge(dir) {
    if (this.state.mode !== "playing") return;
    const player = this.state.player;
    player.targetX = clamp(player.targetX + dir * 46, CFG.wallPad, W - CFG.wallPad);
    this.inputState.pointer = false;
    this.audio.play("move");
    this.spawnBurst(player.x, player.y + 4, 0x8cf5da, 4, 24, 70);
  }

  pointerDown(pointer) {
    if (this.state.mode !== "playing") {
      this.handlePrimary();
      return;
    }
    this.audio.unlock();
    this.inputState.pointer = true;
    this.inputState.pointerX = pointer.x;
  }

  pointerMove(pointer) {
    if (this.state.mode !== "playing") return;
    if (pointer.isDown || pointer.pointerType === "mouse") {
      this.inputState.pointer = true;
      this.inputState.pointerX = pointer.x;
    }
  }

  pointerUp(pointer) {
    if (pointer.pointerType !== "mouse") this.inputState.pointer = false;
  }

  update(_, deltaMs) {
    const dt = Math.min(deltaMs / 1000, 0.05);
    if (this.state.mode === "playing") this.updateRun(dt);
    this.updateParticles(dt);
    this.draw();
  }

  updateRun(dt) {
    const s = this.state;
    const stage = this.getStage();
    s.time += dt;
    this.advanceStage();
    this.updatePlayer(dt);
    this.updateObstacles(dt);
    this.updatePickups(dt);

    const speed = this.currentSpeed();
    this.addScore((16 + speed * 0.045) * dt);
    this.maybeNewBest();

    s.spawnTimer -= dt;
    if (s.spawnTimer <= 0) {
      this.spawnObstacle();
      this.scheduleObstacle();
    }

    s.pickupTimer -= dt;
    if (s.pickupTimer <= 0) {
      this.spawnPickup();
      s.pickupTimer = PhaserMath.FloatBetween(6.8, 10.6);
    }

    s.damageFlashT = Math.max(0, s.damageFlashT - dt * 2.6);
    s.shakeT = Math.max(0, s.shakeT - dt);
    s.stageFlashT = Math.max(0, s.stageFlashT - dt);
    this.emitHud(stage);
  }

  updatePlayer(dt) {
    const player = this.state.player;
    const axis = (this.inputState.right ? 1 : 0) - (this.inputState.left ? 1 : 0);
    if (axis !== 0) {
      this.inputState.pointer = false;
      player.targetX += axis * CFG.moveSpeed * dt;
    }
    if (this.inputState.pointer) {
      player.targetX = PhaserMath.Linear(player.targetX, this.inputState.pointerX, Math.min(1, dt * CFG.pointerEase));
    }

    player.targetX = clamp(player.targetX, CFG.wallPad, W - CFG.wallPad);
    const pull = player.targetX - player.x;
    player.vx += pull * 38 * dt;
    player.vx *= Math.exp(-9.2 * dt);
    player.x = clamp(player.x + player.vx * dt * 60, CFG.wallPad - 2, W - CFG.wallPad + 2);

    player.invulnT = Math.max(0, player.invulnT - dt);
    player.slowT = Math.max(0, player.slowT - dt);
    player.ghostT = Math.max(0, player.ghostT - dt);
  }

  updateObstacles(dt) {
    const player = this.state.player;
    for (let index = this.state.obstacles.length - 1; index >= 0; index -= 1) {
      const obstacle = this.state.obstacles[index];
      obstacle.y += obstacle.speed * dt;
      obstacle.telegraphT = Math.max(0, obstacle.telegraphT - dt);
      if (obstacle.kind === "spinner") {
        obstacle.angle += obstacle.spin * dt;
      } else if (obstacle.kind !== "gate") {
        obstacle.x += obstacle.drift * dt;
        const maxX = W - obstacle.width - 12;
        if (obstacle.x <= 12 || obstacle.x >= maxX) obstacle.drift *= -1;
        obstacle.x = clamp(obstacle.x, 12, maxX);
      }

      if (!obstacle.scored && obstacle.y > player.y + player.radius + 16) {
        obstacle.scored = true;
        this.registerDodge(obstacle);
      }

      if (this.hitObstacle(obstacle, player)) this.hitPlayer(obstacle);
      if (obstacle.remove || obstacle.y > H + 120) this.state.obstacles.splice(index, 1);
    }
  }

  updatePickups(dt) {
    const player = this.state.player;
    for (let index = this.state.pickups.length - 1; index >= 0; index -= 1) {
      const pickup = this.state.pickups[index];
      pickup.y += pickup.speed * dt;
      pickup.wobble += dt * 3.1;
      pickup.x += Math.sin(pickup.wobble) * 18 * dt;
      if (distance(player.x, player.y, pickup.x, pickup.y) <= player.radius + pickup.size + 3) {
        this.collectPickup(pickup);
        this.state.pickups.splice(index, 1);
      } else if (pickup.y > H + 50) {
        this.state.pickups.splice(index, 1);
      }
    }
  }

  getStage() {
    return STAGES[this.state.stageIndex];
  }

  currentSpeed() {
    return this.getStage().speed * (this.state.player.slowT > 0 ? 0.72 : 1);
  }

  advanceStage() {
    let next = 0;
    for (let index = STAGES.length - 1; index >= 0; index -= 1) {
      if (this.state.time >= STAGES[index].start) {
        next = index;
        break;
      }
    }
    if (next === this.state.stageIndex) return;
    this.state.stageIndex = next;
    this.state.stageFlashT = 1.3;
    this.state.stageFlashText = STAGES[next].name;
    this.state.stageFlashColor = next >= 4 ? 0xff7d6c : 0x8cf5da;
    this.spawnBurst(W / 2, H * 0.32, this.state.stageFlashColor, 24, 35, 150);
    this.audio.play("power");
  }

  scheduleObstacle() {
    const stage = this.getStage();
    const slowFactor = this.state.player.slowT > 0 ? 1.2 : 1;
    this.state.spawnTimer = PhaserMath.FloatBetween(stage.spawnMin, stage.spawnMax) * slowFactor;
  }

  weightedKind() {
    const stage = this.state.stageIndex;
    const roll = Math.random();
    if (stage >= 2 && roll < 0.1) return "spinner";
    if (roll < 0.32) return "bar";
    if (roll < 0.54) return "gate";
    if (roll < 0.74) return "heavy";
    return "sweeper";
  }

  spawnObstacle() {
    const kind = this.weightedKind();
    const speed = this.currentSpeed();
    const telegraphT = 0.75;
    if (kind === "bar") {
      this.state.obstacles.push({
        kind,
        x: random(18, W - 110),
        y: -42,
        width: random(86, 112),
        height: 22,
        speed: speed + random(-8, 20),
        drift: random(-18, 18),
        telegraphT,
        scored: false
      });
      return;
    }
    if (kind === "heavy") {
      this.state.obstacles.push({
        kind,
        x: random(16, W - 138),
        y: -48,
        width: random(108, 128),
        height: 30,
        speed: speed + random(2, 28),
        drift: random(-14, 14),
        telegraphT,
        scored: false
      });
      return;
    }
    if (kind === "gate") {
      const gapWidth = random(124, 154 - this.state.stageIndex * 3);
      const gapX = random(42, W - gapWidth - 42);
      this.state.obstacles.push({
        kind,
        x: 0,
        y: -40,
        width: W,
        height: 26,
        gapX,
        gapWidth,
        speed: speed + random(-6, 20),
        telegraphT,
        scored: false
      });
      return;
    }
    if (kind === "sweeper") {
      const sweepWidth = random(150, 200);
      this.state.obstacles.push({
        kind,
        x: random(16, W - sweepWidth - 16),
        y: -38,
        width: sweepWidth,
        height: 18,
        speed: speed + random(8, 34),
        drift: random(-48, 48),
        telegraphT,
        scored: false
      });
      return;
    }
    this.state.obstacles.push({
      kind: "spinner",
      x: random(102, W - 102),
      y: -78,
      armLength: random(52, 68),
      armWidth: random(13, 16),
      speed: speed + random(8, 30),
      spin: random(1.6, 3.2) * (Math.random() < 0.5 ? -1 : 1),
      angle: random(0, Math.PI * 2),
      telegraphT: 0.95,
      scored: false
    });
  }

  spawnPickup() {
    const types = ["shield", "slow", "ghost"];
    const type = types[PhaserMath.Between(0, types.length - 1)];
    this.state.pickups.push({
      type,
      x: random(54, W - 54),
      y: -42,
      size: 14,
      speed: this.currentSpeed() * 0.82,
      wobble: random(0, Math.PI * 2)
    });
  }

  collectPickup(pickup) {
    const player = this.state.player;
    if (pickup.type === "shield") player.shield = Math.min(player.shield + 1, 2);
    if (pickup.type === "slow") player.slowT = CFG.slowDuration;
    if (pickup.type === "ghost") {
      player.ghostT = CFG.ghostDuration;
      player.invulnT = Math.max(player.invulnT, 0.35);
    }
    this.spawnLabel(pickup.x, pickup.y - 14, pickupName(pickup.type), POWER_COLORS[pickup.type]);
    this.spawnBurst(pickup.x, pickup.y, POWER_COLORS[pickup.type], 18, 28, 130);
    this.audio.play("power");
  }

  registerDodge(obstacle) {
    const s = this.state;
    s.streak += 1;
    s.bestStreak = Math.max(s.bestStreak, s.streak);
    const bonus = 14 + s.streak * 2 + s.stageIndex * 5;
    this.addScore(bonus);
    this.spawnLabel(
      clamp(s.player.x + random(-30, 30), 42, W - 42),
      s.player.y - 36,
      `+${bonus} ${dodgeLabel(obstacle.kind)}`,
      s.streak >= 8 ? 0xffc672 : 0x8cf5da
    );
    this.game.events.emit(s.streak % 5 === 0 ? "dsb:streak-pulse" : "dsb:score-pulse");
    this.audio.play("coin");
  }

  hitPlayer(obstacle) {
    const s = this.state;
    const player = s.player;
    if (player.invulnT > 0 || player.ghostT > 0 || obstacle.hit) return;
    obstacle.hit = true;
    obstacle.remove = true;
    s.damageFlashT = 0.95;
    s.shakeT = 0.28;
    this.spawnBurst(player.x, player.y, 0xff7d6c, 22, 28, 165);

    if (player.shield > 0) {
      player.shield -= 1;
      player.invulnT = CFG.shieldInvuln;
      this.spawnLabel(player.x, player.y - 30, "Shield Save", POWER_COLORS.shield);
      this.audio.play("power");
      SceneTransitions.shake(this, 120, 0.009);
      return;
    }

    s.lives -= 1;
    s.streak = 0;
    player.invulnT = CFG.invulnAfterHit;
    this.spawnLabel(player.x, player.y - 30, "-1 Life", 0xff7d6c);
    this.game.events.emit("dsb:life-pulse");
    this.audio.play("crash");
    SceneTransitions.shake(this, 180, 0.014);
    if (s.lives <= 0) this.endRun();
  }

  endRun() {
    if (this.state.mode === "gameover") return;
    this.state.mode = "gameover";
    this.registry.set("gameState", "gameover");
    const runScore = this.score.score;
    const oldBest = this.state.previousBest;
    const finished = this.score.finish();
    const run = {
      score: finished.score,
      best: finished.best,
      bestStreak: this.state.bestStreak,
      stageIndex: this.state.stageIndex,
      newBest: runScore > oldBest
    };
    const result = window.Zingcade ? window.Zingcade.postRun("dont-stop-ball", {
      score: run.score,
      bestStreak: run.bestStreak,
      stage: this.getStage().name
    }) : null;
    SceneTransitions.flash(this, 0xff3030, 220, 0.48);
    this.scene.launch("GameOverScene", { run, result });
    this.emitHud();
  }

  addScore(amount) {
    this.score.distance += amount * CFG.scoreDivisor;
    const next = Math.floor(this.score.distance / CFG.scoreDivisor);
    if (next !== this.score.score) {
      this.score.score = next;
      if (this.score.score > this.score.best) this.score.best = this.registry.get("storage").setBest("best-score", this.score.score);
    }
  }

  maybeNewBest() {
    if (this.state.newBest || this.score.score <= this.state.previousBest) return;
    this.state.newBest = true;
    this.state.stageFlashT = 1.1;
    this.state.stageFlashText = "New Best!";
    this.state.stageFlashColor = 0xffc672;
    this.spawnBurst(W / 2, H * 0.28, 0xffc672, 24, 35, 160);
    this.game.events.emit("dsb:best-pulse");
    this.audio.play("power");
  }

  hitObstacle(obstacle, player) {
    if (obstacle.kind === "spinner") {
      for (let arm = 0; arm < 4; arm += 1) {
        const angle = obstacle.angle + arm * (Math.PI / 2);
        const x2 = obstacle.x + Math.cos(angle) * obstacle.armLength;
        const y2 = obstacle.y + Math.sin(angle) * obstacle.armLength;
        if (pointToSegmentDistance(player.x, player.y, obstacle.x, obstacle.y, x2, y2) <= player.radius + obstacle.armWidth * 0.5) {
          return true;
        }
      }
      return false;
    }
    if (obstacle.kind === "gate") {
      const top = obstacle.y;
      const bottom = obstacle.y + obstacle.height;
      if (player.y + player.radius < top || player.y - player.radius > bottom) return false;
      return player.x - player.radius < obstacle.gapX || player.x + player.radius > obstacle.gapX + obstacle.gapWidth;
    }
    return circleHitsRect(player, obstacle);
  }

  spawnBurst(x, y, color, count, speedMin, speedMax) {
    for (let i = 0; i < count; i++) {
      const angle = PhaserMath.FloatBetween(0, Math.PI * 2);
      const speed = PhaserMath.FloatBetween(speedMin, speedMax);
      this.state.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: PhaserMath.FloatBetween(2, 5.5),
        life: PhaserMath.FloatBetween(0.32, 0.8),
        maxLife: 0.8,
        color
      });
    }
  }

  spawnLabel(x, y, text, color) {
    const label = this.add.text(x, y, text, {
      fontFamily: "Orbitron, sans-serif",
      fontSize: "15px",
      fontStyle: "700",
      color: `#${color.toString(16).padStart(6, "0")}`,
      stroke: "#040a12",
      strokeThickness: 4
    }).setOrigin(0.5).setDepth(9);
    this.state.labels.push({ obj: label, x, y, life: 1, maxLife: 1 });
  }

  updateParticles(dt) {
    const s = this.state;
    for (const p of s.particles) {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vx *= 0.985;
      p.vy *= 0.985;
      p.life -= dt;
    }
    for (const label of s.labels) {
      label.y -= 28 * dt;
      label.life -= dt;
      label.obj.setPosition(label.x, label.y);
      label.obj.setAlpha(clamp(label.life / label.maxLife, 0, 1));
    }
    if (s.mode === "playing") {
      const player = s.player;
      const color = player.ghostT > 0 ? POWER_COLORS.ghost : 0x8cf5da;
      s.particles.push({
        x: player.x + random(-5, 5),
        y: player.y + random(-4, 4),
        vx: random(-16, 16),
        vy: random(18, 62),
        size: random(1.6, 4.4),
        life: random(0.18, 0.38),
        maxLife: 0.38,
        color
      });
    }
    if (s.particles.length > 140) s.particles.splice(0, s.particles.length - 140);
    s.particles = s.particles.filter((p) => p.life > 0);
    s.labels = s.labels.filter((label) => {
      if (label.life > 0) return true;
      label.obj.destroy();
      return false;
    });
  }

  emitHud(stage = this.getStage()) {
    const p = this.state.player;
    const active = [];
    if (p.shield > 0) active.push(`Shield x${p.shield}`);
    if (p.slowT > 0) active.push(`Slow-Mo ${p.slowT.toFixed(1)}s`);
    if (p.ghostT > 0) active.push(`Ghost ${p.ghostT.toFixed(1)}s`);
    this.game.events.emit("dsb:hud", {
      score: this.score.score,
      best: this.score.best,
      lives: this.state.lives,
      streak: this.state.streak,
      speed: this.currentSpeed() / STAGES[0].speed,
      stage: stage.name,
      note: stage.note,
      challenge: this.state.streak >= 5
        ? "Streak online. Keep the ball settled and cash the clean-dodge bonus."
        : "Hold a 5-dodge streak to cash in cleaner score bursts.",
      power: active.length ? active.join(" | ") : "No active power-up. Catch pickups for Shield, Slow-Mo, or Ghost.",
      canvasNote: p.ghostT > 0
        ? "Ghost is active. Cut through one bad read and reset to center."
        : p.slowT > 0
          ? "Slow-Mo is active. Use the extra time to exit the next lane cleanly."
          : p.shield > 0
            ? "Shield is loaded. It blocks one mistake, but clean movement still scores better."
            : "Shield blocks one mistake, Slow-Mo opens a short recovery window, and Ghost lets you cut through a bad read.",
      damageFlash: this.state.damageFlashT * 0.6
    });
  }

  draw() {
    const g = this.g;
    const s = this.state;
    const stage = this.getStage();
    g.clear();
    const cam = this.cameras.main;
    if (s.shakeT > 0) {
      cam.setScroll(PhaserMath.FloatBetween(-5, 5) * s.shakeT, PhaserMath.FloatBetween(-5, 5) * s.shakeT);
    } else {
      cam.setScroll(0, 0);
    }
    this.drawBackground(g, stage);
    this.drawPickups(g);
    this.drawWarnings(g);
    this.drawObstacles(g);
    this.drawParticles(g);
    this.drawPlayer(g);
    this.drawStageFlash(g);
  }

  drawBackground(g, stage) {
    g.fillGradientStyle(stage.colors[0], stage.colors[0], stage.colors[1], stage.colors[1], 1);
    g.fillRect(0, 0, W, H);
    for (const star of this.state.stars) {
      const y = (star.y + this.state.time * star.speed) % H;
      g.fillStyle(0xd9f7ff, star.alpha);
      g.fillRect(star.x, y, star.size, star.size);
    }
    for (let row = 0; row < 9; row += 1) {
      const y = ((row * 92 + this.state.time * this.currentSpeed() * 0.25) % H) - 24;
      g.lineStyle(1, 0x8cf5da, 0.08);
      g.lineBetween(22, y, W - 22, y);
    }
    for (const ribbon of this.state.ribbons) {
      g.lineStyle(2, this.state.stageIndex >= 4 ? 0xff7d6c : 0x8cf5da, ribbon.alpha);
      g.beginPath();
      for (let x = 0; x <= W; x += 14) {
        const y = ribbon.y + Math.sin(ribbon.offset + x * 0.022 + this.state.time * 0.8) * 14;
        if (x === 0) g.moveTo(x, y);
        else g.lineTo(x, y);
      }
      g.strokePath();
    }
    g.lineStyle(2, 0xffffff, 0.05);
    g.strokeRect(12, 12, W - 24, H - 24);
  }

  drawWarnings(g) {
    for (const obstacle of this.state.obstacles) {
      const lead = clamp(1 - Math.max(0, obstacle.y + 46) / 165, 0, 0.82);
      if (lead <= 0.02) continue;
      const color = HAZARD_COLORS[obstacle.kind] || 0xff7d6c;
      g.fillStyle(color, lead);
      g.lineStyle(2, color, lead * 0.75);
      if (obstacle.kind === "gate") {
        g.fillRect(16, 22, Math.max(0, obstacle.gapX - 22), 5);
        g.fillRect(obstacle.gapX + obstacle.gapWidth + 6, 22, W - obstacle.gapX - obstacle.gapWidth - 22, 5);
        g.strokeRect(obstacle.gapX, 18, obstacle.gapWidth, 14);
      } else if (obstacle.kind === "spinner") {
        g.fillTriangle(obstacle.x, 18, obstacle.x - 18, 38, obstacle.x + 18, 38);
        g.strokeCircle(obstacle.x, 30, obstacle.armLength * 0.45);
      } else {
        g.fillRect(obstacle.x, 20, obstacle.width, 6);
      }
    }
  }

  drawObstacles(g) {
    for (const obstacle of this.state.obstacles) {
      const color = HAZARD_COLORS[obstacle.kind] || 0xff7d6c;
      if (obstacle.kind === "spinner") {
        g.lineStyle(obstacle.armWidth, color, 0.96);
        for (let arm = 0; arm < 4; arm += 1) {
          const angle = obstacle.angle + arm * (Math.PI / 2);
          g.lineBetween(
            obstacle.x,
            obstacle.y,
            obstacle.x + Math.cos(angle) * obstacle.armLength,
            obstacle.y + Math.sin(angle) * obstacle.armLength
          );
        }
        g.fillStyle(0xfff0dd, 1);
        g.fillCircle(obstacle.x, obstacle.y, 8);
        continue;
      }
      g.fillStyle(color, 0.96);
      if (obstacle.kind === "gate") {
        g.fillRect(0, obstacle.y, obstacle.gapX, obstacle.height);
        g.fillRect(obstacle.gapX + obstacle.gapWidth, obstacle.y, W - obstacle.gapX - obstacle.gapWidth, obstacle.height);
        g.lineStyle(2, 0x8cf5da, 0.45);
        g.strokeRect(obstacle.gapX, obstacle.y - 2, obstacle.gapWidth, obstacle.height + 4);
        continue;
      }
      g.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
      g.lineStyle(2, 0xffffff, 0.2);
      g.strokeRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
      if (obstacle.kind === "sweeper") {
        g.lineStyle(1.5, 0xfff0dd, 0.3);
        for (let stripe = 10; stripe < obstacle.width; stripe += 18) {
          g.lineBetween(obstacle.x + stripe, obstacle.y + 3, obstacle.x + stripe - 10, obstacle.y + obstacle.height - 3);
        }
      }
    }
  }

  drawPickups(g) {
    for (const pickup of this.state.pickups) {
      const color = POWER_COLORS[pickup.type];
      const pulse = 1 + Math.sin(this.state.time * 6 + pickup.wobble) * 0.12;
      g.fillStyle(color, 0.95);
      g.beginPath();
      g.moveTo(pickup.x, pickup.y - pickup.size * pulse);
      g.lineTo(pickup.x + pickup.size * pulse, pickup.y);
      g.lineTo(pickup.x, pickup.y + pickup.size * pulse);
      g.lineTo(pickup.x - pickup.size * pulse, pickup.y);
      g.closePath();
      g.fillPath();
      g.lineStyle(2, color, 0.35);
      g.strokeCircle(pickup.x, pickup.y, pickup.size * 1.45);
    }
  }

  drawPlayer(g) {
    if (this.state.mode === "start") return;
    const p = this.state.player;
    if (p.invulnT > 0 && Math.floor(p.invulnT * 18) % 2 === 0) return;
    const color = p.ghostT > 0 ? POWER_COLORS.ghost : 0x8cf5da;
    if (p.ghostT > 0) {
      g.fillStyle(POWER_COLORS.ghost, 0.28);
      g.fillCircle(p.x - p.vx * 0.035, p.y, p.radius + 8);
    }
    g.fillStyle(color, 1);
    g.fillCircle(p.x, p.y, p.radius);
    g.fillStyle(0xffffff, 0.82);
    g.fillCircle(p.x - 5, p.y - 7, 5);
    g.lineStyle(2, 0xffffff, 0.36);
    g.strokeCircle(p.x, p.y, p.radius - 2);
    if (p.shield > 0) {
      g.lineStyle(4, POWER_COLORS.shield, 0.78);
      g.strokeCircle(p.x, p.y, p.radius + 8);
    }
  }

  drawParticles(g) {
    for (const p of this.state.particles) {
      g.fillStyle(p.color, clamp(p.life / p.maxLife, 0, 1));
      g.fillCircle(p.x, p.y, p.size * Math.max(0.35, p.life / p.maxLife));
    }
  }

  drawStageFlash() {
    if (this.state.stageFlashT <= 0) {
      this.stageText.setAlpha(0);
      return;
    }
    this.stageText
      .setText(this.state.stageFlashText)
      .setColor(`#${this.state.stageFlashColor.toString(16).padStart(6, "0")}`)
      .setAlpha(Math.min(1, this.state.stageFlashT) * 0.95);
  }

  shutdown() {
    this.inputManager?.destroy();
    this.input.keyboard.off("keydown", this.keyDown);
    this.input.keyboard.off("keyup", this.keyUp);
    this.input.off("pointerdown", this.pointerDown, this);
    this.input.off("pointermove", this.pointerMove, this);
    this.input.off("pointerup", this.pointerUp, this);
    this.input.off("pointercancel", this.pointerUp, this);
    this.game.events.off("dsb:start-run", this.startRun, this);
    this.game.events.off("dsb:primary", this.handlePrimary, this);
    this.game.events.off("dsb:toggle-pause", this.togglePause, this);
    this.game.events.off("dsb:pause", this.pauseRun, this);
    this.game.events.off("dsb:resume", this.resumeRun, this);
    this.game.events.off("dsb:input", this.handleInput, this);
  }
}

function circleHitsRect(circle, rect) {
  const x = clamp(circle.x, rect.x, rect.x + rect.width);
  const y = clamp(circle.y, rect.y, rect.y + rect.height);
  return distance(circle.x, circle.y, x, y) < circle.radius;
}

function pointToSegmentDistance(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lengthSquared = dx * dx + dy * dy || 1;
  const t = clamp(((px - x1) * dx + (py - y1) * dy) / lengthSquared, 0, 1);
  return distance(px, py, x1 + dx * t, y1 + dy * t);
}

function distance(x1, y1, x2, y2) {
  return Math.hypot(x1 - x2, y1 - y2);
}

function pickupName(type) {
  if (type === "shield") return "Shield";
  if (type === "slow") return "Slow-Mo";
  return "Ghost";
}

function dodgeLabel(kind) {
  if (kind === "spinner") return "Spin!";
  if (kind === "gate") return "Split";
  if (kind === "sweeper") return "Sweep";
  return "Clean";
}
