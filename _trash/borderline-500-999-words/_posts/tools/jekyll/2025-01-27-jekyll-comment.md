---
layout: post
title: Jekyll에 Giscus로 comment 기능 추가
date: 2025-01-27 01:57:37 +0900
categories: [tools, jekyll]
tags: [jekyll, giscus, comments, github-discussions]
image: /assets/images/posts/thumbnails/2025-01-27-jekyll-comment.png
redirect_from:
  - /tools/jekyll/2023/12/25/jekyll-comment.html
---
Jekyll에 Giscus를 추가하는 방법은 간단하며, 아래 단계를 따르면 됩니다.

## Giscus란?

Giscus는 GitHub Discussions를 기반으로 한 오픈소스 댓글 시스템입니다. 기존의 Disqus나 utterances와 비교하여 여러 장점이 있습니다:

| 비교 항목 | Giscus | Disqus | utterances |
|-----------|--------|--------|------------|
| 가격 | 무료 | 무료(광고)/유료 | 무료 |
| 데이터 저장 | GitHub Discussions | Disqus 서버 | GitHub Issues |
| 광고 | 없음 | 무료 플랜에 있음 | 없음 |
| 반응(리액션) | 지원 | 지원 | 미지원 |
| 댓글 스레딩 | 지원 | 지원 | 미지원 |
| 다크 모드 | 지원 | 제한적 | 지원 |
| 데이터 소유권 | 사용자 | Disqus | 사용자 |

Giscus는 댓글이 GitHub Discussions에 저장되므로 데이터의 소유권이 사용자에게 있으며, 언제든지 마이그레이션이 가능합니다.

## 사전 준비

Giscus를 사용하기 전에 아래 조건을 충족해야 합니다:

1. **공개 GitHub 저장소**: 댓글이 저장될 저장소가 공개(public)여야 합니다.
2. **Discussions 기능 활성화**: 저장소 Settings → General → Features에서 Discussions를 체크합니다.
3. **Giscus 앱 설치**: [giscus app](https://github.com/apps/giscus)을 저장소에 설치합니다.

## 1. Giscus 설정하기

1. [Giscus 공식 웹사이트](https://giscus.app/ko)에 접속합니다.
2. 아래 정보를 입력합니다:
   - **Repository**: 댓글을 저장할 GitHub 저장소 선택 (예: your-username/your-repo)
   - **Discussion Category**: Giscus에서 사용할 Discussion 카테고리 선택 (Announcements 추천)
   - **Mapping**: 페이지와 댓글을 연결하는 방식 선택 (예: pathname)
   - **Reaction**: 사용자가 댓글에 반응할 수 있도록 활성화할지 여부 설정
   - **Theme**: Giscus 위젯의 테마 설정 (예: light, dark, preferred_color_scheme)
   - 기타 필요 옵션 설정 후 Code Snippet 복사.

### Mapping 옵션 설명

- **pathname**: URL 경로로 매핑. 가장 일반적이고 안정적인 방식입니다.
- **URL**: 전체 URL로 매핑. 도메인 변경 시 댓글이 분리될 수 있습니다.
- **title**: 페이지 제목으로 매핑. 제목 변경 시 댓글이 분리될 수 있습니다.
- **og:title**: Open Graph 제목으로 매핑.
- **특정 용어**: 직접 지정한 용어로 매핑.

대부분의 경우 **pathname** 방식을 권장합니다.

## 2. Jekyll 테마 수정

Giscus 스크립트를 Jekyll 블로그의 적절한 위치에 추가합니다.

### (1) _layouts 파일 수정

Giscus를 추가할 위치에 따라 주로 post.html 또는 default.html 파일을 수정합니다.

예: _layouts/post.html
```html
<article>
  {{ content }}
</article>

<div id="giscus-comments"></div>

<script src="https://giscus.app/client.js"
        data-repo="your-username/your-repo"
        data-repo-id="your-repo-id"
        data-category="General"
        data-category-id="category-id"
        data-mapping="pathname"
        data-reactions-enabled="1"
        data-theme="light"
        data-lang="en"
        crossorigin="anonymous"
        async>
</script>
```

### (2) 다크 모드 자동 전환

블로그에 다크 모드가 있다면, Giscus 테마도 자동으로 전환할 수 있습니다:

```html
<script>
  const theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  document.querySelector('[data-theme]').setAttribute('data-theme', theme);
</script>
```

### (3) CSS 수정 (선택 사항)

Giscus 위젯이 블로그의 디자인과 잘 어울리도록 필요 시 추가 CSS를 작성합니다.

```css
/* Giscus 컨테이너 간격 조정 */
#giscus-comments {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #eee;
}
```

### (4) 특정 페이지에서만 댓글 표시

front matter에 변수를 추가하여 특정 페이지에서만 댓글을 표시할 수 있습니다:

```liquid
{% raw %}{% unless page.no_comments %}
  <!-- giscus script here -->
{% endunless %}{% endraw %}
```

## 3. Jekyll 블로그 빌드 및 확인

1. 변경 사항을 저장한 후 Jekyll 블로그를 빌드합니다.

   `bundle exec jekyll serve`

2. 로컬 서버를 열어 페이지가 제대로 렌더링되었는지 확인합니다.
3. giscus가 작동하지 않는다면 GitHub Discussions 설정 또는 repo, category 등의 매개변수를 다시 확인하세요.

### 문제 해결

- **댓글이 안 보이는 경우**: 저장소가 public인지, Discussions가 활성화되어 있는지, giscus 앱이 설치되어 있는지 확인하세요.
- **로컬에서 안 되는 경우**: localhost에서는 정상 작동하지 않을 수 있습니다. 배포 후 확인해보세요.
- **잘못된 Discussion에 매핑되는 경우**: mapping 설정과 실제 URL 경로가 일치하는지 확인하세요.

## 4. 배포

변경 사항을 저장소에 푸시하고 배포 사이트에서도 Giscus가 잘 동작하는지 확인합니다.

참고: Giscus는 GitHub Discussions를 기반으로 하기 때문에 저장소에서 Discussions가 활성화되어 있어야 합니다. 댓글이 작성되면 해당 저장소의 Discussions 탭에서 모든 댓글을 관리하고 모더레이션할 수 있습니다.