---
layout: post
title: Docker Repository 사용 가이드
date: 2024-11-26 01:57:37 +0900
categories: [infra, devops]
redirect_from:
  - /infra/devops/2024/12/23/docker-repository.html
tags: [docker, docker-hub, container, registry, devops]
image: /assets/images/posts/thumbnails/2024-11-26-docker-repository.png
---
# Docker Repository 사용 가이드

Docker 이미지를 빌드하고 Docker Hub에 푸시하는 전체 워크플로우를 단계별로 설명합니다. Docker Repository는 빌드된 이미지를 저장하고 배포하는 핵심 인프라로, Docker Hub, AWS ECR, GitHub Container Registry 등 다양한 레지스트리 서비스가 있습니다.

## Clone Docker Repository Sample Source Code
- `alpine/git` 이미지는 Git 명령어를 실행하기 위한 용도로 사용됩니다. 단순히 `git clone` 명령어를 사용해도 동일한 결과를 얻을 수 있습니다.

![Clone Docker Repository](/assets/images/posts/miscellanea/docker-repository1.png)

---

## Build
- 도커 이미지를 생성합니다. 아래는 `docker101tutorial`이라는 이름의 이미지를 빌드하는 예시입니다.
  - **이미지 이름**: `hyun123/project`
  - **버전 설정**: `0.1.0`
  - **소스코드 위치**: `.` (현재 디렉토리)

![img2](/assets/images/posts/miscellanea/docker-repository2.png)

```bash
docker build -t project .
```

빌드 시 태그를 버전과 함께 지정하는 것이 좋습니다:

```bash
docker build -t hyun123/project:0.1.0 .
docker build -t hyun123/project:latest .
```

### 빌드 캐시 활용

Docker는 Dockerfile의 각 명령어를 레이어로 캐싱합니다. 변경이 없는 레이어는 재사용되므로 빌드 속도가 크게 향상됩니다. 자주 변경되는 명령어를 Dockerfile 아래쪽에 배치하면 캐시 효율이 좋아집니다.

```bash
# 캐시 없이 빌드 (문제 발생 시)
docker build --no-cache -t project .
```

## Run
- 빌드한 이미지를 실행합니다. 아래는 docker-tutorial이라는 이름으로 실행하는 예시입니다.

![img3](/assets/images/posts/miscellanea/docker-repository3.png)

```bash
docker run --name docker-tutorial project
```

실행 시 자주 사용하는 옵션들:

```bash
# 백그라운드 실행 + 포트 매핑
docker run -d -p 8080:80 --name docker-tutorial project

# 환경 변수 설정
docker run -e NODE_ENV=production --name docker-tutorial project

# 볼륨 마운트 (데이터 유지)
docker run -v /host/data:/container/data --name docker-tutorial project
```

## Push Repository

- Docker Hub 또는 기타 Docker Registry에 이미지를 푸시합니다.
- tag 명령어로 로컬 이미지와 리모트 태그를 연결합니다.
- 예를 들어 AWS ECR로 푸시하려면 다음과 같은 명령을 사용할 수 있습니다.

### Docker Hub에 로그인

푸시하기 전에 먼저 로그인이 필요합니다:

```bash
docker login
# Username과 Password 입력
```

### 이미지 태그 및 푸시

```shell
docker tag project hyun123/project:latest
docker push hyun123/project:latest
```

![img4](/assets/images/posts/miscellanea/docker-repository4.png)

### AWS ECR에 푸시하기

AWS ECR(Elastic Container Registry)을 사용하는 경우:

```bash
# ECR 로그인
aws ecr get-login-password --region ap-northeast-2 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.ap-northeast-2.amazonaws.com

# 태그 설정
docker tag project:latest <account-id>.dkr.ecr.ap-northeast-2.amazonaws.com/project:latest

# 푸시
docker push <account-id>.dkr.ecr.ap-northeast-2.amazonaws.com/project:latest
```

## Check Repositories Here
- 생성된 이미지는 아래 링크에서 확인 가능합니다.
- [repositories](https://hub.docker.com/repositories)

## 이미지 관리

```bash
# 로컬 이미지 목록 확인
docker images

# 불필요한 이미지 삭제
docker rmi project:old-tag

# 사용하지 않는 이미지 정리
docker image prune

# 특정 리포지토리의 모든 태그 삭제
docker rmi $(docker images hyun123/project -q)
```

## Docker Repository 없이 파일로 Image 사용하기

- Docker Hub를 사용하지 않고 이미지를 공유하는 방법은 아래 StackOverflow 링크를 참고하세요.
- [How to share my Docker image without using the Docker Hub?](https://stackoverflow.com/questions/24482822/how-to-share-my-docker-image-without-using-the-docker-hub)

tar 파일로 이미지를 직접 내보내고 가져올 수 있습니다:

```bash
# 이미지를 tar 파일로 저장
docker save -o project.tar hyun123/project:latest

# tar 파일에서 이미지 로드
docker load -i project.tar
```

이 방법은 인터넷이 제한된 환경이나 폐쇄망에서 이미지를 전달할 때 유용합니다.

## 멀티 플랫폼 빌드

Apple Silicon(M1/M2) Mac에서 빌드한 이미지가 Linux AMD64 서버에서 실행되지 않는 경우가 있습니다. `buildx`를 사용하면 여러 아키텍처용 이미지를 동시에 빌드할 수 있습니다:

```bash
# buildx 빌더 생성
docker buildx create --name mybuilder --use

# 멀티 플랫폼 빌드 및 푸시
docker buildx build --platform linux/amd64,linux/arm64 -t hyun123/project:latest --push .
```

이 방법을 사용하면 하나의 이미지 태그로 AMD64와 ARM64 아키텍처를 모두 지원할 수 있습니다. Docker Hub에서 이미지를 pull할 때 자동으로 적합한 아키텍처의 이미지가 선택됩니다.

---

## Dockerfile 작성 팁

### 멀티 스테이지 빌드

빌드 환경과 실행 환경을 분리하면 최종 이미지 크기를 크게 줄일 수 있습니다:

```dockerfile
# 빌드 스테이지
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 실행 스테이지
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

빌드 도구(node, npm 등)는 최종 이미지에 포함되지 않으므로 이미지 크기가 대폭 감소합니다. 예를 들어, Node.js 빌드 이미지가 1GB가 넘더라도 최종 nginx 이미지는 30MB 이하가 될 수 있습니다.

### .dockerignore 활용

`.dockerignore` 파일을 작성하여 빌드 컨텍스트에서 불필요한 파일을 제외하면 빌드 속도와 이미지 크기를 최적화할 수 있습니다:

```
node_modules
.git
.env
*.md
docker-compose*.yml
.dockerignore
Dockerfile
```

### 레이어 최적화

Dockerfile의 각 명령어는 별도의 레이어를 생성합니다. 관련된 명령어를 하나로 합치면 레이어 수를 줄일 수 있습니다:

```dockerfile
# 비효율적 - 3개의 레이어
RUN apt-get update
RUN apt-get install -y curl
RUN apt-get clean

# 효율적 - 1개의 레이어
RUN apt-get update && \
    apt-get install -y curl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
```

---

## GitHub Actions로 자동 빌드/푸시

CI/CD 파이프라인에서 Docker 이미지를 자동으로 빌드하고 푸시하는 예시입니다:

```yaml
name: Docker Build and Push
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_TOKEN }}

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          push: true
          tags: |
            hyun123/project:latest
            hyun123/project:${{ github.sha }}
```

이 워크플로우는 main 브랜치에 코드가 푸시될 때마다 자동으로 Docker 이미지를 빌드하고 Docker Hub에 푸시합니다. Git 커밋 해시를 태그로 사용하여 어떤 코드 버전의 이미지인지 추적할 수 있습니다.

---

## Docker Compose로 멀티 컨테이너 관리

여러 컨테이너를 함께 실행해야 할 때는 Docker Compose를 사용합니다:

```yaml
# docker-compose.yml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "8080:80"
    environment:
      - NODE_ENV=production
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - db-data:/var/lib/postgresql/data

volumes:
  db-data:
```

```bash
# 모든 서비스 시작
docker compose up -d

# 로그 확인
docker compose logs -f

# 모든 서비스 중지 및 삭제
docker compose down
```

---

## 베스트 프랙티스

- **태그 전략**: `latest` 외에 버전 번호나 Git 커밋 해시를 태그로 사용하여 이미지를 추적할 수 있게 합니다
- **멀티 스테이지 빌드**: 빌드 환경과 실행 환경을 분리하여 최종 이미지 크기를 줄입니다
- **보안**: 민감한 정보(API 키, 비밀번호 등)를 이미지에 포함하지 않도록 주의합니다
- **자동화**: CI/CD 파이프라인에 빌드와 푸시를 연동하여 수동 작업을 줄입니다
- **베이스 이미지 선택**: `alpine` 기반 이미지를 사용하면 크기를 크게 줄일 수 있습니다 (예: `node:18-alpine`은 `node:18`보다 10배 이상 작음)
- **헬스체크 추가**: Dockerfile에 `HEALTHCHECK` 명령어를 추가하여 컨테이너 상태를 모니터링합니다
- **비루트 사용자**: 보안을 위해 컨테이너 내에서 루트가 아닌 사용자로 프로세스를 실행합니다

```dockerfile
# 비루트 사용자 설정 예시
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
```

