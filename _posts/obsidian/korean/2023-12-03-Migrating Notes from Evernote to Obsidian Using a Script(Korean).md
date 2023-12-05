---
layout: post
title:  "스크립트를 이용한 Evernote에서 Obsidian으로 노트 이전하기"
date:   2023-12-03 21:05:37 +0900
categories: obsidian korean
description: 스크립트를 이용해 Evernote에서 Obsidian으로 노트를 쉽게 이전하세요. ENEX 백업과 Markdown 변환 과정을 안내합니다
locale: ko-KR
---
이 블로그 글에서는 스크립트를 이용해서 Evernote에서 Obsidian으로 모든 노트를 이전하는 과정을 알아볼 거예요. 이 과정은 크게 두 단계로 나뉘는데, 모든 노트를 ENEX 파일로 백업하는 것과 이 파일들을 Obsidian에서 사용할 수 있는 Markdown으로 변환하는 것이죠.

## Evernote 노트를 ENEX 파일로 백업하기

첫 번째 단계는 모든 Evernote 노트를 ENEX 파일로 백업하는 거예요. 이를 위해 GitHub에서 사용할 수 있는 [evernote-backup](https://github.com/vzhd1701/evernote-backup)라는 도구를 사용할 거에요.

백업을 위해 로그인해야 한다는 점을 알아두세요. 소스 코드는 비밀번호를 저장하거나 업로드하지 않아요. 대신에 인증 토큰을 로컬 SQLite 데이터베이스에 보관해요. 이 패키지에 대해 걱정이 있다면, 소스 코드를 실행해볼 수 있어요.

ENEX 파일을 내보내는 코드는 다음과 같아요:

```bash
evernote-backup init-db  # evernote 계정으로 로그인하기.
# evernote-backup init-db --oauth  # google이나 apple 계정의 oauth로 로그인하기.
evernote-backup sync  # 모든 노트를 sqlite db 파일로 다운로드하기
evernote-backup export output_dir/  # db 파일을 output_dir에 있는 enext 파일로 내보내기
```

## ENEX 파일을 Markdown으로 변환하기

> **참고:**
> 이 스크립트는 Mac에서 테스트되었습니다. 다른 운영 체제를 사용하는 경우 동일한 목적을 위해 스크립트를 조정해야 할 수 있습니다.


Obsidian은 Markdown을 사용하므로, 우리는 ENEX 파일을 Markdown으로 변환해야 해요. 이를 위해 GitHub에서 사용할 수 있는 또 다른 도구인 evernote2md를 사용할 거에요.

하지만 이 도구는 폴더를 재귀적으로 지원하지 않는다는 점을 알아두세요. 그래서 디렉토리를 재귀적으로 변환하기 위해 아래의 명령을 사용해야 해요:

```bash
# 'output_dir' 디렉토리에 있는 enex를 'md_output_dir'로 변환하기
find output_dir -type f -name "*.enex" -exec bash -c 'evernote2md $0 "md_${0%.enex}"' {} \;
```

## 전체 스크립트

```bash
# 패키지 설치하기
brew install evernote-backup
brew install evernote2md

evernote-backup init-db  # evernote 계정으로 로그인하기.
# evernote-backup init-db --oauth  # google이나 apple 계정의 oauth로 로그인하기.
evernote-backup sync  # 모든 노트를 sqlite db 파일로 다운로드하기
evernote-backup export output_dir/  # db 파일을 output_dir에 있는 enext 파일로 내보내기

# 'output_dir' 디렉토리에 있는 enex를 'md_output_dir'로 변환하기
find output_dir -type f -name "*.enex" -exec bash -c 'evernote2md $0 "md_${0%.enex}"' {} \;

# 이미지 파일명 변경
DIR=md_output_dir
find $DIR -type f \( -name ".png" -o -name ".jpg" -o -name ".gif" \) -exec bash -c 'mv "$0" "${0%.*}no-name-image.${0##*.}"' {} \;

# 마크다운 파일에 링크 파일명 변경
LC_ALL=C find $DIR -type f -exec sed -i '' 's/(image\/.png)/(image\/no-name-image.png)/g' {} \;
LC_ALL=C find $DIR -type f -exec sed -i '' 's/(image\/.jpg)/(image\/no-name-image.jpg)/g' {} \;
LC_ALL=C find $DIR -type f -exec sed -i '' 's/(image\/.gif)/(image\/no-name-image.gif)/g' {} \;

```

그럼 이제 끝이에요! 스크립트를 이용해서 Evernote에서 Obsidian으로 모든 노트를 성공적으로 이전했어요. 즐거운 노트 작성이 되길 바랍니다!