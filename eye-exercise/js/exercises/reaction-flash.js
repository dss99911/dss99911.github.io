// Reaction Flash — targets flash at random positions with progressive speed
let rfState = { targets: [], spawnTimer: 0, totalFlashed: 0 };

function initReactionFlash() {
  rfState = { targets: [], spawnTimer: 0, totalFlashed: 0 };
}

function drawReactionFlash() {
  const dt = 1 / 60;
  const diff = getDiff();
  const spdMul = diff.spdMul || 1;
  const spd = getProgressiveSpeed() * spdMul;
  const maxTargets = diff.maxTargets || 3;
  const c = getCurrentColor();
  const cx = canvas.width / 2, cy = canvas.height / 2;
  const m = 60;

  // Spawn new targets
  const spawnInterval = Math.max(0.3, 1.5 / spd);
  rfState.spawnTimer += dt;
  if (rfState.spawnTimer >= spawnInterval && rfState.targets.length < maxTargets) {
    rfState.spawnTimer = 0;
    const shapes = ['circle', 'diamond', 'ring', 'cross'];
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    const flashColor = COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)];
    const lifetime = Math.max(0.3, 1.2 / spd);
    rfState.targets.push({
      x: m + Math.random() * (canvas.width - m * 2),
      y: m + Math.random() * (canvas.height - m * 2),
      shape,
      color: flashColor,
      time: 0,
      lifetime,
      scale: 0,
    });
    rfState.totalFlashed++;
  }

  // Update and draw targets
  rfState.targets = rfState.targets.filter(t => {
    t.time += dt;
    const progress = t.time / t.lifetime;

    // Scale animation: pop in, hold, fade out
    if (progress < 0.15) {
      t.scale = progress / 0.15;
    } else if (progress < 0.7) {
      t.scale = 1;
    } else {
      t.scale = 1 - (progress - 0.7) / 0.3;
    }

    t.scale = Math.max(0, t.scale);
    const alpha = t.scale;
    const size = Math.max(0.1, 18 * t.scale);
    const fc = t.color;

    // Glow
    ctx.beginPath();
    ctx.arc(t.x, t.y, size * 2, 0, Math.PI * 2);
    const grad = ctx.createRadialGradient(t.x, t.y, size * 0.2, t.x, t.y, size * 2);
    grad.addColorStop(0, `hsla(${fc.h},${fc.s}%,${fc.l}%,${alpha * 0.3})`);
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad; ctx.fill();

    ctx.fillStyle = `hsla(${fc.h},${fc.s}%,${fc.l}%,${alpha})`;
    ctx.strokeStyle = `hsla(${fc.h},${fc.s}%,${fc.l}%,${alpha})`;
    ctx.lineWidth = 2.5;

    if (t.shape === 'circle') {
      ctx.beginPath();
      ctx.arc(t.x, t.y, size, 0, Math.PI * 2);
      ctx.fill();
    } else if (t.shape === 'diamond') {
      ctx.beginPath();
      ctx.moveTo(t.x, t.y - size);
      ctx.lineTo(t.x + size, t.y);
      ctx.lineTo(t.x, t.y + size);
      ctx.lineTo(t.x - size, t.y);
      ctx.closePath();
      ctx.fill();
    } else if (t.shape === 'ring') {
      ctx.beginPath();
      ctx.arc(t.x, t.y, size, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(t.x, t.y, size * 0.5, 0, Math.PI * 2);
      ctx.fill();
    } else if (t.shape === 'cross') {
      ctx.beginPath();
      ctx.moveTo(t.x - size, t.y); ctx.lineTo(t.x + size, t.y);
      ctx.moveTo(t.x, t.y - size); ctx.lineTo(t.x, t.y + size);
      ctx.stroke();
    }

    return t.time < t.lifetime;
  });

  // Counter
  ctx.font = '14px -apple-system, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.fillText(`플래시: ${rfState.totalFlashed}`, canvas.width - 20, 30);

  // Instructions
  ctx.font = '13px -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.fillText('화면 곳곳에 나타나는 도형들을 빠르게 눈으로 포착하세요', canvas.width / 2, canvas.height - 40);
}
