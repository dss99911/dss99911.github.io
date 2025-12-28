---
layout: post
title: "Mac 시스템 관리 - launchd, 네트워크, 배터리"
date: 2025-12-28 12:50:00 +0900
categories: [tools, mac]
tags: [mac, launchd, system, network, battery, macos]
description: "Mac 시스템 관리에 필요한 launchd, 네트워크 확인, 배터리 관리 방법을 정리합니다."
---

macOS 시스템을 효과적으로 관리하기 위한 핵심 도구들을 정리합니다.

## launchd - 서비스 관리

launchd는 macOS의 서비스 관리 시스템입니다. 부팅 시 자동 실행, 주기적 작업 등을 설정할 수 있습니다.

참고: [launchd.info](http://www.launchd.info/)

### 서비스 로드/언로드

```bash
# 서비스 언로드
launchctl unload /Users/username/Library/LaunchAgents/myservice.plist

# 서비스 로드
launchctl load /Users/username/Library/LaunchAgents/myservice.plist
```

**주의**: `sudo`를 사용하면 폴더 권한 문제로 실패할 수 있습니다.

### 서비스 목록 보기

```bash
launchctl list
```

### plist 파일 예시

Node.js 서버를 자동 실행하는 예시:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
    <dict>
        <key>Label</key>
        <string>myNodeServer</string>

        <key>ProgramArguments</key>
        <array>
            <string>/usr/local/bin/node</string>
            <string>/Users/username/Projects/myapp/bin/www</string>
        </array>

        <key>RunAtLoad</key>
        <true/>

        <key>KeepAlive</key>
        <true/>

        <key>StandardOutPath</key>
        <string>/Users/username/Projects/myapp/output.log</string>

        <key>StandardErrorPath</key>
        <string>/Users/username/Projects/myapp/error.log</string>
    </dict>
</plist>
```

### 주요 키 설명

| 키 | 설명 |
|-----|------|
| `Label` | 서비스 고유 식별자 |
| `ProgramArguments` | 실행할 프로그램과 인자 |
| `RunAtLoad` | 로드 시 즉시 실행 여부 |
| `KeepAlive` | 프로세스 종료 시 자동 재시작 |
| `StandardOutPath` | 표준 출력 로그 경로 |
| `StandardErrorPath` | 표준 에러 로그 경로 |

### plist 파일 위치

| 위치 | 용도 |
|------|------|
| `~/Library/LaunchAgents/` | 사용자별 에이전트 |
| `/Library/LaunchAgents/` | 시스템 전체 에이전트 (모든 사용자) |
| `/Library/LaunchDaemons/` | 시스템 데몬 (root 권한) |

## 네트워크 진단

### 포트 사용 확인

특정 포트를 사용하는 프로세스 찾기:

```bash
# 포트 51149 확인
lsof -nP -i:51149
```

### 서비스 포트 확인

특정 포트에서 리스닝 중인 서비스 찾기:

```bash
# 8080 포트 확인
sudo lsof -PiTCP -sTCP:LISTEN | grep 8080
```

### 명령어 옵션 설명

| 옵션 | 설명 |
|------|------|
| `-n` | 호스트명 변환 안 함 (빠름) |
| `-P` | 포트 이름 변환 안 함 |
| `-i` | 인터넷 연결 표시 |
| `-sTCP:LISTEN` | TCP LISTEN 상태만 표시 |

## 배터리 관리

### 전원 설정 확인

```bash
pmset -g
```

### 자동 전원 끄기 지연 설정

```bash
# 배터리 모드에서 24시간(86400초) 후 자동 전원 끄기
pmset -b autopoweroffdelay 86400
```

### pmset 옵션

| 옵션 | 설명 |
|------|------|
| `-g` | 현재 설정 표시 |
| `-a` | 모든 전원 모드 |
| `-b` | 배터리 모드 |
| `-c` | 충전기 연결 모드 |

더 자세한 설정은 [pmset 레퍼런스](https://www.dssw.co.uk/reference/pmset.html)를 참고하세요.

## 수퍼유저 (Root) 관리

### su 비밀번호 변경

공식 가이드: [Apple Support - Change root password](https://support.apple.com/en-in/HT204012)

### 리커버리 모드에서 비밀번호 재설정

비밀번호를 잊어버린 경우, 리커버리 모드에서 재설정할 수 있습니다.

참고: [Reset superuser password without boot disk](https://apple.stackexchange.com/questions/38921/how-do-i-reset-recover-my-superuser-password-without-the-boot-disk)

## Python pip 오류 해결

`ImportError: No module named _internal` 에러 발생 시:

```bash
# pip 다운그레이드
sudo python -m pip install -U pip==8.0.1

# 다시 업그레이드
sudo pip install -U pip
```

## 결론

launchd를 활용하면 Mac에서 다양한 백그라운드 서비스를 자동화할 수 있습니다. 네트워크 진단 명령어로 포트 충돌을 해결하고, pmset으로 배터리 설정을 최적화하여 Mac을 효율적으로 관리하세요.
