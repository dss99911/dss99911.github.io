---
layout: post
title: "Gradle Task - 태스크 정의, 의존성, 커스텀 태스크"
date: 2025-12-28 14:10:00 +0900
categories: [programming, java]
tags: [java, gradle, build-tool, task]
description: "Gradle Task의 정의, 의존성 관리, 커스텀 태스크 만들기, 태스크 타입에 대해 알아봅니다."
---

# Gradle Task

Task는 ANT의 target과 유사하며, project 객체의 하위 객체입니다. 태스크를 호출하면 서브 프로젝트에 동일한 태스크가 있는 경우 서브 프로젝트의 태스크도 함께 호출됩니다.

## Task 정의하기

### 기본 형식

```groovy
task hello {
    doLast {
        println 'tutorialspoint'
    }
}
```

### Deprecated 방식 (<< 연산자)

```groovy
// In Groovy, << is the left shift operator to append elements to a list:
// this is deprecated.
task hello << {
    println 'tutorialspoint'
}
```

### 문자열 이름으로 정의

```groovy
task "hello" {
}
```

### 프로그래밍 방식으로 태스크 추가

```groovy
project.tasks.create("copy", CopyTask.class)
```

## 여러 액션 추가하기

등록된 모든 액션이 호출됩니다.

```groovy
task sampleTask2 {
    println "This is sampleTask2 configuration statements"

    doFirst {
        println "Task getProjectDetailsTask properties are: " + sampleTask1.taskDetail
    }
}

sampleTask2.doFirst { println "Actions added separately" }
sampleTask2.doLast { println " More Actions added " }
sampleTask2.doFirst { println "Actions added separately2" }
sampleTask2.doLast { println " More Actions added 2" }
```

## Task Properties

| Property | Description |
|----------|-------------|
| `tasks` | 태스크 목록 |
| `name` | 태스크 이름 |
| `path` | 태스크 경로 |
| `description` | 태스크 설명 (gradle tasks 명령어에서 표시됨) |

```groovy
task copy(type: Copy) {
    description 'Copies the resource directory to the target directory.'
    from 'resources'
    into 'target'
    include('**/*.txt', '**/*.xml', '**/*.properties')
    println("description applied")
}
```

## Task Methods

### getByPath

```groovy
tasks.getByPath('projectA:hello').path
```

## Task Dependencies (의존성)

### 기본 의존성 정의

```groovy
task taskX << {
    println 'taskX'
}

task taskY(dependsOn: 'taskX') << {
    println "taskY"
}

task task1(dependsOn: [task2, task3])
```

실행:
```bash
gradle -q taskY
```

### 나중에 의존성 추가

```groovy
task taskY << {
    println 'taskY'
}

task taskX << {
    println 'taskX'
}

taskY.dependsOn taskX
taskY.dependsOn taskX, taskZ

// exclusively override existing dependencies
// this ignores compileJava task.
classes {
    dependsOn = [task1, task2]
}
```

### 동적 의존성

```groovy
taskX.dependsOn {
    tasks.findAll {
        task -> task.name.startsWith('lib')
    }
}
```

## Task 건너뛰기

### enabled 속성

```groovy
sampleTask12.enabled = false  // configuration scope
```

### 조건부 건너뛰기

```groovy
ext {
    environment = 'prod'
    // can set this value from property file or command line using -Pname=value option
}

task prodTask << {
    println 'Executing prod tasks ' + environment
}
prodTask.onlyIf { project.hasProperty('environment') && project.environment == 'prod' }

task qaTask << {
    println 'Executing qa tasks ' + environment
}
qaTask.onlyIf { project.hasProperty('environment') && project.environment == 'qa' }
```

### closure로 조건 지정

```groovy
// #1st approach - closure returning true, if the task should be executed, false if not.
eclipse.onlyIf {
    project.hasProperty('usingEclipse')
}

// #2nd approach - alternatively throw an StopExecutionException() like this
// this stops only the task.
eclipse.doFirst {
    if (!usingEclipse) {
        throw new StopExecutionException()
    }
}
```

## Task Optimization

입력과 출력이 변경되지 않으면 태스크는 'UP-TO-DATE'로 표시되어 실행되지 않습니다. 입력과 출력이 있는 경우에만 작동합니다.

출력이 없는 경우 `TaskOutputs.upToDateWhen()` 또는 `outputs.upToDateWhen`을 사용합니다.

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
        def properties = new XmlParser().parse(propXml)
        properties.property.each { property ->
            def fileName = property.filedetail[0].name[0].text()
            def key = property.filedetail[0].key[0].text()
            def value = property.filedetail[0].value[0].text()
            def destFile = new File("${fileName}")
            destFile.text = "$key = ${value}\n"
        }
    }
}
```

## Task Order (순서)

- **finalizedBy**: 태스크 실행 후 다른 태스크를 실행합니다.
- **mustRunAfter**: 실행할 태스크가 있으면 해당 태스크 이후에 실행됩니다. 없으면 실행되지 않습니다.
- **shouldRunAfter**: mustRunAfter와 동일하지만, 순환 의존성이 있으면 이 순서를 무시합니다.

```groovy
(1..6).each {
    task "sampleTask$it" << {
        println "Executing $name"
    }
}

sampleTask1.dependsOn sampleTask2
sampleTask3.dependsOn sampleTask2
sampleTask5.finalizedBy sampleTask6
sampleTask5.mustRunAfter sampleTask4
```

## Rule: Dynamic Task

태스크가 없을 때 rule을 호출하고, rule이 태스크를 정의하여 호출합니다. 변수 값이 있을 때, 태스크 이름 뒤에 값을 넣는 방식으로 사용됩니다.

```groovy
tasks.addRule("Pattern: sync<repoServer>") { String taskName ->
    if (taskName.startsWith("sync")) {
        task(taskName) << {
            println "Syncing from repository: " + (taskName - 'sync')
        }
    }
}
```

```bash
gradle -b build_rule.gradle tasks
```

출력:
```
Rules
-----
Pattern: clean<TaskName>: Cleans the output files of a task.
Pattern: build<ConfigurationName>: Assembles the artifacts of a configuration.
Pattern: upload<ConfigurationName>: Assembles and uploads the artifacts belonging to a configuration.
Pattern: sync<repoServer>
```

## Task 구조

모든 태스크의 configuration이 먼저 실행되고, 그 다음 doFirst -> doLast 순서로 실행됩니다.

```groovy
task A {
    println 'A config'
    doFirst {
        println 'A do First'
        throw new StopExecutionException()
    }
    doLast {
        println 'A do Last'
    }
}

task B(dependsOn: 'A') {
    println 'B config'
    doFirst {
        println 'B do First'
    }
    doLast {
        println 'B do Last'
    }
}
```

실행 결과:
```
A config
B config
A do First
A do Last
B do First
B do Last
```

---

# Custom Task (커스텀 태스크)

## @TaskAction

doFirst -> TaskAction -> doLast 순서로 실행됩니다.

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
        println 'Adding multiple actions for refactoring'
    }
}

task hello(type: SampleTask)

hello {
    systemName = 'MyDevelopmentMachine'
    systemGroup = 'Development'
}

hello.doFirst { println "Executing first statement " }
hello.doLast { println "Executing last statement " }
```

## buildSrc: 별도 파일에 커스텀 태스크 정의

buildSrc는 gradle 빌드용 소스입니다. 같은 프로젝트나 서브프로젝트에서만 사용할 수 있습니다.

`{projectDir}/buildSrc/src/main/groovy/ch3/SampleTask.groovy`:

```groovy
package ch3

import org.gradle.api.DefaultTask
import org.gradle.api.tasks.TaskAction

class SampleTask extends DefaultTask {
    String systemName = "DefaultMachineName"
    String systemGroup = "DefaultSystemGroup"

    @TaskAction
    def action1() {
        println "System Name is " + systemName + " and group is " + systemGroup
    }

    @TaskAction
    def action2() {
        println 'Adding multiple actions for refactoring'
    }
}
```

`{projectDir}/build.gradle`:

```groovy
task hello(type: ch3.SampleTask)

hello {
    systemName = 'MyDevelopmentMachine'
    systemGroup = 'Development'
}

hello.doFirst { println "Executing first statement " }
hello.doLast { println "Executing last statement " }
```

## 독립 태스크 (다른 프로젝트에서 사용)

`build.gradle`:

```groovy
apply plugin: 'groovy'
version = 1.0

dependencies {
    compile gradleApi()
    compile localGroovy()
}
```

빌드 후 다른 프로젝트에서 사용:

```groovy
buildscript {
    repositories {
        // relative path of sampleTaskProject jar file
        flatDir { dirs "../SampleTaskProj/build/libs" }
    }
    dependencies {
        classpath group: 'ch3', name: 'SampleTaskProj', version: '1.0'
    }
}

task hello(type: ch3.SampleTask)
```

---

# Task Types (태스크 타입)

`from`, `into` 등은 모두 클래스 내부의 메서드입니다. 따라서 액션 전에 configuration을 설정합니다.

## Copy

```groovy
task copyTask(type: Copy) {
    from "."
    into "abc"
    include('employees.xml')
}
```

### 이름 변경

```groovy
task copyWithRename(type: Copy) {
    from "."
    into "dir1"
    include('employees.xml')
    rename { String fileName ->
        fileName.replace("employees", "abc")
    }
}
```

## Zip

```groovy
task zipTask(type: Zip) {
    File destDir = file("dest")
    archiveName "sample.zip"
    from "src"
    destinationDir destDir
}
```

## Delete

```groovy
task clean(type: Delete) {
    delete rootProject.buildDir
}
```

## 태스크 내부에서 copy 사용

```groovy
if (variant.getBuildType().isMinifyEnabled()) {
    variant.assemble.doLast {
        copy {  // clear project하면 사라지니까 복사
            from variant.mappingFile
            into "${rootDir}/mappingFiles"
            rename { String fileName ->
                "mapping-${variant.name}${data}.txt"
            }
        }
    }
}
```
