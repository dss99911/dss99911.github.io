// Schulte Table — find numbers 1~25 in order, eyes fixed on center
let schulteState = { grid:[], size:5, nextNumber:1, found:[], startTime:0, elapsed:0, running:false };

function initSchulte() {
  const size = getDiff().gridSize || 5;
  const numbers = Array.from({length: size*size}, (_,i) => i+1);
  // Fisher-Yates shuffle
  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
  }
  schulteState = { grid: numbers, size, nextNumber: 1, found: [], startTime: Date.now(), elapsed: 0, running: true };

  // Hide canvas, show grid
  canvas.style.display = 'none';
  document.getElementById('speedIndicator').style.display = 'none';
  document.getElementById('timerDisplay').textContent = '';
  document.getElementById('progressBar').style.width = '0';

  const container = document.querySelector('.canvas-container');

  const wrapper = document.createElement('div');
  wrapper.className = 'guided-display';
  wrapper.id = 'schulteDisplay';
  wrapper.style.padding = '20px';

  const info = document.createElement('div');
  info.className = 'schulte-info';
  info.innerHTML = `<div>중앙에 시선을 고정하고 주변시로 숫자를 찾으세요</div><div class="schulte-next" id="schulteNext">다음: <strong>1</strong></div>`;
  wrapper.appendChild(info);

  const grid = document.createElement('div');
  grid.className = 'schulte-grid';
  grid.id = 'schulteGrid';
  grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  const gridPx = size <= 3 ? '240px' : size <= 5 ? '360px' : '450px';
  grid.style.width = gridPx;
  grid.style.height = gridPx;

  schulteState.grid.forEach((num, idx) => {
    const cell = document.createElement('div');
    cell.className = 'schulte-cell';
    cell.textContent = num;
    cell.dataset.num = num;
    cell.onclick = () => handleSchulteClick(num, cell);
    grid.appendChild(cell);
  });
  wrapper.appendChild(grid);

  const timerDiv = document.createElement('div');
  timerDiv.id = 'schulteTimer';
  timerDiv.style.cssText = 'margin-top:16px;font-size:1.2rem;color:var(--accent);font-variant-numeric:tabular-nums;';
  timerDiv.textContent = '0:00';
  wrapper.appendChild(timerDiv);

  container.appendChild(wrapper);

  // Update timer
  if (state.guidedInterval) clearInterval(state.guidedInterval);
  state.guidedInterval = setInterval(updateSchulteTimer, 100);
}

function updateSchulteTimer() {
  if (!schulteState.running) return;
  schulteState.elapsed = (Date.now() - schulteState.startTime) / 1000;
  const mins = Math.floor(schulteState.elapsed / 60);
  const secs = Math.floor(schulteState.elapsed % 60);
  const timerEl = document.getElementById('schulteTimer');
  if (timerEl) timerEl.textContent = `${mins}:${secs.toString().padStart(2,'0')}`;
}

function handleSchulteClick(num, cell) {
  if (!schulteState.running) return;
  if (num === schulteState.nextNumber) {
    cell.classList.add('found');
    schulteState.found.push(num);
    schulteState.nextNumber++;
    playBeep(800 + num * 20, 0.1);

    const nextEl = document.getElementById('schulteNext');
    if (schulteState.nextNumber > schulteState.size * schulteState.size) {
      // Complete!
      schulteState.running = false;
      clearInterval(state.guidedInterval);
      state.guidedInterval = null;
      const totalTime = ((Date.now() - schulteState.startTime) / 1000).toFixed(1);
      if (nextEl) nextEl.innerHTML = `<span style="color:var(--accent)">완료!</span>`;
      setTimeout(() => {
        document.getElementById('schulteDisplay')?.remove();
        showCompletion(`${schulteState.size}×${schulteState.size} 슐테 테이블 완료 | ${totalTime}초`);
      }, 800);
    } else {
      if (nextEl) nextEl.innerHTML = `다음: <strong>${schulteState.nextNumber}</strong>`;
    }
  } else {
    // Wrong number — brief red flash
    cell.style.borderColor = 'var(--danger)';
    cell.style.background = 'rgba(255,107,107,0.15)';
    setTimeout(() => {
      cell.style.borderColor = '';
      cell.style.background = '';
    }, 300);
  }
}
