---
layout: post
title: "AWS EC2에 Confluence 설치하기 - PostgreSQL 연동 가이드"
date: 2026-01-11
categories: [infra, devops]
tags: [confluence, aws, ec2, postgresql, atlassian, wiki]
description: "AWS EC2 인스턴스에 Atlassian Confluence를 설치하고 PostgreSQL 데이터베이스를 연동하는 과정을 단계별로 설명합니다."
image: /assets/images/posts/2026-01-11-confluence-installation-aws.png
---

# AWS EC2에 Confluence 설치하기

Confluence는 Atlassian에서 제공하는 팀 협업 및 문서 관리 도구입니다. 이 가이드에서는 AWS EC2 인스턴스(Amazon Linux)에 Confluence를 설치하고 PostgreSQL 데이터베이스를 연동하는 방법을 설명합니다.

## 사전 요구사항

- AWS EC2 인스턴스 (Amazon Linux 2 권장)
- 최소 2GB RAM (4GB 이상 권장)
- 보안 그룹에서 8090 포트 오픈
- SSH 접속 가능한 상태

## 1. Confluence 설치 파일 다운로드

Atlassian 공식 사이트에서 Linux용 Confluence 설치 파일을 다운로드합니다.

```bash
# 로컬에서 서버로 파일 업로드
scp -i your-key.pem atlassian-confluence-x.x.x-x64.bin ec2-user@{ip-address}:{directory-path}
```

## 2. 설치 파일 실행

설치 파일에 실행 권한을 부여하고 설치를 진행합니다.

```bash
# 실행 권한 부여
chmod a+x atlassian-confluence-x.x.x-x64.bin

# 설치 실행
sudo ./atlassian-confluence-x.x.x-x64.bin
```

### 기본 설치 경로

설치가 완료되면 다음 경로에 파일이 설치됩니다:

| 항목 | 경로 |
|------|------|
| 설치 디렉토리 | `/opt/atlassian/confluence` |
| 홈 디렉토리 | `/var/atlassian/application-data/confluence` |
| HTTP 포트 | 8090 |
| RMI 포트 | 8000 |

## 3. AWS 보안 그룹 설정

EC2 인스턴스의 보안 그룹에서 8090 포트를 열어줍니다.

### 인바운드 규칙 추가

| 유형 | 프로토콜 | 포트 범위 | 소스 |
|------|----------|-----------|------|
| 사용자 지정 TCP | TCP | 8090 | 0.0.0.0/0 (또는 특정 IP) |

## 4. PostgreSQL 설치 및 설정

Confluence는 다양한 데이터베이스를 지원하지만, PostgreSQL을 권장합니다.

### PostgreSQL 설치

Amazon Linux는 RHEL 계열이므로 Redhat용 PostgreSQL을 설치합니다.

```bash
# PostgreSQL 설치
sudo amazon-linux-extras install postgresql14
sudo yum install postgresql-server -y

# PostgreSQL 초기화 및 시작
sudo postgresql-setup initdb
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 데이터베이스 및 사용자 생성

```bash
# PostgreSQL 접속
sudo -u postgres psql

# 데이터베이스 및 사용자 생성 (SQL 명령)
CREATE USER confluenceuser WITH PASSWORD 'your-secure-password';
CREATE DATABASE confluencedb WITH OWNER confluenceuser ENCODING 'UTF8';
GRANT ALL PRIVILEGES ON DATABASE confluencedb TO confluenceuser;

# 접속 종료
\q
```

### 인증 설정 수정

PostgreSQL 접속 시 `FATAL: Ident authentication failed for user` 오류가 발생하면 인증 방식을 변경해야 합니다.

```bash
# pg_hba.conf 파일 수정
sudo vi /var/lib/pgsql/data/pg_hba.conf
```

다음과 같이 `ident`를 `md5` 또는 `trust`로 변경합니다:

```
# IPv4 local connections:
host    all             all             127.0.0.1/32            md5
# IPv6 local connections:
host    all             all             ::1/128                 md5
```

변경 후 PostgreSQL 재시작:

```bash
sudo systemctl restart postgresql
```

## 5. Confluence 서비스 시작

```bash
# Confluence 서비스 시작
sudo service confluence start

# 서비스 상태 확인
sudo service confluence status
```

## 6. 웹 브라우저에서 설정 완료

브라우저에서 `http://{your-ec2-ip}:8090` 으로 접속하여 Confluence 초기 설정을 완료합니다.

### 데이터베이스 연결 설정

설정 마법사에서 데이터베이스 정보를 입력합니다:

- **Database Type**: PostgreSQL
- **Hostname**: localhost
- **Port**: 5432
- **Database Name**: confluencedb
- **Username**: confluenceuser
- **Password**: (설정한 비밀번호)

## 문제 해결

### 서비스가 시작되지 않는 경우

로그 파일을 확인하여 원인을 파악합니다:

```bash
# 로그 확인
tail -f /opt/atlassian/confluence/logs/catalina.out
```

### 메모리 부족 오류

Confluence는 많은 메모리를 사용합니다. 메모리 부족 시 swap 메모리를 추가합니다:

```bash
# 2GB swap 파일 생성
sudo dd if=/dev/zero of=/swapfile bs=1M count=2048
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# 재부팅 후에도 유지
echo '/swapfile swap swap defaults 0 0' | sudo tee -a /etc/fstab
```

### 스레드 제한 오류

시스템의 스레드 제한이 부족한 경우:

```bash
# 제한 설정 파일 수정
sudo vi /etc/security/limits.conf

# 다음 내용 추가
confluence soft nofile 8192
confluence hard nofile 16384
confluence soft nproc 8192
confluence hard nproc 16384
```

## 보안 권장사항

1. **HTTPS 설정**: 프로덕션 환경에서는 Load Balancer를 통해 HTTPS를 적용하세요.
2. **포트 제한**: 8090 포트를 직접 공개하지 말고 Load Balancer나 Nginx 프록시를 사용하세요.
3. **정기 백업**: Confluence 데이터와 PostgreSQL 데이터베이스를 정기적으로 백업하세요.
4. **보안 업데이트**: Confluence와 서버 패키지를 최신 상태로 유지하세요.

## 마무리

Confluence 설치가 완료되면 팀원들을 초대하고 스페이스를 생성하여 문서 협업을 시작할 수 있습니다. Jira, Bitbucket 등 다른 Atlassian 제품과 연동하면 더욱 효율적인 협업 환경을 구축할 수 있습니다.

### 참고 링크

- [Confluence 공식 설치 가이드](https://confluence.atlassian.com/doc/installing-confluence-on-linux-143556824.html)
- [PostgreSQL 인증 설정](https://confluence.atlassian.com/bitbucketserverkb/fatal-ident-authentication-failed-for-user-unable-to-connect-to-postgresql-779171564.html)
- [PostgreSQL 사용자 및 데이터베이스 생성](https://medium.com/coding-blocks/creating-user-database-and-adding-access-on-postgresql-8bfcd2f4a91e)
