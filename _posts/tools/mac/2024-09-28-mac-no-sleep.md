---
layout: post
title: 맥북 수면모드 off 시키기
date: 2024-09-28 01:57:37 +0900
categories: [tools, mac]
tags: [mac, macos, sleep-mode, pmset, power-management]
image: /assets/images/posts/thumbnails/2024-09-28-mac-no-sleep.png
---

## 배경
장시간 처리해야 하고, 맥북을 닫았을 때도, 수행이 되어야 한다면, sleep mode를 off 시키자. 대용량 파일 다운로드, 서버 프로세스 실행, 긴 빌드 작업 등 장시간 작업이 필요한 상황에서 맥북이 잠들지 않도록 설정하는 방법을 정리합니다.

## sleep mode off 시키기
```
sudo pmset -a disablesleep 1
# sudo pmset -a disablesleep 0  # 다시 on 시키기
```

off 시킬 경우, 맥북을 닫아도, 화면이 켜져 있음
만약 화면은 끄고 싶다면, lock screen에서 esc를 누르면, 화면 절전 모드 상태가 되어, 화면은 꺼지지만, 프로세스는 돌아감.

만약 맥북을 닫았을 때, 자동으로 꺼지게 하고 싶다면, 시스템 세팅에서 Lock screen 세팅에서 inactive 몇 분 후에 화면 꺼지게 할 수 있다

## pmset 주요 옵션

`pmset`은 macOS의 전원 관리를 제어하는 커맨드라인 도구입니다. `-a` 옵션은 모든 전원 소스(배터리 + AC 전원)에 적용됩니다.

```bash
# 현재 전원 관리 설정 확인
pmset -g
pmset -g custom  # 배터리/AC 전원별 상세 설정

# 화면 꺼짐 시간 설정 (분 단위, 0은 비활성화)
sudo pmset -a displaysleep 10

# 시스템 슬립 시간 설정 (분 단위, 0은 비활성화)
sudo pmset -a sleep 0

# 디스크 슬립 시간 설정
sudo pmset -a disksleep 0
```

### 전원 소스별 설정

| 옵션 | 설명 |
|------|------|
| `-a` | 모든 전원 소스에 적용 |
| `-b` | 배터리 전원에만 적용 |
| `-c` | AC 전원(충전기)에만 적용 |
| `-u` | UPS에만 적용 |

예를 들어, AC 전원 연결 시에만 수면 모드를 끄고 싶다면:
```bash
sudo pmset -c disablesleep 1
```

## caffeinate 명령어 (일시적 방지)

`disablesleep`은 수동으로 다시 켜야 하므로 잊어버리기 쉽습니다. 특정 작업 동안만 잠들지 않게 하려면 `caffeinate` 명령어가 더 편리합니다.

```bash
# 시스템이 잠들지 않도록 유지 (Ctrl+C로 종료)
caffeinate

# 특정 시간 동안만 유지 (초 단위)
caffeinate -t 3600  # 1시간

# 특정 명령어가 끝날 때까지 유지
caffeinate -s long_running_script.sh

# 특정 프로세스가 살아있는 동안 유지
caffeinate -w <PID>
```

### caffeinate 옵션

| 옵션 | 설명 |
|------|------|
| `-d` | 디스플레이가 꺼지지 않게 방지 |
| `-i` | 시스템 idle sleep 방지 |
| `-s` | 시스템 sleep 방지 (AC 전원 시) |
| `-m` | 디스크가 sleep 하지 않게 방지 |
| `-w PID` | 지정된 프로세스가 종료될 때까지 유지 |
| `-t seconds` | 지정된 시간(초) 동안만 유지 |

가장 많이 사용하는 패턴:
```bash
# 디스플레이도 꺼지지 않게 하면서 작업 실행
caffeinate -d -s my_script.sh

# 백그라운드 프로세스가 끝날 때까지
caffeinate -w $(pgrep -f "my_process")
```

## 주의사항

### 배터리 관련
- `disablesleep 1` 상태에서 맥북을 닫으면, 프로세스는 계속 실행되지만 배터리가 빠르게 소모됩니다.
- 장시간 작업 시에는 반드시 AC 전원을 연결하는 것을 권장합니다.
- 배터리 잔량이 너무 낮아지면 macOS가 강제로 슬립/종료할 수 있습니다.

### 발열 관련
- 맥북을 닫은 상태에서 프로세스가 실행되면 방열이 제대로 되지 않아 발열 문제가 생길 수 있습니다.
- CPU 부하가 높은 작업은 맥북을 열어둔 상태에서 실행하는 것이 좋습니다.
- 맥북 스탠드를 사용하면 닫힌 상태에서도 방열에 도움이 됩니다.

### 작업 완료 후 복구
`disablesleep`을 설정한 후에는 작업이 완료되면 반드시 원래 상태로 복구하세요:
```bash
sudo pmset -a disablesleep 0
```

이를 잊어버리면 항상 수면 모드가 비활성화되어 배터리 수명에 악영향을 줍니다. 가능하면 `caffeinate` 명령어를 사용하는 것이 더 안전합니다.