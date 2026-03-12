// Smooth Pursuit
function drawSmoothPursuit() {
  const spd = getProgressiveSpeed() * (getDiff().spdMul || 1), t = state.elapsed * spd * 0.5;
  const cx = canvas.width/2, cy = canvas.height/2;
  const rx = canvas.width*0.35, ry = canvas.height*0.35;
  const x = cx + Math.cos(t)*rx, y = cy + Math.sin(t)*ry;
  const c = getCurrentColor();
  ctx.beginPath(); ctx.ellipse(cx,cy,rx,ry,0,0,Math.PI*2);
  ctx.strokeStyle = hslPath(c); ctx.lineWidth = 2; ctx.stroke();
  drawDot(x, y, state.dotSize, hslStr(c), hslGlow(c));
}
