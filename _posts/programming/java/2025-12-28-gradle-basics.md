---
layout: post
title: "Gradle 기초 - 생명주기, 용어, 프로젝트 구조"
date: 2025-12-28 14:00:00 +0900
categories: [programming, java]
tags: [java, gradle, build-tool]
description: "Gradle의 기본 개념, 생명주기(Life Cycle), 용어, 프로젝트 구조를 알아봅니다."
image: /assets/images/posts/thumbnails/2025-12-28-gradle-basics.png
---

# Gradle 기초

Gradle은 Groovy 기반의 빌드 자동화 도구입니다. 절차적 프로그래밍이 가능하고 Java와 유사한 문법을 사용합니다.

## Life Cycle (생명주기)

Gradle의 빌드 생명주기는 세 단계로 구성됩니다:

```
Initialization -> Configuration -> Execution
```

### Initialization (초기화)

- 어떤 프로젝트들이 빌드에 참여할지 결정하고 Project 인스턴스를 생성합니다.
- 초기화 스크립트 실행 순서:
  1. `<USER_HOME>/.gradle/init.d` 아래의 모든 `.gradle` 파일
  2. `<USER_HOME>/.gradle/init.gradle`
  3. `<GRADLE_HOME>/init.d/` 아래의 `.gradle` 확장자 파일들
  4. `-I <file>` 또는 `--init-script <file>` 옵션으로 지정한 파일
- 서브프로젝트 추가

### Configuration (설정)

- Directed Acyclic Graph (DAG)가 생성됩니다.
  - Gradle이 태스크 의존성 그래프를 설정합니다.
  - 태스크가 다른 태스크에 직접 의존합니다.
  - acyclic: 순환 의존성을 허용하지 않습니다 (A 태스크가 B에 의존하고, B 태스크가 A에 의존하는 것은 불가)
- 프로젝트 객체를 설정합니다.
- configuration 블록이 실행됩니다.
- 태스크가 실행되지 않더라도 모든 태스크의 configuration은 실행됩니다.

### Execution (실행)

- 태스크를 실행합니다.

## 용어 (Terminology)

### 기본 용어

- **transitive dependencies**: 내 프로젝트의 라이브러리가 의존하는 라이브러리

### Configuration

어떤 환경(상황)에서 사용할지를 정의합니다. 어떤 디펜던시를 어떤 환경에서 사용하는가를 정의합니다.

- `compile`
- `implementation`
- `runtimeOnly`
- `kapt`

### Compilation

- `main`
- `test`

### Target

- `jvm`
- `js`

### SourceSet

- target + compilation (예: jvmMain, jvmTest)

### Attribute

여러 variant 중 어떤 variant를 선택할지 disambiguate rule을 가지고 있습니다.

```groovy
attribute(KotlinPlatformType.attribute, KotlinPlatformType.jvm)
attribute(Usage.USAGE_ATTRIBUTE, objects.named(Usage::class.java, Usage.JAVA_RUNTIME))
attribute(TargetJvmVersion.TARGET_JVM_VERSION_ATTRIBUTE, ...)
```

참고: [Variant Attributes](https://docs.gradle.org/current/userguide/variant_attributes.html)

### Variant

- debug, release 등
- 참고: [Variant Model](https://docs.gradle.org/current/userguide/variant_model.html#sec:variant-aware-matching)

## Project

### 프로젝트 보기

```bash
gradle -q projects
```

프로젝트 내에 프로젝트가 올 수 있습니다 (트리 구조).

### Project Properties

프로젝트 스코프에서는 `project.`를 생략할 수 있습니다.

| Property | Description |
|----------|-------------|
| `project` | project 객체 |
| `project.name` | 프로젝트 이름 (default: 부모 디렉토리 이름) |
| `project.path` | 프로젝트 경로 |
| `project.version` | 버전 |
| `project.description` | 설명 |
| `project.parent` | 부모 프로젝트 |
| `projectDir` | 프로젝트 디렉토리 File 객체 |
| `buildDir` | projectDir/build |
| `rootProject` | 루트 프로젝트 |

### ext로 프로젝트 속성 추가

```groovy
project.ext {
    testVersion = '1.8.9'
}
println project.testVersion
```

## Path

경로는 `:`로 시작합니다.

```groovy
:hello              // task hello
:projectA:hello     // projectA의 hello
```

## Log

로그 레벨 (위에서 아래로 더 상세):

```groovy
logger.error "a"
logger.quiet "a"
logger.warn "a"
logger.lifecycle "a"  // (default)
logger.info "a"       // (not shown on default)
logger.debug "a"
```

태스크 내에서 로그 사용:

```groovy
task.project.logger.warn("${task.path} spend ${ms}ms")
println "Task spend time:"
```

로그 옵션:

```bash
gradle showLogging -q  # quiet
gradle showLogging -d  # debug. all the log
gradle showLogging -s  # stack trace for exceptions
gradle showLogging -S  # full stack trace
```

## Output

기본 출력:

```groovy
println 'Hello'
```

## GUI

GUI 실행:

```bash
gradle --gui
```

## Listener

빌드 및 태스크 이벤트를 리스닝할 수 있습니다.

```groovy
project.gradle.addListener(new TimeTrace())

class TimeTrace implements TaskExecutionListener, BuildListener {
    private Clock clock
    private times = []

    @Override
    void buildStarted(Gradle gradle) {}

    @Override
    void settingsEvaluated(Settings settings) {}

    @Override
    void projectsLoaded(Gradle gradle) {}

    @Override
    void projectsEvaluated(Gradle gradle) {}

    @Override
    void buildFinished(BuildResult result) {
        println "Task spend time:"
        for (time in times) {
            if (time[0] > 50) {
                printf "%7sms   %s\n", time
            }
        }
    }

    @Override
    void beforeExecute(Task task) {
        clock = new Clock()
    }

    @Override
    void afterExecute(Task task, TaskState state) {
        def ms = clock.timeInMs
        times.add([ms, task.path])
        task.project.logger.warn("${task.path} spend ${ms}ms")
    }
}
```

## 실행 순서 예제

project configuration -> task configuration -> execute task

```groovy
// Section 1: Project object existing properties
version = '1.0'
description = 'Sample Java Project'

// Section 2: Project level custom properties
ext {
    startDate = "Jan 2015"
}
ext.endDate = "Dec 2015"
println "This is project configuration part, description is $description"

// Section 3: Task
task sampleTask1 {
    // Section 3.1: Task existing properties
    description = "This is task level description"

    // Section 3.2: Task level custom properties
    ext {
        taskDetail = " This is custom property of task1"
    }
    println "This is sampleTask1 configuration statements, taskDetail is $taskDetail"

    // Section 3.3: Task actions
    doFirst {
        println "Project name is $project.name, description is $project.description"
        println "Task name is $name, description is $description"
        println "Project start date is $startDate"
    }
    doLast {
        println "Project endDate is $endDate"
    }
}

// Section 4: Task
task sampleTask2 {
    println "This is sampleTask2 configuration statements"
    doFirst {
        println "Task getProjectDetailsTask properties are: " + sampleTask1.taskDetail
    }
}
```
