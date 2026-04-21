export class InputManager {
  constructor(scene, handlers = {}) {
    this.scene = scene;
    this.handlers = handlers;
    this.swipeStart = null;
    this.cursors = scene.input.keyboard.createCursorKeys();
    this.keys = scene.input.keyboard.addKeys("W,A,S,D,SPACE,ENTER,P");
    this.bindKeyboard();
    this.bindSwipe();
  }

  bindKeyboard() {
    this.scene.input.keyboard.on("keydown", (event) => {
      const key = event.key;
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "a", "d", "w", "s", " ", "Enter", "p", "P"].includes(key)) {
        event.preventDefault();
      }
      if (key === "ArrowLeft" || key === "a" || key === "A") this.handlers.left?.();
      if (key === "ArrowRight" || key === "d" || key === "D") this.handlers.right?.();
      if (key === "ArrowUp" || key === "w" || key === "W") this.handlers.up?.();
      if (key === "ArrowDown" || key === "s" || key === "S") this.handlers.down?.();
      if (key === " " || key === "Enter") this.handlers.primary?.();
      if (key === "p" || key === "P") this.handlers.pause?.();
    });
  }

  bindSwipe() {
    this.scene.input.on("pointerdown", (pointer) => {
      this.swipeStart = { x: pointer.x, y: pointer.y, time: Date.now() };
    });

    this.scene.input.on("pointerup", (pointer) => {
      if (!this.swipeStart) return;
      const dx = pointer.x - this.swipeStart.x;
      const dy = pointer.y - this.swipeStart.y;
      const elapsed = Date.now() - this.swipeStart.time;
      this.swipeStart = null;
      const minSwipe = 18;
      if (Math.abs(dx) > Math.abs(dy) * 1.1 && Math.abs(dx) > minSwipe) {
        (dx > 0 ? this.handlers.right : this.handlers.left)?.();
        return;
      }
      if (Math.abs(dy) > Math.abs(dx) * 1.1 && Math.abs(dy) > minSwipe) {
        (dy < 0 ? this.handlers.up : this.handlers.down)?.();
        return;
      }
      if (elapsed < 220) {
        this.handlers.up?.();
      }
    });
  }

  destroy() {
    this.scene.input.keyboard.removeAllListeners("keydown");
    this.scene.input.removeAllListeners("pointerdown");
    this.scene.input.removeAllListeners("pointerup");
  }
}
