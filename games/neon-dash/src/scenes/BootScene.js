import { StorageService } from "../../../_shared/phaser/systems/StorageService.js?v=2";
import { AudioController } from "../../../_shared/phaser/systems/AudioController.js?v=2";
import { ScoreController } from "../../../_shared/phaser/systems/ScoreController.js?v=2";

const PhaserScene = globalThis.Phaser.Scene;

export class BootScene extends PhaserScene {
  constructor() {
    super("BootScene");
  }

  create() {
    const storage = new StorageService("neon-dash");
    this.migrateLegacyStorage(storage);
    const audio = new AudioController(storage);
    const score = new ScoreController(storage, "best-score");
    this.registry.set("storage", storage);
    this.registry.set("audio", audio);
    this.registry.set("score", score);
    this.registry.set("gameState", "start");
    this.scene.start("GameScene");
    this.scene.launch("UIScene");
    this.scene.launch("MenuScene");
  }

  migrateLegacyStorage(storage) {
    try {
      const legacyBest = Number(localStorage.getItem("nd_best") || 0);
      const legacyCoins = Number(localStorage.getItem("nd_bestcoins") || 0);
      if (legacyBest > storage.getNumber("best-score", 0)) storage.setNumber("best-score", legacyBest);
      if (legacyCoins > storage.getNumber("best-coins", 0)) storage.setNumber("best-coins", legacyCoins);
    } catch (error) {
      return;
    }
  }
}
