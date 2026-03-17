// ============= Exercise Types =============
const GUIDED_TYPES = ['nearFar', 'rule202020', 'blinkTraining', 'eyeRelaxation', 'pencilPushup', 'eyeYoga', 'darkAdaptation'];
const DOM_EXERCISE_TYPES = ['schulteTable', 'rsvp', 'tachistoscope', 'eyeHop', 'metronomeReading', 'numberFlash', 'columnReading', 'flankerTask', 'memoryFlash'];

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
  // New exercises
  clockTracking: 'Clock Tracking', diamondPattern: 'Diamond Pattern',
  vergenceRock: 'Vergence Rock', circularPursuit: 'Circular Pursuit',
  metronomeReading: 'Metronome Reading', numberFlash: 'Number Flash',
  columnReading: 'Column Reading',
  usefulFieldOfView: 'Useful Field of View', flankerTask: 'Flanker Task',
  crowdingResistance: 'Crowding Resistance', attentionWindow: 'Attention Window',
  memoryFlash: 'Memory Flash', antiSaccade: 'Anti-Saccade',
  visualSearch: 'Visual Search',
  pencilPushup: 'Pencil Push-up', eyeYoga: 'Eye Yoga',
  darkAdaptation: 'Dark Adaptation',
};

// ============= Category System =============
const CATEGORIES = [
  { id: 'basicTracking', name: '기본 추적 운동', icon: '👁️',
    exercises: ['smoothPursuit','figure8','saccade','hPattern','zigzagTracking','clockTracking','diamondPattern','vergenceRock','circularPursuit'] },
  { id: 'speedReading', name: '속독 & 시각 처리', icon: '📖',
    exercises: ['speedReading','rsvp','eyeHop','dynamicAcuity','tachistoscope','metronomeReading','numberFlash','columnReading'] },
  { id: 'visualSpan', name: '시폭 & 주변시야', icon: '🔍',
    exercises: ['schulteTable','visualSpan','peripheralDetection','usefulFieldOfView','flankerTask','crowdingResistance','attentionWindow'] },
  { id: 'funGame', name: '게임 & 재미', icon: '🎮',
    exercises: ['bouncingBall','mot','spiralPursuit','reactionFlash','colorTrail','memoryFlash','antiSaccade','visualSearch'] },
  { id: 'focusRecovery', name: '집중 & 회복', icon: '🧘',
    exercises: ['nearFar','rule202020','blinkTraining','eyeRelaxation','pencilPushup','eyeYoga','darkAdaptation'] },
];

const EXERCISE_META = {
  smoothPursuit: { icon: '🔵', desc: '움직이는 점을 눈으로 부드럽게 따라가며 안구 추적 능력을 향상시킵니다.', tag: '기본 운동' },
  figure8: { icon: '♾️', desc: '무한대(∞) 모양을 따라 눈을 움직여 모든 방향의 안구 근육을 골고루 운동합니다.', tag: '근육 강화' },
  saccade: { icon: '⚡', desc: '화면에 나타나는 점으로 빠르게 시선을 이동시켜 안구 반응 속도를 훈련합니다.', tag: '반응 속도' },
  hPattern: { icon: '🔷', desc: 'H자 패턴을 따라 상하좌우 및 대각선으로 눈을 움직여 6개 안구 근육을 모두 운동합니다.', tag: '전방위 운동' },
  zigzagTracking: { icon: '〰️', desc: '대각선+수평이 결합된 지그재그 패턴으로 복합적인 근육 협응을 훈련합니다.', tag: '복합 운동' },
  clockTracking: { icon: '🕐', desc: '시계 12포지션을 순서대로 따라가며 정밀한 정지-이동 추적을 훈련합니다.', tag: '정밀 추적' },
  diamondPattern: { icon: '💎', desc: '다이아몬드 경로의 네 꼭짓점을 따라 대각선 전환 능력을 강화합니다.', tag: '대각선 훈련' },
  vergenceRock: { icon: '🔀', desc: '두 점이 수렴/발산하며 폭주·개산 근육의 유연성을 훈련합니다.', tag: '폭주/개산' },
  circularPursuit: { icon: '🔄', desc: '확대·축소 원형과 방향 전환으로 전방위 추적 능력을 강화합니다.', tag: '원형 추적' },
  speedReading: { icon: '📖', desc: '좌→우 시선 이동과 주변 시야 확장을 훈련하여 읽기 속도를 향상시킵니다.', tag: '속독 훈련' },
  rsvp: { icon: '⚡', desc: '화면 중앙에 단어를 빠르게 표시하여 눈 이동 없이 읽기 속도를 극대화합니다.', tag: '속독 핵심' },
  eyeHop: { icon: '👀', desc: '2열 텍스트를 좌→우로 홉하며 읽어 단어 그룹 단위 인식 습관을 형성합니다.', tag: '청킹 훈련' },
  dynamicAcuity: { icon: '🎯', desc: '빠르게 움직이는 글자를 추적하며 읽어 동체시력과 순간 인지력을 강화합니다.', tag: '동체시력' },
  tachistoscope: { icon: '📸', desc: '극히 짧은 시간 번쩍이는 단어/숫자를 인식하여 순간 인지력을 극한까지 훈련합니다.', tag: '순간 인지' },
  metronomeReading: { icon: '🎵', desc: '메트로놈 바가 텍스트 위를 일정 속도로 지나가며 읽기 페이스를 조절합니다.', tag: '읽기 페이싱' },
  numberFlash: { icon: '🔢', desc: '점점 길어지는 숫자열을 순간적으로 노출하여 시각 단기 기억을 훈련합니다.', tag: '숫자 기억' },
  columnReading: { icon: '📄', desc: '좁은 컬럼에서 시작하여 점점 넓히며 수직 시선 이동 읽기를 훈련합니다.', tag: '컬럼 읽기' },
  schulteTable: { icon: '🔢', desc: '격자에서 숫자를 순서대로 찾으며 주변시야와 시각 탐색 능력을 훈련합니다.', tag: '시폭 훈련' },
  visualSpan: { icon: '🔍', desc: '중앙 고정점에 시선을 고정한 채 주변부 글자를 인식하여 시폭을 확장합니다.', tag: '시폭 훈련' },
  peripheralDetection: { icon: '👁️', desc: '중앙에 시선을 고정하고 시야 가장자리의 자극을 감지하는 훈련입니다.', tag: '주변시야' },
  usefulFieldOfView: { icon: '🌐', desc: '중심 과제와 주변 과제를 동시에 수행하여 유효 시야를 확장합니다.', tag: '유효 시야' },
  flankerTask: { icon: '➡️', desc: '방해 자극 사이에서 중앙 화살표 방향을 판별하여 선택적 주의력을 훈련합니다.', tag: '선택 주의' },
  crowdingResistance: { icon: '🔤', desc: '밀집된 글자 중 타겟을 식별하여 시각 혼잡 저항력을 강화합니다.', tag: '혼잡 저항' },
  attentionWindow: { icon: '🪟', desc: '중앙에서 점차 확장되는 주의 창 안의 글자를 인식하여 시폭을 넓힙니다.', tag: '주의 창' },
  bouncingBall: { icon: '🏀', desc: '물리 법칙으로 튀어다니는 공들 중 빛나는 공을 눈으로 추적합니다.', tag: '추적 게임' },
  mot: { icon: '🎯', desc: '표시된 타겟들을 기억한 후, 움직이는 점들 사이에서 계속 추적합니다.', tag: '스포츠 비전' },
  spiralPursuit: { icon: '🌀', desc: '나선형으로 확장/수축하는 점을 따라가며 전방위 안구 근육을 훈련합니다.', tag: '나선 운동' },
  reactionFlash: { icon: '💥', desc: '화면 곳곳에 번쩍이는 다양한 도형을 빠르게 포착하여 시각 반응력을 키웁니다.', tag: '반응 훈련' },
  colorTrail: { icon: '🎨', desc: '여러 색상의 점들 중 지정된 색상의 점만 선택적으로 추적합니다.', tag: '선택 주의' },
  memoryFlash: { icon: '🧠', desc: '격자에서 번쩍이는 셀을 기억한 후 정확히 터치하여 시각 작업 기억을 훈련합니다.', tag: '기억 게임' },
  antiSaccade: { icon: '🔃', desc: '신호 반대편을 바라보는 훈련으로 반사적 시선 이동 억제력을 강화합니다.', tag: '억제 훈련' },
  visualSearch: { icon: '🔎', desc: '방해물 사이에서 타겟 도형을 빠르게 찾아 시각 탐색 효율을 높입니다.', tag: '탐색 게임' },
  nearFar: { icon: '🔭', desc: '화면(가까이)과 먼 곳을 번갈아 보며 초점 조절 근육을 강화합니다.', tag: '초점 조절' },
  rule202020: { icon: '⏱️', desc: '20분마다 20피트(6m) 떨어진 곳을 20초간 바라보며 눈의 피로를 예방합니다.', tag: '피로 예방' },
  blinkTraining: { icon: '😌', desc: '규칙적인 깜빡임 리듬을 훈련하여 안구 건조증을 예방합니다.', tag: '건조증 예방' },
  eyeRelaxation: { icon: '🧘', desc: '팔밍과 복식호흡을 결합하여 눈의 피로를 즉각적으로 완화합니다.', tag: '이완 운동' },
  pencilPushup: { icon: '✏️', desc: '점이 가까워졌다 멀어지며 수렴/발산 근육의 유연성을 회복합니다.', tag: '수렴 운동' },
  eyeYoga: { icon: '🧘‍♂️', desc: '8방향 순차 시선 이동으로 모든 안구 근육을 스트레칭합니다.', tag: '스트레칭' },
  darkAdaptation: { icon: '🌙', desc: '화면을 점진적으로 암전하여 망막 휴식과 암순응을 유도합니다.', tag: '암순응 휴식' },
};

function renderMenu() {
  const menuEl = document.getElementById('categoryMenu');
  menuEl.innerHTML = CATEGORIES.map(cat => `
    <div class="category-section" data-category="${cat.id}">
      <div class="category-header" onclick="toggleCategory('${cat.id}')">
        <div class="category-header-left">
          <span class="category-icon">${cat.icon}</span>
          <h2 class="category-name">${cat.name}</h2>
          <span class="category-count">${cat.exercises.length}</span>
        </div>
        <span class="category-toggle">▼</span>
      </div>
      <div class="category-exercises">
        ${cat.exercises.map(ex => {
          const m = EXERCISE_META[ex] || {};
          return `<div class="menu-card" onclick="startExercise('${ex}')">
            <button class="info-btn" onclick="event.stopPropagation(); showInfo('${ex}')">?</button>
            <div class="icon">${m.icon || '🔵'}</div>
            <h3>${TITLES[ex] || ex}</h3>
            <p>${m.desc || ''}</p>
            <span class="tag">${m.tag || ''}</span>
          </div>`;
        }).join('')}
      </div>
    </div>
  `).join('');
  loadCategoryState();
}

function toggleCategory(categoryId) {
  const section = document.querySelector(`[data-category="${categoryId}"]`);
  section.classList.toggle('expanded');
  saveCategoryState();
}

function saveCategoryState() {
  const expanded = [];
  document.querySelectorAll('.category-section.expanded').forEach(s => expanded.push(s.dataset.category));
  localStorage.setItem('eyeExCategoryState', JSON.stringify(expanded));
}

function loadCategoryState() {
  const saved = localStorage.getItem('eyeExCategoryState');
  if (saved) {
    JSON.parse(saved).forEach(id => {
      document.querySelector(`[data-category="${id}"]`)?.classList.add('expanded');
    });
  } else {
    document.querySelectorAll('.category-section').forEach(s => s.classList.add('expanded'));
  }
}

// Initialize menu on load
renderMenu();

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

  // Cleanup previous exercise
  if (state.animId) { cancelAnimationFrame(state.animId); state.animId = null; }
  if (state.guidedInterval) { clearInterval(state.guidedInterval); state.guidedInterval = null; }
  state.running = false;
  document.querySelectorAll('.countdown-overlay, .completion-screen, .guided-display, .rsvp-display, .tachy-display, [data-exercise-display]').forEach(e => e.remove());

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
    else if (type === 'pencilPushup') startPencilPushup();
    else if (type === 'eyeYoga') startEyeYoga();
    else if (type === 'darkAdaptation') startDarkAdaptation();
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
      else if (type === 'metronomeReading') initMetronomeReading();
      else if (type === 'numberFlash') initNumberFlash();
      else if (type === 'columnReading') initColumnReading();
      else if (type === 'flankerTask') initFlankerTask();
      else if (type === 'memoryFlash') initMemoryFlash();
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
    if (type === 'clockTracking') initClockTracking();
    if (type === 'diamondPattern') initDiamondPattern();
    if (type === 'vergenceRock') initVergenceRock();
    if (type === 'circularPursuit') initCircularPursuit();
    if (type === 'usefulFieldOfView') initUsefulFieldOfView();
    if (type === 'crowdingResistance') initCrowdingResistance();
    if (type === 'attentionWindow') initAttentionWindow();
    if (type === 'antiSaccade') initAntiSaccade();
    if (type === 'visualSearch') initVisualSearch();
    animate();
  });
}

function goBack() {
  state.running = false;
  state.paused = false;
  if (state.animId) cancelAnimationFrame(state.animId);
  if (state.ruleInterval) { clearInterval(state.ruleInterval); state.ruleInterval = null; }
  if (state.guidedInterval) { clearInterval(state.guidedInterval); state.guidedInterval = null; }
  // Cleanup event listeners from interactive exercises
  if (typeof vsearchState !== 'undefined' && vsearchState.handler) { canvas.removeEventListener('click', vsearchState.handler); vsearchState.handler = null; }
  if (typeof flankerState !== 'undefined' && flankerState.handler) { document.removeEventListener('keydown', flankerState.handler); flankerState.handler = null; }
  document.querySelectorAll('.countdown-overlay, .completion-screen, .guided-display, [data-exercise-display]').forEach(e => e.remove());
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

// ============= Countdown (disabled — start immediately) =============
function startCountdown(callback) {
  callback();
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
    clockTracking: drawClockTracking, diamondPattern: drawDiamondPattern,
    vergenceRock: drawVergenceRock, circularPursuit: drawCircularPursuit,
    usefulFieldOfView: drawUsefulFieldOfView, crowdingResistance: drawCrowdingResistance,
    attentionWindow: drawAttentionWindow, antiSaccade: drawAntiSaccade,
    visualSearch: drawVisualSearch,
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
