---
layout: post
title: "Maven 기초 - 빌드 라이프사이클, 의존성 관리, 저장소"
date: 2025-12-28 15:10:00 +0900
categories: [programming, java]
tags: [java, maven, build-tool]
description: "Maven의 기본 개념, 빌드 라이프사이클, 의존성 Scope, 저장소 설정에 대해 알아봅니다."
image: /assets/images/posts/thumbnails/2025-12-28-maven-basics.png
---

# Maven 기초

Maven은 프로젝트 관리 도구로, Project Object Model (POM) 개념을 기반으로 합니다.

## 용어

| 용어 | 설명 |
|------|------|
| **goal** | 프로젝트의 빌드 및 관리에 기여하는 특정 태스크를 나타냅니다 |
| **site** | 리포팅 관련 |

## 프로젝트 구조

`${basedir}`은 프로젝트 폴더를 의미합니다.

| Item | Default |
|------|---------|
| source code | ${basedir}/src/main/java |
| resources | ${basedir}/src/main/resources |
| Tests | ${basedir}/src/test |
| distributable JAR | ${basedir}/target |
| Compiled byte code | ${basedir}/target/classes |

---

# Build Lifecycle (빌드 라이프사이클)

## 주요 단계

| Phase | Handles | Description |
|-------|---------|-------------|
| prepare-resources | resource copying | 리소스 복사 커스터마이징 가능 |
| compile | compilation | 소스 코드 컴파일 |
| package | packaging | POM.xml의 packaging에 따라 JAR/WAR 패키지 생성 |
| install | installation | 로컬/원격 maven 저장소에 패키지 설치 |

## 전체 라이프사이클

| Lifecycle Phase | Description |
|-----------------|-------------|
| validate | 프로젝트가 올바른지, 빌드에 필요한 모든 정보가 있는지 검증 |
| initialize | 빌드 상태 초기화 (예: property 설정) |
| generate-sources | 컴파일에 포함될 소스 코드 생성 |
| process-sources | 소스 코드 처리 (예: 값 필터링) |
| generate-resources | 패키지에 포함될 리소스 생성 |
| process-resources | 리소스를 대상 디렉토리에 복사 및 처리 (패키징 준비) |
| compile | 프로젝트 소스 코드 컴파일 |
| process-classes | 컴파일에서 생성된 파일 후처리 (예: Java 클래스의 bytecode 향상/최적화) |
| generate-test-sources | 컴파일에 포함될 테스트 소스 코드 생성 |
| process-test-sources | 테스트 소스 코드 처리 (예: 값 필터링) |
| test-compile | 테스트 소스 코드를 테스트 대상 디렉토리에 컴파일 |
| process-test-classes | 테스트 코드 컴파일에서 생성된 파일 처리 |
| test | 적절한 단위 테스트 프레임워크로 테스트 실행 (JUnit 등) |
| prepare-package | 실제 패키징 전 필요한 작업 수행 |
| package | 컴파일된 코드를 배포 가능한 형식으로 패키지 (JAR, WAR, EAR 등) |
| pre-integration-test | 통합 테스트 실행 전 필요한 작업 수행 (환경 설정 등) |
| integration-test | 통합 테스트 실행 가능한 환경에 패키지 배포 및 처리 |
| post-integration-test | 통합 테스트 후 필요한 작업 수행 (환경 정리 등) |
| verify | 패키지가 유효하고 품질 기준을 충족하는지 검사 |
| install | 패키지를 로컬 저장소에 설치 (다른 프로젝트에서 의존성으로 사용 가능) |
| deploy | 최종 패키지를 원격 저장소에 복사 (다른 개발자와 프로젝트와 공유) |

---

# Dependency Scope (의존성 Scope)

참고: [Maven Dependency Scopes](https://howtodoinjava.com/maven/maven-dependency-scopes/)

**주의**: compileOnly로 되어 있는 것은 pom에 포함되지 않습니다. 컴파일할 때 사용되었고, 생성된 jar와는 관련이 없기 때문입니다.

runtime이라는 것은 library 프로젝트에서는 존재하지 않습니다.

api, implementation 모두 runtime 프로젝트에서는 build 시 사용되므로, 주로 library 프로젝트에서 해당 클래스들을 runtime 프로젝트에 노출시킬지 여부를 정할 때 의미가 있습니다.

## compile (default)

- build, test, run 타이밍에 사용됩니다.
- 여기서 build란 해당 디펜던시를 참조하고 있는 프로젝트의 빌드 시를 의미하는 것으로, 해당 프로젝트의 소스코드가 해당 디펜던시를 참조할 수 있다는 의미입니다.
- Gradle의 `api` configuration을 사용 시 이에 해당합니다.
- 만약 runtime 프로젝트에서 해당 디펜던시를 참조하지 않는다면 runtime으로 설정하는 게 좋습니다. 그렇지 않으면 빌드 시간이 더 오래 걸립니다.

## runtime

- test, run 타이밍에 사용됩니다.
- 참조하는 프로젝트에서는 참조하지 못하지만, runtime에서는 호출될 수 있도록 class 파일을 가지고 있습니다.
- Gradle의 `implementation`을 사용 시 이에 해당합니다.

## provided

- build, test 타이밍에 사용됩니다.
- 참조하는 프로젝트에서 참조 가능하지만, 실제 runtime에서는 class 파일들이 빠져있습니다.
- interface 같은 느낌입니다. build time에서는 interface로써 참조할 수 있게 하고, 실제 runtime에서는 원하는 라이브러리의 class 파일을 넣을 수 있어서 같은 interface에 다른 구현일 경우에 사용 가능합니다.

---

# Repository (저장소)

## 조회 순서

Local repository -> default Maven central repository

## Local Repository

경로: `~/.m2`

## Maven Central Repository

- directory URL: [http://repo1.maven.org/maven2/](http://repo1.maven.org/maven2/)
- homepage URL: [http://search.maven.org/](http://search.maven.org/)
- dependency URL: [http://repo1.maven.org/maven/](http://repo1.maven.org/maven/)

---

# Local Library 추가

프로젝트 내에 로컬 라이브러리를 추가하는 방법:

```xml
<dependency>
    <groupId>com.balancehero</groupId>
    <artifactId>messageengine</artifactId>
    <version>1.0.0</version>
</dependency>

<repositories>
    <repository>
        <id>in-project</id>
        <name>custom jars</name>
        <url>file://${project.basedir}/lib</url>
    </repository>
</repositories>
```

폴더 구조:

```
lib/
  com/
    balancehero/
      messageengine/
        1.0.0/
          messageengine-1.0.0.jar
          messageengine-1.0.0.pom
```

**주의**: 업데이트가 있을 때마다 버전을 증가시켜야 합니다.

Maven 프로젝트 동기화 후 Maven indices를 업데이트하세요.

---

# Cache 문제 해결

`cannot resolve {package}` 에러가 발생한 경우:

```bash
mvn dependency:purge-local-repository
```
