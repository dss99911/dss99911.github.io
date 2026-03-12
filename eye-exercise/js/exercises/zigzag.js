// Zigzag Tracking
let zigzagState = { t: 0 };

function initZigzag() {
  zigzagState = { t: 0 };
}

function drawZigzag() {
  const spd = getProgressiveSpeed() * (getDiff().spdMul || 1);
  zigzagState.t += (1/60) * spd;
  const c = getCurrentColor();

  const margin = 60;
  const w = canvas.width - margin*2;
  const h = canvas.height - margin*2;
  const segmentCount = 10;
  const segW = w / segmentCount;

  ctx.beginPath();
  ctx.strokeStyle = hslPath(c);
  ctx.lineWidth = 2;
  for (let i = 0; i <= segmentCount; i++) {
    const px = margin + i * segW;
    const py = (i % 2 === 0) ? margin : margin + h;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();

  const cycleTime = 4.0;
  const tNorm = (zigzagState.t / cycleTime) % 1;
  const posOnPath = tNorm * segmentCount;
  const segIdx = Math.floor(posOnPath);
  const segFrac = posOnPath - segIdx;

  let x, y;
  if (segIdx >= segmentCount) {
    x = margin + w;
    y = (segmentCount % 2 === 0) ? margin : margin + h;
  } else {
    const startX = margin + segIdx * segW;
    const endX = margin + (segIdx + 1) * segW;
    const startY = (segIdx % 2 === 0) ? margin : margin + h;
    const endY = (segIdx % 2 === 0) ? margin + h : margin;
    x = startX + (endX - startX) * segFrac;
    y = startY + (endY - startY) * segFrac;
  }

  drawDot(x, y, state.dotSize, hslStr(c), hslGlow(c));
}
