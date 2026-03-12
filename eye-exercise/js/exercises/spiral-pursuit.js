// Spiral Pursuit — track a dot moving in expanding/contracting spiral
let spiralState = { angle: 0, radius: 0, expanding: true, trailPoints: [] };

function initSpiralPursuit() {
  spiralState = { angle: 0, radius: 30, expanding: true, trailPoints: [] };
}

function drawSpiralPursuit() {
  const dt = 1 / 60;
  const diff = getDiff();
  const spdMul = diff.spdMul || 1;
  const spd = getProgressiveSpeed() * spdMul;
  const cx = canvas.width / 2, cy = canvas.height / 2;
  const maxRadius = Math.min(canvas.width, canvas.height) * 0.4;
  const minRadius = 30;

  // Update spiral
  const angularSpeed = (2 + spd * 1.5) * (diff.angMul || 1);
  spiralState.angle += angularSpeed * dt;

  const radialSpeed = (diff.radSpeed || 40) * spd;
  if (spiralState.expanding) {
    spiralState.radius += radialSpeed * dt;
    if (spiralState.radius >= maxRadius) {
      spiralState.radius = maxRadius;
      spiralState.expanding = false;
    }
  } else {
    spiralState.radius -= radialSpeed * dt;
    if (spiralState.radius <= minRadius) {
      spiralState.radius = minRadius;
      spiralState.expanding = true;
    }
  }

  const dotX = cx + Math.cos(spiralState.angle) * spiralState.radius;
  const dotY = cy + Math.sin(spiralState.angle) * spiralState.radius;

  // Trail
  spiralState.trailPoints.push({ x: dotX, y: dotY, t: state.elapsed });
  const trailLen = diff.trailLen || 60;
  if (spiralState.trailPoints.length > trailLen) {
    spiralState.trailPoints = spiralState.trailPoints.slice(-trailLen);
  }

  const c = getCurrentColor();

  // Draw spiral guide (faint)
  ctx.beginPath();
  ctx.strokeStyle = 'rgba(255,255,255,0.03)';
  ctx.lineWidth = 1;
  for (let a = 0; a < Math.PI * 12; a += 0.05) {
    const r = minRadius + (maxRadius - minRadius) * (a / (Math.PI * 12));
    const gx = cx + Math.cos(a) * r;
    const gy = cy + Math.sin(a) * r;
    if (a === 0) ctx.moveTo(gx, gy);
    else ctx.lineTo(gx, gy);
  }
  ctx.stroke();

  // Draw trail
  for (let i = 1; i < spiralState.trailPoints.length; i++) {
    const p = spiralState.trailPoints[i];
    const prev = spiralState.trailPoints[i - 1];
    const alpha = (i / spiralState.trailPoints.length) * 0.4;
    ctx.beginPath();
    ctx.moveTo(prev.x, prev.y);
    ctx.lineTo(p.x, p.y);
    ctx.strokeStyle = hslGlow(c, alpha);
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // Draw center point
  ctx.beginPath();
  ctx.arc(cx, cy, 4, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  ctx.fill();

  // Draw main dot
  drawDot(dotX, dotY, state.dotSize * 0.8, hslStr(c), hslGlow(c));

  // Instructions
  ctx.font = '13px -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.fillText('나선형으로 움직이는 점을 부드럽게 추적하세요', canvas.width / 2, canvas.height - 40);
}
