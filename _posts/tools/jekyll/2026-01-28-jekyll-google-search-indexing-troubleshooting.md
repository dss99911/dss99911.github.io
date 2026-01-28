---
layout: post
title: "Jekyll GitHub Pages - Google Search Indexing 문제 해결 완벽 가이드"
date: 2026-01-28 10:00:00 +0900
categories: [tools, jekyll]
description: "Jekyll로 GitHub Pages 블로그를 운영할 때 Google Search Indexing이 안 되는 문제의 원인과 해결 방법을 체계적으로 정리했습니다. SEO 최적화부터 Google Search Console 활용까지 완벽 가이드."
tags: [Jekyll, SEO, Google Search Console, GitHub Pages, Indexing, Sitemap]
image: /assets/images/posts/thumbnails/2026-01-28-jekyll-google-indexing.png
---

Jekyll로 GitHub Pages 블로그를 운영하다 보면 가장 답답한 문제 중 하나가 **Google Search에 내 글이 안 나오는 것**입니다. 분명히 sitemap도 만들고, robots.txt도 설정했는데 왜 Google에서 검색이 안 될까요? 이 글에서는 Jekyll GitHub Pages의 SEO와 Google Search Indexing 문제를 체계적으로 다룹니다.

---

## SEO(검색 엔진 최적화)란?

SEO(Search Engine Optimization)는 검색 엔진이 웹사이트를 잘 이해하고, 검색 결과에 적절히 노출되도록 최적화하는 작업입니다.

### SEO의 핵심 요소

```
┌─────────────────────────────────────────────────────────────┐
│                    SEO 핵심 요소                             │
├─────────────────────────────────────────────────────────────┤
│  1. 기술적 SEO (Technical SEO)                              │
│     - sitemap.xml: 사이트 구조 정보                          │
│     - robots.txt: 크롤링 허용/차단 규칙                       │
│     - 페이지 로딩 속도                                       │
│     - 모바일 최적화                                          │
│     - HTTPS 사용                                            │
│                                                             │
│  2. 온페이지 SEO (On-page SEO)                              │
│     - title 태그: 페이지 제목                                │
│     - meta description: 페이지 설명                          │
│     - canonical URL: 표준 URL 지정                          │
│     - 구조화된 데이터 (JSON-LD)                              │
│     - 헤더 태그 (H1, H2, H3)                                │
│                                                             │
│  3. 콘텐츠 SEO                                              │
│     - 고품질 콘텐츠                                          │
│     - 적절한 키워드 사용                                     │
│     - 내부 링크 구조                                         │
│                                                             │
│  4. 오프페이지 SEO                                          │
│     - 백링크 (다른 사이트에서의 링크)                         │
│     - 소셜 미디어 공유                                       │
└─────────────────────────────────────────────────────────────┘
```

---

## Jekyll의 SEO 도구들

### 1. jekyll-seo-tag 플러그인

Jekyll의 공식 SEO 플러그인으로, 자동으로 다음을 생성합니다:

- `<title>` 태그
- `<meta name="description">` 태그
- Canonical URL
- Open Graph 메타 태그 (Facebook, LinkedIn)
- Twitter Card 메타 태그
- JSON-LD 구조화 데이터

**설치:**

```yaml
# _config.yml
plugins:
  - jekyll-seo-tag
```

```liquid
{% raw %}
<!-- _layouts/default.html의 <head> 안에 -->
{% seo %}
{% endraw %}
```

**각 포스트에서 설정:**

```yaml
---
layout: post
title: "포스트 제목"
description: "160자 이내의 포스트 설명. Google 검색 결과에 표시됩니다."
image: /assets/images/thumbnail.png
---
```

### 2. jekyll-sitemap 플러그인

sitemap.xml을 자동 생성합니다:

```yaml
# _config.yml
plugins:
  - jekyll-sitemap
```

### 3. robots.txt

검색 엔진 크롤러에게 사이트 크롤링 규칙을 알려줍니다:

```
User-agent: *
Allow: /
Sitemap: https://your-domain.github.io/sitemap.xml
```

---

## Google Search Indexing이 안 되는 일반적인 원인

### 1. "Discovered - currently not indexed" 문제

Google Search Console에서 가장 많이 보이는 상태입니다.

**의미:**
- Google이 URL을 발견했지만 아직 크롤링하지 않음
- 서버 과부하 방지를 위해 크롤링을 연기함

**GitHub Pages 특수 상황:**
- GitHub Pages는 많은 사이트가 동일한 서버/IP를 공유
- Google이 GitHub 서버에 과부하를 주지 않기 위해 크롤링을 제한할 수 있음
- 결과적으로 개별 사이트의 인덱싱이 늦어질 수 있음

### 2. redirect_from 플러그인 문제

```yaml
# 문제가 되는 설정
---
redirect_from:
  - /old-url/
---
```

`redirect_from`을 사용하면 리다이렉트 페이지가 생성되는데, 이 페이지들이:
- sitemap.xml에 포함됨
- `noindex` 메타 태그가 포함되어 있음
- Google이 이를 크롤링하면 "인덱싱 제외" 처리

**해결책:** 불필요한 `redirect_from` 제거 또는 sitemap에서 제외

### 3. URL 변경으로 인한 문제

블로그 URL 구조를 변경하면:
- 기존 인덱싱된 URL이 404 에러 발생
- 새 URL이 다시 인덱싱되기까지 시간 소요
- 사이트 전체 신뢰도 하락 가능

### 4. 콘텐츠 품질 문제

Google은 다음과 같은 페이지를 인덱싱하지 않을 수 있습니다:
- 너무 짧은 콘텐츠
- 중복 콘텐츠
- 가치가 낮다고 판단되는 콘텐츠

---

## 체계적인 해결 방법

### Step 1: Google Search Console 설정

1. [Google Search Console](https://search.google.com/search-console) 접속
2. 속성 추가 → URL 접두어 방식으로 `https://username.github.io` 등록
3. 소유권 확인 (HTML 파일 업로드 또는 메타 태그)

**jekyll-seo-tag로 소유권 확인:**

```yaml
# _config.yml
google_site_verification: "your-verification-code"
```

### Step 2: Sitemap 제출

1. Search Console → 색인 → Sitemaps
2. sitemap.xml 제출
3. 상태가 "성공"인지 확인

### Step 3: 수동 인덱싱 요청

각 URL에 대해 수동으로 인덱싱 요청:

1. Search Console 상단 검색창에 URL 입력
2. "URL 검사" 클릭
3. "인덱싱 요청" 클릭

**주의:** 하루에 요청 횟수 제한이 있음 (약 10-50회)

### Step 4: 내부 링크 강화

```markdown
관련 글:
- [Jekyll SEO 최적화 가이드](/jekyll/2023/12/05/jekyll-seo.html)
- [Jekyll 테마 설정하기](/jekyll/2023/12/04/jekyll-theme.html)
```

내부 링크는 Google이 새 페이지를 발견하는 데 도움을 줍니다.

### Step 5: 외부 홍보

소셜 미디어에서 공유하면 인덱싱 속도가 빨라질 수 있습니다:
- Reddit 관련 서브레딧에 공유
- Twitter/X에서 공유
- LinkedIn에서 공유
- 개발자 커뮤니티 (Dev.to 등)에 크로스포스팅

---

## _config.yml SEO 최적화 예시

```yaml
# 사이트 기본 정보
title: "Your Blog Title"
description: "블로그에 대한 설명. 160자 이내로 작성."
url: "https://username.github.io"
baseurl: ""

# 언어 설정
lang: ko

# 소셜/SEO 설정
twitter:
  username: your_twitter
  card: summary_large_image

social:
  name: Your Name
  links:
    - https://twitter.com/your_twitter
    - https://github.com/your_github

# Google 확인
google_site_verification: "your-code"

# 기본 이미지 설정
defaults:
  - scope:
      path: ""
    values:
      image: /assets/images/default-og.png

# 플러그인
plugins:
  - jekyll-seo-tag
  - jekyll-sitemap
  - jekyll-feed
```

---

## 포스트 Front Matter 최적화

```yaml
---
layout: post
title: "검색에 잘 노출되는 제목 작성하기"  # 60자 이내
date: 2026-01-28 10:00:00 +0900
categories: [category1, category2]
description: "이 글에서 다루는 내용을 160자 이내로 요약. 핵심 키워드를 자연스럽게 포함시키세요."
tags: [tag1, tag2, tag3]
image: /assets/images/posts/thumbnail.png  # OG 이미지
author: your_name
---
```

### 좋은 description 작성법

```yaml
# 나쁜 예
description: "Jekyll 블로그 글입니다."

# 좋은 예
description: "Jekyll GitHub Pages에서 Google Search Indexing이 안 되는 문제를 해결하는 방법. sitemap, robots.txt 설정부터 Search Console 활용까지 단계별로 설명합니다."
```

---

## sitemap.xml 커스터마이징

기본 jekyll-sitemap 대신 커스텀 sitemap을 사용하면 더 세밀한 제어가 가능합니다:

```xml
{% raw %}
---
layout: null
sitemap:
  exclude: 'yes'
---
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>{{ site.url }}/</loc>
    <lastmod>{{ site.time | date_to_xmlschema }}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  {% for post in site.posts %}
  <url>
    <loc>{{ site.url }}{{ post.url }}</loc>
    <lastmod>{{ post.date | date_to_xmlschema }}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  {% endfor %}
</urlset>
{% endraw %}
```

### 특정 페이지 제외하기

```yaml
---
layout: page
title: "Private Page"
sitemap: false  # sitemap에서 제외
---
```

---

## 인덱싱 상태별 대응 방법

| 상태 | 의미 | 대응 방법 |
|------|------|----------|
| Discovered - currently not indexed | 발견됨, 아직 크롤링 안 함 | 수동 인덱싱 요청, 내부 링크 추가 |
| Crawled - currently not indexed | 크롤링됨, 인덱싱 안 함 | 콘텐츠 품질 개선, 고유 가치 추가 |
| Excluded by 'noindex' tag | noindex 태그로 제외 | 메타 태그 확인, redirect_from 검토 |
| Duplicate without user-selected canonical | 중복 콘텐츠 | canonical URL 명시 |
| Soft 404 | 페이지는 있지만 내용 없음 | 실질적인 콘텐츠 추가 |

---

## 인덱싱 모니터링

### Search Console 정기 확인 항목

1. **색인 생성 범위**
   - 유효한 페이지 수
   - 오류 있는 페이지
   - 제외된 페이지

2. **실적 보고서**
   - 총 클릭수
   - 총 노출수
   - 평균 게재순위

3. **URL 검사**
   - 특정 URL의 인덱싱 상태 확인

### 인덱싱 확인 명령어

Google에서 다음을 검색:
```
site:username.github.io
```

인덱싱된 모든 페이지가 표시됩니다.

---

## 실제 사례와 해결

### 사례 1: 7개월째 인덱싱 안 됨

**문제:** GitHub Pages 블로그가 7개월이 지나도 Google 검색에 안 나옴

**원인 분석:**
- GitHub Pages 공유 서버 특성상 크롤링 우선순위 낮음
- 신규 사이트의 낮은 권위도

**해결:**
1. Reddit, Hacker News 등에 글 공유 → 백링크 확보
2. 매일 수동 인덱싱 요청 (하루 10개씩)
3. 소셜 미디어 프로필에 블로그 링크 추가

### 사례 2: URL 변경 후 순위 급락

**문제:** URL 구조 변경 후 모든 페이지가 검색에서 사라짐

**해결:**
1. 이전 URL에서 새 URL로 301 리다이렉트 설정
2. 새 sitemap 제출
3. Search Console에서 변경된 URL 인덱싱 요청

```yaml
# jekyll-redirect-from 플러그인 사용
---
redirect_from:
  - /old/path/to/post/
---
```

### 사례 3: 특정 페이지만 인덱싱 안 됨

**문제:** 일부 포스트만 "Crawled - currently not indexed" 상태

**원인:**
- 해당 페이지들의 콘텐츠가 다른 페이지와 유사
- 충분한 고유 가치가 없다고 판단됨

**해결:**
1. 각 페이지에 고유한 가치 있는 콘텐츠 추가
2. 더 구체적인 description 작성
3. 관련 내부 링크 추가

---

## 빠른 인덱싱을 위한 체크리스트

```
□ _config.yml에 url 올바르게 설정됨
□ jekyll-seo-tag 플러그인 활성화됨
□ jekyll-sitemap 플러그인 활성화됨
□ robots.txt에 sitemap 경로 명시됨
□ Google Search Console에 사이트 등록됨
□ sitemap.xml이 Search Console에 제출됨
□ 모든 포스트에 title, description 있음
□ 불필요한 redirect_from 제거됨
□ 내부 링크가 충분히 있음
□ 소셜 미디어에 공유됨
```

---

## 결론

Jekyll GitHub Pages의 Google Search Indexing 문제는 여러 요인이 복합적으로 작용합니다:

1. **기술적 설정**을 먼저 점검하세요 (sitemap, robots.txt, SEO 플러그인)
2. **콘텐츠 품질**을 높이세요 (고유한 가치, 적절한 길이)
3. **인내심**을 가지세요 (인덱싱은 며칠~몇 주 소요)
4. **적극적으로 홍보**하세요 (소셜 미디어, 커뮤니티)

완벽한 기술적 설정도 중요하지만, 결국 **좋은 콘텐츠**가 가장 중요한 SEO 요소입니다.

---

## 참고 자료

- [Google Search Console 도움말](https://support.google.com/webmasters)
- [Jekyll SEO Tag 공식 문서](https://github.com/jekyll/jekyll-seo-tag)
- [Jekyll Sitemap 플러그인](https://github.com/jekyll/jekyll-sitemap)
- [Google의 SEO 기초 가이드](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
