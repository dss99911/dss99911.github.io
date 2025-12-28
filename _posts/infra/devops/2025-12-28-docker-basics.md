---
layout: post
title: "Docker 기초 - 설치 및 개념"
date: 2025-12-28 12:03:00 +0900
categories: [infra, devops]
tags: [docker, devops, container, virtualization]
description: "Docker의 기본 개념과 Mac/Linux에서의 설치 방법을 설명합니다."
---

# Docker 기초 - 설치 및 개념

Docker는 애플리케이션을 컨테이너로 패키징하여 어디서든 동일하게 실행할 수 있게 해주는 플랫폼입니다.

## Docker 개념

### Immutable Infrastructure

Docker는 불변 인프라(Immutable Infrastructure) 위에서 동작합니다:

- 이미지만 올려서 서버 증설 가능
- 한 OS 내에 애플리케이션들을 격리
- 환경에 상관없이 동일한 실행 환경 보장

### 주요 장점

1. **환경 일관성**: 개발, 테스트, 프로덕션 환경에서 동일하게 동작
2. **격리**: 각 컨테이너는 독립적으로 실행
3. **경량화**: VM보다 가볍고 빠름
4. **확장성**: 필요에 따라 쉽게 스케일 아웃 가능

## Docker 설치

### Mac에서 설치

```bash
# Docker 설치
brew cask install docker

# docker-compose 설치 (개발 환경 구성용)
brew install docker-compose
```

### Linux (Amazon Linux/CentOS)에서 설치

AWS EC2 등에서 Docker를 설치하고 시스템 서비스로 등록합니다:

```bash
# Docker 설치
sudo yum install docker -y

# Docker 서비스 시작
sudo systemctl start docker

# 재부팅 시 자동 시작
sudo systemctl enable docker
```

### Docker 권한 설정

sudo 없이 Docker를 실행하려면:

```bash
# docker 그룹 생성 및 사용자 추가
sudo groupadd docker && sudo usermod -aG docker $USER
```

설정 후 로그아웃했다가 다시 로그인하면 적용됩니다.

## 다음 단계

Docker 설치 후에는 다음 단계로 진행할 수 있습니다:

1. Docker 이미지 파일 만들기
2. 이미지 파일 실행하기
3. AWS ECS에 Docker 이미지 등록하기

자세한 내용은 [AWS Docker 기초 문서](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/docker-basics.html)를 참고하세요.
