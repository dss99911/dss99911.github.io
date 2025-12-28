---
layout: post
title: "Google Chart API 사용법"
date: 2025-12-28
categories: [tools, common]
tags: [google, chart, api, visualization]
---

Google Chart API를 사용하여 URL만으로 차트 이미지를 생성하는 방법을 정리했습니다.

## 기본 URL 구조

Google Chart API의 기본 URL 형식은 다음과 같습니다:

```
https://chart.googleapis.com/chart?cht=<chart_type>&chd=<chart_data>&chs=<chart_size>&...additional_parameters...
```

## 주요 파라미터

- `cht`: 차트 타입 (예: `p3`은 3D 파이 차트)
- `chd`: 차트 데이터
- `chs`: 차트 크기 (너비x높이)
- `chl`: 레이블

## 3D 파이 차트 예시

```
https://chart.googleapis.com/chart?
  cht=p3&
  chs=250x100&
  chd=t:60,40&
  chl=Hello|World
```

결과 URL: [https://chart.googleapis.com/chart?chs=250x100&chd=t:60,40&cht=p3&chl=Hello%7CWorld](https://chart.googleapis.com/chart?chs=250x100&chd=t:60,40&cht=p3&chl=Hello%7CWorld)

## 참고 문서

공식 문서: [Google Chart Image Documentation](https://developers.google.com/chart/image/docs/making_charts)

---

> 참고: Google Chart Image API는 deprecated 되었으나, 간단한 차트 생성에는 여전히 유용하게 사용할 수 있습니다. 복잡한 차트가 필요한 경우 Google Charts JavaScript 라이브러리 사용을 권장합니다.
