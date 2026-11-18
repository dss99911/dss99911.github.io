---
layout: post
title: "네트워크 기초: DNS, IP, ARP 이해하기"
date: 2025-08-03 09:59:00 +0900
categories: [infra, devops]
tags: [network, dns, ip, arp, cdn, web]
description: "DNS, IP 주소, ARP 프로토콜, CDN 등 네트워크의 기본 개념을 설명합니다."
image: /assets/images/posts/thumbnails/2025-12-28-network-fundamentals.png
redirect_from:
  - "/infra/devops/2025/12/28/network-fundamentals.html"
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

---

## TCP vs UDP

네트워크 통신의 두 가지 핵심 전송 프로토콜입니다.

### TCP (Transmission Control Protocol)

연결 지향적이며 신뢰성 있는 데이터 전송을 보장합니다.

**3-Way Handshake:**

1. **SYN**: 클라이언트 → 서버 (연결 요청)
2. **SYN-ACK**: 서버 → 클라이언트 (요청 수락)
3. **ACK**: 클라이언트 → 서버 (확인)

**특징:**
- 데이터 순서 보장
- 패킷 손실 시 재전송
- 흐름 제어, 혼잡 제어 지원
- 상대적으로 느림

### UDP (User Datagram Protocol)

비연결형 프로토콜로, 빠른 전송이 필요한 경우에 사용합니다.

**특징:**
- 연결 설정 과정 없음
- 데이터 순서 보장하지 않음
- 패킷 손실 시 재전송하지 않음
- 빠른 속도

### TCP vs UDP 비교

| 특성 | TCP | UDP |
|------|-----|-----|
| **연결** | 연결 지향 | 비연결 |
| **신뢰성** | 높음 | 낮음 |
| **순서 보장** | O | X |
| **속도** | 상대적으로 느림 | 빠름 |
| **오버헤드** | 큼 | 작음 |
| **사용 사례** | 웹, 이메일, 파일 전송 | 실시간 스트리밍, 게임, DNS |

---

## HTTP/HTTPS

### HTTP 메서드

| 메서드 | 용도 | 멱등성 | 안전성 |
|--------|------|--------|--------|
| GET | 리소스 조회 | O | O |
| POST | 리소스 생성 | X | X |
| PUT | 리소스 전체 수정 | O | X |
| PATCH | 리소스 부분 수정 | X | X |
| DELETE | 리소스 삭제 | O | X |
| HEAD | 헤더만 조회 | O | O |
| OPTIONS | 지원 메서드 확인 | O | O |

### HTTP 상태 코드

| 코드 범위 | 의미 | 자주 사용하는 코드 |
|----------|------|----------------|
| 1xx | 정보 | 100 Continue |
| 2xx | 성공 | 200 OK, 201 Created, 204 No Content |
| 3xx | 리다이렉션 | 301 Moved, 302 Found, 304 Not Modified |
| 4xx | 클라이언트 에러 | 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found |
| 5xx | 서버 에러 | 500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable |

### HTTPS

HTTPS는 HTTP에 TLS(Transport Layer Security)를 추가한 것입니다.

```bash
# SSL/TLS 인증서 확인
openssl s_client -connect example.com:443

# 인증서 만료일 확인
echo | openssl s_client -connect example.com:443 2>/dev/null | openssl x509 -noout -dates
```

---

## 방화벽과 포트

### 자주 사용하는 포트

| 포트 | 서비스 | 프로토콜 |
|------|--------|---------|
| 22 | SSH | TCP |
| 53 | DNS | TCP/UDP |
| 80 | HTTP | TCP |
| 443 | HTTPS | TCP |
| 3306 | MySQL | TCP |
| 5432 | PostgreSQL | TCP |
| 6379 | Redis | TCP |
| 8080 | HTTP Proxy/Alt | TCP |
| 27017 | MongoDB | TCP |

### 포트 확인 명령어

```bash
# 열려있는 포트 확인 (macOS)
lsof -i -P -n | grep LISTEN

# 열려있는 포트 확인 (Linux)
ss -tlnp
netstat -tlnp

# 특정 포트 사용 프로세스 확인
lsof -i :8080
```

---

## VPN (Virtual Private Network)

VPN은 공용 네트워크를 통해 사설 네트워크에 안전하게 접속할 수 있게 하는 기술입니다.

### VPN 유형

| 유형 | 설명 | 사용 사례 |
|------|------|----------|
| **Site-to-Site** | 두 네트워크를 연결 | 본사-지사 연결 |
| **Remote Access** | 개인이 사내망에 접속 | 재택근무 |
| **Client-to-Client** | 사용자 간 직접 연결 | P2P 통신 |

### VPN 프로토콜

- **WireGuard**: 최신, 빠르고 간단, 커널 수준에서 동작
- **OpenVPN**: 오픈소스, 높은 보안성, 널리 사용
- **IPsec/IKEv2**: 기업 환경에서 많이 사용, 모바일 전환에 강함

---

## 네트워크 디버깅 실전

### tcpdump로 패킷 캡처

```bash
# 특정 포트의 패킷 캡처
sudo tcpdump -i eth0 port 80 -n

# 특정 호스트 간 통신 캡처
sudo tcpdump -i any host 192.168.1.100

# 파일로 저장 (Wireshark에서 분석)
sudo tcpdump -i eth0 -w capture.pcap
```

### curl로 HTTP 디버깅

```bash
# 상세 요청/응답 확인
curl -v https://example.com

# 응답 시간 측정
curl -o /dev/null -s -w "DNS: %{time_namelookup}s\nConnect: %{time_connect}s\nTTFB: %{time_starttransfer}s\nTotal: %{time_total}s\n" https://example.com

# 특정 헤더와 함께 요청
curl -H "Authorization: Bearer token" https://api.example.com/users
```

### MTR (My Traceroute)

traceroute와 ping을 결합한 도구로, 네트워크 경로의 문제를 지속적으로 모니터링합니다.

```bash
# 설치 (macOS)
brew install mtr

# 실행
sudo mtr google.com
```
