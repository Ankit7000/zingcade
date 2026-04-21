export class MobileControls {
  constructor(bindings) {
    this.cleanups = [];
    Object.entries(bindings).forEach(([id, handler]) => this.bind(id, handler));
  }

  bind(id, handler) {
    const button = document.getElementById(id);
    if (!button) return;
    const listener = (event) => {
      event.preventDefault();
      handler();
    };
    button.addEventListener("pointerdown", listener, { passive: false });
    this.cleanups.push(() => button.removeEventListener("pointerdown", listener));
  }

  destroy() {
    this.cleanups.forEach((cleanup) => cleanup());
    this.cleanups = [];
  }
}
