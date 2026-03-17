---
layout: post
title: Fetching YouTube Transcripts Using Python with the YouTube Transcript API
date: 2025-01-09 01:57:37 +0900
categories: [programming, python]
tags: [python, youtube, transcript, api, subtitles]
image: /assets/images/posts/thumbnails/youtube-transcript-python.png
redirect_from:
  - /miscellanea/2025/01/08/youtube-transcript-eng.html
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

---

## 4. Working with Multiple Languages

YouTube videos often have transcripts available in multiple languages. You can list available languages and fetch a specific one, or even translate a transcript to another language.

### Listing Available Transcripts

```python
from youtube_transcript_api import YouTubeTranscriptApi

video_id = "abcdefghijk"
transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)

for transcript in transcript_list:
    print(f"Language: {transcript.language}, Code: {transcript.language_code}")
    print(f"  Generated: {transcript.is_generated}")
    print(f"  Translatable: {transcript.is_translatable}")
```

### Fetching a Specific Language

```python
# Fetch Korean transcript
transcript = transcript_list.find_transcript(['ko'])
data = transcript.fetch()

# Fetch with fallback: try Korean first, then English
transcript = transcript_list.find_transcript(['ko', 'en'])
data = transcript.fetch()
```

### Translating Transcripts

If a transcript supports translation, you can translate it to another language:

```python
transcript = transcript_list.find_transcript(['en'])
translated = transcript.translate('ko').fetch()  # Translate English to Korean
```

---

## 5. Formatting Transcript Output

The raw transcript data includes timestamps that can be formatted for various use cases.

### Converting to Plain Text

```python
def transcript_to_text(transcript_data):
    """Convert transcript data to a plain text string."""
    return ' '.join(item['text'] for item in transcript_data)

text = transcript_to_text(data)
print(text)
```

### Creating SRT Subtitles

```python
def transcript_to_srt(transcript_data):
    """Convert transcript data to SRT subtitle format."""
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
    """Convert seconds to SRT time format (HH:MM:SS,mmm)."""
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    millis = int((seconds % 1) * 1000)
    return f"{hours:02d}:{minutes:02d}:{secs:02d},{millis:03d}"
```

---

## 6. Common Issues and Troubleshooting

### TranscriptsDisabled Error

Some videos have transcripts disabled by the uploader. In this case, the API will raise a `TranscriptsDisabled` exception. There is no workaround for this — the video owner must enable captions.

```python
from youtube_transcript_api._errors import TranscriptsDisabled

try:
    transcripts = YouTubeTranscriptApi.list_transcripts(video_id)
except TranscriptsDisabled:
    print("Transcripts are disabled for this video.")
```

### Rate Limiting

YouTube may rate-limit requests if you make too many in a short period. To handle this:

- Add delays between requests using `time.sleep()`
- Implement exponential backoff for retries
- Use the Tor proxy rotation as described above for large-scale fetching

### Age-Restricted Videos

Age-restricted videos may require authentication cookies to access transcripts. You can pass cookies to the API if needed, though this approach requires maintaining valid session cookies.

---

## 4. Fetching Transcripts in a Specific Language

YouTube videos often have transcripts available in multiple languages, including both manually created and auto-generated captions. You can specify which language to fetch:

```python
from youtube_transcript_api import YouTubeTranscriptApi

video_id = "abcdefghijk"
transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)

# Fetch a specific language
transcript = transcript_list.find_transcript(['en'])
data = transcript.fetch()

# Translate to another language if available
translated = transcript.translate('ko').fetch()
```

The `find_transcript` method accepts a list of language codes in order of preference. If the first language is not available, it falls back to the next one.

## 5. Handling Common Errors

When working with the YouTube Transcript API, you may encounter several common errors:

### TranscriptsDisabled

Some videos have transcripts disabled by the uploader. There is no workaround for this — the video owner must enable captions.

```python
from youtube_transcript_api import TranscriptsDisabled

try:
    transcripts = YouTubeTranscriptApi.list_transcripts(video_id)
except TranscriptsDisabled:
    print("Transcripts are disabled for this video")
```

### NoTranscriptFound

This error occurs when no transcript is available in any of the requested languages.

```python
from youtube_transcript_api import NoTranscriptFound

try:
    transcript = transcript_list.find_transcript(['en', 'ko'])
except NoTranscriptFound:
    print("No transcript found in the requested languages")
```

### VideoUnavailable

The video may be private, deleted, or region-restricted.

## 6. Practical Tips

- **Rate Limiting**: YouTube may temporarily block your IP if you make too many requests in a short period. Add delays between requests when processing multiple videos.
- **Caching**: Store fetched transcripts locally to avoid redundant API calls. A simple file-based cache or database can save significant time.
- **Batch Processing**: When processing a playlist, collect all video IDs first and then fetch transcripts sequentially with appropriate delays.
- **Auto-generated vs Manual**: Auto-generated transcripts may contain errors, especially for technical content or non-standard accents. When both are available, prefer manually created transcripts for accuracy.

