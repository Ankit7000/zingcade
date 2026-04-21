import { getDom, showOverlay } from "../dom.js?v=1";
import { STAGES } from "../config.js?v=1";

const PhaserScene = globalThis.Phaser.Scene;

export class GameOverScene extends PhaserScene {
  constructor() {
    super("GameOverScene");
  }

  init(data) {
    this.run = data.run;
    this.result = data.result;
  }

  create() {
    this.dom = getDom();
    this.restartHandler = () => {
      this.registry.get("audio").unlock();
      this.game.events.emit("dsb:start-run");
      this.scene.stop();
    };
    this.dom.actionButton.addEventListener("click", this.restartHandler);
    this.game.events.once("dsb:start-run", () => this.scene.stop());
    this.events.once("shutdown", () => this.shutdown());

    const stage = STAGES[this.run.stageIndex] || STAGES[0];
    showOverlay(this.dom, {
      kicker: this.run.newBest ? "New Best Run" : "Run Broken",
      title: "Dont Stop Ball",
      text: this.run.newBest
        ? "You pushed past your old best. Restart while the movement rhythm is still fresh."
        : `Stage reached: ${stage.name}. Read the warning lane first, then make the shortest safe move.`,
      actionLabel: "Restart Game",
      summary: this.run,
      showGames: true,
      result: this.result
    });
  }

  shutdown() {
    if (this.dom && this.restartHandler) {
      this.dom.actionButton.removeEventListener("click", this.restartHandler);
    }
  }
}
