---
layout: post
title: "Gradle Java Build - 자바 프로젝트 빌드, 테스트, JAR, WAR"
date: 2025-12-28 14:40:00 +0900
categories: java
tags: [java, gradle, build-tool, jar, war, test]
description: "Gradle로 Java 프로젝트를 빌드하고 테스트하는 방법, JAR/WAR 생성, Scala 프로젝트 빌드에 대해 알아봅니다."
---

# Java Plugin

Java 플러그인은 Gradle 코어 API의 일부로, Java 코드 컴파일, 테스트, 바이너리 조립 등의 태스크를 지원합니다. Convention over Configuration을 지원하여 기본 설정을 그대로 사용하면 코드를 적게 작성해도 됩니다.

```groovy
apply plugin: 'java'
```

## Build 명령어

build 태스크는 java 플러그인에 포함되어 있습니다.

```bash
gradle build
```

### 'build' 태스크 DAG (Directed Acyclic Graph)

```
:compileJava          // main의 class 파일 생성
:processResources NO-SOURCE
:classes              // main의 classes 조립
:jar UP-TO-DATE       // jar 파일 생성
:assemble UP-TO-DATE
:compileTestJava NO-SOURCE
:processTestResources NO-SOURCE
:testClasses UP-TO-DATE
:test NO-SOURCE
:check UP-TO-DATE
:build UP-TO-DATE
```

## 기본 설정

- 소스 코드 위치
- 컴파일된 class 파일 위치
- jar 명명 규칙

### 커스텀 소스 경로

기본값: `src/main/java`

```groovy
apply plugin: 'java'

sourceSets {
    main {
        java {
            srcDir 'src'
        }
    }
    test {
        java {
            srcDir 'test'
        }
    }
}
```

### 버전 및 호환성

```groovy
version = 0.1.0
sourceCompatibility = 1.8
```

### Main Class 설정

```groovy
apply plugin: 'java'

jar {
    manifest {
        attributes 'Main-Class': 'com.example.main.Application'
    }
}
```

## Java Plugin Conventions

```groovy
task displayJavaPluginConvention << {
    println "Lib Directory: $libsDir"
    println "Lib Directory Name: $libsDirName"
    println "Reports Directory: $reportsDir"
    println "Test Result Directory: $testResultsDir"

    println "Source Code in two sourcesets: $sourceSets"
    println "Production Code: ${sourceSets.main.java.srcDirs}"
    println "Test Code: ${sourceSets.test.java.srcDirs}"
    println "Production code output: ${sourceSets.main.output.classesDir} & ${sourceSets.main.output.resourcesDir}"
    println "Test code output: ${sourceSets.test.output.classesDir} & ${sourceSets.test.output.resourcesDir}"
}
```

출력:

```
Lib Directory: <path>/build/libs
Lib Directory Name: libs
Reports Directory: <path>/build/reports
Test Result Directory: <path>/build/test-results
Source Code in two sourcesets: [source set 'main', source set 'test']
Production Code: [<path>/src/main/java]
Test Code: [<path>/src/test/java]
Production code output: <path>/build/classes/main & <path>/build/resources/main
Test code output: <path>/build/classes/test & <path>/build/resources/test
```

## Configuration 커스터마이징

```groovy
buildDir = 'buildfolder'
libsDirName = 'libfolder'

sourceSets {
    main {
        java {
            srcDir 'src/productioncode/java'
        }
        resources {
            srcDir 'src/productioncode/resources'
        }
    }
    test {
        java {
            srcDir 'src/testcode/java'
        }
        resources {
            srcDir 'src/testcode/resources'
        }
    }
}

testResultsDirName = "$buildDir/new-test-result"
sourceSets.main.output.classesDir "${buildDir}/classes/productioncode/java"
sourceSets.main.output.resourcesDir "${buildDir}/classes/productioncode/resources"
sourceSets.test.output.classesDir "${buildDir}/classes/testcode/java"
sourceSets.test.output.resourcesDir "${buildDir}/classes/testcode/resources"
```

---

# JAR

## Archive 이름 변경

```groovy
jar {
    archiveName = "kim.jeonghyeon.web.home.jar"
}
```

---

# Test

JUnit 또는 TestNG를 지원합니다.

```groovy
dependencies {
    testCompile 'junit:junit:4.12'
}
```

## 병렬 테스트

```groovy
test {
    maxParallelForks = 3
}
```

- `forkEvery`: 숫자만큼의 클래스마다 새 프로세스를 생성 (default: 0, unlimited)
- `maxParallelForks`: 최대 동시 실행 프로세스 수 (default: 1)

```groovy
test {
    ignoreFailures = true
    maxParallelForks = 3
    forkEvery = 1
}
```

## 테스트 필터링

```groovy
test {
    filter {
        // 1: execute only login test cases
        includeTestsMatching "ch6.login.*"

        // 2: include all test cases matching *Test
        includeTestsMatching "*Test"

        // 3: include all integration tests having 1 in their name
        includeTestsMatching "*1"

        // 4: Other way to include/exclude packages
        include "ch6/profile/**"
    }
}
```

---

# WAR

```groovy
apply plugin: 'war'

repositories {
    mavenCentral()
}

dependencies {
    // provided: 라이브러리가 포함되지 않음 (Tomcat에서 제공하므로 필요 없음)
    providedCompile "javax.servlet:servlet-api:2.5"
    compile("commons-io:commons-io:2.4")
    compile 'javax.inject:javax.inject:1'
}

// 디렉토리 변경
webAppDirName = "WebContent"

war {
    baseName = "simpleapp"
    version = "1.0"
    extension = "war"

    // default is true
    includeEmptyDirs = false
}
```

---

# Report

각 태스크별 경과시간 확인하기:

```bash
gradlew assembledebug --profile
```

리포트 위치: `build/reports/profile-[date-of-your-build]`

---

# Scala

Java와 유사한 Convention을 사용합니다 (소스 경로 등).

```groovy
apply plugin: 'java'
apply plugin: 'scala'
apply plugin: 'eclipse'

version = '1.0'

jar {
    manifest {
        attributes 'Implementation-Title': 'ScalaApplication',
                   'Implementation-Version': version
    }
}

repositories {
    mavenCentral()
}

dependencies {
    compile('org.scala-lang:scala-library:2.11.6')
    runtime('org.scala-lang:scala-compiler:2.11.6')
    compile('org.scala-lang:jline:2.9.0-1')
}

task displayScalaPluginConvention << {
    println "Lib Directory: $libsDir"
    println "Lib Directory Name: $libsDirName"
    println "Reports Directory: $reportsDir"
    println "Test Result Directory: $testResultsDir"

    println "Source Code in two sourcesets: $sourceSets"
    println "Production Code: ${sourceSets.main.java.srcDirs}, ${sourceSets.main.scala.srcDirs}"
    println "Test Code: ${sourceSets.test.java.srcDirs}, ${sourceSets.test.scala.srcDirs}"
    println "Production code output: ${sourceSets.main.output.classesDir} & ${sourceSets.main.output.resourcesDir}"
    println "Test code output: ${sourceSets.test.output.classesDir} & ${sourceSets.test.output.resourcesDir}"
}
```

## Main 실행

```groovy
task runMain(type: JavaExec) {
    main = 'ch6.HelloScala'
    classpath = configurations.runtime + sourceSets.main.output + sourceSets.test.output
}
```

실행:

```bash
gradle runMain
```
