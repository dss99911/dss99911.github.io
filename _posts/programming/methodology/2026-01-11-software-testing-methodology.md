---
layout: post
title: "소프트웨어 테스팅 방법론 - TDD, 단위 테스트부터 E2E까지"
date: 2026-01-11
categories: [programming, methodology]
tags: [testing, tdd, unit-test, integration-test, e2e-test, qa, software-quality]
image: /assets/images/posts/software-testing-methodology.png
---

소프트웨어 품질을 보장하는 핵심인 테스팅 방법론에 대해 알아봅니다. TDD(Test-Driven Development)부터 클라이언트/서버 테스팅, QA 자동화까지 실무에서 바로 적용할 수 있는 가이드를 제공합니다.

## 테스팅의 기본 원칙

### 핵심 마인드셋

> Tight schedule, no compromise - 힘들더라도 타협하지 말고 좋은 코드를 만들려고 해야 합니다.

- **모든 작은 코드 변경에도 테스트 수행**
- **모든 코드에 Unit Test 작성**
- **테스트를 통해 버그 발견 및 실수 방지**
- **다른 개발자를 비판하지 않기**: 세상에 버그 없는 코드를 작성할 수 있는 프로그래머는 없습니다

### 테스팅 니즈 파악하기

테스트를 작성하기 전에 먼저 무엇을 테스트해야 하는지 파악해야 합니다.

1. **실제 API 호출 테스트**
   - RestClient를 구현하여 서버 API가 잘 동작하는지 테스트
   - Mock 토큰 활용

2. **Mock과 실제 API 모두에서 테스트**
   - 환경에 따라 Mock과 실제를 스위칭 가능하게 구현

3. **기획서 케이스 테스트**
   - 기획서에 정의된 모든 비즈니스 로직 케이스 테스트

## 테스트 피라미드

```
        /\
       /  \
      / E2E \      - 적은 수, 느림, 비용 높음
     /--------\
    /Integration\  - 중간 수
   /--------------\
  /   Unit Tests   \ - 많은 수, 빠름, 비용 낮음
 /------------------\
```

### 각 레벨의 특징

| 레벨 | 범위 | 속도 | 비용 | 수량 |
|------|------|------|------|------|
| Unit | 개별 함수/클래스 | 빠름 | 낮음 | 많음 |
| Integration | 모듈 간 연동 | 보통 | 보통 | 보통 |
| E2E | 전체 시스템 | 느림 | 높음 | 적음 |

## 클라이언트 테스팅 전략

### 1. API Mock 데이터

```kotlin
// Mock 데이터 정의
object MockUserApi {
    val successResponse = """
        {
            "id": 1,
            "name": "Test User",
            "email": "test@example.com"
        }
    """.trimIndent()

    val errorResponse = """
        {
            "error": "User not found",
            "code": 404
        }
    """.trimIndent()
}

// Mock을 활용한 테스트
@Test
fun `should parse user response correctly`() {
    val user = gson.fromJson(MockUserApi.successResponse, User::class.java)

    assertEquals(1, user.id)
    assertEquals("Test User", user.name)
    assertEquals("test@example.com", user.email)
}
```

### 2. ViewModel 테스팅

각 이벤트에 따라 Mock Repository에서 값을 가져와 LiveData에 값이 잘 설정되는지 확인합니다.

```kotlin
class UserViewModelTest {

    @get:Rule
    val instantTaskExecutorRule = InstantTaskExecutorRule()

    private lateinit var viewModel: UserViewModel
    private lateinit var mockRepository: MockUserRepository

    @Before
    fun setup() {
        mockRepository = MockUserRepository()
        viewModel = UserViewModel(mockRepository)
    }

    @Test
    fun `when loadUser called, user data is set to liveData`() {
        // Given
        val expectedUser = User(1, "Test User", "test@example.com")
        mockRepository.setMockUser(expectedUser)

        // When
        viewModel.loadUser(1)

        // Then
        assertEquals(expectedUser, viewModel.user.value)
    }

    @Test
    fun `when loadUser fails, error state is set`() {
        // Given
        mockRepository.setError(true)

        // When
        viewModel.loadUser(1)

        // Then
        assertNotNull(viewModel.error.value)
    }
}
```

### 3. View 테스팅

- **LiveData 값에 따른 UI 표시 확인**
- **유저 액션에 따른 ViewModel 액션 전달 확인**
- **LiveData 값에 따른 UI 액션 확인**

```kotlin
@Test
fun `when user data loaded, display user name`() {
    // Given
    val user = User(1, "Test User", "test@example.com")
    viewModel.user.value = user

    // When
    launchFragmentInContainer<UserFragment>()

    // Then
    onView(withId(R.id.userName))
        .check(matches(withText("Test User")))
}

@Test
fun `when login button clicked, viewModel login called`() {
    // Given
    launchFragmentInContainer<LoginFragment>()

    // When
    onView(withId(R.id.emailInput)).perform(typeText("test@example.com"))
    onView(withId(R.id.passwordInput)).perform(typeText("password123"))
    onView(withId(R.id.loginButton)).perform(click())

    // Then
    verify(viewModel).login("test@example.com", "password123")
}
```

### 4. 연동(Integration) 테스팅

여러 페이지에 걸쳐 유저의 행동을 모방하여 구현합니다.

```kotlin
@Test
fun `complete user registration flow`() {
    // 회원가입 화면 진입
    onView(withId(R.id.registerButton)).perform(click())

    // 이메일 입력
    onView(withId(R.id.emailInput)).perform(typeText("newuser@example.com"))
    onView(withId(R.id.nextButton)).perform(click())

    // 비밀번호 설정
    onView(withId(R.id.passwordInput)).perform(typeText("SecurePass123!"))
    onView(withId(R.id.confirmPasswordInput)).perform(typeText("SecurePass123!"))
    onView(withId(R.id.submitButton)).perform(click())

    // 완료 확인
    onView(withId(R.id.welcomeMessage))
        .check(matches(isDisplayed()))
}
```

## 서버 API 테스트 자동화

### 외부 의존성 처리 전략

유저가 서비스 내에서 가져오는 다양한 외부 데이터(KYC, 계좌 거래내역, 신용정보 등)에 대한 테스트 전략입니다.

#### Mock 서버 운영 방식

```python
# Mock API 서버 설정
class MockThirdPartyServer:
    def __init__(self):
        self.mock_data = {}

    def set_mock_response(self, unique_id: str, response_data: dict):
        """특정 ID에 대한 Mock 응답 설정"""
        self.mock_data[unique_id] = response_data

    def get_response(self, unique_id: str):
        """설정된 Mock 응답 반환"""
        return self.mock_data.get(unique_id, self.default_response)

# 테스트에서 활용
@pytest.fixture
def mock_kyc_server():
    server = MockThirdPartyServer()
    server.set_mock_response("user_123", {
        "status": "verified",
        "score": 85,
        "documents": ["passport", "utility_bill"]
    })
    return server

def test_loan_approval_with_verified_kyc(mock_kyc_server):
    # Given: KYC 검증된 사용자
    user_id = "user_123"

    # When: 대출 신청
    result = loan_service.apply(user_id)

    # Then: 승인 확인
    assert result.status == "approved"
```

### 테스트 케이스 조합 관리

```python
# 3rd Party A, B에 대한 다양한 케이스 조합
class TestLoanScenarios:

    @pytest.mark.parametrize("kyc_status,credit_score,expected", [
        ("verified", 700, "approved"),
        ("verified", 500, "manual_review"),
        ("pending", 800, "pending"),
        ("rejected", 750, "rejected"),
    ])
    def test_loan_decision_matrix(
        self, kyc_status, credit_score, expected,
        mock_kyc_server, mock_credit_server
    ):
        # Given: 각 서비스의 Mock 데이터 설정
        mock_kyc_server.set_status(kyc_status)
        mock_credit_server.set_score(credit_score)

        # When: 대출 심사 실행
        result = loan_service.evaluate()

        # Then: 예상 결과 확인
        assert result.decision == expected
```

### QA 테스트 vs 개발 통합 테스트

| 구분 | QA 테스트 자동화 | 개발 통합 테스트 |
|------|-----------------|-----------------|
| 관점 | 사용자 관점 | 개발자 관점 |
| 범위 | E2E 비즈니스 플로우 | 모듈 간 연동 |
| 코드 접근 | 서버 코드 모름 | 서버 코드 알음 |
| 목적 | 비즈니스 검증 | 기술적 검증 |

**QA 테스트의 가치**: 개발에 의존성 없이, 유저의 입장에서 모든 비즈니스 로직 케이스를 테스트하는 데 의의가 있습니다.

## TDD (Test-Driven Development)

### TDD 사이클

```
Red -> Green -> Refactor -> (반복)

1. Red: 실패하는 테스트 작성
2. Green: 테스트를 통과하는 최소한의 코드 작성
3. Refactor: 코드 개선 (테스트는 계속 통과)
```

### TDD 실천 예시

```python
# Step 1: Red - 실패하는 테스트 작성
def test_calculate_discount_price():
    product = Product(price=10000)
    discount = Discount(percentage=20)

    result = calculate_discount_price(product, discount)

    assert result == 8000  # 20% 할인된 가격

# Step 2: Green - 테스트 통과하는 최소 코드
def calculate_discount_price(product, discount):
    return product.price * (1 - discount.percentage / 100)

# Step 3: Refactor - 엣지 케이스 추가 및 개선
def test_calculate_discount_price_with_max_discount():
    product = Product(price=10000)
    discount = Discount(percentage=100)  # 100% 할인

    result = calculate_discount_price(product, discount)

    assert result == 0

def test_calculate_discount_price_with_no_discount():
    product = Product(price=10000)
    discount = Discount(percentage=0)

    result = calculate_discount_price(product, discount)

    assert result == 10000
```

### Mock API를 활용한 TDD

```python
# API Specification을 토대로 Mock 데이터 생성
MOCK_USER_RESPONSE = {
    "id": 1,
    "email": "test@example.com",
    "profile": {
        "name": "Test User",
        "avatar": "https://example.com/avatar.png"
    }
}

# 테스트 작성
def test_user_service_returns_user():
    # Given
    mock_api = MockUserApi(response=MOCK_USER_RESPONSE)
    service = UserService(api=mock_api)

    # When
    user = service.get_user(user_id=1)

    # Then
    assert user.id == 1
    assert user.email == "test@example.com"
    assert user.profile.name == "Test User"
```

## 테스트 자동화 도구 활용

### Lint 및 정적 분석

```yaml
# .github/workflows/quality.yml
name: Code Quality

on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Run Lint
        run: |
          pip install flake8 pylint
          flake8 src/
          pylint src/

      - name: Run SonarQube
        uses: SonarSource/sonarqube-scan-action@master
        env:
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
```

### 테스트 실행 자동화

```yaml
# 테스트 단계별 실행
test:
  runs-on: ubuntu-latest
  steps:
    - name: Unit Tests
      run: pytest tests/unit -v --cov=src

    - name: Integration Tests
      run: pytest tests/integration -v

    - name: E2E Tests
      run: pytest tests/e2e -v
```

## 테스트 작성 가이드라인

### 좋은 테스트의 특징 (FIRST)

- **Fast**: 빠르게 실행
- **Independent**: 다른 테스트에 의존하지 않음
- **Repeatable**: 어떤 환경에서도 동일한 결과
- **Self-validating**: 성공/실패가 명확
- **Timely**: 제때 작성 (코드와 함께)

### 테스트 이름 작성법

```python
# Good: 행동과 예상 결과를 명확히
def test_user_with_valid_credentials_can_login():
    pass

def test_expired_token_returns_401_error():
    pass

def test_order_total_includes_tax():
    pass

# Bad: 모호한 이름
def test_login():
    pass

def test_order():
    pass
```

### 로그 활용

```python
# 각 스텝별 로그 찍기
import logging

logger = logging.getLogger(__name__)

def process_order(order: Order) -> OrderResult:
    logger.info(f"Processing order: {order.id}")

    # Step 1: 검증
    logger.debug(f"Validating order items: {len(order.items)} items")
    validated = validate_order(order)

    # Step 2: 결제
    logger.info(f"Processing payment: {order.total_amount}")
    payment_result = process_payment(order)

    # Step 3: 완료
    logger.info(f"Order completed: {order.id}")
    return OrderResult(success=True, order_id=order.id)
```

## 결론

효과적인 테스팅은 소프트웨어 품질의 근간입니다.

핵심 포인트:
- **테스트 피라미드 준수**: Unit > Integration > E2E
- **TDD 실천**: 테스트 먼저 작성
- **Mock 전략**: 외부 의존성 격리
- **자동화**: CI/CD 파이프라인에 통합
- **지속적 개선**: 테스트 커버리지 및 품질 모니터링

테스트는 비용이 아닌 투자입니다. 초기에는 시간이 더 걸리지만, 장기적으로 버그 수정 비용과 유지보수 비용을 크게 줄여줍니다.

---

## 참고 자료

- Test-Driven Development by Kent Beck
- xUnit Test Patterns by Gerard Meszaros
- Growing Object-Oriented Software, Guided by Tests
