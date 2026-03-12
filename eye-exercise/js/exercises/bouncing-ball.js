// Bouncing Ball — track the highlighted ball among physics-based bouncing balls
let bbState = { balls: [], targetIdx: 0, switchTimer: 0, switchInterval: 5 };

function initBouncingBall() {
  const diff = getDiff();
  const count = diff.ballCount || 6;
  bbState = { balls: [], targetIdx: 0, switchTimer: 0, switchInterval: 5 };
  const m = 80;
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 80 + Math.random() * 120;
    bbState.balls.push({
      x: m + Math.random() * (canvas.width - m * 2),
      y: m + Math.random() * (canvas.height - m * 2),
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius: 14 + Math.random() * 6,
      color: COLOR_PALETTE[i % COLOR_PALETTE.length],
    });
  }
  bbState.targetIdx = Math.floor(Math.random() * count);
}

function drawBouncingBall() {
  const dt = 1 / 60;
  const diff = getDiff();
  const spdMul = diff.spdMul || 1;
  const spd = getProgressiveSpeed() * spdMul;
  const m = 30;

  // Switch target periodically
  bbState.switchTimer += dt;
  const interval = Math.max(2, bbState.switchInterval / spd);
  if (bbState.switchTimer >= interval) {
    bbState.switchTimer = 0;
    let newIdx;
    do { newIdx = Math.floor(Math.random() * bbState.balls.length); } while (newIdx === bbState.targetIdx);
    bbState.targetIdx = newIdx;
  }

  // Update physics
  for (let i = 0; i < bbState.balls.length; i++) {
    const b = bbState.balls[i];
    b.x += b.vx * spd * dt;
    b.y += b.vy * spd * dt;

    // Wall bounce
    if (b.x - b.radius < m) { b.x = m + b.radius; b.vx = Math.abs(b.vx); }
    if (b.x + b.radius > canvas.width - m) { b.x = canvas.width - m - b.radius; b.vx = -Math.abs(b.vx); }
    if (b.y - b.radius < m) { b.y = m + b.radius; b.vy = Math.abs(b.vy); }
    if (b.y + b.radius > canvas.height - m) { b.y = canvas.height - m - b.radius; b.vy = -Math.abs(b.vy); }

    // Ball-ball collision
    for (let j = i + 1; j < bbState.balls.length; j++) {
      const o = bbState.balls[j];
      const dx = o.x - b.x, dy = o.y - b.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const minDist = b.radius + o.radius;
      if (dist < minDist && dist > 0) {
        const nx = dx / dist, ny = dy / dist;
        const overlap = minDist - dist;
        b.x -= nx * overlap * 0.5; b.y -= ny * overlap * 0.5;
        o.x += nx * overlap * 0.5; o.y += ny * overlap * 0.5;
        const dvx = b.vx - o.vx, dvy = b.vy - o.vy;
        const dot = dvx * nx + dvy * ny;
        b.vx -= dot * nx; b.vy -= dot * ny;
        o.vx += dot * nx; o.vy += dot * ny;
      }
    }
  }

  // Draw all balls
  const c = getCurrentColor();
  for (let i = 0; i < bbState.balls.length; i++) {
    const b = bbState.balls[i];
    const isTarget = i === bbState.targetIdx;

    if (isTarget) {
      // Highlighted target with pulsing glow
      const pulse = 1 + Math.sin(state.elapsed * 4) * 0.15;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.radius * 2.5 * pulse, 0, Math.PI * 2);
      const grad = ctx.createRadialGradient(b.x, b.y, b.radius * 0.5, b.x, b.y, b.radius * 2.5 * pulse);
      grad.addColorStop(0, hslGlow(c, 0.5));
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad; ctx.fill();

      ctx.beginPath();
      ctx.arc(b.x, b.y, b.radius * pulse, 0, Math.PI * 2);
      ctx.fillStyle = hslStr(c);
      ctx.fill();

      // Highlight ring
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.radius * 1.4 * pulse, 0, Math.PI * 2);
      ctx.strokeStyle = hslGlow(c, 0.6);
      ctx.lineWidth = 2;
      ctx.stroke();
    } else {
      // Regular ball
      const bc = b.color;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.radius * 1.8, 0, Math.PI * 2);
      const grad = ctx.createRadialGradient(b.x, b.y, b.radius * 0.3, b.x, b.y, b.radius * 1.8);
      grad.addColorStop(0, `hsla(${bc.h},${bc.s}%,${bc.l}%,0.2)`);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad; ctx.fill();

      ctx.beginPath();
      ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${bc.h},${bc.s}%,${bc.l}%,0.5)`;
      ctx.fill();
    }
  }

  // Instructions
  ctx.font = '13px -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.fillText('빛나는 공을 눈으로 추적하세요', canvas.width / 2, canvas.height - 40);
}
