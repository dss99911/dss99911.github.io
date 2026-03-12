// Saccade Training
let saccadeTarget = { x:0, y:0, prevTargets:[], flashPhase:0 };

function initSaccade() {
  const m=80;
  saccadeTarget = {
    x: m+Math.random()*(canvas.width-m*2), y: m+Math.random()*(canvas.height-m*2),
    prevTargets:[], flashPhase:0,
  };
}

function drawSaccade() {
  const spd = getProgressiveSpeed() * (getDiff().spdMul || 1), interval = 1.5/spd;
  saccadeTarget.flashPhase += 1/60;
  if (saccadeTarget.flashPhase >= interval) {
    saccadeTarget.flashPhase = 0;
    saccadeTarget.prevTargets.push({x:saccadeTarget.x, y:saccadeTarget.y});
    if (saccadeTarget.prevTargets.length > 3) saccadeTarget.prevTargets.shift();
    const m=80;
    saccadeTarget.x = m+Math.random()*(canvas.width-m*2);
    saccadeTarget.y = m+Math.random()*(canvas.height-m*2);
  }
  const c = getCurrentColor();
  saccadeTarget.prevTargets.forEach((pt,i) => {
    const a = (i+1)/(saccadeTarget.prevTargets.length+1)*0.2;
    ctx.beginPath(); ctx.arc(pt.x,pt.y,state.dotSize*0.7,0,Math.PI*2);
    ctx.fillStyle = hslGlow(c,a); ctx.fill();
  });
  const pulse = 1+Math.sin(saccadeTarget.flashPhase*Math.PI*2/interval*2)*0.15;
  drawDot(saccadeTarget.x, saccadeTarget.y, state.dotSize*pulse, hslStr(c), hslGlow(c));
}
