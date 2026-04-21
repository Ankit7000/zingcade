import { getDom, showOverlay } from "../dom.js?v=1";

const PhaserScene = globalThis.Phaser.Scene;

export class MenuScene extends PhaserScene {
  constructor() {
    super("MenuScene");
  }

  create() {
    this.dom = getDom();
    this.startHandler = () => {
      this.registry.get("audio").unlock();
      this.game.events.emit("dsb:start-run");
      this.scene.stop();
    };
    this.dom.actionButton.addEventListener("click", this.startHandler);
    this.game.events.once("dsb:start-run", () => this.scene.stop());
    this.events.once("shutdown", () => this.shutdown());
    showOverlay(this.dom, {
      kicker: "Arcade Survival",
      title: "Dont Stop Ball",
      text: "Three lives. Read the warning lanes, dodge cleanly, and carry your streak into the late stages.",
      actionLabel: "Start Game"
    });
  }

  shutdown() {
    if (this.dom && this.startHandler) {
      this.dom.actionButton.removeEventListener("click", this.startHandler);
    }
  }
}
