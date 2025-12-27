---
layout: post
title: "Gradle 플러그인과 Publishing 가이드"
date: 2025-12-28 12:06:00 +0900
categories: tools
tags: [gradle, plugin, maven, publishing, nexus]
description: "Gradle 플러그인 생성 방법과 Maven Repository로 라이브러리를 배포하는 방법을 다룹니다."
---

Gradle 플러그인은 태스크의 집합입니다. 플러그인을 통해 빌드 로직을 재사용하고 공유할 수 있습니다.

## 1. 플러그인 종류

### Script Plugin

로컬 또는 원격 스크립트 파일:

```groovy
apply from: 'other.gradle'
apply from: 'http://server/other.gradle'
```

### Binary Plugin

```groovy
apply plugin: 'groovy'
apply plugin: 'java'
```

### Community Plugin

```groovy
plugins {
    id "com.jfrog.bintray" version "0.4.1"
}
```

## 2. Custom Plugin 생성

### 같은 빌드 스크립트 내

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

### Extension 추가

```groovy
apply plugin: GreetingPlugin

greeting.message = 'Hi from Gradle'

class GreetingPlugin implements Plugin<Project> {
    void apply(Project project) {
        project.extensions.create("greeting", GreetingPluginExtension)

        project.task('hello') << {
            println project.greeting.message
        }
    }
}

class GreetingPluginExtension {
    def String message = 'Hello from GreetingPlugin'
}
```

### buildSrc에서 정의

`buildSrc/src/main/groovy/ch4/FilePlugin.groovy`:

```groovy
package ch4

import org.gradle.api.Plugin
import org.gradle.api.Project

class FilePlugin implements Plugin<Project> {
    void apply(Project project) {
        // 플러그인 로직
    }
}
```

`build.gradle`:

```groovy
import ch4.FilePlugin

apply plugin: FilePlugin
```

### 별도 프로젝트로 분리

1. 플러그인 프로젝트 생성
2. Plugin ID 정의: `src/main/resources/META-INF/gradle-plugins/fileplugin.properties`

```properties
implementation-class=ch4.custom.plugin.FilePlugin
```

3. 다른 프로젝트에서 사용:

```groovy
buildscript {
    repositories {
        flatDir { dirs "../CustomPlugin/build/libs/" }
    }
    dependencies {
        classpath group: 'ch4.custom.plugin', name: 'CustomPlugin', version: '1.0'
    }
}

apply plugin: 'fileplugin'

filePluginExtension {
    sourceFile = "/home/user1"
}
```

## 3. Java Plugin

```groovy
apply plugin: 'java'
```

### Build Task DAG

```
compileJava -> processResources -> classes -> jar -> assemble
                                           \-> build
compileTestJava -> processTestResources -> testClasses -> test -> check
```

### Source Set 커스터마이징

```groovy
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

### JAR 설정

```groovy
version = 0.1.0
sourceCompatibility = 1.8

jar {
    archiveName = "myproject.jar"
    manifest {
        attributes 'Main-Class': 'com.example.Application'
    }
}
```

## 4. Publishing

### uploadArchives (Legacy)

```groovy
uploadArchives {
    repositories {
        maven {
            credentials {
                username "guest"
                password "guest"
            }
            url "http://private.maven.repo"
        }
    }
}
```

### maven-publish Plugin

```groovy
apply plugin: 'java'
apply plugin: 'maven-publish'

publishing {
    publications {
        mavenJava(MavenPublication) {
            from components.java
            groupId 'org.mygroup'
            artifactId 'MySampleProj'
            version '1.0'
        }
    }
}
```

### 추가 Artifact

```groovy
task zipSrc(type: Zip) {
    baseName = 'SampleSource'
    from 'src'
}

task javadocJar(type: Jar) {
    classifier = 'javadoc'
    from javadoc
}

task sourcesJar(type: Jar) {
    classifier = 'sources'
    from sourceSets.main.allSource
}

artifacts {
    archives javadocJar, sourcesJar
}

publishing {
    publications {
        mavenJava(MavenPublication) {
            from components.java
            artifact zipSrc {
                classifier "sources"
            }
        }
    }
}
```

### 로컬 Repository에 배포

```groovy
publishing {
    repositories {
        maven {
            name "localRepo"
            url "./localrepo"
        }
    }
}
```

### Custom POM

```groovy
publishing {
    publications {
        mavenCustom(MavenPublication) {
            from components.java
            groupId 'org.mygroup'
            artifactId 'MySampleProj'
            version '1.0'

            pom.withXml {
                def root = asNode()
                root.appendNode('name', 'Sample Project')
                root.appendNode('description', 'Adding Additional details')
                def devs = root.appendNode('developers')
                def dev = devs.appendNode('developer')
                dev.appendNode('name', 'DeveloperName')
            }
        }
    }
}
```

## 5. Nexus/JCenter 배포 예제

### gradle.properties

```properties
LIB_GROUP=com.example
LIB_ARTIFACT=my-library
LIB_VERSION=1.1.1
LIB_DES=My awesome library

SITE_URL=https://github.com/user/repo
GIT_URL=https://github.com/user/repo.git
ISSUE_URL=https://github.com/user/repo/issues

DEVELOPER_ID=developer
DEVELOPER_NAME=Developer Name
DEVELOPER_EMAIL=dev@example.com

ORGANIZATION_NAME=Example, Inc.
ORGANIZATION_URL=http://www.example.com

LICENCE_NAME=The Apache Software License, Version 2.0
LICENCE_URL=http://www.apache.org/licenses/LICENSE-2.0.txt
LICENCE_DIST=repo
```

### Nexus 배포

```groovy
apply plugin: 'maven'

version = LIB_VERSION
group = LIB_GROUP

def nexusRepositoryUrl = LIB_ISRELEASE.toBoolean() ? nexusReleases : nexusSnapshots
if (!LIB_ISRELEASE.toBoolean()) {
    version = "${version}-SNAPSHOT"
}

uploadArchives {
    repositories {
        mavenDeployer {
            repository(url: "$nexusRepositoryUrl") {
                authentication(userName: nexusUserName, password: nexusPassword)
            }
            pom.project {
                name LIB_ARTIFACT
                groupId LIB_GROUP
                artifactId LIB_ARTIFACT
                version version
                packaging 'jar'
                description LIB_DES

                licenses {
                    license {
                        name LICENCE_NAME
                        url LICENCE_URL
                        distribution LICENCE_DIST
                    }
                }

                developers {
                    developer {
                        id DEVELOPER_ID
                        name DEVELOPER_NAME
                        email DEVELOPER_EMAIL
                    }
                }

                organization {
                    name ORGANIZATION_NAME
                    url ORGANIZATION_URL
                }
            }
        }
    }
}
```

### Bintray/JCenter 배포

```groovy
apply plugin: 'com.jfrog.bintray'
apply plugin: 'maven-publish'
apply plugin: 'java'
apply plugin: 'signing'
apply plugin: 'maven'

group = LIB_GROUP
version = LIB_VERSION
project.archivesBaseName = LIB_ARTIFACT

bintray {
    user = bintrayUser
    key = bintrayAPIKey
    configurations = ['archives']
    pkg {
        repo = "maven"
        name = LIB_ARTIFACT
        desc = LIB_DES
        websiteUrl = SITE_URL
        vcsUrl = GIT_URL
        issueTrackerUrl = ISSUE_URL
        licenses = ["Apache-2.0"]
        labels = 'Groovy'
        publicDownloadNumbers = true
        publish = true
    }
}
```

## 6. War Plugin

```groovy
apply plugin: 'war'

repositories {
    mavenCentral()
}

dependencies {
    providedCompile "javax.servlet:servlet-api:2.5"
    compile "commons-io:commons-io:2.4"
}

webAppDirName = "WebContent"

war {
    baseName = "simpleapp"
    version = "1.0"
    extension = "war"
    includeEmptyDirs = false
}
```

## 7. Scala Plugin

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
    compile 'org.scala-lang:scala-library:2.11.6'
    runtime 'org.scala-lang:scala-compiler:2.11.6'
    compile 'org.scala-lang:jline:2.9.0-1'
}

task runMain(type: JavaExec) {
    main = 'ch6.HelloScala'
    classpath = configurations.runtime + sourceSets.main.output + sourceSets.test.output
}
```

## 8. Test 설정

```groovy
dependencies {
    testCompile 'junit:junit:4.12'
}

test {
    ignoreFailures = true
    maxParallelForks = 3
    forkEvery = 1  // 클래스마다 새 프로세스

    filter {
        includeTestsMatching "ch6.login.*"
        includeTestsMatching "*Test"
        include "ch6/profile/**"
    }
}
```

## 참고 자료

- [Writing Custom Plugins](https://guides.gradle.org/writing-gradle-plugins/)
- [Gradle Custom Plugins](https://docs.gradle.org/current/userguide/custom_plugins.html)
- [Maven Publish Plugin](https://docs.gradle.org/current/userguide/publishing_maven.html)
