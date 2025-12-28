---
layout: post
title: Fetching YouTube Transcripts Using Python with the YouTube Transcript API
date: 2025-01-09 01:57:37 +0900
categories: [programming, python]
---

# Fetching YouTube Transcripts Using Python with the YouTube Transcript API

The YouTube Transcript API is a powerful library that allows you to easily fetch transcripts of YouTube videos using Python. This post explains how to install and use the YouTube Transcript API and provides solutions to common issues encountered in certain server environments.

---

## 1. Installing the YouTube Transcript API

First, install the `youtube-transcript-api` package by running the following command:

```bash
pip install youtube-transcript-api
```

## 2. Simple Usage Example

To fetch a transcript of a YouTube video, you’ll need its video ID, which is the value after v= in the URL. For example, if the URL is https://www.youtube.com/watch?v=abcdefghijk, the video ID is abcdefghijk.

Here is a simple example:
```python
from youtube_transcript_api import YouTubeTranscriptApi

video_id = "abcdefghijk"  # Enter your video ID here
transcripts = YouTubeTranscriptApi.list_transcripts(video_id)

transcripts = [transcript.fetch() for transcript in transcripts][0]
transcripts = [(f'{item["start"]}s', item["text"]) for item in transcripts]
```

This script fetches the transcript and prints the text along with the start time.

## 3. Resolving Issues Using a Tor Proxy

When using the YouTube Transcript API, some server environments, such as AWS EC2, may block requests. A Tor proxy can help you bypass such restrictions by acting as an intermediary and changing your IP address.

### Installing and Setting Up Tor

Install Tor on your EC2 instance or local environment:
```bash
sudo apt update
sudo apt install tor -y
```
Start Tor using the following command:
```
tor
```
### Integrating Tor Proxy with the YouTube Transcript API

The default port for Tor is 9050. You can configure the proxy as follows:
```python
from youtube_transcript_api import YouTubeTranscriptApi

video_id = "abcdefghijk"  # Enter your video ID here
transcripts = YouTubeTranscriptApi.list_transcripts(video_id, proxies={
    "https": "socks5://127.0.0.1:9050",
    "http": "socks5://127.0.0.1:9050",
})

transcripts = [transcript.fetch() for transcript in transcripts][0]
transcripts = [(f'{item["start"]}s', item["text"]) for item in transcripts]
```

### Notes
- Tor networks may not be suitable for large-scale API calls. Check Tor’s usage policy.
- Some proxy servers may already be blocked. If needed, you can rotate Tor exit nodes to distribute API requests. Refer to [this configuration file](https://github.com/dss99911/llm-slack-bot/blob/401746c82aca34798e5bb0dc9eba123722b410bd/torrc#L1-L2) for guidance.

### Example Code

You can find an example integrating the Tor proxy with the YouTube Transcript API using Docker Compose here.
- [YouTube Transcript API Call](https://github.com/dss99911/llm-slack-bot/blob/8b178cf8eada582f8cb877f607e2fde5fae54b50/tools/tools.py#L36-L46)
- [Docker Compose Configuration](https://github.com/dss99911/llm-slack-bot/blob/401746c82aca34798e5bb0dc9eba123722b410bd/docker-compose.yml#L3-L10)
- [Tor Configuration to Rotate Exit Nodes](https://github.com/dss99911/llm-slack-bot/blob/401746c82aca34798e5bb0dc9eba123722b410bd/torrc)

