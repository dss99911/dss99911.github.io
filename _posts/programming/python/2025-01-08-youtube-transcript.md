---
layout: post
title: YouTube Transcript API를 이용한 Python으로 YouTube 대본 가져오기
date: 2025-01-08 01:57:37 +0900
categories: [programming, python]
description: "Python YouTube Transcript API로 유튜브 자막을 가져오는 방법. Tor Proxy를 이용한 차단 우회 방법과 Docker 구성까지 설명합니다."
tags: [Python, YouTube, Transcript, API, Tor, Proxy]
image: /assets/images/posts/thumbnails/2025-01-09-youtube-transcript.png
redirect_from:
  - /miscellanea/2025/01/08/youtube-transcript.html
---

# YouTube Transcript API를 이용한 Python으로 YouTube 대본 가져오기

YouTube Transcript API는 Python에서 YouTube 동영상의 대본을 간편하게 가져올 수 있는 강력한 라이브러리입니다. 이 글에서는 YouTube Transcript API를 설치하고 사용하는 방법을 설명하고, 일부 서버 환경에서 발생하는 이슈와 이에 대한 해결책도 다룹니다.

---

## 1. YouTube Transcript API 설치

먼저, `youtube-transcript-api`를 설치합니다. 아래 명령어를 실행하세요.

```bash
pip install youtube-transcript-api
```


## 2. 간단한 사용 예제

YouTube 동영상의 대본을 가져오기 위해, YouTube 동영상 ID를 사용합니다. 동영상 ID는 URL의 v= 뒤에 오는 값입니다. 예를 들어, URL이 https://www.youtube.com/watch?v=abcdefghijk라면 동영상 ID는 abcdefghijk입니다.

다음은 간단한 코드 예제입니다:

```python
from youtube_transcript_api import YouTubeTranscriptApi
video_id = "abcdefghijk"  # 여기에 동영상 ID를 입력하세요
transcripts = YouTubeTranscriptApi.list_transcripts(video_id)

transcripts = [transcript.fetch() for transcript in transcripts][0]
transcripts = [(f'{item["start"]}s', item["text"]) for item in transcripts]
```

이 코드는 대본을 가져와 시작 시간과 함께 출력합니다.

## 3. Tor Proxy로 이슈 해결하기

youtube-transcript-api를 사용할 때 일부 서버 환경, 특히 AWS EC2 등에서 차단되는 경우가 있습니다. 이를 해결하기 위해 Tor Proxy를 사용할 수 있습니다. Tor는 IP를 변경하면서 프록시 역할을 수행하여 차단 문제를 우회할 수 있습니다.
또한, 특정 proxy 서비스에 가입할 필요가 없어서, 간단하게 적용 가능합니다.

### Tor 설치 및 설정

EC2 또는 로컬 환경에 Tor를 설치하세요.
```bash
sudo apt update
sudo apt install tor -y
```
Tor를 실행하려면 아래 명령어를 입력합니다:

```
tor
```

### Tor Proxy와 YouTube Transcript API 통합
tor의 기본 port는 9050입니다. proxy를 아래와 같이 설정합니다.

```python
from youtube_transcript_api import YouTubeTranscriptApi
video_id = "abcdefghijk"  # 여기에 동영상 ID를 입력하세요
transcripts = YouTubeTranscriptApi.list_transcripts(video_id, proxies={
    "https": "socks5://127.0.0.1:9050",
    "http": "socks5://127.0.0.1:9050",
})

transcripts = [transcript.fetch() for transcript in transcripts][0]
transcripts = [(f'{item["start"]}s', item["text"]) for item in transcripts]
# 실행

```


### 주의 사항

- Tor 네트워크는 대규모 API 호출에는 적합하지 않을 수 있습니다. Tor의 정책을 확인해보세요
- 프록시 서버 중 일부는 이미 블럭되었을 수 있습니다. 필요하면 Tor Exit Node를 api호출시마다 변경하여 요청을 분산시킬 수 있습니다. 이 [설정파일](https://github.com/dss99911/llm-slack-bot/blob/401746c82aca34798e5bb0dc9eba123722b410bd/torrc#L1-L2)을 참고해주세요.


### 구현 코드
docker compose를 이용하여, Tor Proxy와 YouTube Transcript API를 통합한 코드를 [여기](https://github.com/dss99911/llm-slack-bot)에서 확인하실 수 있습니다.

- [youtube transcript api 호출](https://github.com/dss99911/llm-slack-bot/blob/8b178cf8eada582f8cb877f607e2fde5fae54b50/tools/tools.py#L36-L46)
- [Docker compose 설정](https://github.com/dss99911/llm-slack-bot/blob/401746c82aca34798e5bb0dc9eba123722b410bd/docker-compose.yml#L3-L10)
- [매번 exit node 변경하는 Tor 설정](https://github.com/dss99911/llm-slack-bot/blob/401746c82aca34798e5bb0dc9eba123722b410bd/torrc)

---

## 4. 다국어 자막 처리

YouTube 동영상에는 여러 언어의 자막이 제공되는 경우가 많습니다. API를 통해 사용 가능한 언어를 확인하고, 특정 언어의 자막을 가져오거나 번역할 수 있습니다.

### 사용 가능한 자막 목록 확인

```python
from youtube_transcript_api import YouTubeTranscriptApi

video_id = "abcdefghijk"
transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)

for transcript in transcript_list:
    print(f"언어: {transcript.language}, 코드: {transcript.language_code}")
    print(f"  자동 생성: {transcript.is_generated}")
    print(f"  번역 가능: {transcript.is_translatable}")
```

### 특정 언어 자막 가져오기

```python
# 한국어 자막 가져오기
transcript = transcript_list.find_transcript(['ko'])
data = transcript.fetch()

# 한국어가 없으면 영어로 fallback
transcript = transcript_list.find_transcript(['ko', 'en'])
data = transcript.fetch()
```

### 자막 번역

번역을 지원하는 자막이라면 다른 언어로 번역할 수 있습니다.

```python
transcript = transcript_list.find_transcript(['en'])
translated = transcript.translate('ko').fetch()  # 영어 → 한국어 번역
```

---

## 5. 자막 데이터 활용 예시

### 순수 텍스트 추출

```python
def transcript_to_text(transcript_data):
    """자막 데이터를 순수 텍스트로 변환합니다."""
    return ' '.join(item['text'] for item in transcript_data)

text = transcript_to_text(data)
print(text)
```

### SRT 자막 포맷으로 변환

```python
def transcript_to_srt(transcript_data):
    """자막 데이터를 SRT 자막 포맷으로 변환합니다."""
    srt_lines = []
    for i, item in enumerate(transcript_data, 1):
        start = item['start']
        duration = item.get('duration', 0)
        end = start + duration

        start_time = format_srt_time(start)
        end_time = format_srt_time(end)

        srt_lines.append(f"{i}")
        srt_lines.append(f"{start_time} --> {end_time}")
        srt_lines.append(item['text'])
        srt_lines.append("")

    return '\n'.join(srt_lines)

def format_srt_time(seconds):
    """초 단위를 SRT 시간 형식으로 변환합니다."""
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    millis = int((seconds % 1) * 1000)
    return f"{hours:02d}:{minutes:02d}:{secs:02d},{millis:03d}"
```

---

## 6. 자주 발생하는 문제와 해결 방법

### TranscriptsDisabled 에러

일부 동영상은 업로더가 자막을 비활성화한 경우가 있습니다. 이 경우 `TranscriptsDisabled` 예외가 발생하며, 업로더가 자막을 활성화하지 않는 한 해결 방법이 없습니다.

```python
from youtube_transcript_api._errors import TranscriptsDisabled

try:
    transcripts = YouTubeTranscriptApi.list_transcripts(video_id)
except TranscriptsDisabled:
    print("이 동영상은 자막이 비활성화되어 있습니다.")
```

### 요청 속도 제한 (Rate Limiting)

짧은 시간에 너무 많은 요청을 보내면 YouTube에서 요청을 차단할 수 있습니다. 이를 방지하려면:

- `time.sleep()`으로 요청 사이에 딜레이를 추가하세요
- 재시도 시 지수 백오프(exponential backoff)를 구현하세요
- 대규모 수집의 경우 위에서 설명한 Tor 프록시 로테이션을 활용하세요

### 연령 제한 동영상

연령 제한이 있는 동영상은 인증 쿠키가 필요할 수 있습니다. 유효한 세션 쿠키를 API에 전달하면 접근할 수 있지만, 쿠키 관리가 추가로 필요합니다.

---

## 7. 대량 자막 수집 아키텍처

여러 동영상의 자막을 대량으로 수집해야 하는 경우(예: 채널 전체 자막 수집, 연구 목적 데이터 수집), 안정적인 아키텍처가 필요합니다.

### 큐 기반 처리

```python
import time
import random
from queue import Queue
from threading import Thread

class TranscriptWorker(Thread):
    def __init__(self, queue, results, proxy=None):
        Thread.__init__(self)
        self.queue = queue
        self.results = results
        self.proxy = proxy
        self.daemon = True

    def run(self):
        while True:
            video_id = self.queue.get()
            try:
                transcript = self._fetch_transcript(video_id)
                self.results[video_id] = transcript
            except Exception as e:
                self.results[video_id] = {"error": str(e)}
            finally:
                # 요청 간 랜덤 딜레이로 차단 방지
                time.sleep(random.uniform(1.0, 3.0))
                self.queue.task_done()

    def _fetch_transcript(self, video_id):
        proxies = None
        if self.proxy:
            proxies = {
                "https": self.proxy,
                "http": self.proxy,
            }

        transcript_list = YouTubeTranscriptApi.list_transcripts(
            video_id, proxies=proxies
        )
        transcript = list(transcript_list)[0]
        return transcript.fetch()
```

### 재시도 로직과 지수 백오프

```python
import time
from youtube_transcript_api import YouTubeTranscriptApi

def fetch_with_retry(video_id, max_retries=3, base_delay=1.0):
    """지수 백오프를 적용한 재시도 로직"""
    for attempt in range(max_retries):
        try:
            transcripts = YouTubeTranscriptApi.list_transcripts(video_id)
            return [t.fetch() for t in transcripts][0]
        except Exception as e:
            if attempt == max_retries - 1:
                raise
            delay = base_delay * (2 ** attempt) + random.uniform(0, 1)
            print(f"Attempt {attempt + 1} failed: {e}. Retrying in {delay:.1f}s")
            time.sleep(delay)
```

---

## 8. 자막 데이터를 활용한 실전 프로젝트

### 영상 요약 자동화

YouTube 자막을 가져와서 LLM(대규모 언어 모델)으로 요약하는 파이프라인을 구축할 수 있습니다.

```python
from youtube_transcript_api import YouTubeTranscriptApi
import openai

def summarize_video(video_id):
    # 1. 자막 가져오기
    transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)
    transcript = list(transcript_list)[0].fetch()

    # 2. 텍스트 추출
    full_text = ' '.join(item['text'] for item in transcript)

    # 3. LLM으로 요약 (예: OpenAI API)
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "다음 YouTube 영상 자막을 간결하게 요약해주세요."},
            {"role": "user", "content": full_text[:4000]}  # 토큰 제한 고려
        ]
    )

    return response.choices[0].message.content
```

### 키워드 타임스탬프 검색

특정 키워드가 등장하는 시점을 찾는 기능도 유용합니다.

```python
def find_keyword_timestamps(transcript_data, keyword):
    """자막에서 키워드가 등장하는 시점을 모두 찾습니다."""
    results = []
    keyword_lower = keyword.lower()

    for item in transcript_data:
        if keyword_lower in item['text'].lower():
            minutes = int(item['start'] // 60)
            seconds = int(item['start'] % 60)
            results.append({
                'time': f"{minutes:02d}:{seconds:02d}",
                'start': item['start'],
                'text': item['text']
            })

    return results

# 사용 예시
timestamps = find_keyword_timestamps(transcript_data, "machine learning")
for ts in timestamps:
    print(f"[{ts['time']}] {ts['text']}")
```

---

## 9. Docker Compose를 이용한 Tor 프록시 구성

프로덕션 환경에서 Tor 프록시를 안정적으로 운영하려면 Docker Compose를 활용하는 것이 좋습니다.

### docker-compose.yml 예시

```yaml
version: '3.8'
services:
  tor:
    image: dperson/torproxy
    restart: always
    ports:
      - "9050:9050"    # SOCKS5 프록시
      - "9051:9051"    # 제어 포트
    environment:
      - TOR_NewCircuitPeriod=30    # 30초마다 새 회로 생성
      - TOR_MaxCircuitDirtiness=60 # 60초 후 회로 교체

  transcript-worker:
    build: .
    depends_on:
      - tor
    environment:
      - TOR_PROXY=socks5://tor:9050
    volumes:
      - ./data:/app/data
```

이 구성에서는 Tor 프록시가 별도 컨테이너로 실행되고, transcript-worker가 이를 통해 YouTube에 접속합니다. `NewCircuitPeriod`와 `MaxCircuitDirtiness` 설정으로 IP를 주기적으로 변경하여 차단을 방지합니다.