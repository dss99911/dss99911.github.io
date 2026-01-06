---
layout: post
title: "데이터베이스 설계 기초 - 주의사항과 아키텍처"
date: 2025-12-28 12:01:00 +0900
categories: [backend, database]
tags: [database, design, architecture, best-practices]
description: "데이터베이스 설계 시 확인해야 할 주요 사항과 아키텍처 설계 참고 자료를 정리합니다."
image: /assets/images/posts/thumbnails/2025-12-28-database-basics.png
---

# 데이터베이스 설계 주의사항

데이터베이스를 설계할 때 확신이 없다면 다음 사항들을 반드시 체크해야 합니다.

## 체크리스트

### 1. Index (인덱스)

- 자주 검색되는 컬럼에 인덱스를 설정했는지 확인
- 복합 인덱스의 순서가 쿼리 패턴에 맞는지 확인
- 불필요한 인덱스가 성능을 저하시키지 않는지 검토

### 2. 텍스트 사이즈

- VARCHAR, TEXT 등의 문자열 컬럼 크기가 적절한지 확인
- 저장될 데이터의 최대 크기를 고려하여 설정
- 너무 크게 설정하면 메모리 낭비, 너무 작으면 데이터 손실 발생

### 3. Nullable 여부

- 해당 컬럼이 NULL 값을 허용해야 하는지 명확히 정의
- NOT NULL 제약조건이 필요한 경우 설정
- NULL 허용 시 애플리케이션에서의 NULL 처리 로직 고려

## 추가로 고려해야 할 사항

- **Primary Key**: 고유 식별자 설계
- **Foreign Key**: 테이블 간 관계 정의
- **기본값(Default)**: 필요한 경우 기본값 설정
- **유니크 제약조건**: 중복 방지가 필요한 컬럼 식별

---

# 데이터베이스 아키텍처 참고 자료

다양한 도메인에 대한 데이터베이스 아키텍처 샘플을 참고하면 설계에 도움이 됩니다.

## 추천 리소스

- [Database Answers - Data Models](http://www.databaseanswers.org/data_models/) - 수백 개의 산업별 데이터 모델 샘플 제공

이 사이트에서는 다음과 같은 다양한 도메인의 데이터 모델을 확인할 수 있습니다:

- E-Commerce
- Healthcare
- Finance
- Education
- Manufacturing
- 그 외 다수

실제 프로젝트에서 데이터베이스를 설계할 때, 유사한 도메인의 모델을 참고하여 시작하면 효율적입니다.
