export class AudioController {
  constructor(storage, muteKey = "audio-muted") {
    this.storage = storage;
    this.muteKey = muteKey;
    this.muted = storage.getNumber(muteKey, 0) === 1;
    this.ctx = null;
  }

  unlock() {
    if (this.ctx || this.muted) return;
    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtor) return;
    this.ctx = new AudioCtor();
    if (this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }

  toggle() {
    this.muted = !this.muted;
    this.storage.setNumber(this.muteKey, this.muted ? 1 : 0);
    return this.muted;
  }

  tone({ frequency = 440, endFrequency = frequency, duration = 0.12, type = "sine", gain = 0.04 } = {}) {
    if (this.muted) return;
    this.unlock();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const oscillator = this.ctx.createOscillator();
    const envelope = this.ctx.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, now);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(40, endFrequency), now + duration);
    envelope.gain.setValueAtTime(0.0001, now);
    envelope.gain.exponentialRampToValueAtTime(gain, now + 0.02);
    envelope.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    oscillator.connect(envelope);
    envelope.connect(this.ctx.destination);
    oscillator.start(now);
    oscillator.stop(now + duration + 0.03);
  }

  play(kind) {
    const tones = {
      start: { frequency: 260, endFrequency: 420, duration: 0.14, type: "triangle", gain: 0.045 },
      move: { frequency: 520, endFrequency: 680, duration: 0.06, type: "square", gain: 0.02 },
      jump: { frequency: 440, endFrequency: 720, duration: 0.09, type: "triangle", gain: 0.025 },
      slide: { frequency: 360, endFrequency: 210, duration: 0.1, type: "sine", gain: 0.026 },
      coin: { frequency: 740, endFrequency: 980, duration: 0.08, type: "triangle", gain: 0.028 },
      power: { frequency: 500, endFrequency: 900, duration: 0.14, type: "triangle", gain: 0.035 },
      crash: { frequency: 210, endFrequency: 65, duration: 0.22, type: "sawtooth", gain: 0.052 },
      pause: { frequency: 320, endFrequency: 220, duration: 0.08, type: "sine", gain: 0.022 }
    };
    this.tone(tones[kind] || tones.move);
  }
}
