---
layout: post
title: "AWS EC2 인스턴스 설정 및 기본 구성 가이드"
date: 2025-12-28 12:00:00 +0900
categories: aws
tags: [aws, ec2, devops, cloud, infrastructure]
description: "AWS EC2 인스턴스 생성부터 기본 설정, Elastic IP, 보안 그룹 구성까지 AWS 인프라 설정의 기본을 다룹니다."
---

# AWS EC2 인스턴스 설정 및 기본 구성 가이드

AWS(Amazon Web Services)에서 EC2 인스턴스를 생성하고 기본적인 설정을 하는 방법을 정리했습니다.

## AWS 기본 용어

시작하기 전에 알아야 할 기본 용어들입니다:

- **EBS (Elastic Block Store)**: EC2 인스턴스용 블록 스토리지
- **AMI (Amazon Machine Images)**: EC2 인스턴스를 시작하는 데 필요한 정보가 포함된 이미지
- **IAM (Identity and Access Management)**: AWS 리소스에 대한 액세스를 안전하게 제어하는 서비스

## EC2 인스턴스 생성

### 1. 인스턴스 생성 시 초기 설정

인스턴스 생성 시 User Data에 명령어를 넣어 초기 설정을 자동화할 수 있습니다:

```bash
sudo yum update -y
```

### 2. PEM 파일 설정

PEM 파일을 `.ssh` 폴더에 다운로드하고 권한을 설정합니다:

```bash
# PEM 파일 권한 설정
chmod 400 your-key.pem

# SSH 접속
ssh -i ~/.ssh/your-key.pem ec2-user@your-elastic-ip
```

## Elastic IP (탄력적 IP) 설정

EC2 인스턴스의 Public IP는 재시작 시 변경됩니다. 고정 IP가 필요한 경우 Elastic IP를 사용합니다.

### 설정 방법

1. **Allocate new address**: 새 IP 주소 할당
2. **Associate address**: 주소 연결
3. **Set instance**: 인스턴스 선택
4. **Associate**: 연결 완료

탄력적 IP를 생성하고 EC2 인스턴스와 연결하면 인스턴스를 재시작해도 같은 IP를 유지할 수 있습니다.

## 서비스 구성

### 1. 각 서비스를 시스템 서비스로 등록

애플리케이션을 시스템 서비스로 등록하면 서버 재시작 시 자동으로 실행됩니다.

### 2. 보안 그룹에서 서비스 포트 열기

필요한 포트를 보안 그룹의 인바운드 규칙에 추가합니다.

## 포워딩 설정

### Route53을 통한 도메인 포워딩

- Route53에서 도메인을 설정하고 대상을 지정합니다.

### Nginx를 통한 포트 포워딩

- 여러 서비스를 하나의 서버에서 운영할 때 Nginx로 포트 포워딩을 설정합니다.

### ACM(AWS Certificate Manager) 사용 시

- 로드 밸런싱 대상 그룹 타겟 설정이 필요합니다.
- HTTPS 인증서를 ACM에서 관리할 수 있습니다.

## Amazon Linux 기본 설정

Amazon Linux는 Red Hat Enterprise Linux(RHEL) 및 CentOS 기반입니다.

### Nginx 설치

```bash
sudo yum install nginx -y
# 또는 Amazon Linux 2의 경우
sudo amazon-linux-extras install nginx1
sudo systemctl start nginx
```

### Java 설치

```bash
# Java 8 설치
sudo yum install java-1.8.0
# 기존 Java 7 제거
sudo yum remove java-1.7.0-openjdk
```

## 마무리

EC2 인스턴스를 설정할 때는 보안 그룹 설정, Elastic IP 연결, 서비스 등록 등의 기본적인 설정을 먼저 완료해야 합니다. 이후 Load Balancer와 Route53을 연동하여 완전한 인프라를 구성할 수 있습니다.
