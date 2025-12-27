---
layout: post
title: "Zsh 및 쉘 환경 설정 가이드"
date: 2025-12-28 12:13:00 +0900
categories: bash
tags: [zsh, shell, bash, fish, oh-my-zsh, productivity]
description: "Zsh 설치, Oh My Zsh 플러그인, Fish Shell 비교, Vim 명령어를 설명합니다."
---

# Zsh 및 쉘 환경 설정 가이드

더 생산적인 쉘 환경을 구축하기 위한 가이드입니다.

## Zsh 설치

```bash
# 버전 확인
zsh --version

# 설치
brew install zsh

# 기본 쉘 변경
chsh -s `which zsh`
```

## Zsh 편의 기능

```bash
cd -     # 이전 디렉토리
cd ...   # 상위의 상위 디렉토리
```

## Oh My Zsh 플러그인

### 플러그인 목록

- [공식 플러그인 목록](https://github.com/ohmyzsh/ohmyzsh/wiki/Plugins)
- [인기 플러그인 목록](https://safjan.com/top-popular-zsh-plugins-on-github/)

### 추천 플러그인

#### autojump

자주 사용하는 디렉토리로 빠르게 이동:

```bash
j keyword      # 키워드 포함 폴더로 이동
jc keyword     # 하위 디렉토리로 이동
jo             # 파일 관리자로 열기
jco            # 하위 디렉토리를 파일 관리자로 열기
```

[autojump GitHub](https://github.com/wting/autojump)

#### zsh-syntax-highlighting

명령어 구문 강조:

[zsh-syntax-highlighting GitHub](https://github.com/zsh-users/zsh-syntax-highlighting)

#### zsh-autosuggestions

히스토리 기반 명령어 추천:

[zsh-autosuggestions GitHub](https://github.com/zsh-users/zsh-autosuggestions)

#### zsh-completions

추가 자동 완성:

[zsh-completions GitHub](https://github.com/zsh-users/zsh-completions)

#### alias-finder

사용 가능한 별칭 찾기:

[alias-finder GitHub](https://github.com/ohmyzsh/ohmyzsh/tree/master/plugins/alias-finder)

#### AWS CLI

[aws-cli GitHub](https://github.com/aws/aws-cli)
[ohmyzsh aws plugin](https://github.com/ohmyzsh/ohmyzsh/tree/master/plugins/aws)

#### fzf (Fuzzy Finder)

퍼지 검색 도구:

```bash
history | fzf    # 히스토리 검색
vim `fzf`        # 파일 선택해서 vim으로 열기
```

[fzf GitHub](https://github.com/junegunn/fzf)
[fzf 예제](https://github.com/junegunn/fzf/wiki/examples)

> Note: fzf completion은 AWS 등에서 속도가 느릴 수 있습니다.

#### bat

향상된 cat 명령:

[bat GitHub](https://github.com/sharkdp/bat)

#### fd

향상된 find 명령:

[fd GitHub](https://github.com/sharkdp/fd)

## Fish Shell

Fish Shell은 Zsh와 다른 접근 방식을 가진 쉘입니다:

- Zsh: 탭을 눌러 자동 완성
- Fish: 회색으로 추천 코드를 미리 보여줌

[Fish vs Zsh vs Bash 비교](https://medium.com/better-programming/fish-vs-zsh-vs-bash-reasons-why-you-need-to-switch-to-fish-4e63a66687eb)

## Vim 명령어

### 기본 명령어

| 명령어 | 설명 |
|--------|------|
| `a` | 편집 모드 |
| `Esc` | 편집 모드 취소 |
| `:wq` | 저장 후 종료 |
| `:q!` | 저장 없이 종료 |
| `dd` | 줄 삭제 |

### 이동 명령어

| 명령어 | 설명 |
|--------|------|
| `0` | 줄 처음으로 |
| `$` | 줄 끝으로 |
| `G` | 파일 끝으로 |
| `H` | 화면 맨 위 |
| `M` | 화면 중간 |
| `Ctrl + D` | 페이지 다운 |
| `Ctrl + B` | 페이지 업 |

### 검색

| 명령어 | 설명 |
|--------|------|
| `?` 또는 `/` | 검색 |
| `n` | 다음 검색 결과 |
| `N` | 이전 검색 결과 |

## which 명령어

명령어 위치 찾기:

```bash
which zsh    # /usr/bin/zsh
```

## Alias 설정

### Alias 목록 보기

```bash
alias
```

### Alias 추가

```bash
alias l='ls -l'
```

## 쉘 참고 자료

- [Oh My Zsh 가이드](https://nolboo.kim/blog/2015/08/21/oh-my-zsh/)
