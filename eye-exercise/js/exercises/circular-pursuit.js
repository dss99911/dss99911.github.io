// Circular Pursuit — expanding/contracting circles with direction changes
let circPursuitState = { direction: 1, radiusPhase: 0 };

function initCircularPursuit() {
  circPursuitState = { direction: 1, radiusPhase: 0 };
}

function drawCircularPursuit() {
  const cx = canvas.width / 2, cy = canvas.height / 2;
  const maxR = Math.min(canvas.width, canvas.height) * 0.4;
  const minR = maxR * 0.15;
  const spd = getProgressiveSpeed() * (getDiff().spdMul || 1);
  const t = state.elapsed * spd;

  // Change direction every ~5 seconds
  const directionCycle = Math.floor(t / 5);
  circPursuitState.direction = directionCycle % 2 === 0 ? 1 : -1;

  // Radius oscillates
  const radiusT = (t * 0.15) % 1;
  const radius = minR + (maxR - minR) * (0.5 + 0.5 * Math.sin(radiusT * Math.PI * 2));

  const angle = t * 1.5 * circPursuitState.direction;
  const x = cx + radius * Math.cos(angle);
  const y = cy + radius * Math.sin(angle);

  // Draw faint circle at current radius
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255,255,255,0.03)';
  ctx.lineWidth = 1;
  ctx.stroke();

  const c = getCurrentColor();
  drawDot(x, y, state.dotSize, hslStr(c), hslGlow(c));
}
