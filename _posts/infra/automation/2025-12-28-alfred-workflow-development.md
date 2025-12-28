---
layout: post
title: "Alfred Workflow 개발 가이드"
date: 2025-12-28 12:30:00 +0900
categories: [infra, automation]
tags: [alfred, mac, automation, workflow, productivity]
description: "Alfred Workflow를 개발하는 방법을 알아봅니다. Script Filter, 디버깅, 추천 워크플로우까지 정리합니다."
---

Alfred는 macOS의 강력한 생산성 도구입니다. 이 글에서는 Alfred Workflow를 개발하고 디버깅하는 방법을 정리합니다.

## Script Filter

Script Filter는 Alfred에서 동적인 결과 목록을 표시하는 핵심 기능입니다.

### 기본 XML 구조

```xml
<items>
    <item uid='' arg=''>
        <title></title>
        <subtitle></subtitle>
    </item>
</items>
```

### 상세 예시

```xml
<items>
    <item uid="home" valid="YES" autocomplete="Home Folder" type="file">
        <title>Home Folder</title>
        <subtitle>Home folder ~/</subtitle>
        <subtitle mod="shift">Subtext when shift is pressed</subtitle>
        <subtitle mod="fn">Subtext when fn is pressed</subtitle>
        <subtitle mod="ctrl">Subtext when ctrl is pressed</subtitle>
        <subtitle mod="alt">Subtext when alt is pressed</subtitle>
        <subtitle mod="cmd">Subtext when cmd is pressed</subtitle>
        <text type="copy">Text when copying</text>
        <text type="largetype">Text for LargeType</text>
        <icon type="fileicon">~/</icon>
        <arg>~/</arg>
    </item>
</items>
```

### 주요 속성

| 속성 | 설명 |
|------|------|
| `uid` | 항목의 고유 식별자 |
| `arg` | 선택 시 전달되는 인자 |
| `valid` | 선택 가능 여부 (YES/NO) |
| `autocomplete` | Tab 자동완성 텍스트 |
| `type` | 항목 유형 (file, default) |

### 수정자 키별 서브타이틀

`mod` 속성을 사용하여 수정자 키를 눌렀을 때 다른 서브타이틀을 표시할 수 있습니다:
- `shift`: Shift 키
- `fn`: Fn 키
- `ctrl`: Control 키
- `alt`: Option 키
- `cmd`: Command 키

## 디버깅

### Python (alfred-workflow)

```python
wf.logger.debug(wf.args)
```

### Bash에서 콘솔 출력

```bash
>&2 echo "Log this output to the console"
```

표준 에러(`>&2`)로 출력하면 Alfred의 디버그 콘솔에서 확인할 수 있습니다.

## 추천 워크플로우

다양한 커뮤니티 워크플로우를 활용하면 생산성을 크게 높일 수 있습니다.

### 워크플로우 다운로드 사이트

- [Packal](http://www.packal.org/)
- [Alfred 공식 워크플로우](https://www.alfredapp.com/workflows/)

### 검색 관련

| 워크플로우 | 링크 |
|-----------|------|
| Naver Search | [GitHub](https://github.com/Kuniz/alfnaversearch/blob/master/Naver%20Search.alfredworkflow) |
| Daum Search | [GitHub](https://github.com/aseom/alfred-workflows) |
| Google Similar Image | [GitHub](https://github.com/deanishe/alfred-similar-image-search/releases/tag/v1.0) |

### 유틸리티

| 워크플로우 | 설명 | 링크 |
|-----------|------|------|
| bit.ly | URL 단축 | [GitHub](https://github.com/techcraver/alfred-bitly-shortener) |
| Timer | 카운트다운 타이머 | [GitHub](https://github.com/dbader/alfred-countdown-timer) |
| Clip Saver | 클립보드 저장 | [GitHub](https://github.com/luckman212/alfredworkflows) |

**Tip**: 클립보드 이미지는 Preview에서 `File -> Open from Clipboard`로도 사용할 수 있습니다.

### 터미널 통합

| 워크플로우 | 설명 | 링크 |
|-----------|------|------|
| iTerm Integration | Alfred에서 iTerm 사용 | [GitHub](https://github.com/vitorgalvao/custom-alfred-iterm-scripts) |

## 워크플로우 개발 팁

### JSON 형식 (최신 방식)

Alfred 3.5+에서는 JSON 형식도 지원합니다:

```json
{
  "items": [
    {
      "uid": "home",
      "title": "Home Folder",
      "subtitle": "Home folder ~/",
      "arg": "~/",
      "icon": {
        "type": "fileicon",
        "path": "~/"
      }
    }
  ]
}
```

### 아이콘 유형

- `fileicon`: 파일/폴더의 시스템 아이콘 사용
- `filetype`: 파일 확장자 기반 아이콘
- 기본값: 워크플로우 내 아이콘 파일 경로

## 결론

Alfred Workflow를 개발하면 반복적인 작업을 빠르게 자동화할 수 있습니다. Script Filter를 활용해 동적인 검색 결과를 제공하고, 다양한 수정자 키 조합으로 풍부한 인터랙션을 구현해 보세요.
