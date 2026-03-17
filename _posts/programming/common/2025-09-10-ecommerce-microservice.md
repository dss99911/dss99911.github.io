---
layout: post
title: "E-commerce 플랫폼과 Microservice 아키텍처"
date: 2025-12-28
categories: [programming, common]
tags: [ecommerce, microservice, architecture, payment-gateway]
image: /assets/images/posts/thumbnails/2025-12-28-ecommerce-microservice.png
redirect_from:
  - "/programming/common/2025/12/28/ecommerce-microservice.html"
---

E-commerce 플랫폼 구축과 Microservice 아키텍처에 대한 자료를 정리했습니다.

## E-commerce 플랫폼

### 주요 플랫폼

- **Magento**: 오픈소스 e-commerce 플랫폼
- **PayU**: Payment Gateway 서비스

### 오픈소스 스토어 라이브러리

- **Saleor**: Python/Django 기반 헤드리스 커머스 플랫폼
  - GitHub: [https://github.com/mirumee/saleor](https://github.com/mirumee/saleor)

## Microservice 아키텍처

### 참고 자료

- **Martin Fowler의 Microservices 가이드**: [https://martinfowler.com/articles/microservices.html](https://martinfowler.com/articles/microservices.html)
  - Microservice 아키텍처의 기본 개념과 특징을 설명하는 필수 자료

- **How to Cook Microservices**: [http://howtocookmicroservices.com/](http://howtocookmicroservices.com/)
  - 실용적인 Microservice 구현 가이드

- **Microservices Architecture for E-commerce**: [https://www.slideshare.net/divanteltd/microservices-architecture-for-ecommerce](https://www.slideshare.net/divanteltd/microservices-architecture-for-ecommerce)
  - E-commerce에 특화된 Microservice 아키텍처 설계

## 핵심 개념

### Microservice의 장점

1. 독립적인 배포
2. 기술 스택의 유연성
3. 확장성
4. 장애 격리

### E-commerce에서의 적용

- 상품 카탈로그 서비스
- 주문 관리 서비스
- 결제 서비스
- 사용자 인증 서비스
- 재고 관리 서비스

---

## Microservice 설계 시 고려 사항

### 서비스 경계 정의

E-commerce 시스템에서 서비스 경계를 잘못 나누면 오히려 모놀리스보다 복잡해질 수 있습니다. 각 서비스는 하나의 비즈니스 도메인을 담당해야 하며, 서비스 간 의존성을 최소화해야 합니다. DDD(Domain-Driven Design)의 Bounded Context 개념을 활용하면 자연스러운 서비스 경계를 찾을 수 있습니다.

### 서비스 간 통신

Microservice 간 통신 방식은 크게 두 가지로 나뉩니다:

- **동기 통신 (Synchronous)**: REST API, gRPC를 사용합니다. 주문 생성 시 재고 확인처럼 즉각적인 응답이 필요한 경우에 적합합니다.
- **비동기 통신 (Asynchronous)**: Kafka, RabbitMQ 등 메시지 큐를 사용합니다. 주문 완료 후 이메일 발송이나 분석 데이터 전송처럼 즉각적인 응답이 필요 없는 경우에 적합합니다.

### 데이터 관리

각 Microservice는 자체 데이터베이스를 가지는 것이 원칙입니다(Database per Service 패턴). 서비스 간 데이터 일관성은 Saga 패턴이나 이벤트 소싱을 통해 관리합니다.

### API Gateway

클라이언트가 각 서비스를 직접 호출하는 대신 API Gateway를 통해 통신합니다. API Gateway는 라우팅, 인증, 속도 제한, 로드 밸런싱 등을 담당합니다. Kong, AWS API Gateway, Nginx 등을 활용할 수 있습니다.

---

## Payment Gateway 서비스

### 주요 Payment Gateway

| 서비스 | 특징 |
|--------|------|
| **Stripe** | 개발자 친화적 API, 글로벌 지원 |
| **PayU** | 동남아, 인도 등 신흥 시장 강세 |
| **PayPal** | 전 세계적으로 가장 널리 사용 |
| **Toss Payments** | 한국 시장에 특화된 결제 서비스 |

### 결제 서비스 설계 포인트

1. **멱등성(Idempotency)**: 동일한 결제 요청이 중복 처리되지 않도록 멱등성 키를 사용합니다
2. **상태 관리**: 결제는 `PENDING → AUTHORIZED → CAPTURED → SETTLED` 등의 상태를 거칩니다
3. **보안**: PCI DSS 준수, 토큰화를 통한 카드 정보 보호가 필수입니다
4. **재시도 로직**: 네트워크 오류 시 안전하게 재시도할 수 있는 메커니즘이 필요합니다

---

## 모놀리스에서 Microservice로 전환

처음부터 Microservice로 시작하는 것보다 모놀리스로 시작하여 점진적으로 분리하는 것이 권장됩니다(Monolith First 전략). 전환 시에는 Strangler Fig 패턴을 사용하여 기존 시스템을 점진적으로 새 서비스로 교체합니다.

### 전환 단계

1. 모놀리스 내에서 도메인별 모듈을 명확히 분리
2. 가장 독립적인 기능(예: 알림 서비스)부터 분리
3. 공유 데이터베이스를 서비스별 데이터베이스로 분리
4. API Gateway 도입으로 클라이언트 영향 최소화
5. 나머지 서비스를 순차적으로 분리

---

## E-commerce 핵심 서비스 상세 설계

### 상품 카탈로그 서비스

상품 정보를 관리하는 핵심 서비스입니다. 읽기 요청이 압도적으로 많으므로 캐싱이 중요합니다.

주요 기능:
- 상품 CRUD (등록, 수정, 삭제, 조회)
- 카테고리 관리
- 상품 검색 (Elasticsearch 연동)
- 상품 이미지 관리
- 리뷰 및 평점

기술 스택 예시:
- 데이터베이스: PostgreSQL (정형 데이터) + Elasticsearch (검색)
- 캐시: Redis (인기 상품, 카테고리)
- 이미지 저장: S3 + CloudFront (CDN)

### 주문 관리 서비스

주문의 생성부터 완료까지 전체 라이프사이클을 관리합니다. 데이터 일관성이 가장 중요한 서비스입니다.

주문 상태 흐름:
```
CREATED → PAYMENT_PENDING → PAID → PREPARING → SHIPPED → DELIVERED
                                                          ↓
                                                      COMPLETED
```

각 상태 전환은 이벤트로 발행되어 다른 서비스(재고, 결제, 알림)가 반응합니다.

### 재고 관리 서비스

재고 수량의 정확성은 E-commerce에서 매우 중요합니다. 동시 주문으로 인한 **과잉판매(overselling)** 방지가 핵심 과제입니다.

```
// 재고 차감 시 낙관적 잠금(Optimistic Locking) 활용
UPDATE inventory
SET quantity = quantity - 1, version = version + 1
WHERE product_id = ? AND quantity > 0 AND version = ?
```

재고 동기화 전략:
- **실시간 동기화**: 주문 즉시 재고 차감 (정확하지만 성능 부담)
- **예약 기반**: 일정 시간 동안 재고를 예약하고 결제 완료 시 확정 (추천)
- **비동기 동기화**: 이벤트 기반으로 재고 업데이트 (대량 트래픽 처리에 적합)

---

## 분산 시스템 패턴

### Saga 패턴

여러 서비스에 걸친 트랜잭션을 관리하는 패턴입니다. 각 서비스의 로컬 트랜잭션을 순차적으로 실행하고, 실패 시 보상 트랜잭션으로 롤백합니다.

**주문 생성 Saga 예시:**

1. 주문 서비스: 주문 생성 (PENDING)
2. 재고 서비스: 재고 예약
3. 결제 서비스: 결제 처리
4. 주문 서비스: 주문 확정 (CONFIRMED)

3단계에서 결제가 실패하면:
- 재고 서비스: 재고 예약 취소 (보상 트랜잭션)
- 주문 서비스: 주문 취소

### Circuit Breaker 패턴

서비스 간 호출에서 장애가 전파되는 것을 방지합니다. 특정 서비스의 응답 실패율이 임계치를 넘으면 해당 서비스로의 호출을 차단하고 빠르게 실패 응답을 반환합니다.

상태 전이:
```
CLOSED (정상) → OPEN (차단) → HALF-OPEN (시도) → CLOSED
```

- **CLOSED**: 정상 상태, 모든 요청 통과
- **OPEN**: 실패율 초과, 요청을 즉시 차단하고 fallback 응답 반환
- **HALF-OPEN**: 일정 시간 후 일부 요청을 시도하여 서비스 복구 확인

### CQRS (Command Query Responsibility Segregation)

읽기와 쓰기를 분리하는 패턴입니다. E-commerce에서는 상품 조회(읽기)가 주문(쓰기)보다 훨씬 많으므로 각각 최적화할 수 있습니다.

- **Command (쓰기)**: PostgreSQL 등 트랜잭션 지원 DB
- **Query (읽기)**: Elasticsearch, Redis 등 읽기 최적화된 저장소
- **동기화**: 이벤트 기반으로 쓰기 DB의 변경을 읽기 DB에 반영

---

## 운영 및 모니터링

Microservice 아키텍처에서는 서비스 수가 많아지므로 운영 복잡도가 증가합니다. 다음 도구들이 필수적입니다:

| 영역 | 도구 예시 | 용도 |
|------|----------|------|
| **서비스 디스커버리** | Consul, Eureka, K8s Service | 서비스 위치 자동 탐색 |
| **분산 추적** | Jaeger, Zipkin, AWS X-Ray | 요청의 서비스 간 흐름 추적 |
| **로그 집계** | ELK Stack, Loki | 분산된 로그를 중앙에서 조회 |
| **메트릭 모니터링** | Prometheus + Grafana | CPU, 메모리, 응답시간 모니터링 |
| **알림** | PagerDuty, Grafana Alerting | 장애 시 즉시 알림 |

분산 추적은 특히 중요합니다. 하나의 사용자 요청이 여러 서비스를 거치므로, 어떤 서비스에서 지연이 발생하는지 파악하려면 요청 전체 흐름을 추적할 수 있어야 합니다.
