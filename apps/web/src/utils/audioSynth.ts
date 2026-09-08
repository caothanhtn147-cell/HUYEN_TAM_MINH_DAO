// Web Audio API Synthesizer Utility for Huyền Tâm Minh Đạo

class AudioSynthesizer {
  private ctx: AudioContext | null = null;
  private ambientOscillator: OscillatorNode | null = null;
  private ambientGain: GainNode | null = null;
  private isAmbientPlaying: boolean = false;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Play a soft mystical chime sound (for Tarot card flip)
  public playMysticChime() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(528, now); // Solfeggio 528Hz Transformation frequency
      osc.frequency.exponentialRampToValueAtTime(1056, now + 0.3);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 1.2);
    } catch {
      // Ignore audio autoplay restriction errors
    }
  }

  // Play bronze coin toss clink sound (for Kinh Dịch)
  public playCoinClink() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1800, now);
      osc.frequency.exponentialRampToValueAtTime(900, now + 0.15);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch {
      // Ignore
    }
  }

  // Toggle 432Hz Meditation Ambient Sound Wave Drone
  public toggle432HzDrone(onStateChange?: (playing: boolean) => void): boolean {
    const ctx = this.getContext();
    if (!ctx) return false;

    if (this.isAmbientPlaying) {
      this.stop432HzDrone();
      if (onStateChange) onStateChange(false);
      return false;
    } else {
      this.start432HzDrone();
      if (onStateChange) onStateChange(true);
      return true;
    }
  }

  public start432HzDrone() {
    const ctx = this.getContext();
    if (!ctx || this.isAmbientPlaying) return;

    try {
      const now = ctx.currentTime;
      this.ambientOscillator = ctx.createOscillator();
      this.ambientGain = ctx.createGain();

      // 432Hz Natural Harmonic Tuning Frequency
      this.ambientOscillator.type = 'sine';
      this.ambientOscillator.frequency.setValueAtTime(432, now);

      // Low pass filter to make it warm and soothing
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, now);

      this.ambientGain.gain.setValueAtTime(0.01, now);
      this.ambientGain.gain.exponentialRampToValueAtTime(0.08, now + 2); // Fade in over 2s

      this.ambientOscillator.connect(filter);
      filter.connect(this.ambientGain);
      this.ambientGain.connect(ctx.destination);

      this.ambientOscillator.start(now);
      this.isAmbientPlaying = true;
    } catch {
      this.isAmbientPlaying = false;
    }
  }

  public stop432HzDrone() {
    const ctx = this.getContext();
    if (this.ambientGain && ctx && this.isAmbientPlaying) {
      try {
        const now = ctx.currentTime;
        this.ambientGain.gain.exponentialRampToValueAtTime(0.0001, now + 1); // Fade out over 1s
        setTimeout(() => {
          if (this.ambientOscillator) {
            this.ambientOscillator.stop();
            this.ambientOscillator.disconnect();
            this.ambientOscillator = null;
          }
          this.isAmbientPlaying = false;
        }, 1000);
      } catch {
        this.isAmbientPlaying = false;
      }
    } else {
      this.isAmbientPlaying = false;
    }
  }

  public isPlaying(): boolean {
    return this.isAmbientPlaying;
  }
}

export const audioSynth = new AudioSynthesizer();
