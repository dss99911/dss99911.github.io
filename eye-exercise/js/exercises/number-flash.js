// Number Flash — progressively longer number strings flashed briefly
let numFlashState = { digits: 2, phase: 'flash', timer: 0, current: '', correct: 0, total: 0, elapsed: 0, duration: 60 };

function initNumberFlash() {
  const diff = getDiff();
  numFlashState = {
    digits: 2,
    maxDigits: diff.maxDigits || 7,
    minFlash: diff.minFlash || 0.15,
    phase: 'flash',
    timer: 0,
    flashDur: 0.8,
    current: generateNumberString(2),
    correct: 0,
    total: 0,
    elapsed: 0,
    duration: state.duration,
    streak: 0,
  };

  canvas.style.display = 'none';
  document.getElementById('speedIndicator').style.display = 'none';

  const container = document.querySelector('.canvas-container');
  const display = document.createElement('div');
  display.className = 'tachy-display';
  display.id = 'numFlashDisplay';
  display.setAttribute('data-exercise-display', '');
  display.innerHTML = `
    <div class="tachy-info" id="nfInfo">숫자를 기억하세요</div>
    <div class="tachy-flash" id="nfFlash">${numFlashState.current}</div>
    <div class="tachy-info" id="nfLevel">${numFlashState.digits}자리</div>
  `;
  container.appendChild(display);

  if (state.guidedInterval) clearInterval(state.guidedInterval);
  state.guidedInterval = setInterval(updateNumberFlash, 16);
}

function generateNumberString(len) {
  let s = '';
  for (let i = 0; i < len; i++) s += Math.floor(Math.random() * 10);
  return s;
}

function updateNumberFlash() {
  const dt = 0.016;
  numFlashState.elapsed += dt;
  numFlashState.timer += dt;

  const flashEl = document.getElementById('nfFlash');
  const infoEl = document.getElementById('nfInfo');
  if (!flashEl) return;

  if (numFlashState.phase === 'flash') {
    if (numFlashState.timer >= numFlashState.flashDur) {
      numFlashState.timer = 0;
      numFlashState.phase = 'blank';
      flashEl.textContent = '?';
      infoEl.textContent = '뭐였을까요?';
    }
  } else if (numFlashState.phase === 'blank') {
    if (numFlashState.timer >= 1.5) {
      numFlashState.timer = 0;
      numFlashState.phase = 'answer';
      flashEl.textContent = numFlashState.current;
      flashEl.style.color = 'var(--accent)';
      infoEl.textContent = '정답';
      numFlashState.total++;
    }
  } else if (numFlashState.phase === 'answer') {
    if (numFlashState.timer >= 1.0) {
      numFlashState.timer = 0;
      numFlashState.phase = 'flash';
      numFlashState.streak++;
      if (numFlashState.streak >= 3 && numFlashState.digits < numFlashState.maxDigits) {
        numFlashState.digits++;
        numFlashState.streak = 0;
        numFlashState.flashDur = Math.max(numFlashState.minFlash, numFlashState.flashDur * 0.85);
      }
      numFlashState.current = generateNumberString(numFlashState.digits);
      flashEl.textContent = numFlashState.current;
      flashEl.style.color = '';
      infoEl.textContent = '숫자를 기억하세요';
      document.getElementById('nfLevel').textContent = `${numFlashState.digits}자리 | 노출 ${numFlashState.flashDur.toFixed(2)}초`;
    }
  }

  const remain = Math.max(0, numFlashState.duration - numFlashState.elapsed);
  const mins = Math.floor(remain / 60), secs = Math.floor(remain % 60);
  document.getElementById('timerDisplay').textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
  document.getElementById('progressBar').style.width = `${(numFlashState.elapsed / numFlashState.duration) * 100}%`;

  if (numFlashState.elapsed >= numFlashState.duration) {
    clearInterval(state.guidedInterval);
    state.guidedInterval = null;
    document.getElementById('numFlashDisplay')?.remove();
    showCompletion(`최대 ${numFlashState.digits}자리 달성`);
  }
}
