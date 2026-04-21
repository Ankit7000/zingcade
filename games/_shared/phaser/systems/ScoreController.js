export class ScoreController {
  constructor(storage, bestKey) {
    this.storage = storage;
    this.bestKey = bestKey;
    this.reset();
    this.best = storage.getNumber(bestKey, 0);
  }

  reset() {
    this.score = 0;
    this.distance = 0;
    this.coins = 0;
  }

  updateDistance(delta, divisor = 9) {
    this.distance += delta;
    this.score = Math.floor(this.distance / divisor);
    if (this.score > this.best) {
      this.best = this.storage.setBest(this.bestKey, this.score);
    }
  }

  addCoins(amount = 1) {
    this.coins += amount;
  }

  finish() {
    this.best = this.storage.setBest(this.bestKey, this.score);
    return {
      score: this.score,
      best: this.best,
      coins: this.coins
    };
  }
}
