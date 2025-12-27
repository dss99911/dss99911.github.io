---
layout: post
title: "Gradle 의존성 관리 완벽 가이드"
date: 2025-12-28 12:04:00 +0900
categories: tools
tags: [gradle, dependency, maven, repository]
description: "Gradle에서 의존성을 선언하고 관리하는 다양한 방법과 Repository 설정을 상세히 다룹니다."
---

Gradle의 강력한 의존성 관리 기능을 활용하면 프로젝트의 라이브러리를 효율적으로 관리할 수 있습니다.

## 1. 의존성 Configuration 종류

### 주요 Configuration

| Configuration | 설명 |
|--------------|------|
| `api` | 컴파일/런타임에 사용, 라이브러리 소비자에게 노출됨 |
| `implementation` | 컴파일/런타임에 사용, 다른 모듈에 노출되지 않음 |
| `compileOnly` | 컴파일에만 사용, 런타임에는 포함되지 않음 |
| `runtimeOnly` | 런타임에만 사용, 컴파일 시 보이지 않음 |

### compile vs implementation

```groovy
// compile: second-level 의존성을 사용할 수 있음
compile 'library:name:1.0'

// implementation: second-level 의존성 사용 불가
implementation 'library:name:1.0'

// compile 기능이 필요하면 api 사용
api 'library:name:1.0'
```

### compileOnly (provided)

```groovy
compileOnly 'library:name:1.0'
```

사용 사례:
- 컴파일에만 필요한 의존성 (annotation processors)
- 특정 기능 사용 시에만 필요한 optional dependencies
- API만 필요하고 구현은 런타임에 제공되는 경우

Maven의 `provided`와 동일:
- 빌드 시에는 해당 라이브러리 사용
- JAR 파일에는 포함되지 않음
- 런타임에서는 별도로 라이브러리를 받아서 사용

## 2. 의존성 선언 방식

### String Notation

```groovy
dependencies {
    compile 'org.springframework:spring-context:4.0.+'
    compile 'log4j:log4j:1.2.17'
    vehicles 'com.vehicles:car:1.0', 'com.vehicles:truck:2.0'
}
```

### Map Notation

```groovy
dependencies {
    compile group: 'org.hibernate', name: 'hibernate-core', version: '3.6.7.Final'

    traffic(
        [group: 'com.traffic', name: 'pedestrian', version: '1.0'],
        [group: 'com.traffic', name: 'vehicle', version: '2.0']
    )
}
```

### 추가 속성과 함께

```groovy
dependencies {
    // transitive 속성
    compile group: 'commons-httpclient', name: 'commons-httpclient',
            version: '3.1', transitive: false

    // closure 사용
    compile('commons-httpclient:commons-httpclient:3.1') {
        transitive = true
    }
}
```

## 3. 프로젝트 의존성

```groovy
dependencies {
    compile project(':core')

    vehicles project(':car')

    // 특정 configuration 사용
    vehicles project(':truck') {
        configuration = 'api'
    }

    // 또는
    traffic project(path: ':pedestrian', configuration: 'lib')
}
```

## 4. 파일 의존성

```groovy
dependencies {
    compile files('lib/vehicles/car-2.0.jar', 'lib/vehicles/truck-1.0.jar')

    compile fileTree(dir: 'libs', include: ['*.jar'])

    traffic fileTree(dir: 'deps', include: '*.jar')
}
```

## 5. 버전 관리

### 동적 버전

```groovy
dependencies {
    // 4.0.x 중 최신
    compile 'org.springframework:spring-context:4.0.+'

    // 범위 지정 [from, to)
    compile 'org.springframework:spring-context:[4.0.1.RELEASE,4.0.4.RELEASE['

    // 최신 버전
    compile group: 'commons-codec', name: 'commons-codec', version: 'latest.integration'
}
```

### 버전 충돌 해결

```groovy
configurations.all {
    resolutionStrategy {
        // 충돌 시 실패
        failOnVersionConflict()

        // 특정 버전 강제
        force 'commons-codec:commons-codec:1.1'
    }
}

// 또는 의존성 선언 시
dependencies {
    compile group: 'commons-codec', name: 'commons-codec', version: '1.1', force: true
}
```

## 6. Transitive 의존성 관리

### 비활성화

```groovy
dependencies {
    compile group: 'commons-httpclient', name: 'commons-httpclient',
            version: '3.1', transitive: false
}
```

### 선택적 제외

```groovy
dependencies {
    compile('commons-httpclient:commons-httpclient:3.1') {
        exclude group: 'commons-codec'
        // exclude group: 'commons-codec', module: 'commons-codec'
    }
}
```

### 대체

```groovy
dependencies {
    compile module(group: 'commons-httpclient', name: 'commons-httpclient', version: '3.1') {
        dependencies "commons-codec:commons-codec:1.1@jar"
    }
}
```

## 7. 특정 Artifact 가져오기

### Classifier 사용

```groovy
dependencies {
    // jdk15 classifier
    vehicles 'com.vehicles:car:2.0:jdk15'

    // map notation
    traffic group: 'com.traffic', name: 'pedestrian', version: '1.0', classifier: 'jdk16'

    // closure
    vehicles('com.vehicles:truck:2.0') {
        artifact {
            name = 'truck'
            type = 'jar'
            classifier = 'jdk15'
        }
    }
}
```

### Extension 지정

```groovy
dependencies {
    // @ notation
    vehicles 'com.vehicles:car:2.0@jar'

    // ext attribute
    traffic group: 'com.traffic', name: 'pedestrian', version: '1.0', ext: 'jar'

    // war 파일
    runtime group: 'org.mywar', name: 'sampleWeb', version: '1.0', ext: 'war'
}
```

## 8. Repository 설정

### Maven Central

```groovy
repositories {
    mavenCentral()
}
```

### JCenter

```groovy
repositories {
    jcenter()
}
```

### Google

```groovy
repositories {
    google()
}
```

### Local 폴더

```groovy
repositories {
    flatDir { dirs '/localfile/dir1', '/localfile/dir2' }
}
```

### Local Maven

```groovy
repositories {
    maven {
        url "${rootDir}/local-repo"
    }
}
```

### Remote Maven

```groovy
repositories {
    maven {
        url "http://repo.mycompany.com/maven2"
    }

    // POM과 JAR 경로가 다른 경우
    maven {
        url "http://private.repository/pompath"
        artifactUrls "http://private.repository/jardir"
    }
}
```

### buildscript Repository

```groovy
buildscript {
    repositories {
        mavenCentral()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:7.0.0'
    }
}
```

## 9. 의존성 트리 확인

```bash
# 전체 의존성 트리
./gradlew dependencies

# 특정 모듈
./gradlew app:dependencies

# 특정 configuration
./gradlew dependencies --configuration compile

# 특정 의존성 분석
./gradlew dependencyInsight --dependency commons-logging --configuration runtime
```

### 특정 라이브러리 버전 확인

```bash
./gradlew -q dependencies app:dependencies | grep 'com.squareup.okhttp.*' -o | sort -u
```

## 10. Cache 관리

### 캐시 위치

```
<USER_HOME>/.gradle/caches
```

모든 다운로드된 JAR: `modules-2/files-2.1`
폴더 형식: `group/name/version/checksum`

### 캐시 폴더 변경

`~/.profile`에 추가:

```bash
GRADLE_USER_HOME=<User defined location>
```

### 오프라인 모드

```bash
gradle --offline taskName
```

## 11. buildscript 의존성

플러그인이나 태스크 타입을 가져올 때 사용:

```groovy
buildscript {
    repositories {
        flatDir { dirs "../SampleTaskProj/build/libs" }
    }
    dependencies {
        classpath group: 'ch3', name: 'SampleTaskProj', version: '1.0'
    }
}
```

## 12. buildSrc

같은 프로젝트 내에서 사용할 빌드 의존성:

```
{projectDir}/buildSrc/build.gradle
{projectDir}/buildSrc/src/main/groovy/ch3/SampleTask.groovy
```

- 모든 서브프로젝트에서 접근 가능
- 루트 스크립트보다 먼저 처리됨

## 13. 용어 정리

| 용어 | 설명 |
|------|------|
| Configuration | 사용 상황 정의 (compile, kapt 등) |
| Compilation | main, test |
| Target | jvm, js |
| SourceSet | target + compilation (jvmMain, jvmTest) |
| Attribute | variant 선택 규칙 |
| Variant | debug, release 등 |

## 참고 자료

- [Gradle Dependency Management](https://docs.gradle.org/current/userguide/dependency_management.html)
- [Kotlin Multiplatform Dependencies](https://kotlinlang.org/docs/reference/building-mpp-with-gradle.html#adding-dependencies)
