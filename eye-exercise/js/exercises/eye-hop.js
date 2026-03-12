// Eye-Hop — 2-column chunking training for speed reading
let eyeHopState = { lines:[], currentLine:0, currentChunk:0, timer:0, elapsed:0, duration:60 };

const EYEHOP_TEXTS = [
  ['눈 운동은', '매우 중요합니다'],
  ['정기적인 훈련으로', '시력을 보호하세요'],
  ['화면을 오래 보면', '눈이 피로해집니다'],
  ['주변 시야를', '넓히는 것이 핵심'],
  ['한 번에 더 많은', '단어를 인식하세요'],
  ['시선 고정 횟수를', '줄이면 속도가 올라갑니다'],
  ['내면의 발성을', '억제하면 더 빠릅니다'],
  ['청킹은 단어 그룹을', '한 번에 읽는 기술'],
  ['속독의 기본은', '시폭 확장입니다'],
  ['매일 연습하면', '놀라운 변화가 생깁니다'],
  ['눈 깜빡임을', '잊지 마세요'],
  ['먼 곳을 자주 보면', '눈 피로가 줄어듭니다'],
  ['디지털 시대에', '눈 건강은 필수입니다'],
  ['규칙적인 휴식이', '생산성을 높여줍니다'],
  ['시각 정보 처리는', '뇌 활동의 핵심'],
  ['집중력 향상은', '효율적 시선 이동에서'],
  ['두 열 읽기로', '고정점을 줄이세요'],
  ['주변시 활용은', '속독의 비결입니다'],
  ['눈 근육 강화는', '일상에서 시작됩니다'],
  ['좋은 자세가', '좋은 시력을 만듭니다'],
];

function initEyeHop() {
  // Shuffle and prepare enough lines
  const shuffled = [...EYEHOP_TEXTS].sort(() => Math.random() - 0.5);
  const repeatedLines = [];
  while (repeatedLines.length < 100) {
    repeatedLines.push(...shuffled);
  }

  eyeHopState = {
    lines: repeatedLines,
    currentLine: 0,
    currentChunk: 0, // 0=left, 1=right
    timer: 0,
    elapsed: 0,
    duration: state.duration,
  };

  canvas.style.display = 'none';
  document.getElementById('speedIndicator').style.display = 'none';

  const container = document.querySelector('.canvas-container');
  const display = document.createElement('div');
  display.className = 'guided-display';
  display.id = 'eyeHopDisplay';
  display.setAttribute('data-exercise-display', '');
  display.style.padding = '20px';

  // Show visible lines
  const wrapper = document.createElement('div');
  wrapper.className = 'eyehop-container';
  wrapper.id = 'eyeHopLines';
  display.appendChild(wrapper);

  const infoDiv = document.createElement('div');
  infoDiv.style.cssText = 'color:var(--text-dim);font-size:0.85rem;text-align:center;';
  infoDiv.textContent = '왼쪽 → 오른쪽으로 시선을 홉(hop)하며 읽으세요';
  display.appendChild(infoDiv);

  container.appendChild(display);

  renderEyeHopLines();
  if (state.guidedInterval) clearInterval(state.guidedInterval);
  state.guidedInterval = setInterval(updateEyeHop, 16);
}

function renderEyeHopLines() {
  const wrapper = document.getElementById('eyeHopLines');
  if (!wrapper) return;
  wrapper.innerHTML = '';

  const visibleCount = 8;
  const startLine = Math.max(0, eyeHopState.currentLine - 2);

  for (let i = 0; i < visibleCount; i++) {
    const lineIdx = startLine + i;
    if (lineIdx >= eyeHopState.lines.length) break;
    const lineData = eyeHopState.lines[lineIdx];
    const lineDiv = document.createElement('div');
    lineDiv.className = 'eyehop-line';

    const leftChunk = document.createElement('div');
    leftChunk.className = 'eyehop-chunk';
    leftChunk.innerHTML = `<span class="fixation-dot"></span> ${lineData[0]}`;
    if (lineIdx === eyeHopState.currentLine && eyeHopState.currentChunk === 0) {
      leftChunk.classList.add('active');
    }

    const rightChunk = document.createElement('div');
    rightChunk.className = 'eyehop-chunk';
    rightChunk.style.textAlign = 'right';
    rightChunk.innerHTML = `${lineData[1]} <span class="fixation-dot"></span>`;
    if (lineIdx === eyeHopState.currentLine && eyeHopState.currentChunk === 1) {
      rightChunk.classList.add('active');
    }

    // Dim past lines
    if (lineIdx < eyeHopState.currentLine) {
      leftChunk.style.opacity = '0.3';
      rightChunk.style.opacity = '0.3';
    } else if (lineIdx > eyeHopState.currentLine) {
      leftChunk.style.opacity = '0.6';
      rightChunk.style.opacity = '0.6';
    }

    lineDiv.appendChild(leftChunk);
    lineDiv.appendChild(rightChunk);
    wrapper.appendChild(lineDiv);
  }
}

function updateEyeHop() {
  const dt = 0.016;
  eyeHopState.elapsed += dt;

  // Progressive speed (difficulty-based)
  const diff = getDiff();
  const baseInt = diff.baseInterval || 1.2;
  const minInt = diff.minInterval || 0.5;
  const progress = eyeHopState.elapsed / eyeHopState.duration;
  let hopInterval;
  if (progress < 0.2) {
    hopInterval = baseInt;
  } else if (progress < 0.7) {
    hopInterval = baseInt - (progress - 0.2) / 0.5 * (baseInt - minInt);
  } else {
    hopInterval = minInt + (progress - 0.7) / 0.3 * (baseInt - minInt) * 0.3;
  }

  eyeHopState.timer += dt;
  if (eyeHopState.timer >= hopInterval) {
    eyeHopState.timer = 0;
    // Advance: left→right→next line left
    if (eyeHopState.currentChunk === 0) {
      eyeHopState.currentChunk = 1;
    } else {
      eyeHopState.currentChunk = 0;
      eyeHopState.currentLine++;
      if (eyeHopState.currentLine >= eyeHopState.lines.length) {
        eyeHopState.currentLine = 0;
      }
    }
    renderEyeHopLines();
  }

  // Timer and progress
  const remain = Math.max(0, eyeHopState.duration - eyeHopState.elapsed);
  const mins = Math.floor(remain / 60), secs = Math.floor(remain % 60);
  document.getElementById('timerDisplay').textContent = `${mins}:${secs.toString().padStart(2,'0')}`;
  document.getElementById('progressBar').style.width = `${(eyeHopState.elapsed/eyeHopState.duration)*100}%`;

  if (eyeHopState.elapsed >= eyeHopState.duration) {
    clearInterval(state.guidedInterval);
    state.guidedInterval = null;
    document.getElementById('eyeHopDisplay')?.remove();
    const linesRead = eyeHopState.currentLine;
    showCompletion(`${linesRead}줄 읽기 완료`);
  }
}
