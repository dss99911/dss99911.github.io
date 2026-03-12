// Peripheral Detection — continuous mode (no Space key required)
let pdState = { flashActive:false, flashX:0, flashY:0, flashTime:0, flashDuration:0.4, flashShape:'circle', flashColor:null, cooldown:0, totalFlashes:0 };

function initPeripheralDetection() {
  pdState = { flashActive:false, flashX:0, flashY:0, flashTime:0, flashDuration:0.4, flashShape:'circle', flashColor:null, cooldown:0, totalFlashes:0 };
}

function spawnPeripheralFlash() {
  const shapes = ['circle', 'square', 'triangle'];
  pdState.flashShape = shapes[Math.floor(Math.random() * shapes.length)];
  pdState.flashColor = COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)];

  const margin = 40;
  const cx = canvas.width/2, cy = canvas.height/2;
  const minDist = Math.min(canvas.width, canvas.height) * 0.3;
  const maxDist = Math.min(canvas.width, canvas.height) * 0.45;
  const angle = Math.random() * Math.PI * 2;
  const dist = minDist + Math.random() * (maxDist - minDist);
  pdState.flashX = cx + Math.cos(angle) * dist;
  pdState.flashY = cy + Math.sin(angle) * dist;
  pdState.flashX = Math.max(margin, Math.min(canvas.width - margin, pdState.flashX));
  pdState.flashY = Math.max(margin, Math.min(canvas.height - margin, pdState.flashY));

  const diff = getDiff();
  const spd = getProgressiveSpeed();
  pdState.flashDuration = Math.max(0.1, 0.6 / spd * (diff.flashMul || 1));
  pdState.flashActive = true;
  pdState.flashTime = 0;
  pdState.totalFlashes++;
}

function drawPeripheralDetection() {
  const dt = 1/60;
  const c = getCurrentColor();
  const cx = canvas.width/2, cy = canvas.height/2;

  // Central fixation dot
  drawDot(cx, cy, 8, hslStr(c), hslGlow(c));

  // Instructions
  ctx.font = '13px -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.fillText('중앙을 보면서 주변의 번쩍임을 감지하세요', cx, cy + 40);

  if (pdState.flashActive) {
    pdState.flashTime += dt;
    if (pdState.flashTime < pdState.flashDuration) {
      const fc = pdState.flashColor;
      const alpha = 1 - (pdState.flashTime / pdState.flashDuration) * 0.5;

      // Glow
      ctx.beginPath();
      ctx.arc(pdState.flashX, pdState.flashY, 25, 0, Math.PI*2);
      const grad = ctx.createRadialGradient(pdState.flashX, pdState.flashY, 3, pdState.flashX, pdState.flashY, 25);
      grad.addColorStop(0, `hsla(${fc.h},${fc.s}%,${fc.l}%,0.4)`);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad; ctx.fill();

      ctx.fillStyle = `hsla(${fc.h},${fc.s}%,${fc.l}%,${alpha})`;
      if (pdState.flashShape === 'circle') {
        ctx.beginPath();
        ctx.arc(pdState.flashX, pdState.flashY, 12, 0, Math.PI*2);
        ctx.fill();
      } else if (pdState.flashShape === 'square') {
        ctx.fillRect(pdState.flashX-10, pdState.flashY-10, 20, 20);
      } else {
        ctx.beginPath();
        ctx.moveTo(pdState.flashX, pdState.flashY-12);
        ctx.lineTo(pdState.flashX+12, pdState.flashY+10);
        ctx.lineTo(pdState.flashX-12, pdState.flashY+10);
        ctx.closePath(); ctx.fill();
      }
    } else {
      pdState.flashActive = false;
      pdState.cooldown = 0;
    }
  } else {
    pdState.cooldown += dt;
    const spd = getProgressiveSpeed();
    const pdDiff = getDiff();
    const interval = Math.max(0.5, 2.5 / spd * (pdDiff.intervalMul || 1));
    if (pdState.cooldown >= interval) {
      spawnPeripheralFlash();
    }
  }
}
