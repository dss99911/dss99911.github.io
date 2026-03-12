// Tachistoscope — brief flash recognition training
let tachyState = { content:'', flashTime:0, phase:'fixation', phaseTime:0, level:1, elapsed:0, duration:60 };

const TACHY_WORDS_KO = [
  // Level 1: 2-char
  '사과','하늘','바다','나무','커피','시간','세상','마음','소리','빛나',
  // Level 2: 3-char
  '아름답','행복한','자유로','강아지','고양이','무지개','태양빛','미래의','과학자','컴퓨터',
  // Level 3: 4-char
  '가을바람','봄꽃향기','별빛아래','파란하늘','깊은바다','높은산맥','새벽이슬','저녁노을','맑은공기','하얀구름',
  // Level 4: 5+ char
  '인공지능기술','데이터사이언스','프로그래밍언어','클라우드컴퓨팅','머신러닝모델','자연어처리기술',
];

const TACHY_NUMBERS = [];
for (let len = 3; len <= 8; len++) {
  for (let i = 0; i < 5; i++) {
    let n = '';
    for (let j = 0; j < len; j++) n += Math.floor(Math.random() * 10);
    TACHY_NUMBERS.push(n);
  }
}

function initTachistoscope() {
  tachyState = { content:'', flashTime:0, phase:'fixation', phaseTime:0, level:1, elapsed:0, duration: state.duration };

  canvas.style.display = 'none';
  document.getElementById('speedIndicator').style.display = 'none';

  const container = document.querySelector('.canvas-container');
  const display = document.createElement('div');
  display.className = 'tachy-display';
  display.id = 'tachyDisplay';
  display.innerHTML = `
    <div class="tachy-info" id="tachyInfo">레벨 1</div>
    <div class="tachy-fixation" id="tachyFixation"></div>
    <div class="tachy-flash" id="tachyFlash"></div>
    <div style="color:var(--text-dim);font-size:0.85rem;">번쩍이는 단어/숫자를 인식하세요</div>
  `;
  container.appendChild(display);

  spawnTachyContent();
  if (state.guidedInterval) clearInterval(state.guidedInterval);
  state.guidedInterval = setInterval(updateTachy, 16);
}

function spawnTachyContent() {
  const diff = getDiff();
  const levelCap = diff.levelCap || 6;
  const progress = tachyState.elapsed / tachyState.duration;
  tachyState.level = Math.min(levelCap, 1 + Math.floor(progress * levelCap));

  // Pick content based on level
  const useNumbers = Math.random() < 0.4;
  if (useNumbers) {
    const numLen = 2 + tachyState.level;
    let n = '';
    for (let j = 0; j < numLen; j++) n += Math.floor(Math.random() * 10);
    tachyState.content = n;
  } else {
    // Pick word by difficulty
    const startIdx = Math.min(tachyState.level - 1, 3) * 10;
    const pool = TACHY_WORDS_KO.slice(startIdx, startIdx + 10);
    tachyState.content = pool[Math.floor(Math.random() * pool.length)] || TACHY_WORDS_KO[0];
  }

  // Flash duration decreases with level
  const minFlash = diff.minFlash || 0.08;
  tachyState.flashTime = Math.max(minFlash, 0.8 - tachyState.level * 0.1);
  tachyState.phase = 'fixation';
  tachyState.phaseTime = 0;
}

function updateTachy() {
  const dt = 0.016;
  tachyState.elapsed += dt;
  tachyState.phaseTime += dt;

  const flashEl = document.getElementById('tachyFlash');
  const fixEl = document.getElementById('tachyFixation');
  const infoEl = document.getElementById('tachyInfo');

  if (infoEl) infoEl.textContent = `레벨 ${tachyState.level} | 노출: ${(tachyState.flashTime * 1000).toFixed(0)}ms`;

  if (tachyState.phase === 'fixation') {
    // Show fixation dot, hide flash
    if (fixEl) fixEl.style.display = '';
    if (flashEl) flashEl.textContent = '';
    if (tachyState.phaseTime > 1.0) {
      tachyState.phase = 'flash';
      tachyState.phaseTime = 0;
    }
  } else if (tachyState.phase === 'flash') {
    if (fixEl) fixEl.style.display = 'none';
    if (flashEl) {
      flashEl.textContent = tachyState.content;
      flashEl.style.color = '';
    }
    if (tachyState.phaseTime > tachyState.flashTime) {
      tachyState.phase = 'blank';
      tachyState.phaseTime = 0;
    }
  } else if (tachyState.phase === 'blank') {
    // Show the answer after brief blank
    if (tachyState.phaseTime < 0.3) {
      if (flashEl) flashEl.textContent = '';
    } else if (tachyState.phaseTime < 1.2) {
      // Reveal answer
      if (flashEl) {
        flashEl.textContent = tachyState.content;
        flashEl.style.color = 'var(--accent)';
      }
    } else {
      spawnTachyContent();
    }
  }

  // Timer and progress
  const remain = Math.max(0, tachyState.duration - tachyState.elapsed);
  const mins = Math.floor(remain / 60), secs = Math.floor(remain % 60);
  document.getElementById('timerDisplay').textContent = `${mins}:${secs.toString().padStart(2,'0')}`;
  document.getElementById('progressBar').style.width = `${(tachyState.elapsed/tachyState.duration)*100}%`;

  if (tachyState.elapsed >= tachyState.duration) {
    clearInterval(state.guidedInterval);
    state.guidedInterval = null;
    document.getElementById('tachyDisplay')?.remove();
    showCompletion(`최종 레벨: ${tachyState.level} | 노출시간: ${(tachyState.flashTime * 1000).toFixed(0)}ms`);
  }
}
