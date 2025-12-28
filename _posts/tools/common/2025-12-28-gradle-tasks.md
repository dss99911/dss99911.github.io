---
layout: post
title: "Gradle Task 완벽 가이드 - 생성부터 최적화까지"
date: 2025-12-28 12:05:00 +0900
categories: [tools, common]
tags: [gradle, task, build, automation]
description: "Gradle Task의 생성, 의존성 설정, 커스텀 Task 작성, 최적화 방법을 상세히 다룹니다."
---

Gradle Task는 빌드 프로세스의 기본 단위입니다. ANT의 target과 유사하며, 프로젝트 객체의 하위 객체입니다.

## 1. Task 기본 형식

### 기본 구조

```groovy
task hello {
    doLast {
        println 'Hello World'
    }
}

// String으로 이름 지정
task "hello" {
}

// 왼쪽 시프트 연산자 (deprecated)
task hello << {
    println 'Hello World'
}
```

### 프로그래매틱 생성

```groovy
project.tasks.create("copy", CopyTask.class)
```

## 2. 여러 Action 추가

```groovy
task sampleTask {
    println "Configuration"  // 항상 실행

    doFirst {
        println "First action"
    }

    doLast {
        println "Last action"
    }
}

// 나중에 추가
sampleTask.doFirst { println "Added first action" }
sampleTask.doLast { println "Added last action" }
```

실행 순서: `doFirst` (역순) -> `doLast` (순서대로)

## 3. Task 속성

```groovy
tasks        // 태스크 리스트
name         // 태스크 이름
path         // 태스크 경로
description  // 설명 (gradle tasks 출력 시 표시)
```

### 설명 추가

```groovy
task copy(type: Copy) {
    description 'Copies resources to target directory.'
    from 'resources'
    into 'target'
}
```

### 경로로 태스크 접근

```groovy
tasks.getByPath('projectA:hello').path
```

## 4. 의존성 설정

### 기본 의존성

```groovy
task taskX << {
    println 'taskX'
}

task taskY(dependsOn: 'taskX') << {
    println 'taskY'
}

// 여러 의존성
task task1(dependsOn: [task2, task3])
```

### 나중에 의존성 추가

```groovy
taskY.dependsOn taskX
taskY.dependsOn taskX, taskZ

// 기존 의존성 덮어쓰기
classes { dependsOn = [task1, task2] }

// 조건부 의존성
taskX.dependsOn {
    tasks.findAll { task -> task.name.startsWith('lib') }
}
```

## 5. Task 순서 제어

### finalizedBy

태스크 실행 후 다른 태스크 실행:

```groovy
task5.finalizedBy task6
```

### mustRunAfter

실행할 태스크가 있으면 반드시 그 후에 실행:

```groovy
task5.mustRunAfter task4
```

### shouldRunAfter

`mustRunAfter`와 유사하지만 순환 의존성 시 무시됨:

```groovy
task5.shouldRunAfter task4
```

## 6. Task 스킵

### enabled 속성

```groovy
sampleTask.enabled = false
```

### onlyIf 조건

```groovy
ext {
    environment = 'prod'
}

task prodTask << {
    println 'Executing prod tasks ' + environment
}

prodTask.onlyIf {
    project.hasProperty('environment') && project.environment == 'prod'
}
```

### StopExecutionException

```groovy
eclipse.doFirst {
    if (!usingEclipse) {
        throw new StopExecutionException()
    }
}
```

## 7. Task 최적화

입력과 출력이 변경되지 않으면 `UP-TO-DATE`로 스킵됩니다.

### 입출력 정의

```groovy
task updateExample {
    ext {
        propXml = file('PropDetails.xml')
    }
    File envFile = file('envproperty.txt')
    File sysFile = file('sysproperty.txt')

    inputs.file propXml
    outputs.files(envFile, sysFile)

    doLast {
        println "Generating Properties files"
        // 처리 로직
    }
}
```

### 최적화 무시

```bash
gradle --rerun-tasks taskName
```

## 8. 동적 Task (Rule)

```groovy
tasks.addRule("Pattern: sync<repoServer>") { String taskName ->
    if (taskName.startsWith("sync")) {
        task(taskName) << {
            println "Syncing from: " + (taskName - 'sync')
        }
    }
}
```

사용:

```bash
gradle syncProduction
gradle syncStaging
```

## 9. 내장 Task 타입

### Copy

```groovy
task copyTask(type: Copy) {
    from "."
    into "abc"
    include('employees.xml')
}

task copyWithRename(type: Copy) {
    from "."
    into "dir1"
    include('employees.xml')
    rename { String fileName ->
        fileName.replace("employees", "abc")
    }
}
```

### Zip

```groovy
task zipTask(type: Zip) {
    archiveName "sample.zip"
    from "src"
    destinationDir file("dest")
}
```

### Delete

```groovy
task clean(type: Delete) {
    delete rootProject.buildDir
}
```

### 태스크 내에서 copy

```groovy
variant.assemble.doLast {
    copy {
        from variant.mappingFile
        into "${rootDir}/mappingFiles"
        rename { String fileName ->
            "mapping-${variant.name}.txt"
        }
    }
}
```

## 10. Custom Task 생성

### 같은 빌드 스크립트 내

```groovy
class SampleTask extends DefaultTask {
    String systemName = "DefaultMachineName"
    String systemGroup = "DefaultSystemGroup"

    @TaskAction
    def action1() {
        println "System Name is " + systemName + " and group is " + systemGroup
    }

    @TaskAction
    def action2() {
        println 'Adding multiple actions'
    }
}

task hello(type: SampleTask)

hello {
    systemName = 'MyDevelopmentMachine'
    systemGroup = 'Development'
}

hello.doFirst { println "Executing first" }
hello.doLast { println "Executing last" }
```

실행 순서: `doFirst` -> `TaskAction` -> `doLast`

### buildSrc에서 정의

`{projectDir}/buildSrc/src/main/groovy/ch3/SampleTask.groovy`:

```groovy
package ch3

import org.gradle.api.DefaultTask
import org.gradle.api.tasks.TaskAction

class SampleTask extends DefaultTask {
    String systemName = "DefaultMachineName"

    @TaskAction
    def action() {
        println "System Name is " + systemName
    }
}
```

`build.gradle`:

```groovy
task hello(type: ch3.SampleTask) {
    systemName = 'MyMachine'
}
```

### 별도 프로젝트로 분리

`SampleTaskProj/build.gradle`:

```groovy
apply plugin: 'groovy'
version = 1.0

dependencies {
    compile gradleApi()
    compile localGroovy()
}
```

다른 프로젝트에서 사용:

```groovy
buildscript {
    repositories {
        flatDir { dirs "../SampleTaskProj/build/libs" }
    }
    dependencies {
        classpath group: 'ch3', name: 'SampleTaskProj', version: '1.0'
    }
}

task hello(type: ch3.SampleTask)
```

## 11. 명령어 실행

### exec

```groovy
exec {
    executable 'open'
    args '-a', 'Safari', "http://localhost:$debug_port"
}
```

### javaexec

```groovy
javaexec {
    main = "-jar"
    args = [
        "fitnesse-standalone.jar",
        "-c", "FrontPage?suite&format=text"
    ]
}

task runJar(dependsOn: jar) << {
    javaexec { main = "-jar"; args jar.archivePath }
}
```

## 12. Listener

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

## 13. 프로파일링

```bash
./gradlew assembleDebug --profile
```

결과: `build/reports/profile-[date-of-your-build]`

## 참고 자료

- [Gradle Task Documentation](https://docs.gradle.org/current/userguide/more_about_tasks.html)
- [Custom Tasks](https://docs.gradle.org/current/userguide/custom_tasks.html)
