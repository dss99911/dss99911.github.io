---
layout: post
title: "Debian 패키지 관리와 Aptly - 패키지 레퍼지토리 구축 가이드"
date: 2026-01-11
categories: [infra, devops]
tags: [debian, apt, aptly, linux, package-management, devops]
image: /assets/images/posts/2026-01-11-debian-package-management.png
description: "Debian 패키지 시스템의 개념과 Aptly를 활용한 프라이빗 패키지 레퍼지토리 구축 방법을 설명합니다."
---

# Debian 패키지 관리와 Aptly

Debian 패키지 시스템은 Linux 환경에서 소프트웨어를 설치하고 관리하는 가장 널리 사용되는 방식 중 하나입니다. 이 글에서는 Debian 패키지의 기본 개념과 Aptly를 활용한 프라이빗 레퍼지토리 구축 방법을 다룹니다.

## Debian 패키지란?

Debian 패키지 시스템은 Java의 Maven Repository와 유사한 개념입니다. `.deb` 파일은 실행 파일과 관련 파일들을 하나로 묶은 패키징 형식입니다.

### 기본 사용법

```bash
# 패키지 설치
apt-get install nodejs

# 패키지 업데이트
apt-get update
apt-get upgrade

# 패키지 검색
apt-cache search package-name

# 설치된 패키지 목록
dpkg -l
```

### 커스텀 레퍼지토리 설정

표준 레퍼지토리 외에 커스텀 레퍼지토리를 추가할 수 있습니다:

```bash
# 레퍼지토리 추가 (예: Docker)
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"

# GPG 키 추가
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

# 업데이트 후 설치
sudo apt-get update
sudo apt-get install docker-ce
```

## Debian 패키지 시스템의 장점

기존 방식과 비교했을 때 Debian 패키지 시스템의 장점:

### 기존 방식의 문제점
- 앱이 변경되면 모든 관련 서버에 앱 파일을 직접 전송해야 함
- 각 서버마다 수동으로 설치 및 설정 필요
- 버전 관리가 어려움

### Debian 패키지의 장점
1. **중앙 집중식 배포**: 레퍼지토리에 한 번 배포하면 끝
2. **자동 업데이트**: 각 서버에서 업데이트 명령만 실행하면 자동으로 다운로드 및 설치
3. **Cron을 통한 자동화**: 서버에서 cron으로 주기적으로 업데이트 확인 가능
4. **의존성 관리**: 패키지 의존성을 자동으로 해결
5. **버전 관리**: 특정 버전 설치 및 롤백 용이

```bash
# 특정 버전 설치
apt-get install package-name=1.2.3

# 자동 업데이트 설정 (cron)
0 2 * * * apt-get update && apt-get upgrade -y
```

## Aptly - 프라이빗 레퍼지토리 관리

[Aptly](https://www.aptly.info/)는 Debian 패키지의 레퍼지토리를 관리하는 도구입니다.

### Aptly의 주요 기능

1. **레퍼지토리에 패키지 추가**: 자체 개발한 패키지를 레퍼지토리에 등록
2. **패키지 공유**: 조직 내에서 패키지를 쉽게 배포
3. **미러 레퍼지토리 운영**: 외부 레퍼지토리의 미러 생성

### Aptly 사용 목적

#### 1. 대규모 서버 관리
많은 수의 서버에 동일한 패키지를 배포할 때 효율적입니다:
- 한 번의 업로드로 모든 서버에 배포
- 버전 일관성 유지
- 롤백 용이

#### 2. 대역폭 절감
로컬 미러 레퍼지토리를 운영하면 네트워크 대역폭을 크게 줄일 수 있습니다:

```
[인터넷] --1회 다운로드--> [로컬 미러] --LAN 전송--> [서버 1]
                                                  [서버 2]
                                                  [서버 3]
                                                  ...
```

- Java, Node.js 등 기본 프로그램 업데이트 시 모든 서버가 인터넷에서 다운로드하면 대역폭 낭비
- 로컬 미러에서 다운로드하면 속도 향상 및 인터넷 대역폭 절감

### Aptly 설치

```bash
# Ubuntu/Debian
echo "deb http://repo.aptly.info/ squeeze main" | sudo tee /etc/apt/sources.list.d/aptly.list
wget -qO - https://www.aptly.info/pubkey.txt | sudo apt-key add -
sudo apt-get update
sudo apt-get install aptly
```

### Aptly 기본 사용법

#### 레퍼지토리 생성

```bash
# 새 레퍼지토리 생성
aptly repo create my-repo

# 레퍼지토리에 패키지 추가
aptly repo add my-repo /path/to/package.deb

# 레퍼지토리 목록 확인
aptly repo list
```

#### 미러 레퍼지토리 생성

```bash
# Ubuntu 공식 미러 생성
aptly mirror create ubuntu-mirror http://archive.ubuntu.com/ubuntu focal main

# 미러 업데이트
aptly mirror update ubuntu-mirror
```

#### 스냅샷 및 퍼블리싱

```bash
# 스냅샷 생성
aptly snapshot create my-snapshot from repo my-repo

# 퍼블리싱 (HTTP로 제공)
aptly publish snapshot my-snapshot

# 서빙 시작
aptly serve
```

### 클라이언트 서버 설정

프라이빗 레퍼지토리를 사용하도록 클라이언트 서버 설정:

```bash
# /etc/apt/sources.list.d/private-repo.list
deb http://aptly-server:8080/ focal main
```

## 실전 활용 시나리오

### 시나리오 1: 사내 애플리케이션 배포

```bash
# 1. 애플리케이션을 deb 패키지로 빌드
dpkg-deb --build my-app

# 2. Aptly 레퍼지토리에 추가
aptly repo add internal-apps my-app.deb

# 3. 퍼블리싱
aptly publish repo internal-apps

# 4. 각 서버에서 설치
apt-get update && apt-get install my-app
```

### 시나리오 2: 에어갭 환경 (인터넷 차단 환경)

인터넷 연결이 없는 보안 환경에서:

```bash
# 인터넷 연결된 서버에서 미러 생성
aptly mirror create offline-mirror http://archive.ubuntu.com/ubuntu focal main restricted
aptly mirror update offline-mirror

# 미러를 USB 등으로 에어갭 환경으로 이동

# 에어갭 환경에서 서빙
aptly serve -listen=:8080
```

## 결론

Debian 패키지 시스템과 Aptly를 활용하면:

1. **효율적인 소프트웨어 배포**: 중앙 집중식 관리로 배포 시간 단축
2. **네트워크 최적화**: 미러 레퍼지토리로 대역폭 절감
3. **버전 관리**: 패키지 버전을 체계적으로 관리
4. **보안 환경 지원**: 에어갭 환경에서도 패키지 관리 가능

대규모 서버를 운영하거나 자체 패키지를 배포해야 하는 경우, Aptly를 통한 프라이빗 레퍼지토리 구축을 권장합니다.

## 참고 자료

- [Aptly 공식 문서](https://www.aptly.info/doc/)
- [Debian 패키지 관리 가이드](https://www.debian.org/doc/manuals/debian-handbook/sect.package-meta-information.en.html)
- [APT 사용자 가이드](https://wiki.debian.org/Apt)
