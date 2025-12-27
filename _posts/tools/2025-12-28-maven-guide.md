---
layout: post
title: "Maven 핵심 가이드 - 빌드 라이프사이클과 의존성 관리"
date: 2025-12-28 12:07:00 +0900
categories: tools
tags: [maven, build, java, dependency]
description: "Maven의 빌드 라이프사이클, 의존성 scope, 디렉토리 구조, 캐시 관리를 설명합니다."
---

Maven은 프로젝트 관리 도구로, POM(Project Object Model) 개념을 기반으로 합니다.

## 1. 기본 용어

| 용어 | 설명 |
|------|------|
| **goal** | 빌드와 프로젝트 관리에 기여하는 특정 태스크 |
| **site** | 리포팅 관련 기능 |
| **POM** | Project Object Model - 프로젝트 설정 파일 |

## 2. 디렉토리 구조

`${basedir}`: 프로젝트 폴더

| 항목 | 기본 경로 |
|------|----------|
| Source code | `${basedir}/src/main/java` |
| Resources | `${basedir}/src/main/resources` |
| Tests | `${basedir}/src/test` |
| Distributable JAR | `${basedir}/target` |
| Compiled byte code | `${basedir}/target/classes` |

## 3. Repository

### Repository 순서

1. Local repository 확인
2. 없으면 Maven Central Repository에서 다운로드

### Local Repository

경로: `~/.m2`

### Maven Central Repository

- Directory URL: [http://repo1.maven.org/maven2/](http://repo1.maven.org/maven2/)
- Homepage: [http://search.maven.org/](http://search.maven.org/)

## 4. 빌드 라이프사이클

### 주요 Phase

| Phase | 설명 |
|-------|------|
| `prepare-resources` | 리소스 복사 커스터마이징 |
| `compile` | 소스 코드 컴파일 |
| `package` | pom.xml의 packaging에 따라 JAR/WAR 생성 |
| `install` | 로컬/원격 maven repository에 패키지 설치 |

### 상세 라이프사이클

| Phase | 설명 |
|-------|------|
| `validate` | 프로젝트 정확성 및 필요 정보 확인 |
| `initialize` | 빌드 상태 초기화 (속성 설정) |
| `generate-sources` | 컴파일에 포함할 소스 코드 생성 |
| `process-sources` | 소스 코드 처리 (값 필터링 등) |
| `generate-resources` | 패키지에 포함할 리소스 생성 |
| `process-resources` | 리소스를 대상 디렉토리로 복사 및 처리 |
| `compile` | 프로젝트 소스 코드 컴파일 |
| `process-classes` | 컴파일된 파일 후처리 (바이트코드 최적화 등) |
| `generate-test-sources` | 컴파일에 포함할 테스트 소스 생성 |
| `process-test-sources` | 테스트 소스 코드 처리 |
| `test-compile` | 테스트 소스 코드를 테스트 대상 디렉토리로 컴파일 |
| `process-test-classes` | 테스트 코드 컴파일 파일 후처리 |
| `test` | 단위 테스트 프레임워크로 테스트 실행 (JUnit 등) |
| `prepare-package` | 패키징 전 필요한 작업 수행 |
| `package` | 컴파일된 코드를 배포 가능한 형식으로 패키징 |
| `pre-integration-test` | 통합 테스트 전 필요한 작업 (환경 설정 등) |
| `integration-test` | 통합 테스트 환경에 패키지 배포 및 실행 |
| `post-integration-test` | 통합 테스트 후 작업 (환경 정리 등) |
| `verify` | 패키지 유효성 및 품질 기준 확인 |
| `install` | 로컬 repository에 패키지 설치 |
| `deploy` | 원격 repository에 최종 패키지 복사 |

## 5. 의존성 Scope

### 주요 Scope 설명

**compile (기본값)**
- build, test, run 타이밍에 사용됨
- 해당 의존성을 참조하는 프로젝트에서 접근 가능
- Gradle의 `api` configuration과 유사
- 참조하지 않는다면 `runtime`으로 설정하는 것이 빌드 시간 단축에 유리

**runtime**
- test, run 타이밍에 사용됨
- 참조하는 프로젝트에서는 접근 불가
- runtime에서는 class 파일 사용 가능
- Gradle의 `implementation`과 유사

**provided**
- build, test 타이밍에 사용
- 참조하는 프로젝트에서 접근 가능
- runtime에서는 class 파일이 빠져있음
- 인터페이스처럼 사용 - 빌드 시에는 인터페이스로 참조, 런타임에는 원하는 구현체 사용

**test**
- 테스트 코드 컴파일 및 실행에만 사용

### Scope 사용 예시

```xml
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-core</artifactId>
    <version>5.3.0</version>
    <scope>compile</scope>
</dependency>

<dependency>
    <groupId>javax.servlet</groupId>
    <artifactId>servlet-api</artifactId>
    <version>2.5</version>
    <scope>provided</scope>
</dependency>
```

참고: [Maven Dependency Scopes](https://howtodoinjava.com/maven/maven-dependency-scopes/)

## 6. 로컬 라이브러리 추가

프로젝트 내 라이브러리 폴더 사용:

```xml
<dependency>
    <groupId>com.example</groupId>
    <artifactId>my-library</artifactId>
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

### 디렉토리 구조

```
lib/
  com/
    example/
      my-library/
        1.0.0/
          my-library-1.0.0.jar
          my-library-1.0.0.pom
```

### 업데이트 방법

1. Maven project sync
2. Maven indices 업데이트
3. 변경 시 버전 증가 필요

## 7. 캐시 관리

### "cannot resolve {package}" 에러 해결

```bash
mvn dependency:purge-local-repository
```

이 명령어는 로컬 repository에서 손상된 의존성을 제거하고 다시 다운로드합니다.

### 기타 캐시 정리 옵션

```bash
# 로컬 repository의 특정 의존성 삭제
rm -rf ~/.m2/repository/com/example/

# 전체 캐시 삭제 (주의!)
rm -rf ~/.m2/repository/
```

## 8. 유용한 명령어

```bash
# 프로젝트 빌드
mvn clean install

# 테스트 스킵
mvn clean install -DskipTests

# 특정 프로파일로 빌드
mvn clean install -P production

# 의존성 트리 확인
mvn dependency:tree

# 효과적인 POM 확인
mvn help:effective-pom
```

## 참고 자료

- [Maven Official Documentation](https://maven.apache.org/guides/)
- [Maven Dependency Mechanism](https://maven.apache.org/guides/introduction/introduction-to-dependency-mechanism.html)
