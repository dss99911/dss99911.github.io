// Color Trail — track a specific colored dot among moving colored dots
let ctState = { dots: [], targetColor: null, hintTimer: 0 };

function initColorTrail() {
  const diff = getDiff();
  const dotCount = diff.dotCount || 12;
  ctState = { dots: [], targetColor: null, hintTimer: 0 };

  // Pick target color
  ctState.targetColor = COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)];

  const m = 60;
  for (let i = 0; i < dotCount; i++) {
    let color;
    if (i === 0) {
      color = ctState.targetColor; // First dot is the target
    } else {
      // Pick a different color
      do {
        color = COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)];
      } while (color.h === ctState.targetColor.h && color.s === ctState.targetColor.s);
    }

    const angle = Math.random() * Math.PI * 2;
    const speed = 50 + Math.random() * 80;
    ctState.dots.push({
      x: m + Math.random() * (canvas.width - m * 2),
      y: m + Math.random() * (canvas.height - m * 2),
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      color,
      isTarget: i === 0,
      dirChangeTimer: Math.random() * 3,
    });
  }
}

function drawColorTrail() {
  const dt = 1 / 60;
  const diff = getDiff();
  const spdMul = diff.spdMul || 1;
  const spd = getProgressiveSpeed() * spdMul;
  const m = 40;
  const dotRadius = 10;
  const tc = ctState.targetColor;

  ctState.hintTimer += dt;

  // Update dots
  for (const d of ctState.dots) {
    d.x += d.vx * spd * dt;
    d.y += d.vy * spd * dt;

    // Wall bounce
    if (d.x < m) { d.x = m; d.vx = Math.abs(d.vx); }
    if (d.x > canvas.width - m) { d.x = canvas.width - m; d.vx = -Math.abs(d.vx); }
    if (d.y < m) { d.y = m; d.vy = Math.abs(d.vy); }
    if (d.y > canvas.height - m) { d.y = canvas.height - m; d.vy = -Math.abs(d.vy); }

    // Random direction changes for more organic motion
    d.dirChangeTimer -= dt;
    if (d.dirChangeTimer <= 0) {
      d.dirChangeTimer = 1.5 + Math.random() * 3;
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.sqrt(d.vx * d.vx + d.vy * d.vy);
      d.vx = Math.cos(angle) * speed;
      d.vy = Math.sin(angle) * speed;
    }
  }

  // Draw target color indicator at top
  const indicatorY = 30;
  ctx.font = '14px -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.fillText('추적 대상 색상:', canvas.width / 2 - 50, indicatorY + 4);

  ctx.beginPath();
  ctx.arc(canvas.width / 2 + 40, indicatorY, 12, 0, Math.PI * 2);
  ctx.fillStyle = `hsl(${tc.h},${tc.s}%,${tc.l}%)`;
  ctx.fill();
  ctx.beginPath();
  ctx.arc(canvas.width / 2 + 40, indicatorY, 14, 0, Math.PI * 2);
  ctx.strokeStyle = `hsla(${tc.h},${tc.s}%,${tc.l}%,0.5)`;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Draw all dots
  for (const d of ctState.dots) {
    const dc = d.color;
    const isTarget = d.isTarget;

    // Trail effect for all dots
    ctx.beginPath();
    ctx.arc(d.x, d.y, dotRadius * 1.8, 0, Math.PI * 2);
    const grad = ctx.createRadialGradient(d.x, d.y, dotRadius * 0.3, d.x, d.y, dotRadius * 1.8);
    grad.addColorStop(0, `hsla(${dc.h},${dc.s}%,${dc.l}%,0.2)`);
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad; ctx.fill();

    // Main dot
    ctx.beginPath();
    ctx.arc(d.x, d.y, dotRadius, 0, Math.PI * 2);
    ctx.fillStyle = `hsl(${dc.h},${dc.s}%,${dc.l}%)`;
    ctx.fill();

    // Subtle hint for target (very faint pulsing ring, only first few seconds)
    if (isTarget && ctState.hintTimer < 3) {
      const hintAlpha = Math.max(0, 0.3 * (1 - ctState.hintTimer / 3));
      const pulse = 1 + Math.sin(state.elapsed * 6) * 0.2;
      ctx.beginPath();
      ctx.arc(d.x, d.y, dotRadius * 1.8 * pulse, 0, Math.PI * 2);
      ctx.strokeStyle = `hsla(${dc.h},${dc.s}%,${dc.l}%,${hintAlpha})`;
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Specular highlight
    ctx.beginPath();
    ctx.arc(d.x - dotRadius * 0.2, d.y - dotRadius * 0.2, dotRadius * 0.3, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.fill();
  }

  // Instructions
  ctx.font = '13px -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.fillText('지정된 색상의 점을 다른 점들 사이에서 계속 추적하세요', canvas.width / 2, canvas.height - 40);
}
