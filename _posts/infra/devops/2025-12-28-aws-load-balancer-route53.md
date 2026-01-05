---
layout: post
title: "AWS Load Balancer와 Route53을 활용한 트래픽 관리"
date: 2025-12-28 12:01:00 +0900
categories: [infra, devops]
tags: [aws, load-balancer, route53, devops, networking]
image: /assets/images/posts/thumbnails/aws-loadbalancer-route53.png
description: "AWS Load Balancer 설정과 Route53을 활용한 도메인 라우팅, 보안 그룹 구성 방법을 설명합니다."
---

# AWS Load Balancer와 Route53을 활용한 트래픽 관리

AWS에서 Load Balancer와 Route53을 활용하여 트래픽을 효율적으로 관리하는 방법을 정리했습니다.

## 아키텍처 개요

```
Route53 -> Load Balancer -> EC2 Instance
```

Load Balancer가 HTTPS 인증을 처리하기 때문에, EC2 인스턴스는 직접 public으로 접근할 수 없게 설정해야 합니다.

## AWS Load Balancer

### 리스너 규칙 설정

1. **HTTP -> HTTPS 리다이렉트**: HTTP 요청을 HTTPS로 리다이렉트
2. **서브도메인 별 분기 처리**: HTTPS 내에서 각 서브도메인 별로 분기 처리
3. **대상 그룹 설정**: 각 서비스 별로 대상 그룹을 생성하고, 포트를 다르게 설정

### 대상 그룹 (Target Group)

- 로드 밸런서에서 규칙을 추가할 때, 같은 VPC 내의 대상 그룹만 추가할 수 있습니다.
- 대상 그룹 생성 시 IP address로 추가 가능하며, 같은 VPC의 private IP address로 설정할 수 있습니다.
- 한 EC2 인스턴스에 포트만 다르게 설정하여 여러 서비스를 운영할 수 있습니다.

### 네트워크 인터페이스

- 하나의 로드 밸런서에 3개의 네트워크 인터페이스가 생성됩니다.
- 각각에 public IP가 존재합니다.
- subnet ID도 3개 생성되고, 하나의 VPC에 존재합니다.
- 각 가용 영역(예: us-east-2a, 2b, 2c)에 하나씩 배치되어 고가용성을 보장합니다.

### 보안 설정

각 대상에는 network interface가 있어서 public IP가 존재합니다. 도메인으로만 접근 가능하게 하려면 마지막 규칙에 404 에러를 반환하도록 설정합니다.

## Route53

### 레코드 타입

- **CNAME**: 라우팅을 다른 도메인 네임으로 설정할 때 사용
- **A (Address)**: 라우팅을 IP address로 설정할 때 사용
- **Alias**: AWS 리소스인 경우 별칭으로 선택 가능

### www 제거하기

name을 비우고, 별칭을 www로 설정합니다. (또는 URL 주소로 직접 설정)

### 주의사항

**Route53은 포트를 처리하지 않습니다.** 포트 기반 라우팅이 필요한 경우 Load Balancer의 리스너 리다이렉트를 활용해야 합니다.

### 권장 설정 방식

서브도메인이 있는 경우와 없는 경우를 별도로 처리할 수 없으므로 다음과 같이 설정합니다:

1. **서브도메인이 있는 경우**: CNAME으로 Load Balancer의 도메인으로 이동
2. **서브도메인이 없는 경우**: Address로 설정하고, alias를 Load Balancer의 DNS명으로 설정 (CNAME으로 하면 에러 발생)

### 포트 포워딩 방법

1. 로드밸런서에서 리스너의 조건에 host header로 서브도메인을 체크
2. 대상 그룹을 지정하고, 대상 그룹은 각각 포트를 다르게 설정

### 권장 아키텍처

```
Route 53 -> Load Balancer -> EC2 Instances
```

- **Route 53**: Load Balancer로만 이동
- **Load Balancer**: 각 요청 호스트별 분기 처리 및 HTTPS 인증
- **EC2 인스턴스**: 서비스만 올려놓음 (호스트별 분기 처리 불필요)

이렇게 구성하면 EC2 인스턴스에서 호스트별 분기 처리를 몰라도 되어 상호간의 의존성이 없어집니다.

## 보안 그룹 설정

### EC2 인스턴스 보안 그룹

Load Balancer가 HTTPS 인증을 하기 때문에 EC2는 public하게 진입할 수 없게 설정해야 합니다.

HTTP, HTTPS는 Load Balancer의 보안 그룹에서만 접근이 가능하도록 설정합니다:

- **Source**: Load Balancer의 보안 그룹 (sg-xxxx 형태)

### Security Group 기본 개념

보안 그룹은 인바운드(inbound)와 아웃바운드(outbound) 트래픽을 관리합니다.

**Inbound (외부 -> 내부)**
- SSH 연결
- 웹페이지 연결
- IP 주소 대신 sg-로 시작하는 보안 그룹을 선택할 수 있습니다 (해당 보안 그룹에서만 접근 가능)

**Outbound (서버 -> 외부)**
- 서버에서 외부로 연결하는 트래픽

> **Tip**: 바로 접속이 안되고 응답을 기다리고 있으면, 보안 그룹에 추가되어 있지 않아서일 가능성이 큽니다.

## 도메인 서비스 비용 절감

Route53 외에 도메인 등록을 더 저렴하게 할 수 있는 서비스도 있습니다:

- [Namecheap](https://www.namecheap.com/) - 비용이 더 저렴한 도메인 등록 서비스
