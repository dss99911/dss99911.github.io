---
layout: post
title: "네트워크 기초: DNS, IP, ARP 이해하기"
date: 2025-12-28 12:04:00 +0900
categories: [infra, devops]
tags: [network, dns, ip, arp, cdn, web]
description: "DNS, IP 주소, ARP 프로토콜, CDN 등 네트워크의 기본 개념을 설명합니다."
image: /assets/images/posts/thumbnails/2025-12-28-network-fundamentals.png
---

## DNS (Domain Name System)

DNS는 도메인 이름을 IP 주소로 변환하는 시스템입니다.

### 기본 개념

- **Forward DNS**: 도메인 -> IP 변환
- **Reverse DNS**: IP -> 도메인 변환

### DNS 레코드 타입

| 타입 | 설명 | 예시 |
|------|------|------|
| A | IPv4 주소 | example.com -> 93.184.216.34 |
| AAAA | IPv6 주소 | example.com -> 2606:2800:220:1:... |
| CNAME | 별칭 | www.example.com -> example.com |
| MX | 메일 서버 | example.com -> mail.example.com |
| NS | 네임 서버 | example.com -> ns1.example.com |
| TXT | 텍스트 정보 | SPF, DKIM 등 |

### DNS 서버 체크

```bash
# nslookup 사용
nslookup example.com

# dig 사용
dig example.com

# 특정 DNS 서버 지정
nslookup example.com 8.8.8.8
dig @8.8.8.8 example.com

# 모든 레코드 조회
dig example.com ANY
```

### 주요 공개 DNS 서버

- Google: 8.8.8.8, 8.8.4.4
- Cloudflare: 1.1.1.1, 1.0.0.1
- OpenDNS: 208.67.222.222

---

## IP (Internet Protocol)

### IPv4 주소 체계

- 32비트 (4개의 옥텟)
- 예: 192.168.1.1

### IPv4 클래스

| 클래스 | 범위 | 사설 IP 대역 |
|--------|------|-------------|
| A | 1.0.0.0 ~ 126.255.255.255 | 10.0.0.0/8 |
| B | 128.0.0.0 ~ 191.255.255.255 | 172.16.0.0/12 |
| C | 192.0.0.0 ~ 223.255.255.255 | 192.168.0.0/16 |

### CIDR 표기법

```
192.168.1.0/24  -> 256개 IP (192.168.1.0 ~ 192.168.1.255)
192.168.1.0/25  -> 128개 IP
192.168.1.0/26  -> 64개 IP
```

### IP 분석 도구

```bash
# IP 정보 조회
curl ipinfo.io
curl ipinfo.io/8.8.8.8

# traceroute
traceroute google.com

# ping
ping -c 4 google.com
```

---

## ARP (Address Resolution Protocol)

ARP는 IP 주소를 MAC 주소로 변환합니다.

### 동작 원리

1. ARP Request (브로드캐스트): "192.168.1.1의 MAC 주소는?"
2. ARP Reply (유니캐스트): "192.168.1.1은 AA:BB:CC:DD:EE:FF"

### ARP 테이블 확인

```bash
# macOS/Linux
arp -a

# Windows
arp -a
```

---

## CDN (Content Delivery Network)

### 개념

CDN은 전 세계에 분산된 서버 네트워크를 통해 콘텐츠를 빠르게 전달합니다.

### 장점

- 지연 시간 감소
- 서버 부하 분산
- 가용성 향상
- DDoS 방어

### 주요 CDN 서비스

- Cloudflare
- AWS CloudFront
- Akamai
- Fastly

### 동작 방식

1. 사용자가 콘텐츠 요청
2. DNS가 가장 가까운 엣지 서버로 라우팅
3. 엣지 서버가 캐시된 콘텐츠 제공
4. 캐시 미스 시 원본 서버에서 가져옴

---

## 네트워크 속도 체크

```bash
# 다운로드 속도 테스트
curl -o /dev/null -w "Speed: %{speed_download}\n" http://speedtest.tele2.net/10MB.zip

# speedtest-cli 사용
pip install speedtest-cli
speedtest-cli

# iperf3 (서버 간 테스트)
iperf3 -s  # 서버
iperf3 -c [서버IP]  # 클라이언트
```

---

## 인코딩

### URL 인코딩

URL에서 특수문자를 안전하게 전송하기 위한 인코딩:

```
공백 -> %20 또는 +
? -> %3F
& -> %26
= -> %3D
```

### Base64

바이너리 데이터를 텍스트로 변환:

```bash
# 인코딩
echo "Hello World" | base64

# 디코딩
echo "SGVsbG8gV29ybGQK" | base64 -d
```

**Base64를 사용하는 이유:**
- HTTP 헤더나 URL에서 바이너리 데이터 전송
- 이메일 첨부파일 전송
- JSON에서 바이너리 데이터 포함

---

## 캐싱

### 브라우저 캐싱

```
Cache-Control: max-age=3600        # 1시간 캐시
Cache-Control: no-cache            # 매번 검증
Cache-Control: no-store            # 캐시 금지
Cache-Control: private             # 개인 캐시만
Cache-Control: public              # 공유 캐시 가능
```

### ETag와 조건부 요청

```
# 첫 응답
HTTP/1.1 200 OK
ETag: "abc123"

# 다음 요청
If-None-Match: "abc123"

# 변경 없으면
HTTP/1.1 304 Not Modified
```

---

## 메시 네트워크

분산된 노드들이 서로 연결되어 네트워크를 구성하는 방식입니다.

### 특징
- 자가 구성 (Self-configuring)
- 자가 치유 (Self-healing)
- 장애 허용

### 활용 사례
- 스마트 홈
- IoT 네트워크
- 재난 통신
