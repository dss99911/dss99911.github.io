---
layout: post
title: "AWS ECS와 Elastic Beanstalk - 컨테이너 및 오토스케일링"
date: 2025-12-28 12:02:00 +0900
categories: [infra, devops]
tags: [aws, ecs, beanstalk, docker, autoscaling, devops]
description: "AWS ECS(Elastic Container Service)와 Elastic Beanstalk을 활용한 컨테이너 관리 및 자동 확장 설정 방법을 설명합니다."
image: /assets/images/posts/thumbnails/2025-12-28-aws-ecs-beanstalk.png
---

# AWS ECS와 Elastic Beanstalk - 컨테이너 및 오토스케일링

AWS에서 컨테이너를 관리하고 자동으로 확장하는 두 가지 주요 서비스인 ECS와 Elastic Beanstalk에 대해 정리했습니다.

## AWS ECS (Elastic Container Service)

ECS는 Docker 컨테이너를 관리하는 서비스입니다.

### 특징

- Docker와 비슷한 역할을 수행
- Load Balancer를 자동으로 생성할 수 있음 (기존 것을 선택하는 것은 불가)
- VPC를 기존에 있던 걸 선택 불가 (새로운 VPC가 생성됨)

### EC2에서 Docker 사용하기

EC2 인스턴스에서 Docker를 설정하고 ECS에 등록하는 과정입니다.

#### 기본 단계

1. Docker 설치
2. Docker 이미지 파일 만들기
3. 이미지 파일 실행하기
4. ECS에 Docker 이미지 등록하기

참고 문서: [AWS Docker Basics](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/docker-basics.html)

#### 재부팅 시 Docker 자동 시작

```bash
sudo systemctl enable docker
```

## Elastic Beanstalk

Elastic Beanstalk은 AWS 리소스들을 쉽게 연결하고 자동으로 확장할 수 있게 해주는 서비스입니다. 마치 콩나무처럼 트래픽이 많아지면 자동으로 커집니다.

### 주요 기능

- **오토스케일링**: 트래픽에 따라 자동으로 인스턴스 수 조절
- **로드 밸런싱**: 트래픽을 여러 인스턴스에 분산
- **인스턴스 자동 생성**: min, max 설정에 따라 인스턴스 관리

### 작동 방식

1. 네트워크 트래픽이 많아지면 인스턴스를 자동으로 늘림
2. 새로 생성된 인스턴스에는 설정한 애플리케이션 버전이 자동 설치됨
3. DB처럼 애플리케이션끼리 공유해야 하는 자원은 RDS 같은 AWS 서비스 이용

### 용어

- **Application version**: 한 애플리케이션의 버전. AB 테스트처럼 두 가지 버전을 바꿔가며 확인할 수도 있습니다.
- **Environment**: Application version 외에 다른 설정들도 관리할 수 있습니다.

## AWS 빅데이터 및 ML 서비스

AWS에서 제공하는 데이터 분석 및 머신러닝 관련 서비스들입니다.

### 분석 서비스

| 서비스 | 설명 |
|--------|------|
| **Amazon Athena** | S3에 저장된 데이터에 SQL 쿼리 실행 (서버리스, ETL 불필요) |
| **AWS Glue** | ETL 카탈로그 서비스, S3 데이터를 SQL에서 호출 가능하게 매핑 |
| **Lake Formation** | 여러 출처의 데이터를 중앙 집중식으로 관리 (Data Lake) |
| **Redshift** | Data Warehouse 서비스 |
| **AWS Step Functions** | 서버리스로 AWS 서비스들을 워크플로우로 구성 |

### 머신러닝 서비스

| 서비스 | 설명 |
|--------|------|
| **Amazon SageMaker** | 머신 러닝 모델 구축, 학습, 배포 |
| **Amazon Rekognition** | 사진/비디오에서 사람 식별 |
| **Amazon Forecast** | 시계열 예측 (시간 순 데이터 기반 예측) |
| **Amazon Personalize** | 맞춤 추천 기능 |
| **Amazon Comprehend** | 자연어 처리, 텍스트 분석 |
| **Amazon Lex** | Chatbot AI (슬랙 봇 등 개발) |
| **Amazon Polly** | Text to Speech |
| **Amazon Textract** | 이미지에서 텍스트 추출 |
| **Amazon Transcribe** | Speech to Text |
| **Amazon Translate** | 번역 서비스 |
| **Amazon Augmented AI (A2I)** | ML 예측에 인적 검토 프로세스 추가 |
| **AutoML** | 머신러닝 자동화 |

### AWS Marketplace

이미 학습된 솔루션을 제공하며, 무료 솔루션도 있습니다. 각 카테고리의 제품을 테스트해볼 수 있습니다.

## AWS 튜토리얼 리소스

- [도메인 이름 등록](https://aws.amazon.com/getting-started/tutorials/get-a-domain/)
- [메모리 및 디스크 메트릭 모니터링](http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/mon-scripts.html)
