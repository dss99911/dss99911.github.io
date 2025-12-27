---
layout: post
title: "Android 보안 베스트 프랙티스"
date: 2025-12-28 12:05:00 +0900
categories: android
tags: [android, security, ssl-pinning, proguard, encryption]
description: "Android 앱 보안을 강화하는 방법을 알아봅니다. SSL Pinning, 앱 무결성 검증, 난독화 등 보안 기법을 다룹니다."
---

# Android 보안 베스트 프랙티스

Android 앱의 보안을 강화하는 다양한 방법을 알아봅니다.

## 네트워크 보안

### HTTPS 사용

모든 네트워크 통신은 HTTPS를 사용해야 합니다.

```kotlin
val url = URL("https://api.example.com/data")
val connection = url.openConnection() as HttpsURLConnection
connection.connect()
val inputStream = connection.inputStream
```

### Network Security Config

Android 7.0(API 24)부터 지원되는 네트워크 보안 설정입니다.

```xml
<!-- res/xml/network_security_config.xml -->
<network-security-config>
    <base-config cleartextTrafficPermitted="false">
        <trust-anchors>
            <certificates src="system" />
        </trust-anchors>
    </base-config>

    <!-- 특정 도메인만 HTTP 허용 -->
    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="true">legacy.example.com</domain>
    </domain-config>
</network-security-config>
```

```xml
<!-- AndroidManifest.xml -->
<application
    android:networkSecurityConfig="@xml/network_security_config">
</application>
```

### SSL Pinning

중간자 공격(MITM)을 방지하기 위해 인증서를 고정합니다.

#### 인증서 고정 대상

- **서버 인증서**: 가장 확실하지만, 인증서 갱신 시 앱 업데이트 필요
- **중간 CA 인증서**: 같은 CA에서 발급받으면 앱 업데이트 불필요
- **Public Key**: 인증서가 갱신되어도 Public Key는 유지될 수 있음

#### OkHttp에서 SSL Pinning

```kotlin
val certificatePinner = CertificatePinner.Builder()
    .add("api.example.com", "sha256/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=")
    .build()

val client = OkHttpClient.Builder()
    .certificatePinner(certificatePinner)
    .build()
```

#### Network Security Config으로 SSL Pinning

```xml
<network-security-config>
    <domain-config>
        <domain includeSubdomains="true">example.com</domain>
        <pin-set expiration="2025-12-31">
            <pin digest="SHA-256">base64EncodedHash==</pin>
            <!-- 백업 핀 -->
            <pin digest="SHA-256">backupHash==</pin>
        </pin-set>
    </domain-config>
</network-security-config>
```

## 앱 무결성 검증

### APK 서명 검증

앱이 변조되었는지 확인합니다.

```kotlin
fun hasValidSignature(context: Context): Boolean {
    return try {
        val pm = context.packageManager
        val packageInfo = pm.getPackageInfo(
            context.packageName,
            PackageManager.GET_SIGNATURES
        )
        val cert = packageInfo.signatures[0].toByteArray()
        val digest = MessageDigest.getInstance("SHA1")
        val hash = digest.digest(cert)

        val calculated = hash.joinToString("") {
            Integer.toString(it.toInt() and 0xff, 16).lowercase()
        }

        val expected = context.getString(R.string.expected_fingerprint)
        calculated == expected
    } catch (e: Exception) {
        false
    }
}
```

### SafetyNet Attestation

루팅 기기 및 변조된 환경을 감지합니다.

```kotlin
SafetyNet.getClient(context)
    .attest(nonce, apiKey)
    .addOnSuccessListener { response ->
        val jwsResult = response.jwsResult
        // 서버에서 검증
    }
    .addOnFailureListener { e ->
        // 실패 처리
    }
```

## 데이터 보호

### Provider 보안

```xml
<provider
    android:name="androidx.core.content.FileProvider"
    android:authorities="${applicationId}.fileprovider"
    android:exported="false"
    android:grantUriPermissions="true">
    <meta-data
        android:name="android.support.FILE_PROVIDER_PATHS"
        android:resource="@xml/file_paths" />
</provider>
```

### Signature 기반 권한

같은 서명을 가진 앱끼리만 데이터 공유:

```xml
<manifest>
    <permission
        android:name="com.example.MY_PERMISSION"
        android:protectionLevel="signature" />

    <application>
        <provider
            android:name=".MyProvider"
            android:permission="com.example.MY_PERMISSION"
            android:exported="true" />
    </application>
</manifest>
```

## 코드 난독화

### ProGuard/R8 설정

```
# proguard-rules.pro

# 모델 클래스 유지 (JSON 파싱용)
-keep class com.example.model.** { *; }

# 리플렉션 사용 클래스 유지
-keep class com.example.reflect.** { *; }

# 스택 트레이스 가독성
-keepattributes SourceFile,LineNumberTable
```

### 리소스 난독화

```kotlin
android {
    buildTypes {
        release {
            minifyEnabled true
            shrinkResources true
        }
    }
}
```

## 암호화

### Android Keystore

민감한 키를 안전하게 저장합니다.

```kotlin
val keyGenerator = KeyGenerator.getInstance(
    KeyProperties.KEY_ALGORITHM_AES,
    "AndroidKeyStore"
)

val keySpec = KeyGenParameterSpec.Builder(
    "myKeyAlias",
    KeyProperties.PURPOSE_ENCRYPT or KeyProperties.PURPOSE_DECRYPT
)
    .setBlockModes(KeyProperties.BLOCK_MODE_CBC)
    .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_PKCS7)
    .setUserAuthenticationRequired(true)
    .build()

keyGenerator.init(keySpec)
val secretKey = keyGenerator.generateKey()
```

### EncryptedSharedPreferences

```kotlin
val masterKey = MasterKey.Builder(context)
    .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
    .build()

val sharedPreferences = EncryptedSharedPreferences.create(
    context,
    "secret_shared_prefs",
    masterKey,
    EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
    EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
)
```

## 보안 체크리스트

1. **네트워크**
   - [ ] HTTPS만 사용
   - [ ] SSL Pinning 구현
   - [ ] Network Security Config 설정

2. **데이터**
   - [ ] 민감한 데이터 암호화
   - [ ] SharedPreferences 대신 EncryptedSharedPreferences 사용
   - [ ] 로그에 민감한 정보 제외

3. **코드**
   - [ ] ProGuard/R8 난독화 적용
   - [ ] 앱 서명 검증
   - [ ] 디버그 빌드에서만 로깅

4. **인증**
   - [ ] 토큰 안전하게 저장
   - [ ] 세션 타임아웃 구현
   - [ ] 생체 인증 고려

## 보안 도구

- **Stetho**: 디버그 시 DB 및 네트워크 검사 (디버그 빌드만)
- **FindBugs**: 보안 취약점 정적 분석
- **OWASP ZAP**: 동적 보안 테스트

## 결론

앱 보안은 여러 계층에서 적용해야 합니다. 네트워크 통신 암호화, 로컬 데이터 보호, 코드 난독화를 함께 적용하고, 정기적으로 보안 취약점을 점검하세요.
