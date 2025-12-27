---
layout: post
title: "Gradle Plugin - 플러그인, Extension, Property 설정"
date: 2025-12-28 14:30:00 +0900
categories: java
tags: [java, gradle, build-tool, plugin]
description: "Gradle 플러그인 사용법, 커스텀 플러그인 만들기, Extension과 Property 설정에 대해 알아봅니다."
---

# Gradle Plugin

플러그인은 태스크들의 집합입니다.

참고:
- [Writing Gradle Plugins](https://guides.gradle.org/writing-gradle-plugins/)
- [Custom Plugins](https://docs.gradle.org/current/userguide/custom_plugins.html)

## Script Plugins

로컬 경로 또는 원격 URL에서 불러올 수 있습니다.

### 로컬 경로

```groovy
apply from: 'other.gradle'
```

## Binary Plugins

```groovy
apply plugin: 'groovy'
```

### Community Plugin

```groovy
plugins {
    id "com.jfrog.bintray" version "0.4.1"
}
```

## Custom Plugins

### 같은 빌드 스크립트 내에서

```groovy
apply plugin: GreetingPlugin

class GreetingPlugin implements Plugin<Project> {
    void apply(Project project) {
        project.task('hello') << {
            println "Hello from the GreetingPlugin"
        }
    }
}
```

### buildSrc 사용

커스텀 태스크와 동일한 방식입니다.

```groovy
import ch4.FilePlugin
apply plugin: FilePlugin
```

### 다른 프로젝트에서 플러그인 사용

플러그인에 메타데이터가 있으므로 import 경로가 필요 없습니다.

```groovy
buildscript {
    repositories {
        flatDir { dirs "../Ch04_CustomPlugin3/build/libs/" }
    }
    dependencies {
        classpath group: 'ch4.custom.plugin', name: 'Ch04_CustomPlugin3', version: '1.0'
    }
}

apply plugin: 'fileplugin'

copy.doLast {
    println "This is from project $project.name"
}

filePluginExtension {
    sourceFile = "/home/user1"
}
```

### Plugin ID 정의

`src/main/resources/META-INF/gradle-plugins` 아래에 파일을 추가합니다.

파일명이 plugin ID가 됩니다 (예: `fileplugin.properties`). 퍼블리시하려면 이 plugin ID는 유니크해야 합니다.

```properties
implementation-class=ch4.custom.plugin.FilePlugin
```

---

# Extension

## Extension 설정 방법

```groovy
class FilePluginRootExtension {
    def sourceFile = "/home/tmp"
    def destinationFile
}

project.ext {
    greeting = new FilePluginRootExtension()
}

ext {
    greeting = new FilePluginRootExtension()
}

ext.greeting = new FilePluginRootExtension()
```

### 태스크에 Extension 추가

```groovy
task sampleTask1 {
    description = "This is task level description"

    ext {
        taskDetail = " This is custom property of task1"
    }
}
```

### 문자열 이름으로 Extension 추가

```groovy
project.extensions.create("greeting", GreetingPluginExtension)

class GreetingPluginExtension {
    def String message = 'Hello from GreetingPlugin'
}

println project.greeting.message

apply plugin: GreetingPlugin

greeting.message = 'Hi from Gradle'

class GreetingPlugin implements Plugin<Project> {
    void apply(Project project) {
        // Add the 'greeting' extension object
        project.extensions.create("greeting", GreetingPluginExtension)

        // Add a task that uses the configuration
        project.task('hello') << {
            println project.greeting.message
        }
    }
}

class GreetingPluginExtension {
    def String message = 'Hello from GreetingPlugin'
}
```

---

# Property

`gradle.properties`는 Gradle 실행 전에 사용됩니다.

## Daemon 프로세스 설정

```properties
org.gradle.daemon=true
```

## 메모리 설정

```properties
org.gradle.daemon=false
org.gradle.jvmargs=-Xmx256m
```

## ext closure

프로젝트 레벨의 커스텀 속성을 정의합니다.

## gradle.properties

### 글로벌 위치

```
<USER_HOME>/.gradle/gradle.properties
```

모든 Gradle 스크립트 실행 시 적용됩니다. 보통 비밀번호 저장에 사용됩니다.

### 프로젝트 위치

```
<ProjectDir>/gradle.properties
```

## 커스텀 Properties 파일

```groovy
task showCustomProp << {
    Properties props = new Properties()
    props.load(new FileInputStream("login.properties"))
    println props
    println props.get('loginKey1')
}
```

## 전체 예제

### `<USER_HOME>/.gradle/gradle.properties`

```properties
globalProp1=globalVal1
globalProp2=globalVal2
```

### `Chapter6/PropertyExample/Proj1/gradle.properties`

```properties
Proj1Prop1=Proj1Val1
Proj1Prop2=Proj1Val2
systemProp.sysProp1=sysVal1
```

### `Chapter6/PropertyExample/Proj1/build.gradle`

```groovy
task showProps << {
    println "local property " + Proj1Prop1
    println "local property " + Proj1Prop2
    println "local property via command line: " + projCommandProp1
    println "global property " + globalProp1
    println "global property " + globalProp2
    println "System property " + System.properties['sysProp1']
    println "System property via command line: " + System.properties['sysCommandProp1']
}
```

### 실행

```bash
$ gradle -PprojCommandProp1=projCommandVal1 -DsysCommandProp1=sysCommandVal1 showProps
```

출력:

```
:showProps
local property Proj1Val1
local property Proj1Val2
local property via command line: projCommandVal1
global property globalVal1
global property globalVal2
System property sysVal1
System property via command line: sysCommandVal1
BUILD SUCCESSFUL
```

---

# Configuration

Java 플러그인은 기본적으로 소스 파일이 `src/main/java`에 있다고 가정합니다.

태스크 실행을 위한 구성을 의미합니다. IDE에서 앱 실행 시 configuration을 설정해서 실행하면 해당 환경에서 실행됩니다.

## Dependency Configuration

의존성을 그룹화합니다. 각 configuration은 각 부분에서 작동합니다:
- compile
- runtime
- etc...

### Custom Dependency Configuration

```groovy
apply plugin: 'java'

version = 1.0

configurations {
    customDep
}

repositories {
    mavenCentral()
}

dependencies {
    customDep group: 'junit', name: 'junit', version: '4.11'
    compile group: 'log4j', name: 'log4j', version: '1.2.16'
}

task showCustomDep << {
    FileTree deps = project.configurations.customDep.asFileTree
    deps.each { File file ->
        println "File names are " + file.name
    }
}
```

### Custom Configuration으로 src zip 파일 업로드

```groovy
apply plugin: 'java'

archivesBaseName = "MySampleZip"  // jar 이름 커스터마이즈
version = 1.0

configurations {
    zipAsset
}

repositories {
    mavenCentral()
}

task zipSrc(type: Zip) {
    from 'src'
}

artifacts {
    zipAsset zipSrc
}

uploadZipAsset {
    repositories {
        flatDir { dirs "./temp1" }
    }
}
```
