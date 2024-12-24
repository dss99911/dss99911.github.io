---
layout: post
title: Docker Repository 사용 가이드
date: 2024-12-23 01:57:37 +0900
categories: miscellanea
---
# Docker Repository 사용 가이드

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
docker build -t project:0.1.0 .
```

## Run
- 빌드한 이미지를 실행합니다. 아래는 docker-tutorial이라는 이름으로 실행하는 예시입니다.

![img3](/assets/images/posts/miscellanea/docker-repository3.png)

```bash
docker run --name docker-tutorial hyun123/project:0.1.0
```

## Push Repository

- Docker Hub 또는 기타 Docker Registry에 이미지를 푸시합니다.
- tag 명령어로 로컬 이미지와 리모트 태그를 연결합니다.
- 예를 들어 AWS ECR로 푸시하려면 다음과 같은 명령을 사용할 수 있습니다.

```shell
docker tag project:latest hyun123/project:latest
docker push hyun123/project:latest
```

![img4](/assets/images/posts/miscellanea/docker-repository4.png)

## Check Repositories Here
- 생성된 이미지는 아래 링크에서 확인 가능합니다.
- [repositories](https://hub.docker.com/repositories)


## Docker Repository 없이 파일로 Image 사용하기

- Docker Hub를 사용하지 않고 이미지를 공유하는 방법은 아래 StackOverflow 링크를 참고하세요.
- [How to share my Docker image without using the Docker Hub?](https://stackoverflow.com/questions/24482822/how-to-share-my-docker-image-without-using-the-docker-hub)

