// Dynamic Visual Acuity — continuous mode (no quiz)
let acuityState = { char:'', x:0, y:0, vx:0, vy:0, phaseTime:0, showDuration:0 };

function initDynamicAcuity() {
  acuityState = { char:'', x:0, y:0, vx:0, vy:0, phaseTime:0, showDuration:0 };
  spawnAcuityTarget();
}

function spawnAcuityTarget() {
  const charIdx = Math.floor(Math.random() * ACUITY_CHARS.length);
  acuityState.char = ACUITY_CHARS[charIdx];
  const diff = getDiff();
  const spd = getProgressiveSpeed() * (diff.spdMul || 1);
  const speed = 150 + spd * 100;
  const angle = Math.random() * Math.PI * 2;
  acuityState.vx = Math.cos(angle) * speed;
  acuityState.vy = Math.sin(angle) * speed;
  const m = 100;
  acuityState.x = m + Math.random() * (canvas.width - m*2);
  acuityState.y = m + Math.random() * (canvas.height - m*2);
  acuityState.phaseTime = 0;
  acuityState.showDuration = Math.max(0.5, 2.0 / spd) * (diff.showMul || 1);
}

function drawDynamicAcuity() {
  const dt = 1/60;
  acuityState.phaseTime += dt;
  const c = getCurrentColor();

  // Move the character
  acuityState.x += acuityState.vx * dt;
  acuityState.y += acuityState.vy * dt;

  const m = 50;
  if (acuityState.x < m || acuityState.x > canvas.width-m) acuityState.vx *= -1;
  if (acuityState.y < m || acuityState.y > canvas.height-m) acuityState.vy *= -1;
  acuityState.x = Math.max(m, Math.min(canvas.width-m, acuityState.x));
  acuityState.y = Math.max(m, Math.min(canvas.height-m, acuityState.y));

  // Draw glow
  ctx.beginPath();
  ctx.arc(acuityState.x, acuityState.y, 40, 0, Math.PI*2);
  const grad = ctx.createRadialGradient(acuityState.x,acuityState.y,5,acuityState.x,acuityState.y,40);
  grad.addColorStop(0, hslGlow(c, 0.3));
  grad.addColorStop(1, 'transparent');
  ctx.fillStyle = grad; ctx.fill();

  // Draw character
  ctx.font = 'bold 36px -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = hslStr(c);
  ctx.fillText(acuityState.char, acuityState.x, acuityState.y);

  // Spawn new character periodically
  if (acuityState.phaseTime > acuityState.showDuration) {
    spawnAcuityTarget();
  }

  // Instructions
  ctx.font = '13px -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.fillText('움직이는 글자를 눈으로 추적하며 읽으세요', canvas.width/2, canvas.height - 40);
}
