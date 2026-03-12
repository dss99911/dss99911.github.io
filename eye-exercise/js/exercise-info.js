// ============= Exercise Info Data =============
const exerciseInfo = {
  smoothPursuit: {
    icon: '🔵', title: 'Smooth Pursuit (부드러운 추적)',
    distance: '50~70cm (팔 길이, 일반 모니터 거리)',
    mechanism: '눈에는 물체를 부드럽게 따라가는 "추적 시스템(smooth pursuit system)"이 있습니다. 이 시스템은 움직이는 물체의 이미지를 망막 중심(중심와, fovea)에 계속 유지시키는 역할을 합니다.',
    benefits: [
      '안구 추적 정확도 향상 — 움직이는 물체를 놓치지 않고 따라가는 능력 개선',
      '내직근 & 외직근 협응력 강화 — 좌우 수평 추적의 부드러움 향상',
      '읽기 능력 개선 — 텍스트를 따라가는 안구 움직임이 더 안정적으로',
      '운전/스포츠 시 움직이는 물체 인지 능력 향상',
    ],
    muscles: ['내직근(Medial Rectus)', '외직근(Lateral Rectus)', '상직근(Superior Rectus)', '하직근(Inferior Rectus)'],
    tip: '머리를 고정하고 눈만 움직이세요. 점을 놓치지 않고 부드럽게 따라가는 것이 핵심입니다.',
  },
  figure8: {
    icon: '♾️', title: 'Figure 8 (무한대 패턴)',
    distance: '50~70cm (팔 길이)',
    mechanism: '무한대(∞) 패턴은 눈의 6개 외안근을 모든 방향으로 골고루 사용하는 궤적입니다. 수평, 수직, 대각선 운동이 자연스럽게 조합됩니다.',
    benefits: [
      '6개 외안근의 균형 있는 강화',
      '안구 운동 범위(ROM) 확대',
      '좌우 뇌 반구 연결 강화',
      '안구 근육 유연성 향상',
    ],
    muscles: ['내직근', '외직근', '상직근', '하직근', '상사근(Superior Oblique)', '하사근(Inferior Oblique)'],
    tip: '무한대 모양의 교차점(중앙)을 지날 때 시선이 흔들리지 않도록 집중하세요.',
  },
  saccade: {
    icon: '⚡', title: 'Saccade Training (빠른 시선 이동)',
    distance: '50~70cm (팔 길이)',
    mechanism: 'Saccade는 시선을 한 지점에서 다른 지점으로 빠르게 점프시키는 안구 운동입니다. 읽기, 운전, 스포츠 등 일상에서 가장 많이 사용되는 유형입니다.',
    benefits: [
      '시선 이동 속도 & 정확도 향상',
      '읽기 속도 향상',
      '시각적 탐색 능력 강화',
      '반응 시간 단축',
    ],
    muscles: ['내직근', '외직근', '상직근', '하직근'],
    tip: '점이 나타나면 최대한 빠르게 시선을 이동하되, 정확하게 점 위에 초점을 맞추세요.',
  },
  hPattern: {
    icon: '🔷', title: 'H-Pattern (H자 패턴)',
    distance: '50~70cm (팔 길이)',
    mechanism: 'H-Pattern은 안과 검사에서 6개 외안근의 기능을 평가할 때 사용하는 표준 패턴입니다.',
    benefits: [
      '6개 외안근 체계적 강화',
      '안구 근육 불균형 개선',
      '사위(phoria) 예방',
      '대각선 추적 능력 향상',
    ],
    muscles: ['내직근', '외직근', '상직근', '하직근', '상사근', '하사근'],
    tip: 'H자의 꼭짓점에서 잠깐 멈추며 초점을 확인하세요.',
  },
  speedReading: {
    icon: '📖', title: 'Speed Reading (속독 눈운동)',
    distance: '40~60cm (독서 거리)',
    mechanism: '속독의 핵심은 한 번의 고정(fixation)으로 더 넓은 범위의 글자를 인식하는 것입니다. 주변 시야(peripheral vision)의 인식 범위를 점진적으로 확장합니다.',
    benefits: [
      '읽기 속도 향상',
      '주변 시야(peripheral vision) 확장',
      '고정 횟수(fixation count) 감소',
      '되돌아 읽기(regression) 감소',
      '집중력 향상',
    ],
    muscles: ['내직근(좌→우 이동)', '외직근(좌→우 이동)'],
    tip: '포인터를 따라가되, 포인터 주변의 넓은 범위를 의식적으로 인지하려고 노력하세요.',
  },
  dynamicAcuity: {
    icon: '🎯', title: 'Dynamic Visual Acuity (동체시력)',
    distance: '50~70cm (팔 길이)',
    mechanism: '동체시력은 움직이는 물체의 세부 사항을 인식하는 능력입니다. 뇌의 시각 처리 속도와 안구 추적 시스템의 협응이 필요합니다.',
    benefits: [
      '동체시력 향상',
      '시각 처리 속도 증가',
      '스포츠 퍼포먼스 향상',
      '운전 안전성 향상',
      '순간 인지력(flash recognition) 강화',
    ],
    muscles: ['내직근', '외직근', '상직근', '하직근', '시각피질(Visual Cortex)'],
    tip: '움직이는 글자를 눈으로 추적하면서 읽으세요. 속도가 빨라질수록 집중력을 높이세요.',
  },
  visualSpan: {
    icon: '🔍', title: 'Visual Span (시폭 확장)',
    distance: '40~60cm',
    mechanism: '중앙 고정점(fixation point)에 시선을 고정한 채, 주변부에 나타나는 자극을 인식하는 훈련. 속독의 핵심 능력인 "한 눈에 볼 수 있는 글자 수"를 늘리는 기초 훈련입니다.',
    benefits: [
      '시폭(visual span) 확장',
      '속독 능력 향상 기초',
      '주변시야 해상도 향상',
      '한 번의 고정으로 인식하는 정보량 증가',
    ],
    muscles: ['망막 주변부(Peripheral Retina)', '시각피질(Visual Cortex)'],
    tip: '반드시 중앙의 십자(+) 표시에서 시선을 떼지 마세요. 주변 시야로 인식하는 것이 핵심입니다.',
  },
  peripheralDetection: {
    icon: '👁️', title: 'Peripheral Detection (주변시야 감지)',
    distance: '50~70cm',
    mechanism: '중앙에 시선을 고정한 상태에서 시야 가장자리에 나타나는 자극을 감지하는 훈련. 망막 주변부의 감도를 높이고, 뇌의 시각 주의 분배 능력을 강화합니다.',
    benefits: [
      '주변시야 감도 향상',
      '운전 시 측면 위험 감지 능력 향상',
      '스포츠 시야 확장',
      '시각적 주의력 분배 능력 강화',
    ],
    muscles: ['망막 주변부', '시각피질', '주의 네트워크(Attention Network)'],
    tip: '중앙의 점에서 절대 시선을 떼지 마세요. 주변에서 무언가 번쩍이는 것을 감지하세요.',
  },
  zigzagTracking: {
    icon: '⚡', title: 'Zigzag Tracking (지그재그 추적)',
    distance: '50~70cm',
    mechanism: '대각선+수평이 결합된 지그재그 패턴은 수직과 수평 근육이 동시에 협응해야 하므로, 복합적인 근육 협응 훈련이 됩니다.',
    benefits: [
      '복합 방향 안구 근육 협응 강화',
      '읽기 시 줄 바꿈 추적 능력 향상',
      '대각선 시선 이동의 부드러움 개선',
      '수직+수평 근육 동시 훈련',
    ],
    muscles: ['내직근', '외직근', '상직근', '하직근 (복합 협응)'],
    tip: '지그재그 꺾이는 지점에서 시선이 튕기지 않도록 부드럽게 전환하세요.',
  },
  schulteTable: {
    icon: '🔢', title: 'Schulte Table (슐테 테이블)',
    distance: '40~60cm',
    mechanism: '5×5 격자에 랜덤 배치된 1~25 숫자를 순서대로 찾는 훈련입니다. 시선을 중앙에 고정한 채 주변시(peripheral vision)만으로 숫자를 찾아야 합니다. 속독 훈련의 가장 기본적이고 대표적인 방법입니다.',
    benefits: [
      '시각 주의 범위 47% 향상 (8주 훈련 연구)',
      '주변시야 활용 능력 극대화',
      '시각적 탐색 속도 향상',
      '집중력 및 작업 기억력 강화',
    ],
    muscles: ['망막 주변부', '시각피질', '전두엽 주의 네트워크'],
    tip: '격자 중앙에 시선을 고정하세요. 눈을 움직여 숫자를 찾으면 훈련 효과가 떨어집니다. 주변시로 찾는 것이 핵심입니다.',
  },
  rsvp: {
    icon: '⚡', title: 'RSVP (빠른 순차 시각 제시)',
    distance: '40~60cm (독서 거리)',
    mechanism: 'RSVP(Rapid Serial Visual Presentation)는 화면 정중앙에 단어를 하나씩 빠르게 표시하여, 눈 이동 없이 읽기 속도를 높이는 훈련입니다. ORP(Optimal Recognition Point)를 빨간색으로 강조하여 단어 인식을 돕습니다.',
    benefits: [
      '읽기 속도 대폭 향상 (250→500+ WPM)',
      '눈 이동 제거로 에너지 절약',
      '내면 발성(subvocalization) 억제 훈련',
      '시각적 정보 처리 속도 향상',
    ],
    muscles: ['시각피질', '언어 처리 영역'],
    tip: '빨간색으로 강조된 글자(ORP)에 시선을 고정하세요. 머릿속으로 발음하지 말고 "보기만" 하세요.',
  },
  tachistoscope: {
    icon: '📸', title: 'Tachistoscope (순간 노출 인식)',
    distance: '50~70cm',
    mechanism: '단어/숫자가 극히 짧은 시간(0.8초→0.08초)동안 화면에 번쩍 나타납니다. 시간이 지날수록 노출 시간이 짧아지고 내용이 복잡해지며, 순간 인지력과 시각 처리 속도를 극한까지 훈련합니다.',
    benefits: [
      '순간 인지력 극대화',
      '시각 정보 처리 속도 향상',
      '단어/숫자 즉시 인식 능력 강화',
      '집중력 향상',
    ],
    muscles: ['시각피질', '작업 기억(Working Memory)'],
    tip: '번쩍이는 내용을 놓치지 않으려고 하세요. 잠시 후 정답이 표시되니 자신의 인식과 비교해보세요.',
  },
  eyeHop: {
    icon: '👀', title: 'Eye-Hop (아이홉 청킹 훈련)',
    distance: '40~60cm (독서 거리)',
    mechanism: '텍스트를 2개 열(column)로 배치하고, 왼쪽→오른쪽으로 시선을 "홉(hop)"하며 읽습니다. 단어 하나씩이 아니라 단어 그룹(chunk) 단위로 고정점을 잡는 습관을 형성하여, 한 줄을 읽는 데 필요한 눈 고정 횟수를 줄입니다.',
    benefits: [
      '고정점(fixation) 수 감소로 읽기 속도 향상',
      '청킹(chunking) 습관 형성',
      '좌우 시선 홉 정확도 향상',
      '실전 독서에 직접 적용 가능한 훈련',
    ],
    muscles: ['내직근', '외직근', '시각피질'],
    tip: '초록색 점(fixation point)에 시선을 맞추고, 그 주변 단어들을 한꺼번에 인식하세요.',
  },
  nearFar: {
    icon: '🔭', title: 'Near-Far Focus (원근 초점)',
    distance: '화면: 40~50cm ↔ 먼 곳: 3~6m 이상',
    mechanism: '모양체근(ciliary muscle)은 수정체의 두께를 조절하여 초점 거리를 변경합니다. 실제로 가까운 곳과 먼 곳을 번갈아 보면서 모양체근의 유연성을 회복합니다.',
    benefits: [
      '모양체근 유연성 회복',
      '조절 경련 완화',
      '디지털 눈 피로 감소',
      '가성근시 예방',
    ],
    muscles: ['모양체근(Ciliary Muscle)', '내직근(수렴 시)'],
    tip: '시작 전 3~6m 떨어진 곳에 초점을 맞출 물체를 정하세요.',
  },
  rule202020: {
    icon: '⏱️', title: '20-20-20 Rule',
    distance: '작업 시: 50~70cm → 쉬는 시간: 6m 이상',
    mechanism: '20분마다 20피트(6m) 먼 곳을 20초간 보면, 모양체근이 이완되고 눈 깜빡임이 회복됩니다.',
    benefits: [
      '디지털 눈 피로 예방 (AAO 공식 권장)',
      '안구 건조증 완화',
      '모양체근 주기적 이완',
      '두통 & 목 통증 감소',
    ],
    muscles: ['모양체근(이완)'],
    tip: '창 밖의 건물이나 나무 등 먼 곳의 물체에 초점을 맞추세요.',
  },
  blinkTraining: {
    icon: '😌', title: 'Blink Training (깜빡임 훈련)',
    distance: '상관없음',
    mechanism: '화면을 볼 때 눈 깜빡임이 정상의 절반 이하로 줄어들어 안구 건조가 발생합니다. 의식적으로 규칙적인 깜빡임 리듬을 훈련합니다.',
    benefits: [
      '안구 건조증 예방 및 완화',
      '눈물막 안정성 향상',
      '화면 작업 시 깜빡임 빈도 정상화',
    ],
    muscles: ['안륜근(Orbicularis Oculi)', '눈꺼풀올림근(Levator Palpebrae)'],
    tip: '완전히 눈을 감았다가 뜨는 것이 중요합니다 (반쯤 감는 것은 효과 없음).',
  },
  eyeRelaxation: {
    icon: '🧘', title: 'Eye Relaxation (눈 이완)',
    distance: '상관없음 (눈을 감는 운동)',
    mechanism: '팔밍(palming)은 손바닥으로 눈을 가볍게 덮어 완전한 암흑 상태를 만들어, 망막과 시각피질이 완전히 쉬게 합니다. 복식호흡과 결합하면 부교감신경이 활성화됩니다.',
    benefits: [
      '시각 피로 즉각 완화',
      '안구 근육 이완',
      '안압 감소 효과',
      '스트레스 관련 시력 저하 예방',
    ],
    muscles: ['모양체근(이완)', '외안근(이완)', '안륜근(이완)'],
    tip: '손바닥을 비벼 따뜻하게 한 후 눈 위에 올리세요. 눈알을 누르지 말고 가볍게 덮기만 하세요.',
  },
};

function showInfo(type) {
  const info = exerciseInfo[type];
  if (!info) return;
  const ov = document.createElement('div');
  ov.className = 'info-modal-overlay';
  ov.onclick = (e) => { if (e.target === ov) ov.remove(); };
  ov.innerHTML = `
    <div class="info-modal">
      <button class="info-modal-close" onclick="this.closest('.info-modal-overlay').remove()">✕</button>
      <div class="info-icon">${info.icon}</div>
      <h2>${info.title}</h2>
      <h3>권장 시청 거리</h3>
      <div class="distance-badge">📏 ${info.distance}</div>
      <h3>어떻게 작동하나요?</h3>
      <p>${info.mechanism}</p>
      <h3>개선 효과</h3>
      <ul class="benefit-list">${info.benefits.map(b => `<li>${b}</li>`).join('')}</ul>
      <h3>관련 근육</h3>
      <div>${info.muscles.map(m => `<span class="muscle-tag">${m}</span>`).join('')}</div>
      <h3>운동 팁</h3>
      <p>${info.tip}</p>
    </div>
  `;
  document.body.appendChild(ov);
}
