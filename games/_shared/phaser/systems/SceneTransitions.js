export class SceneTransitions {
  static flash(scene, color = 0x8cf5da, duration = 160, alpha = 0.25) {
    scene.cameras.main.flash(duration, color >> 16, (color >> 8) & 255, color & 255, true, (_, progress) => {
      scene.cameras.main.setAlpha(1 - Math.sin(progress * Math.PI) * (1 - alpha) * 0.08);
    });
  }

  static shake(scene, duration = 140, intensity = 0.012) {
    scene.cameras.main.shake(duration, intensity);
  }

  static pulseElement(el) {
    if (!el) return;
    el.classList.remove("pop");
    void el.offsetWidth;
    el.classList.add("pop");
  }
}
