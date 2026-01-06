---
layout: post
title: "Nginx 설치 및 설정 가이드"
date: 2025-12-28 12:06:00 +0900
categories: [infra, devops]
tags: [nginx, webserver, proxy, devops, linux]
description: "Nginx 웹서버 설치, 설정 파일 구조, 프록시 설정 방법을 설명합니다."
image: /assets/images/posts/thumbnails/2025-12-28-nginx-configuration.png
---

# Nginx 설치 및 설정 가이드

Nginx는 고성능 웹 서버이자 리버스 프록시 서버입니다. 정적 파일 서빙과 로드 밸런싱에 뛰어난 성능을 보입니다.

## 설치

### Amazon Linux / AWS에서 설치

```bash
sudo amazon-linux-extras install nginx1
sudo systemctl start nginx
```

### CentOS/RHEL에서 설치

```bash
sudo yum install nginx -y
```

## 설정 파일 찾기

```bash
sudo find / -name 'nginx.conf'
sudo vi /etc/nginx/nginx.conf
```

## 서비스 관리

### 실행 상태 확인

```bash
ps -ef | grep nginx
```

nginx가 실행 중이 아니면 다음과 같은 결과만 출력됩니다:
```
devteam   8078  8013  0 05:57 pts/0    00:00:00 grep --color=auto nginx
```

### 서비스 시작

```bash
# 시스템에 따라 다른 방법 사용
/etc/init.d/nginx start
sudo service nginx start
systemctl start nginx  # AWS Linux
```

### 서비스 재시작

```bash
/etc/init.d/nginx restart
sudo service nginx restart
systemctl restart nginx  # AWS Linux

# Graceful reload (권장)
sudo systemctl reload nginx
```

## 설정 파일 구조

### 기본 구조

- Directive(지시문)는 항상 `;`로 끝납니다
- 설정 파일에서 access log와 error log 경로를 확인할 수 있습니다

### Worker Process 설정

```nginx
worker_processes auto;  # 자동 설정
worker_processes 1;     # 1개의 워커 프로세스
```

### 기본 HTML 파일 위치

```nginx
server.root = /usr/share/nginx/html
```

## 로그 확인

```bash
sudo find / -name "access.log"
sudo tail -f /var/log/nginx/access.log
```

## 프록시 설정

### 기본 프록시 설정

기본 설정 파일에 `proxy_pass` 라인을 추가합니다:

```nginx
server {
    listen       80 default_server;
    listen       [::]:80 default_server;
    server_name  localhost;
    root         /usr/share/nginx/html;

    # 기본 서버 블록 설정 파일 로드
    include /etc/nginx/default.d/*.conf;

    location / {
        proxy_pass http://127.0.0.1:8080;
    }
}
```

### 가상 호스트 (서브도메인) 프록시 설정

`/etc/nginx/conf.d/virtual.conf` 파일을 생성합니다:

```nginx
server {
    listen 80;
    server_name jenkins.example.com;

    location / {
        proxy_pass http://127.0.0.1:9090;
    }
}
```

### 설정 파일 분리 (Include)

다른 설정 파일을 포함할 수 있습니다:

```nginx
include other_settings.conf;
```

## 활용 예시

### 여러 서비스를 하나의 서버에서 운영

```nginx
# API 서버
server {
    listen 80;
    server_name api.example.com;

    location / {
        proxy_pass http://127.0.0.1:8080;
    }
}

# Admin 서버
server {
    listen 80;
    server_name admin.example.com;

    location / {
        proxy_pass http://127.0.0.1:9000;
    }
}

# Jenkins
server {
    listen 80;
    server_name jenkins.example.com;

    location / {
        proxy_pass http://127.0.0.1:9090;
    }
}
```

## 주의사항

- 설정 변경 후에는 반드시 `reload` 또는 `restart`를 해야 적용됩니다
- `reload`는 graceful하게 설정을 적용하므로 서비스 중단 없이 변경 가능합니다
- 문법 오류 검사: `nginx -t`
