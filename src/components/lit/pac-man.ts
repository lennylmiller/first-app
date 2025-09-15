import { LitElement, html, css } from 'lit-element';
import { customElement, property, query } from 'lit-element/lib/decorators.js';

@customElement('pac-man')
export class PacMan extends LitElement {
  @property({ type: Number, attribute: 'chomp-time' })
  chompTime = 8;

  @property({ type: String, attribute: 'power-pellet' })
  powerPelletColor = 'red';

  @property({ type: String, attribute: 'normal-pellet' })
  normalPelletColor = 'green';

  @query('canvas')
  private _canvas!: HTMLCanvasElement;

  @query('#saving-status')
  private _savingStatus!: HTMLDivElement;

  private _ctx: CanvasRenderingContext2D | null = null;
  private _spinning = false;
  private _spinStart = 0;
  private _spinReq: number | null = null;
  private _pacmanPosition = -80;
  private _pacmanDirection = 1;
  private _mouthAngle = 0.25;
  private _dots: { x: number; y: number; visible: boolean; power?: boolean }[] = [];

  static styles = css`
    :host {
      display: block;
      font-family: sans-serif;
    }
    canvas {
      border: 1px solid #ccc;
      display: none;
      background-color: #000;
    }
    button {
      margin-bottom: 1em;
    }
  `;

  firstUpdated() {
    if (this._canvas) {
      this._ctx = this._canvas.getContext('2d');
    }
    // Add keydown listener to the window
    window.addEventListener('keydown', (e: KeyboardEvent) => {
        // Check if the event target is not an input field to avoid conflicts
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
            return;
        }
        if ((e.altKey || (e.ctrlKey && e.altKey) || (e.ctrlKey && e.metaKey)) && e.key.toLowerCase() === 's') {
            e.preventDefault();
            this.startSavingAnimation();
        }
    });
  }

  private _playSound(type: 'klaxon' | 'bell' | 'eat') {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.connect(g);
    g.connect(audioCtx.destination);

    switch (type) {
      case 'klaxon':
        o.type = 'square';
        o.frequency.setValueAtTime(440, audioCtx.currentTime);
        g.gain.setValueAtTime(0.5, audioCtx.currentTime);
        o.frequency.linearRampToValueAtTime(220, audioCtx.currentTime + 0.2);
        o.start();
        o.stop(audioCtx.currentTime + 0.4);
        break;
      case 'bell':
        o.type = 'sine';
        o.frequency.setValueAtTime(1047, audioCtx.currentTime);
        g.gain.setValueAtTime(0.7, audioCtx.currentTime);
        o.frequency.linearRampToValueAtTime(523, audioCtx.currentTime + 0.2);
        o.start();
        o.stop(audioCtx.currentTime + 0.5);
        break;
      case 'eat':
        o.type = 'sawtooth';
        o.frequency.setValueAtTime(100, audioCtx.currentTime);
        g.gain.setValueAtTime(0.3, audioCtx.currentTime);
        o.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.05);
        g.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.1);
        o.start();
        o.stop(audioCtx.currentTime + 0.1);
        break;
    }
  }

  private _setupDots() {
    this._dots = [];
    for (let i = 0; i < 10; i++) {
      this._dots.push({ x: 120 + i * 50, y: this._canvas.height / 2, visible: true });
    }
    // Add a power pellet
    this._dots[this._dots.length - 1].power = true;
  }

  private _drawDots() {
    if (!this._ctx) return;
    for (const dot of this._dots) {
      if (dot.visible) {
        this._ctx.fillStyle = dot.power ? this.powerPelletColor : this.normalPelletColor;
        this._ctx.beginPath();
        this._ctx.arc(dot.x, dot.y, dot.power ? 15 : 10, 0, 2 * Math.PI);
        this._ctx.fill();
      }
    }
  }

  private _drawPacMan(x: number, mouth: number, direction: number) {
    if (!this._ctx) return;
    this._ctx.save();
    this._ctx.translate(x, this._canvas.height / 2);
    this._ctx.scale(direction, 1);

    const gradient = this._ctx.createRadialGradient(0, 0, 20, 0, 0, 70);
    gradient.addColorStop(0, 'yellow');
    gradient.addColorStop(1, '#ffc400');
    this._ctx.fillStyle = gradient;

    this._ctx.beginPath();
    this._ctx.arc(0, 0, 70, mouth * Math.PI, (2 - mouth) * Math.PI);
    this._ctx.lineTo(0, 0);
    this._ctx.closePath();
    this._ctx.fill();

    this._ctx.beginPath();
    this._ctx.arc(25, -30, 8, 0, 2 * Math.PI);
    this._ctx.fillStyle = 'black';
    this._ctx.fill();
    this._ctx.restore();
  }

  private _animatePacMan() {
    if (!this._spinning) return;
    const elapsed = (performance.now() - this._spinStart) / 1000;

    this._ctx!.clearRect(0, 0, this._canvas.width, this._canvas.height);
    this._drawDots();

    this._pacmanPosition += 5 * this._pacmanDirection;
    this._mouthAngle = Math.abs(Math.sin(elapsed * 10)) * 0.2;
    this._drawPacMan(this._pacmanPosition, this._mouthAngle, this._pacmanDirection);

    for (const dot of this._dots) {
      if (dot.visible && Math.abs(this._pacmanPosition - dot.x) < 30) {
        dot.visible = false;
        this._playSound('eat');
      }
    }

    if (this._pacmanDirection === 1 && this._pacmanPosition > this._canvas.width + 70) {
      this._pacmanDirection = -1;
      this._setupDots();
    } else if (this._pacmanDirection === -1 && this._pacmanPosition < -70) {
      this._pacmanDirection = 1;
      this._setupDots();
    }

    if (elapsed < this.chompTime) {
      this._spinReq = requestAnimationFrame(this._animatePacMan.bind(this));
    } else {
      this._spinning = false;
      this._canvas.style.display = 'none';
      this._savingStatus.textContent = '';
      this._playSound('bell');
    }
  }

  startSavingAnimation() {
    if (this._spinning) return;
    this._spinning = true;
    this._spinStart = performance.now();
    this._pacmanPosition = -80;
    this._pacmanDirection = 1;
    this._setupDots();
    this._canvas.style.display = 'block';
    this._savingStatus.textContent = 'saving...';
    this._playSound('klaxon');
    this._spinReq = requestAnimationFrame(this._animatePacMan.bind(this));
  }

  render() {
    return html`
      <button @click=${this.startSavingAnimation} accesskey="s" title="Or press Alt+S (Win) / Ctrl+Opt+S (Mac)">
        Start Pac-Man
      </button>
      <div id="saving-status"></div>
      <canvas width="600" height="200"></canvas>
    `;
  }
}
