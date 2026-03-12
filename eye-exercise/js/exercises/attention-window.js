// Attention Window — expanding attention window with letter recognition
let attnState = { grid: [], windowRadius: 2, phase: 'show', timer: 0, rounds: 0 };

function initAttentionWindow() {
  const diff = getDiff();
  attnState = {
    grid: [],
    windowRadius: diff.startRadius || 2,
    flashMs: diff.flashMs || 500,
    phase: 'show',
    timer: 0,
    rounds: 0,
    gridSize: 9,
  };
  generateAttnGrid();
}

function generateAttnGrid() {
  const chars = 'ABCDEFGHJKLMNPRST';
  attnState.grid = [];
  for (let r = 0; r < attnState.gridSize; r++) {
    const row = [];
    for (let c = 0; c < attnState.gridSize; c++) {
      row.push(chars[Math.floor(Math.random() * chars.length)]);
    }
    attnState.grid.push(row);
  }
}

function drawAttentionWindow() {
  const cx = canvas.width / 2, cy = canvas.height / 2;
  const cellSize = Math.min(canvas.width, canvas.height) / (attnState.gridSize + 2);
  const gridOffset = (attnState.gridSize - 1) / 2;

  attnState.timer += 1 / 60;

  // Center fixation
  ctx.beginPath();
  ctx.arc(cx, cy, 4, 0, Math.PI * 2);
  ctx.fillStyle = '#00d4aa';
  ctx.fill();

  const flashDur = attnState.flashMs / 1000;
  const blankDur = 0.5;
  const cycleDur = flashDur + blankDur;

  if (attnState.phase === 'show') {
    ctx.font = `bold ${Math.min(cellSize * 0.6, 24)}px monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let r = 0; r < attnState.gridSize; r++) {
      for (let c = 0; c < attnState.gridSize; c++) {
        const x = cx + (c - gridOffset) * cellSize;
        const y = cy + (r - gridOffset) * cellSize;
        const distFromCenter = Math.sqrt(Math.pow(r - gridOffset, 2) + Math.pow(c - gridOffset, 2));

        if (distFromCenter <= attnState.windowRadius) {
          const alpha = 1 - distFromCenter / (attnState.windowRadius + 1);
          ctx.fillStyle = `rgba(224,224,240,${alpha})`;
          ctx.fillText(attnState.grid[r][c], x, y);
        } else {
          ctx.fillStyle = 'rgba(255,255,255,0.04)';
          ctx.fillRect(x - cellSize * 0.3, y - cellSize * 0.3, cellSize * 0.6, cellSize * 0.6);
        }
      }
    }

    // Draw window border
    ctx.beginPath();
    ctx.arc(cx, cy, attnState.windowRadius * cellSize + cellSize * 0.4, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(108,99,255,0.2)';
    ctx.lineWidth = 1;
    ctx.stroke();

    if (attnState.timer >= flashDur) {
      attnState.timer = 0;
      attnState.phase = 'blank';
    }
  } else if (attnState.phase === 'blank') {
    if (attnState.timer >= blankDur) {
      attnState.timer = 0;
      attnState.phase = 'show';
      attnState.rounds++;
      // Gradually expand window
      if (attnState.rounds % 4 === 0) {
        attnState.windowRadius = Math.min(gridOffset, attnState.windowRadius + 0.5);
      }
      generateAttnGrid();
    }
  }
}
