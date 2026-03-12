// ============= Near-Far Focus =============
let nearFarState = { phase:'idle', timeLeft:0, nearSec:5, farSec:5, cycles:0 };

function startNearFar() {
  const container = document.querySelector('.canvas-container');
  const display = document.createElement('div');
  display.className = 'guided-display';
  display.id = 'nearFarDisplay';
  display.innerHTML = `
    <div class="guided-phase" id="nfPhase">원근 초점 운동</div>
    <div class="guided-timer" id="nfTimer">0:05</div>
    <div id="nfVisual"></div>
    <div class="guided-instruction" id="nfInstruction">
      화면의 초점 마커를 보다가, 안내에 따라<br>먼 곳의 물체로 시선을 옮기세요.
    </div>
    <p style="color:var(--text-dim);font-size:0.85rem;max-width:400px;text-align:center;">
      시작 전, 3~6m 떨어진 곳에 초점을 맞출 물체(창 밖 건물, 시계 등)를 미리 정해두세요.
    </p>
    <button class="btn btn-primary" onclick="startNearFarTimer()">시작</button>
  `;
  container.appendChild(display);
}

function startNearFarTimer() {
  nearFarState = { phase:'near', timeLeft:5, nearSec:5, farSec:5, cycles:0, totalCycles:10 };
  const btn = document.querySelector('#nearFarDisplay .btn');
  if (btn) btn.style.display = 'none';
  document.querySelector('#nearFarDisplay p')?.remove();
  if (state.ruleInterval) clearInterval(state.ruleInterval);
  state.ruleInterval = setInterval(updateNearFar, 1000);
  updateNearFarDisplay();
}

function updateNearFar() {
  nearFarState.timeLeft--;
  if (nearFarState.timeLeft <= 0) {
    if (nearFarState.phase === 'near') {
      nearFarState.phase = 'far';
      nearFarState.timeLeft = nearFarState.farSec;
      playBeep(600, 0.2);
    } else {
      nearFarState.cycles++;
      if (nearFarState.cycles >= nearFarState.totalCycles) {
        clearInterval(state.ruleInterval);
        state.ruleInterval = null;
        showCompletion(`${nearFarState.totalCycles}회 원근 전환 완료`);
        return;
      }
      nearFarState.phase = 'near';
      nearFarState.timeLeft = nearFarState.nearSec;
      playBeep(800, 0.2);
    }
  }
  updateNearFarDisplay();
}

function updateNearFarDisplay() {
  const timer = document.getElementById('nfTimer');
  const phase = document.getElementById('nfPhase');
  const instr = document.getElementById('nfInstruction');
  const visual = document.getElementById('nfVisual');
  if (!timer) return;
  timer.textContent = `0:${nearFarState.timeLeft.toString().padStart(2,'0')}`;
  if (nearFarState.phase === 'near') {
    phase.textContent = `👁️ 가까이 보기 (${nearFarState.cycles+1}/${nearFarState.totalCycles})`;
    instr.innerHTML = '<strong>화면의 초록색 점</strong>에 초점을 맞추세요';
    visual.innerHTML = '<div class="guided-focus-dot"></div>';
    timer.style.background = 'linear-gradient(135deg, var(--accent), var(--primary))';
    timer.style.webkitBackgroundClip = 'text';
  } else {
    phase.textContent = `🌄 멀리 보기 (${nearFarState.cycles+1}/${nearFarState.totalCycles})`;
    instr.innerHTML = '화면에서 눈을 떼고<br><strong>3~6m 떨어진 물체</strong>에 초점을 맞추세요';
    visual.innerHTML = '<div class="guided-far-icon">🏔️</div>';
    timer.style.background = 'linear-gradient(135deg, #ffd93d, #ff6b6b)';
    timer.style.webkitBackgroundClip = 'text';
  }
}

// ============= 20-20-20 Rule =============
let ruleState = { phase:'idle', timeLeft:0 };

function start202020() {
  const container = document.querySelector('.canvas-container');
  const display = document.createElement('div');
  display.className = 'guided-display';
  display.innerHTML = `
    <div class="guided-phase" id="rulePhase">작업 중</div>
    <div class="guided-timer" id="ruleTimer">20:00</div>
    <div class="guided-instruction" id="ruleInstruction">화면을 보며 정상적으로 작업하세요.<br>20분 후 알림이 울립니다.</div>
    <button class="btn btn-primary" onclick="startRuleTimer()">시작</button>
  `;
  container.appendChild(display);
}

function startRuleTimer() {
  const btn = document.querySelector('.guided-display .btn');
  if (btn) btn.style.display = 'none';
  ruleState = { phase:'work', timeLeft: 20*60 };
  if (state.ruleInterval) clearInterval(state.ruleInterval);
  state.ruleInterval = setInterval(updateRuleTimer, 1000);
  updateRuleDisplay();
}

function updateRuleTimer() {
  ruleState.timeLeft--;
  if (ruleState.timeLeft <= 0) {
    if (ruleState.phase === 'work') {
      ruleState.phase = 'rest'; ruleState.timeLeft = 20;
      playBeep(800, 0.3);
    } else {
      ruleState.phase = 'work'; ruleState.timeLeft = 20*60;
      playBeep(600, 0.2);
    }
  }
  updateRuleDisplay();
}

function updateRuleDisplay() {
  const t = document.getElementById('ruleTimer');
  const p = document.getElementById('rulePhase');
  const i = document.getElementById('ruleInstruction');
  if (!t) return;
  const m = Math.floor(ruleState.timeLeft/60), s = ruleState.timeLeft%60;
  t.textContent = `${m}:${s.toString().padStart(2,'0')}`;
  if (ruleState.phase === 'work') {
    p.textContent = '💻 작업 중';
    i.innerHTML = '화면을 보며 정상적으로 작업하세요.<br>20분 후 쉬는 시간이 시작됩니다.';
    t.style.background = 'linear-gradient(135deg, var(--primary), var(--accent))';
  } else {
    p.textContent = '👀 쉬는 시간';
    i.innerHTML = '화면에서 눈을 떼고<br><strong>6미터(20피트) 이상 먼 곳</strong>을 바라보세요.';
    t.style.background = 'linear-gradient(135deg, #00d4aa, #6c63ff)';
  }
  t.style.webkitBackgroundClip = 'text';
}

// ============= Blink Training =============
let blinkState = { blinkCount:0, eyeOpen:true, blinkTimer:0, interval:3.5, elapsed:0, duration:120, targetRate:17 };

function startBlinkTraining() {
  const container = document.querySelector('.canvas-container');
  const display = document.createElement('div');
  display.className = 'guided-display';
  display.id = 'blinkDisplay';
  display.innerHTML = `
    <div class="guided-phase" id="blinkPhase">깜빡임 훈련</div>
    <div class="guided-timer" id="blinkTimer">2:00</div>
    <div id="blinkVisual"><div class="blink-eye" id="blinkEye">👁️</div></div>
    <div class="guided-instruction" id="blinkInstruction">
      화면의 눈 아이콘이 깜빡일 때<br>함께 의식적으로 깜빡이세요.
    </div>
    <div id="blinkStats" style="color:var(--text-dim);font-size:0.9rem;margin-top:8px;">
      깜빡임: 0회 | 분당: 0회
    </div>
    <button class="btn btn-primary" onclick="startBlinkTimer()">시작</button>
  `;
  container.appendChild(display);
}

function startBlinkTimer() {
  blinkState = { blinkCount:0, eyeOpen:true, blinkTimer:0, interval:3.5, elapsed:0, duration:120, targetRate:17 };
  const btn = document.querySelector('#blinkDisplay .btn');
  if (btn) btn.style.display = 'none';
  if (state.guidedInterval) clearInterval(state.guidedInterval);
  state.guidedInterval = setInterval(updateBlink, 100);
}

function updateBlink() {
  blinkState.elapsed += 0.1;
  blinkState.blinkTimer += 0.1;
  const remain = Math.max(0, blinkState.duration - blinkState.elapsed);
  const mins = Math.floor(remain / 60), secs = Math.floor(remain % 60);
  const timerEl = document.getElementById('blinkTimer');
  if (timerEl) timerEl.textContent = `${mins}:${secs.toString().padStart(2,'0')}`;
  const eyeEl = document.getElementById('blinkEye');
  if (blinkState.blinkTimer >= blinkState.interval) {
    blinkState.blinkTimer = 0;
    blinkState.eyeOpen = false;
    blinkState.blinkCount++;
    playBeep(500, 0.1);
    if (eyeEl) eyeEl.classList.add('closed');
    setTimeout(() => {
      blinkState.eyeOpen = true;
      if (eyeEl) eyeEl.classList.remove('closed');
    }, 300);
    blinkState.interval = 3 + Math.random();
  }
  const rate = blinkState.elapsed > 0 ? Math.round(blinkState.blinkCount / (blinkState.elapsed / 60)) : 0;
  const statsEl = document.getElementById('blinkStats');
  if (statsEl) {
    statsEl.innerHTML = `깜빡임: ${blinkState.blinkCount}회 | 분당: ${rate}회 <span style="color:${rate >= 15 ? 'var(--accent)' : 'var(--warning)'}">(목표: 15~20회/분)</span>`;
  }
  const phaseEl = document.getElementById('blinkPhase');
  if (phaseEl) phaseEl.textContent = `😌 깜빡임 훈련 (${blinkState.blinkCount}회)`;
  if (blinkState.elapsed >= blinkState.duration) {
    clearInterval(state.guidedInterval);
    state.guidedInterval = null;
    const finalRate = Math.round(blinkState.blinkCount / (blinkState.duration / 60));
    showCompletion(`총 ${blinkState.blinkCount}회 깜빡임 | 분당 ${finalRate}회`);
  }
}

// ============= Eye Relaxation =============
let relaxState = { phase:'intro', elapsed:0, duration:180, breathPhase:'inhale', breathTimer:0, inhaleDur:4, holdDur:2, exhaleDur:6, circleSize:120 };

function startEyeRelaxation() {
  const container = document.querySelector('.canvas-container');
  const display = document.createElement('div');
  display.className = 'guided-display';
  display.id = 'relaxDisplay';
  display.innerHTML = `
    <div class="guided-phase" id="relaxPhase">눈 이완 운동</div>
    <div class="guided-timer" id="relaxTimer">3:00</div>
    <div id="relaxVisual" style="display:flex;flex-direction:column;align-items:center;gap:16px;">
      <div class="breathing-circle" id="breathCircle" style="width:120px;height:120px;">
        <span id="breathLabel">준비</span>
      </div>
    </div>
    <div class="guided-instruction" id="relaxInstruction">
      눈을 감고 손바닥으로 가볍게 덮으세요.<br>호흡 원에 맞춰 깊은 호흡을 합니다.
    </div>
    <p style="color:var(--text-dim);font-size:0.85rem;max-width:400px;text-align:center;">
      손바닥을 비벼 따뜻하게 한 후 눈 위에 올리세요.<br>눈알을 누르지 말고 가볍게 덮기만 하세요.
    </p>
    <button class="btn btn-primary" onclick="startRelaxTimer()">시작</button>
  `;
  container.appendChild(display);
}

function startRelaxTimer() {
  relaxState = { phase:'palming', elapsed:0, duration:180, breathPhase:'inhale', breathTimer:0, inhaleDur:4, holdDur:2, exhaleDur:6, circleSize:120 };
  const btn = document.querySelector('#relaxDisplay .btn');
  if (btn) btn.style.display = 'none';
  document.querySelector('#relaxDisplay > p')?.remove();
  if (state.guidedInterval) clearInterval(state.guidedInterval);
  state.guidedInterval = setInterval(updateRelax, 50);
}

function updateRelax() {
  relaxState.elapsed += 0.05;
  relaxState.breathTimer += 0.05;
  const remain = Math.max(0, relaxState.duration - relaxState.elapsed);
  const mins = Math.floor(remain / 60), secs = Math.floor(remain % 60);
  const timerEl = document.getElementById('relaxTimer');
  if (timerEl) timerEl.textContent = `${mins}:${secs.toString().padStart(2,'0')}`;
  const circle = document.getElementById('breathCircle');
  const label = document.getElementById('breathLabel');
  const instr = document.getElementById('relaxInstruction');
  const phase = document.getElementById('relaxPhase');
  const cycleDur = relaxState.inhaleDur + relaxState.holdDur + relaxState.exhaleDur;
  const cyclePos = relaxState.breathTimer % cycleDur;
  let breathText = '';
  let circleScale = 1;
  if (cyclePos < relaxState.inhaleDur) {
    breathText = '들숨';
    const progress = cyclePos / relaxState.inhaleDur;
    circleScale = 1 + progress * 0.8;
    if (relaxState.breathPhase !== 'inhale') { relaxState.breathPhase = 'inhale'; playBeep(600, 0.1); }
  } else if (cyclePos < relaxState.inhaleDur + relaxState.holdDur) {
    breathText = '멈춤';
    circleScale = 1.8;
    if (relaxState.breathPhase !== 'hold') { relaxState.breathPhase = 'hold'; }
  } else {
    breathText = '날숨';
    const exhaleProgress = (cyclePos - relaxState.inhaleDur - relaxState.holdDur) / relaxState.exhaleDur;
    circleScale = 1.8 - exhaleProgress * 0.8;
    if (relaxState.breathPhase !== 'exhale') { relaxState.breathPhase = 'exhale'; playBeep(400, 0.1); }
  }
  const baseSize = 120;
  const newSize = Math.round(baseSize * circleScale);
  if (circle) {
    circle.style.width = newSize + 'px';
    circle.style.height = newSize + 'px';
    if (relaxState.breathPhase === 'inhale') {
      circle.style.borderColor = 'rgba(0,212,170,0.5)';
      circle.style.background = `radial-gradient(circle, rgba(0,212,170,0.2), rgba(108,99,255,0.05))`;
    } else if (relaxState.breathPhase === 'hold') {
      circle.style.borderColor = 'rgba(255,217,61,0.5)';
      circle.style.background = `radial-gradient(circle, rgba(255,217,61,0.15), rgba(108,99,255,0.05))`;
    } else {
      circle.style.borderColor = 'rgba(108,99,255,0.5)';
      circle.style.background = `radial-gradient(circle, rgba(108,99,255,0.2), rgba(0,212,170,0.05))`;
    }
  }
  if (label) label.textContent = breathText;
  if (instr) {
    if (relaxState.breathPhase === 'inhale') instr.innerHTML = '코로 천천히 <strong>들이쉬세요</strong>... (4초)';
    else if (relaxState.breathPhase === 'hold') instr.innerHTML = '숨을 <strong>멈추세요</strong>... (2초)';
    else instr.innerHTML = '입으로 천천히 <strong>내쉬세요</strong>... (6초)';
  }
  const cycleCount = Math.floor(relaxState.breathTimer / cycleDur) + 1;
  if (phase) phase.textContent = `🧘 눈 이완 (${cycleCount}번째 호흡)`;
  if (relaxState.elapsed >= relaxState.duration) {
    clearInterval(state.guidedInterval);
    state.guidedInterval = null;
    const totalCycles = Math.floor(relaxState.elapsed / cycleDur);
    showCompletion(`${totalCycles}회 호흡 완료 | 눈의 피로가 풀렸습니다`);
  }
}
