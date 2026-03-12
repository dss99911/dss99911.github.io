// Speed Reading
let speedReadState = { lineY:0, dotX:0, lineIndex:0, lineCount:8, jumpWidth:0, t:0 };

function initSpeedReading() {
  speedReadState = { lineY:0, dotX:0, lineIndex:0, lineCount:8, jumpWidth:0, t:0 };
}

function drawSpeedReading() {
  const spd = getProgressiveSpeed();
  const c = getCurrentColor();
  const margin = 60;
  const lineSpacing = (canvas.height - margin*2) / (speedReadState.lineCount - 1);
  const startX = margin, endX = canvas.width - margin;
  const lineWidth = endX - startX;

  for (let i=0; i<speedReadState.lineCount; i++) {
    const ly = margin + i*lineSpacing;
    ctx.fillStyle = 'rgba(255,255,255,0.04)';
    ctx.fillRect(startX, ly-2, lineWidth, 4);
    let wx = startX;
    const seed = i*7+3;
    for (let j=0; j<12; j++) {
      const ww = 30 + ((seed*j*13+7)%40);
      ctx.fillStyle = 'rgba(255,255,255,0.06)';
      ctx.fillRect(wx, ly-6, ww, 12);
      wx += ww + 12 + ((seed*j)%10);
      if (wx > endX) break;
    }
  }

  speedReadState.t += (1/60) * spd;
  const charsPerLine = 2.0 / spd;
  const totalTime = charsPerLine * speedReadState.lineCount;
  const cycleT = speedReadState.t % totalTime;
  const currentLine = Math.floor(cycleT / charsPerLine);
  const lineProgress = (cycleT % charsPerLine) / charsPerLine;

  const ly = margin + (currentLine % speedReadState.lineCount) * lineSpacing;
  const dx = startX + lineProgress * lineWidth;

  const highlightWidth = 80 + (state.elapsed / state.duration) * 120;
  ctx.fillStyle = hslGlow(c, 0.06);
  ctx.fillRect(dx - highlightWidth/2, ly - 16, highlightWidth, 32);

  drawDot(dx, ly, state.dotSize * 0.8, hslStr(c), hslGlow(c));

  ctx.strokeStyle = hslGlow(c, 0.15);
  ctx.lineWidth = 1;
  ctx.setLineDash([4,4]);
  ctx.beginPath();
  ctx.moveTo(dx - highlightWidth/2, ly - 18);
  ctx.lineTo(dx - highlightWidth/2, ly + 18);
  ctx.moveTo(dx + highlightWidth/2, ly - 18);
  ctx.lineTo(dx + highlightWidth/2, ly + 18);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.font = '12px -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = hslGlow(c, 0.5);
  ctx.fillText(`주변시야 범위: ${Math.round(highlightWidth)}px`, dx, ly + 36);
}
