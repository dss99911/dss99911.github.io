// Metronome Reading — pacing bar sweeps across text lines
let metronomeState = { lines: [], currentLine: 0, barX: 0, elapsed: 0, duration: 60 };

const METRONOME_TEXTS = [
  '눈 운동은 규칙적으로 하면 시력 보호에 큰 도움이 됩니다.',
  '속독의 핵심은 한 번의 고정으로 더 넓은 범위를 인식하는 것입니다.',
  '주변 시야를 활용하면 읽기 속도가 크게 향상될 수 있습니다.',
  '화면을 오래 볼 때는 규칙적인 휴식이 매우 중요합니다.',
  '시선 고정 횟수를 줄이면 자연스럽게 읽기 속도가 올라갑니다.',
  '메트로놈 리딩은 눈의 회귀 현상을 줄여주는 효과가 있습니다.',
  '매일 꾸준한 훈련이 눈 건강의 기본이라는 것을 기억하세요.',
  '디지털 환경에서 눈 피로를 예방하는 것은 매우 중요합니다.',
  '눈 근육도 몸의 근육처럼 훈련하면 더 강해질 수 있습니다.',
  '집중력 향상은 효율적인 시선 이동 습관에서 시작됩니다.',
  '좋은 조명 환경은 눈 건강을 지키는 첫 번째 단계입니다.',
  '시각 정보 처리 속도는 훈련을 통해 향상시킬 수 있습니다.',
];

function initMetronomeReading() {
  const diff = getDiff();
  const shuffled = [...METRONOME_TEXTS].sort(() => Math.random() - 0.5);
  const repeated = [];
  while (repeated.length < 50) repeated.push(...shuffled);

  metronomeState = {
    lines: repeated,
    currentLine: 0,
    activeLine: 0,  // which visible line the bar is on (0-based within visible)
    barX: 0,
    elapsed: 0,
    duration: state.duration,
    baseLPM: diff.baseLPM || 40,
    visibleLines: diff.lines || 4,
  };

  canvas.style.display = 'none';
  document.getElementById('speedIndicator').style.display = 'none';

  const container = document.querySelector('.canvas-container');
  const display = document.createElement('div');
  display.className = 'guided-display';
  display.id = 'metronomeDisplay';
  display.setAttribute('data-exercise-display', '');
  display.style.padding = '20px';
  display.style.justifyContent = 'flex-start';
  display.style.paddingTop = '60px';

  const wrapper = document.createElement('div');
  wrapper.id = 'metronomeLines';
  wrapper.style.cssText = 'width:90%;max-width:700px;position:relative;';
  display.appendChild(wrapper);

  container.appendChild(display);
  renderMetronomeLines();

  if (state.guidedInterval) clearInterval(state.guidedInterval);
  state.guidedInterval = setInterval(updateMetronome, 16);
}

function renderMetronomeLines() {
  const wrapper = document.getElementById('metronomeLines');
  if (!wrapper) return;
  wrapper.innerHTML = '';

  for (let i = 0; i < metronomeState.visibleLines; i++) {
    const lineIdx = metronomeState.currentLine + i;
    if (lineIdx >= metronomeState.lines.length) break;
    const lineEl = document.createElement('div');
    lineEl.setAttribute('data-line-idx', i);
    lineEl.style.cssText = 'padding:12px 0;font-size:1.05rem;line-height:1.8;color:var(--text-dim);position:relative;border-bottom:1px solid rgba(255,255,255,0.04);';
    if (i === metronomeState.activeLine) {
      lineEl.style.color = 'var(--text)';
      const bar = document.createElement('div');
      bar.id = 'metronomeBar';
      bar.style.cssText = 'position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--accent);border-radius:2px;transition:left 0.05s linear;box-shadow:0 0 8px rgba(0,212,170,0.5);';
      lineEl.appendChild(bar);
    }
    lineEl.appendChild(document.createTextNode(metronomeState.lines[lineIdx]));
    wrapper.appendChild(lineEl);
  }
}

function updateMetronome() {
  const dt = 0.016;
  metronomeState.elapsed += dt;

  const progress = metronomeState.elapsed / metronomeState.duration;
  const lpm = metronomeState.baseLPM * (1 + progress * 1.5);
  const sweepDuration = 60 / lpm;

  metronomeState.barX += dt / sweepDuration;
  if (metronomeState.barX >= 1) {
    metronomeState.barX = 0;
    metronomeState.activeLine++;
    if (metronomeState.activeLine >= metronomeState.visibleLines) {
      metronomeState.activeLine = 0;
      metronomeState.currentLine += metronomeState.visibleLines;
    }
    renderMetronomeLines();
  }

  const bar = document.getElementById('metronomeBar');
  if (bar) bar.style.left = (metronomeState.barX * 100) + '%';

  const remain = Math.max(0, metronomeState.duration - metronomeState.elapsed);
  const mins = Math.floor(remain / 60), secs = Math.floor(remain % 60);
  document.getElementById('timerDisplay').textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
  document.getElementById('progressBar').style.width = `${(metronomeState.elapsed / metronomeState.duration) * 100}%`;

  if (metronomeState.elapsed >= metronomeState.duration) {
    clearInterval(state.guidedInterval);
    state.guidedInterval = null;
    document.getElementById('metronomeDisplay')?.remove();
    showCompletion(`${metronomeState.currentLine}줄 완료`);
  }
}
