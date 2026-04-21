export class StorageService {
  constructor(prefix = "zingcade") {
    this.prefix = prefix;
  }

  key(name) {
    return `${this.prefix}:${name}`;
  }

  getNumber(name, fallback = 0) {
    try {
      const value = Number(localStorage.getItem(this.key(name)));
      return Number.isFinite(value) ? value : fallback;
    } catch (error) {
      return fallback;
    }
  }

  setNumber(name, value) {
    try {
      localStorage.setItem(this.key(name), String(Math.floor(value)));
    } catch (error) {
      return;
    }
  }

  setBest(name, value) {
    const best = Math.max(this.getNumber(name, 0), Math.floor(value));
    this.setNumber(name, best);
    return best;
  }
}
