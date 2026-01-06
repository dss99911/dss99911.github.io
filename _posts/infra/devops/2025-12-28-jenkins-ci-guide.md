---
layout: post
title: "Jenkins CI/CD 완벽 가이드 - 설치부터 배포까지"
date: 2025-12-28 12:04:00 +0900
categories: [infra, devops]
tags: [jenkins, ci, cd, devops, automation, git]
description: "Jenkins 설치, 설정, Git 연동, Webhook 설정, 빌드 및 배포까지 CI/CD 파이프라인 구축 방법을 설명합니다."
image: /assets/images/posts/thumbnails/2025-12-28-jenkins-ci-guide.png
---

# Jenkins CI/CD 완벽 가이드

Jenkins는 가장 널리 사용되는 CI(Continuous Integration) 도구입니다. TeamCity, Bamboo, Hudson, Cruise Control 등의 대안도 있지만, Jenkins는 무료이면서 강력한 기능을 제공합니다.

## Jenkins 설치

### 설치 (CentOS/Amazon Linux)

```bash
sudo yum install jenkins
service jenkins start
```

### 기본 설정

- **포트**: 8080
- **로그 위치**: `/var/log/jenkins/jenkins.log`
- **설정 파일**: `/etc/sysconfig/jenkins` (CentOS)

### Heap Size 변경

```bash
# /etc/sysconfig/jenkins
JAVA_ARGS="-Xmx256m"
```

## Git 연동

### Git 경로 설정

Repository URL을 입력해도 다음과 같은 에러가 발생할 수 있습니다:

```
git ls-remote -h https://bitbucket.org/your-repo.git HEAD
```

이 경우 Git이 설치되어 있지 않거나 경로를 못 찾고 있는 것입니다.

**해결 방법:**
1. Git 설치
2. Jenkins -> Global Tool Configuration -> Git -> Git Installations -> Path to Git executable에 Git 경로 입력

## Job 설정

### 1. Git Repository 설정

Git Repository URL을 설정합니다.

### 2. Credentials 설정

Credentials에서 인증 정보를 추가합니다.

### 3. 브랜치 설정

빌드할 브랜치를 지정합니다.

### 4. Build Triggers

- **Build when a change is pushed to BitBucket**: BitBucket 플러그인 설치 후 사용 가능

### 5. Build 설정

- **Invoke Gradle script**로 빌드
- Gradle 및 JDK 위치 설정 필요
- Global Tool Configuration에서 Gradle Installer도 설정

## Blue Ocean

Blue Ocean은 Jenkins의 모던한 UI로, GitHub 등과 연동하여 PR(Pull Request)과 테스트 결과를 쉽게 확인할 수 있습니다.

- Pull Request 시 빌드 결과 확인 가능
- 파이프라인 시각화

## Webhook 설정

BitBucket에서 코드 변경 시 자동으로 빌드를 트리거하려면:

1. BitBucket Repository Settings에서 Webhooks 설정
2. URL: `http://jenkins.your-domain.com/bitbucket-hook/`

## Parameterized Build

파라미터를 사용하여 빌드를 유연하게 설정할 수 있습니다.

### Rebuild Plugin

기존 파라미터로 빌드를 다시 실행할 수 있는 플러그인입니다.

[Rebuild Plugin 문서](https://wiki.jenkins.io/display/JENKINS/Rebuild+Plugin)

## 배포 설정

### SCP를 통한 배포

SSH 키를 설정하여 배포 서버에 파일을 전송합니다.

```bash
# /var/lib/jenkins/.ssh에 private key 및 host_name 파일 배치
```

**주의사항:**
- 추가한 파일을 jenkins 사용자가 읽거나 쓸 수 있는 권한 확인
- 필요에 따라 jenkins에 ec2-user 권한 부여

## 빌드 스크립트 예시

Gradle을 사용한 Android 앱 빌드 스크립트 예시입니다:

```bash
# Git 정보 출력
echo $GIT_COMMIT
echo $GIT_BRANCH

# Gradle 빌드
./gradlew --stop
./gradlew clean
./gradlew assembleDevForQA --stacktrace

# 결과 파일 이동
find $APK_FOLDER -name '*.apk' -exec mv {} $RESULT_FOLDER \;

# AWS S3에 업로드
aws s3 cp $RESULT_FOLDER s3://deploy.resource/android/ --recursive
```

### 빌드 충돌 방지

여러 빌드가 동시에 실행되는 것을 방지하는 스크립트:

```bash
GRADLEW_PID=$(ps -ef | grep -v grep | grep gradlew | grep android.app.release | sed 's/ [ ]*/ /g' | cut -d' ' -f2)

for i in {1..1200}; do  # 1200초(20분) 대기
    ret=$(ps -ef | grep -v grep | grep gradlew | grep android.app.release | wc -l)
    if [ "$ret" -eq "0" ]; then
        echo "[$(date)] OK, no gradlew running"
        break
    fi
    echo "[$(date)] gradlew still running (pid=$GRADLEW_PID)"
    sleep 1
done
```

## 참고 사항

- Jenkins는 기본적으로 8080 포트를 사용하므로, 다른 서비스와 충돌하지 않도록 주의
- 보안을 위해 Jenkins를 Load Balancer 뒤에 배치하고 HTTPS 사용 권장
- 정기적인 백업 필수
