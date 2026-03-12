// Useful Field of View — central + peripheral dual task
let ufovState = { centerLetter: '', targets: [], distractors: [], phase: 'show', timer: 0, score: 0, rounds: 0 };

function initUsefulFieldOfView() {
  ufovState = { centerLetter: '', targets: [], distractors: [], phase: 'show', timer: 0, score: 0, rounds: 0 };
  setupUFOVRound();
}

function setupUFOVRound() {
  const diff = getDiff();
  const numDist = diff.distractors || 4;
  const chars = 'ABCDEFGHJKLMNPRST';
  ufovState.centerLetter = chars[Math.floor(Math.random() * chars.length)];

  // Place target in peripheral area
  const angle = Math.random() * Math.PI * 2;
  const dist = 0.25 + Math.random() * 0.2;
  ufovState.targets = [{ x: 0.5 + Math.cos(angle) * dist, y: 0.5 + Math.sin(angle) * dist }];

  // Place distractors
  ufovState.distractors = [];
  for (let i = 0; i < numDist; i++) {
    const a = Math.random() * Math.PI * 2;
    const d = 0.2 + Math.random() * 0.25;
    ufovState.distractors.push({ x: 0.5 + Math.cos(a) * d, y: 0.5 + Math.sin(a) * d });
  }
  ufovState.phase = 'show';
  ufovState.timer = 0;
}

function drawUsefulFieldOfView() {
  const w = canvas.width, h = canvas.height;
  const cx = w / 2, cy = h / 2;
  const spd = getProgressiveSpeed() * (getDiff().spdMul || 1);

  ufovState.timer += 1 / 60;
  const showDur = 1.5 / spd;
  const blankDur = 0.8;

  if (ufovState.phase === 'show') {
    // Draw center letter
    ctx.font = 'bold 48px sans-serif';
    ctx.fillStyle = 'var(--text, #e0e0f0)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(ufovState.centerLetter, cx, cy);

    // Draw target (triangle)
    const t = ufovState.targets[0];
    const tx = t.x * w, ty = t.y * h;
    ctx.beginPath();
    ctx.moveTo(tx, ty - 12); ctx.lineTo(tx - 10, ty + 8); ctx.lineTo(tx + 10, ty + 8);
    ctx.closePath();
    ctx.fillStyle = '#00d4aa';
    ctx.fill();

    // Draw distractors (squares)
    ufovState.distractors.forEach(d => {
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.fillRect(d.x * w - 8, d.y * h - 8, 16, 16);
    });

    if (ufovState.timer >= showDur) {
      ufovState.timer = 0;
      ufovState.phase = 'blank';
    }
  } else if (ufovState.phase === 'blank') {
    // Show fixation
    ctx.beginPath();
    ctx.arc(cx, cy, 4, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,212,170,0.5)';
    ctx.fill();

    if (ufovState.timer >= blankDur) {
      ufovState.rounds++;
      setupUFOVRound();
    }
  }

  // Draw center fixation cross
  ctx.strokeStyle = 'rgba(255,255,255,0.15)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx - 8, cy); ctx.lineTo(cx + 8, cy);
  ctx.moveTo(cx, cy - 8); ctx.lineTo(cx, cy + 8);
  ctx.stroke();
}
