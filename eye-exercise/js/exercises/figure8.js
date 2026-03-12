// Figure 8
function drawFigure8() {
  const spd = getProgressiveSpeed() * (getDiff().spdMul || 1), t = state.elapsed * spd * 0.4;
  const cx = canvas.width/2, cy = canvas.height/2;
  const rx = canvas.width*0.3, ry = canvas.height*0.25;
  const denom = 1 + Math.sin(t)*Math.sin(t);
  const x = cx + rx*Math.cos(t)/denom, y = cy + ry*Math.sin(t)*Math.cos(t)/denom;
  const c = getCurrentColor();
  ctx.beginPath();
  for (let a=0; a<Math.PI*2; a+=0.02) {
    const d=1+Math.sin(a)*Math.sin(a);
    const px=cx+rx*Math.cos(a)/d, py=cy+ry*Math.sin(a)*Math.cos(a)/d;
    a===0 ? ctx.moveTo(px,py) : ctx.lineTo(px,py);
  }
  ctx.strokeStyle = hslPath(c); ctx.lineWidth = 2; ctx.stroke();
  drawDot(x, y, state.dotSize, hslStr(c), hslGlow(c));
}
