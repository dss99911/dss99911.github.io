---
layout: post
title: "HTTP 프로토콜 완벽 가이드: Request와 Response"
date: 2025-12-28 12:03:00 +0900
categories: [infra, devops]
tags: [http, network, web, rest-api, protocol]
description: "HTTP 프로토콜의 Request와 Response 구조, 상태 코드, 헤더 종류를 상세히 설명합니다."
image: /assets/images/posts/thumbnails/2025-12-28-http-protocol-guide.png
---

## HTTP 개요

HTTP(HyperText Transfer Protocol)는 웹에서 클라이언트와 서버 간의 통신을 위한 프로토콜입니다.

---

## HTTP Request

### Request 구조

```
[Method] [URL] [HTTP Version]
[Headers]

[Body]
```

### HTTP Methods

| Method | 설명 | 특징 |
|--------|------|------|
| GET | 리소스 조회 | Body 없음, 캐시 가능 |
| POST | 리소스 생성 | Body 포함 |
| PUT | 리소스 전체 수정 | 멱등성 보장 |
| PATCH | 리소스 부분 수정 | - |
| DELETE | 리소스 삭제 | 멱등성 보장 |
| HEAD | 헤더만 조회 | GET과 동일하나 Body 없음 |
| OPTIONS | 지원 메서드 확인 | CORS preflight에 사용 |

### Request Headers

```
Host: www.example.com
User-Agent: Mozilla/5.0
Accept: text/html,application/json
Accept-Language: ko-KR,ko;q=0.9
Accept-Encoding: gzip, deflate, br
Content-Type: application/json
Content-Length: 348
Authorization: Bearer <token>
Cookie: session_id=abc123
Cache-Control: no-cache
```

### Query Parameters

URL에 데이터를 포함시키는 방식:

```
GET /search?q=keyword&page=1&limit=10 HTTP/1.1
```

---

## HTTP Response

### Response 구조

```
[HTTP Version] [Status Code] [Status Message]
[Headers]

[Body]
```

### 주요 Status Codes

#### 2xx (성공)
| 코드 | 의미 | 설명 |
|------|------|------|
| 200 | OK | 요청 성공 |
| 201 | Created | 리소스 생성 성공 |
| 204 | No Content | 성공했으나 응답 Body 없음 |

#### 3xx (리다이렉션)
| 코드 | 의미 | 설명 |
|------|------|------|
| 301 | Moved Permanently | 영구 이동 |
| 302 | Found | 임시 이동 |
| 304 | Not Modified | 캐시 사용 |

#### 4xx (클라이언트 에러)
| 코드 | 의미 | 설명 |
|------|------|------|
| 400 | Bad Request | 잘못된 요청 |
| 401 | Unauthorized | 인증 필요 |
| 403 | Forbidden | 권한 없음 |
| 404 | Not Found | 리소스 없음 |
| 405 | Method Not Allowed | 허용되지 않은 메서드 |
| 429 | Too Many Requests | 요청 횟수 초과 |

#### 5xx (서버 에러)
| 코드 | 의미 | 설명 |
|------|------|------|
| 500 | Internal Server Error | 서버 내부 오류 |
| 502 | Bad Gateway | 게이트웨이 오류 |
| 503 | Service Unavailable | 서비스 이용 불가 |
| 504 | Gateway Timeout | 게이트웨이 시간 초과 |

### Response Headers

```
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Length: 1234
Cache-Control: max-age=3600
ETag: "abc123"
Last-Modified: Wed, 21 Oct 2024 07:28:00 GMT
Set-Cookie: session_id=xyz789; HttpOnly; Secure
Access-Control-Allow-Origin: *
```

---

## Content-Type

### 주요 MIME 타입

```
text/html               - HTML 문서
text/plain              - 일반 텍스트
application/json        - JSON 데이터
application/xml         - XML 데이터
application/x-www-form-urlencoded - 폼 데이터
multipart/form-data     - 파일 업로드
image/png, image/jpeg   - 이미지
```

### Form 데이터 전송

**application/x-www-form-urlencoded:**
```
name=John&email=john%40example.com
```

**multipart/form-data:**
```
------WebKitFormBoundary
Content-Disposition: form-data; name="file"; filename="image.png"
Content-Type: image/png

[Binary Data]
------WebKitFormBoundary--
```

---

## Curl을 이용한 HTTP 요청

### 기본 사용법

```bash
# GET 요청
curl https://api.example.com/users

# POST 요청
curl -X POST https://api.example.com/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John", "email": "john@example.com"}'

# 헤더 포함
curl -H "Authorization: Bearer token123" \
     -H "Accept: application/json" \
     https://api.example.com/users

# 응답 헤더 확인
curl -I https://api.example.com/users

# 상세 정보 출력
curl -v https://api.example.com/users

# 파일 업로드
curl -X POST https://api.example.com/upload \
  -F "file=@/path/to/file.png"

# 쿠키 저장 및 사용
curl -c cookies.txt https://api.example.com/login
curl -b cookies.txt https://api.example.com/dashboard
```

---

## HTTP/2와 HTTP/3

### HTTP/2 특징
- 멀티플렉싱: 하나의 연결로 여러 요청/응답 처리
- 헤더 압축 (HPACK)
- 서버 푸시
- 바이너리 프로토콜

### HTTP/3 특징
- QUIC 프로토콜 기반 (UDP)
- 연결 설정 시간 단축
- 향상된 패킷 손실 복구
