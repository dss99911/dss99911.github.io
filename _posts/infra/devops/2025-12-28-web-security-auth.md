---
layout: post
title: "웹 보안과 인증: SSL/TLS, OAuth, Authentication"
date: 2025-12-28 12:05:00 +0900
categories: [infra, devops]
tags: [security, ssl, tls, oauth, authentication, https]
description: "SSL/TLS 인증서, OAuth 인증 방식, 다양한 웹 인증 방법을 설명합니다."
---

## SSL/TLS

SSL(Secure Sockets Layer)과 TLS(Transport Layer Security)는 네트워크 통신을 암호화하는 프로토콜입니다.

### 주요 기능

1. **암호화**: 데이터 도청 방지
2. **무결성**: 데이터 변조 방지
3. **인증**: 서버(및 클라이언트) 신원 확인

### TLS 버전

| 버전 | 상태 |
|------|------|
| SSL 2.0, 3.0 | 사용 금지 |
| TLS 1.0, 1.1 | 지원 종료 |
| TLS 1.2 | 현재 사용 |
| TLS 1.3 | 최신, 권장 |

### 인증서 종류

- **DV (Domain Validation)**: 도메인 소유권만 확인
- **OV (Organization Validation)**: 조직 확인 포함
- **EV (Extended Validation)**: 엄격한 검증

### Let's Encrypt로 무료 인증서 발급

```bash
# certbot 설치
sudo apt install certbot

# 인증서 발급
sudo certbot certonly --standalone -d example.com

# Nginx용
sudo certbot --nginx -d example.com

# 갱신
sudo certbot renew
```

---

## 자체 발급 인증서 (Self-Signed)

개발 환경에서 사용할 수 있는 자체 서명 인증서입니다.

### OpenSSL로 인증서 생성

```bash
# 개인키 생성
openssl genrsa -out server.key 2048

# CSR 생성
openssl req -new -key server.key -out server.csr

# 자체 서명 인증서 생성 (365일 유효)
openssl x509 -req -days 365 -in server.csr \
  -signkey server.key -out server.crt

# 또는 한 번에 생성
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout server.key -out server.crt
```

### Nginx 설정

```nginx
server {
    listen 443 ssl;
    server_name example.com;

    ssl_certificate /path/to/server.crt;
    ssl_certificate_key /path/to/server.key;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
}
```

---

## Authentication (인증)

### 인증 방식 비교

| 방식 | 설명 | 장점 | 단점 |
|------|------|------|------|
| Session | 서버에 세션 저장 | 서버 제어 용이 | 확장성 제한 |
| JWT | 토큰 기반 | 무상태, 확장성 | 토큰 취소 어려움 |
| OAuth | 위임 인증 | 보안, 표준화 | 복잡성 |
| API Key | 고정 키 | 간단함 | 보안 취약 |

### Basic Authentication

```
Authorization: Basic base64(username:password)
```

```bash
# 예시
curl -u username:password https://api.example.com
# 또는
curl -H "Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ=" https://api.example.com
```

### Bearer Token (JWT)

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## OAuth 2.0

OAuth는 제3자 애플리케이션에 리소스 접근 권한을 안전하게 위임하는 프로토콜입니다.

### OAuth 2.0 흐름 (Authorization Code)

```
1. 사용자 -> 클라이언트: 로그인 요청
2. 클라이언트 -> 인증서버: 인증 요청 (redirect)
3. 사용자: 로그인 및 권한 승인
4. 인증서버 -> 클라이언트: Authorization Code
5. 클라이언트 -> 인증서버: Code로 Access Token 요청
6. 인증서버 -> 클라이언트: Access Token 발급
7. 클라이언트 -> 리소스서버: Access Token으로 API 호출
```

### 간단한 OAuth 구현 예시

**1단계: 인증 URL 생성**
```
https://accounts.google.com/o/oauth2/v2/auth?
  client_id=CLIENT_ID&
  redirect_uri=https://example.com/callback&
  response_type=code&
  scope=email profile
```

**2단계: Access Token 요청**
```bash
curl -X POST https://oauth2.googleapis.com/token \
  -d "client_id=CLIENT_ID" \
  -d "client_secret=CLIENT_SECRET" \
  -d "code=AUTHORIZATION_CODE" \
  -d "grant_type=authorization_code" \
  -d "redirect_uri=https://example.com/callback"
```

### OAuth Grant Types

| Grant Type | 사용 사례 |
|------------|----------|
| Authorization Code | 웹 애플리케이션 |
| PKCE | 모바일/SPA |
| Client Credentials | 서버 간 통신 |
| Refresh Token | 토큰 갱신 |

---

## WebSocket

WebSocket은 양방향 실시간 통신을 위한 프로토콜입니다.

### 특징

- 전이중(Full-duplex) 통신
- 낮은 오버헤드
- 실시간 데이터 전송

### 핸드셰이크

```
# 요청
GET /chat HTTP/1.1
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
Sec-WebSocket-Version: 13

# 응답
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=
```

### JavaScript 예시

```javascript
const ws = new WebSocket('wss://example.com/socket');

ws.onopen = () => {
    console.log('Connected');
    ws.send('Hello Server!');
};

ws.onmessage = (event) => {
    console.log('Received:', event.data);
};

ws.onclose = () => {
    console.log('Disconnected');
};

ws.onerror = (error) => {
    console.error('Error:', error);
};
```

---

## 프로토콜 비교

| 프로토콜 | 포트 | 특징 |
|----------|------|------|
| HTTP | 80 | 비암호화 |
| HTTPS | 443 | SSL/TLS 암호화 |
| WS | 80 | WebSocket |
| WSS | 443 | WebSocket over TLS |
| FTP | 21 | 파일 전송 |
| SFTP | 22 | 보안 파일 전송 |
| SSH | 22 | 보안 셸 |

---

## 미들웨어

미들웨어는 요청과 응답 사이에서 동작하는 소프트웨어입니다.

### 웹 서버 미들웨어 역할

- 로드 밸런싱
- 캐싱
- 인증/인가
- 로깅
- 압축
- CORS 처리

### 일반적인 구조

```
클라이언트 <-> 로드밸런서 <-> 웹서버 <-> 애플리케이션 서버 <-> 데이터베이스
```
