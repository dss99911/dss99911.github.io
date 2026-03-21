# 블로그

- 글 올릴 때, git 푸시후, 빌드 성공하는지 github action 확인해 주세요.
- 다이어그램이 필요한 경우, mermaid diagram 사용해주세요.
- 썸네일은 **image-gen MCP** (`mcp__image-gen__generate_image`)로 Pexels 무료 이미지 검색하여 사용
  - 검색 후 `~/Pictures/ai-generated/`에 저장됨 → `assets/images/posts/thumbnails/`로 복사
  - 다운로드 후 반드시 `Read` 도구로 이미지를 확인하여 주제와 맞는지 검증
  - 주제와 맞지 않으면 검색어를 변경하여 재검색
  - **검색어 작성 규칙**:
    - 영어로 검색 (한국어 X)
    - 주제를 2~3 단어로 요약 (예: "happiness meditation", "brain neuroscience")
    - 추상적이면 관련 시각 키워드 사용 (예: "sunset peaceful" for 행복감)
- 기술관련 글이면:
  - devto에 올려주고, backlink 달아주세요.
  - Threads에도 블로그 링크와 함께 홍보 글을 올려주세요 (threads MCP 사용).
- 글 발행 후 검색엔진 인덱싱 요청:
  - IndexNow API로 Bing/Yandex 즉시 인덱싱 (아래 curl 명령 실행):
    ```bash
    curl -X POST "https://api.indexnow.org/indexnow" -H "Content-Type: application/json" -d '{"host":"jeonghyeon.kim","key":"739e9dcd5dbd219665779e8ca983584f","keyLocation":"https://jeonghyeon.kim/739e9dcd5dbd219665779e8ca983584f.txt","urlList":["새글URL"]}'
    ```
  - `submit_sitemap` 도구로 `https://jeonghyeon.kim/sitemap.xml` 제출 (Google)

## Front Matter 규칙
- `date` front matter는 **절대 수정하지 마세요**. Jekyll이 URL 생성에 사용하므로 변경 시 URL이 바뀌어 Google 인덱싱이 깨집니다.
- 업데이트 날짜는 `last_modified_at`만 수정하세요.

## 블로그 URL 형식
블로그 글 공유 시 URL 형식: `https://jeonghyeon.kim/{categories}/{yyyy}/{MM}/{dd}/{파일명}.html`
- 예시: `_posts/knowledge/health/2026-01-05-vitamin-c.md`
- URL: `https://jeonghyeon.kim/knowledge/health/2026/01/05/vitamin-c.html`
