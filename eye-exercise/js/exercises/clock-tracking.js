// Clock Tracking — trace 12 clock positions with pauses
let clockState = { currentPos: 0, pauseTimer: 0 };

function initClockTracking() {
  clockState = { currentPos: 0, pauseTimer: 0 };
}

function drawClockTracking() {
  const cx = canvas.width / 2, cy = canvas.height / 2;
  const rx = canvas.width * 0.35, ry = canvas.height * 0.38;
  const spd = getProgressiveSpeed() * (getDiff().spdMul || 1);
  const pauseDur = 0.4 / spd;
  const dt = 1 / 60;

  // Draw faint clock markers
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
    const mx = cx + rx * Math.cos(angle), my = cy + ry * Math.sin(angle);
    ctx.beginPath();
    ctx.arc(mx, my, 3, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.fill();
  }

  clockState.pauseTimer += dt;
  if (clockState.pauseTimer >= pauseDur) {
    clockState.pauseTimer = 0;
    clockState.currentPos = (clockState.currentPos + 1) % 12;
  }

  // Interpolate between positions
  const frac = Math.min(clockState.pauseTimer / (pauseDur * 0.5), 1);
  const fromPos = (clockState.currentPos + 11) % 12;
  const fromAngle = (fromPos / 12) * Math.PI * 2 - Math.PI / 2;
  const toAngle = (clockState.currentPos / 12) * Math.PI * 2 - Math.PI / 2;

  let angleDiff = toAngle - fromAngle;
  if (angleDiff < 0) angleDiff += Math.PI * 2;
  const angle = fromAngle + angleDiff * frac;

  const x = cx + rx * Math.cos(angle);
  const y = cy + ry * Math.sin(angle);
  const c = getCurrentColor();
  drawDot(x, y, state.dotSize, hslStr(c), hslGlow(c));
}
