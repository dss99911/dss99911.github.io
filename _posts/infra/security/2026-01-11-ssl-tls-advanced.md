---
layout: post
title: "SSL/TLS 심화 - 자체 인증서 발급과 MITM 공격 원리"
date: 2026-01-11 11:00:00 +0900
categories: [infra, security]
tags: [security, ssl, tls, certificate, https, mitm, openssl]
description: "SSL/TLS 인증서의 작동 원리, 자체 CA 인증서 발급 방법, 그리고 Charles Proxy 같은 도구가 HTTPS 트래픽을 가로채는 원리를 설명합니다."
image: /assets/images/posts/ssl-tls-advanced.png
---

# SSL/TLS 심화 가이드

SSL/TLS는 인터넷 통신의 보안을 담당하는 핵심 프로토콜입니다. 이 글에서는 인증서 체인의 작동 원리, 자체 CA 구축 방법, 그리고 MITM 도구가 HTTPS를 우회하는 원리를 상세히 설명합니다.

## SSL/TLS 인증서 체인 이해하기

### 인증서 체인 구조

SSL 인증서는 계층적 구조(Chain of Trust)를 가집니다.

```
Root CA (최상위 인증기관)
    │
    └── Intermediate CA (중간 인증기관)
            │
            └── Server Certificate (서버 인증서)
```

| 인증서 유형 | 설명 | 예시 |
|------------|------|------|
| **Root CA** | 최상위 인증기관, 운영체제에 내장됨 | DigiCert, GlobalSign |
| **Intermediate CA** | 중간 인증기관, Root CA가 서명 | Let's Encrypt Authority X3 |
| **Server Certificate** | 실제 도메인에 발급된 인증서 | example.com |

### 인증서 검증 과정

1. 클라이언트가 서버에 연결 요청
2. 서버가 자신의 인증서와 중간 CA 인증서를 전송
3. 클라이언트가 인증서 체인을 검증:
   - 서버 인증서 → 중간 CA의 공개키로 서명 확인
   - 중간 CA 인증서 → Root CA의 공개키로 서명 확인
   - Root CA → 디바이스에 내장된 신뢰 목록에서 확인
4. 모든 검증 통과 시 안전한 연결 수립

---

## SSL/TLS 통신 과정

### TLS 핸드셰이크

```
클라이언트                              서버
    │                                    │
    │──── 1. ClientHello ───────────────>│
    │     (지원하는 암호화 방식 목록)      │
    │                                    │
    │<─── 2. ServerHello ────────────────│
    │     (선택된 암호화 방식)             │
    │                                    │
    │<─── 3. Certificate ────────────────│
    │     (서버 인증서 전송)              │
    │                                    │
    │<─── 4. ServerHelloDone ────────────│
    │                                    │
    │──── 5. ClientKeyExchange ─────────>│
    │     (대칭키 교환용 데이터)           │
    │                                    │
    │──── 6. ChangeCipherSpec ──────────>│
    │     (암호화 시작 알림)              │
    │                                    │
    │<─── 7. ChangeCipherSpec ───────────│
    │                                    │
    │<══════ 암호화된 통신 시작 ══════════>│
```

### 대칭키 교환 방식

인증서의 공개키를 사용하여 대칭키를 안전하게 교환합니다.

```
1. 클라이언트: 랜덤 Pre-Master Secret 생성
2. 클라이언트: 서버의 공개키로 암호화하여 전송
3. 서버: 자신의 개인키로 복호화
4. 양측: Pre-Master Secret으로 대칭키(Session Key) 생성
5. 이후 통신: 대칭키로 암호화/복호화
```

---

## 자체 CA 인증서 발급

공인 CA 인증서는 비용이 발생합니다. 내부 시스템이나 개발 환경에서는 자체 CA를 구축하여 인증서를 발급할 수 있습니다.

### 1. Root CA 인증서 생성

```bash
# Root CA 개인키 생성
openssl genrsa -aes256 -out rootCA.key 4096

# Root CA 인증서 생성 (10년 유효)
openssl req -x509 -new -nodes \
    -key rootCA.key \
    -sha256 \
    -days 3650 \
    -out rootCA.crt \
    -subj "/C=KR/ST=Seoul/O=My Organization/CN=My Root CA"
```

### 2. 서버 인증서 발급

```bash
# 서버 개인키 생성
openssl genrsa -out server.key 2048

# CSR (Certificate Signing Request) 생성
openssl req -new \
    -key server.key \
    -out server.csr \
    -subj "/C=KR/ST=Seoul/O=My Organization/CN=myserver.local"

# Root CA로 서버 인증서 서명
openssl x509 -req \
    -in server.csr \
    -CA rootCA.crt \
    -CAkey rootCA.key \
    -CAcreateserial \
    -out server.crt \
    -days 365 \
    -sha256
```

### 3. 클라이언트에 Root CA 설치

자체 발급한 인증서를 신뢰하려면 클라이언트에 Root CA를 설치해야 합니다.

**macOS:**
```bash
sudo security add-trusted-cert -d -r trustRoot \
    -k /Library/Keychains/System.keychain rootCA.crt
```

**Linux:**
```bash
sudo cp rootCA.crt /usr/local/share/ca-certificates/
sudo update-ca-certificates
```

**Android:**
- 설정 > 보안 > 인증서 설치 > CA 인증서

---

## 서버 인증서 정보 확인

### OpenSSL로 확인

```bash
# 서버 인증서 정보 조회
openssl s_client -connect google.com:443 -servername google.com

# 인증서 체인 확인
openssl s_client -connect google.com:443 -showcerts

# 인증서 상세 정보
openssl s_client -connect google.com:443 2>/dev/null | \
    openssl x509 -text -noout
```

### 예시 출력

```
Certificate chain
 0 s:/CN=*.google.com
   i:/C=US/O=Google Trust Services/CN=GTS CA 1C3
 1 s:/C=US/O=Google Trust Services/CN=GTS CA 1C3
   i:/C=US/O=Google Trust Services LLC/CN=GTS Root R1
 2 s:/C=US/O=Google Trust Services LLC/CN=GTS Root R1
   i:/C=BE/O=GlobalSign nv-sa/CN=GlobalSign Root CA
```

---

## MITM 프록시 동작 원리

Charles Proxy, Burpsuite 같은 도구가 HTTPS 트래픽을 가로채는 원리를 이해해봅시다.

### MITM 공격 시나리오

```
┌─────────┐         ┌──────────────┐         ┌─────────┐
│ 클라이언트│◄───────►│ MITM 프록시  │◄───────►│  서버   │
│   (A)   │         │     (C)     │         │   (B)   │
└─────────┘         └──────────────┘         └─────────┘
```

### 단계별 동작

1. **클라이언트(A)가 서버(B)에 인증서 요청**
   - 실제로는 프록시(C)로 요청이 전달됨

2. **프록시(C)가 서버(B)에 인증서 요청**
   - 프록시는 실제 서버와 정상적인 TLS 연결 수립

3. **서버(B)가 프록시(C)에 인증서 전달**
   - 프록시는 서버의 인증서가 유효한지 검증

4. **프록시(C)가 모조 인증서 생성**
   - 프록시가 자체 CA로 서명한 가짜 인증서를 생성
   - 도메인 이름은 원본 서버와 동일하게 설정

5. **프록시(C)가 클라이언트(A)에 모조 인증서 전달**
   - 클라이언트는 이 인증서가 유효한지 확인

6. **클라이언트가 인증서 검증**
   - 정상 상황: 인증서가 신뢰할 수 없으므로 경고 표시
   - **프록시 CA 설치된 경우**: 프록시 CA가 신뢰 목록에 있어 통과

7. **양방향 복호화 가능**
   - 프록시는 양쪽 모두와 별도의 TLS 세션 유지
   - 모든 트래픽을 복호화하여 확인/수정 가능

### 방어 방법: SSL Pinning

```kotlin
// OkHttp에서 SSL Pinning 구현
val client = OkHttpClient.Builder()
    .certificatePinner(
        CertificatePinner.Builder()
            .add("api.example.com", "sha256/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=")
            .build()
    )
    .build()
```

SSL Pinning은 앱 내에 서버 인증서의 해시를 저장하여, 프록시의 모조 인증서를 거부합니다.

---

## SSL/TLS 취약점과 대응

### 인증서 경고 무시의 위험

브라우저가 인증서 경고를 표시할 때 확인해야 할 사항:

| 점검 항목 | 설명 |
|----------|------|
| DNS 서버 설정 | DNS가 변조되어 잘못된 IP로 연결될 수 있음 |
| WiFi AP | 악성 WiFi에서 MITM 공격 가능 |
| 프록시 설정 | 시스템에 프록시가 설정되어 있는지 확인 |
| hosts 파일 | 도메인이 다른 IP로 매핑되어 있을 수 있음 |

### SSL Strip 공격

HTTPS를 HTTP로 다운그레이드하는 공격입니다.

**공격 방식:**
1. 사용자가 `http://bank.com` 접속
2. 공격자가 서버의 HTTPS 응답을 가로채어 HTTP로 변환
3. 사용자는 암호화되지 않은 연결로 민감한 정보 전송

**대응 방법: HSTS**
```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

### IDN Homograph 공격

시각적으로 유사한 도메인을 사용한 피싱 공격입니다.

| 실제 도메인 | 가짜 도메인 | 차이점 |
|------------|------------|--------|
| apple.com | аpple.com | 'a'가 키릴 문자 'а' |
| google.com | gооgle.com | 'o'가 키릴 문자 'о' |

**대응 방법:**
- 브라우저의 Punycode 표시 기능 활성화
- URL 직접 확인

---

## SSL 인증서 관련 도구

### 온라인 검증 도구

- [SSL Labs Server Test](https://www.ssllabs.com/ssltest/) - 서버 SSL 설정 종합 분석
- [GlobalSign SSL Labs](https://globalsign.ssllabs.com/) - 인증서 유효성 검사

### 커맨드라인 도구

```bash
# 인증서 만료일 확인
openssl s_client -connect example.com:443 2>/dev/null | \
    openssl x509 -noout -dates

# 인증서 발급자 확인
openssl s_client -connect example.com:443 2>/dev/null | \
    openssl x509 -noout -issuer

# 인증서 전체 정보 (JSON 형식)
curl -vvI https://example.com 2>&1 | grep -A 6 "Server certificate"
```

---

## 참고 자료

- [NIST 암호화 권장 사항](https://csrc.nist.gov/publications/detail/sp/800-52/rev-2/final)
- [Android SSL 보안 가이드](https://developer.android.com/training/articles/security-ssl)
- [SSL Strip 공격 원리](https://avicoder.me/2016/02/22/SSLstrip-for-newbies/)
- [자체 인증서 SSL 구축](http://theeye.pe.kr/archives/2605)

