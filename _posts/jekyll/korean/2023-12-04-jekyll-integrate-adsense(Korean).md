---
layout: post
title: Jekyll에서 Adsense의 자동 광고 연동하기
date: 2023-12-04 04:05:37 +0900
categories: jekyll korean
locale: ko-KR
---

이 가이드에서는 Adsense의 자동 광고를 웹사이트에 추가하는 방법을 안내하겠습니다.

![Alt text](/assets/images/posts/jekyll/image-4.png){:style="width: 30%;"}

자동 광고를 사용하면 Adsense 통합이 매우 간편해집니다. 각 페이지에 광고를 수동으로 추가할 필요가 없습니다. 대신 Adsense는 광고를 사이트 전체의 최적의 위치에 자동으로 배치합니다. 이는 시간을 절약할 뿐만 아니라 광고가 전략적으로 배치되어 사용자 경험을 향상시킵니다.

## 단계 1: 새 사이트 생성
먼저, Adsense에서 새로운 사이트를 생성해야 합니다.

![Alt text](/assets/images/posts/jekyll/image-3.png)

사이트를 생성한 후, ads.txt에서 텍스트를 복사하여 Jekyll 프로젝트의 루트 경로에 ads.txt라는 파일을 생성합니다. 서버에 배포한 후에 확인합니다.

## 단계 2: 자동 광고 추가
다음으로, 광고 페이지로 이동하여 편집 버튼을 클릭합니다.

![Alt text](/assets/images/posts/jekyll/image-2.png)

이 페이지에서는 웹사이트에 표시하려는 광고를 선택할 수 있습니다.

![image](/assets/images/posts/jekyll/image-1.png)

광고를 선택한 후, 빨간색 '코드 받기' 버튼을 클릭합니다.

![image](/assets/images/posts/jekyll/image.png)

스크립트를 복사하여 `_includes/head.html`에 추가합니다. `head.html`은 모든 페이지에 포함되므로, 이렇게 하면 광고가 전체 사이트에 표시됩니다.

![Alt text](/assets/images/posts/jekyll/image-5.png)
Ads.txt의 상태가 `Authorized`이고 승인 상태가 `Getting Ready`라면 잘 진행하고 있는 것입니다. 이제 해야 할 일은 AdSense의 검토가 완료되기를 기다리는 것뿐입니다. 이 과정은 며칠에서 몇 주까지 걸릴 수 있습니다. 그러니 AdSense가 작업을 하는 동안 편안하게 기다리세요.

그게 다입니다! 성공적으로 Adsense의 자동 광고를 웹사이트에 추가했습니다. 수익 창출을 즐기세요!