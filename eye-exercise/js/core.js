// ============= Global State =============
const state = {
  currentExercise: null,
  running: false,
  paused: false,
  speed: 1.0,
  duration: 60,
  dotSize: 18,
  elapsed: 0,
  animId: null,
  lastTime: 0,
  ruleInterval: null,
  guidedInterval: null,
};

// ============= Progressive Speed =============
function getProgressiveSpeed() {
  const progress = state.elapsed / state.duration;
  const base = state.speed;
  let multiplier;
  if (progress < 0.3) {
    const t = progress / 0.3;
    multiplier = 0.5 + 0.5 * t * t;
  } else if (progress < 0.7) {
    const t = (progress - 0.3) / 0.4;
    multiplier = 1.0 + 0.8 * t;
  } else {
    const t = (progress - 0.7) / 0.3;
    multiplier = 1.8 - 0.6 * t * t;
  }
  return base * multiplier;
}

// ============= Color Cycling =============
const COLOR_PALETTE = [
  { h: 240, s: 90, l: 65 }, { h: 180, s: 90, l: 55 },
  { h: 145, s: 80, l: 55 }, { h: 50,  s: 95, l: 60 },
  { h: 25,  s: 95, l: 60 }, { h: 0,   s: 90, l: 65 },
  { h: 320, s: 80, l: 65 }, { h: 270, s: 85, l: 65 },
];

function getCurrentColor() {
  const t = state.elapsed / 8;
  const idx = Math.floor(t % COLOR_PALETTE.length);
  const nextIdx = (idx + 1) % COLOR_PALETTE.length;
  const frac = t % 1;
  const c1 = COLOR_PALETTE[idx], c2 = COLOR_PALETTE[nextIdx];
  let hDiff = c2.h - c1.h;
  if (hDiff > 180) hDiff -= 360;
  if (hDiff < -180) hDiff += 360;
  return {
    h: (c1.h + hDiff * frac + 360) % 360,
    s: c1.s + (c2.s - c1.s) * frac,
    l: c1.l + (c2.l - c1.l) * frac,
  };
}

function hslStr(c) { return `hsl(${Math.round(c.h)},${Math.round(c.s)}%,${Math.round(c.l)}%)`; }
function hslGlow(c, a=0.4) { return `hsla(${Math.round(c.h)},${Math.round(c.s)}%,${Math.round(c.l)}%,${a})`; }
function hslPath(c) { return hslGlow(c, 0.08); }

// ============= Canvas =============
const canvas = document.getElementById('exerciseCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  const c = canvas.parentElement;
  canvas.width = c.clientWidth;
  canvas.height = c.clientHeight;
}
window.addEventListener('resize', () => {
  if (state.running || document.getElementById('exerciseView').classList.contains('active')) resizeCanvas();
});

// ============= Drawing Helpers =============
function drawDot(x, y, r, color = '#6c63ff', glow = 'rgba(108,99,255,0.4)') {
  ctx.beginPath();
  ctx.arc(x, y, r * 2.5, 0, Math.PI * 2);
  const g = ctx.createRadialGradient(x, y, r * 0.5, x, y, r * 2.5);
  g.addColorStop(0, glow); g.addColorStop(1, 'transparent');
  ctx.fillStyle = g; ctx.fill();
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill();
  ctx.beginPath(); ctx.arc(x - r*0.25, y - r*0.25, r*0.35, 0, Math.PI*2);
  ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.fill();
}

function drawGuide() {
  const cx = canvas.width/2, cy = canvas.height/2;
  ctx.strokeStyle = 'rgba(255,255,255,0.03)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(cx,0); ctx.lineTo(cx,canvas.height);
  ctx.moveTo(0,cy); ctx.lineTo(canvas.width,cy); ctx.stroke();
}

// ============= Audio =============
function playBeep(freq = 800, dur = 0.3) {
  try {
    const ac = new AudioContext(), osc = ac.createOscillator(), g = ac.createGain();
    osc.connect(g); g.connect(ac.destination);
    osc.frequency.value = freq; g.gain.value = 0.3;
    osc.start(); osc.stop(ac.currentTime + dur);
  } catch(e) {}
}

// ============= Shared chars =============
const ACUITY_CHARS = 'ABCDEFGHJKLMNPRSTUVWXYZ2345679';
