---
layout: post
title: "Linux 시스템 관리 - 서비스, 메모리, 로그 관리"
date: 2025-12-28 12:07:00 +0900
categories: linux
tags: [linux, system-administration, devops, service, memory]
description: "Linux 시스템 관리의 핵심 - 서비스 등록, 가상 메모리 설정, 로그 로테이션, MySQL 설치를 다룹니다."
---

# Linux 시스템 관리

Linux 서버 운영에 필요한 핵심적인 시스템 관리 내용을 정리했습니다.

## Linux 배포판 종류

- **RHEL 기반**: Amazon Linux, CentOS, Fedora
- **Debian 기반**: Ubuntu, Debian

## 서비스 등록 및 관리

### 서비스로 등록하기

JAR 파일을 시스템 서비스로 등록하는 방법입니다:

```bash
# 심볼릭 링크 생성 (전체 경로 필수)
sudo ln -s /var/myapp/myapp.jar /etc/init.d/myapp

# 서비스 시작
service myapp start

# 서비스 상태 확인
service myapp status
```

참고: [Spring Boot 배포 문서](https://docs.spring.io/spring-boot/docs/current/reference/html/deployment-install.html)

### 부팅 시 자동 시작

재부팅 후 앱이 시작되지 않는 경우:

```bash
# 서비스 목록 확인
chkconfig --list

# 자동 시작 활성화
sudo chkconfig nginx on
```

### Run Level

```
0   Halt
1   Single-User mode
2   Multi-user mode console logins only (without networking)
3   Multi-User mode, console logins only
4   Not used/User-definable
5   Multi-User mode, with display manager as well as console logins (X11)
6   Reboot
```

### JAR VM 옵션 설정

1. JAR 파일과 같은 폴더에 `<app-name>.conf` 파일 생성
2. VM 옵션 입력:

```bash
export JAVA_OPTS="-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5005"
```

## Systemctl 서비스 관리

### 서비스 파일 생성

```bash
sudo vi /etc/systemd/system/jupyter.service
```

**jupyter.service**:
```ini
[Unit]
Description=Jupyter Notebook Server

[Service]
Type=simple
User=ec2-user
ExecStart=/usr/bin/sudo ~/miniconda3/bin/jupyter notebook

[Install]
WantedBy=multi-user.target
```

### 서비스 관리 명령어

```bash
# 설정 변경 후 reload
sudo systemctl daemon-reload

# 서비스 활성화 (부팅 시 자동 시작)
sudo systemctl enable jupyter

# 서비스 시작
sudo systemctl start jupyter

# 상태 확인
sudo systemctl status jupyter

# 서비스 목록
systemctl --type=service
```

### 로그 확인

```bash
# 서비스 로그 보기
journalctl -u service-name

# 마지막 100줄만 보기
journalctl --unit=my.service -n 100 --no-pager
```

## 가상 메모리 (Swap) 설정

### 현재 Swap 확인

```bash
swapon -s
swapon --show
free -m
```

### 디스크 용량 확인

```bash
df -h
```

### Swap 끄기

```bash
sudo swapoff -a
```

### Amazon Linux에서 4GB Swap 생성

```bash
sudo /bin/dd if=/dev/zero of=/var/swap.1 bs=1M count=4048
sudo /sbin/mkswap /var/swap.1
sudo chmod 600 /var/swap.1
sudo /sbin/swapon /var/swap.1

# 재부팅 후에도 유지
sudo echo "/var/swap.1   swap    swap    defaults        0   0" >> /etc/fstab
```

### 일반 Linux에서 Swap 생성

```bash
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

> **Note**: `fallocate`는 Amazon Linux에서 작동하지 않을 수 있습니다.

### 프로세스별 메모리 확인

```bash
ps -o pid,user,%mem,command ax | sort -b -k3 -r
```

## 로그 로테이션 (logrotate)

logrotate는 하루에 한 번 cron으로 실행되어 로그 파일을 관리합니다.

### 설정 파일 위치

```
/etc/logrotate.conf
/etc/logrotate.d/*.conf  <- 여기에 설정 추가
```

### 설정 예시

```
/var/log/apache2/* {
    weekly
    rotate 3
    size 10M
    compress
    delaycompress
}
```

### 주요 옵션

| 옵션 | 설명 |
|------|------|
| `weekly` | 주간 로테이션 |
| `daily` | 일간 로테이션 |
| `monthly` | 월간 로테이션 |
| `rotate 3` | 3개의 로테이션 로그만 유지 |
| `size=10M` | 10MB 이상일 때만 로테이션 |
| `compress` | gzip 압축 |
| `delaycompress` | 다음 로테이션까지 압축 지연 |

참고: [logrotate 가이드](https://www.tecmint.com/install-logrotate-to-manage-log-rotation-in-linux/)

## 패키지 설치

### EPEL Repository 추가 (CentOS)

```bash
sudo yum -y install https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm
```

### Java 8 설치

```bash
sudo yum install java-1.8.0-openjdk-devel

# 또는
sudo yum remove java-1.7.0-openjdk.x86_64 -y
sudo yum install java-1.8.0-openjdk-devel.x86_64 -y

# Java 버전 선택
alternatives --config java
java -version
```

## MySQL 설치

### Amazon Linux에서 설치

```bash
sudo yum install mysql-server
sudo /sbin/chkconfig --levels 235 mysqld on
sudo service mysqld start
sudo mysql_secure_installation  # 초기 비밀번호 없음
```

### MySQL 제거

```bash
# 패키지 제거
sudo yum remove mysql mysql-server mysql-common mysql-client

# 설치된 패키지 확인
rpm -qa | grep -i mysql

# 패키지 제거
rpm -e mysql libmysqlclient15-5.0.94-0.2.4.1

# 데이터 디렉토리 완전 삭제
cd /var/lib
sudo rm -rf mysql
```

## MD5 체크섬 확인

파일 무결성 확인:

```bash
md5sum mysql57-community-release-el7-9.noarch.rpm
```
