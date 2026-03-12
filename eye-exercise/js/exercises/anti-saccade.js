// Anti-Saccade — look opposite to the cue direction
let antiSacState = { cueX: 0, targetX: 0, phase: 'fixation', timer: 0, score: 0, total: 0, targetLetter: '' };

function initAntiSaccade() {
  antiSacState = { cueX: 0, targetX: 0, phase: 'fixation', timer: 0, score: 0, total: 0, targetLetter: '' };
}

function drawAntiSaccade() {
  const cx = canvas.width / 2, cy = canvas.height / 2;
  const spd = getProgressiveSpeed() * (getDiff().spdMul || 1);
  const targetMs = (getDiff().targetMs || 400) / 1000;

  antiSacState.timer += 1 / 60;

  // Draw fixation cross
  ctx.strokeStyle = 'rgba(255,255,255,0.2)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx - 10, cy); ctx.lineTo(cx + 10, cy);
  ctx.moveTo(cx, cy - 10); ctx.lineTo(cx, cy + 10);
  ctx.stroke();

  if (antiSacState.phase === 'fixation') {
    if (antiSacState.timer >= 0.8 / spd) {
      // Setup cue on random side
      const side = Math.random() > 0.5 ? 1 : -1;
      antiSacState.cueX = cx + side * canvas.width * 0.3;
      antiSacState.targetX = cx - side * canvas.width * 0.3; // opposite
      const chars = 'ABCDEFGHJKLMNPRST';
      antiSacState.targetLetter = chars[Math.floor(Math.random() * chars.length)];
      antiSacState.phase = 'cue';
      antiSacState.timer = 0;
    }
  } else if (antiSacState.phase === 'cue') {
    // Show cue (bright flash on one side)
    const c = getCurrentColor();
    ctx.beginPath();
    ctx.arc(antiSacState.cueX, cy, 20, 0, Math.PI * 2);
    ctx.fillStyle = hslStr(c);
    ctx.fill();

    if (antiSacState.timer >= 0.3 / spd) {
      antiSacState.phase = 'target';
      antiSacState.timer = 0;
    }
  } else if (antiSacState.phase === 'target') {
    // Show target letter on opposite side (briefly)
    ctx.font = 'bold 36px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#00d4aa';
    ctx.fillText(antiSacState.targetLetter, antiSacState.targetX, cy);

    if (antiSacState.timer >= targetMs) {
      antiSacState.phase = 'answer';
      antiSacState.timer = 0;
    }
  } else if (antiSacState.phase === 'answer') {
    // Show answer
    ctx.font = 'bold 48px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(0,212,170,0.7)';
    ctx.fillText(antiSacState.targetLetter, cx, cy + 60);

    ctx.font = '14px sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.fillText('반대편에 나타난 글자', cx, cy + 90);

    if (antiSacState.timer >= 1.0) {
      antiSacState.total++;
      antiSacState.phase = 'fixation';
      antiSacState.timer = 0;
    }
  }
}
