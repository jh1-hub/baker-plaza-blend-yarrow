export class GameAudio {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private sfx: GainNode | null = null;
  private music: GainNode | null = null;
  private muted = false;
  private musicTimer: number | null = null;
  private step = 0;

  unlock() {
    if (!this.ctx) {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AC({ latencyHint: "interactive" });
      this.master = this.ctx.createGain();
      this.sfx = this.ctx.createGain();
      this.music = this.ctx.createGain();
      this.sfx.gain.value = 0.7;
      this.music.gain.value = 0.18;
      this.master.gain.value = this.muted ? 0 : 0.85;
      this.sfx.connect(this.master);
      this.music.connect(this.master);
      this.master.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") {
      void this.ctx.resume();
    }
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    if (this.master && this.ctx) {
      this.master.gain.setTargetAtTime(muted ? 0 : 0.85, this.ctx.currentTime, 0.03);
    }
  }

  resume() {
    if (this.ctx?.state === "suspended") void this.ctx.resume();
  }

  private tone(
    freq: number,
    dur: number,
    type: OscillatorType,
    gain = 0.12,
    dest?: GainNode,
    slide?: number,
  ) {
    if (!this.ctx || !this.sfx || !this.music) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(40, slide), t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g);
    g.connect(dest ?? this.sfx);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  }

  private noise(dur: number, gain = 0.08, hp = 800) {
    if (!this.ctx || !this.sfx) return;
    const n = this.ctx.sampleRate * dur;
    const buf = this.ctx.createBuffer(1, n, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < n; i++) data[i] = Math.random() * 2 - 1;
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    const filter = this.ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.value = hp;
    const g = this.ctx.createGain();
    const t = this.ctx.currentTime;
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(filter);
    filter.connect(g);
    g.connect(this.sfx);
    src.start(t);
    src.stop(t + dur + 0.02);
  }

  shoot(kind: "qualitative" | "quantitative") {
    const jitter = 0.94 + Math.random() * 0.12;
    if (kind === "qualitative") {
      this.tone(1480 * jitter, 0.09, "square", 0.07, undefined, 420);
      this.tone(2960 * jitter, 0.05, "square", 0.03);
    } else {
      this.tone(420 * jitter, 0.11, "sawtooth", 0.08, undefined, 180);
      this.tone(880 * jitter, 0.06, "square", 0.04);
    }
    this.noise(0.04, 0.04, 1200);
  }

  hit() {
    this.tone(920, 0.07, "square", 0.05, undefined, 1400);
    this.noise(0.05, 0.06, 600);
  }

  kill() {
    this.tone(240, 0.16, "sawtooth", 0.1, undefined, 70);
    this.noise(0.12, 0.1, 300);
  }

  wrong() {
    this.tone(180, 0.22, "square", 0.1, undefined, 90);
    this.tone(190, 0.22, "sawtooth", 0.06);
  }

  damage() {
    this.tone(90, 0.28, "sawtooth", 0.14, undefined, 40);
    this.noise(0.2, 0.12, 200);
  }

  pickup() {
    this.tone(660, 0.08, "square", 0.06);
    this.tone(990, 0.1, "square", 0.05);
    this.tone(1320, 0.12, "square", 0.04);
  }

  combo() {
    this.tone(520, 0.08, "square", 0.05);
    this.tone(780, 0.1, "square", 0.05);
    this.tone(1040, 0.14, "square", 0.05);
  }

  bomb() {
    this.tone(80, 0.4, "sawtooth", 0.16, undefined, 30);
    this.noise(0.35, 0.18, 150);
  }

  startMusic() {
    this.stopMusic();
    if (!this.ctx || !this.music) return;
    const tick = () => {
      if (!this.ctx || !this.music) return;
      const root = this.step % 8 === 7 ? 55 : this.step % 4 === 0 ? 82 : 73;
      this.tone(root, 0.18, "sawtooth", 0.07, this.music);
      if (this.step % 2 === 0) this.tone(root * 2, 0.05, "square", 0.02, this.music);
      this.step += 1;
      this.musicTimer = window.setTimeout(tick, 220);
    };
    tick();
  }

  stopMusic() {
    if (this.musicTimer != null) {
      clearTimeout(this.musicTimer);
      this.musicTimer = null;
    }
  }
}
