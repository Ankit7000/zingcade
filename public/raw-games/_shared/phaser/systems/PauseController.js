export class PauseController {
  constructor({ pause, resume, canPause }) {
    this.pause = pause;
    this.resume = resume;
    this.canPause = canPause || (() => true);
    this.onBlur = () => {
      if (this.canPause()) this.pause();
    };
    this.onVisibility = () => {
      if (document.hidden && this.canPause()) this.pause();
    };
    window.addEventListener("blur", this.onBlur);
    document.addEventListener("visibilitychange", this.onVisibility);
  }

  destroy() {
    window.removeEventListener("blur", this.onBlur);
    document.removeEventListener("visibilitychange", this.onVisibility);
  }
}
