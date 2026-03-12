// Diamond Pattern — trace diamond path hitting 4 cardinal points
function drawDiamondPattern() {
  const cx = canvas.width / 2, cy = canvas.height / 2;
  const rx = canvas.width * 0.38, ry = canvas.height * 0.4;
  const spd = getProgressiveSpeed() * (getDiff().spdMul || 1);
  const t = state.elapsed * spd * 0.4;
  const phase = t % 4;

  // Diamond: top → right → bottom → left → top
  const points = [
    { x: cx, y: cy - ry },       // top
    { x: cx + rx, y: cy },       // right
    { x: cx, y: cy + ry },       // bottom
    { x: cx - rx, y: cy },       // left
  ];

  const fromIdx = Math.floor(phase) % 4;
  const toIdx = (fromIdx + 1) % 4;
  const frac = phase - Math.floor(phase);

  const x = points[fromIdx].x + (points[toIdx].x - points[fromIdx].x) * frac;
  const y = points[fromIdx].y + (points[toIdx].y - points[fromIdx].y) * frac;

  // Draw faint diamond path
  ctx.strokeStyle = 'rgba(255,255,255,0.04)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i <= 4; i++) ctx.lineTo(points[i % 4].x, points[i % 4].y);
  ctx.stroke();

  const c = getCurrentColor();
  drawDot(x, y, state.dotSize, hslStr(c), hslGlow(c));
}

function initDiamondPattern() {}
