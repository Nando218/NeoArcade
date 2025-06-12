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
    if (this.isMuted) return;
    // Remove any previous rotate audio
    if (this._rotateAudio) {
      this._rotateAudio.pause();
      this._rotateAudio.currentTime = 0;
    }
    this._rotateAudio = new window.Audio("https://res.cloudinary.com/dgzgzx9ov/video/upload/v1749722181/rotate_o6byco.mp3");
    this._rotateAudio.volume = 0.7;
    this._rotateAudio.play().catch(() => {});
  }
  playLand() {
    this.createOscillator(180, 'triangle', 0.1);
  }
  playLineClear() {
    if (this.isMuted) return;
    // Detener cualquier audio anterior de line clear
    if (this._lineClearAudio) {
      this._lineClearAudio.pause();
      this._lineClearAudio.currentTime = 0;
    }
    this._lineClearAudio = new window.Audio("https://res.cloudinary.com/dgzgzx9ov/video/upload/v1749722429/lineclear_xz2u7f.mp3");
    this._lineClearAudio.volume = 1.0;
    this._lineClearAudio.play().catch(() => {});
  }
  playHardDrop() {
    this.createOscillator(180, 'triangle', 0.05);
    setTimeout(() => this.createOscillator(150, 'triangle', 0.2), 30);
  }
  playGameOver() {
    if (this.isMuted) return;
    // Detener cualquier audio de derrota anterior
    if (this._gameOverAudio) {
      this._gameOverAudio.pause();
      this._gameOverAudio.currentTime = 0;
    }
    this._gameOverAudio = new window.Audio("https://res.cloudinary.com/dgzgzx9ov/video/upload/v1749721838/gameover_zdu5r1.mp3");
    this._gameOverAudio.volume = 1.0;
    this._gameOverAudio.play().catch(() => {});
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
  playDraw() {
    if (this.isMuted) return;
    if (this._drawAudio) {
      this._drawAudio.pause();
      this._drawAudio.currentTime = 0;
    }
    this._drawAudio = new window.Audio("https://res.cloudinary.com/dgzgzx9ov/video/upload/v1749723365/draw_bvx6tm.mp3");
    this._drawAudio.volume = 0.7;
    this._drawAudio.play().catch(() => {});
  }
  playWin() {
    if (this.isMuted) return;
    // Detener cualquier audio de victoria anterior
    if (this._winAudio) {
      this._winAudio.pause();
      this._winAudio.currentTime = 0;
    }
    this._winAudio = new window.Audio("https://res.cloudinary.com/dgzgzx9ov/video/upload/v1749723986/win_dsg3gi.mp3");
    this._winAudio.volume = 1.0;
    this._winAudio.play().catch(() => {});
  }
  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }
}
