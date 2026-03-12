// Pencil Push-up — dot approaches and recedes, training convergence
function startPencilPushup() {
  const diff = getDiff('pencilPushup');
  const cycles = diff.cycles || 12;
  const nearSec = diff.nearSec || 4;
  const farSec = diff.farSec || 2;
  const cycleDur = nearSec + farSec;
  const totalDur = cycles * cycleDur;

  let elapsed = 0;
  const container = document.querySelector('.canvas-container');
  const display = document.createElement('div');
  display.className = 'guided-display';
  display.setAttribute('data-exercise-display', '');
  display.innerHTML = `
    <div class="guided-phase" id="ppPhase">가까이 오는 점에 초점을 맞추세요</div>
    <div id="ppDot" style="width:20px;height:20px;border-radius:50%;background:var(--accent);box-shadow:0 0 20px rgba(0,212,170,0.5);transition:all 0.3s ease;"></div>
    <div class="guided-timer" id="ppTimer">0:00</div>
    <div class="guided-instruction" id="ppInst">점이 다가오면 눈이 모이고, 멀어지면 풀립니다</div>
  `;
  container.appendChild(display);

  state.guidedInterval = setInterval(() => {
    elapsed += 0.05;
    const cyclePos = (elapsed % cycleDur);
    const dot = document.getElementById('ppDot');
    const phase = document.getElementById('ppPhase');

    if (cyclePos < nearSec) {
      // Approaching phase
      const frac = cyclePos / nearSec;
      const size = 20 + frac * 60;
      if (dot) {
        dot.style.width = size + 'px';
        dot.style.height = size + 'px';
        dot.style.boxShadow = `0 0 ${20 + frac * 40}px rgba(0,212,170,${0.3 + frac * 0.4})`;
      }
      if (phase) phase.textContent = '👀 가까이 — 초점을 맞추세요';
    } else {
      // Receding phase
      const frac = (cyclePos - nearSec) / farSec;
      const size = 80 - frac * 60;
      if (dot) {
        dot.style.width = size + 'px';
        dot.style.height = size + 'px';
        dot.style.boxShadow = `0 0 ${60 - frac * 40}px rgba(0,212,170,${0.7 - frac * 0.4})`;
      }
      if (phase) phase.textContent = '🔭 멀어짐 — 눈을 편하게';
    }

    const remain = Math.max(0, totalDur - elapsed);
    const mins = Math.floor(remain / 60), secs = Math.floor(remain % 60);
    const timerEl = document.getElementById('ppTimer');
    if (timerEl) timerEl.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
    document.getElementById('timerDisplay').textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
    document.getElementById('progressBar').style.width = `${(elapsed / totalDur) * 100}%`;

    const inst = document.getElementById('ppInst');
    if (inst) inst.textContent = `${Math.floor(elapsed / cycleDur) + 1} / ${cycles} 사이클`;

    if (elapsed >= totalDur) {
      clearInterval(state.guidedInterval);
      state.guidedInterval = null;
      display.remove();
      showCompletion(`${cycles}사이클 완료`);
    }
  }, 50);
}
