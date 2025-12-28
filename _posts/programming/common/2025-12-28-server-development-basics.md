---
layout: post
title: "서버 개발 완벽 가이드: 아키텍처부터 운영까지"
date: 2025-12-28 15:20:00 +0900
categories: [programming, common]
tags: [server, web-server, api, load-balancing, architecture, cron, devops]
description: "웹 서버 구조, API 설계, 로드 밸런싱, 크론 작업 등 서버 개발에 필요한 핵심 개념들을 상세히 정리했습니다."
---

서버 개발을 위해 알아야 할 기초 개념들을 체계적으로 정리했습니다. 웹 서버 아키텍처부터 API 설계, 고가용성 구성까지 다룹니다.

## 목차
1. [서버 구조 (Server Structure)](#서버-구조-server-structure)
2. [API 구조 설계](#api-구조-설계)
3. [Load Balancing과 Clustering](#load-balancing과-clustering)
4. [Cron Expression](#cron-expression)
5. [애플리케이션 등록 및 프로세스 관리](#애플리케이션-등록-및-프로세스-관리)
6. [Mock Server](#mock-server)

---

## 서버 구조 (Server Structure)

현대 웹 서비스의 서버 구조를 이해하는 것은 백엔드 개발의 기본입니다.

### Web Server

**역할:**
- 사용자 요청(HTTP Request) 수신
- 정적 파일(HTML, CSS, JS, 이미지) 제공
- 다른 서버로 요청 리다이렉트 (Reverse Proxy)
- SSL/TLS 종료 (HTTPS 처리)

**주요 Web Server:**

| 서버 | 특징 |
|------|------|
| Apache | 가장 오래된 웹 서버, 모듈 확장성 우수 |
| Nginx | 경량, 고성능, 리버스 프록시에 강점 |
| Caddy | 자동 HTTPS, 간단한 설정 |

**Nginx 기본 설정 예시:**

```nginx
server {
    listen 80;
    server_name example.com;

    # 정적 파일 제공
    location /static/ {
        root /var/www/html;
    }

    # 애플리케이션 서버로 프록시
    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Web Application Server (WAS)

**역할:**
- 동적 콘텐츠 생성
- 비즈니스 로직 처리
- 데이터베이스 연동
- 세션 관리

**주요 WAS:**

| 서버 | 언어/프레임워크 |
|------|----------------|
| Tomcat | Java (Servlet/JSP) |
| Jetty | Java (경량) |
| Gunicorn | Python (WSGI) |
| uWSGI | Python (WSGI) |
| Puma | Ruby |
| PM2 | Node.js |

### Spring Framework 구조

Spring은 Java 생태계에서 가장 널리 사용되는 프레임워크입니다.

```
클라이언트 요청
    ↓
[Nginx] ← Web Server (정적 파일, SSL)
    ↓
[Tomcat] ← WAS (Spring Boot 내장)
    ↓
[Spring MVC] ← 요청 라우팅
    ↓
[Service Layer] ← 비즈니스 로직
    ↓
[Repository] ← 데이터 접근
    ↓
[Database]
```

**뷰 템플릿 엔진:**
- **JSP**: 전통적인 Java 웹 페이지
- **Thymeleaf**: Spring 권장, Natural Templates
- **Freemarker**: 강력한 템플릿 문법

---

## API 구조 설계

좋은 API는 일관성 있고 직관적이어야 합니다.

### 참고 자료

- [Google JSON Style Guide](https://google.github.io/styleguide/jsoncstyleguide.xml)
- [PayPal API Standards](https://github.com/paypal/api-standards/blob/master/api-style-guide.md)
- [REST API 가이드 (한국어)](https://slides.com/eungjun/rest)

### RESTful API 설계 원칙

**HTTP 메서드 사용:**

| 메서드 | 용도 | 예시 |
|--------|------|------|
| GET | 리소스 조회 | `GET /users/123` |
| POST | 리소스 생성 | `POST /users` |
| PUT | 리소스 전체 수정 | `PUT /users/123` |
| PATCH | 리소스 부분 수정 | `PATCH /users/123` |
| DELETE | 리소스 삭제 | `DELETE /users/123` |

**URL 설계 가이드:**

```
좋은 예:
GET /users                 # 사용자 목록
GET /users/123             # 특정 사용자
GET /users/123/orders      # 사용자의 주문 목록
POST /users/123/orders     # 사용자의 주문 생성

나쁜 예:
GET /getUsers
GET /getUserById?id=123
POST /createOrder
```

### 응답 구조 설계

**성공 응답:**

```json
{
  "data": {
    "id": 123,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "meta": {
    "timestamp": "2025-12-28T15:20:00Z"
  }
}
```

**에러 응답:**

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "이메일 형식이 올바르지 않습니다.",
    "details": [
      {
        "field": "email",
        "message": "유효한 이메일 주소를 입력하세요."
      }
    ]
  }
}
```

### 에러 처리 계층

에러를 체계적으로 분류하면 클라이언트에서 적절한 처리가 가능합니다.

```
1. Network Error (IOException)
   └─ 네트워크 연결 실패
   └─ 타임아웃
   └─ DNS 해석 실패

2. App Error (Throwable)
   └─ 애플리케이션 내부 오류
   └─ NullPointerException
   └─ 예상치 못한 예외

3. Server Error (HTTP 5xx)
   └─ 서버 내부 오류
   └─ 데이터베이스 연결 실패
   └─ 외부 서비스 오류

4. Server Application Error (HTTP 4xx)
   └─ 인증 실패 (401)
   └─ 권한 부족 (403)
   └─ 리소스 없음 (404)
   └─ 유효성 검증 실패 (400, 422)
```

**클라이언트 에러 처리 예시 (Kotlin):**

```kotlin
sealed class ApiResult<T> {
    data class Success<T>(val data: T) : ApiResult<T>()
    data class NetworkError<T>(val exception: IOException) : ApiResult<T>()
    data class ServerError<T>(val code: Int, val message: String) : ApiResult<T>()
    data class UnknownError<T>(val exception: Throwable) : ApiResult<T>()
}

fun <T> handleResult(result: ApiResult<T>) {
    when (result) {
        is ApiResult.Success -> showData(result.data)
        is ApiResult.NetworkError -> showRetryDialog()
        is ApiResult.ServerError -> showErrorMessage(result.message)
        is ApiResult.UnknownError -> reportError(result.exception)
    }
}
```

---

## Load Balancing과 Clustering

대규모 서비스를 위한 고가용성 구성 방법입니다.

### Load Balancing이란?

서버의 부하를 여러 서버에 분산하는 기술입니다.

```
[클라이언트]
     │
     ▼
[Load Balancer]
     │
     ├──────┬──────┐
     ▼      ▼      ▼
[Server1][Server2][Server3]
```

**로드 밸런싱 알고리즘:**

| 알고리즘 | 설명 |
|----------|------|
| Round Robin | 순차적으로 분배 |
| Weighted Round Robin | 서버 성능에 따라 가중치 부여 |
| Least Connections | 연결이 가장 적은 서버로 |
| IP Hash | 클라이언트 IP 기반 분배 (세션 유지) |

### Clustering이란?

동일한 구성의 서버를 병렬로 연결한 상태입니다.

**장점:**
- 서비스 중단 없는 운영
- 수평적 확장 (Scale-out) 가능
- 단일 서버 장애 대응

**클러스터 운영 시 고려사항:**
- 세션 공유 (Redis, DB)
- 파일 스토리지 공유 (NFS, S3)
- 로그 중앙화 (ELK Stack)

### Fail Over 구성

로드 밸런서 자체의 장애에 대비한 구성입니다.

```
[클라이언트]
     │
     ▼
[Virtual IP]
     │
     ├─────────────────┐
     ▼                 ▼
[Master LB]  ←──→  [Standby LB]
  (Active)         (Passive)
     │
     ├──────┬──────┐
     ▼      ▼      ▼
[Server1][Server2][Server3]
```

- **Master 서버**: 실제 트래픽 처리
- **Standby 서버**: Master 장애 시 즉시 대체
- **Health Check**: 지속적인 상태 모니터링

### 데이터 동기화 방식

#### 1. Sync 방식 (서버 간 직접 동기화)

```
[Server1] ←──동기화──→ [Server2]
    ↑                      ↑
    └────────동기화────────┘
              ↓
          [Server3]
```

**장점:**
- 구성이 단순
- 비용이 적음

**단점:**
- 실시간 동기화 어려움
- 데이터가 많을수록 지연 증가

#### 2. 별도 데이터 서버 방식

```
[Server1] [Server2] [Server3]
    │         │         │
    └─────────┴─────────┘
              │
              ▼
    [Active Data Server]
              │
              ▼ (실시간 복제)
    [Passive Data Server]
```

**장점:**
- 데이터 일관성 보장
- 확장성 우수

**주의사항:**
- 데이터 서버도 이중화 필요
- 백업은 별도로 진행 (1일전, 1주일전 데이터)
- Passive 서버는 Active와 동일한 데이터를 가짐

---

## Cron Expression

정기적인 작업 스케줄링을 위한 표현식입니다.

### 기본 형식

```
┌───────────── 초 (0-59)
│ ┌───────────── 분 (0-59)
│ │ ┌───────────── 시 (0-23)
│ │ │ ┌───────────── 일 (1-31)
│ │ │ │ ┌───────────── 월 (1-12)
│ │ │ │ │ ┌───────────── 요일 (0-7, 0과 7은 일요일)
│ │ │ │ │ │
* * * * * *
```

### 특수 문자

| 문자 | 의미 | 예시 |
|------|------|------|
| `*` | 모든 값 | 매 분마다 |
| `,` | 목록 | `1,15,30` |
| `-` | 범위 | `1-5` (월~금) |
| `/` | 증분 | `*/5` (5분마다) |
| `?` | 특정 값 없음 | day/week 둘 중 하나만 지정 |
| `L` | 마지막 | `L` (월의 마지막 날) |
| `W` | 가장 가까운 평일 | `15W` |
| `#` | n번째 요일 | `2#3` (3번째 화요일) |

### 예시

```
# 매일 자정
0 0 0 * * *

# 매 시간 정각
0 0 * * * *

# 평일 오전 9시
0 0 9 * * 1-5

# 매월 1일 오전 6시
0 0 6 1 * *

# 5분마다
0 */5 * * * *

# 매주 월요일 오전 10시
0 0 10 * * 1
```

### 유용한 도구

**온라인 Cron Expression 생성기/해석기:**
- [CronTab Guru](https://crontab.guru/) - 일반 Cron
- [Quartz Cron Generator](https://www.freeformatter.com/cron-expression-generator-quartz.html) - Quartz (초 포함)

### Spring에서 사용

```java
@Scheduled(cron = "0 0 9 * * MON-FRI")
public void dailyReport() {
    // 평일 오전 9시 실행
}

@Scheduled(fixedRate = 60000)
public void everyMinute() {
    // 1분마다 실행
}
```

---

## 애플리케이션 등록 및 프로세스 관리

서버 애플리케이션을 안정적으로 운영하는 방법입니다.

### 간단한 백그라운드 실행

```bash
# & 사용 (가장 기본적인 방법)
./my-application &

# nohup 사용 (터미널 종료 후에도 유지)
nohup ./my-application > output.log 2>&1 &

# disown 사용
./my-application &
disown
```

### Supervisor

Python 기반 프로세스 관리 도구입니다.

**설치:**
```bash
pip install supervisor
```

**설정 (/etc/supervisor/conf.d/myapp.conf):**
```ini
[program:myapp]
command=/usr/bin/java -jar /opt/myapp/app.jar
directory=/opt/myapp
user=myapp
autostart=true
autorestart=true
stderr_logfile=/var/log/myapp/error.log
stdout_logfile=/var/log/myapp/output.log
```

**명령어:**
```bash
supervisorctl start myapp
supervisorctl stop myapp
supervisorctl restart myapp
supervisorctl status
```

### Systemd (Linux 표준)

현대 Linux 배포판의 표준 서비스 관리자입니다.

**서비스 파일 (/etc/systemd/system/myapp.service):**
```ini
[Unit]
Description=My Application
After=network.target

[Service]
Type=simple
User=myapp
WorkingDirectory=/opt/myapp
ExecStart=/usr/bin/java -jar app.jar
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

**명령어:**
```bash
sudo systemctl daemon-reload
sudo systemctl enable myapp    # 부팅 시 자동 시작
sudo systemctl start myapp
sudo systemctl status myapp
sudo journalctl -u myapp -f    # 로그 확인
```

### 유사한 도구들

| 도구 | 특징 |
|------|------|
| **launchd** | macOS 표준 |
| **daemontools** | djb 개발, 안정적 |
| **runit** | 경량, BSD 라이센스 |
| **PM2** | Node.js 특화, 클러스터 모드 |
| **Docker** | 컨테이너 기반 실행 |

---

## Mock Server

개발 및 테스트 시 실제 서버 없이 API를 시뮬레이션합니다.

### 온라인 Mock 서비스

**Mockable.io:**
- [https://www.mockable.io](https://www.mockable.io)
- REST/SOAP API Mock 지원
- 무료 플랜 제공

**Postman Echo:**
- [https://postman-echo.com](https://postman-echo.com)
- 요청 그대로 반환
- 헤더, 바디 테스트에 유용

**예시:**
```bash
# GET 요청 테스트
curl https://postman-echo.com/get?foo=bar

# POST 요청 테스트
curl -X POST https://postman-echo.com/post \
  -H "Content-Type: application/json" \
  -d '{"key": "value"}'
```

### 로컬 Mock 서버 도구

**JSON Server (Node.js):**
```bash
npm install -g json-server

# db.json 파일 생성
echo '{"users": [{"id": 1, "name": "John"}]}' > db.json

# 서버 실행
json-server --watch db.json --port 3000
```

**WireMock (Java):**
```bash
java -jar wiremock-standalone.jar --port 8080
```

**Python (Flask 간단 Mock):**
```python
from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/api/users/<int:user_id>')
def get_user(user_id):
    return jsonify({
        'id': user_id,
        'name': 'Mock User',
        'email': 'mock@example.com'
    })

if __name__ == '__main__':
    app.run(port=5000)
```

---

## 마무리

서버 개발은 단순히 코드를 작성하는 것을 넘어, 안정적이고 확장 가능한 시스템을 설계하는 것입니다. 이 글에서 다룬 개념들은 실무에서 자주 마주치는 기초적인 내용입니다.

### 추가 학습 자료

- [The Twelve-Factor App](https://12factor.net/ko/)
- [System Design Primer](https://github.com/donnemartin/system-design-primer)
- [AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/)
- [Google SRE Book](https://sre.google/sre-book/table-of-contents/)
