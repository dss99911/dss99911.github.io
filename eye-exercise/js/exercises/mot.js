// Multiple Object Tracking (MOT) — track highlighted targets among distractors
let motState = { dots: [], targets: [], phase: 'highlight', phaseTime: 0, round: 0 };

function initMOT() {
  motState = { dots: [], targets: [], phase: 'highlight', phaseTime: 0, round: 0 };
  spawnMOTRound();
}

function spawnMOTRound() {
  const diff = getDiff();
  const totalDots = diff.totalDots || 10;
  const targetCount = diff.targetCount || 3;
  const m = 80;

  motState.dots = [];
  for (let i = 0; i < totalDots; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 40 + Math.random() * 60;
    motState.dots.push({
      x: m + Math.random() * (canvas.width - m * 2),
      y: m + Math.random() * (canvas.height - m * 2),
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
    });
  }

  // Pick random targets
  const indices = Array.from({ length: totalDots }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  motState.targets = indices.slice(0, targetCount);
  motState.phase = 'highlight';
  motState.phaseTime = 0;
  motState.round++;
}

function drawMOT() {
  const dt = 1 / 60;
  motState.phaseTime += dt;
  const diff = getDiff();
  const spdMul = diff.spdMul || 1;
  const spd = getProgressiveSpeed() * spdMul;
  const m = 50;
  const dotRadius = 12;
  const c = getCurrentColor();

  // Move dots
  for (const d of motState.dots) {
    d.x += d.vx * spd * dt;
    d.y += d.vy * spd * dt;
    if (d.x < m) { d.x = m; d.vx = Math.abs(d.vx); }
    if (d.x > canvas.width - m) { d.x = canvas.width - m; d.vx = -Math.abs(d.vx); }
    if (d.y < m) { d.y = m; d.vy = Math.abs(d.vy); }
    if (d.y > canvas.height - m) { d.y = canvas.height - m; d.vy = -Math.abs(d.vy); }
  }

  const highlightDuration = diff.highlightSec || 2.5;
  const trackDuration = diff.trackSec || 6;

  if (motState.phase === 'highlight') {
    // Show which dots are targets
    for (let i = 0; i < motState.dots.length; i++) {
      const d = motState.dots[i];
      const isTarget = motState.targets.includes(i);

      if (isTarget) {
        // Glow
        ctx.beginPath();
        ctx.arc(d.x, d.y, dotRadius * 2.5, 0, Math.PI * 2);
        const grad = ctx.createRadialGradient(d.x, d.y, dotRadius * 0.3, d.x, d.y, dotRadius * 2.5);
        grad.addColorStop(0, hslGlow(c, 0.5));
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad; ctx.fill();

        ctx.beginPath();
        ctx.arc(d.x, d.y, dotRadius, 0, Math.PI * 2);
        ctx.fillStyle = hslStr(c);
        ctx.fill();

        // Star marker
        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#fff';
        ctx.fillText('★', d.x, d.y);
      } else {
        ctx.beginPath();
        ctx.arc(d.x, d.y, dotRadius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.25)';
        ctx.fill();
      }
    }

    // Countdown
    const remain = Math.max(0, highlightDuration - motState.phaseTime);
    ctx.font = 'bold 20px -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = hslStr(c);
    ctx.fillText(`타겟을 기억하세요! ${remain.toFixed(1)}s`, canvas.width / 2, 50);

    if (motState.phaseTime >= highlightDuration) {
      motState.phase = 'track';
      motState.phaseTime = 0;
    }
  } else if (motState.phase === 'track') {
    // All dots look the same — user must track
    for (const d of motState.dots) {
      ctx.beginPath();
      ctx.arc(d.x, d.y, dotRadius * 1.5, 0, Math.PI * 2);
      const grad = ctx.createRadialGradient(d.x, d.y, dotRadius * 0.3, d.x, d.y, dotRadius * 1.5);
      grad.addColorStop(0, 'rgba(255,255,255,0.1)');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad; ctx.fill();

      ctx.beginPath();
      ctx.arc(d.x, d.y, dotRadius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.fill();
    }

    const remain = Math.max(0, trackDuration - motState.phaseTime);
    ctx.font = '16px -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.fillText(`추적 중... ${remain.toFixed(1)}s`, canvas.width / 2, 50);

    if (motState.phaseTime >= trackDuration) {
      motState.phase = 'reveal';
      motState.phaseTime = 0;
    }
  } else if (motState.phase === 'reveal') {
    // Reveal targets briefly
    for (let i = 0; i < motState.dots.length; i++) {
      const d = motState.dots[i];
      const isTarget = motState.targets.includes(i);

      ctx.beginPath();
      ctx.arc(d.x, d.y, dotRadius, 0, Math.PI * 2);
      if (isTarget) {
        ctx.fillStyle = hslStr(c);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(d.x, d.y, dotRadius * 1.6, 0, Math.PI * 2);
        ctx.strokeStyle = hslGlow(c, 0.6);
        ctx.lineWidth = 2;
        ctx.stroke();
      } else {
        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        ctx.fill();
      }
    }

    ctx.font = '16px -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = hslStr(c);
    ctx.fillText(`정답 공개! 라운드 ${motState.round}`, canvas.width / 2, 50);

    if (motState.phaseTime >= 2) {
      spawnMOTRound();
    }
  }

  // Instructions
  ctx.font = '13px -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.fillText('표시된 타겟들을 눈으로 계속 추적하세요', canvas.width / 2, canvas.height - 40);
}
