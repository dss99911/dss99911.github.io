// Visual Span — continuous mode (no quiz)
let vsState = { chars:[], angle:0, currentRadius:60, phaseTime:0, flashDuration:0, phase:'fixation' };

function initVisualSpan() {
  vsState = { chars:[], angle:0, currentRadius:60, phaseTime:0, flashDuration:0, phase:'fixation' };
  spawnVisualSpanTarget();
}

function spawnVisualSpanTarget() {
  // Show multiple characters around the fixation point
  const progress = state.elapsed / state.duration;
  const minR = 60, maxR = Math.min(canvas.width, canvas.height) * 0.4;
  vsState.currentRadius = minR + (maxR - minR) * progress;

  const diff = getDiff();
  const minC = diff.minChars || 3, maxC = diff.maxChars || 8;
  const charCount = minC + Math.floor(progress * (maxC - minC));
  vsState.chars = [];
  for (let i = 0; i < charCount; i++) {
    const angle = (Math.PI * 2 / charCount) * i + Math.random() * 0.3;
    const r = vsState.currentRadius * (0.7 + Math.random() * 0.3);
    vsState.chars.push({
      char: ACUITY_CHARS[Math.floor(Math.random() * ACUITY_CHARS.length)],
      x: canvas.width/2 + Math.cos(angle) * r,
      y: canvas.height/2 + Math.sin(angle) * r,
    });
  }

  const spd = getProgressiveSpeed();
  vsState.flashDuration = Math.max(0.2, 0.8 / spd) * (diff.flashMul || 1);
  vsState.phase = 'fixation';
  vsState.phaseTime = 0;
}

function drawVisualSpan() {
  const dt = 1/60;
  vsState.phaseTime += dt;
  const c = getCurrentColor();
  const cx = canvas.width/2, cy = canvas.height/2;

  // Always draw fixation cross
  ctx.strokeStyle = hslStr(c);
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cx-15, cy); ctx.lineTo(cx+15, cy);
  ctx.moveTo(cx, cy-15); ctx.lineTo(cx, cy+15);
  ctx.stroke();

  // Draw ring guide
  ctx.beginPath();
  ctx.arc(cx, cy, vsState.currentRadius, 0, Math.PI*2);
  ctx.strokeStyle = 'rgba(255,255,255,0.05)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Radius label
  ctx.font = '12px -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.fillText(`시폭 반경: ${Math.round(vsState.currentRadius)}px`, cx, cy + vsState.currentRadius + 25);

  if (vsState.phase === 'fixation') {
    // Brief fixation period then flash
    if (vsState.phaseTime > 0.6) {
      vsState.phase = 'flash';
      vsState.phaseTime = 0;
    }
  } else if (vsState.phase === 'flash') {
    if (vsState.phaseTime < vsState.flashDuration) {
      // Draw all flashing letters
      vsState.chars.forEach(ch => {
        ctx.beginPath();
        ctx.arc(ch.x, ch.y, 24, 0, Math.PI*2);
        const grad = ctx.createRadialGradient(ch.x, ch.y, 4, ch.x, ch.y, 24);
        grad.addColorStop(0, hslGlow(c, 0.3));
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad; ctx.fill();

        ctx.font = 'bold 24px -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = hslStr(c);
        ctx.fillText(ch.char, ch.x, ch.y);
      });
    } else {
      vsState.phase = 'pause';
      vsState.phaseTime = 0;
    }
  } else if (vsState.phase === 'pause') {
    // Brief pause before next cycle
    if (vsState.phaseTime > 0.4) {
      spawnVisualSpanTarget();
    }
  }

  // Instructions
  ctx.font = '13px -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.fillText('중앙 십자(+)에 시선을 고정하고 주변 글자를 인식하세요', cx, canvas.height - 40);
}
