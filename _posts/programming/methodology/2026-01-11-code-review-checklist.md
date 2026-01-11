---
layout: post
title: "코드 리뷰 체크리스트 - 효과적인 셀프 리뷰와 팀 리뷰 가이드"
date: 2026-01-11
categories: [programming, methodology]
tags: [code-review, clean-code, best-practices, software-quality, development]
image: /assets/images/posts/code-review-checklist.png
---

효과적인 코드 리뷰는 소프트웨어 품질을 향상시키는 핵심 활동입니다. 셀프 리뷰만으로도 90%의 문제를 사전에 발견할 수 있습니다. 이 글에서는 실무에서 바로 사용할 수 있는 코드 리뷰 체크리스트와 베스트 프랙티스를 소개합니다.

## 셀프 리뷰의 중요성

> Self-review would help you in removing 90% of problems yourself.

PR(Pull Request)을 올리기 전 셀프 리뷰를 하면 대부분의 문제를 스스로 발견할 수 있습니다. 이는 팀원들의 리뷰 시간을 절약하고, 더 의미 있는 피드백에 집중할 수 있게 합니다.

## 코드 리뷰 체크리스트

### 1. 코딩 스타일 및 표준

#### File Naming Convention
```
# 좋은 예
user_service.py
UserController.java
calculateTotalPrice.ts

# 나쁜 예
userservice.py
usercontroller.java
calc.ts
```

#### Function & Module Naming Convention
```python
# 좋은 예: 동사로 시작, 명확한 의도
def calculate_monthly_revenue():
    pass

def validate_user_input(data):
    pass

# 나쁜 예: 모호한 이름
def process():
    pass

def handle_data():
    pass
```

#### Variable Naming Convention
```javascript
// 좋은 예: 명확하고 의미 있는 이름
const maxRetryCount = 3;
const isUserAuthenticated = true;
const orderItemList = [];

// 나쁜 예: 축약어, 모호한 이름
const cnt = 3;
const flag = true;
const arr = [];
```

### 2. Don'ts 체크리스트

코드 리뷰 시 반드시 확인해야 할 안티패턴들입니다.

#### Bad Coding
```python
# 나쁜 예: 매직 넘버 사용
if status == 1:
    do_something()
elif status == 2:
    do_other_thing()

# 좋은 예: 의미 있는 상수 사용
STATUS_ACTIVE = 1
STATUS_INACTIVE = 2

if status == STATUS_ACTIVE:
    do_something()
elif status == STATUS_INACTIVE:
    do_other_thing()
```

#### Not Following Standards
```java
// 팀/회사 코딩 표준을 따르지 않는 경우
// 프로젝트에 정해진 네이밍 컨벤션 확인
// 들여쓰기 규칙 (Tab vs Space, 크기)
// 브레이스 스타일 등
```

#### Not Keeping Performance in Mind
```python
# 나쁜 예: N+1 쿼리 문제
for user in users:
    orders = Order.objects.filter(user_id=user.id)  # 매번 쿼리 실행

# 좋은 예: 조인 또는 프리페치 사용
users = User.objects.prefetch_related('orders').all()
```

#### Poor History, Indentation, Comments
```python
# 나쁜 예
def calc(x,y): # 계산
  return x+y

# 좋은 예
def calculate_total_price(base_price: float, tax_rate: float) -> float:
    """
    Calculate the total price including tax.

    Args:
        base_price: The original price before tax
        tax_rate: The tax rate as a decimal (e.g., 0.1 for 10%)

    Returns:
        The total price including tax
    """
    return base_price * (1 + tax_rate)
```

#### Poor Readability
```javascript
// 나쁜 예: 한 줄에 너무 많은 로직
const result = users.filter(u => u.age > 18).map(u => u.name).reduce((acc, n) => acc + n, '');

// 좋은 예: 단계별로 분리
const adultUsers = users.filter(user => user.age > 18);
const userNames = adultUsers.map(user => user.name);
const concatenatedNames = userNames.reduce((acc, name) => acc + name, '');
```

### 3. 리소스 관리

#### Open Files Not Closed
```python
# 나쁜 예: 파일을 닫지 않음
file = open('data.txt', 'r')
content = file.read()
# file.close() 누락

# 좋은 예: Context Manager 사용
with open('data.txt', 'r') as file:
    content = file.read()
# 자동으로 닫힘
```

#### Allocated Memory Not Released
```cpp
// C++에서의 메모리 누수
void processData() {
    int* data = new int[1000];
    // ... 처리 로직
    // delete[] data; 누락!
}

// 좋은 예: 스마트 포인터 사용
void processData() {
    std::unique_ptr<int[]> data(new int[1000]);
    // 스코프 종료 시 자동 해제
}
```

### 4. 설계 관련 문제

#### Too Many Global Variables
```python
# 나쁜 예: 전역 변수 남용
current_user = None
database_connection = None
config_settings = {}

def process_order():
    global current_user, database_connection
    # ...

# 좋은 예: 의존성 주입
class OrderProcessor:
    def __init__(self, user: User, db: Database, config: Config):
        self.user = user
        self.db = db
        self.config = config

    def process_order(self):
        # ...
```

#### Too Much Hard Coding
```java
// 나쁜 예
String apiUrl = "https://api.example.com/v1";
int timeout = 30000;

// 좋은 예: 설정 파일이나 환경 변수 사용
@Value("${api.base-url}")
private String apiUrl;

@Value("${api.timeout}")
private int timeout;
```

#### Poor Error Handling
```python
# 나쁜 예: 모든 예외를 무시
try:
    result = risky_operation()
except:
    pass

# 좋은 예: 적절한 예외 처리
try:
    result = risky_operation()
except ConnectionError as e:
    logger.error(f"Connection failed: {e}")
    raise ServiceUnavailableError("Unable to connect to service")
except ValueError as e:
    logger.warning(f"Invalid value: {e}")
    return default_value
```

#### No Modularity
```python
# 나쁜 예: 하나의 함수에 모든 로직
def process_order(order_data):
    # 검증
    if not order_data.get('user_id'):
        raise ValueError()
    if not order_data.get('items'):
        raise ValueError()
    # 계산
    total = 0
    for item in order_data['items']:
        total += item['price'] * item['quantity']
    # 저장
    db.save(order_data)
    # 알림
    send_email(order_data['user_id'])
    return total

# 좋은 예: 모듈화
class OrderService:
    def process_order(self, order_data: dict) -> float:
        self._validate(order_data)
        total = self._calculate_total(order_data['items'])
        self._save(order_data)
        self._notify(order_data['user_id'])
        return total

    def _validate(self, order_data: dict) -> None:
        validator = OrderValidator(order_data)
        validator.validate()

    def _calculate_total(self, items: list) -> float:
        calculator = PriceCalculator(items)
        return calculator.calculate()

    # ...
```

#### Repeated Code
```python
# 나쁜 예: 중복 코드
def get_active_users():
    users = db.query("SELECT * FROM users WHERE status = 'active'")
    return [{'id': u.id, 'name': u.name, 'email': u.email} for u in users]

def get_premium_users():
    users = db.query("SELECT * FROM users WHERE tier = 'premium'")
    return [{'id': u.id, 'name': u.name, 'email': u.email} for u in users]

# 좋은 예: DRY 원칙 적용
def get_users_by_condition(condition: str):
    users = db.query(f"SELECT * FROM users WHERE {condition}")
    return [{'id': u.id, 'name': u.name, 'email': u.email} for u in users]

def get_active_users():
    return get_users_by_condition("status = 'active'")

def get_premium_users():
    return get_users_by_condition("tier = 'premium'")
```

## 효과적인 코드 리뷰 프로세스

### 1. PR 작성 가이드

```markdown
## PR 제목
[FEAT] 사용자 인증 기능 추가

## 변경 사항
- JWT 기반 인증 구현
- 로그인/로그아웃 API 추가
- 비밀번호 암호화 적용

## 테스트
- [ ] 단위 테스트 추가
- [ ] 통합 테스트 통과
- [ ] 수동 테스트 완료

## 스크린샷 (UI 변경 시)
[해당 시 첨부]

## 체크리스트
- [ ] 셀프 리뷰 완료
- [ ] 코딩 표준 준수
- [ ] 테스트 커버리지 확인
```

### 2. 리뷰어 가이드

```markdown
리뷰 시 확인 순서:
1. PR 설명 읽기 - 변경의 목적 이해
2. 전체 코드 훑어보기 - 큰 그림 파악
3. 상세 리뷰 - 라인별 검토
4. 테스트 확인 - 테스트 커버리지 및 품질
5. 실행 테스트 - 필요시 로컬에서 실행
```

### 3. 피드백 작성법

```markdown
# 좋은 피드백 예시
"이 함수는 너무 많은 책임을 가지고 있어요.
데이터 검증과 저장 로직을 분리하면 어떨까요?
예를 들어:
```python
def validate_and_save(data):
    validated = self._validate(data)
    return self._save(validated)
```
"

# 피해야 할 피드백
"이건 아닌 것 같아요"
"다시 작성해주세요"
```

## 코드 리뷰 문화 만들기

### 건강한 리뷰 문화의 특징

1. **비판이 아닌 제안**: "이렇게 하면 안 돼요" 대신 "이런 방법은 어떨까요?"
2. **코드에 집중**: 개인이 아닌 코드에 대한 피드백
3. **학습의 기회**: 시니어-주니어 모두 배우는 자세
4. **신속한 응답**: 리뷰 요청 후 24시간 내 피드백

### 자동화 도구 활용

```yaml
# .github/workflows/code-quality.yml
name: Code Quality Check

on: [pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run ESLint
        run: npm run lint

      - name: Run Tests
        run: npm test

      - name: Check Coverage
        run: npm run coverage
```

## 결론

효과적인 코드 리뷰는 단순히 버그를 찾는 것을 넘어, 팀 전체의 코드 품질을 높이고 지식을 공유하는 핵심 활동입니다.

핵심 포인트:
- **셀프 리뷰 먼저**: PR 전 스스로 90%의 문제 해결
- **체크리스트 활용**: 일관된 품질 기준 적용
- **건설적 피드백**: 개선 방향 제시
- **자동화**: 반복적인 검사는 도구에 맡기기

코드 리뷰를 통해 더 나은 개발자로 성장하고, 더 좋은 소프트웨어를 만들어 나가세요.

---

## 참고 자료

- Google Engineering Practices: [https://google.github.io/eng-practices/review/](https://google.github.io/eng-practices/review/)
- Clean Code by Robert C. Martin
- The Art of Readable Code by Dustin Boswell
