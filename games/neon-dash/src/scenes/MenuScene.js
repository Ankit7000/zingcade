import { getDom, showOverlay } from "../dom.js?v=3";

const PhaserScene = globalThis.Phaser.Scene;

export class MenuScene extends PhaserScene {
  constructor() {
    super("MenuScene");
  }

  create() {
    this.dom = getDom();
    const start = () => {
      this.registry.get("audio").unlock();
      this.game.events.emit("nd:start-run");
      this.scene.stop();
    };
    this.actionHandler = start;
    this.dom.actionBtn.addEventListener("click", this.actionHandler);
    this.game.events.once("nd:start-run", () => this.scene.stop());
    this.events.once("shutdown", () => this.shutdown());
    showOverlay(this.dom, {
      kicker: "PERSPECTIVE RUNNER",
      title: "Neon Dash",
      text: "Three neon lanes. Read the warnings, squeeze through authored rushes, jump low barriers, slide under high beams, and outrun the city.",
      actionLabel: "Start Dash"
    });
  }

  shutdown() {
    if (this.dom && this.actionHandler) {
      this.dom.actionBtn.removeEventListener("click", this.actionHandler);
    }
  }
}
