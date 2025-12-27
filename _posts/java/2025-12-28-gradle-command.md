---
layout: post
title: "Gradle Command - 명령줄, Wrapper, 멀티 프로젝트"
date: 2025-12-28 15:00:00 +0900
categories: java
tags: [java, gradle, build-tool, command, wrapper]
description: "Gradle 명령줄 옵션, Wrapper, 멀티 프로젝트 설정, 커맨드 실행에 대해 알아봅니다."
---

# Command Line & Property

## 특정 빌드 스크립트 파일 실행

- `-b`: 빌드 스크립트 파일 지정

```bash
gradle -b apple.gradle
```

## Log 옵션

| 옵션 | 설명 |
|------|------|
| `-d` 또는 `--debug` | 가장 상세한 로그 레벨 |
| `-i` 또는 `--info` | Info 레벨 |
| `-S` 또는 `--full-stacktrace` | 전체 스택 트레이스 |
| `-s` 또는 `--stacktrace` | 스택 트레이스 |
| `-q` 또는 `--quiet` | 에러 로그만 출력 |

## Daemon Process

| 옵션 | 설명 |
|------|------|
| `--daemon` | 현재 기본값 |
| `--stop` | daemon 중지 |
| `--no-daemon` | daemon 없이 실행 |

```bash
gradle --stop

gradle -b sample_build.gradle failedtask --continue test --daemon

# daemon 프로세스 확인
ps -ef | grep gradle
```

## Task 관련

### 태스크 보기

```bash
gradle tasks
```

### 태스크 실행 순서 보기

`--dry-run` 또는 `-m`: 초기화와 설정만 실행하고 실제 실행은 하지 않음

```bash
gradle --dry-run failedTask test --continue
```

### 태스크 실행

build.gradle이 있는 폴더로 이동:

```bash
gradle hello

# 여러 태스크 실행
gradle hello hello2
```

### 축약 이름으로 태스크 실행

태스크 이름이 sampleTask1, sampleTask2인 경우:

```bash
gradle -q -b build_ordering.gradle sT1 sT2
```

### 태스크 에러 처리

| 옵션 | 설명 |
|------|------|
| 기본 | 태스크 실패 시 다음 태스크 중지 |
| `--continue` | 태스크 실패해도 다음 태스크 계속 실행 |
| 의존 태스크 실패 | 의존 태스크가 실패하면 해당 태스크는 호출되지 않고 다음 태스크 실행 |
| `-x` 또는 `--exclude-task` | 태스크 제외 |

```bash
gradle -b sample_build.gradle failedTask --continue test -x helloGradle
```

출력:
```
:failedTask FAILED
:test
Test case executed
```

## Property 설정

### 명령줄로 Property 설정

| 옵션 | 설명 |
|------|------|
| `-P<property-name>=<value>` | 프로젝트 property (기존 property 대체 가능) |
| `-D<property-name>=<value>` | 시스템 property |

```bash
gradle -b build_condition.gradle -Penvironment=qa qaTask prodTask
```

### 스크립트에서 시스템 Property 설정

```groovy
System.setProperty("kotlin.compiler.execution.strategy", "in-process")  // For debugging
```

## Task Optimization 무시

`--rerun-tasks`:

```bash
gradle -b build_optimization.gradle updateExample --rerun-tasks
```

---

# Gradle Wrapper

## Wrapper 생성

```bash
gradle wrapper
```

## Wrapper 업데이트

wrapper를 다시 실행하거나 `/gradle/gradle.properties`에서 distributor 버전 변경

### 특정 버전으로 업데이트

```bash
./gradlew wrapper --gradle-version=6.7
```

---

# Execute Command

## exec

```groovy
exec {
    executable 'open'
    args '-a',
         'Safari',
         "http://localhost:$debug_port"
}

exec {
    executable 'phantomjs'
    args '--config=config.json',
         "--remote-debugger-port=$debug_port",
         '--remote-debugger-autorun=true',
         'index.js'
}
```

## javaexec

```groovy
javaexec {
    main = "-jar";
    args = [
        "C:/Users/nwuser/FitNesse/fitnesse-standalone.jar",
        "-c",
        "FrontPage?suite&format=text"
    ]
}

task runJar(dependsOn: jar) << {
    javaexec { main = "-jar"; args jar.archivePath }
}
```

---

# Sub projects (멀티 프로젝트)

트리 구조가 가능합니다.

## 프로젝트 목록 보기

```bash
gradle projects
```

## settings.gradle

`rootDir/settings.gradle`:

```groovy
include ':app', ':aws-android-sdk-kinesis', ':eversafe_android_library-0.10.29'
include 'subproject:subsubproject'
```

## Properties Dependency

다른 서브 프로젝트의 property 가져오기:

```groovy
evaluationDependsOn(':profile')
```

## Library Dependency

```groovy
dependencies {
    compile project(':profile')
}
```

---

# Module (프로젝트 추가)

## 모듈 포함

```groovy
project(':library').projectDir = new File(settingsDir, '../AndroidLibrary/androidlibrary')

// IDE: go to module setting -> dependencies -> add module
```

**주의**: 모듈명에 `-`는 추가하지 않습니다.

---

# Method

```groovy
allprojects { }

subprojects { }
```

---

# Convert from Maven

Maven에서 Gradle로 변환:

```bash
gradle init --type pom
```

---

# Exception

Gradle 빌드를 중지시키려면:

```groovy
throw new GradleException("android-aspectjx: The 'com.android.application' or 'com.android.library' plugin is required.")
```

---

# File 처리

```groovy
File file1 = file("readme.txt")
println file1  // print name

// 읽기
file1.eachLine {
    println it  // print content line by line
}
file1.getText()  // read contents
file1.length()   // file length

// 쓰기
file1.append("aa")     // append on the end
file1 << "aa"          // append on the end
file1.setText("aa")    // overwrite contents
file1.write("aa")      // overwrite contents. if there is no file, create automatically

// 파일 생성
file1.createNewFile()  // create empty file
dir1.mkdir()
dir1.mkdirs()
dir1.createTempDir()   // deleted automatically after script execution is completed

file1.renameTo('aa')

// 파일 삭제
file1.delete()
dir2.deleteDir()

// 파일 필터링
dir1.eachFileMatch(~/.*.groovy/) {
    println it
}
dir1.eachFileRecurse { dir -> if (dir.isDirectory()) {} }  // recursively search
```

## FileTree

```groovy
task fileTreeSample << {
    FileTree fTree = fileTree('dir1')
    fTree.each {
        println it.name
    }

    FileTree fTree1 = fileTree('dir1') {
        include '**/*.groovy'
    }
    println ""
    fTree1.each {
        println it.name
    }

    println ""
    FileTree fTree2 = fileTree(dir: 'dir1', excludes: ['**/*.groovy'])
    fTree2.each {
        println it.absolutePath
    }
}
```

## ZipTree

zip 내부 파일 읽기:

```groovy
FileTree jarFile = zipTree('SampleProject-1.0.jar')
jarFile.each {
    println it.name
}
```
