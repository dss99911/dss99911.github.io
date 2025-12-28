---
layout: post
title: "Gradle Dependency - 의존성 관리, 버전 충돌, 캐시"
date: 2025-12-28 14:20:00 +0900
categories: [programming, java]
tags: [java, gradle, build-tool, dependency]
description: "Gradle 의존성 관리, 버전 충돌 해결, transitive dependency, 캐시 관리에 대해 알아봅니다."
---

# Gradle Dependency

## 디펜던시 트리 보기

app 프로젝트의 디펜던시 트리 보기:

```bash
gradlew app:dependencies
```

특정 디펜던시 버전 확인하기:

```bash
./gradlew -q dependencies app:dependencies | grep 'com.squareup.okhttp.*' -o | sort -u
```

## Compile과 Implementation의 차이

| Configuration | Second-level 의존성 사용 |
|--------------|------------------------|
| `compile` (deprecated) | 사용 가능 |
| `implementation` | 사용 불가 |
| `api` | compile과 동일하게 사용 가능 |

## 의존성 종류

```groovy
dependencies {
    <configuration name> <dependencies>
}
```

### Configuration별 의존성 보기

```bash
gradle -b build_depreport.gradle dependencies
gradle -b build_depreport.gradle dependencies --configuration compile

# 어떤 의존성이 다른 의존성에 의존하는지 확인
gradle -b build_depreport.gradle dependencyInsight --dependency commons-logging --configuration runtime
```

## 의존성 Scope 종류

| Scope | 설명 |
|-------|------|
| **api** | 컴파일 및 런타임에 사용되며 라이브러리 소비자에게 노출됨. 현재 모듈의 public API에서 의존성 타입을 사용하면 api로 지정 |
| **implementation** | 컴파일 및 런타임에 현재 모듈에서 사용되지만, 다른 모듈의 컴파일에는 노출되지 않음. 모듈 내부 로직에 사용 |
| **compileOnly** | 현재 모듈의 컴파일에만 사용되며 런타임이나 다른 모듈 컴파일에서는 사용 불가. 런타임에 third-party 구현이 있는 API용 |
| **runtimeOnly** | 런타임에서만 사용되며 어떤 모듈의 컴파일에서도 보이지 않음 |

## compileOnly와 provided

compileOnly는 다음과 같은 use case에서 사용됩니다:

- 컴파일 시에는 필요하지만 런타임에는 필요 없는 의존성 (source-only annotations, annotation processors)
- 컴파일 시에는 필요하지만 특정 기능 사용 시에만 런타임에 필요한 의존성 (optional dependencies)
- API는 컴파일 시에 필요하지만 구현은 소비 라이브러리, 애플리케이션 또는 런타임 환경에서 제공하는 의존성

라이브러리 연동 시 특정 디펜던시를 추가하라고 하는 경우:

1. 특정 디펜던시의 클래스가 클라이언트에게도 노출되는 경우
2. compileOnly로 설정하여 클라이언트가 해당 라이브러리에서 일부 피쳐만 사용할 경우, 특정 디펜던시가 runtime에는 추가되지 않게 해서 라이브러리 사이즈를 줄일 수 있음

예: Spark 라이브러리를 쓰는 application에서 빌드 시 해당 라이브러리를 쓰지만, jar 파일에는 포함되지 않고 runtime에서는 별도로 라이브러리를 받아서 호출

## Gradle Build Dependency

태스크 타입이나 플러그인을 가져올 때 사용합니다. 클래스만 가져오고 프로세스는 없습니다.

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
```

### 같은 프로젝트 내에서 빌드 의존성

모든 서브 프로젝트에서 접근 가능하며, 루트 스크립트보다 먼저 처리됩니다.

```
{projectDir}/buildSrc/build.gradle
{projectDir}/buildSrc/src/main/groovy/ch3/SampleTask.groovy
```

이 파일들은 자동으로 컴파일됩니다.

## Transitive Dependency

second-level dependency입니다. 다른 버전의 second-level 의존성이 필요하거나, 저장소에 없어서 수동으로 복사해야 할 때 유용합니다.

```groovy
apply plugin: 'java'

repositories {
    mavenCentral()
}

dependencies {
    compile group: 'commons-httpclient', name: 'commons-httpclient',
            version: '3.1', transitive: false
}
```

### 선택적 제외

```groovy
dependencies {
    compile('commons-httpclient:commons-httpclient:3.1') {
        exclude group: 'commons-codec'  // exclude by group
        // exclude group: 'commons-codec', module: 'commons-codec'
    }
}
```

### Transitive 의존성 교체

```groovy
dependencies {
    compile module(group: 'commons-httpclient', name: 'commons-httpclient', version: '3.1') {
        dependencies "commons-codec:commons-codec:1.1@jar"
    }
}
```

## 의존성 표기법

### String 표기법

`moduleGroup:moduleName:version`

```groovy
dependencies {
    vehicles 'com.vehicles:car:1.0', 'com.vehicles:truck:2.0'
    traffic 'com.traffic:pedestrian:1.0'
}

compile 'log4j:log4j:1.2.17'
```

### Map 표기법

```groovy
dependencies {
    vehicles(
        [group: 'com.vehicles', name: 'car', version: '1.0'],
        [group: 'com.vehicles', name: 'truck', version: '2.0'],
    )
    traffic group: 'com.traffic', name: 'pedestrian', version: '1.0'
}

dependencies {
    compile group: 'org.hibernate', name: 'hibernate-core', version: '3.6.7.Final'
}
```

### 추가 설정

```groovy
dependencies {
    // transitive attribute in map notation
    vehicles group: 'com.vehicles', name: 'car',
             version: '1.0', transitive: false

    // map notation with configuration closure
    vehicles(group: 'com.vehicles', name: 'car', version: '1.0') {
        transitive = true
    }

    // string notation with configuration closure
    traffic('com.traffic:pedestrian:1.0') {
        transitive = false
    }
}
```

### 특정 Configuration 선택

```groovy
dependencies {
    traffic group: 'com.traffic',
            name: 'pedestrian',
            version: '1.0',
            configuration: 'jar'
}
```

### 특정 Artifact 가져오기

```groovy
dependencies {
    // @ext notation
    vehicles 'com.vehicles:car:2.0@jar'

    // ext attribute in map notation
    traffic group: 'com.traffic', name: 'pedestrian',
            version: '1.0', ext: 'jar'

    // artifact configuration closure
    vehicles('com.vehicles:car:2.0') {
        artifact {
            name = 'car-docs'
            type = 'tar'
            extension = 'tar'
        }
    }
}
```

### JAR 이외의 파일

module descriptor 파일 없이는 jar가 아닌 확장자를 명시해야 합니다.

```groovy
dependencies {
    runtime group: 'org.mywar', name: 'sampleWeb', version: '1.0', ext: 'war'
}
```

### Classifier

`sampleWeb-1.0-dev.war` 또는 `sampleWeb-1.0-qa.war`와 같은 파일:

```groovy
dependencies {
    runtime group: 'org.mywar', name: 'sampleWeb', version: '1.0',
            classifier: 'qa', ext: 'war'
}

dependencies {
    // string notation with classifier
    vehicles 'com.vehicles:car:2.0:jdk15'

    // map notation with classifier
    traffic group: 'com.traffic', name: 'pedestrian',
            version: '1.0', classifier: 'jdk16'
}
```

## Project Dependency

```groovy
dependencies {
    vehicles project(':car')

    vehicles project(':truck') {
        configuration = 'api'
    }

    traffic project(path: ':pedestrian', configuration: 'lib')
}

compile project(':core')
```

## File Dependency

```groovy
compile fileTree(dir: 'libs', include: ['*.jar'])

dependencies {
    vehicles files(
        'lib/vehicles/car-2.0.jar',
        'lib/vehicles/truck-1.0.jar'
    )

    traffic fileTree(dir: 'deps', include: '*.jar')
}
```

## Version

### 동적 버전

```groovy
dependencies {
    compile 'org.springframework:spring-context:4.0.+'
}

dependencies {
    // 4.0.3.RELEASE가 사용 가능하면 최신 버전으로 resolve
    compile 'org.springframework:spring-context:[4.0.1.RELEASE,4.0.4.RELEASE['

    // latest
    compile group: 'commons-codec', name: 'commons-codec', version: 'latest.integration'
    compile group: 'commons-codec', name: 'commons-codec', version: '1.+'
}
```

## Version Conflicts (버전 충돌)

### 전략

- **latest version**: 기본값
- **failOnVersionConflict**: 충돌 시 실패

```groovy
configurations.all {
    resolutionStrategy {
        failOnVersionConflict()
    }
}
```

### 특정 버전 강제

```groovy
dependencies {
    compile group: 'commons-httpclient', name: 'commons-httpclient', version: '3.1'
    compile group: 'commons-codec', name: 'commons-codec', version: '1.1', force: true
}
```

---

# Cache (캐시)

캐시 위치:

```
<USER_HOME>/.gradle/caches
```

저장소에서 다운로드된 모든 jar 파일은 `modules-2/files-2.1` 아래에 있습니다.

폴더 형식: `group/name/version/checksum`

## 캐시 폴더 변경

`~/.profile`에 추가:

```bash
GRADLE_USER_HOME=<User defined location>
```

## 오프라인 모드

```bash
gradle build --offline
```

로컬 캐시만 사용합니다. 버전을 명시하지 않으면 기본값은 최신 버전입니다.
