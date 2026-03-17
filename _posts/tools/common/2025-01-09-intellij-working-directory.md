---
layout: post
title: IntelliJ에서 Python 기본 Working Directory를 프로젝트 폴더로 설정하는 방법
date: 2025-01-09 01:57:37 +0900
categories: [tools, common]
tags: [intellij, python, ide, working-directory, configuration]
image: /assets/images/posts/thumbnails/2025-01-09-intellij-working-directory.png
---

# IntelliJ에서 Python 기본 Working Directory를 프로젝트 폴더로 설정하는 방법

IntelliJ IDEA에서 Python 프로젝트를 실행할 때 기본 **Working Directory**를 프로젝트 폴더로 설정하고 싶다면, `$ContentRoot$`를 사용하는 방법을 추천합니다. 이 글에서는 `$ContentRoot$`를 활용하여 문제를 해결하는 방법을 단계별로 설명합니다.

---


## 설정 방법

### Step 1: Run/Debug Configurations 열기
1. IntelliJ 상단 메뉴에서 **Run > Edit Configurations**를 클릭합니다.
2. Edit configuration templates... 클릭 (template을 변경해야, 새 configuration 생성시 자동으로 적용이 됩니다)
3. python 선택

### Step 2: Working Directory 설정
1. **Working directory** 필드에 `$ContentRoot$`를 입력합니다.
2. 설정을 저장합니다.

---

## `$ContentRoot$`란?

`$ContentRoot$`는 IntelliJ IDEA에서 사용하는 경로 변수(Path Variable)로, **현재 모듈의 콘텐츠 루트 디렉토리**를 의미합니다. 일반적으로 프로젝트의 최상위 디렉토리와 동일합니다.

IntelliJ에서 지원하는 주요 경로 변수:

| 변수 | 의미 |
|------|------|
| `$ContentRoot$` | 현재 모듈의 콘텐츠 루트 디렉토리 |
| `$ModuleFileDir$` | .iml 파일이 있는 디렉토리 |
| `$ProjectFileDir$` | .idea 폴더가 있는 프로젝트 루트 디렉토리 |
| `$FilePath$` | 현재 편집 중인 파일의 절대 경로 |
| `$FileDir$` | 현재 편집 중인 파일의 디렉토리 |

---

## 왜 Working Directory 설정이 중요한가?

Python 프로젝트에서 Working Directory가 올바르게 설정되지 않으면 여러 문제가 발생할 수 있습니다.

### 파일 경로 문제

상대 경로로 파일을 읽거나 쓸 때, Working Directory가 예상과 다르면 `FileNotFoundError`가 발생합니다.

```python
# Working Directory가 프로젝트 루트일 때는 정상 작동
with open('data/config.json', 'r') as f:
    config = json.load(f)

# Working Directory가 다른 곳이면 FileNotFoundError 발생
```

### 모듈 임포트 문제

Python의 모듈 검색 경로는 Working Directory에 영향을 받습니다. Working Directory가 프로젝트 루트가 아니면 패키지 임포트가 실패할 수 있습니다.

```python
# 프로젝트 구조:
# project/
#   src/
#     main.py
#     utils/
#       helper.py

# main.py에서 utils를 임포트하려면
# Working Directory가 project/ 또는 src/에 있어야 합니다
from utils.helper import some_function
```

---

## 기존 Configuration에도 적용하기

Template을 변경하면 **새로 생성되는** Configuration에만 적용됩니다. 이미 만들어진 기존 Configuration의 Working Directory를 일괄 변경하려면 다음 방법을 사용하세요:

1. **Run > Edit Configurations**를 엽니다
2. 변경할 Configuration을 선택합니다
3. **Working directory** 필드를 `$ContentRoot$`로 변경합니다
4. 여러 개를 변경해야 하면 각각 수정하거나, `.idea/workspace.xml` 파일에서 일괄 수정할 수 있습니다

---

## 다른 언어에서의 설정

이 방법은 Python뿐 아니라 IntelliJ에서 지원하는 다른 언어에도 동일하게 적용됩니다:

- **Java/Kotlin**: Run/Debug Configuration의 Working directory 필드
- **Node.js**: Node.js Run Configuration의 Working directory 필드
- **Go**: Go Run Configuration의 Working directory 필드
- **Ruby**: Ruby Run Configuration의 Working directory 필드

각 언어의 Configuration Template에서 동일하게 `$ContentRoot$`를 설정하면 됩니다.

---

## 팁: .env 파일과 함께 사용

많은 Python 프로젝트가 `.env` 파일을 프로젝트 루트에 두고 환경변수를 관리합니다. Working Directory가 프로젝트 루트로 설정되어 있으면 `python-dotenv` 등의 라이브러리가 자동으로 `.env` 파일을 찾을 수 있습니다.

```python
from dotenv import load_dotenv

# Working Directory가 프로젝트 루트이면 자동으로 .env 파일을 찾음
load_dotenv()
```

IntelliJ의 **EnvFile** 플러그인을 설치하면 Run Configuration에서 `.env` 파일을 직접 지정할 수도 있습니다.

---

## 트러블슈팅: Working Directory 관련 흔한 문제

### 문제 1: 테스트 실행 시 Working Directory가 다름

JUnit이나 pytest 같은 테스트 프레임워크를 실행할 때 Working Directory가 기대와 다른 경우가 있습니다. IntelliJ는 테스트 Configuration에 별도의 Working Directory를 설정할 수 있습니다.

**해결 방법:**
1. Run > Edit Configurations에서 테스트 Configuration 선택
2. Edit configuration templates... 클릭
3. JUnit (또는 pytest 등) 선택
4. Working directory를 `$ContentRoot$`로 설정

### 문제 2: 멀티 모듈 프로젝트에서의 Working Directory

멀티 모듈 프로젝트에서는 `$ContentRoot$`가 각 모듈의 루트를 가리킵니다. 프로젝트 전체의 루트를 사용하고 싶다면 `$ProjectFileDir$`를 사용하세요.

```
project-root/          ← $ProjectFileDir$
├── module-a/          ← module-a의 $ContentRoot$
│   └── src/
├── module-b/          ← module-b의 $ContentRoot$
│   └── src/
└── .idea/
```

### 문제 3: Gradle/Maven 프로젝트에서 Working Directory 불일치

Gradle이나 Maven으로 실행할 때와 IntelliJ에서 직접 실행할 때 Working Directory가 다를 수 있습니다. 이 경우 빌드 도구의 설정과 IntelliJ 설정을 일치시켜야 합니다.

**Gradle 설정 예시:**
```groovy
// build.gradle
tasks.withType(JavaExec) {
    workingDir = rootProject.projectDir
}
```

---

## 프로젝트 유형별 권장 설정

### Python 프로젝트

| 설정 항목 | 권장 값 | 이유 |
|----------|---------|------|
| Working directory | `$ContentRoot$` | 상대 경로 파일 접근 일관성 |
| Python interpreter | 프로젝트별 가상환경 | 의존성 격리 |
| Add content roots to PYTHONPATH | 체크 | 모듈 임포트 용이 |
| Add source roots to PYTHONPATH | 체크 | src 디렉토리 인식 |

### Java/Kotlin 프로젝트

| 설정 항목 | 권장 값 | 이유 |
|----------|---------|------|
| Working directory | `$ContentRoot$` 또는 `$ProjectFileDir$` | 리소스 파일 접근 |
| Use classpath of module | 실행 대상 모듈 선택 | 올바른 클래스패스 |
| JRE | 프로젝트 SDK | 일관된 런타임 환경 |

### Node.js 프로젝트

| 설정 항목 | 권장 값 | 이유 |
|----------|---------|------|
| Working directory | `$ContentRoot$` | package.json 위치 기준 |
| Node interpreter | 프로젝트별 nvm 경로 | Node 버전 관리 |
| Node parameters | `--env-file=.env` | 환경변수 로딩 (Node 20+) |

---

## 커맨드라인과 IDE의 Working Directory 통일

IDE에서 실행할 때와 터미널에서 실행할 때 Working Directory가 다르면 혼란이 발생합니다. 코드에서 Working Directory에 의존하지 않는 방식으로 경로를 처리하는 것이 가장 바람직합니다.

```python
# Working Directory에 의존하지 않는 경로 처리 (Python)
import os

# 현재 스크립트 기준 상대 경로
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
config_path = os.path.join(BASE_DIR, '..', 'config', 'settings.json')

# pathlib 사용 (더 Pythonic한 방식)
from pathlib import Path
BASE_DIR = Path(__file__).resolve().parent
config_path = BASE_DIR / '..' / 'config' / 'settings.json'
```

```java
// Working Directory에 의존하지 않는 경로 처리 (Java)
// 클래스패스에서 리소스 로딩
InputStream is = getClass().getResourceAsStream("/config/settings.json");
```

이렇게 하면 IDE의 Working Directory 설정에 관계없이 안정적으로 파일에 접근할 수 있습니다. 다만 프로젝트의 특성에 따라 Working Directory 설정이 반드시 필요한 경우도 있으므로, `$ContentRoot$` 설정은 기본으로 해두는 것이 좋습니다.
