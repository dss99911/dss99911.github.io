---
layout: post
title: "기술 면접 완벽 가이드 - 개발자 채용 프로세스와 면접 질문 모음"
date: 2026-01-11
categories: [programming, career]
tags: [interview, career, hiring, software-engineer, android, backend]
image: /assets/images/posts/technical-interview-guide.png
---

소프트웨어 개발자 기술 면접을 준비하는 분들을 위한 종합 가이드입니다. 채용 프로세스부터 분야별 면접 질문, 효과적인 답변 방법까지 상세히 다룹니다.

## 채용 프로세스 개요

### 일반적인 채용 단계

```
1. 서류 심사 (HR + Dev)
2. 코딩 테스트
3. 기술 면접 (1-2회)
4. 컬쳐핏/최종 면접
5. 연봉 협상
```

### 각 단계별 상세

#### 1. 서류 심사

**HR 확인 사항**
- 이력서에 필요한 키워드가 충분히 있는지
- 경력 연차와 포지션 적합성
- 지원 동기

**Dev 확인 사항**
- 기술 스택 적합성
- 프로젝트 경험의 깊이
- 오픈소스 기여, 블로그 등 활동

#### 2. 코딩 테스트

**평가 기준**
- 문제 해결 능력
- 코드 품질 (가독성, 구조)
- 시간/공간 복잡도 최적화

#### 3. 기술 면접

**주요 평가 항목**
- 기술 프레임워크 이해도
- 커뮤니케이션 능력
- 아키텍처 설계 능력
- 문제 해결 접근법
- 비즈니스 이해도

## 공통 면접 질문

### 자기소개 및 경력

```markdown
Q: 이전 회사 중 가장 좋았던 곳과 이유는?
- 기술적 성장 기회
- 팀 문화
- 프로젝트의 영향력

Q: 가장 자랑스러운 프로젝트와 그 구조를 설명해주세요
- 프로젝트의 목적과 비즈니스 가치
- 본인의 역할과 기여도
- 기술적 도전과 해결 방법
- 모듈 구조와 통신 방식 (다이어그램)

Q: 버전 관리 도구는 어떻게 사용했나요?
- Git 브랜치 전략
- 코드 리뷰 프로세스
- 배포 방식
```

### 본인의 강점

```markdown
Q: 가장 큰 강점은 무엇인가요?

좋은 답변 예시:
"저의 가장 큰 강점은 문제 해결 접근법입니다.
복잡한 버그나 성능 이슈를 만나면,
먼저 문제를 작은 단위로 분해하고,
가설을 세워 하나씩 검증합니다.
예를 들어, 이전 프로젝트에서 앱이 특정 상황에서
ANR이 발생하는 문제가 있었는데..."
```

## 디자인 패턴

### 자주 묻는 질문

```markdown
Q: 가장 좋아하는 디자인 패턴은?

좋은 답변:
패턴 이름 + 왜 좋아하는지 + 실제 적용 경험

예시:
"Observer 패턴을 좋아합니다.
데이터 변경을 여러 컴포넌트에 전파할 때 유용하고,
특히 Android의 LiveData나 Flow를 사용할 때
자연스럽게 적용됩니다."
```

### Builder vs Factory 패턴

```kotlin
// Builder 패턴
// 복잡한 객체를 단계별로 생성
// 선택적 매개변수가 많을 때 유용
val user = User.Builder()
    .name("John")
    .email("john@example.com")
    .age(30)  // 선택적
    .build()

// Factory 패턴
// 객체 생성 로직을 캡슐화
// 타입에 따라 다른 객체 생성
val payment = PaymentFactory.create(PaymentType.CREDIT_CARD)
```

```markdown
Q: Builder와 Factory 패턴의 차이점?

- Builder: 복잡한 객체를 단계별로 구성, 동일한 구성 과정에서 다른 표현
- Factory: 객체 생성 로직을 캡슐화, 조건에 따라 다른 타입의 객체 생성
```

## Android 개발 면접

### 아키텍처

```markdown
Q: Observer 패턴과 MVP, MVVM의 관계는?

- Observer: 데이터 변경 시 구독자에게 알림
- MVP: Presenter가 View 인터페이스를 통해 통신
- MVVM: ViewModel의 데이터를 View가 observe

Q: MVVM의 장단점?

장점:
- View와 비즈니스 로직 분리
- 테스트 용이성
- 생명주기 안전한 데이터 처리

단점:
- 소규모 프로젝트에서는 오버헤드
- 초기 학습 곡선
- 복잡한 상태 관리
```

### 디버깅 및 테스트

```markdown
Q: 버그를 어떻게 찾나요?

1. 문제 재현
2. 로그 확인 (Logcat)
3. 디버거 활용 (breakpoint)
4. 프로파일러로 성능 분석

Q: 버그 없는 앱을 어떻게 만드나요?

- TDD 적용
- Unit Test로 비즈니스 로직 검증
- UI Test로 사용자 시나리오 검증
- 코드 리뷰
- Lint 및 정적 분석 도구
```

### 성능

```markdown
Q: 메모리 릭을 어떻게 찾나요?

- Android Profiler의 Memory 탭
- LeakCanary 라이브러리
- Heap Dump 분석

Q: 메모리 릭의 일반적인 원인과 해결책?

1. Context 누수
   - Activity Context 대신 Application Context
   - WeakReference 사용

2. 익명 클래스/내부 클래스
   - 정적 내부 클래스 + WeakReference

3. Handler/Runnable
   - onDestroy에서 removeCallbacks

4. Listener 미해제
   - 등록 해제 확실히
```

```kotlin
// 메모리 릭 예방 예시
class MyActivity : AppCompatActivity() {

    // BAD: Activity 참조 유지
    private val handler = Handler(Looper.getMainLooper())
    private val runnable = Runnable {
        // Activity 참조 가능
    }

    // GOOD: WeakReference 사용
    private class SafeHandler(activity: MyActivity) : Handler(Looper.getMainLooper()) {
        private val activityRef = WeakReference(activity)

        override fun handleMessage(msg: Message) {
            activityRef.get()?.let { activity ->
                // 안전하게 Activity 사용
            }
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        handler.removeCallbacksAndMessages(null)
    }
}
```

### GPU Overdraw

```markdown
Q: GPU Overdraw란?

같은 픽셀을 여러 번 그리는 것
- 불필요한 배경색
- 겹치는 뷰
- 투명 레이어

해결책:
- 불필요한 배경 제거
- 뷰 계층 단순화
- clipRect() 사용
```

### Android 핵심 개념

```markdown
Q: 스레드와 프로세스의 차이?

프로세스:
- 독립적인 메모리 공간
- 앱 단위로 생성
- 무거운 통신 (IPC)

스레드:
- 프로세스 내 메모리 공유
- 가벼운 통신
- UI 스레드는 반드시 하나

Q: Activity Lifecycle?

onCreate -> onStart -> onResume
(Running)
onPause -> onStop -> onDestroy

Q: Serializable vs Parcelable?

Serializable:
- 자바 표준
- 리플렉션 사용
- 느림

Parcelable:
- Android 전용
- 명시적 직렬화
- 빠름
```

### 라이브러리

```markdown
Q: Retrofit의 장점과 활용법?

장점:
- 선언적 API 정의
- 자동 직렬화/역직렬화
- 다양한 어댑터 지원

활용:
- Interceptor로 공통 헤더/로깅
- Converter로 JSON 파싱
- CallAdapter로 RxJava/Coroutine 지원

Q: Dagger/Hilt의 역할?

- 의존성 주입 자동화
- 테스트 용이성 (Mock 주입)
- 생명주기 관리
- 보일러플레이트 감소
```

### 자료구조

```markdown
Q: List에서 아이템을 안전하게 제거하는 방법?

// BAD: ConcurrentModificationException 발생
for (item in list) {
    if (condition) list.remove(item)
}

// GOOD: Iterator 사용
val iterator = list.iterator()
while (iterator.hasNext()) {
    if (condition) iterator.remove()
}

// BETTER: filter 사용
list = list.filter { !condition }
```

## Git 면접 질문

```markdown
Q: 두 버전을 동시에 개발해야 할 때?

- 브랜치 전략: feature/v1, feature/v2
- 공통 코드는 develop에서 관리
- 필요시 cherry-pick으로 이식

Q: 특정 버전 코드를 확인하려면?

- Tag 사용: git tag v1.0.0
- 태그로 체크아웃: git checkout v1.0.0
- 또는 commit hash로 체크아웃
```

## 아키텍처 심화

### LiveData vs Observable

```markdown
Q: LiveData와 ObservableField의 차이?

LiveData:
- Lifecycle aware
- 자동으로 구독 해제
- 메인 스레드에서만 값 설정 (postValue 제외)

ObservableField:
- Data Binding 전용
- Lifecycle aware 아님
- 어느 스레드에서든 설정 가능
```

### Transformations

```kotlin
// map: 값 변환
val userName: LiveData<String> = Transformations.map(user) {
    it.name
}

// switchMap: 다른 LiveData로 전환
val userOrders: LiveData<List<Order>> = Transformations.switchMap(userId) { id ->
    repository.getOrders(id)
}
```

### Coroutine

```markdown
Q: Coroutine의 장점?

- 비동기 코드를 동기 코드처럼 작성
- 경량 스레드 (수천 개 생성 가능)
- 구조화된 동시성
- 취소 지원

Q: apply, let, also, run 차이?

let: it으로 참조, 람다 결과 반환
apply: this로 참조, 원본 객체 반환
also: it으로 참조, 원본 객체 반환
run: this로 참조, 람다 결과 반환
with: run과 동일하지만 확장함수 아님
```

## Integration (서버 연동)

```markdown
Q: Session vs Token 인증?

Session:
- 서버에 상태 저장
- 확장성 제한
- 모바일에 부적합

Token (JWT):
- 무상태 (stateless)
- 서버 확장 용이
- 토큰에 정보 포함 가능

Q: 토큰을 어디에 저장하나요?

- EncryptedSharedPreferences
- Android Keystore
- DataStore (암호화)
```

## 보안

```markdown
Q: 회원가입 과정의 보안은?

1. HTTPS 통신
2. 비밀번호 해시 (서버)
3. 토큰 안전 저장 (클라이언트)
4. Certificate Pinning
5. 루팅 감지

Q: JWT 토큰이란?

Header.Payload.Signature
- Header: 알고리즘, 타입
- Payload: 클레임 (사용자 정보)
- Signature: 검증용 서명
```

## 면접 팁

### 답변 구조화 (STAR 방법)

```markdown
Situation: 상황 설명
Task: 주어진 과제
Action: 취한 행동
Result: 결과

예시:
S: "이전 프로젝트에서 앱 로딩 시간이 5초 이상 걸렸습니다"
T: "사용자 이탈을 줄이기 위해 2초 이내로 개선해야 했습니다"
A: "Splash 화면에서 필수 데이터만 로드하고, 나머지는 지연 로딩으로 변경했습니다"
R: "로딩 시간이 1.5초로 단축되어 첫 주 리텐션이 15% 개선되었습니다"
```

### 모르는 질문 대처

```markdown
솔직하게 인정 + 접근 방법 설명

"정확히는 모르지만, 제가 알기로는..."
"해당 경험은 없지만, 비슷한 상황에서는..."
"직접 사용해보지는 않았지만, 문서를 보면서 접근하겠습니다"
```

### 마지막 질문 시간

```markdown
좋은 질문 예시:
- "팀의 코드 리뷰 문화는 어떤가요?"
- "신규 입사자의 온보딩 과정은?"
- "기술 부채를 어떻게 관리하나요?"
- "팀에서 사용하는 기술 스택 선택 기준은?"
```

## 결론

기술 면접 준비의 핵심:

1. **기본기 탄탄히**: 자료구조, 알고리즘, 디자인 패턴
2. **프로젝트 경험 정리**: 구체적인 기여와 결과
3. **why 질문 준비**: 왜 그 기술을 선택했는지
4. **소통 능력**: 기술을 비개발자에게 설명할 수 있는지
5. **학습 의지**: 새로운 기술에 대한 관심과 학습 방법

면접은 서로를 알아가는 과정입니다. 자신감을 갖고 솔직하게 대화하세요.

---

## 참고 자료

- [Android Developer Interview Questions](https://developer.android.com/guide)
- [System Design Interview](https://github.com/donnemartin/system-design-primer)
- [Cracking the Coding Interview](http://www.crackingthecodinginterview.com/)
