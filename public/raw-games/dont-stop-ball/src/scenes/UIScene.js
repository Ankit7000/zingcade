import { MobileControls } from "../../../_shared/phaser/systems/MobileControls.js?v=2";
import { PauseController } from "../../../_shared/phaser/systems/PauseController.js?v=2";
import { getDom, hideOverlay, pulseElement, showOverlay, updateLives } from "../dom.js?v=1";

const PhaserScene = globalThis.Phaser.Scene;

export class UIScene extends PhaserScene {
  constructor() {
    super("UIScene");
  }

  create() {
    this.dom = getDom();
    this.dom.best.textContent = this.registry.get("score").best;
    this.dom.pauseButton.textContent = "Pause";
    updateLives(this.dom, 3);

    this.mobile = new MobileControls({
      "touch-left": () => this.game.events.emit("dsb:input", "left"),
      "touch-right": () => this.game.events.emit("dsb:input", "right")
    });
    this.bindHoldButton("touch-left", "left");
    this.bindHoldButton("touch-right", "right");

    this.pauseHandler = () => this.game.events.emit("dsb:toggle-pause");
    this.actionHandler = () => {
      if (this.registry.get("gameState") === "paused") {
        this.game.events.emit("dsb:resume");
      }
    };
    this.primaryHandler = (event) => {
      if (event.target === this.dom.actionButton) return;
      this.game.events.emit("dsb:primary");
    };
    this.dom.pauseButton.addEventListener("click", this.pauseHandler);
    this.dom.actionButton.addEventListener("click", this.actionHandler);
    this.dom.overlay.addEventListener("click", this.primaryHandler);

    this.pauseController = new PauseController({
      pause: () => this.game.events.emit("dsb:pause"),
      canPause: () => this.registry.get("gameState") === "playing"
    });

    this.game.events.on("dsb:hud", this.updateHud, this);
    this.game.events.on("dsb:score-pulse", () => pulseElement(this.dom.score));
    this.game.events.on("dsb:best-pulse", () => pulseElement(this.dom.best));
    this.game.events.on("dsb:life-pulse", () => pulseElement(this.dom.lives));
    this.game.events.on("dsb:streak-pulse", () => pulseElement(this.dom.streak));
    this.game.events.on("dsb:show-pause", this.showPause, this);
    this.game.events.on("dsb:hide-overlay", this.hideOverlay, this);
    this.events.once("shutdown", () => this.shutdown());
  }

  bindHoldButton(id, side) {
    const button = document.getElementById(id);
    if (!button) return;
    const start = (event) => {
      event.preventDefault();
      this.game.events.emit("dsb:input", `${side}Start`);
    };
    const end = (event) => {
      event.preventDefault();
      this.game.events.emit("dsb:input", `${side}End`);
    };
    button.addEventListener("pointerdown", start, { passive: false });
    button.addEventListener("pointerup", end, { passive: false });
    button.addEventListener("pointercancel", end, { passive: false });
    button.addEventListener("pointerleave", end, { passive: false });
    this.holdCleanups = this.holdCleanups || [];
    this.holdCleanups.push(() => {
      button.removeEventListener("pointerdown", start);
      button.removeEventListener("pointerup", end);
      button.removeEventListener("pointercancel", end);
      button.removeEventListener("pointerleave", end);
    });
  }

  updateHud(data) {
    this.dom.score.textContent = data.score;
    this.dom.best.textContent = data.best;
    this.dom.streak.textContent = data.streak;
    this.dom.speed.textContent = `${data.speed.toFixed(1)}x`;
    this.dom.stage.textContent = data.stage;
    this.dom.challenge.textContent = data.challenge;
    this.dom.power.textContent = data.power;
    this.dom.note.textContent = data.note;
    this.dom.canvasNote.textContent = data.canvasNote;
    this.dom.damageFlash.style.opacity = String(data.damageFlash);
    updateLives(this.dom, data.lives);
  }

  showPause() {
    this.dom.pauseButton.textContent = "Resume";
    showOverlay(this.dom, {
      kicker: "Paused",
      title: "Catch Your Breath",
      text: "Resume when you are ready. Stage timers and power-up timers are frozen.",
      actionLabel: "Resume Run",
      showGames: true
    });
  }

  hideOverlay() {
    this.dom.pauseButton.textContent = "Pause";
    hideOverlay(this.dom);
  }

  shutdown() {
    this.mobile?.destroy();
    this.pauseController?.destroy();
    this.holdCleanups?.forEach((cleanup) => cleanup());
    this.dom.pauseButton.removeEventListener("click", this.pauseHandler);
    this.dom.actionButton.removeEventListener("click", this.actionHandler);
    this.dom.overlay.removeEventListener("click", this.primaryHandler);
    this.game.events.off("dsb:hud", this.updateHud, this);
    this.game.events.off("dsb:show-pause", this.showPause, this);
    this.game.events.off("dsb:hide-overlay", this.hideOverlay, this);
  }
}
