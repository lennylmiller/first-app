//* This is a comment */

class SmileyEmoji extends HTMLElement {
  constructor() {
    super();
    this.innerText = '😊';
  }
}
customElements.define('smiley-emoji', SmileyEmoji);

class AddSmileyBefore extends HTMLSpanElement {
  constructor() {
    super();
    this.innerText = `😊 ${this.innerText}`;
  }
}
customElements.define('add-smiley-before', AddSmileyBefore, { extends: 'span' });

class AddSmileyAfter extends HTMLSpanElement {
  constructor() {
    super();
    this.innerText = `${this.innerText} 😊`;
  }
}
customElements.define('add-smiley-after', AddSmileyAfter, { extends: 'span' });

// PacMan Animation and Sound Logic
const canvas = document.getElementById('pacman-canvas');
const ctx = canvas ? canvas.getContext('2d') : null;
const savingStatus = document.getElementById('saving-status');
const saveButton = document.querySelector('button[accesskey="s"]');

let spinning = false;
let spinStart = 0;
let spinReq = null;
let pacmanAngle = 0;
let pacmanPosition = -80;
let pacmanDirection = 1; // 1 for right, -1 for left
let mouthAngle = 0.25;
let dots = [];

function playSound(type) {
  let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  let o = audioCtx.createOscillator();
  let g = audioCtx.createGain();
  o.connect(g);
  g.connect(audioCtx.destination);
  if (type === 'klaxon') {
    o.type = 'square';
    o.frequency.setValueAtTime(440, audioCtx.currentTime);
    g.gain.setValueAtTime(0.5, audioCtx.currentTime);
    o.frequency.linearRampToValueAtTime(220, audioCtx.currentTime + 0.2);
    o.start();
    o.stop(audioCtx.currentTime + 0.4);
  } else if (type === 'bell') {
    o.type = 'sine';
    o.frequency.setValueAtTime(1047, audioCtx.currentTime);
    g.gain.setValueAtTime(0.7, audioCtx.currentTime);
    o.frequency.linearRampToValueAtTime(523, audioCtx.currentTime + 0.2);
    o.start();
    o.stop(audioCtx.currentTime + 0.5);
  } else if (type === 'eat') {
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(100, audioCtx.currentTime);
    g.gain.setValueAtTime(0.3, audioCtx.currentTime);
    o.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.05);
    g.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.1);
    o.start();
    o.stop(audioCtx.currentTime + 0.1);
  }
}

function setupDots() {
    dots = [];
    for (let i = 0; i < 10; i++) {
        dots.push({ x: 120 + i * 50, y: canvas.height / 2, visible: true });
    }
}

function drawDots() {
    if (!ctx) return;
    ctx.fillStyle = 'green';
    for (const dot of dots) {
        if (dot.visible) {
            ctx.beginPath();
            ctx.arc(dot.x, dot.y, 10, 0, 2 * Math.PI);
            ctx.fill();
        }
    }
}

function drawPacMan(x, mouth, direction) {
  if (!ctx) return;
  ctx.save();
  ctx.translate(x, canvas.height / 2);
  ctx.scale(direction, 1);

  // 3D-ish body
  const gradient = ctx.createRadialGradient(0, 0, 20, 0, 0, 70);
  gradient.addColorStop(0, 'yellow');
  gradient.addColorStop(1, '#ffc400');
  ctx.fillStyle = gradient;

  ctx.beginPath();
  ctx.arc(0, 0, 70, mouth * Math.PI, (2 - mouth) * Math.PI);
  ctx.lineTo(0, 0);
  ctx.closePath();
  ctx.fill();

  // Eye
  ctx.beginPath();
  ctx.arc(25, -30, 8, 0, 2 * Math.PI);
  ctx.fillStyle = 'black';
  ctx.fill();
  ctx.restore();
}

function animatePacMan(ts) {
  if (!spinning) return;
  const elapsed = (performance.now() - spinStart) / 1000;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawDots();

  pacmanPosition += 5 * pacmanDirection;
  mouthAngle = Math.abs(Math.sin(elapsed * 10)) * 0.2;
  drawPacMan(pacmanPosition, mouthAngle, pacmanDirection);

  // Check for dot collision
  for (const dot of dots) {
      if (dot.visible && Math.abs(pacmanPosition - dot.x) < 30) {
          dot.visible = false;
          playSound('eat');
      }
  }

  // Check for boundaries and reverse direction
  if (pacmanDirection === 1 && pacmanPosition > canvas.width + 70) {
      pacmanDirection = -1;
      setupDots();
  } else if (pacmanDirection === -1 && pacmanPosition < -70) {
      pacmanDirection = 1;
      setupDots();
  }

  if (elapsed < 8) {
    spinReq = requestAnimationFrame(animatePacMan);
  } else {
    spinning = false;
    canvas.style.display = 'none';
    savingStatus.textContent = '';
    playSound('bell');
  }
}

function startSavingAnimation() {
  if (spinning) return;
  spinning = true;
  spinStart = performance.now();
  pacmanPosition = -80;
  pacmanDirection = 1;
  setupDots();
  canvas.style.display = 'block';
  savingStatus.textContent = 'saving...';
  playSound('klaxon');
  spinReq = requestAnimationFrame(animatePacMan);
}

// AccessKey event (for demo, also triggers on button click)
if (saveButton) {
  saveButton.addEventListener('click', startSavingAnimation);
}
document.addEventListener('keydown', (e) => {
  // Alt+S (Win/Linux), Ctrl+Opt+S (Mac)
  if ((e.altKey || (e.ctrlKey && e.altKey) || (e.ctrlKey && e.metaKey)) && e.key.toLowerCase() === 's') {
    startSavingAnimation();
  }
});
