# 블로그

- 글 올릴 때, git 푸시후, 빌드 성공하는지 github action 확인해 주세요.
- 다이어그램이 필요한 경우, mermaid diagram 사용해주세요.
- 썸네일은 이미지 생성 툴 사용 해주세요.
- 기술관련 글이면:
  - devto에 올려주고, backlink 달아주세요.
  - Threads에도 블로그 링크와 함께 홍보 글을 올려주세요 (threads MCP 사용).
- 글 발행 후 검색엔진 인덱싱 요청:
  - IndexNow API로 Bing/Yandex 즉시 인덱싱 (아래 curl 명령 실행):
    ```bash
    curl -X POST "https://api.indexnow.org/indexnow" -H "Content-Type: application/json" -d '{"host":"dss99911.github.io","key":"739e9dcd5dbd219665779e8ca983584f","keyLocation":"https://dss99911.github.io/739e9dcd5dbd219665779e8ca983584f.txt","urlList":["새글URL"]}'
    ```
  - `submit_sitemap` 도구로 `https://dss99911.github.io/sitemap.xml` 제출 (Google)

## 블로그 URL 형식
블로그 글 공유 시 URL 형식: `https://dss99911.github.io/{categories}/{yyyy}/{MM}/{dd}/{파일명}.html`
- 예시: `_posts/knowledge/health/2026-01-05-vitamin-c.md`
- URL: `https://dss99911.github.io/knowledge/health/2026/01/05/vitamin-c.html`
