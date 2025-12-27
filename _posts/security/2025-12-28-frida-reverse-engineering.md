---
layout: post
title: "Frida를 이용한 Android 앱 분석과 리버스 엔지니어링"
date: 2025-12-28 12:01:00 +0900
categories: security
tags: [security, frida, reverse-engineering, android, debugging, apk, mobile-security]
description: "Frida 프레임워크를 사용한 Android 앱 동적 분석 방법과 APK 리컴파일 과정을 설명합니다. 보안 테스트 및 취약점 분석을 위한 기술적 가이드입니다."
---

# Frida를 이용한 Android 앱 분석

Frida는 동적 계측(Dynamic Instrumentation) 도구로, 실행 중인 앱의 동작을 분석하고 수정할 수 있게 해줍니다. 이 글에서는 보안 테스트 목적으로 Frida를 활용하는 방법을 설명합니다.

> **주의:** 이 글의 내용은 교육 및 합법적인 보안 테스트 목적으로만 사용해야 합니다. 타인의 앱을 무단으로 분석하거나 변조하는 것은 불법입니다.

## Frida 개요

Frida는 다음과 같은 용도로 사용됩니다:
- HTTPS API 트래픽 추적
- 앱 동작 분석 및 진단
- 보안 취약점 테스트

### ptrace

Linux 커널에서 제공하는 시스템 콜로, 다른 프로세스를 후킹하여 제어할 수 있습니다. Frida는 이 기능을 활용합니다.

## Frida 사용 방법

### 1. 루팅된 디바이스에서 사용

루팅된 디바이스에서 Frida를 사용하면 가장 강력한 기능을 활용할 수 있습니다.

**필요 조건:**
- 루팅된 디바이스
- ADB로 디바이스 접근
- MITM 프록시 인증서 설치
- 프록시 설정

**참고:** [Bypassing Android SSL Pinning with Frida](https://securitygrind.com/bypassing-android-ssl-pinning-with-frida/)

### 2. 비루팅 디바이스에서 사용 (Frida Gadget)

루팅이 불가능한 경우 Frida Gadget을 APK에 삽입하여 사용할 수 있습니다.

**참고 자료:**
- [Using Frida on Android without Root](https://koz.io/using-frida-on-android-without-root/)
- [LIEF를 활용한 Frida Gadget 삽입](https://lief.quarkslab.com/doc/latest/tutorials/09_frida_lief.html#configuration-of-frida-gadget)

### 3. 디버깅 가능한 앱에서 라이브러리 인젝션

디버그 모드가 활성화된 앱에서는 라이브러리 인젝션을 통해 분석이 가능합니다.

**참고:** [Library Injection for Debuggable Android Apps](https://koz.io/library-injection-for-debuggable-android-apps/)

---

## Frida Gadget 사용 방법

Frida Gadget은 APK에 삽입되어 Frida 서버 역할을 수행하는 공유 라이브러리입니다.

### Gadget + 외부 스크립트

1. Gadget이 삽입된 APK를 설치합니다.
2. 다음 명령어로 Frida 스크립트를 실행합니다:

```bash
frida -U gadget -l frida-sslpinning.js
```

### Gadget + 내장 스크립트

1. Gadget이 삽입된 APK를 설치합니다.
2. 이 때, 스크립트를 APK 내부에 함께 내장합니다.

내장 스크립트 방식은 설정 파일을 통해 구성할 수 있으며, 앱 실행 시 자동으로 스크립트가 로드됩니다.

---

## APK 리컴파일 방법

APK를 디컴파일하고 수정한 후 다시 빌드하는 과정입니다.

### apktool 설치

apktool은 APK 디컴파일 및 리컴파일을 위한 도구입니다.

- **다운로드:** [apktool Releases](https://bitbucket.org/iBotPeaches/apktool/downloads/)
- **문서:** [apktool Documentation](https://ibotpeaches.github.io/Apktool/documentation/)

### 디컴파일

```bash
apktool d target.apk -f
```

이 명령은 APK를 디컴파일하여 smali 코드와 리소스를 추출합니다.

### 리컴파일

빌드 전에 `original/META_INF` 폴더 안의 다음 파일들을 삭제해야 합니다:
- CERT.SF
- CERT.RSA
- MANIFEST.MF

```bash
apktool b apkfolder -c
```

`-c` 또는 `--copy-original` 옵션을 사용하지 않으면 META_INF 폴더가 완전히 사라질 수 있습니다.

### 정렬 및 서명

APK를 정렬(align)합니다:

```bash
zipalign -p 4 target.apk target-aligned.apk
```

APK에 서명합니다:

```bash
apksigner sign --ks keystore.jks target-aligned.apk
```

---

## Anti-Debugging 기법

앱 개발자는 디버깅을 방지하기 위해 다양한 기법을 사용합니다.

### 디버깅 우회 방법

보안 연구에 따르면 다음 방법으로 디버깅 방어를 우회할 수 있습니다:

1. **매니페스트 패칭**: `android:debuggable="true"` 설정
2. **시스템 속성 변경**: `ro.debuggable` 속성을 변경하여 모든 앱에서 디버깅 활성화

### 일반적인 디버깅 탐지 방법

앱에서 사용하는 주요 탐지 방법:

```java
// Application 클래스에서 체크
ApplicationInfo.FLAG_DEBUGGABLE

// Activity, Fragment, API 호출 시마다 체크
Debug.isDebuggerConnected()
```

**참고:** [OWASP Testing Anti-Debugging](https://github.com/OWASP/owasp-mstg/blob/master/Document/0x05j-Testing-Resiliency-Against-Reverse-Engineering.md#testing-anti-debugging)

---

## 참고 자료

- [SSL Pinning Bypass with Frida Gadget](https://securitygrind.com/ssl-pinning-bypass-with-frida-gadget-gadget-injector-py/)
- [Bypass SSL Pinning by Changing SSL Certificate](https://v0x.nl/articles/bypass-ssl-pinning-android/)
- [LIEF + Frida Tutorial](https://lief.quarkslab.com/doc/latest/tutorials/09_frida_lief.html)
