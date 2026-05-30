# 블로그

- **글 작성 후 git push 직전, 추가/수정된 글 전체를 다시 읽고 아래 "발행 전 민감정보 검토" 항목을 직접 점검할 것.** grep만으로 끝내지 말 것.
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

## 발행 전 민감정보 검토 (git push 직전 필수)

새 글 작성 또는 기존 글 수정 후, **git add 전에 변경된 글 본문 + 첨부 이미지(스크린샷)를 처음부터 끝까지 다시 한번 읽고** 아래 항목이 있는지 검토. grep만으로는 한계가 있어 LLM이 읽고 판단할 것.

### 검토 항목

| 카테고리 | 예시 |
|---|---|
| 본인 식별 정보 | 실명, 휴대폰, 집/회사 주소, 주민/여권/면허 번호, 차량번호, 생년월일 |
| 회사/직장 | 현/전 회사명, 동료·상사 실명, 내부 시스템·서비스명, 내부 URL/Slack 채널, 사내 코드 스니펫·아키텍처 다이어그램 |
| 인프라/계정 | AWS account ID, 서버 IP, 내부 hostname, SSH key, API key/token, DB 접속 정보, 환경변수 |
| 코드/스크린샷 | 하드코딩된 secret/password, 캡처 화면에 잡힌 메뉴·URL·이메일·계좌·카드번호·QR코드·사번 |
| 재정/투자 | 계좌 잔고, 자산 규모, 매수·매도 단가, 거래 내역 (단순 일반론은 OK, 구체 수치는 확인 필요) |
| 가족/지인 | 자녀·배우자 실명·사진, 지인과의 사적 대화 캡처, 제3자 정보 |
| 의료/위치 | 진단 기록, 정확한 거주·근무 주소, GPS 좌표 |

### 공개 OK 목록 (차단 대상 아님)

이미 본인이 의도적으로 공개한 정보로 검토 패스:
- 이메일: `dss99911@gmail.com`
- GitHub: `dss99911`
- 도메인: `jeonghyeon.kim`
- 닉네임 "Hyun" / Tech Blog 운영자 본인 정보 (about.md, resume.md 공개 내용)

### 의심 항목 발견 시

1. 글 안의 정확한 위치(파일:라인)와 문제 문구를 사용자에게 제시
2. 권장 조치 옵션 제시 (예: 마스킹 `xxx@***.com`, 일반화 "A사", 삭제)
3. 사용자 확인 받은 후 수정 → 그 다음 push
4. **사용자 확인 전에는 push 금지**

의심 항목이 없으면 그대로 push 진행.

## 블로그 URL 형식
블로그 글 공유 시 URL 형식: `https://jeonghyeon.kim/{categories}/{yyyy}/{MM}/{dd}/{파일명}.html`
- 예시: `_posts/knowledge/health/2026-01-05-vitamin-c.md`
- URL: `https://jeonghyeon.kim/knowledge/health/2026/01/05/vitamin-c.html`
