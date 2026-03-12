// Vergence Rock — two dots converge and diverge symmetrically
function initVergenceRock() {}

function drawVergenceRock() {
  const cx = canvas.width / 2, cy = canvas.height / 2;
  const spd = getProgressiveSpeed() * (getDiff().spdMul || 1);
  const range = getDiff().range || 0.5;
  const maxDist = canvas.width * range * 0.5;
  const t = state.elapsed * spd * 0.5;

  // Sinusoidal convergence/divergence
  const dist = maxDist * (0.5 + 0.5 * Math.cos(t * Math.PI));

  const c = getCurrentColor();
  drawDot(cx - dist, cy, state.dotSize, hslStr(c), hslGlow(c));
  drawDot(cx + dist, cy, state.dotSize, hslStr(c), hslGlow(c));

  // Center reference
  ctx.beginPath();
  ctx.arc(cx, cy, 3, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.1)';
  ctx.fill();
}
