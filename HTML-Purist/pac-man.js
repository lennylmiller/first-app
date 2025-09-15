class PacMan extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._spinning = false;
    this._spinStart = 0;
    this._spinReq = null;
    this._pacmanPosition = -80;
    this._pacmanDirection = 1;
    this._mouthAngle = 0.25;
    this._dots = [];
  }

  static get observedAttributes() {
    return ['chomp-time', 'power-pellet', 'normal-pellet', 'background-color'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'chomp-time':
        this.chompTime = parseInt(newValue, 10) || 8;
        break;
      case 'power-pellet':
        this.powerPelletColor = newValue || 'red';
        break;
      case 'normal-pellet':
        this.normalPelletColor = newValue || 'green';
        break;
      case 'background-color':
        this.backgroundColor = newValue || '#000';
        if (this._canvas) {
          this._canvas.style.backgroundColor = this.backgroundColor;
        }
        break;
    }
  }

  connectedCallback() {
    this.chompTime = parseInt(this.getAttribute('chomp-time'), 10) || 8;
    this.powerPelletColor = this.getAttribute('power-pellet') || 'red';
    this.normalPelletColor = this.getAttribute('normal-pellet') || 'green';
    this.backgroundColor = this.getAttribute('background-color') || '#000';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: sans-serif;
        }
        canvas {
          border: 1px solid #ccc;
          display: none;
        }
        button {
          margin-bottom: 1em;
        }
      </style>
      <button title="Or press Alt+S (Win) / Ctrl+Opt+S (Mac)">Start Pac-Man</button>
      <div id="saving-status"></div>
      <canvas width="600" height="200"></canvas>
    `;

    this._canvas = this.shadowRoot.querySelector('canvas');
    this._canvas.style.backgroundColor = this.backgroundColor;
    this._savingStatus = this.shadowRoot.querySelector('#saving-status');
    this._ctx = this._canvas.getContext('2d');

    this.shadowRoot.querySelector('button').addEventListener('click', () => this.startSavingAnimation());

    window.addEventListener('keydown', (e) => {
        const target = e.target;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
            return;
        }
        if ((e.altKey || (e.ctrlKey && e.altKey) || (e.ctrlKey && e.metaKey)) && e.key.toLowerCase() === 's') {
            e.preventDefault();
            this.startSavingAnimation();
        }
    });
  }

  _playSound(type) {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
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
      case 'firework':
        o.type = 'sine';
        o.frequency.setValueAtTime(200, audioCtx.currentTime);
        g.gain.setValueAtTime(0.8, audioCtx.currentTime);
        o.frequency.exponentialRampToValueAtTime(2000, audioCtx.currentTime + 0.3);
        g.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.3);
        o.start();
        o.stop(audioCtx.currentTime + 0.4);
        break;
    }
  }

  _setupDots() {
    this._dots = [];
    for (let i = 0; i < 10; i++) {
      this._dots.push({ x: 120 + i * 50, y: this._canvas.height / 2, visible: true });
    }
    const powerPelletIndex = Math.floor(Math.random() * this._dots.length);
    this._dots[powerPelletIndex].power = true;
  }

  _drawDots() {
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

  _drawFirework(x, y) {
    if (!this._ctx) return;
    const particleCount = 100;
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: x,
        y: y,
        color: `hsl(${Math.random() * 360}, 100%, 50%)`,
        speed: Math.random() * 5 + 2,
        angle: Math.random() * Math.PI * 2,
        friction: 0.95,
        gravity: 1,
        alpha: 1
      });
    }

    const animateFireworks = () => {
      this._ctx.globalCompositeOperation = 'source-over';
      this._ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      this._ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);
      this._ctx.globalCompositeOperation = 'lighter';

      for (const p of particles) {
        p.x += Math.cos(p.angle) * p.speed;
        p.y += Math.sin(p.angle) * p.speed + p.gravity;
        p.speed *= p.friction;
        p.alpha -= 0.02;

        if (p.alpha > 0) {
          this._ctx.fillStyle = p.color;
          this._ctx.beginPath();
          this._ctx.arc(p.x, p.y, 3, 0, 2 * Math.PI);
          this._ctx.fill();
        }
      }

      if (particles.some(p => p.alpha > 0)) {
        requestAnimationFrame(animateFireworks);
      }
    };
    animateFireworks();
  }

  _drawPacMan(x, mouth, direction) {
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

  _animatePacMan() {
    if (!this._spinning) return;
    const elapsed = (performance.now() - this._spinStart) / 1000;

    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    this._drawDots();

    this._pacmanPosition += 5 * this._pacmanDirection;
    this._mouthAngle = Math.abs(Math.sin(elapsed * 10)) * 0.2;
    this._drawPacMan(this._pacmanPosition, this._mouthAngle, this._pacmanDirection);

    for (const dot of this._dots) {
      if (dot.visible && Math.abs(this._pacmanPosition - dot.x) < 30) {
        dot.visible = false;
        if (dot.power) {
          this._playSound('firework');
          this._drawFirework(dot.x, dot.y);
        } else {
          this._playSound('eat');
        }
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
}

customElements.define('pac-man', PacMan);
