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
  difficulty: 2, // 1=초급, 2=중급, 3=고급
};

// ============= Difficulty Presets =============
const DIFFICULTY = {
  smoothPursuit:    { 1: { spdMul: 0.6 }, 2: { spdMul: 1.0 }, 3: { spdMul: 1.5 } },
  figure8:          { 1: { spdMul: 0.6 }, 2: { spdMul: 1.0 }, 3: { spdMul: 1.5 } },
  saccade:          { 1: { spdMul: 0.6 }, 2: { spdMul: 1.0 }, 3: { spdMul: 1.6 } },
  hPattern:         { 1: { spdMul: 0.6 }, 2: { spdMul: 1.0 }, 3: { spdMul: 1.5 } },
  zigzagTracking:   { 1: { spdMul: 0.6 }, 2: { spdMul: 1.0 }, 3: { spdMul: 1.5 } },
  speedReading:     { 1: { spdMul: 0.6 }, 2: { spdMul: 1.0 }, 3: { spdMul: 1.5 } },
  schulteTable:     { 1: { gridSize: 3 }, 2: { gridSize: 5 }, 3: { gridSize: 7 } },
  rsvp:             { 1: { baseWpm: 120, maxWpm: 250 }, 2: { baseWpm: 200, maxWpm: 500 }, 3: { baseWpm: 350, maxWpm: 800 } },
  tachistoscope:    { 1: { minFlash: 0.3, levelCap: 3 }, 2: { minFlash: 0.08, levelCap: 6 }, 3: { minFlash: 0.04, levelCap: 8 } },
  eyeHop:           { 1: { baseInterval: 1.8, minInterval: 0.8 }, 2: { baseInterval: 1.2, minInterval: 0.5 }, 3: { baseInterval: 0.8, minInterval: 0.25 } },
  dynamicAcuity:    { 1: { spdMul: 0.6, showMul: 1.5 }, 2: { spdMul: 1.0, showMul: 1.0 }, 3: { spdMul: 1.5, showMul: 0.6 } },
  visualSpan:       { 1: { minChars: 2, maxChars: 5, flashMul: 1.5 }, 2: { minChars: 3, maxChars: 8, flashMul: 1.0 }, 3: { minChars: 5, maxChars: 12, flashMul: 0.6 } },
  peripheralDetection: { 1: { flashMul: 1.5, intervalMul: 1.5 }, 2: { flashMul: 1.0, intervalMul: 1.0 }, 3: { flashMul: 0.5, intervalMul: 0.6 } },
  nearFar:          { 1: { cycles: 6, nearSec: 7, farSec: 7 }, 2: { cycles: 10, nearSec: 5, farSec: 5 }, 3: { cycles: 15, nearSec: 3, farSec: 3 } },
  blinkTraining:    { 1: { duration: 60 }, 2: { duration: 120 }, 3: { duration: 180 } },
  eyeRelaxation:    { 1: { duration: 120 }, 2: { duration: 180 }, 3: { duration: 300 } },
  bouncingBall:     { 1: { ballCount: 4, spdMul: 0.6 }, 2: { ballCount: 6, spdMul: 1.0 }, 3: { ballCount: 10, spdMul: 1.5 } },
  mot:              { 1: { totalDots: 6, targetCount: 2, spdMul: 0.6, highlightSec: 3.5, trackSec: 5 }, 2: { totalDots: 10, targetCount: 3, spdMul: 1.0, highlightSec: 2.5, trackSec: 6 }, 3: { totalDots: 14, targetCount: 5, spdMul: 1.5, highlightSec: 1.5, trackSec: 8 } },
  spiralPursuit:    { 1: { spdMul: 0.6, angMul: 0.7, radSpeed: 30, trailLen: 80 }, 2: { spdMul: 1.0, angMul: 1.0, radSpeed: 40, trailLen: 60 }, 3: { spdMul: 1.5, angMul: 1.3, radSpeed: 55, trailLen: 40 } },
  reactionFlash:    { 1: { spdMul: 0.6, maxTargets: 2 }, 2: { spdMul: 1.0, maxTargets: 3 }, 3: { spdMul: 1.6, maxTargets: 5 } },
  colorTrail:       { 1: { dotCount: 8, spdMul: 0.6 }, 2: { dotCount: 12, spdMul: 1.0 }, 3: { dotCount: 18, spdMul: 1.5 } },
  // New exercises
  clockTracking:    { 1: { spdMul: 0.6 }, 2: { spdMul: 1.0 }, 3: { spdMul: 1.5 } },
  diamondPattern:   { 1: { spdMul: 0.6 }, 2: { spdMul: 1.0 }, 3: { spdMul: 1.5 } },
  vergenceRock:     { 1: { spdMul: 0.6, range: 0.3 }, 2: { spdMul: 1.0, range: 0.5 }, 3: { spdMul: 1.5, range: 0.7 } },
  circularPursuit:  { 1: { spdMul: 0.6 }, 2: { spdMul: 1.0 }, 3: { spdMul: 1.5 } },
  metronomeReading: { 1: { baseLPM: 20, lines: 5 }, 2: { baseLPM: 40, lines: 4 }, 3: { baseLPM: 60, lines: 3 } },
  numberFlash:      { 1: { minFlash: 0.4, maxDigits: 4 }, 2: { minFlash: 0.15, maxDigits: 7 }, 3: { minFlash: 0.06, maxDigits: 10 } },
  columnReading:    { 1: { startWidth: 120, maxWidth: 400 }, 2: { startWidth: 80, maxWidth: 500 }, 3: { startWidth: 60, maxWidth: 600 } },
  usefulFieldOfView:{ 1: { spdMul: 0.6, distractors: 2 }, 2: { spdMul: 1.0, distractors: 4 }, 3: { spdMul: 1.5, distractors: 8 } },
  flankerTask:      { 1: { spacing: 60, congruentRatio: 0.7 }, 2: { spacing: 40, congruentRatio: 0.5 }, 3: { spacing: 25, congruentRatio: 0.3 } },
  crowdingResistance:{ 1: { spdMul: 0.6, spacing: 3.0 }, 2: { spdMul: 1.0, spacing: 2.0 }, 3: { spdMul: 1.5, spacing: 1.2 } },
  attentionWindow:  { 1: { startRadius: 3, flashMs: 800 }, 2: { startRadius: 2, flashMs: 500 }, 3: { startRadius: 1, flashMs: 300 } },
  memoryFlash:      { 1: { gridSize: 3, flashMs: 1500, cells: 3 }, 2: { gridSize: 4, flashMs: 1000, cells: 5 }, 3: { gridSize: 5, flashMs: 600, cells: 7 } },
  antiSaccade:      { 1: { spdMul: 0.6, targetMs: 600 }, 2: { spdMul: 1.0, targetMs: 400 }, 3: { spdMul: 1.5, targetMs: 250 } },
  visualSearch:     { 1: { items: 12, spdMul: 0.6 }, 2: { items: 24, spdMul: 1.0 }, 3: { items: 40, spdMul: 1.5 } },
  pencilPushup:     { 1: { cycles: 8, nearSec: 5, farSec: 3 }, 2: { cycles: 12, nearSec: 4, farSec: 2 }, 3: { cycles: 16, nearSec: 3, farSec: 2 } },
  eyeYoga:          { 1: { holdSec: 5, cycles: 2 }, 2: { holdSec: 3, cycles: 3 }, 3: { holdSec: 2, cycles: 4 } },
  darkAdaptation:   { 1: { duration: 60 }, 2: { duration: 120 }, 3: { duration: 180 } },
};

function getDiff(type) {
  const d = DIFFICULTY[type || state.currentExercise];
  return d ? (d[state.difficulty] || d[2]) : {};
}

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
