---
layout: post
title: "Gradle 기초 - 빌드 시스템의 핵심 개념과 명령어"
date: 2025-12-28 12:03:00 +0900
categories: [tools, common]
tags: [gradle, build, java, groovy]
image: /assets/images/posts/thumbnails/2025-12-28-gradle-basics.png
description: "Gradle의 기본 개념, 라이프사이클, 프로젝트 구조, 명령어 등 핵심 내용을 다룹니다."
---

Gradle은 Groovy/Kotlin DSL을 기반으로 한 빌드 자동화 도구입니다. Maven에 비해 유연하고 강력한 기능을 제공합니다.

## 1. Gradle의 장점

- **절차적 프로그래밍 가능**: 빌드 스크립트에서 프로그래밍 로직 사용
- **자바와 유사한 문법**: Groovy/Kotlin 기반으로 친숙함
- **강력한 의존성 관리**: 유연한 의존성 해결
- **증분 빌드**: 변경된 부분만 빌드하여 속도 향상

## 2. 라이프사이클

Gradle 빌드는 세 단계로 구성됩니다:

### Initialization
- 참여할 프로젝트 결정 및 Project 인스턴스 생성
- `settings.gradle` 처리
- 초기화 스크립트 실행 위치:
  - `<USER_HOME>/.gradle/init.d/`
  - `<USER_HOME>/.gradle/init.gradle`
  - `<GRADLE_HOME>/init.d/`
  - `-I <file>` 또는 `--init-script <file>` 옵션

### Configuration
- DAG(Directed Acyclic Graph) 생성
- 프로젝트 객체 구성
- **모든 태스크의 configuration block이 실행됨** (해당 태스크 실행 여부와 무관)

### Execution
- 실제 태스크 실행

### 실행 순서 예제

```groovy
// project configuration -> task configuration -> execute task
version = '1.0'
description = 'Sample Java Project'

ext {
    startDate = "Jan 2015"
}

println "This is project configuration part"

task sampleTask1 {
    description = "This is task level description"
    ext {
        taskDetail = "Custom property of task1"
    }
    println "This is sampleTask1 configuration"  // 항상 실행됨

    doFirst {
        println "Task doFirst"  // 태스크 실행 시에만
    }
    doLast {
        println "Task doLast"  // 태스크 실행 시에만
    }
}
```

## 3. 프로젝트 구조

### 프로젝트 확인

```bash
gradle -q projects
```

### 주요 속성

```groovy
project          // 프로젝트 객체
project.name     // 프로젝트 이름 (기본: 디렉토리명)
project.path     // 프로젝트 경로
project.version  // 버전
project.description  // 설명
project.parent   // 부모 프로젝트
projectDir       // 프로젝트 디렉토리 File 객체
buildDir         // projectDir/build
rootProject      // 루트 프로젝트
```

### 커스텀 속성 추가

```groovy
project.ext {
    testVersion = '1.8.9'
}
println project.testVersion
```

## 4. 명령어

### 기본 명령어

```bash
# 특정 빌드 스크립트 실행
gradle -b apple.gradle

# 태스크 목록 확인
gradle tasks

# 태스크 실행 순서 확인 (실제 실행 없이)
gradle --dry-run taskName
gradle -m taskName

# 특정 태스크 실행
gradle hello hello2

# 축약된 태스크 이름 사용
gradle sT1 sT2  # sampleTask1 sampleTask2
```

### 로그 관련

```bash
gradle -d   # debug (가장 상세)
gradle -i   # info
gradle -S   # full stacktrace
gradle -s   # stacktrace
gradle -q   # quiet (에러만)
```

### Daemon 관련

```bash
gradle --daemon      # daemon 사용 (기본값)
gradle --no-daemon   # daemon 없이 실행
gradle --stop        # daemon 중지
ps -ef | grep gradle # daemon 프로세스 확인
```

### 태스크 에러 처리

```bash
# 태스크 실패해도 계속 진행
gradle --continue taskName

# 특정 태스크 제외
gradle build -x test
```

### 속성 설정

```bash
# 프로젝트 속성 (-P)
gradle -Penvironment=qa taskName

# 시스템 속성 (-D)
gradle -Dorg.gradle.parallel=true taskName
```

### 최적화 무시

```bash
gradle --rerun-tasks taskName
```

## 5. 로깅

```groovy
// 태스크 내에서
task.project.logger.warn("Message")

// 직접 출력
println "Task spend time:"

// 다양한 로그 레벨
logger.error "a"
logger.quiet "a"
logger.warn "a"
logger.lifecycle "a"  // 기본 레벨
logger.info "a"       // 기본적으로 안 보임
logger.debug "a"
```

## 6. 서브 프로젝트

### settings.gradle

```groovy
include ':app', ':library'
include ':subproject:subsubproject'  // 중첩 구조

// 외부 경로의 모듈 포함
project(':library').projectDir = new File(settingsDir, '../AndroidLibrary/library')
```

> **팁**: 모듈명에 `-`는 사용하지 않는 것이 좋습니다.

### 프로젝트 목록 확인

```bash
gradle projects
```

### 속성 의존성

```groovy
// 다른 서브프로젝트의 속성 사용
evaluationDependsOn(':profile')
```

### 라이브러리 의존성

```groovy
dependencies {
    compile project(':profile')
}
```

### 서브프로젝트 설정

```groovy
// 모든 프로젝트에 적용
allprojects { }

// 서브프로젝트에만 적용
subprojects { }
```

## 7. 속성 파일

### gradle.properties 위치

1. `<USER_HOME>/.gradle/gradle.properties` - 전역 설정
2. `<ProjectDir>/gradle.properties` - 프로젝트별 설정

### daemon 설정

```properties
org.gradle.daemon=true
```

### 메모리 설정

```properties
org.gradle.daemon=false
org.gradle.jvmargs=-Xmx256m
```

### 시스템 속성 정의

```properties
# gradle.properties
systemProp.sysProp1=sysVal1
```

### 커스텀 속성 파일 읽기

```groovy
task showCustomProp {
    doLast {
        Properties props = new Properties()
        props.load(new FileInputStream("login.properties"))
        println props
        println props.get('loginKey1')
    }
}
```

## 8. Wrapper

Gradle Wrapper를 사용하면 Gradle 설치 없이 빌드가 가능합니다.

### Wrapper 생성

```bash
gradle wrapper
```

### Wrapper 버전 업데이트

```bash
./gradlew wrapper --gradle-version=6.7
```

또는 `gradle/wrapper/gradle-wrapper.properties`의 `distributionUrl` 수정

## 9. 경로 표현

Gradle에서 경로는 `:`로 시작합니다:

```groovy
:hello           // 루트의 hello 태스크
:projectA:hello  // projectA의 hello 태스크
```

## 10. 파일 작업

### 파일 읽기/쓰기

```groovy
File file1 = file("readme.txt")
println file1  // 파일명 출력

// 읽기
file1.eachLine { println it }
file1.getText()
file1.length()

// 쓰기
file1.append("aa")
file1 << "aa"
file1.setText("aa")
file1.write("aa")

// 생성
file1.createNewFile()
dir1.mkdir()
dir1.mkdirs()
dir1.createTempDir()  // 스크립트 종료 시 자동 삭제

// 이름 변경 및 삭제
file1.renameTo('aa')
file1.delete()
dir2.deleteDir()
```

### 파일 필터링

```groovy
dir1.eachFileMatch(~/.*.groovy/) { println it }
dir1.eachFileRecurse { dir ->
    if (dir.isDirectory()) { }
}
```

### FileTree

```groovy
FileTree fTree = fileTree('dir1')
fTree.each { println it.name }

FileTree fTree1 = fileTree('dir1') {
    include '**/*.groovy'
}

FileTree fTree2 = fileTree(dir: 'dir1', excludes: ['**/*.groovy'])
```

### ZipTree

```groovy
FileTree jarFile = zipTree('SampleProject-1.0.jar')
jarFile.each { println it.name }
```

## 11. 예외 처리

```groovy
throw new GradleException("Error message")
```

## 12. GUI

```bash
gradle --gui
```

## 13. Maven에서 변환

```bash
gradle init --type pom
```

## 참고 자료

- [Gradle User Guide](https://docs.gradle.org/current/userguide/userguide.html)
- [Gradle DSL Reference](https://docs.gradle.org/current/dsl/)
