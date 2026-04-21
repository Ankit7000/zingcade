import { StorageService } from "../../../_shared/phaser/systems/StorageService.js?v=2";
import { AudioController } from "../../../_shared/phaser/systems/AudioController.js?v=2";
import { ScoreController } from "../../../_shared/phaser/systems/ScoreController.js?v=2";

const PhaserScene = globalThis.Phaser.Scene;

export class BootScene extends PhaserScene {
  constructor() {
    super("BootScene");
  }

  create() {
    const storage = new StorageService("dont-stop-ball");

    try {
      const legacyBest = Number(localStorage.getItem("zingcade-dont-stop-ball-best") || 0);
      if (legacyBest > storage.getNumber("best-score", 0)) {
        storage.setNumber("best-score", legacyBest);
      }
    } catch (error) {
      // Legacy migration is best-effort only.
    }

    this.registry.set("storage", storage);
    this.registry.set("audio", new AudioController(storage, "audio-muted"));
    this.registry.set("score", new ScoreController(storage, "best-score"));
    this.registry.set("gameState", "start");
    this.scene.start("GameScene");
    this.scene.launch("UIScene");
    this.scene.launch("MenuScene");
  }
}
