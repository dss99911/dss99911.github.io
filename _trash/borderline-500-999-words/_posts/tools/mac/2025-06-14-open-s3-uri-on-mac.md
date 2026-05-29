---
layout: post
title: Mac에서 s3 uri 링크를 클릭하면 브라우저에서 s3 콘솔이 열리게 하기
date: 2025-06-14 01:57:37 +0900
categories: [tools, mac]
tags: [mac, macos, aws, s3, applescript, url-handler]
image: /assets/images/posts/thumbnails/2025-06-14-open-s3-uri-on-mac.png
---

# macOS Script Editor로 s3 URL 핸들러 앱 만들기

AWS S3를 자주 사용한다면, 문서나 채팅에서 `s3://bucket/path` 형태의 URI를 클릭했을 때 바로 AWS 콘솔의 해당 위치로 이동할 수 있으면 매우 편리합니다. 이 글에서는 macOS에서 커스텀 URL 스킴 핸들러를 만들어 S3 URI를 브라우저에서 자동으로 여는 방법을 설명합니다.

## 동작 원리

macOS는 앱이 특정 URL 스킴(예: `http://`, `mailto:`, `slack://`)을 처리하도록 등록할 수 있습니다. 이 기능을 활용하여 `s3://` 스킴을 처리하는 앱을 만들면, 어디서든 S3 URI를 클릭했을 때 AWS S3 콘솔 웹페이지가 자동으로 열리게 됩니다.

전체 흐름:
1. 사용자가 `s3://bucket/path`를 클릭
2. macOS가 `s3://` 스킴에 등록된 S3Handler.app을 실행
3. AppleScript가 Python 스크립트를 호출
4. Python이 S3 URI를 AWS 콘솔 URL로 변환
5. 브라우저에서 AWS S3 콘솔이 열림

## 1. Script Editor로 AppleScript 앱 만들기

1. **Script Editor**(앱)를 실행
2. 아래 코드를 붙여넣고,
    - **File → Export…**
        - **File Format**: **Application**
        - **Stay open after run handler**: **체크**
        - **Save As**: `S3Handler.app` 등 원하는 이름으로 저장 (권장 위치: `/Applications/`)

   ```applescript
   on open location theURL
       -- 받은 URL을 안전하게 셸 인자로 변환
       set quotedURL to quoted form of theURL
       -- Python 스크립트 실행 (경로는 실제 위치로 변경)
       do shell script "/opt/anaconda3/bin/python3 {your-python-file.py} " & quotedURL
   end open location
   ```

`open location` 핸들러는 macOS가 URL 스킴 이벤트를 앱에 전달할 때 호출됩니다. `quoted form of`는 URL에 포함된 특수 문자가 셸에서 안전하게 처리되도록 이스케이프합니다.

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

### 리전 설정 커스터마이징

위 코드에서 `ap-south-1`은 AWS 리전입니다. 사용하는 리전에 맞게 변경하세요. 여러 리전을 사용한다면, 버킷 이름을 기반으로 리전을 자동으로 결정하는 로직을 추가할 수도 있습니다:

```python
BUCKET_REGION_MAP = {
    "my-prod-bucket": "us-east-1",
    "my-staging-bucket": "ap-northeast-2",
}
DEFAULT_REGION = "ap-south-1"

def get_region(bucket):
    return BUCKET_REGION_MAP.get(bucket, DEFAULT_REGION)
```

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
- 이 설정으로 macOS는 `s3://`로 시작하는 URL을 S3Handler.app으로 라우팅합니다.

## 4. LaunchServices 캐시 갱신 (touch 및 lsregister)

macOS는 앱 설치/변경 후 **LaunchServices** 데이터베이스를 갱신해야 새 스킴을 인식합니다.

1. **touch** 명령으로 앱 번들 타임스탬프 갱신
   ```bash
   touch /Applications/S3Handler.app
   ```

캐시가 제대로 갱신되지 않는 경우, `lsregister`를 직접 실행할 수 있습니다:
```bash
/System/Library/Frameworks/CoreServices.framework/Frameworks/LaunchServices.framework/Support/lsregister -f /Applications/S3Handler.app
```

> **팁**: 이 과정을 거친 뒤 `open s3://bucket/key` 명령이나 브라우저 클릭으로 앱이 실행되는지 확인하세요.
> Mac에서 권한 요청을 하면 승인 해주세요

## 5. 테스트 및 디버깅

- **터미널**에서:
  ```bash
  open s3://my-test-bucket/path
  ```

### 문제 해결

- **앱이 실행되지 않는 경우**: LaunchServices 캐시를 다시 갱신하고, 앱이 `/Applications/`에 있는지 확인하세요.
- **Python 경로 오류**: AppleScript에서 지정한 Python 경로가 올바른지 확인하세요. `which python3` 명령으로 경로를 확인할 수 있습니다.
- **Gatekeeper 차단**: 처음 실행 시 "확인되지 않은 개발자" 경고가 뜰 수 있습니다. System Settings > Privacy & Security에서 허용해주세요.
- **디버깅 로그**: Python 스크립트에 로깅을 추가하면 문제를 진단하기 쉽습니다.

이제 Script Editor 기반 앱 번들을 통해, macOS에서 `s3://…` 클릭 시 Python 스크립트로 URL을 안전하게 전달받아 처리할 수 있습니다. 이 방식은 S3뿐만 아니라 다른 커스텀 URL 스킴(예: `gs://` for GCS, `hdfs://` 등)에도 동일하게 적용할 수 있습니다.
