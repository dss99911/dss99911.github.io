// Visual Search — find target shape among distractors
let vsearchState = { items: [], target: null, phase: 'search', timer: 0, found: 0, total: 0, handler: null };

function initVisualSearch() {
  const diff = getDiff();
  vsearchState = { items: [], target: null, phase: 'search', timer: 0, found: 0, total: 0, itemCount: diff.items || 24, handler: null };
  setupVSRound();

  vsearchState.handler = (e) => {
    if (vsearchState.phase !== 'search') return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    vsearchState.items.forEach((item, i) => {
      if (item.isTarget) {
        const dx = x - item.x * canvas.width;
        const dy = y - item.y * canvas.height;
        if (Math.sqrt(dx * dx + dy * dy) < 25) {
          vsearchState.found++;
          vsearchState.phase = 'feedback';
          vsearchState.timer = 0;
        }
      }
    });
  };
  canvas.addEventListener('click', vsearchState.handler);
}

function setupVSRound() {
  const shapes = ['circle', 'square', 'triangle', 'diamond'];
  const colors = ['#ff6b6b', '#6c63ff', '#00d4aa', '#ffd93d'];
  const targetShape = shapes[Math.floor(Math.random() * shapes.length)];
  const targetColor = colors[Math.floor(Math.random() * colors.length)];

  vsearchState.items = [];
  // Place target
  vsearchState.target = { shape: targetShape, color: targetColor };
  vsearchState.items.push({
    x: 0.1 + Math.random() * 0.8,
    y: 0.1 + Math.random() * 0.8,
    shape: targetShape, color: targetColor, isTarget: true
  });

  // Place distractors (share one property with target)
  for (let i = 0; i < vsearchState.itemCount - 1; i++) {
    let s, c;
    if (Math.random() > 0.5) {
      s = targetShape;
      do { c = colors[Math.floor(Math.random() * colors.length)]; } while (c === targetColor);
    } else {
      c = targetColor;
      do { s = shapes[Math.floor(Math.random() * shapes.length)]; } while (s === targetShape);
    }
    vsearchState.items.push({
      x: 0.05 + Math.random() * 0.9,
      y: 0.05 + Math.random() * 0.9,
      shape: s, color: c, isTarget: false
    });
  }
  vsearchState.phase = 'search';
  vsearchState.timer = 0;
}

function drawShape(x, y, shape, color, size) {
  ctx.fillStyle = color;
  ctx.beginPath();
  if (shape === 'circle') {
    ctx.arc(x, y, size, 0, Math.PI * 2);
  } else if (shape === 'square') {
    ctx.rect(x - size, y - size, size * 2, size * 2);
  } else if (shape === 'triangle') {
    ctx.moveTo(x, y - size); ctx.lineTo(x - size, y + size); ctx.lineTo(x + size, y + size);
    ctx.closePath();
  } else if (shape === 'diamond') {
    ctx.moveTo(x, y - size); ctx.lineTo(x + size, y); ctx.lineTo(x, y + size); ctx.lineTo(x - size, y);
    ctx.closePath();
  }
  ctx.fill();
}

function drawVisualSearch() {
  const w = canvas.width, h = canvas.height;
  vsearchState.timer += 1 / 60;

  // Draw target indicator at top
  if (vsearchState.target) {
    ctx.font = '14px sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('찾으세요:', 20, 20);
    drawShape(90, 28, vsearchState.target.shape, vsearchState.target.color, 10);
  }

  // Draw all items
  vsearchState.items.forEach(item => {
    drawShape(item.x * w, item.y * h, item.shape, item.color, 10);
  });

  if (vsearchState.phase === 'feedback') {
    // Highlight target
    const t = vsearchState.items.find(i => i.isTarget);
    if (t) {
      ctx.beginPath();
      ctx.arc(t.x * w, t.y * h, 20, 0, Math.PI * 2);
      ctx.strokeStyle = '#00d4aa';
      ctx.lineWidth = 3;
      ctx.stroke();
    }
    if (vsearchState.timer >= 0.6) {
      vsearchState.total++;
      setupVSRound();
    }
  }
}
