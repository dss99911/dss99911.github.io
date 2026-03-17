---
layout: post
title: "암호화 기초 - 대칭키, HMAC, 그리고 메시지 인증"
date: 2025-01-21 15:20:00 +0900
categories: [infra, security]
tags: [security, encryption, cryptography, aes, des, hmac, symmetric-key]
description: "대칭키 암호화의 기본 개념과 AES, DES 알고리즘 비교, 그리고 HMAC을 이용한 메시지 인증 코드 구현 방법을 설명합니다."
image: /assets/images/posts/thumbnails/2025-12-28-encryption-basics.png
redirect_from:
  - "/infra/security/2025/12/28/encryption-basics.html"
---

# 암호화 기초

암호화는 데이터 보안의 핵심 기술입니다. 이 글에서는 대칭키 암호화와 메시지 인증 코드(MAC)에 대해 알아봅니다.

## 암호화 방식의 종류

암호화는 크게 두 가지 방식으로 나뉩니다:

| 방식 | 특징 | 장점 | 단점 |
|------|------|------|------|
| **대칭키** | 암호화와 복호화에 같은 키 사용 | 빠른 속도 | 키 교환의 어려움 |
| **비대칭키** | 공개키와 개인키 쌍 사용 | 안전한 키 교환 | 느린 속도 |

---

## 대칭키 암호화 (Symmetric Key Encryption)

대칭키 암호화는 암호화와 복호화에 동일한 키를 사용하는 방식입니다. 속도가 빠르기 때문에 대량의 데이터 암호화에 적합합니다.

### AES (Advanced Encryption Standard)

AES는 현재 가장 널리 사용되는 대칭키 암호화 알고리즘입니다.

**특징:**
- 미국 NIST에서 표준으로 채택
- 128, 192, 256비트 키 길이 지원
- 블록 암호화 방식 (128비트 블록)
- 높은 보안성과 성능

**사용 예시 (Java):**

```java
import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.IvParameterSpec;
import java.security.SecureRandom;

public class AESExample {
    public static void main(String[] args) throws Exception {
        // 키 생성
        KeyGenerator keyGen = KeyGenerator.getInstance("AES");
        keyGen.init(256);
        SecretKey secretKey = keyGen.generateKey();

        // IV(초기화 벡터) 생성
        byte[] iv = new byte[16];
        new SecureRandom().nextBytes(iv);
        IvParameterSpec ivSpec = new IvParameterSpec(iv);

        // 암호화
        Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
        cipher.init(Cipher.ENCRYPT_MODE, secretKey, ivSpec);
        byte[] encrypted = cipher.doFinal("Hello World".getBytes());

        // 복호화
        cipher.init(Cipher.DECRYPT_MODE, secretKey, ivSpec);
        byte[] decrypted = cipher.doFinal(encrypted);
    }
}
```

### DES (Data Encryption Standard)

DES는 과거에 널리 사용되던 암호화 알고리즘이지만, 현재는 **사용하지 않는 것을 권장**합니다.

**취약점:**
- 56비트 키 길이로 브루트포스 공격에 취약
- 현대 컴퓨팅 파워로 수 시간 내 해독 가능

**권장 사항:**
- DES 대신 AES를 사용
- 기존 DES 시스템은 AES로 마이그레이션 필요

---

## HMAC (Hash-based Message Authentication Code)

HMAC은 해시 함수와 비밀 키를 결합하여 메시지의 무결성과 인증을 보장하는 방법입니다.

### 작동 원리

```
HMAC = Hash(비밀키 + 메시지)
```

1. 클라이언트가 메시지와 함께 HMAC을 생성하여 전송
2. 서버가 동일한 비밀키로 HMAC을 다시 계산
3. 두 HMAC 값을 비교하여 메시지 무결성 검증

### 용도

- **API 요청 서명**: API 요청이 변조되지 않았음을 보장
- **데이터 무결성 검증**: 데이터가 전송 중 변경되지 않았음을 확인
- **인증**: 메시지가 올바른 발신자로부터 왔음을 확인

### 구현 예시 (Node.js)

```javascript
const crypto = require('crypto');

function createHMAC(message, secretKey) {
    return crypto
        .createHmac('sha256', secretKey)
        .update(message)
        .digest('hex');
}

function verifyHMAC(message, secretKey, receivedHMAC) {
    const calculatedHMAC = createHMAC(message, secretKey);
    return crypto.timingSafeEqual(
        Buffer.from(calculatedHMAC),
        Buffer.from(receivedHMAC)
    );
}

// 사용 예시
const secretKey = 'your-secret-key';
const message = 'Hello World';

const hmac = createHMAC(message, secretKey);
console.log('HMAC:', hmac);

const isValid = verifyHMAC(message, secretKey, hmac);
console.log('Valid:', isValid);
```

### 구현 예시 (Kotlin/Android)

```kotlin
import javax.crypto.Mac
import javax.crypto.spec.SecretKeySpec

fun createHMAC(message: String, secretKey: String): String {
    val mac = Mac.getInstance("HmacSHA256")
    val keySpec = SecretKeySpec(secretKey.toByteArray(), "HmacSHA256")
    mac.init(keySpec)
    val hmacBytes = mac.doFinal(message.toByteArray())
    return hmacBytes.joinToString("") { "%02x".format(it) }
}
```

---

## 암호화 적용 시 고려사항

### 1. 키 관리

- 키를 안전하게 저장 (HSM, Key Vault 활용)
- 정기적인 키 로테이션
- 키 접근 권한 최소화

### 2. 알고리즘 선택

| 용도 | 권장 알고리즘 |
|------|--------------|
| 대칭키 암호화 | AES-256-GCM |
| 해시 | SHA-256, SHA-3 |
| HMAC | HMAC-SHA256 |
| 비대칭키 | RSA-2048+, ECDSA |

### 3. 구현 시 주의사항

- 검증된 암호화 라이브러리 사용
- 직접 암호화 알고리즘 구현 금지
- IV(초기화 벡터)는 항상 새로 생성
- Timing Attack 방지를 위한 상수 시간 비교 사용

---

## 비대칭키 암호화 (Asymmetric Key Encryption)

비대칭키 암호화는 공개키(Public Key)와 개인키(Private Key) 한 쌍을 사용합니다. 공개키로 암호화한 데이터는 개인키로만 복호화할 수 있고, 그 반대도 마찬가지입니다.

### RSA 알고리즘

RSA는 가장 널리 사용되는 비대칭키 암호화 알고리즘입니다.

**특징:**
- 소인수분해의 어려움을 기반으로 한 보안성
- 2048비트 이상의 키 길이 권장
- 디지털 서명과 키 교환에 주로 사용

**Java 예시:**

```java
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import javax.crypto.Cipher;

public class RSAExample {
    public static void main(String[] args) throws Exception {
        // 키 쌍 생성
        KeyPairGenerator keyGen = KeyPairGenerator.getInstance("RSA");
        keyGen.initialize(2048);
        KeyPair keyPair = keyGen.generateKeyPair();

        // 공개키로 암호화
        Cipher cipher = Cipher.getInstance("RSA");
        cipher.init(Cipher.ENCRYPT_MODE, keyPair.getPublic());
        byte[] encrypted = cipher.doFinal("Hello World".getBytes());

        // 개인키로 복호화
        cipher.init(Cipher.DECRYPT_MODE, keyPair.getPrivate());
        byte[] decrypted = cipher.doFinal(encrypted);
        System.out.println(new String(decrypted));  // "Hello World"
    }
}
```

### ECDSA (Elliptic Curve Digital Signature Algorithm)

타원 곡선 암호를 사용하는 디지털 서명 알고리즘으로, RSA보다 짧은 키 길이로 동등한 보안 수준을 제공합니다.

| 알고리즘 | 동등한 보안 수준의 키 길이 |
|---------|----------------------|
| RSA | 3072비트 |
| ECDSA | 256비트 |

키 길이가 짧을수록 연산 속도가 빨라 모바일 기기나 IoT 디바이스에서 유리합니다.

---

## 하이브리드 암호화

실제 시스템에서는 대칭키와 비대칭키를 조합한 **하이브리드 암호화**를 사용합니다. TLS/SSL이 대표적인 예입니다.

### 작동 방식

1. **비대칭키로 세션 키 교환**: 클라이언트가 서버의 공개키로 대칭키(세션 키)를 암호화하여 전송
2. **대칭키로 데이터 암호화**: 교환된 세션 키를 사용하여 실제 데이터를 암호화

이 방식은 비대칭키의 안전한 키 교환과 대칭키의 빠른 암호화 속도를 모두 활용합니다.

---

## 해시 함수 (Hash Function)

해시 함수는 임의 길이의 데이터를 고정 길이의 값으로 변환하는 단방향 함수입니다. 암호화와 달리 원본을 복원할 수 없습니다.

### 주요 해시 알고리즘

| 알고리즘 | 출력 길이 | 용도 | 안전성 |
|---------|----------|------|--------|
| MD5 | 128비트 | 체크섬 (보안 용도 X) | 취약 |
| SHA-1 | 160비트 | 레거시 시스템 | 취약 |
| SHA-256 | 256비트 | 비밀번호, 서명 | 안전 |
| SHA-3 | 가변 | 최신 표준 | 안전 |
| bcrypt | 가변 | 비밀번호 해싱 | 안전 |

### 비밀번호 저장 시 해시 사용

비밀번호는 절대 평문으로 저장하면 안 됩니다. 반드시 해시 함수를 사용하되, **솔트(salt)**를 추가해야 합니다.

```python
import bcrypt

# 비밀번호 해싱 (솔트 자동 생성)
password = "my_password".encode('utf-8')
hashed = bcrypt.hashpw(password, bcrypt.gensalt())

# 비밀번호 검증
if bcrypt.checkpw(password, hashed):
    print("비밀번호 일치")
```

**솔트(Salt)**를 사용하는 이유:
- 동일한 비밀번호라도 서로 다른 해시값을 생성
- 레인보우 테이블 공격 방지
- 각 사용자마다 고유한 솔트를 생성해야 함

---

## 디지털 서명 (Digital Signature)

디지털 서명은 문서나 메시지의 진위와 무결성을 보장하는 기술입니다.

### 서명 과정

1. 발신자가 메시지의 해시를 생성
2. 해시를 발신자의 **개인키로 암호화** (서명)
3. 메시지와 서명을 함께 전송

### 검증 과정

1. 수신자가 메시지의 해시를 생성
2. 서명을 발신자의 **공개키로 복호화**
3. 두 해시값을 비교하여 무결성 검증

### 활용 사례

- **SSL/TLS 인증서**: 웹사이트의 신원 검증
- **코드 서명**: 소프트웨어의 출처 검증
- **이메일 서명**: 이메일의 진위 확인
- **블록체인**: 트랜잭션의 유효성 검증

---

## 실무에서 자주 사용하는 암호화 패턴

### 1. 데이터베이스 암호화

민감한 데이터(주민등록번호, 신용카드 번호 등)는 데이터베이스에 저장할 때 암호화해야 합니다.

```java
// AES-GCM으로 데이터 암호화 후 Base64 인코딩하여 저장
String encryptedData = Base64.getEncoder()
    .encodeToString(aesGcmEncrypt(sensitiveData, secretKey));
```

### 2. API 통신 보안

- **전송 계층**: TLS 1.3 사용 (HTTPS)
- **메시지 계층**: 요청 본문에 대해 HMAC 서명 추가
- **인증**: JWT 토큰에 서명 검증

### 3. 파일 암호화

대용량 파일은 스트림 암호화를 사용하여 메모리 효율적으로 처리합니다.

---

## 참고 자료

- [How API Request Signing Works](https://blog.andrewhoang.me/how-api-request-signing-works-and-how-to-implement-it-in-nodejs-2/)
- [NIST AES Specification](https://csrc.nist.gov/publications/detail/fips/197/final)
