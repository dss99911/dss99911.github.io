---
layout: post
title: "DevOps 도구 개요 - 가상화, 패키지 관리, 원격 부팅"
date: 2025-12-28 12:14:00 +0900
categories: [infra, devops]
tags: [devops, virtualization, pxe, debian, package-management]
description: "DevOps에서 사용되는 다양한 도구들 - VMware, Packer, PXE Boot, Debian 패키지 관리를 소개합니다."
image: /assets/images/posts/thumbnails/2025-12-28-devops-tools-overview.png
---

# DevOps 도구 개요

DevOps 환경에서 사용되는 다양한 도구들을 정리했습니다.

## 가상화

### VMware

VMware는 가상 OS를 실행하기 위한 플랫폼입니다. 하나의 물리적 서버에서 여러 개의 가상 머신을 운영할 수 있습니다.

### Packer

Packer는 VM 안에 이미지를 설치해주는 도구입니다.

- Amazon VM에 AMI 등의 이미지 설치
- 자동화된 이미지 빌드

## PXE Boot (원격 부팅/설치)

PXE(Preboot Execution Environment) Boot는 네트워크를 통해 클라이언트를 부팅하고 OS를 설치하는 방식입니다.

### 특징

- 베어메탈 서버용으로 설계됨
- 가상화나 클라우드 기반 서버에는 적합하지 않음

### 필요한 서버 기능

1. **Apache Server**: 설치 파일 제공
2. **DHCP Server**: IP 주소 할당
3. **TFTP Server**: 부팅 파일 전송

## 패키지 관리

### Debian 패키지 시스템

Debian 패키지(.deb)는 Linux 환경에서의 Maven Repository와 같은 역할을 합니다.

#### 특징

- 설치 파일처럼 패키징된 파일 (실행 파일 + 관련 파일들)
- `apt-get install` 명령으로 설치

```bash
apt-get install node
```

- 커스텀 repository 설정 가능
- 직접 패키징하여 설치 가능

#### 장점

기존 방식:
- 앱 변경 시 모든 관련 서버에 파일 전송 필요

Debian 방식:
- Repository에 배포 후 각 서버에 업데이트 요청만 하면 됨
- 서버에서 알아서 다운로드 및 설치
- cron으로 자동 업데이트 확인 가능

### Apt.ly (데비안 패키지 Repository)

Apt.ly는 데비안 패키지의 Repository를 관리하는 도구입니다.

#### 기능

- Repository에 패키지 추가
- 패키지 공유
- 미러 Repository 운영

#### 사용 목적

1. **패키지 공유 용이**: 많은 수의 서버에 패키지를 쉽게 배포
2. **대역폭 절감**:
   - 자바 등 기본 프로그램 업데이트 시, 모든 서버가 인터넷에서 다운로드하면 대역폭 소모가 큼
   - 로컬 미러 Repository에서 다운로드하면 속도 향상 및 인터넷 대역폭 절감

## 정리

| 도구 | 용도 |
|------|------|
| VMware | 가상 OS 운영 |
| Packer | VM 이미지 자동 빌드 |
| PXE Boot | 네트워크 부팅 및 OS 설치 |
| Debian Package | 소프트웨어 패키징 및 배포 |
| Apt.ly | 패키지 Repository 관리 |
