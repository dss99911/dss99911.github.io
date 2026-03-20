---
layout: page
title: Resume
permalink: /resume/
---

# 김 정 현

[dss99911@gmail.com](mailto:dss99911@gmail.com) | [GitHub](https://github.com/dss99911) | [LinkedIn](http://www.linkedin.com/in/hyun-kim-7149b7b0) | [Blog](https://jeonghyeon.kim/)

---

## Summary

11년차 ML Engineer. 인도 소액대출 서비스(10M+ 다운로드)에서 대출 심사 모델의 데이터 수집(모바일)부터 피쳐 엔지니어링(Spark, 40TB), 실시간 서빙, 모니터링까지 End-to-End 구축. 한 회사에서 Android 개발 → Data Science → ACS Part Leader → ML Part Leader로 역할을 확장하며, 현재는 AI 기반 개발 플랫폼 설계 및 ML 파트 리딩을 담당. 인도 주재 3년, 영어 기반 다국적 팀 협업 경험.

---

## 경력

| 기간 | 소속 | 역할 |
| :---- | :---- | :---- |
| 2026.01 ~ 현재 | 어피닛(AFINIT) | AI/Data 팀 ML Part Leader |
| 2024.06 ~ 2025.12 | 어피닛(AFINIT) | AI/Data 팀 Data Engineer |
| 2023.11 ~ 2024.05 | 어피닛(AFINIT) | AI/Data 팀 ACS Part Leader |
| 2021.11 ~ 2023.10 | 어피닛(AFINIT) | Data Science 팀 |
| 2015.03 ~ 2021.10 | 어피닛(AFINIT) | 안드로이드 개발 팀 |

---

## 경력 상세

### 어피닛 (2015.03 ~ 현재)

> 인도향 소액대출 앱 서비스 — 10M+ 다운로드 ([Google Play](https://play.google.com/store/apps/details?id=com.balancehero.truebalance&hl=en))

#### ML Part Leader (2026.01 ~ 현재)

**ML Workspace — AI 통합 개발 환경 구축** ([블로그](https://blog.afinit.com/perfect-ai-assistant-guide))
- 1 Server + 5 Clients(VSCode, Slack, Web, CLI, Scheduler) + 22 Skills 구조의 AI 개발 플랫폼 설계 및 개발
- Slack 한 줄 명령으로 Jenkins 배포, Grafana 장애 분석, Airflow DAG 관리 등 ChatOps 구현
- 모바일 환경에서도 다중 프로젝트 장애 분석 및 대응이 가능한 구조
- Text-to-SQL — 프로젝트별 문서 구성만으로 복잡 쿼리 자동 생성 가능함을 POC로 증명

#### Data Engineer (2024.06 ~ 2025.12)

**DynamoDB → Apache Iceberg 80TB 마이그레이션** ([블로그](https://blog.afinit.com/dynamodb-to-apache-iceberg-migration))
- 월 비용 $18,357 → $1,554 (91.5% 절감)
- DynamoDB + S3 이중 저장 구조를 S3 기반 Apache Iceberg 단일 테이블로 통합
- Parquet Rowgroup 최적화(32MB), Bucketing, Compaction, pyiceberg 커스터마이징으로 서빙 가능한 5초 latency 달성
- Flink 파이프라인에 Iceberg 도입, Kinesis Enhanced-fanout 적용, Graphite 기반 모니터링 구축
- ACS V4 prod 배포 — 배포 전 consistency 검증 체계를 구축하여 대규모 구조 변경에도 score 이상 없이 배포

**시스템 개선**
- LangChain, LangGraph 기반 전사 Slack AI 챗봇 개발 — 사내 시스템 연동 AI 어시스턴트 ([블로그](https://blog.afinit.com/ai-agent-mcp-server-automation))
- ACS 호출 event-driven 구조로 전환 — 성능, latency, 비용, 구조 단순화

#### ACS Part Leader (2023.11 ~ 2024.05)

> ACS(대안 신용평가) 파트 리더 — 피쳐/모델 개발 방향 결정 및 기술 전략 수립

- Polars 기반 피쳐 로직 단일화 — 학습/모니터링/서빙 3곳의 피쳐 코드를 Polars로 통합
- 10만개+ 피쳐 학습/서빙 파이프라인 — train-serving 피쳐 일관성 검증 체계, 학습 데이터 1TB~5.4TB 규모 처리
- ACS 모니터링 체계 구축 — performance, consistency, business 모니터링
- Shadow testing 아키텍처 — 프로덕션 영향 없이 신규 모델을 검증할 수 있는 구조 구현
- 실시간 서빙 응답시간 10초 → 5초 — AOP 스타일 함수 계층 분석 도구를 자체 개발하여 병목 구간 정밀 분석
- SageMaker endpoint 비용 5배 절감 — gunicorn+gevent의 process별 request 불균형을 coroutine 내부 원리 분석으로 파악, gunicorn 제거로 해결

#### Data Science 팀 (2021.11 ~ 2023.10)

> 대안 신용평가 모델 빅데이터 피쳐 개발 및 파이프라인 구축

- 대출 심사 모델의 Android 데이터 수집부터 피쳐 엔지니어링(SMS 40TB), 모델 학습, 실시간 서빙까지 End-to-End 체계 구축
- NER 모델에 SMS 파싱 결과를 레이블로 활용, NER ↔ 패턴 비교 파이프라인으로 잘못된 패턴을 자동 탐지·교정하는 피드백 루프 구축
- 신용보고서 기반 대출 상환기간 결측치 추정 (특허 출원, 40% 기여)

#### 안드로이드 개발 팀 (2015.03 ~ 2021.10)

**금융 SMS 해석 엔진**
- 인도 은행별 SMS 패턴을 분석하고 금융 거래 정보를 구조화하여 추출하는 엔진 전체 설계 및 개발 (Android + Spring + Spark)

**베이스 아키텍처 개발** — 팀 전체가 사용하는 개발 프레임워크 구축
- API 호출 boilerplate 10줄 → 1줄로 축소 ([블로그](/mobile/android/2023/12/24/coroutine-retrofit.html))
- RecyclerView 리스트 구현을 2줄로 단순화, 페이징 자동 지원 ([블로그](/mobile/android/2023/12/24/recyclerview-without-redundancy.html))
- [피쳐별 모듈화](/mobile/android/2023/12/24/simple-architecture-refactoring-to-new-arhictecture.html), [테스트 방법론](/mobile/android/2023/12/24/testing-efficiently.html), [boilerplate 최소화](/mobile/android/2023/12/24/reduce-boiler-plate-code.html) 등 6편의 기술 블로그 시리즈

**기타 성과**
- 선불 요금 확인 서비스 개발 ([장관상 수상](http://www.mobiinside.com/kr/2018/12/06/press-balancehero-2/))
- 인도 UPI(Unified Payments Interface) 은행 연동 전체 설계 및 개발
- 보안 솔루션 연동, 실제 금융앱 해킹 시연
- 대출, 결제/송금, 본인 인증, 커머스, 딥링크 등 안드로이드 개발

---

## 기술 스택

| 분류 | 기술 |
| :---- | :---- |
| AI/LLM | Claude API, Claude Agent SDK, MCP, LangChain, LangGraph, Text-to-SQL |
| ML/DS | XGBoost, PyTorch, Spark ML, Scikit-learn, Pandas, Polars |
| Big Data | Spark, Flink, Airflow, Iceberg, Delta Lake, EMR, SageMaker, Glue |
| Backend | Spring, Ktor, Flask, Kotlin, Python, Scala, Golang |
| Mobile | Android (Jetpack, Compose, Kotlin), Kotlin Multiplatform |
| Infra | AWS (EC2, ECS, Lambda, SQS, ALB, S3, IAM), Docker, GitHub Actions, Grafana |

---

## 개인 프로젝트

- [Simple Android Architecture](https://github.com/dss99911/kotlin-simple-architecture/tree/android-architecture) — 효율적 안드로이드 개발 프레임워크, 6편의 기술 블로그 시리즈
- [Fingerprint Camera Shutter](https://play.google.com/store/apps/details?id=kim.jeonghyeon.fingerprintcamera) — 25만명+ 다운로드, 월 10만원 광고 수익
- [Kotlin Simple Architecture](https://github.com/dss99911/kotlin-simple-architecture) — Kotlin Multiplatform 프레임워크 (34 stars)
- 암호화폐, 주식 시뮬레이션 및 자동 거래 시스템 (Upbit, Pandas, Spark, Docker, KIS, Claude Code)

---

## 기타

- **어학** — 한국어 네이티브, 영어 비즈니스 (인도 5년 — 장기출장 2년 + 주재 3년), 인도네시아어 일상회화 (인도네시아 원격근무 중)
- **블로그** — [jeonghyeon.kim](https://jeonghyeon.kim/)
