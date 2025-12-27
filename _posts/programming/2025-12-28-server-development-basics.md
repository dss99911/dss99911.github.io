---
layout: post
title: "서버 개발 기초 개념 정리"
date: 2025-12-28
categories: programming
tags: [server, web-server, api, load-balancing, architecture]
---

서버 개발에 필요한 기초 개념들을 정리했습니다.

## 서버 구조 (Server Structure)

### Web Server

- 사용자 요청을 받음
- 정적 HTML 반환
- 다른 Web Server로 요청 리다이렉트
- 예: Apache, Nginx (더 가볍고 빠름)

### Web Application Server (WAS)

- 목적: 동적 페이지 처리
- 요청을 받아 처리 후 정적 HTML 반환
- 예: Tomcat, Spring 내장 Tomcat

### Spring Framework

- Application Server 포함
- Servlet 호출
- Spring + JSP (페이지)
- Spring + Freemarker

## API 구조 설계

### 참고 자료

- [Google JSON Style Guide](https://google.github.io/styleguide/jsoncstyleguide.xml)
- [PayPal API Standards](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#business-capabilities)
- [REST API 가이드](https://slides.com/eungjun/rest)

### 에러 처리 계층

1. **Network Error (IOException)**: 네트워크 연결 오류
2. **App Error (Throwable)**: 애플리케이션 내부 오류
3. **Server Error**: 응답은 받았지만 상태 코드와 메시지가 에러인 경우
4. **Server Application Error**: 커스텀 상태와 메시지 (Server Error 상속)

## Load Balancing과 Clustering

### Load Balancing

서버의 로드를 클러스터링된 서버별로 균등하게 나누어 주는 서버입니다. 서버의 사양과 처리량에 따라 차별적으로 분배하기도 합니다.

### Clustering

똑같은 구성의 서버군을 병렬로 연결한 상태입니다. 로드 밸런서에 의해 각 클러스터링된 서버로 서비스가 진행됩니다.

클러스터링된 서버 중 한 대에 이상이 있으면 로드 밸런서에서 해당 서버의 분배를 제거하여 서비스 중단 없이 운영됩니다.

### Fail Over

로드 밸런서도 장애가 발생할 수 있으므로 2대로 구성합니다:

- **Master 서버**: 실제 운영
- **Standby 서버**: Master 서버 장애 시 자동으로 역할 대체

### 데이터 동기화 방식

1. **Sync 방식**: 서버 간 데이터 동기화
   - 비용이 적음
   - 실시간 동기화가 어려움
   - 데이터가 많을수록 시간 갭이 큼

2. **별도 데이터 서버**: 데이터를 따로 분리
   - 데이터 서버의 이중화 필요
   - Active-Passive 구성
   - 백업은 별도로 진행 필요 (1주전, 1일전 데이터 등)

## Cron Expression

### 기본 형식

```
second minute hour day month (day of week)
```

### 특수 문자

- `?` (no specific value): day-of-month와 day-of-week 필드에서 사용
  - 예: 매월 10일에 실행하고 요일은 상관없을 때 - day-of-month: "10", day-of-week: "?"

### 유용한 도구

Cron Expression 생성기: [https://www.freeformatter.com/cron-expression-generator-quartz.html](https://www.freeformatter.com/cron-expression-generator-quartz.html)

## 애플리케이션 등록 (Application Register)

백그라운드로 애플리케이션을 실행하는 방법:

### Supervisor 사용

프로세스를 관리하고 자동 재시작을 지원합니다.

### 유사한 프로그램

- launchd
- daemontools
- runit

### 간단한 방법

명령어 뒤에 `&`를 붙여 백그라운드 실행:

```bash
./my-application &
```

## Mock Server

개발 및 테스트용 Mock 서버:

- [Mockable.io](https://www.mockable.io)
- [Postman Echo](https://postman-echo.com)
