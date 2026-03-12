// Column Reading — text in narrow column that widens over time
let colReadState = { elapsed: 0, duration: 60, scrollY: 0 };

const COLUMN_TEXTS = [
  '속독은 단순히 빨리 읽는 것이 아닙니다.',
  '효율적인 시선 이동 패턴을 만드는 것입니다.',
  '좁은 컬럼에서 읽기 시작하면',
  '수평 시선 이동이 최소화됩니다.',
  '이 방법으로 수직 읽기에 집중하면',
  '자연스럽게 읽기 속도가 향상됩니다.',
  '컬럼이 점차 넓어지면서',
  '주변 시야 활용 능력도 함께 늘어납니다.',
  '핵심은 시선을 컬럼 중앙에 고정하고',
  '주변시로 양쪽 끝 글자를 인식하는 것입니다.',
  '이 훈련을 꾸준히 하면',
  '실전 독서에서도 고정점이 줄어듭니다.',
  '한 줄에 한 번만 고정해도',
  '내용을 파악할 수 있게 됩니다.',
  '눈의 움직임이 최소화되면',
  '뇌의 처리 속도가 병목이 됩니다.',
  '그때부터 진정한 속독이 시작됩니다.',
  '매일 조금씩 연습하는 것이 중요합니다.',
  '급하게 속도를 올리려 하지 마세요.',
  '이해도를 유지하면서 속도를 높이세요.',
];

function initColumnReading() {
  const diff = getDiff();
  colReadState = {
    elapsed: 0,
    duration: state.duration,
    scrollY: 0,
    startWidth: diff.startWidth || 80,
    maxWidth: diff.maxWidth || 500,
    texts: [...COLUMN_TEXTS, ...COLUMN_TEXTS, ...COLUMN_TEXTS],
  };

  canvas.style.display = 'none';
  document.getElementById('speedIndicator').style.display = 'none';

  const container = document.querySelector('.canvas-container');
  const display = document.createElement('div');
  display.className = 'guided-display';
  display.id = 'columnDisplay';
  display.setAttribute('data-exercise-display', '');
  display.style.cssText = 'padding:20px;overflow:hidden;';

  const col = document.createElement('div');
  col.id = 'columnContent';
  col.style.cssText = `width:${colReadState.startWidth}px;margin:0 auto;text-align:center;transition:width 0.5s ease;`;

  colReadState.texts.forEach(text => {
    const p = document.createElement('p');
    p.style.cssText = 'padding:8px 0;font-size:1rem;line-height:1.8;color:var(--text);border-bottom:1px solid rgba(255,255,255,0.03);';
    p.textContent = text;
    col.appendChild(p);
  });

  // Center line indicator
  const centerLine = document.createElement('div');
  centerLine.style.cssText = 'position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:6px;height:6px;border-radius:50%;background:var(--accent);opacity:0.5;z-index:2;';
  display.appendChild(centerLine);

  display.appendChild(col);
  container.appendChild(display);

  if (state.guidedInterval) clearInterval(state.guidedInterval);
  state.guidedInterval = setInterval(updateColumnReading, 16);
}

function updateColumnReading() {
  const dt = 0.016;
  colReadState.elapsed += dt;

  const progress = colReadState.elapsed / colReadState.duration;
  const currentWidth = colReadState.startWidth + (colReadState.maxWidth - colReadState.startWidth) * progress;
  const col = document.getElementById('columnContent');
  if (col) col.style.width = currentWidth + 'px';

  // Auto-scroll
  const scrollSpeed = 30 + progress * 40;
  colReadState.scrollY += scrollSpeed * dt;
  if (col) col.style.transform = `translateY(-${colReadState.scrollY}px)`;

  const remain = Math.max(0, colReadState.duration - colReadState.elapsed);
  const mins = Math.floor(remain / 60), secs = Math.floor(remain % 60);
  document.getElementById('timerDisplay').textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
  document.getElementById('progressBar').style.width = `${progress * 100}%`;

  if (colReadState.elapsed >= colReadState.duration) {
    clearInterval(state.guidedInterval);
    state.guidedInterval = null;
    document.getElementById('columnDisplay')?.remove();
    showCompletion(`컬럼 폭 ${Math.round(currentWidth)}px 달성`);
  }
}
