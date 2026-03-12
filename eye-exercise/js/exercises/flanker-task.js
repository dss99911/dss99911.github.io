// Flanker Task — identify central arrow direction among distractors
let flankerState = { arrows: '', correct: '', timer: 0, phase: 'show', score: 0, total: 0, elapsed: 0, duration: 60, handler: null };

function initFlankerTask() {
  const diff = getDiff();
  flankerState = {
    arrows: '',
    correct: '',
    timer: 0,
    phase: 'show',
    score: 0,
    total: 0,
    elapsed: 0,
    duration: state.duration,
    spacing: diff.spacing || 40,
    congruentRatio: diff.congruentRatio || 0.5,
  };

  canvas.style.display = 'none';
  document.getElementById('speedIndicator').style.display = 'none';

  const container = document.querySelector('.canvas-container');
  const display = document.createElement('div');
  display.className = 'guided-display';
  display.id = 'flankerDisplay';
  display.setAttribute('data-exercise-display', '');
  display.innerHTML = `
    <div style="color:var(--text-dim);font-size:0.9rem;" id="flankerInfo">중앙 화살표 방향을 판별하세요</div>
    <div id="flankerArrows" style="font-size:3rem;font-weight:700;letter-spacing:${flankerState.spacing}px;min-height:60px;display:flex;align-items:center;justify-content:center;"></div>
    <div style="display:flex;gap:20px;margin-top:20px;">
      <button class="btn btn-primary" onclick="flankerRespond('left')" style="font-size:1.5rem;padding:12px 30px;">← 왼쪽</button>
      <button class="btn btn-accent" onclick="flankerRespond('right')" style="font-size:1.5rem;padding:12px 30px;">오른쪽 →</button>
    </div>
    <div id="flankerScore" style="color:var(--accent);font-size:1rem;margin-top:12px;">0 / 0</div>
  `;
  container.appendChild(display);

  flankerState.handler = (e) => {
    if (e.key === 'ArrowLeft') flankerRespond('left');
    else if (e.key === 'ArrowRight') flankerRespond('right');
  };
  document.addEventListener('keydown', flankerState.handler);

  setupFlankerRound();
  if (state.guidedInterval) clearInterval(state.guidedInterval);
  state.guidedInterval = setInterval(updateFlanker, 16);
}

function setupFlankerRound() {
  const center = Math.random() > 0.5 ? '→' : '←';
  const congruent = Math.random() < flankerState.congruentRatio;
  const flanker = congruent ? center : (center === '→' ? '←' : '→');
  flankerState.arrows = flanker + flanker + center + flanker + flanker;
  flankerState.correct = center === '→' ? 'right' : 'left';
  flankerState.phase = 'show';
  flankerState.timer = 0;

  const el = document.getElementById('flankerArrows');
  if (el) {
    el.innerHTML = flankerState.arrows.split('').map((a, i) =>
      `<span style="color:${i === 2 ? 'var(--accent)' : 'var(--text-dim)'}">${a}</span>`
    ).join('');
  }
}

function flankerRespond(dir) {
  if (flankerState.phase !== 'show') return;
  flankerState.total++;
  if (dir === flankerState.correct) flankerState.score++;
  document.getElementById('flankerScore').textContent = `${flankerState.score} / ${flankerState.total}`;

  const el = document.getElementById('flankerArrows');
  if (el) el.style.color = dir === flankerState.correct ? 'var(--accent)' : 'var(--danger)';

  flankerState.phase = 'feedback';
  flankerState.timer = 0;
}

function updateFlanker() {
  const dt = 0.016;
  flankerState.elapsed += dt;
  flankerState.timer += dt;

  if (flankerState.phase === 'feedback' && flankerState.timer >= 0.5) {
    setupFlankerRound();
  }

  const remain = Math.max(0, flankerState.duration - flankerState.elapsed);
  const mins = Math.floor(remain / 60), secs = Math.floor(remain % 60);
  document.getElementById('timerDisplay').textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
  document.getElementById('progressBar').style.width = `${(flankerState.elapsed / flankerState.duration) * 100}%`;

  if (flankerState.elapsed >= flankerState.duration) {
    clearInterval(state.guidedInterval);
    state.guidedInterval = null;
    if (flankerState.handler) document.removeEventListener('keydown', flankerState.handler);
    document.getElementById('flankerDisplay')?.remove();
    const pct = flankerState.total > 0 ? Math.round(flankerState.score / flankerState.total * 100) : 0;
    showCompletion(`정확도 ${pct}% (${flankerState.score}/${flankerState.total})`);
  }
}
