---
layout: post
title: YouTube Transcript API를 이용한 Python으로 YouTube 대본 가져오기
date: 2025-01-09 01:57:37 +0900
categories: miscellanea
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