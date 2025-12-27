---
layout: post
title: "Android 보안 취약점과 방어 전략"
date: 2025-12-28 12:03:00 +0900
categories: security
tags: [security, android, mobile-security, vulnerability, adb, rooting, dlp]
description: "Android 앱의 주요 보안 취약점과 공격 시나리오, 그리고 효과적인 방어 전략을 설명합니다."
---

# Android 보안 취약점과 방어 전략

모바일 앱 보안은 사용자 데이터와 자산을 보호하는 데 필수적입니다. 이 글에서는 Android 앱의 주요 보안 취약점과 방어 방법을 알아봅니다.

## DLP (Data Loss Prevention)

**DLP(Data Loss Prevention)**는 직원들의 의도적 또는 비의도적 데이터 유출을 방지하는 보안 전략입니다.

### DLP 주요 기능

- 민감한 데이터 탐지 및 분류
- 데이터 이동 모니터링
- 정책 기반 접근 제어
- 암호화 강제 적용

---

## 주요 보안 취약점

다음은 Android 앱에서 발생할 수 있는 주요 보안 취약점입니다.

### 1. ADB (Android Debug Bridge) 취약점

**공격 조건:**
- ADB 연결 가능
- 컴퓨터 바이러스 감염

**공격 시나리오:**
1. 무선 ADB 활성화
2. 원격에서 ADB 연결
3. 변조된 앱 설치
4. 악성 앱 설치

**피해:**
- 앱 변조와 동일한 피해
- 사용자 데이터 탈취

**방어 방법:**
- 무선 ADB 비활성화
- 개발자 옵션 비활성화
- ADB 연결 시 사용자 확인

### 2. 앱 변조 (App Modification)

**공격 시나리오:**
1. 앱 APK 추출
2. 앱 디컴파일 및 코드 수정
3. 변조된 앱 재배포

**피해:**
- OTP 가로채기
- 계정 정보 탈취
- 인증 메시지 가로채기

**방어 방법:**

```java
// 서버 측에서 앱 무결성 검증
public boolean verifyAppIntegrity(String signature) {
    // 앱 서명 검증
    return expectedSignature.equals(signature);
}
```

추가 방어 조치:
- 코드 난독화(Obfuscation)
- 무결성 검증(Integrity Check)
- Root 탐지
- Emulator 탐지

### 3. 악성 앱 (Malicious App)

**공격 조건:**
- 사용자가 악성 앱에 권한 허용
- 사용자의 개인정보 사전 확보

**공격 시나리오:**
1. 신뢰할 수 있어 보이는 앱으로 위장
2. SMS, 저장소 등 권한 요청
3. 권한 허용 시 민감 정보 탈취

**피해:**
- 금융 자산 탈취
- 개인정보 유출
- SMS 기반 인증 우회

**방어 방법:**
- 사용자 교육
- 최소 권한 원칙 적용
- 민감한 작업에 추가 인증

### 4. SMS 기반 공격

**공격 조건:**
- 사용자 전화번호 확보

**공격 시나리오:**
1. 악성 앱이 SMS 권한 획득
2. 사용자 디바이스에서 SMS 발송
3. UPI 등 금융 서비스 연결

**방어 방법:**

```kotlin
// SMS 발송 성공 여부 검증
fun verifySMSSent(intent: Intent): Boolean {
    return when (resultCode) {
        Activity.RESULT_OK -> true
        else -> {
            // SMS 발송 실패 처리
            false
        }
    }
}
```

### 5. 다중 계정 생성 악용

**공격 시나리오:**
1. 루팅된 디바이스에서 앱 실행
2. 디바이스 식별자 변조
3. 다수의 가짜 계정 생성
4. 프로모션/포인트 악용

**방어 방법:**

```kotlin
// 루팅 탐지
fun isDeviceRooted(): Boolean {
    val paths = arrayOf(
        "/system/app/Superuser.apk",
        "/sbin/su",
        "/system/bin/su",
        "/system/xbin/su"
    )
    return paths.any { File(it).exists() }
}

// 앱 변조 탐지
fun isAppModified(context: Context): Boolean {
    val expectedSignature = "expected_signature_hash"
    val actualSignature = getAppSignature(context)
    return expectedSignature != actualSignature
}
```

### 6. 네트워크 공격

**WiFi / 프록시 서버 공격:**
- 중간자 공격(MITM)
- 트래픽 스니핑
- 데이터 변조

**방어 방법:**
- HTTPS 강제 사용
- Certificate Pinning
- 데이터 암호화

### 7. 루팅된 디바이스

**위험성:**
- 시스템 레벨 접근 가능
- 앱 데이터 접근 가능
- 보안 메커니즘 우회

**방어 방법:**
- Root 탐지 구현
- 루팅 디바이스에서 앱 실행 차단
- 민감한 데이터 암호화 강화

---

## 보안 취약점 대응 매트릭스

| 취약점 | 위험도 | 탐지 가능성 | 권장 대응 |
|--------|--------|-------------|-----------|
| ADB 공격 | 중 | 어려움 | 무선 ADB 비활성화 |
| 앱 변조 | 상 | 가능 | 무결성 검증 |
| 악성 앱 | 상 | 불가능 | 사용자 교육 |
| SMS 공격 | 상 | 가능 | SMS 발송 검증 |
| 다중 계정 | 중 | 가능 | 루팅/변조 탐지 |
| 네트워크 공격 | 상 | 가능 | SSL Pinning |
| 루팅 | 상 | 가능 | Root 탐지 |

---

## 종합 보안 체크리스트

### 앱 레벨
- [ ] 코드 난독화 (ProGuard/R8)
- [ ] 앱 서명 검증
- [ ] 디버깅 방지
- [ ] 루팅 탐지
- [ ] 에뮬레이터 탐지

### 네트워크 레벨
- [ ] HTTPS 강제
- [ ] Certificate Pinning
- [ ] API 요청 서명

### 데이터 레벨
- [ ] 민감 데이터 암호화
- [ ] 안전한 저장소 사용
- [ ] 데이터 최소화

### 인증 레벨
- [ ] 다중 인증(MFA)
- [ ] 세션 관리
- [ ] 생체 인증 지원

---

## 참고 자료

- [OWASP Mobile Security Testing Guide](https://owasp.org/www-project-mobile-security-testing-guide/)
- [Android Security Best Practices](https://developer.android.com/topic/security/best-practices)
