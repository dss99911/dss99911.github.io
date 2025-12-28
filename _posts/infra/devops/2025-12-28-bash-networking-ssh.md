---
layout: post
title: "Bash 네트워킹 및 SSH 완벽 가이드"
date: 2025-12-28 12:10:00 +0900
categories: [infra, devops]
tags: [bash, ssh, networking, linux, security]
description: "SSH 키 기반 인증, 네트워크 관리, 포트 확인, iptables 방화벽 설정 방법을 설명합니다."
---

# Bash 네트워킹 및 SSH 완벽 가이드

서버 관리에 필수적인 네트워킹과 SSH 관련 내용을 정리했습니다.

## SSH 기본

### SSH 키 생성

```bash
ssh-keygen -b 4096  # 4096비트 키 생성 (기본 2048)
```

파일명을 지정하지 않으면 `~/.ssh/id_rsa`, `~/.ssh/id_rsa.pub`가 생성됩니다.

### 비밀번호 없이 접속 설정

1. 키 쌍 생성 (private, public)
2. Private 키는 클라이언트에 보관
3. Public 키를 서버의 `~/.ssh/authorized_keys`에 추가

```bash
# 방법 1: ssh-copy-id
ssh-copy-id -i ~/.ssh/id_rsa.pub ec2-user@localhost

# 방법 2: 수동 복사
cat ~/.ssh/id_rsa.pub | ssh user@hostname 'cat >> .ssh/authorized_keys && echo "Key copied"'
```

### SSH 키 없이 접속하기

Private 키가 `~/.ssh/id_rsa`에 있으면 기본으로 사용됩니다.

SSH Agent 사용:
```bash
eval $(ssh-agent)
ssh-add -L              # 등록된 키 확인
ssh-add -D              # 키 삭제
ssh-add <key_file>      # 키 추가
ssh ec2-user@hostname   # 접속
```

### SSH Config 설정

`~/.ssh/config` 파일로 접속 정보를 저장합니다:

```
Host home
    HostName home.example.com
    User ec2-user
    IdentityFile ~/.ssh/my-key.pem

# 모든 호스트에 대한 설정
Host *
    ServerAliveInterval 120   # 타임아웃 방지
```

접속:
```bash
ssh home
```

### 서버 사이드 설정

```bash
sudo vi /etc/ssh/sshd_config

# 비밀번호 로그인 비활성화
PasswordAuthentication no
```

서비스 재시작:
```bash
# Ubuntu/Debian
sudo service ssh restart

# CentOS/Fedora
sudo service sshd restart
```

## SCP (Secure Copy)

### 파일 업로드

```bash
scp -i <pem_file> <local_path> user@ip:server_path
```

### 파일 다운로드

```bash
scp -i key.pem ec2-user@server:file_path local_path
ssh home "sudo cat /home/h/.ssh/id_rsa" >> local_file
```

### 옵션

```bash
scp -v -o StrictHostKeyChecking=no  # 디버그 + 호스트키 확인 스킵
```

## 네트워크 관리

### IP 주소 확인

```bash
ip addr show
ping hostname   # 서버 확인
```

### 네트워크 인터페이스 제어

```bash
ip link set eth0 down   # 끊기
ip link set eth0 up     # 재연결
```

### 네트워크 사용량

```bash
ip -s link          # 기본
ip -s -s link       # 상세
```

### 연결된 소켓 확인

```bash
ss -t   # TCP 연결
ss -u   # UDP 연결
```

## 포트 관리

### 사용 중인 포트 확인

```bash
ss -ltn      # TCP 포트 번호
ss -lt       # TCP 호스트명
ss -lun      # UDP 포트
ss -ltun     # TCP & UDP

# 특정 포트 확인
lsof -i:3306
sudo lsof -i:3306  # 권한 필요한 경우
```

## iptables 방화벽

### 규칙 확인

```bash
sudo iptables -L
sudo iptables -S
sudo iptables -L --line-numbers
```

### 연결 허용

```bash
# 기존 연결 허용
sudo iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT

# 포트 80 허용
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT

# loopback 허용 (첫 번째 규칙으로)
sudo iptables -I INPUT 1 -i lo -j ACCEPT
```

### 기본 정책 설정

```bash
sudo iptables -P INPUT DROP  # 모든 입력 차단
```

### 포트 포워딩

```bash
# 80 -> 8080 리다이렉트
iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 8080

# 포워딩 규칙 확인
sudo iptables -t nat --line-numbers -n -L

# 포워딩 삭제
sudo iptables -t nat -D PREROUTING 1
```

## URL 호출

```bash
curl http://localhost:9091/api
```

## 파일 다운로드

```bash
wget http://example.com/file.deb
```

## nc (netcat)

네트워크 연결 테스트:

```bash
# 리스닝 서버
nc -l 5000
```

## lsof (List Open Files)

열린 파일 및 네트워크 소켓 확인:

```bash
lsof -i      # IP 소켓
lsof -U      # Unix 소켓
lsof -n      # 호스트명 해석 안함
lsof -P      # 포트명 대신 번호
```

마운트 해제가 안 될 때 파일을 사용 중인 프로세스 확인에 유용합니다.

## 프로세스 확인

```bash
# Java 프로세스 확인
ps -ef | grep java

# 프로세스 상세 정보
ps -p 18655 -o comm=
ps -p $PID -o pid,vsz=MEMORY -o user,group=GROUP -o comm,args=ARGS
```

## 서비스 재시작

```bash
sudo /etc/init.d/service_name restart
```

## 포트 사용 중일 때

```bash
lsof -i:3306
kill -9 <pid>
```
