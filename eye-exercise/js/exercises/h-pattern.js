// H-Pattern
function drawHPattern() {
  const spd = getProgressiveSpeed(), t = state.elapsed*spd*0.3;
  const cx=canvas.width/2, cy=canvas.height/2, w=canvas.width*0.35, h=canvas.height*0.35;
  const cycle = t%6;
  let x, y;
  const c = getCurrentColor();
  ctx.beginPath(); ctx.strokeStyle=hslPath(c); ctx.lineWidth=2;
  ctx.moveTo(cx-w,cy-h); ctx.lineTo(cx-w,cy+h);
  ctx.moveTo(cx-w,cy); ctx.lineTo(cx+w,cy);
  ctx.moveTo(cx+w,cy-h); ctx.lineTo(cx+w,cy+h); ctx.stroke();
  if(cycle<1){x=cx-w;y=cy-h+cycle*h*2;}
  else if(cycle<2){x=cx-w;y=cy+h-(cycle-1)*h;}
  else if(cycle<3){x=cx-w+(cycle-2)*w*2;y=cy;}
  else if(cycle<4){x=cx+w;y=cy-(cycle-3)*h;}
  else if(cycle<5){x=cx+w;y=cy-h+(cycle-4)*h*2;}
  else{x=cx+w-(cycle-5)*w*2;y=cy+h-(cycle-5)*(h*2);}
  drawDot(x,y,state.dotSize,hslStr(c),hslGlow(c));
}
