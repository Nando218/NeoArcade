// Reusable Audio class for game sounds (from Tetris)
export class Audio {
  constructor() {
    this.context = null;
    this.createAudioContext();
    this.isMuted = false;
  }

  createAudioContext() {
    try {
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      this.context = new AudioContext();
    } catch (e) {
      console.warn('Web Audio API is not supported in this browser');
    }
  }

  ensureContext() {
    if (!this.context) {
      this.createAudioContext();
    } else if (this.context.state === 'suspended') {
      this.context.resume();
    }
  }

  createOscillator(freq, type, duration) {
    if (!this.context || this.isMuted) return;
    this.ensureContext();
    const oscillator = this.context.createOscillator();
    const gainNode = this.context.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(this.context.destination);
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(freq, this.context.currentTime);
    gainNode.gain.setValueAtTime(0.5, this.context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + duration);
    oscillator.start();
    oscillator.stop(this.context.currentTime + duration);
  }

  playMove() {
    this.createOscillator(220, 'sine', 0.05);
  }
  playRotate() {
    this.createOscillator(330, 'sine', 0.08);
  }
  playLand() {
    this.createOscillator(180, 'triangle', 0.1);
  }
  playLineClear() {
    this.createOscillator(440, 'square', 0.1);
    setTimeout(() => this.createOscillator(660, 'square', 0.1), 100);
    setTimeout(() => this.createOscillator(880, 'square', 0.2), 200);
  }
  playHardDrop() {
    this.createOscillator(180, 'triangle', 0.05);
    setTimeout(() => this.createOscillator(150, 'triangle', 0.2), 30);
  }
  playGameOver() {
    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        this.createOscillator(220 - i * 10, 'sawtooth', 0.1);
      }, i * 100);
    }
  }
  playStart() {
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        this.createOscillator(440 + i * 110, 'sine', 0.1);
      }, i * 100);
    }
  }
  playPause() {
    for (let i = 0; i < 2; i++) {
      setTimeout(() => {
        this.createOscillator(330 - i * 110, 'sine', 0.1);
      }, i * 100);
    }
  }
  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }
}
