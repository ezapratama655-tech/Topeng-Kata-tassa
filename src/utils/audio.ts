// Gamelan Pentatonic Web Audio Synthesizer
class GamelanSynth {
  private ctx: AudioContext | null = null;
  private isEnabled: boolean = false;

  constructor() {
    // Check localStorage preference if available
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('topeng_audio_enabled');
      this.isEnabled = saved === 'true';
    }
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleAudio(): boolean {
    this.isEnabled = !this.isEnabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem('topeng_audio_enabled', String(this.isEnabled));
    }
    if (this.isEnabled) {
      this.initCtx();
      this.playGong(220); // Warm opening chime
    }
    return this.isEnabled;
  }

  public getStatus(): boolean {
    return this.isEnabled;
  }

  public playTone(freq: number = 440, type: OscillatorType = 'sine', duration: number = 0.8, volume: number = 0.15) {
    if (!this.isEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  // Authentic resonant gong chime with harmonic richness
  public playGong(baseFreq: number = 196) {
    if (!this.isEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const harmonics = [1, 2.02, 3.01];
      const gains = [0.25, 0.12, 0.05];

      harmonics.forEach((h, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(baseFreq * h, this.ctx.currentTime);

        gain.gain.setValueAtTime(gains[i], this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 2.5);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 2.5);
      });
    } catch {
      // Ignore audio policy issues
    }
  }

  // Saron / Bonang crisp metal chime
  public playBonang(freq: number = 523.25) {
    this.playTone(freq, 'sine', 0.9, 0.2);
    // Add bright sparkle overtone
    setTimeout(() => {
      this.playTone(freq * 1.5, 'triangle', 0.5, 0.08);
    }, 15);
  }

  // Bamboo / wooden scroll unrolling tactile clack
  public playWoodClack() {
    if (!this.isEnabled) return;
    try {
      this.playTone(392, 'triangle', 0.25, 0.12);
      setTimeout(() => {
        this.playTone(523.25, 'sine', 0.35, 0.08);
      }, 40);
    } catch {
      // Ignore
    }
  }
}

export const gamelan = new GamelanSynth();

