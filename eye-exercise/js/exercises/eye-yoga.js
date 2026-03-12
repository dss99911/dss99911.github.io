// Eye Yoga — 8-direction sequential eye stretching
function startEyeYoga() {
  const diff = getDiff('eyeYoga');
  const holdSec = diff.holdSec || 3;
  const cycles = diff.cycles || 3;

  const directions = [
    { name: '위', emoji: '⬆️', x: 50, y: 10 },
    { name: '오른쪽 위', emoji: '↗️', x: 85, y: 10 },
    { name: '오른쪽', emoji: '➡️', x: 90, y: 50 },
    { name: '오른쪽 아래', emoji: '↘️', x: 85, y: 85 },
    { name: '아래', emoji: '⬇️', x: 50, y: 90 },
    { name: '왼쪽 아래', emoji: '↙️', x: 15, y: 85 },
    { name: '왼쪽', emoji: '⬅️', x: 10, y: 50 },
    { name: '왼쪽 위', emoji: '↖️', x: 15, y: 10 },
  ];

  const totalDur = directions.length * holdSec * cycles;
  let elapsed = 0;

  const container = document.querySelector('.canvas-container');
  const display = document.createElement('div');
  display.className = 'guided-display';
  display.setAttribute('data-exercise-display', '');
  display.style.position = 'relative';
  display.innerHTML = `
    <div class="guided-phase" id="eyPhase">시선을 방향에 따라 이동하세요</div>
    <div id="eyDot" style="position:absolute;width:30px;height:30px;border-radius:50%;background:var(--accent);box-shadow:0 0 30px rgba(0,212,170,0.5);transition:all ${holdSec * 0.3}s ease;"></div>
    <div class="guided-timer" id="eyTimer">0:00</div>
    <div id="eyDirection" style="font-size:3rem;"></div>
    <div class="guided-instruction" id="eyInst"></div>
  `;
  container.appendChild(display);

  state.guidedInterval = setInterval(() => {
    elapsed += 0.05;
    const dirIdx = Math.floor((elapsed / holdSec) % directions.length);
    const cycleNum = Math.floor(elapsed / (directions.length * holdSec));
    const dir = directions[dirIdx];
    const holdProgress = (elapsed % holdSec) / holdSec;

    const dot = document.getElementById('eyDot');
    if (dot) {
      dot.style.left = dir.x + '%';
      dot.style.top = dir.y + '%';
      dot.style.transform = 'translate(-50%, -50%)';
    }

    const phase = document.getElementById('eyPhase');
    if (phase) phase.textContent = `${dir.emoji} ${dir.name} 바라보기`;

    const dirEl = document.getElementById('eyDirection');
    if (dirEl) dirEl.textContent = dir.emoji;

    const inst = document.getElementById('eyInst');
    if (inst) inst.textContent = `사이클 ${cycleNum + 1}/${cycles} · ${dirIdx + 1}/8`;

    const remain = Math.max(0, totalDur - elapsed);
    const mins = Math.floor(remain / 60), secs = Math.floor(remain % 60);
    const timerEl = document.getElementById('eyTimer');
    if (timerEl) timerEl.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
    document.getElementById('timerDisplay').textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
    document.getElementById('progressBar').style.width = `${(elapsed / totalDur) * 100}%`;

    if (elapsed >= totalDur) {
      clearInterval(state.guidedInterval);
      state.guidedInterval = null;
      display.remove();
      showCompletion(`${cycles}사이클 완료`);
    }
  }, 50);
}
