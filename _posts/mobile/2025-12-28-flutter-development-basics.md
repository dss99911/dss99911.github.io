---
layout: post
title: "Flutter Development Basics - Getting Started"
date: 2025-12-28
categories: mobile
tags: [flutter, dart, mobile-development, cross-platform]
---

Flutter 크로스 플랫폼 개발을 시작하기 위한 기본 가이드입니다.

## Flutter란?

Flutter는 Google에서 개발한 오픈소스 UI 프레임워크로, 단일 코드베이스로 iOS, Android, Web, Desktop 앱을 개발할 수 있습니다.

## 패키지 및 플러그인

Flutter 패키지와 플러그인은 pub.dev에서 찾을 수 있습니다:

- [Flutter Packages](https://pub.dev/flutter)

### pubspec.yaml에 패키지 추가

```yaml
dependencies:
  flutter:
    sdk: flutter
  http: ^0.13.5
  provider: ^6.0.5
  shared_preferences: ^2.0.15
```

### 패키지 설치

```bash
flutter pub get
```

## 기본 프로젝트 구조

```
my_app/
├── android/          # Android 네이티브 코드
├── ios/              # iOS 네이티브 코드
├── lib/              # Dart 소스 코드
│   └── main.dart     # 앱 진입점
├── test/             # 테스트 코드
├── pubspec.yaml      # 프로젝트 설정 및 의존성
└── pubspec.lock      # 의존성 잠금 파일
```

## 시작하기

### 프로젝트 생성

```bash
flutter create my_app
cd my_app
flutter run
```

### 기본 앱 구조

```dart
import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: const MyHomePage(title: 'Flutter Demo Home Page'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});
  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  int _counter = 0;

  void _incrementCounter() {
    setState(() {
      _counter++;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            const Text('You have pushed the button this many times:'),
            Text(
              '$_counter',
              style: Theme.of(context).textTheme.headlineMedium,
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _incrementCounter,
        tooltip: 'Increment',
        child: const Icon(Icons.add),
      ),
    );
  }
}
```

## 유용한 명령어

```bash
# 프로젝트 실행
flutter run

# 디바이스 목록
flutter devices

# 패키지 업데이트
flutter pub upgrade

# 빌드
flutter build apk          # Android APK
flutter build ios          # iOS
flutter build web          # Web
```

## 참고 자료

- [Flutter 공식 문서](https://flutter.dev/docs)
- [Dart 언어 가이드](https://dart.dev/guides)
- [Flutter 패키지](https://pub.dev/flutter)
