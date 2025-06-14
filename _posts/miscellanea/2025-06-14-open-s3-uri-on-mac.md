---
layout: post
title: Mac에서 s3 uri 링크를 클릭하면 브라우저에서 s3 콘솔이 열리게 하기
date: 2025-06-14 01:57:37 +0900
categories: miscellanea
---
π
# macOS Script Editor로 s3 URL 핸들러 앱 만들기

## 1. Script Editor로 AppleScript 앱 만들기

1. **Script Editor**(앱)를 실행
2. 아래 코드를 붙여넣고,
    - **File → Export…**
        - **File Format**: **Application**
        - **Stay open after run handler**: **체크**
        - **Save As**: `S3Handler.app` 등 원하는 이름으로 저장

   ```applescript
   on open location theURL
       -- 받은 URL을 안전하게 셸 인자로 변환
       set quotedURL to quoted form of theURL
       -- Python 스크립트 실행 (경로는 실제 위치로 변경)
       do shell script "/opt/anaconda3/bin/python3 {your-python-file.py} " & quotedURL
   end open location
   ```

## 2. Python 스크립트 준비

```python
import sys
import webbrowser

def open_presigned_url(s3_uri: str):
    webbrowser.open(s3_uri_to_web_url(s3_uri))

def s3_uri_to_web_url(s3_uri):
    url = s3_uri.strip()
    bucket = url[url.index("//") + 2: url.index("/", 5)]
    path = url[url.index("/", 5) + 1:]
    if url.endswith("/"):
        aws_url = "https://ap-south-1.console.aws.amazon.com/s3/buckets/" + bucket + "?region=ap-south-1&bucketType=general&prefix=" + path
    else:
        aws_url = "https://ap-south-1.console.aws.amazon.com/s3/object/" + bucket + "?region=ap-south-1&bucketType=general&prefix=" + path
    return aws_url

def save_text_to_file(text: str, filename: str):
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(text)

if __name__ == "__main__":
    open_presigned_url(sys.argv[1])
```

- `sys.argv[1]`에 **클릭된 URL**이 전달됩니다.

## 3. Info.plist에 URL 스킴 등록

1. **Finder**에서 `S3Handler.app` 우클릭 → **Show Package Contents**
2. `Contents/Info.plist`를 텍스트 에디터로 열어, 최상위 `<dict>` 내부에 다음 블록을 추가:

   ```xml
   <!-- URL 스킴 핸들러 등록 -->
    <key>CFBundleURLTypes</key>
    <array>
      <dict>
        <key>CFBundleURLName</key>
        <string>S3 URL Scheme</string>
        <key>CFBundleURLSchemes</key>
        <array>
          <string>s3</string>
        </array>
      </dict>
    </array>
   ```

- **CFBundleURLTypes**: 앱이 처리할 URL 스킴을 정의합니다.

## 4. LaunchServices 캐시 갱신 (touch 및 lsregister)

macOS는 앱 설치/변경 후 **LaunchServices** 데이터베이스를 갱신해야 새 스킴을 인식합니다.

1. **touch** 명령으로 앱 번들 타임스탬프 갱신
   ```bash
   touch /Applications/S3Handler.app
   ```

> **팁**: 이 과정을 거친 뒤 `open s3://bucket/key` 명령이나 브라우저 클릭으로 앱이 실행되는지 확인하세요.

## 5. 테스트 및 디버깅

- **터미널**에서:
  ```bash
  open s3://my-test-bucket/path
  ```

이제 Script Editor 기반 앱 번들을 통해, macOS에서 `s3://…` 클릭 시 Python 스크립트로 URL을 안전하게 전달받아 처리할 수 있습니다.
