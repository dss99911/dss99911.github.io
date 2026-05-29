---
layout: post
title: "Google Chart API 사용법"
date: 2025-12-28
categories: [tools, common]
tags: [google, chart, api, visualization]
image: /assets/images/posts/thumbnails/2025-12-28-google-chart-api.png
redirect_from:
  - "/tools/common/2025/12/28/google-chart-api.html"
---

Google Chart API를 사용하여 URL만으로 차트 이미지를 생성하는 방법을 정리했습니다. 별도의 JavaScript 라이브러리 없이 URL 파라미터만으로 차트 이미지를 만들 수 있어, 이메일이나 마크다운 문서, 위키 페이지 등에 간편하게 차트를 삽입할 수 있습니다.

## 기본 URL 구조

Google Chart API의 기본 URL 형식은 다음과 같습니다:

```
https://chart.googleapis.com/chart?cht=<chart_type>&chd=<chart_data>&chs=<chart_size>&...additional_parameters...
```

이 URL을 브라우저에서 열거나 `<img>` 태그의 `src`로 사용하면 차트 이미지가 렌더링됩니다.

## 주요 파라미터

- `cht`: 차트 타입 (예: `p3`은 3D 파이 차트)
- `chd`: 차트 데이터
- `chs`: 차트 크기 (너비x높이, 최대 300,000 픽셀)
- `chl`: 레이블
- `chco`: 차트 색상 (16진수 컬러 코드)
- `chtt`: 차트 제목
- `chdl`: 범례(legend) 텍스트
- `chxt`: 축 표시 여부 (예: `x,y`)
- `chxl`: 축 레이블

## 차트 타입 종류

`cht` 파라미터에 사용할 수 있는 주요 차트 타입은 다음과 같습니다:

| 코드 | 차트 타입 |
|------|-----------|
| `p` | 2D 파이 차트 |
| `p3` | 3D 파이 차트 |
| `bvg` | 수직 바 차트 (그룹) |
| `bhs` | 수평 바 차트 (스택) |
| `lc` | 라인 차트 |
| `r` | 레이더 차트 |
| `v` | 벤 다이어그램 |
| `qr` | QR 코드 |

## 데이터 인코딩 방식

`chd` 파라미터는 여러 인코딩 방식을 지원합니다:

### 텍스트 인코딩 (t:)
가장 직관적인 방식으로, 0~100 사이의 값을 콤마로 구분합니다.
```
chd=t:60,40
```

### 확장 인코딩 (e:)
더 정밀한 값을 표현할 수 있으며, 0~4095 범위를 지원합니다.
```
chd=e:BaPoqM
```

### 스케일링
텍스트 인코딩 사용 시 `chds` 파라미터로 데이터 범위를 지정할 수 있습니다:
```
chd=t:30,70,200&chds=0,300
```

## 3D 파이 차트 예시

```
https://chart.googleapis.com/chart?
  cht=p3&
  chs=250x100&
  chd=t:60,40&
  chl=Hello|World
```

결과 URL: [https://chart.googleapis.com/chart?chs=250x100&chd=t:60,40&cht=p3&chl=Hello%7CWorld](https://chart.googleapis.com/chart?chs=250x100&chd=t:60,40&cht=p3&chl=Hello%7CWorld)

## 바 차트 예시

```
https://chart.googleapis.com/chart?
  cht=bvg&
  chs=400x200&
  chd=t:10,50,30,80&
  chl=Q1|Q2|Q3|Q4&
  chtt=Quarterly+Sales&
  chco=4285F4
```

## QR 코드 생성 예시

Google Chart API로 QR 코드도 생성할 수 있습니다:

```
https://chart.googleapis.com/chart?
  cht=qr&
  chs=200x200&
  chl=https://example.com
```

이 기능은 별도의 QR 코드 라이브러리 없이 URL만으로 QR 코드를 생성할 수 있어 매우 편리합니다.

## 실용적인 활용 사례

1. **이메일 리포트**: HTML 이메일에 `<img>` 태그로 차트를 삽입하여 별도 첨부 파일 없이 시각적 데이터를 전달할 수 있습니다.
2. **마크다운 문서**: GitHub README나 위키 페이지에 이미지 URL로 삽입하면 동적 차트를 표시할 수 있습니다.
3. **슬랙/메신저**: URL을 공유하면 미리보기로 차트가 표시됩니다.
4. **서버 사이드 리포트**: 서버에서 URL을 조합해 PDF 리포트에 차트 이미지를 삽입할 수 있습니다.

## 주의사항 및 제한

- 차트 이미지 최대 크기는 300,000 픽셀 (예: 1000x300)입니다.
- URL 전체 길이가 2048자를 초과하면 안 됩니다.
- 복잡한 데이터셋에는 적합하지 않으며, 간단한 시각화에 적합합니다.
- API 호출 횟수에 대한 명시적인 제한은 없지만, 과도한 호출은 제한될 수 있습니다.

## 색상 커스터마이징

`chco` 파라미터를 사용하여 차트의 색상을 지정할 수 있습니다:

```
chco=FF0000,00FF00,0000FF
```

여러 데이터 시리즈가 있는 경우 콤마로 구분하여 각 시리즈의 색상을 개별 지정할 수 있으며, 파이 차트의 경우 각 슬라이스의 색상을 파이프(`|`)로 구분합니다.

## 대안: Google Charts JavaScript 라이브러리

더 복잡한 인터랙티브 차트가 필요하다면 [Google Charts JavaScript 라이브러리](https://developers.google.com/chart)를 사용하는 것이 좋습니다. 이 라이브러리는 마우스 호버, 클릭 이벤트, 애니메이션 등 다양한 인터랙티브 기능을 제공합니다.

## 참고 문서

공식 문서: [Google Chart Image Documentation](https://developers.google.com/chart/image/docs/making_charts)

---

> 참고: Google Chart Image API는 deprecated 되었으나, 간단한 차트 생성에는 여전히 유용하게 사용할 수 있습니다. 복잡한 차트가 필요한 경우 Google Charts JavaScript 라이브러리 사용을 권장합니다.
