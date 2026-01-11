---
layout: post
title: "AWS EC2에 Confluence 설치하기 - 완벽 가이드"
date: 2026-01-11
categories: [infra, devops]
tags: [confluence, atlassian, aws, ec2, postgresql, wiki]
image: /assets/images/posts/2026-01-11-confluence-aws-installation.png
description: "AWS EC2 인스턴스에 Atlassian Confluence를 설치하고 PostgreSQL과 연동하는 방법을 상세히 설명합니다."
---

# AWS EC2에 Confluence 설치하기

Confluence는 Atlassian에서 제공하는 팀 협업 위키 도구입니다. 이 가이드에서는 AWS EC2 인스턴스에 Confluence를 설치하고 PostgreSQL 데이터베이스와 연동하는 방법을 다룹니다.

## 사전 준비

### EC2 인스턴스 요구사항

Confluence는 메모리를 많이 사용하므로 최소 사양을 확인하세요:

| 사용자 수 | 최소 RAM | 권장 RAM | CPU |
|-----------|----------|----------|-----|
| 소규모 (< 25) | 2GB | 4GB | 2 vCPU |
| 중규모 (25-100) | 4GB | 8GB | 4 vCPU |
| 대규모 (> 100) | 8GB+ | 16GB+ | 8 vCPU |

### 권장 인스턴스 타입

- 소규모: t3.medium 또는 t3.large
- 중규모: m5.large 또는 m5.xlarge
- 대규모: m5.2xlarge 이상

## 1. Confluence 설치 파일 다운로드

### Atlassian에서 설치 파일 다운로드

```bash
# 설치 파일 다운로드 (버전은 최신 버전으로 대체)
wget https://www.atlassian.com/software/confluence/downloads/binary/atlassian-confluence-8.x.x-x64.bin
```

### EC2로 파일 전송 (로컬에서 다운로드한 경우)

```bash
# SCP로 EC2 인스턴스에 파일 전송
scp -i your-key.pem atlassian-confluence-8.x.x-x64.bin ec2-user@your-ec2-ip:/home/ec2-user/
```

## 2. Confluence 설치

### 실행 권한 부여 및 설치

```bash
# 실행 권한 부여
chmod a+x atlassian-confluence-8.x.x-x64.bin

# 설치 실행 (sudo 필요)
sudo ./atlassian-confluence-8.x.x-x64.bin
```

### 설치 중 설정값 (기본값)

설치 과정에서 다음 기본값이 설정됩니다:

| 설정 | 기본값 |
|------|--------|
| Installation Directory | /opt/atlassian/confluence |
| Home Directory | /var/atlassian/application-data/confluence |
| HTTP Port | 8090 |
| RMI Port | 8000 |

## 3. AWS 보안 그룹 설정

EC2 보안 그룹에서 다음 포트를 열어야 합니다:

```
Inbound Rules:
- TCP 8090: Confluence 웹 인터페이스
- TCP 22: SSH 접속 (관리용)
```

AWS Console에서 설정:
1. EC2 > Security Groups 이동
2. 해당 인스턴스의 보안 그룹 선택
3. Inbound Rules 편집
4. Add Rule: Custom TCP, Port 8090, Source: Your IP

## 4. PostgreSQL 설치 및 설정

Confluence는 PostgreSQL, MySQL, Oracle 등을 지원합니다. PostgreSQL을 권장합니다.

### PostgreSQL 설치 (Amazon Linux 2)

```bash
# PostgreSQL 설치
sudo amazon-linux-extras install postgresql14 -y
sudo yum install postgresql-server -y

# 데이터베이스 초기화
sudo postgresql-setup --initdb

# 서비스 시작 및 자동 시작 설정
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 데이터베이스 및 사용자 생성

```bash
# PostgreSQL 접속
sudo -u postgres psql
```

PostgreSQL 쉘에서:

```sql
-- Confluence용 데이터베이스 생성
CREATE DATABASE confluencedb WITH ENCODING 'UTF8' LC_COLLATE='C' LC_CTYPE='C' TEMPLATE=template0;

-- 사용자 생성
CREATE USER confluenceuser WITH PASSWORD 'your-secure-password';

-- 권한 부여
GRANT ALL PRIVILEGES ON DATABASE confluencedb TO confluenceuser;

-- 종료
\q
```

### PostgreSQL 인증 설정

Confluence가 데이터베이스에 연결할 수 있도록 인증 방식을 수정해야 합니다.

```bash
# pg_hba.conf 파일 수정
sudo vi /var/lib/pgsql/data/pg_hba.conf
```

다음 라인을 찾아 `ident`를 `md5` 또는 `trust`로 변경:

```
# 변경 전
local   all             all                                     ident
host    all             all             127.0.0.1/32            ident

# 변경 후 (md5 권장, 테스트 시 trust)
local   all             all                                     md5
host    all             all             127.0.0.1/32            md5
```

PostgreSQL 재시작:

```bash
sudo systemctl restart postgresql
```

### 연결 테스트

```bash
# 생성한 사용자로 접속 테스트
psql -h localhost -U confluenceuser -d confluencedb
# 비밀번호 입력 후 접속 확인
```

## 5. 시스템 리소스 최적화

### 스왑 메모리 설정

Confluence는 메모리를 많이 사용합니다. 메모리 부족 시 스왑을 설정하세요:

```bash
# 2GB 스왑 파일 생성
sudo dd if=/dev/zero of=/swapfile bs=128M count=16
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# 재부팅 후에도 스왑 유지
echo '/swapfile swap swap defaults 0 0' | sudo tee -a /etc/fstab
```

### 스레드 제한 늘리기

많은 사용자가 접속할 경우:

```bash
# /etc/security/limits.conf에 추가
sudo vi /etc/security/limits.conf
```

다음 내용 추가:

```
confluence soft nofile 16384
confluence hard nofile 16384
confluence soft nproc 16384
confluence hard nproc 16384
```

## 6. Confluence 서비스 관리

### 서비스 시작/중지

```bash
# 서비스 시작
sudo service confluence start

# 서비스 중지
sudo service confluence stop

# 서비스 재시작
sudo service confluence restart

# 상태 확인
sudo service confluence status
```

### 로그 확인

문제 발생 시 로그 확인:

```bash
# Confluence 로그
tail -f /var/atlassian/application-data/confluence/logs/atlassian-confluence.log

# Catalina 로그
tail -f /opt/atlassian/confluence/logs/catalina.out
```

## 7. 웹 인터페이스 설정

### 초기 설정 접속

브라우저에서 접속:
```
http://your-ec2-ip:8090
```

### 설정 마법사

1. **Production Installation** 선택
2. **Get an evaluation license** 또는 기존 라이선스 입력
3. **My own database** 선택
4. 데이터베이스 연결 정보 입력:
   - Database Type: PostgreSQL
   - Hostname: localhost
   - Port: 5432
   - Database name: confluencedb
   - Username: confluenceuser
   - Password: your-secure-password

## 8. HTTPS 설정 (권장)

프로덕션 환경에서는 HTTPS를 설정해야 합니다.

### 방법 1: AWS Load Balancer + ACM

가장 권장하는 방법:

1. ACM에서 SSL 인증서 발급
2. Application Load Balancer 생성
3. HTTPS 리스너 설정
4. Target Group에 EC2 인스턴스 (8090 포트) 연결

### 방법 2: Nginx Reverse Proxy

```bash
# Nginx 설치
sudo amazon-linux-extras install nginx1 -y

# Nginx 설정
sudo vi /etc/nginx/conf.d/confluence.conf
```

```nginx
server {
    listen 80;
    server_name confluence.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name confluence.yourdomain.com;

    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;

    location / {
        proxy_pass http://localhost:8090;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Confluence Tomcat 설정

Reverse Proxy 사용 시 Confluence 설정 수정:

```bash
sudo vi /opt/atlassian/confluence/conf/server.xml
```

Connector 섹션 수정:

```xml
<Connector port="8090"
           connectionTimeout="20000"
           maxThreads="200"
           minSpareThreads="10"
           enableLookups="false"
           acceptCount="100"
           protocol="HTTP/1.1"
           proxyName="confluence.yourdomain.com"
           proxyPort="443"
           scheme="https"
           secure="true" />
```

## 9. 백업 설정

### 자동 백업 설정

Confluence 관리자 페이지에서:
1. Administration > Backup Administration
2. 백업 경로 설정
3. 백업 스케줄 설정

### 수동 백업

```bash
# Confluence 홈 디렉토리 백업
sudo tar -czvf confluence-home-backup.tar.gz /var/atlassian/application-data/confluence

# PostgreSQL 백업
pg_dump -U confluenceuser confluencedb > confluence-db-backup.sql
```

### S3로 백업

```bash
# AWS CLI로 S3에 백업
aws s3 cp confluence-home-backup.tar.gz s3://your-backup-bucket/confluence/
aws s3 cp confluence-db-backup.sql s3://your-backup-bucket/confluence/
```

## 트러블슈팅

### 8090 포트 접속 불가

1. 보안 그룹 규칙 확인
2. Confluence 서비스 상태 확인: `sudo service confluence status`
3. 로그 확인: `tail -f /opt/atlassian/confluence/logs/catalina.out`

### 메모리 부족

```bash
# 메모리 사용량 확인
free -h

# 스왑 메모리 추가
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

### 데이터베이스 연결 실패

1. PostgreSQL 서비스 상태 확인
2. pg_hba.conf 인증 설정 확인
3. 데이터베이스 사용자 권한 확인
4. 방화벽 설정 확인

## 결론

AWS EC2에 Confluence를 설치하면 팀 협업을 위한 강력한 위키 플랫폼을 구축할 수 있습니다. 주요 포인트:

1. **적절한 인스턴스 크기 선택**: 메모리는 충분히 확보
2. **PostgreSQL 설정**: 인증 방식 및 권한 설정 주의
3. **보안 설정**: HTTPS 설정 및 보안 그룹 관리
4. **정기 백업**: S3를 활용한 자동 백업 권장

## 참고 자료

- [Atlassian Confluence 설치 가이드](https://confluence.atlassian.com/doc/installing-confluence-on-linux-143556824.html)
- [Confluence 시스템 요구사항](https://confluence.atlassian.com/doc/system-requirements-135702.html)
- [PostgreSQL과 Confluence 연동](https://confluence.atlassian.com/doc/database-configuration-148915.html)
