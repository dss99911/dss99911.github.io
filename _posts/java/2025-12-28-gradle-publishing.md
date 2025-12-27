---
layout: post
title: "Gradle Publishing - Maven 저장소 배포, JCenter, Nexus"
date: 2025-12-28 14:50:00 +0900
categories: java
tags: [java, gradle, build-tool, maven, publishing]
description: "Gradle로 Maven 저장소에 배포하는 방법, JCenter, Nexus 설정에 대해 알아봅니다."
---

# Repository

여러 저장소를 사용할 수 있습니다: Maven central, corporate Maven/Ivy repository, 로컬 파일 시스템 등

## 저장소 위치

저장소는 buildscript에 위치합니다.

```groovy
buildscript {
    repositories {
        mavenCentral()
    }
}
```

## 저장소 참조

### Central Maven

```groovy
repositories {
    mavenCentral()
}
```

### 로컬 폴더

```groovy
repositories {
    flatDir { dirs '/localfile/dir1', '/localfile/dir2' }
}
```

### 로컬 Maven

```groovy
def localMavenRepo = "${rootDir}/firebase-perf-repo"

maven {
    url localMavenRepo
}
```

### 원격 Maven

```groovy
repositories {
    maven {
        url "http://repo.mycompany.com/maven2"
    }
}

// pom.xml과 jar 파일 경로가 다른 경우
repositories {
    maven {
        url "http://private.repository/pompath"
        artifactUrls "http://private.repository/jardir"
    }
}
```

### 여러 저장소 설정

```groovy
repositories {
    jcenter()
    mavenCentral()
    google()
    maven {
        url 'https://maven.fabric.io/public'
    }
}
```

---

# Publishing (배포)

## UploadArchives 태스크

패턴: `upload<ConfigurationName>` - Configuration에 속한 아티팩트를 조립하고 업로드합니다.

- jar 파일을 특정 경로로 업로드하거나 이동합니다.
- deployment descriptor(ivy.xml 또는 pom.xml)를 생성합니다.
  - Gradle은 이 파일을 파싱하여 실제 JAR 파일과 의존성을 다운로드합니다.
- checksum을 생성합니다.

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
        // flatDir { dirs "./temp1" }
    }
}
```

## 추가 Artifacts

```groovy
apply plugin: 'java'

archivesBaseName = "MySample"  // jar 이름 커스터마이즈
version = 1.0

repositories {
    mavenCentral()
}

def confFile = file('configurations.xml')  // artifact2

artifacts {
    archives confFile
}

uploadArchives {
    repositories {
        flatDir { dirs "./tempRepo" }
    }
}
```

### Zip 파일 추가

```groovy
apply plugin: 'java'

archivesBaseName = "MySample"
version = 1.0

repositories {
    mavenCentral()
}

task zipSrc(type: Zip) {
    from 'src'
}

artifacts {
    archives zipSrc
}

uploadArchives {
    repositories {
        flatDir { dirs "./temp1" }
    }
}
```

### Jar와 Classifier 추가

```groovy
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
```

## Maven Publishing

MavenPublication은 Maven의 publication임을 알리는 용도입니다. pom을 자동으로 생성합니다.

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

### 태스크

- `publish`
- `publishToMavenLocal`
- `publish<publicationName>PublicationToMavenLocal`

### Zip 파일 추가와 Classifier 설정

```groovy
apply plugin: 'java'
apply plugin: 'maven-publish'

task zipSrc(type: Zip) {
    baseName = 'SampleSource'
    from 'src'
}

publishing {
    publications {
        mavenJava(MavenPublication) {
            from components.java
            groupId 'org.mygroup'
            artifactId 'MySampleProj'
            version '1.0'
            artifact zipSrc {
                classifier "sources"
            }
            // artifact can be <Jar, Zip tasks which will generate jar, zip file>
        }
    }
}
```

### 로컬 저장소에 배포

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
apply plugin: 'java'
apply plugin: 'maven-publish'

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

---

# Publishing Examples

## Nexus에 업로드

`maven.gradle`:

```groovy
apply plugin: 'maven'

version = LIB_VERSION
group = LIB_GROUP

def nexusRepositoryUrl = nexusReleases
if (!LIB_ISRELEASE.toBoolean()) {
    version = "${version}-SNAPSHOT"
    nexusRepositoryUrl = nexusSnapshots
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

## JCenter에 배포

`bintray.gradle`:

```groovy
apply plugin: 'com.jfrog.bintray'
apply plugin: 'maven-publish'
apply plugin: 'java'
apply plugin: 'signing'
apply plugin: 'maven'

group = LIB_GROUP
version = LIB_VERSION
project.archivesBaseName = LIB_ARTIFACT

task javadocJar(type: Jar, dependsOn: javadoc) {
    classifier = 'javadoc'
    from javadoc.destinationDir
}

task sourceJar(type: Jar) {
    classifier = 'sources'
    from sourceSets.main.allSource
}

ext {
    pomFilePath = "${project.buildDir.absolutePath}/tmp/pom.xml"
    pomFile = file(pomFilePath)
}

configurations {
    pom
}

artifacts {
    archives jar
    archives sourceJar
    archives javadocJar
    if (pomFile.exists()) {
        pom pomFile
    }
}

task signJars(type: Sign, dependsOn: [jar, javadocJar, sourceJar]) {
    sign configurations.archives
}

task signPom(type: Sign) {
    sign configurations.pom
}

if (project.ext.pomFile.exists()) {
    task preparePublication(dependsOn: [signJars, signPom])
} else {
    task preparePublication(dependsOn: signJars)
}

install {
    repositories.mavenInstaller {
        pom {
            project {
                packaging 'jar'
                name LIB_ARTIFACT
                url SITE_URL
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
                scm {
                    connection GIT_URL
                    developerConnection ISSUE_URL
                    url SITE_URL
                }
            }
        }
    }
}

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

## gradle.properties 설정

```properties
LIB_GROUP=com.hujiang.aspectjx
LIB_ARTIFACT=gradle-android-plugin-aspectjx
LIB_VERSION=1.1.1
LIB_DES=A Gradle plugin which enables AspectJ for Android builds.
LIB_ISRELEASE=true

SITE_URL=https://github.com/HujiangTechnology/gradle_plugin_android_aspectjx
GIT_URL=https://github.com/HujiangTechnology/gradle_plugin_android_aspectjx.git
ISSUE_URL=https://github.com/HujiangTechnology/gradle_plugin_android_aspectjx/issues

DEVELOPER_ID=firefly1126
DEVELOPER_NAME=firefly1126
DEVELOPER_EMAIL=xiaoming1109@gmail.com

ORGANIZATION_NAME=hujiang, Inc.
ORGANIZATION_URL=http://www.hujiang.com

LICENCE_NAME=The Apache Software License, Version 2.0
LICENCE_URL=http://www.apache.org/licenses/LICENSE-2.0.txt
LICENCE_DIST=repo
```

## buildSrc/build.gradle

properties 가져오기, 프로젝트 빌드:

```groovy
repositories {
    mavenLocal()
    mavenCentral()
    jcenter()
}

apply from: '../ext.gradle'

["../gradle.properties", "gradle.properties"].each {
    File propertiesFile = new File(it)
    if (propertiesFile.exists()) {
        Properties properties = new Properties()
        propertiesFile.withInputStream {
            properties.load(it)
        }
        properties.entrySet().each {
            project.ext.set(it.key, it.value)
        }
    }
}

dependencies {
    runtime 'com.android.tools.build:gradle:2.1.2'
    runtime project(':aspectjx')
}
```

## ext.gradle

local.properties에서 비밀 속성 설정:

```groovy
project.ext {
    aspectjVersion = '1.8.9'
    Properties properties = new Properties()
    if (project.file('local.properties').exists()) {
        properties.load(project.file('local.properties').newDataInputStream())
    }

    def nRelease = 'nexus.releases'
    def nSnapshot = 'nexus.snapshots'
    def nUserName = 'nexus.username'
    def nPassword = 'nexus.password'
    def bUser = 'bintray.user'
    def bAPIKey = 'bintray.apikey'

    nexusReleases = properties.getProperty(nRelease, "")
    nexusSnapshots = properties.getProperty(nSnapshot, "")
    nexusUserName = properties.getProperty(nUserName, "")
    nexusPassword = properties.getProperty(nPassword, "")
    bintrayUser = properties.getProperty(bUser, "")
    bintrayAPIKey = properties.getProperty(bAPIKey, "")
}
```
