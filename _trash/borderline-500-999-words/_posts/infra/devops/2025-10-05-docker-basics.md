---
layout: post
title: "Docker 기초 - 설치 및 개념"
date: 2025-10-05 13:21:00 +0900
categories: [infra, devops]
tags: [docker, devops, container, virtualization]
description: "Docker의 기본 개념과 Mac/Linux에서의 설치 방법을 설명합니다."
image: /assets/images/posts/thumbnails/2025-12-28-docker-basics.png
redirect_from:
  - "/infra/devops/2025/12/28/docker-basics.html"
---

# Docker 기초 - 설치 및 개념

Docker는 애플리케이션을 컨테이너로 패키징하여 어디서든 동일하게 실행할 수 있게 해주는 플랫폼입니다. "내 컴퓨터에서는 되는데?"라는 문제를 근본적으로 해결하며, 현대 소프트웨어 개발과 배포의 표준이 되었습니다.

## Docker 개념

### Immutable Infrastructure

Docker는 불변 인프라(Immutable Infrastructure) 위에서 동작합니다:

- 이미지만 올려서 서버 증설 가능
- 한 OS 내에 애플리케이션들을 격리
- 환경에 상관없이 동일한 실행 환경 보장

### Docker vs 가상 머신 (VM)

Docker 컨테이너와 VM은 모두 격리 환경을 제공하지만 동작 방식이 다릅니다:

| 비교 | Docker Container | Virtual Machine |
|------|-----------------|-----------------|
| 가상화 수준 | OS 레벨 (커널 공유) | 하드웨어 레벨 |
| 시작 시간 | 수 초 | 수 분 |
| 이미지 크기 | MB 단위 | GB 단위 |
| 성능 | 네이티브에 가까움 | 오버헤드 있음 |
| 격리 수준 | 프로세스 격리 | 완전한 OS 격리 |

VM은 각각 별도의 게스트 OS를 포함하지만, Docker 컨테이너는 호스트 OS의 커널을 공유합니다. 이 차이로 인해 Docker가 훨씬 가볍고 빠릅니다.

### 주요 장점

1. **환경 일관성**: 개발, 테스트, 프로덕션 환경에서 동일하게 동작
2. **격리**: 각 컨테이너는 독립적으로 실행
3. **경량화**: VM보다 가볍고 빠름
4. **확장성**: 필요에 따라 쉽게 스케일 아웃 가능

### 핵심 용어

- **Image(이미지)**: 컨테이너를 생성하기 위한 읽기 전용 템플릿. Dockerfile로 정의됩니다.
- **Container(컨테이너)**: 이미지의 실행 인스턴스. 이미지를 기반으로 실제로 동작하는 프로세스입니다.
- **Dockerfile**: 이미지를 빌드하기 위한 명령어 모음. 기본 이미지, 파일 복사, 실행 명령 등을 정의합니다.
- **Registry**: 이미지를 저장하고 배포하는 저장소 (Docker Hub, ECR 등)

## Docker 설치

### Mac에서 설치

```bash
# Docker 설치
brew cask install docker

# docker-compose 설치 (개발 환경 구성용)
brew install docker-compose
```

Mac에서는 Docker Desktop을 설치하면 Docker Engine, CLI, Docker Compose가 모두 포함됩니다. 설치 후 상단 메뉴바에서 Docker 아이콘을 클릭하여 실행 상태를 확인할 수 있습니다.

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

### Ubuntu에서 설치

```bash
# 필수 패키지 설치
sudo apt-get update
sudo apt-get install ca-certificates curl gnupg

# Docker 공식 GPG 키 추가
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Docker 설치
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin
```

### Docker 권한 설정

sudo 없이 Docker를 실행하려면:

```bash
# docker 그룹 생성 및 사용자 추가
sudo groupadd docker && sudo usermod -aG docker $USER
```

설정 후 로그아웃했다가 다시 로그인하면 적용됩니다.

## 설치 확인

```bash
# Docker 버전 확인
docker --version

# Docker 정보 확인
docker info

# 테스트 컨테이너 실행
docker run hello-world
```

`hello-world` 이미지가 정상적으로 실행되면 Docker가 올바르게 설치된 것입니다. Docker는 로컬에 이미지가 없으면 자동으로 Docker Hub에서 다운로드합니다.

## 자주 사용하는 기본 명령어

```bash
# 실행 중인 컨테이너 목록
docker ps

# 모든 컨테이너 목록 (중지된 것 포함)
docker ps -a

# 로컬 이미지 목록
docker images

# 컨테이너 중지/시작/삭제
docker stop <container-name>
docker start <container-name>
docker rm <container-name>

# 컨테이너 로그 확인
docker logs <container-name>
docker logs -f <container-name>  # 실시간 로그

# 실행 중인 컨테이너에 접속
docker exec -it <container-name> /bin/bash
```

## 다음 단계

Docker 설치 후에는 다음 단계로 진행할 수 있습니다:

1. Docker 이미지 파일 만들기 (Dockerfile 작성)
2. 이미지 파일 실행하기
3. AWS ECS에 Docker 이미지 등록하기

자세한 내용은 [AWS Docker 기초 문서](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/docker-basics.html)를 참고하세요.
