import { getDom, showOverlay } from "../dom.js";
import { STAGES } from "../config.js";

const PhaserScene = globalThis.Phaser.Scene;

export class GameOverScene extends PhaserScene {
  constructor() {
    super("GameOverScene");
  }

  init(data) {
    this.result = data.result;
    this.run = data.run;
  }

  create() {
    this.dom = getDom();
    const isNewBest = this.run.score >= this.run.best && this.run.score > 0;
    const restart = () => {
      this.registry.get("audio").unlock();
      this.game.events.emit("nd:start-run");
      this.scene.stop();
    };
    const continueRun = () => {
      this.game.events.emit("nd:continue-run");
      this.scene.stop();
    };
    this.restartHandler = restart;
    this.continueHandler = continueRun;
    this.dom.actionBtn.addEventListener("click", this.restartHandler);
    this.dom.continueBtn.addEventListener("click", this.continueHandler);
    this.game.events.once("nd:start-run", () => this.scene.stop());
    this.events.once("shutdown", () => this.shutdown());
    showOverlay(this.dom, {
      kicker: "RUN ENDED",
      title: "Game Over",
      text: "The city won this round. Hit restart to try again.",
      actionLabel: "Try Again",
      summary: this.run,
      note: isNewBest
        ? "New best score. The city bows to you."
        : `Stage reached: ${STAGES[this.run.stageIndex].label}. Keep one escape lane ready before every jump or slide.`,
      showContinue: !this.run.continueUsed,
      showGames: true,
      result: this.result
    });
  }

  shutdown() {
    if (!this.dom) return;
    this.dom.actionBtn.removeEventListener("click", this.restartHandler);
    this.dom.continueBtn.removeEventListener("click", this.continueHandler);
  }
}
