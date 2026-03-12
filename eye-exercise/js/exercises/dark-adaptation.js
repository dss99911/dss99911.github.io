// Dark Adaptation — progressive screen dimming for eye rest
function startDarkAdaptation() {
  const diff = getDiff('darkAdaptation');
  const totalDur = diff.duration || 120;
  let elapsed = 0;

  const container = document.querySelector('.canvas-container');
  const display = document.createElement('div');
  display.className = 'guided-display';
  display.setAttribute('data-exercise-display', '');
  display.style.transition = 'background 2s ease';
  display.innerHTML = `
    <div class="guided-phase" id="daPhase">화면이 점차 어두워집니다</div>
    <div class="guided-timer" id="daTimer">0:00</div>
    <div class="guided-instruction" id="daInst">눈을 편하게 두고 호흡에 집중하세요</div>
    <div id="daMoon" style="font-size:4rem;opacity:0;transition:opacity 3s ease;">🌙</div>
  `;
  container.appendChild(display);

  // Also dim the exercise view background
  const exView = document.getElementById('exerciseView');
  const origBg = exView.style.background;

  state.guidedInterval = setInterval(() => {
    elapsed += 0.05;
    const progress = elapsed / totalDur;
    const phase = document.getElementById('daPhase');
    const inst = document.getElementById('daInst');
    const moon = document.getElementById('daMoon');

    if (progress < 0.3) {
      // Dimming phase
      const dimLevel = progress / 0.3;
      display.style.background = `rgba(0,0,0,${dimLevel * 0.9})`;
      if (phase) {
        phase.textContent = '🌆 점차 어두워지는 중...';
        phase.style.opacity = 1 - dimLevel * 0.5;
      }
      if (inst) inst.style.opacity = 1 - dimLevel * 0.3;
    } else if (progress < 0.7) {
      // Full dark phase
      display.style.background = 'rgba(0,0,0,0.95)';
      if (phase) {
        phase.textContent = '🌙 암순응 중 — 눈을 감아도 됩니다';
        phase.style.opacity = 0.3;
        phase.style.color = '#334';
      }
      if (inst) {
        inst.textContent = '깊게 숨을 들이쉬고... 천천히 내쉬세요';
        inst.style.opacity = 0.2;
        inst.style.color = '#334';
      }
      if (moon) moon.style.opacity = 0.3;
    } else {
      // Brightening phase
      const brightLevel = (progress - 0.7) / 0.3;
      display.style.background = `rgba(0,0,0,${0.95 - brightLevel * 0.9})`;
      if (phase) {
        phase.textContent = '🌅 천천히 밝아지는 중...';
        phase.style.opacity = 0.3 + brightLevel * 0.7;
        phase.style.color = '';
      }
      if (inst) {
        inst.textContent = '천천히 눈을 떠서 화면에 적응하세요';
        inst.style.opacity = 0.2 + brightLevel * 0.8;
        inst.style.color = '';
      }
      if (moon) moon.style.opacity = 0.3 - brightLevel * 0.3;
    }

    const remain = Math.max(0, totalDur - elapsed);
    const mins = Math.floor(remain / 60), secs = Math.floor(remain % 60);
    const timerEl = document.getElementById('daTimer');
    if (timerEl) {
      timerEl.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
      timerEl.style.opacity = progress < 0.3 ? 1 - progress : (progress > 0.7 ? (progress - 0.7) / 0.3 : 0.15);
    }
    document.getElementById('timerDisplay').textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
    document.getElementById('progressBar').style.width = `${progress * 100}%`;

    if (elapsed >= totalDur) {
      clearInterval(state.guidedInterval);
      state.guidedInterval = null;
      display.style.background = '';
      display.remove();
      showCompletion('암순응 휴식 완료');
    }
  }, 50);
}
