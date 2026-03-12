// Crowding Resistance — identify target letter among flanking letters
let crowdState = { target: '', flankers: [], phase: 'show', timer: 0, score: 0, total: 0, eccentricity: 5 };

function initCrowdingResistance() {
  crowdState = { target: '', flankers: [], phase: 'show', timer: 0, score: 0, total: 0, eccentricity: 5 };
  setupCrowdRound();
}

function setupCrowdRound() {
  const chars = 'ABCDEFGHJKLMNPRST';
  crowdState.target = chars[Math.floor(Math.random() * chars.length)];
  crowdState.flankers = [];
  for (let i = 0; i < 4; i++) {
    let c;
    do { c = chars[Math.floor(Math.random() * chars.length)]; } while (c === crowdState.target);
    crowdState.flankers.push(c);
  }
  crowdState.phase = 'show';
  crowdState.timer = 0;
}

function drawCrowdingResistance() {
  const cx = canvas.width / 2, cy = canvas.height / 2;
  const spd = getProgressiveSpeed() * (getDiff().spdMul || 1);
  const spacing = (getDiff().spacing || 2.0) * 20;

  crowdState.timer += 1 / 60;
  const showDur = 2.0 / spd;

  // Draw center fixation
  ctx.beginPath();
  ctx.arc(cx, cy, 4, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0,212,170,0.5)';
  ctx.fill();

  if (crowdState.phase === 'show') {
    // Place target and flankers in a random peripheral location
    const angle = ((crowdState.total * 137.5) % 360) * Math.PI / 180;
    const dist = crowdState.eccentricity * 15;
    const tx = cx + Math.cos(angle) * dist;
    const ty = cy + Math.sin(angle) * dist;

    ctx.font = 'bold 28px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Target
    ctx.fillStyle = '#e0e0f0';
    ctx.fillText(crowdState.target, tx, ty);

    // Flankers around target
    const flankerPositions = [
      { dx: -spacing, dy: 0 }, { dx: spacing, dy: 0 },
      { dx: 0, dy: -spacing }, { dx: 0, dy: spacing }
    ];
    crowdState.flankers.forEach((f, i) => {
      ctx.fillStyle = 'rgba(224,224,240,0.6)';
      ctx.fillText(f, tx + flankerPositions[i].dx, ty + flankerPositions[i].dy);
    });

    if (crowdState.timer >= showDur) {
      crowdState.timer = 0;
      crowdState.phase = 'answer';
    }
  } else if (crowdState.phase === 'answer') {
    // Show answer briefly
    ctx.font = 'bold 48px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#00d4aa';
    ctx.fillText(crowdState.target, cx, cy + 60);

    ctx.font = '16px sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fillText('정답', cx, cy + 95);

    if (crowdState.timer >= 0.8) {
      crowdState.total++;
      if (crowdState.total % 5 === 0) crowdState.eccentricity = Math.min(15, crowdState.eccentricity + 1);
      setupCrowdRound();
    }
  }
}
