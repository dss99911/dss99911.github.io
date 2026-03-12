// ============= Exercise Types =============
const GUIDED_TYPES = ['nearFar', 'rule202020', 'blinkTraining', 'eyeRelaxation'];
const DOM_EXERCISE_TYPES = ['schulteTable', 'rsvp', 'tachistoscope', 'eyeHop'];

const TITLES = {
  smoothPursuit: 'Smooth Pursuit', figure8: 'Figure 8', saccade: 'Saccade Training',
  hPattern: 'H-Pattern', speedReading: 'Speed Reading', dynamicAcuity: 'Dynamic Acuity',
  visualSpan: 'Visual Span', peripheralDetection: 'Peripheral Detection',
  zigzagTracking: 'Zigzag Tracking', schulteTable: 'Schulte Table',
  rsvp: 'RSVP', tachistoscope: 'Tachistoscope', eyeHop: 'Eye-Hop',
  nearFar: 'Near-Far Focus', rule202020: '20-20-20 Rule',
  blinkTraining: 'Blink Training', eyeRelaxation: 'Eye Relaxation',
  bouncingBall: 'Bouncing Ball', mot: 'Multiple Object Tracking',
  spiralPursuit: 'Spiral Pursuit', reactionFlash: 'Reaction Flash',
  colorTrail: 'Color Trail',
};

// ============= Navigation =============
function startExercise(type) {
  state.currentExercise = type;
  state.elapsed = 0;
  state.paused = false;
  document.getElementById('menuView').style.display = 'none';
  document.getElementById('exerciseView').classList.add('active');
  document.getElementById('pauseBtn').textContent = '⏸️';
  document.getElementById('exTitle').textContent = TITLES[type] || type;
  document.getElementById('settingsPanel').classList.remove('show');
  document.getElementById('speedIndicator').style.display = '';

  // Remove leftover overlays
  document.querySelectorAll('.countdown-overlay, .completion-screen, .guided-display, #schulteDisplay, #rsvpDisplay, #tachyDisplay, #eyeHopDisplay').forEach(e => e.remove());

  if (GUIDED_TYPES.includes(type)) {
    document.getElementById('settingsBtn').style.display = 'none';
    document.getElementById('pauseBtn').style.display = 'none';
    document.getElementById('speedIndicator').style.display = 'none';
    canvas.style.display = 'none';
    document.getElementById('timerDisplay').textContent = '';
    document.getElementById('progressBar').style.width = '0';
    if (type === 'nearFar') startNearFar();
    else if (type === 'rule202020') start202020();
    else if (type === 'blinkTraining') startBlinkTraining();
    else if (type === 'eyeRelaxation') startEyeRelaxation();
    return;
  }

  if (DOM_EXERCISE_TYPES.includes(type)) {
    document.getElementById('settingsBtn').style.display = 'none';
    document.getElementById('pauseBtn').style.display = 'none';
    document.getElementById('timerDisplay').textContent = '';
    document.getElementById('progressBar').style.width = '0';
    startCountdown(() => {
      if (type === 'schulteTable') initSchulte();
      else if (type === 'rsvp') initRSVP();
      else if (type === 'tachistoscope') initTachistoscope();
      else if (type === 'eyeHop') initEyeHop();
    });
    return;
  }

  document.getElementById('settingsBtn').style.display = '';
  document.getElementById('pauseBtn').style.display = '';
  canvas.style.display = '';

  resizeCanvas();
  startCountdown(() => {
    state.running = true;
    state.lastTime = performance.now();
    if (type === 'saccade') initSaccade();
    if (type === 'dynamicAcuity') initDynamicAcuity();
    if (type === 'speedReading') initSpeedReading();
    if (type === 'visualSpan') initVisualSpan();
    if (type === 'peripheralDetection') initPeripheralDetection();
    if (type === 'zigzagTracking') initZigzag();
    if (type === 'bouncingBall') initBouncingBall();
    if (type === 'mot') initMOT();
    if (type === 'spiralPursuit') initSpiralPursuit();
    if (type === 'reactionFlash') initReactionFlash();
    if (type === 'colorTrail') initColorTrail();
    animate();
  });
}

function goBack() {
  state.running = false;
  state.paused = false;
  if (state.animId) cancelAnimationFrame(state.animId);
  if (state.ruleInterval) { clearInterval(state.ruleInterval); state.ruleInterval = null; }
  if (state.guidedInterval) { clearInterval(state.guidedInterval); state.guidedInterval = null; }
  document.querySelectorAll('.countdown-overlay, .completion-screen, .guided-display, #schulteDisplay, #rsvpDisplay, #tachyDisplay, #eyeHopDisplay').forEach(e => e.remove());
  document.getElementById('exerciseView').classList.remove('active');
  document.getElementById('menuView').style.display = '';
  document.getElementById('timerDisplay').textContent = '';
  document.getElementById('progressBar').style.width = '0';
  canvas.style.display = '';
}

// ============= Difficulty =============
function setDifficulty(level) {
  state.difficulty = level;
  document.querySelectorAll('.diff-btn').forEach(b => {
    b.classList.toggle('active', parseInt(b.dataset.diff) === level);
  });
}

// ============= Settings =============
function toggleSettings() { document.getElementById('settingsPanel').classList.toggle('show'); }
function updateSpeed(v) { state.speed = parseFloat(v); document.getElementById('speedValue').textContent = v + 'x'; }
function updateDuration(v) { state.duration = parseInt(v); }
function updateDotSize(v) { state.dotSize = parseInt(v); }
function togglePause() {
  if (!state.running) return;
  state.paused = !state.paused;
  document.getElementById('pauseBtn').textContent = state.paused ? '▶️' : '⏸️';
  if (!state.paused) { state.lastTime = performance.now(); animate(); }
}

// ============= Countdown =============
function startCountdown(callback) {
  let count = 3;
  const ov = document.createElement('div');
  ov.className = 'countdown-overlay';
  ov.innerHTML = `<div class="count">${count}</div><div class="count-label">곧 시작합니다</div>`;
  document.getElementById('exerciseView').appendChild(ov);
  const iv = setInterval(() => {
    count--;
    if (count > 0) {
      ov.querySelector('.count').textContent = count;
      ov.querySelector('.count').style.animation = 'none';
      void ov.querySelector('.count').offsetWidth;
      ov.querySelector('.count').style.animation = 'countPulse 1s ease-in-out';
    } else { clearInterval(iv); ov.remove(); callback(); }
  }, 1000);
}

// ============= Completion =============
function showCompletion(extra = '') {
  state.running = false;
  if (state.animId) cancelAnimationFrame(state.animId);
  if (state.guidedInterval) { clearInterval(state.guidedInterval); state.guidedInterval = null; }
  const s = document.createElement('div');
  s.className = 'completion-screen';
  s.innerHTML = `
    <div class="check">✅</div>
    <h2>운동 완료!</h2>
    <p>수고하셨습니다</p>
    ${extra ? `<p style="margin-top:8px;color:var(--accent)">${extra}</p>` : ''}
    <button class="btn btn-primary" onclick="this.parentElement.remove(); goBack();" style="margin-top:20px;">메뉴로 돌아가기</button>
    <button class="btn btn-accent" onclick="this.parentElement.remove(); startExercise(state.currentExercise);" style="margin-top:8px;">다시 하기</button>
  `;
  document.getElementById('exerciseView').appendChild(s);
}

// ============= Animation Loop =============
function animate() {
  if (!state.running || state.paused) return;
  const now = performance.now();
  const dt = (now - state.lastTime) / 1000;
  state.lastTime = now;
  state.elapsed += dt;

  if (state.elapsed >= state.duration) {
    showCompletion();
    return;
  }

  const remain = Math.max(0, state.duration - state.elapsed);
  const mins = Math.floor(remain / 60), secs = Math.floor(remain % 60);
  document.getElementById('timerDisplay').textContent = `${mins}:${secs.toString().padStart(2,'0')}`;
  document.getElementById('progressBar').style.width = `${(state.elapsed/state.duration)*100}%`;
  document.getElementById('exInfo').textContent = `${Math.floor(state.elapsed)}s / ${state.duration}s`;

  // Speed indicator
  const progress = state.elapsed / state.duration;
  const curSpeed = getProgressiveSpeed();
  const speedPct = ((curSpeed / state.speed) - 0.5) / 1.3 * 100;
  document.getElementById('speedBarFill').style.width = `${Math.min(100, Math.max(0, speedPct))}%`;
  document.getElementById('currentSpeedLabel').textContent = `${curSpeed.toFixed(1)}x`;
  const pl = document.getElementById('phaseLabel');
  if (progress < 0.3) { pl.textContent = '워밍업'; pl.style.color = '#00d4aa'; }
  else if (progress < 0.7) { pl.textContent = '가속'; pl.style.color = '#ffd93d'; }
  else { pl.textContent = '쿨다운'; pl.style.color = '#6c63ff'; }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGuide();

  const fn = {
    smoothPursuit: drawSmoothPursuit, figure8: drawFigure8, saccade: drawSaccade,
    hPattern: drawHPattern, speedReading: drawSpeedReading, dynamicAcuity: drawDynamicAcuity,
    visualSpan: drawVisualSpan, peripheralDetection: drawPeripheralDetection,
    zigzagTracking: drawZigzag,
    bouncingBall: drawBouncingBall, mot: drawMOT,
    spiralPursuit: drawSpiralPursuit, reactionFlash: drawReactionFlash,
    colorTrail: drawColorTrail,
  };
  if (fn[state.currentExercise]) fn[state.currentExercise]();

  state.animId = requestAnimationFrame(animate);
}

// ============= Keyboard shortcuts =============
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const modal = document.querySelector('.info-modal-overlay');
    if (modal) { modal.remove(); return; }
    goBack();
  }
  if (e.key === ' ') {
    e.preventDefault();
    if (state.running) togglePause();
  }
});
