// RSVP (Rapid Serial Visual Presentation) — speed reading training
let rsvpState = { words:[], wordIndex:0, wpm:250, timer:0, running:false, elapsed:0, duration:60 };

// Sample text for RSVP display (Korean)
const RSVP_TEXTS = [
  '빠른 독서는 눈의 움직임을 최소화하고 한 번에 더 많은 단어를 인식하는 것에서 시작됩니다 시선을 고정하는 횟수가 줄어들수록 읽기 속도가 빨라지며 이해력도 향상됩니다 핵심은 내면의 발성을 억제하고 시각적으로 정보를 처리하는 것입니다',
  '인간의 눈은 초당 수백 번의 사케이드를 수행하며 시각 정보를 수집합니다 뇌는 이 정보를 실시간으로 처리하여 세상을 이해합니다 눈 운동을 통해 이 과정을 더 효율적으로 만들 수 있습니다',
  '디지털 시대에 눈 건강은 매우 중요합니다 장시간 화면을 바라보면 눈 깜빡임이 줄어들고 안구 건조증이 발생할 수 있습니다 규칙적인 휴식과 눈 운동이 이를 예방하는 데 도움이 됩니다',
  '주변 시야는 운전이나 스포츠에서 매우 중요한 능력입니다 중심 시야에만 의존하면 주변의 위험을 감지하기 어렵습니다 시폭을 넓히는 훈련을 통해 한 눈에 파악할 수 있는 범위를 확장할 수 있습니다',
  '집중력과 시각적 주의력은 서로 밀접하게 연결되어 있습니다 눈이 효율적으로 정보를 수집하면 뇌의 인지 부담이 줄어들고 더 오래 집중할 수 있습니다 매일 짧은 눈 운동이 전체적인 생산성을 높여줍니다',
];

function initRSVP() {
  // Pick random text and split into words
  const text = RSVP_TEXTS[Math.floor(Math.random() * RSVP_TEXTS.length)];
  const words = text.split(/\s+/);
  // Repeat words to fill duration
  const repeatedWords = [];
  while (repeatedWords.length < 1000) {
    repeatedWords.push(...words);
  }

  rsvpState = {
    words: repeatedWords,
    wordIndex: 0,
    wpm: 250,
    timer: 0,
    running: true,
    elapsed: 0,
    duration: state.duration,
  };

  canvas.style.display = 'none';
  document.getElementById('speedIndicator').style.display = 'none';

  const container = document.querySelector('.canvas-container');
  const display = document.createElement('div');
  display.className = 'rsvp-display';
  display.id = 'rsvpDisplay';
  display.setAttribute('data-exercise-display', '');
  display.innerHTML = `
    <div class="rsvp-wpm" id="rsvpWpm">250 WPM</div>
    <div style="position:relative;width:100%;display:flex;align-items:center;justify-content:center;min-height:100px;">
      <div class="rsvp-fixation" style="top:0;"></div>
      <div class="rsvp-word" id="rsvpWord"></div>
      <div class="rsvp-fixation" style="bottom:0;"></div>
    </div>
    <div style="color:var(--text-dim);font-size:0.85rem;">시선을 중앙에 고정하고 단어를 읽으세요</div>
  `;
  container.appendChild(display);

  if (state.guidedInterval) clearInterval(state.guidedInterval);
  state.guidedInterval = setInterval(updateRSVP, 16); // ~60fps
}

function updateRSVP() {
  if (!rsvpState.running) return;

  const dt = 0.016;
  rsvpState.elapsed += dt;

  // Progressive WPM increase (difficulty-based)
  const diff = getDiff();
  const bWpm = diff.baseWpm || 200;
  const mWpm = diff.maxWpm || 500;
  const midWpm = bWpm + (mWpm - bWpm) * 0.3;
  const progress = rsvpState.elapsed / rsvpState.duration;
  if (progress < 0.2) {
    rsvpState.wpm = bWpm + progress / 0.2 * (midWpm - bWpm);
  } else if (progress < 0.7) {
    rsvpState.wpm = midWpm + (progress - 0.2) / 0.5 * (mWpm - midWpm);
  } else {
    rsvpState.wpm = mWpm - (progress - 0.7) / 0.3 * (mWpm - midWpm) * 0.4;
  }

  const interval = 60 / rsvpState.wpm;
  rsvpState.timer += dt;

  if (rsvpState.timer >= interval) {
    rsvpState.timer = 0;
    rsvpState.wordIndex = (rsvpState.wordIndex + 1) % rsvpState.words.length;

    const word = rsvpState.words[rsvpState.wordIndex];
    const wordEl = document.getElementById('rsvpWord');
    if (wordEl) {
      // ORP (Optimal Recognition Point) — highlight the key character
      const orpIdx = Math.min(Math.floor(word.length * 0.3), word.length - 1);
      let html = '';
      for (let i = 0; i < word.length; i++) {
        if (i === orpIdx) {
          html += `<span class="orp">${word[i]}</span>`;
        } else {
          html += word[i];
        }
      }
      wordEl.innerHTML = html;
    }
  }

  const wpmEl = document.getElementById('rsvpWpm');
  if (wpmEl) wpmEl.textContent = `${Math.round(rsvpState.wpm)} WPM`;

  // Timer and progress
  const remain = Math.max(0, rsvpState.duration - rsvpState.elapsed);
  const mins = Math.floor(remain / 60), secs = Math.floor(remain % 60);
  document.getElementById('timerDisplay').textContent = `${mins}:${secs.toString().padStart(2,'0')}`;
  document.getElementById('progressBar').style.width = `${(rsvpState.elapsed/rsvpState.duration)*100}%`;

  if (rsvpState.elapsed >= rsvpState.duration) {
    rsvpState.running = false;
    clearInterval(state.guidedInterval);
    state.guidedInterval = null;
    document.getElementById('rsvpDisplay')?.remove();
    const df = getDiff();
    showCompletion(`최대 ${df.maxWpm || 500} WPM까지 도달`);
  }
}
