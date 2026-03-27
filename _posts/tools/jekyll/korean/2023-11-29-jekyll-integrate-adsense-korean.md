---
layout: post
title: Jekyll에서 Adsense의 자동 광고 연동하기
date: 2023-11-29 04:05:37 +0900
categories: jekyll korean
tags: [jekyll, adsense, google, monetization, ads]
description: Jekyll에서 Adsense의 자동 광고를 쉽게 연동하는 방법을 알아보세요. 새 사이트 생성부터 광고 추가까지 단계별 안내를 제공합니다
locale: ko-KR
image: /assets/images/posts/thumbnails/2023-12-04-jekyll-adsense-korean.png
---

이 가이드에서는 Adsense의 자동 광고를 웹사이트에 추가하는 방법을 안내하겠습니다.

![Alt text](/assets/images/posts/jekyll/image-4.png){:style="width: 30%;"}

자동 광고를 사용하면 Adsense 통합이 매우 간편해집니다. 각 페이지에 광고를 수동으로 추가할 필요가 없습니다. 대신 Adsense는 광고를 사이트 전체의 최적의 위치에 자동으로 배치합니다. 이는 시간을 절약할 뿐만 아니라 광고가 전략적으로 배치되어 사용자 경험을 향상시킵니다.

## 사전 준비

시작하기 전에 다음 사항이 준비되어 있어야 합니다:

- 배포되어 공개적으로 접근 가능한 Jekyll 블로그 (GitHub Pages, Netlify 등)
- Google AdSense 계정 ([adsense.google.com](https://adsense.google.com)에서 가입)
- Jekyll 프로젝트 구조에 대한 기본적인 이해

## 단계 1: 새 사이트 생성
먼저, Adsense에서 새로운 사이트를 생성해야 합니다.

![Alt text](/assets/images/posts/jekyll/image-3.png)

사이트를 생성한 후, ads.txt에서 텍스트를 복사하여 Jekyll 프로젝트의 루트 경로에 ads.txt라는 파일을 생성합니다. 서버에 배포한 후에 확인합니다.

`ads.txt` 파일은 AdSense 연동에서 중요한 역할을 합니다. 이 파일은 무단 광고 인벤토리 판매를 방지하고, 합법적인 광고 네트워크만 사이트에 광고를 게재할 수 있도록 보장합니다. 파일 내용은 다음과 같은 형태입니다:

```
google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0
```

배포 후 `https://yourdomain.com/ads.txt`에서 이 파일이 정상적으로 접근 가능한지 확인하세요.

## 단계 2: 자동 광고 추가
다음으로, 광고 페이지로 이동하여 편집 버튼을 클릭합니다.

![Alt text](/assets/images/posts/jekyll/image-2.png)

이 페이지에서는 웹사이트에 표시하려는 광고를 선택할 수 있습니다.

![image](/assets/images/posts/jekyll/image-1.png)

사용 가능한 자동 광고 유형은 다음과 같습니다:

- **인페이지 광고**: 페이지 콘텐츠 내부에 표시되는 광고
- **앵커 광고**: 화면 상단 또는 하단에 고정되는 광고
- **비네트 광고**: 페이지 전환 시 나타나는 전체 화면 광고
- **사이드 레일 광고**: 와이드스크린 디스플레이의 양쪽에 표시되는 광고

사이트 레이아웃과 사용자 경험에 가장 적합한 광고 유형을 선택하세요. 인페이지 광고와 앵커 광고는 사용자에게 가장 방해가 적으므로 처음에는 이 두 가지부터 시작하는 것을 추천합니다.

광고를 선택한 후, 빨간색 '코드 받기' 버튼을 클릭합니다.

![image](/assets/images/posts/jekyll/image.png)

스크립트를 복사하여 `_includes/head.html`에 추가합니다. `head.html`은 모든 페이지에 포함되므로, 이렇게 하면 광고가 전체 사이트에 표시됩니다.

스크립트 태그는 다음과 유사한 형태입니다:

```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
     crossorigin="anonymous"></script>
```

## 단계 3: 확인 및 승인 대기

![Alt text](/assets/images/posts/jekyll/image-5.png)
Ads.txt의 상태가 `Authorized`이고 승인 상태가 `Getting Ready`라면 잘 진행하고 있는 것입니다. 이제 해야 할 일은 AdSense의 검토가 완료되기를 기다리는 것뿐입니다. 이 과정은 며칠에서 몇 주까지 걸릴 수 있습니다. 그러니 AdSense가 작업을 하는 동안 편안하게 기다리세요.

검토 과정에서 Google은 사이트가 [프로그램 정책](https://support.google.com/adsense/answer/48182)을 준수하는지 확인합니다. 거절되는 일반적인 이유로는 콘텐츠 부족, 정책 위반, 내비게이션 문제 등이 있습니다. 거절된 경우 문제를 수정한 후 다시 신청할 수 있습니다.

## 일반적인 문제 해결

### 광고가 표시되지 않는 경우
- **새 사이트**: 승인 후 광고가 표시되기까지 최대 48시간이 걸릴 수 있습니다.
- **광고 차단기**: 테스트 시 광고 차단기를 비활성화했는지 확인하세요.
- **트래픽이 적은 페이지**: 트래픽이 매우 적은 페이지에서는 AdSense가 광고를 게재하지 않을 수 있습니다.

### ads.txt 관련 경고
- 파일이 하위 디렉토리가 아닌 도메인 루트에 있는지 확인하세요.
- 파일의 불필요한 공백이나 서식 문제를 점검하세요.
- `_config.yml`에서 `exclude` 설정으로 `ads.txt`가 빌드에서 제외되지 않았는지 확인하세요.

## 수익 최적화 팁

1. **콘텐츠 품질**: 고품질의 독창적인 콘텐츠를 작성하세요. 양질의 콘텐츠는 더 많은 방문자와 높은 단가의 광고를 유도합니다.
2. **페이지 속도**: Jekyll 사이트가 빠르게 로딩되도록 하세요. 이미지 최적화와 JavaScript 최소화가 중요합니다.
3. **모바일 최적화**: 대부분의 트래픽이 모바일에서 발생하므로, 반응형 테마를 사용하고 모든 화면 크기에서 광고가 정상적으로 표시되는지 확인하세요.
4. **광고 균형**: AdSense의 광고 균형 기능을 사용하여 광고 수를 줄이면서도 대부분의 수익을 유지할 수 있습니다.

그게 다입니다! 성공적으로 Adsense의 자동 광고를 웹사이트에 추가했습니다. 수익 창출을 즐기세요!