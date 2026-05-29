# AdSense Cleanup 분석 보고서

**대상**: jeonghyeon.kim Jekyll 블로그 (`_posts/` 451개 글)
**작성일**: 2026-05-29
**상태**: 1차 자동 분석 — 사용자 검토 후 실제 삭제/보강 결정 필요

> ⚠️ 본 보고서는 자동 패턴 분석 + 샘플 정독으로 산출. 본문 미수정.

---

## 1. Summary

| 분류 | 개수 | 비율 | 의미 |
|---|---|---|---|
| **Keep** (유지) | 244 | 54.1% | 1000자 이상 또는 개인경험/niche |
| **Low-Value** (저품질) | 117 | 25.9% | 500자 미만 또는 일반론 |
| **Translation Suspect** | 46 | 10.2% | `/language/` 하위 등 — 검토 필요 |
| **Borderline** (경계선) | 44 | 9.8% | 짧지만 보강 가치 있음 |

---

## 2. 카테고리별 현황

| 카테고리 | 총 글 | Keep | 저품질 | 번역의심 | 경계선 | 평균단어 |
|---|---|---|---|---|---|---|
| programming | 27 | 0 | 27 | - | - | 431 |
| devops | 1 | 0 | 1 | - | - | 578 |
| mobile | 13 | 0 | 11 | - | 2 | 512 |
| infra | 38 | 9 | 25 | - | 4 | 570 |
| tools | 20 | 0 | 13 | 7 | - | 474 |
| knowledge | 22 | 0 | 12 | 2 | 8 | 573 |
| frontend | 33 | 16 | 8 | - | 9 | 730 |
| backend | 35 | 25 | 3 | - | 7 | 934 |
| language | 37 | - | - | 37 | - | 930 |

> 약점: **programming, mobile, infra, tools, knowledge** — 짧고 일반론 위주.
> 강점: **backend, language** — 분량 충분, 일부 원저작 확인됨.

---

## 3. Low-Value 후보 — 우선 검토 Top 20 (300~330 단어)

| # | 파일 | 단어 | 이유 | 권장 |
|---|---|---|---|---|
| 1 | `_posts/infra/devops/2025-09-19-devops-tools-overview.md` | 300 | 짧음 + AI 균일 헤딩 | 🔴 삭제 |
| 2 | `_posts/programming/ruby/2025-07-15-ruby-basics.md` | 301 | 짧음 + 입문형 일반론 | 🔴 삭제 |
| 3 | `_posts/knowledge/common/2024-01-12-ai-introduction.md` | 304 | 짧음 + AI 패턴 | 🔴 삭제 |
| 4 | `_posts/knowledge/common/2024-01-09-vr-ar-guide.md` | 310 | 짧음 + AI 패턴 | 🔴 삭제 |
| 5 | `_posts/mobile/common/2025-07-12-flutter-development-basics.md` | 311 | 짧음 + 입문형 | 🔴 삭제 |
| 6 | `_posts/knowledge/history/2024-01-04-political-systems.md` | 314 | 짧음 | 🟠 보강 |
| 7 | `_posts/programming/java/2025-01-13-java-string.md` | 319 | 흔한 주제 + AI | 🔴 삭제 |
| 8 | `_posts/frontend/nodejs/2025-09-03-nodejs-headless-browser.md` | 324 | 짧음 | 🟠 보강 |
| 9 | `_posts/mobile/android/2025-02-15-retrofit-http-client-guide.md` | 328 | 입문형 | 🟠 보강 |
| 10 | `_posts/tools/jekyll/2023-11-28-jekyll-integrate-adsense.md` | 333 | 짧음 | 🟠 보강 |
| 11 | `_posts/infra/devops/2024-11-24-docker-file.md` | 360 | 흔한 주제 | 🔴 삭제 |
| 12 | `_posts/language/chinese/2025-12-12-chinese-final-consonants.md` | 373 | 짧음 + 번역 의심 | 🟠 보강/검토 |
| 13 | `_posts/knowledge/common/2024-01-14-online-learning-resources.md` | 379 | 짧음 | 🟠 보강 |
| 14 | `_posts/frontend/nodejs/2025-09-28-nodejs-express.md` | 382 | 흔한 주제 | 🔴 삭제 |
| 15 | `_posts/infra/devops/2024-11-24-docker-compose.md` | 382 | 흔한 주제 | 🔴 삭제 |
| 16 | `_posts/knowledge/common/2024-01-08-3d-printing-guide.md` | 383 | 짧음 | 🟠 보강 |
| 17 | `_posts/frontend/common/2025-02-05-html-complete-guide.md` | 385 | 입문형 | 🔴 삭제 |
| 18 | `_posts/mobile/common/2025-07-25-ios-development-basics.md` | 385 | 입문형 | 🔴 삭제 |
| 19 | `_posts/tools/jekyll/2023-12-18-ads.txt-not-found.md` | 387 | 짧음 | 🟠 보강 |
| 20 | `_posts/mobile/android/2025-07-29-realm-database-android.md` | 392 | 흔한 주제 | 🟠 보강 |

> 📌 자동 분류 결과로, "삭제" 권장도 사용자 판단으로 보강 가능합니다.
> 전체 117개 저품질 목록은 다음 명령으로 추출:
> ```sh
> cd projects/dss99911.github.io && find _posts -type f \( -name "*.md" -o -name "*.markdown" \) -print0 | xargs -0 wc -w | awk '$1<500 && $2!="total"' | sort -n
> ```

---

## 4. Translation Suspects — 검토 필요 (46개)

`_posts/language/{언어}/` 하위 글들 + 파일명 접미사가 있는 글.

### 언어별 분포

| 언어 | 글 수 | 평균 단어 | 비고 |
|---|---|---|---|
| Hindi | 6 | 1000+ | 원저작 가능성 높음 (분량 충분) |
| English | 8 | 1300+ | 일부 원저작 가능성 |
| Korean | 2 | 450~629 | **보강 또는 삭제 필요** (짧음) |
| Arabic | 4 | 600~1100 | 원저작 가능성 있음 |
| Chinese | 4 | 334~850 | 일부 짧음 |
| Indonesian | 4 | 1300~1800 | 분량 우수, 원저작 가능성 높음 |
| `-korean` 접미사 | 18 | 다양 | 영문 본 + 한국어 본 페어 의심 |
| `/korean/` 디렉토리 | 15 | 다양 | 같은 base name 짝 글 존재 |

### 즉시 판정 필요 (짧음 + 의심)

| 파일 | 단어 | 같은 base name 짝 | 권장 |
|---|---|---|---|
| `_posts/language/chinese/2025-12-12-chinese-final-consonants.md` | 373 | (없음) | 보강 또는 noindex |
| `_posts/language/korean/...korean-law-system.md` | ~450 | (없음) | 보강 또는 삭제 |
| `_posts/tools/obsidian/korean/2023-12-01-...-korean.md` | 351 | 동일 base의 영문 글 존재 | **삭제 또는 noindex** (영문본 우선) |

> 📌 `-korean.md`와 `tools/jekyll/korean/`, `tools/obsidian/korean/` 같이 **영문본이 짝으로 있는 한국어 글**은 명백한 번역본 → 한쪽만 살리고 다른 쪽 `noindex` 권장.

### 원저작으로 추정되는 글 (정독 결과)

- `_posts/language/arabic/2025-02-19-arabic-alphabet-characters.md` (1147자) — 한국어 화자 맞춤 발음 설명, 표 구조 — **유지**
- `_posts/language/english/.../english-vocabulary-word-differences.md` (1140자) — 한국 학습자 맞춤 — **유지**

---

## 5. Borderline — 보강하면 가치 있는 글 (상위 10개)

500~1000자 + niche 주제. 본인 경험 200~300자 추가하면 양질로 승격.

1. `_posts/backend/mybatis-guide.md` (899자) — DB
2. `_posts/backend/hibernate-jpa-xml-config.md` (863자) — JPA 고급
3. `_posts/frontend/jquery-complete-guide.md` (911자)
4. `_posts/infra/devops/.../github-action.md` (957자) — CI/CD
5. `_posts/knowledge/.../drone-guide.md` (840자)
6. `_posts/knowledge/.../robotics-and-brain-wave.md` (802자)
7. `_posts/tools/.../blog-backlink-strategy.md` (904자) — SEO
8. `_posts/finance/.../sangsaeng-payback-guide.md` (974자) — 본인 경험 가능성 큼
9. `_posts/knowledge/.../presidential-election-voting-guide.md` (975자)
10. `_posts/mobile/android/.../android-jetpack-architecture.md` (817자)

---

## 6. AI 생성 패턴 감지 기준

각 글에 다음 항목을 적용. 2개 이상 일치 시 AI 의심:

1. ## 헤딩이 5개 이상, 각 헤딩 아래 2문단
2. "이상으로 ~을 살펴봤습니다", "정리하면" 등 정형 마무리
3. "X는 Y입니다" 패턴이 첫 문장
4. 본문에 "저는/제가/실제로/해봤더니" 등 1인칭 경험 **0회**
5. 코드/표가 본문 40% 이상이고 설명이 단순 정의

---

## 7. 실행 우선순위 (권장)

### Phase 1 — 즉시 (1주 이내)
- [ ] 300~340자 + AI 패턴 글 약 20개 삭제 (위 Top 20의 🔴 권장만)
- [ ] `-korean` 접미사 + 영문 짝 글 있는 18개 중 한쪽 `noindex` 또는 삭제
- [ ] 삭제 전 git commit 분리해서 롤백 가능하게

### Phase 2 — 2주 이내
- [ ] Translation suspects 46개 정독 후 원저작/번역 판별
- [ ] 번역본은 front matter에 `original: false`, `sitemap: false` 추가 (noindex)

### Phase 3 — 3주 이내
- [ ] Borderline 상위 10개 보강 (사용자 경험 200~300자 추가)
- [ ] 사용자 인터뷰로 각 글에 본인 경험/스크린샷 추가

### Phase 4 — 지속
- [ ] 모든 기술 글에 "참고 자료" + URL 3개
- [ ] 스크린샷 1개 이상
- [ ] 1000자 이상 글은 목차 추가

---

## 8. AdSense 재신청 체크리스트

- [x] /privacy-policy/ 페이지 있음
- [x] /about 페이지 있음
- [x] /contact/ 페이지 추가 (방금 작업)
- [x] 광고 코드 임시 제거 (방금 작업)
- [x] Sitemap 정상 (502는 URL 개수였음)
- [ ] Low-value 글 정리 (이 보고서 기준)
- [ ] 번역본 정리
- [ ] 상위 10개 글 보강

위 체크리스트 모두 완료 후 AdSense 재신청 권장.

---

## 9. 참고 명령

```sh
cd /Users/hyun/Documents/workspace/projects/dss99911.github.io

# 500단어 미만 전체 117개 리스트
find _posts -type f \( -name "*.md" -o -name "*.markdown" \) -print0 \
  | xargs -0 wc -w | awk '$1<500 && $2!="total"' | sort -n

# 번역 의심 33개 (-korean 접미사 + /korean/ 디렉토리)
find _posts \( -name "*-korean*" -o -path "*/korean/*" \) -type f

# language 디렉토리 37개
find _posts/language -type f
```
