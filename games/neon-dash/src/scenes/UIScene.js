import { MobileControls } from "../../../_shared/phaser/systems/MobileControls.js?v=2";
import { PauseController } from "../../../_shared/phaser/systems/PauseController.js?v=2";
import { getDom, hideOverlay, pulse, updatePowerHud } from "../dom.js?v=2";

const PhaserScene = globalThis.Phaser.Scene;

export class UIScene extends PhaserScene {
  constructor() {
    super("UIScene");
  }

  create() {
    this.dom = getDom();
    const score = this.registry.get("score");
    this.dom.best.textContent = score.best;
    this.dom.pauseBtn.textContent = "Pause";

    this.mobile = new MobileControls({
      mobLeft: () => this.game.events.emit("nd:input", "left"),
      mobRight: () => this.game.events.emit("nd:input", "right"),
      mobUp: () => this.game.events.emit("nd:input", "jump"),
      mobDown: () => this.game.events.emit("nd:input", "slide")
    });

    this.pauseHandler = () => this.game.events.emit("nd:toggle-pause");
    this.dom.pauseBtn.addEventListener("click", this.pauseHandler);
    this.pauseController = new PauseController({
      pause: () => this.game.events.emit("nd:pause"),
      canPause: () => this.registry.get("gameState") === "playing"
    });

    this.game.events.on("nd:hud", this.updateHud, this);
    this.game.events.on("nd:coin", () => pulse(this.dom.coins));
    this.game.events.on("nd:power", () => pulse(this.dom.powerName));
    this.game.events.on("nd:show-pause", this.showPause, this);
    this.game.events.on("nd:hide-overlay", this.hideOverlay, this);
    this.events.once("shutdown", () => this.shutdown());
  }

  updateHud(data) {
    this.dom.score.textContent = data.score;
    this.dom.best.textContent = data.best;
    this.dom.coins.textContent = data.coins;
    this.dom.stage.textContent = data.stage;
    this.dom.speed.textContent = Math.round(data.speed);
    this.dom.tip.textContent = data.tip;
    updatePowerHud(this.dom, data);
  }

  showPause() {
    this.dom.pauseBtn.textContent = "Resume";
    this.dom.overlayKicker.textContent = "PAUSED";
    this.dom.overlayTitle.textContent = "Game Paused";
    this.dom.overlayText.textContent = "Press P or Resume to continue your dash.";
    this.dom.actionBtn.hidden = true;
    this.dom.continueBtn.hidden = false;
    this.dom.continueBtn.textContent = "Resume";
    this.dom.gamesLink.hidden = false;
    this.dom.overlaySummary.hidden = true;
    this.dom.overlayNote.hidden = true;
    this.dom.overlay.hidden = false;
    if (this.resumeHandler) {
      this.dom.continueBtn.removeEventListener("click", this.resumeHandler);
    }
    this.resumeHandler = () => this.game.events.emit("nd:resume");
    this.dom.continueBtn.addEventListener("click", this.resumeHandler, { once: true });
  }

  hideOverlay() {
    if (this.resumeHandler) {
      this.dom.continueBtn.removeEventListener("click", this.resumeHandler);
      this.resumeHandler = null;
    }
    hideOverlay(this.dom);
  }

  shutdown() {
    this.mobile?.destroy();
    this.pauseController?.destroy();
    this.dom.pauseBtn.removeEventListener("click", this.pauseHandler);
    if (this.resumeHandler) {
      this.dom.continueBtn.removeEventListener("click", this.resumeHandler);
    }
    this.game.events.off("nd:hud", this.updateHud, this);
    this.game.events.off("nd:hide-overlay", this.hideOverlay, this);
  }
}
