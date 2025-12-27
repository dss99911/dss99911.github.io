---
layout: post
title: "머신러닝 기초 개념과 학습 방법"
date: 2025-12-28 12:00:00 +0900
categories: ai
tags: [machine-learning, ai, supervised-learning, unsupervised-learning, deep-learning]
description: "머신러닝의 기초 개념, 지도 학습과 비지도 학습의 차이점, 그리고 AI 학습을 시작하기 위한 추천 강의와 리소스를 정리합니다."
---

## 머신러닝 기본 개념

### 핵심 용어 정리

- **Categorization**: 큰 범주로 분류
- **Classification**: 범주 내에서 각 특성별 세부 분류
- **Machine Learning**: 데이터를 통한 학습
- **Deep Learning**: 신경망을 사용하는 머신러닝의 한 분야, 현재 가장 인기 있는 방식

### Collaborative Filtering (협업 필터링)

- 높은 정확도를 가진 해답을 제공하는 수단
- 모든 데이터 수집과 분석이 의미있는 인사이트나 실행에 맞춰져 있음
- 예: "이 상품을 구매한 고객이 다른 상품도 많이 구매한 경우" 해당 상품을 추천
- 넷플릭스 영화 추천, 아마존 상품 추천 등에 활용

---

## Supervised Learning (지도 학습)

사람이 정답(label)을 제공하여 학습하는 방식입니다.

### Regression Problem
- 연속적인 값을 예측
- 예시:
  - 땅 값 예측
  - 얼굴 사진으로 나이 예측

### Classification Problem
- 별개의(discrete) 결과를 예측
- 예시:
  - 종양이 음성인지 양성인지 분류

---

## Unsupervised Learning (비지도 학습)

정답 없이 데이터 자체에서 패턴을 찾는 방식입니다.

### Clustering
- 백만 개의 유전자를 그룹화
- 수명, 위치, 역할 등이 비슷한 그룹으로 자동 분류

### Non-clustering
- **칵테일 파티 알고리즘**: 스피커 두 대를 통한 거리 차이로, 여러 사람들의 말을 각각 분리
- 혼돈 속에서 구조를 찾아내는 것

---

## AI 학습을 위한 필요 조건

- 컴퓨터 프로그래밍
- 수학 및 통계
- 알고리즘
- 데이터 사이언스
- 도메인 지식: 자율주행, 의학, 자연어 처리 등

---

## 추천 학습 로드맵

### 1단계: 입문
김성훈 교수님 유튜브 강의로 시작하는 것을 추천합니다.
- 쉽게 풀어주시면서 직관적인 이해를 도움
- [YouTube 플레이리스트](https://www.youtube.com/playlist?list=PLlMkM4tgfjnLSOjrEJN31gZATbcj_MpUm)

### 2단계: 기초 다지기
기초를 다지려면 아래 2개 강좌가 필수입니다:

1. **선형대수학 강좌**
   - [YouTube 플레이리스트](https://www.youtube.com/playlist?list=PLSN_PltQeOyjDGSghAf92VhdMBeaLZWR3)

2. **확률통계 강좌**
   - [KOCW 강좌](http://www.kocw.net/home/search/kemView.do?kemId=1056974)

이 강의를 듣고 나면 신경망에 대한 본질적인 개념과 차원축소 기법을 이해하는데 도움이 됩니다.

### 3단계: 탐색과 최적화
충북대 이건명 교수님 강의 중 '탐색과 최적화' 부분
- [KOCW 강좌](http://www.kocw.net/home/search/kemView.do?kemId=1170523)

### 4단계: 심화 학습
KOOC 카이스트 문일철 교수님 강의 (앞선 4개 강좌 이수 후 수강 권장)

주요 내용:
- **k-means, GMM, EM** 강의: Variational Inference 기초
- **HMM** 강의: RNN, Bidirectional RNN, Attention Model 이해
- **샘플링** 강의: MCMC, Gibbs Sampling, RBM 기초

### 5단계: 논문 리뷰
TF-KR에서 진행하는 PR12 논문 리뷰 동영상

### 추가 리소스
- **CNN 학습**: [라온피플 블로그](http://blog.naver.com/laonple/220469250655)
- **Coursera 강좌**: [Machine Learning by Andrew Ng](https://ko.coursera.org/learn/machine-learning)

---

## AI 적용 분야 (트렌드)

1. Machine Learning in Finance
2. Autonomous Driving
3. Space Exploration
4. Healthcare and Medicine
5. Humanitarian Aid

---

## 앞으로 필요한 기술

인공지능에 의해 나온 결과가 어떻게 나오게 됐는지 확인하는 기술이 중요해지고 있습니다. 어떤 학습에 의해 그렇게 결정했고, 그 학습은 언제 어떻게 이루어졌는지 추적할 수 있어야 합니다.

이를 **Explainable AI (설명 가능한 AI)** 라고 합니다.
