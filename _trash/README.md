# _trash — AdSense 정리 보관소

블로그에서 일시 제거한 글을 카테고리별로 보관. 사용자 검토 후 영구 삭제 또는 `_posts/`로 복원.

**Jekyll 빌드 제외**: `_config.yml`의 `exclude:` 에 `_trash/` 추가됨.

## 카테고리 (각 글은 우선순위에 따라 한 곳에만 위치)

| 폴더 | 글 수 | 이동 사유 |
|---|---|---|
| `language-study-notes-for-obsidian/` | 39 | `_posts/language/*` 하위 언어 학습 노트. Obsidian으로 옮기실 후보 |
| `translation-with-pair/` | 9 | 파일명에 `-korean` 접미사 또는 `/korean/` 서브디렉토리. 영문 짝 글이 존재하는 직역본 → AdSense 중복 콘텐츠 위험 |
| `low-value-under-500-words/` | 59 | 본문 500단어 미만 (위 두 조건 외). 일반론·입문형 다수 |
| `borderline-500-999-words/` | 203 | 본문 500~999단어. 짧지만 정독 후 복원 가치 있을 수 있음 |
| `invest-blog-posts/` | 34 | `_posts/knowledge/invest/*` AI 자동 생성 투자 전망 글. 같은 slug에 잘못된 날짜 URL 다수 박혀있어 내부 링크 깨짐. 작업 문서는 `works/invest/` |

총 344글이 이동, `_posts/`에는 107글이 남아 있습니다.

## 처리 가이드

1. **language-study-notes-for-obsidian/** → Obsidian vault로 복사 후 영구 삭제
2. **translation-with-pair/** → 영문 본만 살리는 정책이면 영구 삭제. 단, 한국어 본을 우선하실 글이 있으면 `_posts/`로 복원하고 대신 영문본을 trash로 이동
3. **low-value-under-500-words/** → 정독 후
   - 본인 경험/스크린샷이 들어있던 글 → `_posts/`로 복원
   - 일반 검색에 흔한 입문 글 → 영구 삭제
4. **borderline-500-999-words/** → 가장 신중하게 검토
   - 본인 경험/실제 사례/niche 주제 → 복원 후 1000자 이상으로 보강
   - 정형화된 정의/일반론 → 영구 삭제

## 영구 삭제 방법

```bash
cd projects/dss99911.github.io
rm -rf _trash/<카테고리>
```

## 복원 방법

```bash
cd projects/dss99911.github.io
# 예: borderline의 특정 글을 다시 _posts로
mv _trash/borderline-500-999-words/_posts/<경로>/<파일>.md _posts/<경로>/
```

복원 후 `last_modified_at` 갱신 + 본문 보강 + `git push`로 재게시.
