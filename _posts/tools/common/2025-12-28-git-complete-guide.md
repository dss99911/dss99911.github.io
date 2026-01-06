---
layout: post
title: "Git 완벽 가이드 - 브랜칭 전략부터 실무 명령어까지"
date: 2025-12-28 12:00:00 +0900
categories: [tools, common]
tags: [git, version-control, branching, rebase, squash]
description: "Git 브랜칭 모델, 실무에서 자주 사용하는 명령어, rebase와 squash 전략, Git Hook 활용법을 상세히 다룹니다."
image: /assets/images/posts/thumbnails/2025-12-28-git-complete-guide.png
---

Git은 현대 소프트웨어 개발에서 필수적인 버전 관리 도구입니다. 이 글에서는 Git의 브랜칭 전략부터 실무에서 자주 사용하는 명령어, 그리고 고급 기능들까지 상세히 알아보겠습니다.

## 1. Git Branching Model

### 브랜칭 전략의 종류

프로젝트의 특성에 따라 적합한 브랜칭 전략을 선택해야 합니다.

**방법 1: develop 브랜치 기반**
- develop 브랜치에서 자잘한 수정들을 반영
- 한 번에 release 브랜치를 형성하여 테스트
- 앱 배포처럼 바로 반영이 어렵고 모아서 테스트 후 반영해야 하는 경우에 적합

**방법 2: 릴리즈 브랜치 기반**
- 릴리즈가 필요할 때 릴리즈 브랜치를 생성
- 반영될 작업들을 반영하여 테스트
- 서버 배포처럼 바로 반영이 가능한 경우에 적합

### 주요 브랜치 구성

**Main Branches**
- `master`: 프로덕션에 배포 가능한 상태의 코드
- `develop`: 다음 릴리즈를 위한 개발 코드

**Supporting Branches**
- `feature/*`: 새로운 기능 개발
- `release/*`: 릴리즈 준비
- `hotfix/*`: 긴급 버그 수정

### Feature Branch 워크플로우

```bash
# feature 브랜치 생성
git checkout -b myfeature develop

# 개발 완료 후 develop에 머지
git checkout develop
git merge --no-ff myfeature
git branch -d myfeature
git push origin develop
```

`--no-ff` 플래그는 항상 새로운 커밋 객체를 생성하여 feature 브랜치의 존재 히스토리를 보존합니다.

### Release Branch 워크플로우

```bash
# release 브랜치 생성
git checkout -b release-1.2 develop
./bump-version.sh 1.2
git commit -a -m "Bumped version number to 1.2"

# 릴리즈 완료 후 master에 머지
git checkout master
git merge --no-ff release-1.2
git tag -a 1.2

# develop에도 머지
git checkout develop
git merge --no-ff release-1.2
git branch -d release-1.2
```

### Hotfix Branch 워크플로우

```bash
# master에서 hotfix 브랜치 생성
git checkout -b hotfix-1.2.1 master
./bump-version.sh 1.2.1
git commit -a -m "Bumped version number to 1.2.1"

# 버그 수정
git commit -m "Fixed severe production problem"

# master에 머지
git checkout master
git merge --no-ff hotfix-1.2.1
git tag -a 1.2.1

# develop에도 머지
git checkout develop
git merge --no-ff hotfix-1.2.1
git branch -d hotfix-1.2.1
```

## 2. 자주 사용하는 Git 명령어

### 기본 설정

```bash
# 사용자 정보 설정
git config --global user.email "your@email.com"
git config --global user.name "Your Name"
```

### 저장소 작업

```bash
# 특정 브랜치 클론
git clone $url -b $branch_name

# 업데이트
git fetch
```

### 커밋 관리

```bash
# 마지막 커밋 취소 (변경사항 유지)
git reset HEAD^

# 특정 커밋 되돌리기
git revert --no-commit b49eb8e 1d8b062

# 머지 커밋 되돌리기
git revert --no-commit 66e546a -m 2

# 한 파일만 특정 커밋으로 복원
git checkout c5f567 -- file1/to/restore
```

### 브랜치 작업

```bash
# 브랜치 생성 및 이동
git checkout -b myfeature develop

# 브랜치 이동
git checkout develop

# 머지
git merge --no-ff release-1.2

# 태그 추가
git tag -a 1.2
```

## 3. Git Log 활용

### 기본 로그 조회

```bash
# 한 줄로 보기
git log --oneline

# 특정 저자의 커밋만
git log --author="your@email.com" --all --since="2018-03-01" --oneline --no-merges
```

### 날짜 필터링

```bash
git log --after="2014-7-1"
git log --after="yesterday"
git log --after="2014-7-1" --before="2014-7-4"
```

### 내용으로 검색

```bash
# 커밋 메시지로 검색
git log --grep="JRA-224:"

# 코드 변경으로 검색
git log -S"Hello, World!"
```

### 커스텀 포맷

```bash
git log --pretty=format:"%cn committed %h on %cd"
```

## 4. Merge 전략

### Merge Commit
- 일반적인 머지
- 브랜치 정보가 히스토리에 남음

### Squash
- 여러 커밋을 하나의 커밋으로 합침
- 나중에 롤백이나 체리픽하기 쉬움

### Fast-forward
- 브랜치 정보가 남지 않음
- master에 직접 커밋한 것처럼 그래프가 표시됨

## 5. Rebase & Squash 정책

### 방법별 장단점

| 방법 | 장점 | 단점 |
|------|------|------|
| 머지 | 가장 안전 | 그래프가 복잡해짐 |
| 스쿼시 | 안전, 그래프 깔끔 | 서브피쳐 커밋 구별 불가 |
| 리베이스 | 그래프 깔끔, 서브피쳐 확인 가능 | 불안정, 컨플릭트 많이 발생 |

### 권장 워크플로우

1. 베이스를 당겨올 때는 **머지**로 처리
2. 베이스에 반영할 때는 **스쿼시**로 머지
3. 베이스의 그래프가 피쳐별로 보이도록 처리

### Rebase 주의사항

```text
Rebase current onto Selected의 의미:
- current의 commit을 새로 만들어서 selected 위에 붙임
- selected에 머지하면 문제 없음
- current에 머지하면 commit이 다르므로 conflict 발생
```

> **중요**: Force push는 1인 1브랜치일 때만 사용. 여러 명이 같은 브랜치에서 작업할 때는 위험합니다.

## 6. Git Hook

Git Hook은 특정 이벤트가 발생했을 때 자동으로 실행되는 스크립트입니다.

### Hook 종류
- **클라이언트 훅**: 커밋 전/후, 푸시 전/후
- **서버 훅**: 서버 측 이벤트

### 활용 예시

**pre-push hook**
- 모든 피쳐가 pull request를 통해 머지되도록 강제

**pre-commit hook**
- 린트 실패 시 커밋 불가 (코드 스타일 리뷰 감소)

**특정 코멘트 푸시 시**
- Jenkins 빌드 트리거

> 스크립트가 실패하면 해당 이벤트가 중단됩니다.

## 7. Rebase를 통해 할 수 있는 것

### Git Bisect 활용
그래프가 직선(또는 실질적으로 직선)이면 이진 검색으로 버그 포인트를 찾을 수 있습니다.

```bash
git bisect start
git bisect bad  # 현재 버전이 버그 있음
git bisect good v1.0  # v1.0은 정상
# Git이 중간 커밋으로 체크아웃
# 테스트 후 git bisect good/bad 반복
```

### 통계 분석
- 이번 릴리즈에 무슨 커밋이 들어갔는지 한눈에 확인
- 특정 모듈 업데이트 빈도 통계
- 요일별 커밋 빈도
- 개발자별 커밋 통계

## 8. Remote 관리

```bash
# remote 확인
git remote -v

# remote 추가
git remote add origin https://github.com/user/repo.git

# remote URL 변경
git remote set-url origin https://github.com/user/new-repo.git
```

## 9. 트러블슈팅

### 외부 모듈 Git 인식 문제

외부 모듈을 추가한 경우, Git 등록 전에 외부 모듈의 Git이 인식되는 문제가 발생할 수 있습니다.

**해결 방법 1:**
```bash
git init
```

**해결 방법 2:**
1. 외부 모듈을 임시로 삭제
2. 폴더를 이동
3. Git 등록
4. 원상 복구

## 참고 자료

- [A successful Git branching model](https://nvie.com/posts/a-successful-git-branching-model/)
- [Git Log Tutorial](https://www.atlassian.com/git/tutorials/git-log)
- [Git Bisect](https://thoughtbot.com/blog/git-bisect)
