---
layout: post
title: IntelliJ에서 Python 기본 Working Directory를 프로젝트 폴더로 설정하는 방법
date: 2025-01-09 01:57:37 +0900
categories: tools
---

# IntelliJ에서 Python 기본 Working Directory를 프로젝트 폴더로 설정하는 방법

IntelliJ IDEA에서 Python 프로젝트를 실행할 때 기본 **Working Directory**를 프로젝트 폴더로 설정하고 싶다면, `$ContentRoot$`를 사용하는 방법을 추천합니다. 이 글에서는 `$ContentRoot$`를 활용하여 문제를 해결하는 방법을 단계별로 설명합니다.

---


## 설정 방법

### Step 1: Run/Debug Configurations 열기
1. IntelliJ 상단 메뉴에서 **Run > Edit Configurations**를 클릭합니다.
2. Edit configuration templates... 클릭 (template을 변경해야, 새 configuration 생성시 자동으로 적용이 됩니다)
3. python 선택

### Step 2: Working Directory 설정
1. **Working directory** 필드에 `$ContentRoot$`를 입력합니다.
2. 설정을 저장합니다.
