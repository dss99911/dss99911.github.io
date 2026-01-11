---
layout: post
title: "Agile 개발 방법론 완벽 가이드 - 스크럼, XP, 칸반 비교"
date: 2026-01-11
categories: [programming, methodology]
tags: [agile, scrum, xp, kanban, development-methodology, software-engineering]
image: /assets/images/posts/agile-development-methodology.png
---

소프트웨어 개발 방법론의 핵심인 Agile에 대해 깊이 있게 알아봅니다. 전통적인 폭포수 모델과의 차이점, 다양한 Agile 방법론들, 그리고 실제 적용 방법까지 상세히 다룹니다.

## Agile이란?

Agile은 **계획이 없는 개발 방법과 계획이 지나치게 많은 개발 방법 사이의 타협점**을 찾는 방법론입니다.

### 핵심 철학

Agile의 영어 의미는 "기민한"으로, 핵심은 **좋은 것을 빠르고 낭비 없이 만드는 것**, 즉 **극한의 효율**을 추구합니다.

전통적인 폭포수 모델(Waterfall)이나 나선 모형과의 가장 큰 차이점:

- **Less Document-oriented**: 문서 중심이 아님
- **Code-oriented**: 실질적인 코딩을 통한 방법론

### 전통적 방법론과의 차이

| 구분 | 폭포수(Waterfall) | Agile |
|------|-------------------|-------|
| 접근 방식 | 계획 주도 (Plan-driven) | 적응형 (Adaptive) |
| 변경 수용 | 어려움 | 유연함 |
| 문서화 | 무거운 문서화 | 최소한의 문서화 |
| 피드백 주기 | 프로젝트 종료 시점 | 매 이터레이션 |
| 고객 참여 | 초기와 종료 시점 | 지속적 참여 |

## Agile의 핵심 원칙

Agile은 **일정한 주기를 가지고 끊임없이 프로토타입을 만들어**, 변경되는 요구사항을 반영해 개발해 나가는 **Adaptive Style**입니다.

이러한 변화에 잘 적응하기 위해 **객체 지향 프로그래밍**을 적극 활용합니다.

### Agile Manifesto (2001)

```
개인과 상호작용 > 프로세스와 도구
작동하는 소프트웨어 > 포괄적인 문서
고객과의 협력 > 계약 협상
변화에 대응 > 계획 따르기
```

## 주요 Agile 방법론

다양한 Agile 방법론들은 서로 조합하여 사용할 수 있습니다.

### 1. 익스트림 프로그래밍 (XP, Extreme Programming)

#### TDD (Test-Driven Development)
- 테스트 코드를 먼저 작성
- 테스트를 통과하는 최소한의 코드 작성
- 리팩토링을 통한 코드 개선

#### 주요 실천 방법

**2주 단위 스프린트**
- 2주를 주기로 계획을 세우고 프로토타입 생성
- 주기적으로 의뢰자/사용자에게 방향성 확인

**간단한 코딩 (KISS 원칙)**
- Keep It Simple, Stupid
- 복잡함을 피하고 단순함을 추구

**테스트 후 코딩**
- 테스트 케이스를 먼저 작성
- 테스트를 통과하는 코드 구현

**페어 프로그래밍**
- 두 명의 개발자가 한 컴퓨터에서 작업
- 한 명은 코딩, 한 명은 리뷰/QA
- 또는 함께 코딩 후 테스트

```python
# XP 스타일의 페어 프로그래밍 예시
# Driver: 코드 작성
# Navigator: 전략적 방향 제시, 즉각적인 코드 리뷰

def test_user_registration():
    """먼저 테스트를 작성 (Navigator가 제안)"""
    user = User.create(email="test@example.com", password="secure123")
    assert user.is_active == True
    assert user.email_verified == False

# 테스트를 통과하는 최소한의 코드 작성 (Driver가 구현)
class User:
    def __init__(self, email, password):
        self.email = email
        self.password = password
        self.is_active = True
        self.email_verified = False

    @classmethod
    def create(cls, email, password):
        return cls(email, password)
```

### 2. 스크럼 (Scrum)

**30일 단위의 Sprint**를 중심으로 한 방법론입니다.

#### 주요 구성 요소

**역할 (Roles)**
- Product Owner: 제품 백로그 관리, 우선순위 결정
- Scrum Master: 팀 보호, 장애물 제거
- Development Team: 실제 개발 수행

**이벤트 (Events)**
- Sprint Planning: 스프린트 목표 및 작업 계획
- Daily Scrum: 15분 스탠드업 미팅
- Sprint Review: 결과물 데모 및 피드백
- Sprint Retrospective: 프로세스 개선 논의

**산출물 (Artifacts)**
- Product Backlog: 전체 요구사항 목록
- Sprint Backlog: 해당 스프린트 작업 목록
- Increment: 완성된 기능의 합

```
Sprint 구조:
Day 1: Sprint Planning (4-8시간)
Day 2-29: Daily Scrum (15분) + 개발 작업
Day 30: Sprint Review (2-4시간) + Retrospective (1.5-3시간)
```

### 3. 크리스털 패밀리 (Crystal Family)

프로젝트 규모와 영향의 크기에 따라 여러 종류의 방법론을 제공합니다.

| 방법론 | 팀 규모 | 특징 |
|--------|---------|------|
| Crystal Clear | 1-6명 | 가장 가벼운 프로세스 |
| Crystal Yellow | 7-20명 | 중간 수준의 프로세스 |
| Crystal Orange | 21-40명 | 더 많은 문서화 필요 |
| Crystal Red | 41-80명 | 높은 수준의 조율 필요 |

### 4. FDD (Feature-Driven Development)

UML을 이용한 설계 기법과 밀접하게 연관된 방법론입니다.

- Feature(기능) 단위로 2주 정도의 반복 개발
- 도메인 모델링 중심
- 기능 목록 기반의 진행 상황 추적

```
FDD 프로세스:
1. 전체 모델 개발 (Develop Overall Model)
2. 기능 목록 작성 (Build Feature List)
3. 기능별 계획 (Plan by Feature)
4. 기능별 설계 (Design by Feature)
5. 기능별 구현 (Build by Feature)
```

### 5. ASD (Adaptive Software Development)

**사용자나 고객이 설계에 참가**하는 개발 방법론입니다.

- 소프트웨어 개발을 **혼란 자체**로 규정
- 그 혼란에 적응할 수 있는 방법 제시
- 지속적인 학습과 적응 강조

### 6. 익스트림 모델링 (Extreme Modeling)

UML을 이용한 **모델링 중심** 방법론입니다.

- 언제나 실행 가능하고 검증할 수 있는 모델 작성
- 모델 작성 공정을 반복
- 최종적으로 모델로부터 자동으로 제품 생성

## 실제 적용 가이드

### 1. 팀 규모에 따른 방법론 선택

```
1-6명: Crystal Clear + XP 조합
7-15명: Scrum + XP
16명 이상: SAFe (Scaled Agile Framework)
```

### 2. 효과적인 스프린트 운영

**Sprint 계획 단계**
```markdown
1. 목표 설정
   - 이번 스프린트에서 달성할 비즈니스 가치 정의

2. 백로그 아이템 선택
   - 우선순위 기반 선택
   - 팀 용량(Velocity) 고려

3. 태스크 분해
   - 각 스토리를 구체적인 작업으로 분해
   - 예상 시간 산정
```

**Daily Scrum 효과적으로 하기**
```markdown
세 가지 질문:
1. 어제 무엇을 했나요?
2. 오늘 무엇을 할 예정인가요?
3. 장애물이 있나요?

주의사항:
- 15분 이내로 유지
- 문제 해결은 별도 미팅에서
- 서서 진행 (Stand-up)
```

### 3. 칸반 보드 활용

```
[To Do] -> [In Progress] -> [Review] -> [Done]
   |            |              |          |
   |      WIP Limit: 3    WIP Limit: 2    |
   +------ 우선순위로 정렬 ------+
```

### 4. 회고(Retrospective) 프레임워크

**Start-Stop-Continue**
```markdown
Start (시작할 것):
- 페어 프로그래밍 도입
- 코드 리뷰 자동화

Stop (멈출 것):
- 야근으로 인한 번아웃
- 불필요한 미팅

Continue (계속할 것):
- Daily Scrum
- TDD 적용
```

**4L 회고**
- Liked: 좋았던 점
- Learned: 배운 점
- Lacked: 부족했던 점
- Longed for: 바라는 점

## Agile 도입 시 주의사항

### 흔한 실수들

1. **형식만 따르기**: 스크럼 미팅만 하고 Agile 정신 무시
2. **문서화 완전 배제**: 최소한의 문서화는 필요
3. **고객 참여 부재**: Agile의 핵심인 지속적 피드백 무시
4. **기술 부채 무시**: 리팩토링 시간 확보 실패

### 성공적인 Agile 전환을 위한 팁

```markdown
1. 작게 시작하기
   - 한 팀에서 파일럿 운영
   - 점진적으로 확대

2. 경영진 지원 확보
   - 단기 생산성 하락 이해
   - 장기적 효과 공유

3. 지속적인 학습
   - Retrospective 활용
   - 외부 코칭 고려

4. 도구 활용
   - Jira, Trello 등 프로젝트 관리 도구
   - CI/CD 파이프라인 구축
```

## 결론

Agile은 단순한 방법론이 아닌 **마인드셋의 변화**입니다. 고객에게 가치를 빠르게 전달하고, 변화에 유연하게 대응하며, 팀의 지속적인 개선을 추구합니다.

성공적인 Agile 도입을 위해서는:
- 팀 상황에 맞는 방법론 선택
- 지속적인 실험과 개선
- 열린 소통 문화 조성

이 필수적입니다. 어떤 방법론을 선택하든, 핵심은 **고객 가치 중심의 반복적 개선**입니다.

---

## 참고 자료

- Agile Manifesto: [https://agilemanifesto.org](https://agilemanifesto.org)
- Scrum Guide: [https://scrumguides.org](https://scrumguides.org)
- Extreme Programming: [http://www.extremeprogramming.org](http://www.extremeprogramming.org)
