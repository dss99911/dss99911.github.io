---
layout: post
title: "Android 보안 취약점과 방어 전략"
date: 2025-03-04 09:02:00 +0900
categories: [infra, security]
tags: [security, android, mobile-security, vulnerability, adb, rooting, dlp]
description: "Android 앱의 주요 보안 취약점과 공격 시나리오, 그리고 효과적인 방어 전략을 설명합니다."
image: /assets/images/posts/thumbnails/2025-12-28-android-security-vulnerabilities.png
redirect_from:
  - "/infra/security/2025/12/28/android-security-vulnerabilities.html"
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

---

## 보안 테스트 방법론

실제 앱의 보안 상태를 점검하려면 체계적인 테스트 방법론이 필요합니다. OWASP Mobile Security Testing Guide(MSTG)를 기반으로 한 테스트 절차를 소개합니다.

### 정적 분석 (Static Analysis)

앱을 실행하지 않고 APK 파일을 분석하는 방법입니다.

```bash
# APK 디컴파일 (jadx 사용)
jadx -d output_dir target.apk

# APK 내 민감 정보 검색
grep -r "password\|api_key\|secret" output_dir/

# AndroidManifest.xml에서 위험한 설정 확인
# - android:debuggable="true"
# - android:allowBackup="true"
# - exported=true인 컴포넌트
```

주요 확인 사항:
- 하드코딩된 API 키, 비밀번호, 토큰
- 디버그 모드 활성화 여부
- 불필요하게 export된 Activity, Service, BroadcastReceiver
- 안전하지 않은 네트워크 통신 설정 (cleartext traffic 허용)

### 동적 분석 (Dynamic Analysis)

앱을 실행하면서 런타임 동작을 분석하는 방법입니다.

```bash
# Frida를 이용한 런타임 후킹
frida -U -f com.target.app -l hook_script.js

# 네트워크 트래픽 캡처 (mitmproxy 사용)
mitmproxy --mode regular --listen-port 8080

# logcat으로 민감 정보 노출 확인
adb logcat | grep -i "token\|password\|key"
```

주요 확인 사항:
- 런타임에 민감한 데이터가 로그에 노출되는지
- SSL/TLS 통신이 올바르게 구현되었는지
- 루팅/탈옥 탐지가 우회 가능한지
- 메모리에 민감 정보가 평문으로 저장되는지

---

## 실제 사고 사례와 교훈

### 사례 1: 인증서 피닝 미적용으로 인한 데이터 유출

한 금융 앱이 Certificate Pinning을 적용하지 않아 공용 Wi-Fi 환경에서 중간자 공격(MITM)에 취약했습니다. 공격자는 가짜 Wi-Fi 핫스팟을 설치하고 사용자의 인증 토큰을 탈취하여 계좌에 무단 접근했습니다.

**교훈**: HTTPS만으로는 부족하며, Certificate Pinning을 반드시 적용해야 합니다.

### 사례 2: 백업 허용으로 인한 데이터 탈취

`android:allowBackup="true"` 설정이 되어 있어, ADB를 통해 앱 데이터를 백업한 후 다른 기기에서 복원하여 인증 토큰과 저장된 데이터에 접근할 수 있었습니다.

**교훈**: AndroidManifest.xml에서 `android:allowBackup="false"`를 설정하거나, 백업에 포함되지 않아야 할 데이터를 EncryptedSharedPreferences에 저장해야 합니다.

### 사례 3: Exported Activity를 통한 인증 우회

특정 앱의 결제 확인 Activity가 `exported=true`로 설정되어 있어, 다른 앱에서 직접 호출하여 인증 과정을 건너뛸 수 있었습니다.

**교훈**: 모든 Activity, Service, BroadcastReceiver의 `exported` 속성을 최소한으로 설정하고, intent-filter가 있는 컴포넌트에는 반드시 권한 검증을 추가해야 합니다.

---

## Android 보안 강화 도구

| 도구 | 용도 | 설명 |
|------|------|------|
| **ProGuard/R8** | 코드 난독화 | 디컴파일 시 코드 분석을 어렵게 만듦 |
| **SafetyNet/Play Integrity API** | 기기 무결성 검증 | 루팅, 에뮬레이터, 변조된 기기 탐지 |
| **EncryptedSharedPreferences** | 데이터 암호화 | SharedPreferences 데이터를 AES 암호화 |
| **Jetpack Security** | 파일 암호화 | EncryptedFile을 통한 파일 암호화 |
| **Network Security Config** | 네트워크 보안 | 앱 수준에서 네트워크 보안 정책 설정 |

### Network Security Config 예시

Android 7.0 이상에서는 XML 기반으로 네트워크 보안 정책을 설정할 수 있습니다:

```xml
<!-- res/xml/network_security_config.xml -->
<network-security-config>
    <!-- cleartext 통신 금지 -->
    <base-config cleartextTrafficPermitted="false">
        <trust-anchors>
            <certificates src="system" />
        </trust-anchors>
    </base-config>

    <!-- Certificate Pinning 설정 -->
    <domain-config>
        <domain includeSubdomains="true">api.example.com</domain>
        <pin-set expiration="2025-12-31">
            <pin digest="SHA-256">base64_encoded_pin_hash</pin>
            <!-- 백업 핀 (인증서 교체 시 사용) -->
            <pin digest="SHA-256">backup_pin_hash</pin>
        </pin-set>
    </domain-config>
</network-security-config>
```

---

## 참고 자료

- [OWASP Mobile Security Testing Guide](https://owasp.org/www-project-mobile-security-testing-guide/)
- [Android Security Best Practices](https://developer.android.com/topic/security/best-practices)
- [OWASP Mobile Top 10](https://owasp.org/www-project-mobile-top-10/)
- [Android Network Security Configuration](https://developer.android.com/training/articles/security-config)
