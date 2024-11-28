---
layout: post
title: Docker Compose Tutorial
date: 2024-11-26 01:57:37 +0900
categories: miscellanea
---

# Docker Compose Tutorial

Docker Compose는 여러 컨테이너로 구성된 애플리케이션을 하나의 네트워크 안에서 실행하고 관리할 수 있도록 돕는 도구입니다. 이 글에서는 Docker Compose를 활용해 효율적으로 서비스를 구성하고 운영하는 방법에 대해 설명합니다.



## Docker Compose란?

Docker Compose는 여러 서비스를 독립적인 컨테이너로 실행시키고, 이들 간의 연결과 설정을 단순화해줍니다. 주요 사용 사례는 다음과 같습니다:

- 여러 프로그램 설치 및 설정 작업을 간소화
- 모든 서비스를 Docker 이미지로 실행
- Compose로 서비스 간 네트워크 및 통신 관리
- 새로운 이미지 버전의 업데이트 및 배포

예를 들어, **nginx**를 통해 **Jupyter Notebook**으로 요청을 전달(bypass)하는 구성을 간단히 설정할 수 있습니다.


## 설치

Docker Compose 설치 방법은 [Install Docker Compose](https://docs.docker.com/compose/install/) 페이지를 참고하세요.


## `docker-compose.yml` 작성하기

```yaml
version: "3.8"
services:
  app:
    image: node:12-alpine
    command: sh -c "yarn install && yarn run dev"
    ports:
      - 3000:3000
    working_dir: /app
    volumes:
      - ./:/app
    environment:
      MYSQL_HOST: mysql
      MYSQL_USER: root
      MYSQL_PASSWORD: secret
      MYSQL_DB: todos
  mysql:
    image: mysql:5.7
    volumes:
      - todo-mysql-data:/var/lib/mysql
    environment:
      MYSQL_ROOT_PASSWORD: secret
      MYSQL_DATABASE: todos
volumes:
  todo-mysql-data:
```

### Compose 버전 설정

`docker-compose.yml` 파일에는 Compose 버전을 지정해야 합니다. 버전별 상세 내용은 [Compose file reference](https://docs.docker.com/compose/compose-file/)를 참고하세요.


### 서비스 정의

서비스는 각 컨테이너의 설정과 네트워크 구성을 포함합니다. 각 서비스는 고유한 이름을 가지며, 네트워크 내 별칭(network-alias)을 동일하게 설정할 수 있습니다.

### 볼륨 설정

볼륨을 정의하지 않으면 기본 옵션이 사용됩니다. 필요에 따라 마운트 지점을 명시적으로 설정하세요.


```
volumes:
  app-data:
    driver: local
```
 

## 빌드

Compose 파일을 기반으로 컨테이너를 빌드합니다.
```
docker-compose build
``` 
다른 파일명을 사용하는 경우:
```
docker-compose -f docker-compose-deploy.yml up --build
```

## 실행

Detached 모드로 Compose를 실행합니다:
```
docker-compose up -d
```

## 제거

Compose로 실행된 컨테이너와 네트워크를 삭제합니다:
```
docker-compose down
```

데이터 볼륨 및 다운로드된 이미지를 함께 삭제하려면:
```
docker-compose down --volumes --rmi all
```

## 특정 컨테이너에서 명령 실행

web 컨테이너에서 명령을 실행하려면 다음과 같이 합니다:
```
docker-compose run web django-admin startproject composeexample .
```

## 로그 보기

실시간으로 로그를 확인합니다:
```
docker-compose logs -f
```
특정 서비스의 로그만 확인하려면:
```
docker-compose logs -f app
```

## 컨테이너 간 의존성 관리

Docker Compose는 컨테이너가 완전히 준비되기 전에 다른 컨테이너를 실행하는 것을 방지하지 않습니다. 이를 해결하려면 wait-port와 같은 도구를 사용하여 특정 포트가 활성화될 때까지 대기할 수 있습니다.

Wait-port 프로젝트를 참고하세요.

Docker Compose를 통해 애플리케이션 배포와 관리를 단순화하고, 보다 효율적인 개발 환경을 구축해보세요!

