---
layout: post
title: "IntelliJ IDEA 완벽 활용 가이드 - 단축키부터 플러그인까지"
date: 2025-12-28 12:01:00 +0900
categories: tools
tags: [intellij, ide, shortcuts, plugins, productivity]
description: "IntelliJ IDEA의 단축키, 유용한 플러그인, 디버깅 설정, HTTP Client 활용법 등 생산성을 높이는 팁을 소개합니다."
---

IntelliJ IDEA는 JetBrains에서 개발한 강력한 통합 개발 환경입니다. 이 글에서는 IntelliJ를 더욱 효과적으로 사용하기 위한 다양한 팁과 설정을 소개합니다.

## 1. 필수 단축키

### 윈도우 관리

| 기능 | 단축키 (Mac) |
|------|-------------|
| 모든 윈도우 숨기기/보이기 | `Shift + Cmd + F12` |
| Quick Definition | `Option + Space` |
| Implement Method | `Ctrl + I` |
| Refactor This | `Ctrl + T` |
| Type Info | `Ctrl + Shift + P` |
| Last Edit Location | `Shift + Cmd + Delete` |

### 탭 네비게이션

- **Go to next splitter**: Key pair로 검색하면 여러 옵션 확인 가능

## 2. Live Template

Live Template을 활용하면 반복적인 코드 작성을 줄일 수 있습니다.

### 주요 변수

- `$SELECTION$`: 선택한 텍스트
- `$END$`: 템플릿 완료 후 커서 위치

### 유용한 Expression

```text
rightSideType() - 오른쪽 변수와 같은 타입 설정
castToLeftSideType() - 왼쪽 타입으로 캐스팅 추가
suggestVariableName() - 변수명 추천
suggestIndexName() - for문 인덱스 추천 (i, j, k)
arrayVariable() - 배열 객체 추천
variableOfType("java.util.Iterator") - Iterator 타입 객체 추천
iterableVariable() - iterable 타입 객체 추천
componentTypeOf(ARRAY) - 배열 아이템의 타입 리턴
iterableComponentType(LIST) - iterable 아이템 타입 리턴
guessElementType(LIST) - 리스트 아이템 타입 추측
expressionType(SELECTION) - expression의 타입
```

### Groovy Script 활용

```text
groovyScript("new Random().nextInt(1000)")
groovyScript("return _1", kotlinClassName())
```

## 3. Remote Debug

### Java Remote Debug 설정

**로컬 애플리케이션**
1. Remote profile 추가
2. VM option 복사
3. 'Application configuration setting'의 'VM option'에 붙여넣기

**원격 서버**
1. JAR 파일과 같은 폴더에 `<jar-file-name>.conf` 파일 생성
2. VM option 설정:

```bash
export JAVA_OPTS="-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5005"
```

3. 포트 오픈
4. Debug 시작

**Supervisor 사용 시**
- supervisor의 conf에 argument 추가
- java 실행 코드의 맨 앞에 argument 붙여넣기
- supervisor restart

### 연결 문제 해결

1. 서버에서 IP 확인: `hostname -i`
2. telnet으로 포트 확인
3. 포트가 정상 동작하는지 확인

## 4. HTTP Client

IntelliJ에 내장된 HTTP Client를 사용하면 Postman 없이도 API 테스트가 가능합니다.

### Request 파일 생성

`.http` 확장자로 파일을 생성합니다.

```http
### Get Request
GET https://api.example.com/users
Authorization: Bearer {{auth_token}}

### Post Request
POST https://api.example.com/users
Content-Type: application/json

{
  "name": "John",
  "email": "john@example.com"
}
```

### 테스트 및 전역 변수 설정

응답 결과를 기반으로 변수를 설정할 수 있습니다:

```http
> {%
    client.global.set("auth_token", response.body.token);
%}
```

### Environment 설정

`http-client.env.json` 파일에서 환경별 변수 관리:

```json
{
  "development": {
    "host": "localhost:8080"
  },
  "production": {
    "host": "api.example.com"
  }
}
```

참고: [JetBrains HTTP Client Documentation](https://www.jetbrains.com/help/idea/http-client-in-product-code-editor.html)

## 5. 추천 플러그인

### Kotlin 관련
- **Ktor**: Kotlin 웹 프레임워크 지원
- **Kotlin Multiplatform Mobile**: 멀티플랫폼 개발
- **JSON to Kotlin Class**: JSON을 Kotlin data class로 변환
- **Compose for Desktop IDE Support**: Compose Desktop 지원

### Data Science
- **BigData Tools**: 빅데이터 도구 통합

### AWS
- **AWS Toolkit**: AWS 서비스 통합
- **AWS CloudFormation**: CloudFormation 템플릿 지원

### Java
- **Jump to Line**: 디버깅 시 원하는 라인으로 점프

### Editor
- **String Manipulation**: 문자열 조작 도구
- **Rainbow Brackets**: 괄호 색상 구분
- **GitHub Copilot**: AI 코드 어시스턴트
- **CodeGlance**: 코드 미니맵

### Python
- **Requirements**: requirements.txt 지원

### Web Development
- **Live Edit**: 실시간 웹 편집

### Tools
- **File Watchers**: 파일 변경 감지
- **Navigate From Literal**: 경로 문자열에서 파일로 이동

### Coworking
- **Code With Me**: 실시간 협업 코딩

### Chrome 확장
- **JetBrains IDE Support**: HTML Chrome 디버깅 지원

## 6. Inspection 관리

### Inspection 비활성화

1. 경고가 표시된 코드로 이동
2. `Alt + Enter` 누르기
3. "Edit inspection profile setting" 선택
4. 레벨 변경 (error/warning/info) 또는 완전 비활성화

또는 `Settings > Inspections`에서 전체 목록 확인 가능

## 7. Heap Size 설정

대규모 프로젝트에서 성능 향상을 위해 힙 크기를 조정할 수 있습니다.

### 설정 방법

`Help > Edit Custom VM Options` 또는 직접 파일 편집:

```
/Applications/Android Studio.app/Contents/bin/studio.vmoptions
```

### 권장 설정

```
-Xms2048m
-Xmx4096m
-XX:MaxPermSize=1024m
-XX:ReservedCodeCacheSize=768m
```

### 메모리 상태 표시

`Settings > Appearance & Behavior > Appearance > Window Options > Show memory indicator`

## 8. 트러블슈팅

### Gradle Sync Error

1. 로그 내용 확인 (`-debug`, `-scan`, `-stacktrace`)
2. `.idea/modules.iml`과 연결된 iml 파일 확인
3. Android에서는 Gradle resync 시도

### 탭 관련 설정

**한 윈도우에 여러 탭 보여주기**
- `System Preferences > General > Prefer tabs > Always`

**새 창이 뜨는 버그 해결**
1. `Help > Edit Custom Properties...`
2. 다음 라인 추가:

```
ide.mac.transparentTitleBarAppearance=true
```

### macOS Sierra Gradle 느림 문제

```bash
# 1. LocalHostName 확인
sudo scutil --get LocalHostName

# 2. HostName 확인
sudo scutil --get HostName

# 3. 값이 다르면 동일하게 설정
sudo scutil --set HostName [YOUR_HOST_NAME]
```

## 9. 성능 리포팅

성능 문제 발생 시 JetBrains에 리포트 제출:

[Reporting Performance Problems](https://intellij-support.jetbrains.com/hc/en-us/articles/207241235-Reporting-performance-problems)

## 참고 자료

- [IntelliJ IDEA Documentation](https://www.jetbrains.com/idea/documentation/)
- [HTTP Client in IntelliJ IDEA](https://www.jetbrains.com/help/idea/http-client-in-product-code-editor.html)
