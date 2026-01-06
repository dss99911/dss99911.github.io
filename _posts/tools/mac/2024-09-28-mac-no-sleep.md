---
layout: post
title: 맥북 수면모드 off 시키기
date: 2024-09-28 01:57:37 +0900
categories: [tools, mac]
tags: [mac, macos, sleep-mode, pmset, power-management]
image: /assets/images/posts/thumbnails/2024-09-28-mac-no-sleep.png
---

## 배경
장시간 처리해야 하고, 맥북을 닫았을 때도, 수행이 되어야 한다면, sleep mode를 off 시키자

## sleep mode off 시키기
```
sudo pmset -a disablesleep 1
# sudo pmset -a disablesleep 0  # 다시 on 시키기
```

off 시킬 경우, 맥북을 닫아도, 화면이 켜져 있음
만약 화면은 끄고 싶다면, lock screen에서 esc를 누르면, 화면 절전 모드 상태가 되어, 화면은 꺼지지만, 프로세스는 돌아감.

만약 맥북을 닫았을 때, 자동으로 꺼지게 하고 싶다면, 시스템 세팅에서 Lock screen 세팅에서 inactive 몇 분 후에 화면 꺼지게 할 수 있다