---
layout: post
title:  "데스크톱과 안드로이드 장치 간의 Obsidian 노트 무료 동기화"
date:   2023-12-03 21:05:37 +0900
categories: obsidian korean
description: 데스크톱과 안드로이드 간 Obsidian 노트 동기화 방법을 알아보세요. Google 드라이브용 Autosync와 Syncthing을 활용한 무료 솔루션을 비교해서 설명합니다.
locale: ko-KR
---
이 블로그 글에서는 데스크톱과 안드로이드 장치 간에 Obsidian 노트를 어떻게 무료로 동기화하는지 알아볼 거예요. Mac과 iPhone 사용자들은 iCloud를 이용해서 노트 파일을 쉽게 동기화할 수 있고, Obsidian Pro 사용자들은 내장된 동기화 기능을 가지고 있지만, 안드로이드 사용자들은 다른 방법이 필요하죠.

## Google 드라이브용 Autosync

하나의 방법은 [Autosync for Google Drive](https://play.google.com/store/apps/details?id=com.ttxapps.drivesync&hl=en_US)를 사용하는 거예요. 이 앱은 Google 드라이브의 노트 파일을 동기화하고 안드로이드 장치와 Google 드라이브 파일을 동기화 상태로 유지해줘요. 노트북에서는 [Google Drive for Desktop](https://www.google.com/drive/download/) 을 사용해서 파일에 접근할 수 있어요.

**장점:**

- 사용하기 쉬워요

**단점:**

- 변경이 발생했을 때 즉시 파일을 동기화하지 않아요
- 무료 버전에서는 하나의 디렉토리만 설정할 수 있어요
- Google 드라이브의 모든 파일에 대한 접근을 요청해요
- 무료 버전에 광고가 포함되어 있어요

## Syncthing

또 다른 방법은 [Syncthing](https://syncthing.net/)인데, 클라우드를 사용하지 않고 안드로이드 장치와 데스크톱 간에 노트 파일을 동기화해줘요. 안드로이드 장치와 데스크톱 모두에 애플리케이션을 설치해야 해요. 노트를 잃어버릴까 봐 걱정한다면, 장치와 동기화를 지원하는 클라우드 서비스를 사용할 수 있어요. 예를 들어, [Google Drive for Desktop](https://www.google.com/drive/download/) 또는 [Obsidian Git plugin](https://github.com/denolehov/obsidian-git)을 사용할 수 있어요.

**장점:**

- 변경이 발생하면 즉시 파일을 저장해요
- 클라우드에 의존하지 않아요
- 파일 버전 관리를 지원해요
- 무료이고 광고가 없어요

**단점:**

- 두 장치 모두에서 네트워크 연결이 작동하지 않으면 동기화가 이루어질 수 없어요.

## 동기화 오류 처리

이 노트를 안드로이드에서 사용할 때, 안드로이드 파일 시스템은 파일 이름에 특정 특수 문자를 지원하지 않는다는 점을 알아두어야 해요. 이에는 `/, <, >, *, ", :, ?, , 및 |` 가 포함돼요. 다음 명령을 사용해서 이런 문자들을 제거할 수 있어요:

```bash
DIR=md_output_dir

find $DIR -type f -name "*[:/<>|*?\\\\"'"'"]*" -exec bash -c 'mv -i ${0} $(echo ${0} | tr '"'"':<>*?|\\"'"'"' "_")' {} \;
```

그럼 이제 끝이에요! 데스크톱과 안드로이드 장치 간에 Obsidian 노트를 동기화하는 두 가지 무료 방법을 알게 되었어요. 즐거운 노트 작성이 되길 바랍니다!