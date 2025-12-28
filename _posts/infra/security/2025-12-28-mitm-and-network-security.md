---
layout: post
title: "MITM 공격과 네트워크 보안 - SSL Pinning, HSTS 완벽 가이드"
date: 2025-12-28 12:00:00 +0900
categories: [infra, security]
tags: [security, mitm, ssl, https, ssl-pinning, hsts, network-security, burpsuite, wireshark]
description: "MITM(Man-in-the-Middle) 공격의 원리와 방어 방법, SSL Pinning, HSTS, 그리고 네트워크 트래픽 분석 도구인 Burpsuite와 Wireshark 사용법을 다룹니다."
---

# MITM 공격과 네트워크 보안

네트워크 보안은 현대 애플리케이션 개발에서 가장 중요한 요소 중 하나입니다. 이 글에서는 MITM(Man-in-the-Middle) 공격의 원리와 이를 방어하기 위한 다양한 기술들을 살펴봅니다.

## MITM(Man-in-the-Middle) 공격이란?

MITM 공격은 공격자가 두 통신 당사자 사이에 끼어들어 통신 내용을 도청하거나 변조하는 공격 방식입니다. 공격자는 프록시 서버나 악성 WiFi를 통해 트래픽을 가로채고, 민감한 정보를 탈취할 수 있습니다.

## 보안 레이어별 방어 전략

네트워크 보안은 여러 계층의 방어가 필요합니다. 각 계층별로 어떤 공격을 방어할 수 있는지 살펴보겠습니다.

### 1. HTTPS

**방어 가능한 공격:**
- 프록시 서버나 해커의 WiFi를 통한 스니핑(Sniffing)
- 데이터 위변조

**우회 조건:**
- HTTP로 호출하는 경우 방어가 무력화됨

### 2. HSTS (HTTP Strict Transport Security)

HSTS는 웹사이트가 브라우저에게 "이 사이트는 항상 HTTPS로만 접근해야 한다"고 알려주는 보안 메커니즘입니다.

**방어 가능한 공격:**
- HTTPS를 HTTP로 다운그레이드하는 공격

**우회 조건:**
- MITM 프록시 서버 인증서가 설치되고, 통신이 해당 프록시 서버로 이루어지는 경우

### 3. Request 암호화

**방어 가능한 공격:**
- HSTS까지 우회된 상황에서의 스니핑 및 위변조

**암호화 방식별 특징:**

| 방식 | 장점 | 단점 |
|------|------|------|
| 비대칭키 | 키 교환이 안전 | Request를 볼 수는 없지만 변조는 가능 |
| 대칭키 | 빠른 암호화/복호화 | 키 전달 시 유출 우려, 안전한 저장소 필요 |

**우회 조건:**
- Frida와 같은 도구로 암호화 전 MITM 공격
- 암호화에 필요한 Public Key 변조

**대칭키 교환 과정의 취약점:**
1. 앱에서 대칭키를 생성
2. 서버의 공개키로 암호화 후 서버로 전송
3. 만약 MITM 서버가 서버의 공개키 대신 자신의 공개키를 전달하면, MITM 서버가 대칭키를 획득 가능

### 4. SSL Pinning

SSL Pinning은 애플리케이션이 신뢰하는 인증서를 미리 앱 내에 저장(Pin)해 두고, 서버 연결 시 해당 인증서와 일치하는지 검증하는 기술입니다.

**인증서 체인의 종류:**
- **Leaf Certificate**: 서버의 실제 인증서
- **Intermediate Certificate**: 중간 인증서
- **Root Certificate**: 루트 인증서

**방어 가능한 공격:**
- Request 암호화까지 우회된 경우의 MITM 공격

**우회 조건:**
- Frida와 같은 리버스 엔지니어링 도구 사용

**Frida 방어 방법:**
- 루팅된 디바이스 탐지 및 차단
- Frida-gadget 삽입 방지를 위한 앱 위변조 탐지
- 안드로이드 시스템 파일 수정을 통한 디버깅 활성화 탐지

### 5. Rooting, APK 변조, 시스템 변조 탐지

**방어 가능한 공격:**
- Frida와 같은 도구를 통한 해킹 시도

**우회 조건:**
- APK 내 탐지 로직을 제거하고 재빌드

## 해킹을 위한 환경 조건

공격이 성공하려면 다음 중 하나의 조건이 충족되어야 합니다:
- 해킹 도구가 삽입된 APK
- 루팅된 단말 + 해킹 도구 설치

## 권장 보안 전략

1. **위의 모든 보안 레이어 적용**
2. **APK 수정을 어렵게 만들기**
   - 코드 난독화(Obfuscation)
   - 무결성 검증
3. **Play Store 외 설치 차단**
   - 사이드로딩 탐지 및 차단

---

## 네트워크 분석 도구

### Burpsuite

Burpsuite는 웹 애플리케이션 보안 테스트를 위한 MITM 프록시 서버입니다. 보안 진단 및 API 트래픽 분석에 널리 사용됩니다.

**유사한 도구:**
- Fiddler: 서버 개발자가 웹브라우저 API 호출 인터셉트할 때 주로 사용

**설치:** [Burpsuite Community Download](https://portswigger.net/burp/communitydownload)

#### 프록시 설정 방법

1. **Burpsuite 설정:**
   - Proxy -> Options -> Proxy Listener -> 클릭 후 Edit
   - Binding tab -> Specific address -> 로컬IP:8080으로 설정

2. **WiFi 프록시 설정:**
   - Mac과 디바이스를 같은 WiFi에 연결
   - Mac의 로컬 IP 확인: 설정 -> 네트워크
   - 디바이스에서 프록시 설정 (Manual)
   - Proxy host name에 로컬 IP 주소 입력

3. **인증서 설치:**
   - 디바이스 브라우저에서 로컬IP:8080 접속
   - CA Certificate 다운로드
   - .der 파일을 .cer 확장자로 변경
   - 설정 -> 보안 -> 인증서 설치 -> CA 인증서

#### 압축 해제 설정
Options -> Miscellaneous에서 압축 해제 옵션 설정 가능

### Wireshark

Wireshark는 네트워크 패킷 분석 도구로, 네트워크 트래픽을 캡처하고 분석할 수 있습니다.

#### 자주 사용하는 필터

특정 IP 범위에서 오는 트래픽 캡처:

```
src net 192.168.0.0/24
```

특정 IP 범위로 가는 트래픽 캡처:

```
dst net 192.168.0.0/24
```

더 많은 필터 옵션: [Wireshark Capture Filters](https://wiki.wireshark.org/CaptureFilters)

---

## SSL 인증서 유효성 검사

서버의 SSL 인증서 유효성을 온라인으로 검사할 수 있는 도구:
- [GlobalSign SSL Labs](https://globalsign.ssllabs.com/analyze.html)

---

## 참고 자료

- [Android Security: SSL Pinning](https://medium.com/@appmattus/android-security-ssl-pinning-1db8acb6621e)
- [Bypassing Android SSL Pinning with Frida](https://securitygrind.com/bypassing-android-ssl-pinning-with-frida/)
