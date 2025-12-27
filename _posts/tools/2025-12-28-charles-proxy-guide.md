---
layout: post
title: "Charles Proxy 완벽 가이드 - HTTPS 트래픽 디버깅"
date: 2025-12-28 12:02:00 +0900
categories: tools
tags: [charles, proxy, debugging, https, network]
description: "Charles Proxy를 사용하여 모바일 앱의 네트워크 트래픽을 분석하고 조작하는 방법을 설명합니다."
---

Charles Proxy는 웹 디버깅 프록시 애플리케이션으로, HTTP/HTTPS 트래픽을 모니터링하고 수정할 수 있습니다. 특히 모바일 앱 개발 시 네트워크 요청을 디버깅하는 데 매우 유용합니다.

## 1. SSL 인증서 설정

HTTPS 트래픽을 확인하려면 SSL Proxying 인증서를 설정해야 합니다.

### 인증서 생성

1. Charles 메뉴에서 `Help > SSL Proxying > Save Charles Root Certificate...` 선택
2. `.cer` 확장자로 저장

### 모바일 기기에 인증서 설치

1. 인증서 파일을 모바일 기기로 전송
2. 파일을 열어 설치
3. 인증서 이름만 입력

### iOS 추가 설정

iOS 10.3 이상에서는 추가 신뢰 설정이 필요합니다:

1. `Settings > General > About > Certificate Trust Settings`
2. Charles Proxy CA 인증서 활성화

### Android 추가 설정

Android 7.0 이상에서는 앱에서 사용자 인증서를 신뢰하도록 설정해야 합니다.

`network_security_config.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <debug-overrides>
        <trust-anchors>
            <certificates src="user"/>
        </trust-anchors>
    </debug-overrides>
</network-security-config>
```

## 2. Proxy 설정

### Charles에서 프록시 시작

1. `Proxy > Proxy Settings` 열기
2. Port 입력 (기본값: 8888)
3. `Enable transparent HTTP proxying` 체크

### Transparent Proxy란?

기존 프록시는 사용자의 애플리케이션이나 네트워크 설정을 변경해야 합니다. Transparent Proxy는 패킷을 가로채서 처리하므로, 목적지에서 직접 처리하는 것처럼 보이게 합니다. 이를 통해 사용자의 컴퓨터를 재구성하지 않고도 프록시를 구현할 수 있습니다.

### 모바일 기기에서 프록시 설정

1. 데스크톱과 같은 WiFi 네트워크에 연결
2. WiFi 설정에서 프록시 설정:
   - 프록시: Manual
   - 서버: 데스크톱의 IP 주소
   - 포트: 8888

### 데스크톱 IP 확인

```bash
# macOS/Linux
ifconfig | grep "inet "

# Windows
ipconfig
```

### 연결 확인

모바일에서 웹 브라우저를 열고 아무 사이트나 접속하면 Charles에서 패킷이 보이기 시작합니다.

## 3. 트래픽 조작

### 특정 URL에 포커스

원하는 호스트만 집중적으로 모니터링할 수 있습니다:

1. Structure 뷰에서 호스트 우클릭
2. `Focus` 선택

또는 `Proxy > Recording Settings > Include`에서 설정

### SSL Proxying 활성화

HTTPS 트래픽의 내용을 보려면 SSL Proxying을 활성화해야 합니다:

1. 호스트 우클릭
2. `Enable SSL Proxying` 선택

또는 `Proxy > SSL Proxying Settings > Add`에서 호스트 추가

### Breakpoint 설정

요청이나 응답을 중간에 멈추고 수정할 수 있습니다:

1. 요청 우클릭
2. `Breakpoints` 선택
3. 새로운 요청 발생 시 Charles가 일시 정지
4. 요청/응답 내용 수정 후 `Execute` 클릭

**팁**: Breakpoint 설정 후 히스토리를 지우면 새 패킷을 더 쉽게 확인할 수 있습니다.

### Map Local

서버 응답 대신 로컬 파일의 내용을 반환할 수 있습니다:

1. `Tools > Map Local`
2. `Add` 클릭
3. 매핑할 URL과 로컬 파일 경로 설정

### Map Remote

요청을 다른 서버로 리다이렉트할 수 있습니다:

1. `Tools > Map Remote`
2. 원본 URL과 대상 URL 설정

### Rewrite

요청이나 응답의 특정 부분을 자동으로 수정할 수 있습니다:

1. `Tools > Rewrite`
2. 규칙 추가 (헤더 수정, 본문 교체 등)

## 4. 유용한 기능

### Repeat

동일한 요청을 다시 보낼 수 있습니다:

1. 요청 우클릭
2. `Repeat` 또는 `Repeat Advanced` (여러 번 반복)

### Compose

새로운 요청을 직접 작성하여 보낼 수 있습니다:

1. `Tools > Compose`
2. 메서드, URL, 헤더, 본문 입력
3. `Execute` 클릭

### Export

세션 데이터를 내보낼 수 있습니다:

1. `File > Export Session`
2. 다양한 형식 지원 (Charles Session, HAR, cURL 등)

## 5. 주의사항

- 개발 및 테스트 목적으로만 사용하세요
- 실제 사용자 트래픽을 가로채는 것은 법적 문제가 될 수 있습니다
- 테스트 완료 후 모바일 기기의 프록시 설정을 해제하세요

## 참고 자료

- [Charles Proxy Documentation](https://www.charlesproxy.com/documentation/)
- [Charles SSL Proxying](https://www.charlesproxy.com/documentation/proxying/ssl-proxying/)
