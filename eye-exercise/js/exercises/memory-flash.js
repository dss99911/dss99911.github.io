// Memory Flash — grid lights up cells briefly, user taps them from memory
let memFlashState = { grid: [], targets: [], userPicks: [], phase: 'show', timer: 0, score: 0, total: 0, elapsed: 0, duration: 60, round: 0 };

function initMemoryFlash() {
  const diff = getDiff();
  memFlashState = {
    gridSize: diff.gridSize || 4,
    flashMs: diff.flashMs || 1000,
    targetCount: diff.cells || 5,
    grid: [],
    targets: [],
    userPicks: [],
    phase: 'show',
    timer: 0,
    score: 0,
    total: 0,
    elapsed: 0,
    duration: state.duration,
    round: 0,
  };

  canvas.style.display = 'none';
  document.getElementById('speedIndicator').style.display = 'none';

  const container = document.querySelector('.canvas-container');
  const display = document.createElement('div');
  display.className = 'guided-display';
  display.id = 'memFlashDisplay';
  display.setAttribute('data-exercise-display', '');

  const info = document.createElement('div');
  info.id = 'memFlashInfo';
  info.style.cssText = 'color:var(--text-dim);font-size:0.9rem;margin-bottom:12px;';
  info.textContent = '빛나는 셀을 기억하세요';
  display.appendChild(info);

  const grid = document.createElement('div');
  grid.id = 'memFlashGrid';
  grid.className = 'schulte-grid';
  grid.style.gridTemplateColumns = `repeat(${memFlashState.gridSize}, 1fr)`;
  grid.style.width = `min(80vw, ${memFlashState.gridSize * 70}px)`;
  display.appendChild(grid);

  const scoreEl = document.createElement('div');
  scoreEl.id = 'memFlashScore';
  scoreEl.style.cssText = 'color:var(--accent);font-size:1rem;margin-top:12px;';
  scoreEl.textContent = '0점';
  display.appendChild(scoreEl);

  container.appendChild(display);
  setupMemFlashRound();

  if (state.guidedInterval) clearInterval(state.guidedInterval);
  state.guidedInterval = setInterval(updateMemFlash, 16);
}

function setupMemFlashRound() {
  const gs = memFlashState.gridSize;
  const totalCells = gs * gs;
  memFlashState.targets = [];
  const indices = Array.from({ length: totalCells }, (_, i) => i).sort(() => Math.random() - 0.5);
  memFlashState.targets = indices.slice(0, memFlashState.targetCount);
  memFlashState.userPicks = [];
  memFlashState.phase = 'show';
  memFlashState.timer = 0;
  renderMemFlashGrid();
}

function renderMemFlashGrid() {
  const grid = document.getElementById('memFlashGrid');
  if (!grid) return;
  grid.innerHTML = '';
  const gs = memFlashState.gridSize;
  for (let i = 0; i < gs * gs; i++) {
    const cell = document.createElement('div');
    cell.className = 'schulte-cell';
    cell.style.fontSize = '0';
    const isTarget = memFlashState.targets.includes(i);
    const isPicked = memFlashState.userPicks.includes(i);

    if (memFlashState.phase === 'show' && isTarget) {
      cell.style.background = 'rgba(0,212,170,0.3)';
      cell.style.borderColor = 'var(--accent)';
    } else if (memFlashState.phase === 'result') {
      if (isTarget && isPicked) {
        cell.style.background = 'rgba(0,212,170,0.3)';
        cell.style.borderColor = 'var(--accent)';
      } else if (isTarget && !isPicked) {
        cell.style.background = 'rgba(255,107,107,0.2)';
        cell.style.borderColor = 'var(--danger)';
      } else if (isPicked && !isTarget) {
        cell.style.background = 'rgba(255,107,107,0.1)';
        cell.style.borderColor = 'var(--danger)';
      }
    } else if (memFlashState.phase === 'input' && isPicked) {
      cell.style.background = 'rgba(108,99,255,0.2)';
      cell.style.borderColor = 'var(--primary)';
    }

    if (memFlashState.phase === 'input') {
      cell.onclick = () => memFlashCellClick(i);
    }
    grid.appendChild(cell);
  }
}

function memFlashCellClick(idx) {
  if (memFlashState.phase !== 'input') return;
  if (memFlashState.userPicks.includes(idx)) {
    memFlashState.userPicks = memFlashState.userPicks.filter(i => i !== idx);
  } else {
    memFlashState.userPicks.push(idx);
  }
  renderMemFlashGrid();

  if (memFlashState.userPicks.length >= memFlashState.targetCount) {
    memFlashState.phase = 'result';
    memFlashState.timer = 0;
    const correct = memFlashState.userPicks.filter(i => memFlashState.targets.includes(i)).length;
    memFlashState.score += correct;
    memFlashState.total += memFlashState.targetCount;
    document.getElementById('memFlashScore').textContent = `${memFlashState.score}점`;
    renderMemFlashGrid();
  }
}

function updateMemFlash() {
  const dt = 0.016;
  memFlashState.elapsed += dt;
  memFlashState.timer += dt;

  if (memFlashState.phase === 'show' && memFlashState.timer >= memFlashState.flashMs / 1000) {
    memFlashState.phase = 'input';
    memFlashState.timer = 0;
    document.getElementById('memFlashInfo').textContent = '기억한 셀을 터치하세요';
    renderMemFlashGrid();
  } else if (memFlashState.phase === 'result' && memFlashState.timer >= 1.2) {
    memFlashState.round++;
    setupMemFlashRound();
    document.getElementById('memFlashInfo').textContent = '빛나는 셀을 기억하세요';
  }

  const remain = Math.max(0, memFlashState.duration - memFlashState.elapsed);
  const mins = Math.floor(remain / 60), secs = Math.floor(remain % 60);
  document.getElementById('timerDisplay').textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
  document.getElementById('progressBar').style.width = `${(memFlashState.elapsed / memFlashState.duration) * 100}%`;

  if (memFlashState.elapsed >= memFlashState.duration) {
    clearInterval(state.guidedInterval);
    state.guidedInterval = null;
    document.getElementById('memFlashDisplay')?.remove();
    const pct = memFlashState.total > 0 ? Math.round(memFlashState.score / memFlashState.total * 100) : 0;
    showCompletion(`정확도 ${pct}% (${memFlashState.round}라운드)`);
  }
}
