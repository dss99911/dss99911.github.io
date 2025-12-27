---
layout: post
title: "GitHub Actions로 Docker 이미지 자동 빌드 및 배포하기 - 완벽 가이드"
date: 2025-10-05 01:57:37 +0900
categories: devops
description: "GitHub Actions와 Self-hosted Runner를 사용하여 Docker 이미지를 자동 빌드하고 개인 서버에 배포하는 방법. GHCR 설정, EC2 설치, 워크플로우 작성까지 완벽 가이드."
tags: [GitHub Actions, Docker, CI/CD, DevOps, Self-hosted Runner, GHCR, AWS EC2]
---

GitHub Actions를 사용하여 Docker 이미지를 자동으로 빌드하고 개인 서버에 배포하는 방법을 알아봅니다.

## 배포 전략 선택

개인 프로젝트 배포에 적합한 간단한 방법들을 비교해봅니다.

### 방법 1: 서버에서 직접 빌드

서버에서 `git pull` 후 Docker Compose로 빌드 및 실행하는 방식입니다.

**장점:**
- Container Registry가 필요 없음
- 설정이 가장 간단함

**단점:**
- 서버에서 빌드해야 하므로 메모리/디스크가 작은 서버에는 부담
- 빌드 시간 동안 서버 리소스 사용

### 방법 2: GitHub Actions에서 빌드 후 배포 (권장)

이미지 빌드는 GitHub Actions에서 수행하고, 서버는 이미지만 pull하여 실행합니다.

**장점:**
- 서버 리소스 부담 최소화
- 빌드 실패 시 서버에 영향 없음
- 빌드 캐시 활용으로 빠른 배포

**단점:**
- Container Registry 필요 (GHCR 무료 사용 가능)
- 초기 설정이 조금 더 복잡

**이 글에서는 방법 2를 사용합니다.**

---

## 전체 아키텍처

```
[GitHub Repository]
       │
       ▼ (push to main)
[GitHub Actions]
       │
       ├─► Docker 이미지 빌드
       │
       ▼
[GitHub Container Registry (GHCR)]
       │
       ▼ (self-hosted runner가 pull)
[EC2 Server]
       │
       ▼
[Docker Compose 실행]
```

---

## 1. Self-hosted Runner 설치

GitHub Actions에서 개인 서버에 직접 배포하려면 Self-hosted Runner를 설치해야 합니다.

### GitHub에서 설치 스크립트 확인

Repository → Settings → Actions → Runners → New self-hosted runner

여기서 운영체제별 설치 방법을 확인할 수 있습니다.

### EC2 Amazon Linux 2023 ARM64 설치

#### 의존성 설치

기본 설치 스크립트 실행 시 다음 에러가 발생할 수 있습니다:

```
> ./config.sh <your script>
Execute sudo ./bin/installdependencies.sh to install any missing Dotnet Core 6.0 dependencies.

> sudo ./bin/installdependencies.sh
Can't detect current OS type based on /etc/os-release.
Can't install dotnet core dependencies.
```

아래 명령어로 의존성을 수동 설치합니다:

```bash
sudo dnf install -y \
  libicu krb5-libs openssl-libs zlib libstdc++ ca-certificates \
  git tar gzip perl-Digest-SHA
```

#### Runner 설치 및 설정

```bash
# Runner 디렉토리 생성
mkdir actions-runner && cd actions-runner

# Runner 패키지 다운로드 (GitHub에서 제공하는 URL 사용)
curl -o actions-runner-linux-arm64-2.311.0.tar.gz -L \
  https://github.com/actions/runner/releases/download/v2.311.0/actions-runner-linux-arm64-2.311.0.tar.gz

# 압축 해제
tar xzf ./actions-runner-linux-arm64-2.311.0.tar.gz

# Runner 설정 (GitHub에서 제공하는 토큰 사용)
./config.sh --url https://github.com/YOUR_USERNAME/YOUR_REPO --token YOUR_TOKEN
```

#### 서비스로 등록 (백그라운드 실행)

`./run.sh`는 포그라운드에서 실행됩니다. 서버 재시작 후에도 자동 실행되도록 서비스로 등록합니다:

```bash
# 서비스 설치
sudo ./svc.sh install

# 서비스 시작
sudo ./svc.sh start

# 상태 확인
sudo ./svc.sh status
```

#### 서비스 관리 명령어

```bash
# 서비스 중지
sudo ./svc.sh stop

# 서비스 재시작
sudo ./svc.sh restart

# 서비스 제거
sudo ./svc.sh uninstall
```

---

## 2. GitHub Container Registry (GHCR) 설정

GitHub Actions를 사용하므로, 설정이 가장 간단한 GHCR을 사용합니다.

### GHCR vs Docker Hub

| 항목 | GHCR | Docker Hub |
|------|------|------------|
| Private 이미지 | 무료 (제한적) | 1개만 무료 |
| GitHub Actions 연동 | 매우 간단 | 추가 설정 필요 |
| 이미지 주소 | `ghcr.io/username/image` | `username/image` |

### Personal Access Token 생성

GHCR에 이미지를 push하려면 토큰이 필요합니다:

1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token 클릭
3. 권한 선택:
   - `write:packages` - 이미지 push
   - `read:packages` - 이미지 pull
   - `delete:packages` - 이미지 삭제 (선택)
4. 토큰 생성 후 복사

### Repository Secrets 설정

Repository → Settings → Secrets and variables → Actions → New repository secret

- `GHCR_TOKEN`: 위에서 생성한 Personal Access Token

---

## 3. GitHub Actions 워크플로우 작성

`.github/workflows/deploy.yml` 파일을 생성합니다:

```yaml
name: Build and Deploy

on:
  push:
    branches: [main]
  workflow_dispatch:  # 수동 실행 허용

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Log in to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata for Docker
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=sha,prefix=
            type=raw,value=latest

      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}

  deploy:
    needs: build
    runs-on: self-hosted

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Log in to Container Registry
        run: echo ${{ secrets.GHCR_TOKEN }} | docker login ghcr.io -u ${{ github.actor }} --password-stdin

      - name: Pull and run
        run: |
          docker compose pull
          docker compose up -d

      - name: Clean up old images
        run: docker image prune -af
```

### 워크플로우 설명

1. **build job**: GitHub의 Ubuntu 환경에서 Docker 이미지 빌드 및 GHCR에 push
2. **deploy job**: Self-hosted Runner(개인 서버)에서 이미지 pull 후 실행

---

## 4. Docker Compose 설정

서버에서 사용할 `docker-compose.yml`:

```yaml
version: '3.8'

services:
  app:
    image: ghcr.io/YOUR_USERNAME/YOUR_REPO:latest
    container_name: my-app
    restart: unless-stopped
    ports:
      - "8080:8080"
    environment:
      - NODE_ENV=production
    volumes:
      - ./data:/app/data
```

---

## 5. 서버 초기 설정

### Docker 설치 (Amazon Linux 2023)

```bash
# Docker 설치
sudo dnf install -y docker
sudo systemctl start docker
sudo systemctl enable docker

# 현재 사용자를 docker 그룹에 추가
sudo usermod -aG docker $USER

# Docker Compose 설치
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### GHCR 로그인 (최초 1회)

```bash
# Personal Access Token으로 로그인
echo YOUR_TOKEN | docker login ghcr.io -u YOUR_USERNAME --password-stdin
```

---

## 트러블슈팅

### Runner가 offline 상태

```bash
# 서비스 상태 확인
sudo ./svc.sh status

# 로그 확인
sudo journalctl -u actions.runner.* -f

# 서비스 재시작
sudo ./svc.sh restart
```

### 이미지 pull 권한 에러

```
Error: denied: permission_denied
```

- GHCR 로그인이 제대로 되었는지 확인
- Personal Access Token에 `read:packages` 권한이 있는지 확인
- Private 이미지인 경우, Repository Settings → Packages에서 권한 설정 확인

### 디스크 공간 부족

오래된 이미지가 쌓여 디스크가 부족할 수 있습니다:

```bash
# 사용하지 않는 이미지 모두 삭제
docker image prune -af

# 사용하지 않는 모든 리소스 삭제
docker system prune -af
```

### 워크플로우 수동 실행

Actions 탭 → 워크플로우 선택 → Run workflow 버튼

---

## 참고 자료

- [GitHub Actions 공식 문서](https://docs.github.com/en/actions)
- [Self-hosted Runner 설정](https://docs.github.com/en/actions/hosting-your-own-runners)
- [GitHub Container Registry 가이드](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
- [Docker Compose 공식 문서](https://docs.docker.com/compose/)
