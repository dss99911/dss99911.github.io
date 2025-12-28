---
layout: post
title: Jekyll에 Giscus로 comment 기능 추가
date: 2023-12-25 01:57:37 +0900
categories: [tools, jekyll]
---
Jekyll에 Giscus를 추가하는 방법은 간단하며, 아래 단계를 따르면 됩니다.

## 1. Giscus 설정하기

Giscus는 GitHub Discussions를 이용한 댓글 시스템입니다. 먼저 Giscus를 설정해야 합니다.
1.	Giscus 공식 웹사이트에 접속합니다.
2.	아래 정보를 입력합니다:
•	Repository: 댓글을 저장할 GitHub 저장소 선택 (예: your-username/your-repo)
•	Discussion Category: Giscus에서 사용할 Discussion 카테고리 선택
•	Mapping: 페이지와 댓글을 연결하는 방식 선택 (예: pathname)
•	Reaction`: 사용자가 댓글에 반응할 수 있도록 활성화할지 여부 설정
•	Theme: Giscus 위젯의 테마 설정 (예: light, dark)
•	기타 필요 옵션 설정 후 Code Snippet 복사.

## 2. Jekyll 테마 수정

Giscus 스크립트를 Jekyll 블로그의 적절한 위치에 추가합니다.

### (1) _layouts 파일 수정

Giscus를 추가할 위치에 따라 주로 post.html 또는 default.html 파일을 수정합니다.

예: _layouts/post.html
```
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


### (2) CSS 수정 (선택 사항)

Giscus 위젯이 블로그의 디자인과 잘 어울리도록 필요 시 추가 CSS를 작성합니다.

## 3. Jekyll 블로그 빌드 및 확인

1.	변경 사항을 저장한 후 Jekyll 블로그를 빌드합니다.

`bundle exec jekyll serve`

2. 로컬 서버를 열어 페이지가 제대로 렌더링되었는지 확인합니다.
3. giscus가 작동하지 않는다면 GitHub Discussions 설정 또는 repo, category 등의 매개변수를 다시 확인하세요.

## 4. 배포

변경 사항을 저장소에 푸시하고 배포 사이트에서도 Giscus가 잘 동작하는지 확인합니다.

참고: Giscus는 GitHub Discussions를 기반으로 하기 때문에 저장소에서 Discussions가 활성화되어 있어야 합니다.

필요한 추가 사항이 있으면 말씀해주세요!