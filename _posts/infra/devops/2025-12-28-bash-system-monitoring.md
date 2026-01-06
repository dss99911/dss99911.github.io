---
layout: post
title: "Bash 시스템 모니터링 및 성능 분석"
date: 2025-12-28 12:11:00 +0900
categories: [infra, devops]
tags: [bash, linux, monitoring, performance, devops]
description: "Linux 시스템 모니터링 - CPU, 메모리, 디스크 I/O, 프로세스 관리 및 히스토리 조회 방법을 설명합니다."
image: /assets/images/posts/thumbnails/2025-12-28-bash-system-monitoring.png
---

# Bash 시스템 모니터링 및 성능 분석

Linux 서버의 성능을 모니터링하고 분석하는 방법을 정리했습니다.

## 실시간 모니터링

### top

전체 CPU, 메모리, Swap 사용량을 실시간으로 확인:

```bash
top
```

**유용한 단축키:**
- `Shift + M`: 메모리 사용량 순으로 정렬

### vmstat

메모리, CPU, I/O 통계:

```bash
vmstat 1 99999          # 1초 간격, 99999회
vmstat -a 1 999         # active/inactive 메모리 표시
vmstat -a -S M 1 999    # MB 단위로 표시
```

## 메모리 확인

### 전체 메모리

```bash
free -m
```

### 프로세스별 메모리

```bash
ps aux --sort -rss                    # RSS 기준 정렬
ps -o pid,user,%mem,command ax | sort -b -k3 -r
```

## 프로세스 관리

### 프로세스 확인

```bash
# 특정 프로세스 확인
ps -p 18655 -o comm=
ps -p $PID -o pid,vsz=MEMORY -o user,group=GROUP -o comm,args=ARGS

# 모든 사용자 프로세스 상세
ps -ef
# -e: 다른 사용자 프로세스 포함
# -f: 상세 정보
```

### 프로세스 검색

```bash
ps -ef | grep java
```

## 디스크 I/O

### iostat

```bash
iostat 1 99999    # 1초 간격
```

## 히스토리 (sar)

System Activity Report - 과거 기록 조회:

### 설치 및 설정

```bash
sudo yum install sysstat

# 활성화
# /etc/default/sysstat 파일에서
ENABLED="true"

sudo service sysstat restart
```

### CPU 히스토리

```bash
sar -u              # 히스토리만
sar -u 1 30         # 현재 + 히스토리 (1초 간격, 30회)
```

### 메모리 히스토리

```bash
sar -r
```

### I/O 히스토리

```bash
sar -b
```

## 디스크 용량

```bash
df -h           # 디스크 사용량
ls -lah         # 파일 크기
```

## Job Control

### 프로세스 관련 명령어

| 명령어 | 설명 |
|--------|------|
| `ps` | 실행 중인 프로세스 목록 |
| `kill` | 프로세스에 시그널 전송 |
| `jobs` | 현재 쉘의 작업 목록 |
| `bg` | 백그라운드로 전환 |
| `fg` | 포그라운드로 전환 |

### 백그라운드 작업

```bash
# 실행 중인 서비스 일시 중지
Ctrl + Z

# 백그라운드에서 계속 실행
bg

# 쉘에서 분리
disown

# 작업 목록
jobs -l

# 포그라운드로 전환
fg
```

## 사용자 관리

### 현재 사용자

```bash
whoami
```

### 다른 계정으로 로그인

```bash
sudo su - hyun
```

### 사용자 추가/관리

```bash
# 사용자 추가
sudo adduser username

# sudo 권한 부여
usermod -aG sudo username

# 그룹 확인
groups
```

### 특정 앱을 sudo 없이 실행

```bash
sudo groupadd docker && sudo usermod -aG docker USERNAME
# 로그아웃 후 다시 로그인 필요
```

## 히스토리

### 명령어 히스토리 보기

```bash
history
```

### 히스토리에서 실행

```bash
history 4    # 마지막 4개
!4           # 4번 명령 재실행
!!           # 이전 명령 재실행
```

### 히스토리 검색 별칭

`.bashrc`에 추가:
```bash
alias gh='history | grep '
```

## cron (스케줄링)

Linux OS 단에서 사용하는 스케줄링:

```bash
crontab -l    # 현재 크론 목록
crontab -e    # 크론 편집
```

## 날짜/시간

```bash
DATE=`date +%Y-%m-%d`
DATE=`date +%Y-%m-%d:%H:%M:%S`
date +'%Y-%m-%d'
date +%F
now=`date +%F`
```

## 에러 처리

### Locale 경고

```
warning: setlocale: LC_CTYPE: cannot change locale (UTF-8)
```

해결:
```bash
sudo vi /etc/environment

# 추가
LANG=en_US.utf-8
LC_ALL=en_US.utf-8
```

### 명령 결과 확인

```bash
echo $?   # 0이면 성공
```

## 도움말

```bash
man who        # 매뉴얼
help sh        # 쉘 내장 명령
which sh       # 명령어 위치
type sh        # 명령어 유형 및 위치
mkdir --help   # 명령어 도움말
```

## 유용한 도구들

### 필터 명령어

| 명령어 | 설명 |
|--------|------|
| `xargs` | 입력을 여러 개 받아 각각 실행 |
| `sort` | 정렬 (`-n`: 숫자, `-r`: 역순) |
| `uniq` | 중복 제거 (정렬된 데이터에서) |
| `grep` | 패턴 검색 (`-v`: 반전, `-i`: 대소문자 무시) |
| `fmt` | 텍스트 포맷팅 |
| `head/tail` | 앞/뒤 출력 |
| `tr` | 문자 변환 |
| `sed` | 스트림 편집 |
| `awk` | 텍스트 처리 언어 |

### xargs 예시

```bash
ls -p | grep / | xargs open       # 하위 폴더 모두 열기
find . -print0 | xargs -0 ls     # null 문자로 분리
```

### grep 옵션

```bash
grep -A1 pattern    # 매칭 다음 1줄도 표시
grep -v 'aa'        # aa가 없는 줄
grep -i pattern     # 대소문자 무시
grep -n pattern     # 라인 번호 표시
```

### sed 예시

MySQL 결과를 CSV로 변환:
```bash
mysql -h host -uadmin -p --batch -e "SELECT * FROM table" | \
sed 's/"/""/g;s/^/"/g;s/$/"/g;s/[[:cntrl:]]/","/g' > output.csv
```
