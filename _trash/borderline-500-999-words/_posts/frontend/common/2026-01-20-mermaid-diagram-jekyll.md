---
layout: post
title: "Jekyll 블로그에 Mermaid 다이어그램 추가하기"
date: 2026-01-20 10:00:00 +0900
categories: [frontend, common]
description: "Jekyll 블로그에서 Mermaid.js를 사용하여 플로우차트, 시퀀스 다이어그램, 클래스 다이어그램 등을 마크다운으로 쉽게 그리는 방법을 알아봅니다."
tags: [Jekyll, Mermaid, Diagram, Markdown, Blog]
image: /assets/images/posts/thumbnails/2026-01-20-mermaid-diagram-jekyll.png
---

기술 블로그를 운영하다 보면 아키텍처, 플로우차트, 시퀀스 다이어그램 등을 그려야 할 때가 많습니다. 이미지 파일을 별도로 만들어 첨부하는 방식은 번거롭고 수정도 어렵습니다. Mermaid.js를 사용하면 마크다운 코드 블록 안에서 텍스트로 다이어그램을 정의하고, 이를 자동으로 렌더링할 수 있습니다.

## Mermaid란?

[Mermaid](https://mermaid.js.org/)는 텍스트 기반 다이어그램 생성 도구입니다. 마크다운과 유사한 문법으로 다양한 다이어그램을 만들 수 있습니다.

**지원하는 다이어그램 종류:**
- Flowchart (플로우차트)
- Sequence Diagram (시퀀스 다이어그램)
- Class Diagram (클래스 다이어그램)
- State Diagram (상태 다이어그램)
- Entity Relationship Diagram (ERD)
- Gantt Chart (간트 차트)
- Pie Chart (파이 차트)
- 그 외 다수

---

## Jekyll에 Mermaid 설정하기

### 1. head.html에 스크립트 추가

`_includes/head.html` 파일에 다음 코드를 추가합니다:

```html
<!-- Mermaid Diagram Support -->
<script type="module">
  import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
  mermaid.initialize({ startOnLoad: false });

  // Convert Jekyll code blocks to mermaid diagrams
  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('pre code.language-mermaid, div.language-mermaid pre code').forEach(function(codeBlock) {
      const container = codeBlock.closest('div.language-mermaid') || codeBlock.parentElement;
      const pre = document.createElement('pre');
      pre.className = 'mermaid';
      pre.textContent = codeBlock.textContent;
      container.replaceWith(pre);
    });
    mermaid.run();
  });
</script>
```

이 스크립트는:
1. Mermaid 라이브러리를 CDN에서 로드합니다
2. Jekyll이 생성하는 코드 블록(`language-mermaid`)을 찾아 Mermaid가 인식할 수 있는 형태로 변환합니다
3. 페이지 로드 완료 후 다이어그램을 렌더링합니다

---

## 사용 방법

마크다운 파일에서 `mermaid` 코드 블록을 사용하면 됩니다:

````markdown
```mermaid
graph TD
    A[시작] --> B{조건 확인}
    B -->|Yes| C[처리]
    B -->|No| D[종료]
    C --> D
```
````

**결과:**

```mermaid
graph TD
    A[시작] --> B{조건 확인}
    B -->|Yes| C[처리]
    B -->|No| D[종료]
    C --> D
```

---

## 다이어그램 예제

### Flowchart (플로우차트)

방향 옵션: `TB` (위→아래), `BT` (아래→위), `LR` (왼쪽→오른쪽), `RL` (오른쪽→왼쪽)

```mermaid
graph LR
    A[사용자 요청] --> B[API Gateway]
    B --> C[인증 서버]
    C --> D{인증 성공?}
    D -->|Yes| E[서비스 처리]
    D -->|No| F[401 에러]
    E --> G[응답 반환]
```

**노드 모양:**
- `[텍스트]` - 사각형
- `(텍스트)` - 둥근 모서리
- `{텍스트}` - 마름모 (조건)
- `((텍스트))` - 원
- `[[텍스트]]` - 서브루틴

---

### Sequence Diagram (시퀀스 다이어그램)

```mermaid
sequenceDiagram
    participant U as User
    participant C as Client
    participant S as Server
    participant DB as Database

    U->>C: 로그인 요청
    C->>S: POST /api/login
    S->>DB: 사용자 조회
    DB-->>S: 사용자 정보
    S-->>C: JWT 토큰
    C-->>U: 로그인 성공
```

**화살표 종류:**
- `->` : 실선
- `-->` : 점선
- `->>` : 실선 + 화살표
- `-->>` : 점선 + 화살표

---

### Class Diagram (클래스 다이어그램)

```mermaid
classDiagram
    class User {
        +String name
        +String email
        +login()
        +logout()
    }
    class Order {
        +int orderId
        +Date orderDate
        +calculate()
    }
    class Product {
        +String name
        +float price
    }

    User "1" --> "*" Order : places
    Order "*" --> "*" Product : contains
```

---

### State Diagram (상태 다이어그램)

```mermaid
stateDiagram-v2
    [*] --> Idle
    Idle --> Processing : 요청 수신
    Processing --> Success : 처리 완료
    Processing --> Error : 처리 실패
    Success --> [*]
    Error --> Idle : 재시도
```

---

### ERD (Entity Relationship Diagram)

```mermaid
erDiagram
    USER ||--o{ ORDER : places
    ORDER ||--|{ ORDER_ITEM : contains
    PRODUCT ||--o{ ORDER_ITEM : "ordered in"

    USER {
        int id PK
        string name
        string email
    }
    ORDER {
        int id PK
        int user_id FK
        date created_at
    }
    PRODUCT {
        int id PK
        string name
        decimal price
    }
```

---

### Gantt Chart (간트 차트)

```mermaid
gantt
    title 프로젝트 일정
    dateFormat  YYYY-MM-DD
    section 기획
    요구사항 분석    :a1, 2026-01-01, 7d
    설계 문서 작성   :a2, after a1, 5d
    section 개발
    백엔드 개발      :b1, after a2, 14d
    프론트엔드 개발  :b2, after a2, 14d
    section 테스트
    통합 테스트      :c1, after b1, 7d
```

---

### Pie Chart (파이 차트)

```mermaid
pie title 기술 스택 비율
    "JavaScript" : 40
    "Python" : 30
    "Java" : 20
    "기타" : 10
```

---

## 테마 설정

Mermaid는 다양한 테마를 지원합니다. `mermaid.initialize()`에서 설정할 수 있습니다:

```javascript
mermaid.initialize({
  startOnLoad: false,
  theme: 'dark'  // default, dark, forest, neutral
});
```

---

## 마무리

Mermaid를 사용하면 복잡한 다이어그램도 텍스트로 쉽게 작성할 수 있습니다. Git으로 버전 관리가 되고, 수정도 간편합니다. 기술 문서나 블로그 포스트에 적극 활용해보세요.

**참고 자료:**
- [Mermaid 공식 문서](https://mermaid.js.org/intro/)
- [Mermaid Live Editor](https://mermaid.live/) - 실시간 미리보기
