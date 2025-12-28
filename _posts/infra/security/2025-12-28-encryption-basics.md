---
layout: post
title: "암호화 기초 - 대칭키, HMAC, 그리고 메시지 인증"
date: 2025-12-28 12:02:00 +0900
categories: [infra, security]
tags: [security, encryption, cryptography, aes, des, hmac, symmetric-key]
description: "대칭키 암호화의 기본 개념과 AES, DES 알고리즘 비교, 그리고 HMAC을 이용한 메시지 인증 코드 구현 방법을 설명합니다."
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

## 참고 자료

- [How API Request Signing Works](https://blog.andrewhoang.me/how-api-request-signing-works-and-how-to-implement-it-in-nodejs-2/)
- [NIST AES Specification](https://csrc.nist.gov/publications/detail/fips/197/final)
