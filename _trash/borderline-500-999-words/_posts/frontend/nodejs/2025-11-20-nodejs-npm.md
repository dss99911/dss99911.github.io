---
layout: post
title: "NPM과 package.json 사용법"
date: 2025-12-28
categories: [frontend, nodejs]
tags: [nodejs, npm, package-json]
image: /assets/images/posts/thumbnails/2025-12-28-nodejs-npm.png
redirect_from:
  - "/frontend/nodejs/2025/12/28/nodejs-npm.html"
---

Node Package Manager(NPM)의 사용법과 package.json 설정에 대해 알아봅니다. NPM은 Node.js 생태계의 핵심 도구로, 수백만 개의 오픈소스 패키지를 손쉽게 설치하고 관리할 수 있게 해줍니다.

## NPM 이란?

NPM은 Node Package Manager의 약자로, Node.js의 패키지 관리자입니다.
- Package: Node.js에서 모듈에 필요한 모든 파일을 포함하는 단위
- Node.js를 설치하면 NPM이 자동으로 함께 설치됩니다
- [npmjs.com](https://www.npmjs.com/) 에서 공개된 패키지를 검색할 수 있습니다

## 기본 명령어

### 도움말
```bash
npm help install
```

### 프로젝트 초기화
```bash
npm init        # 대화형으로 package.json 생성
npm init -y     # 기본값으로 package.json 바로 생성
```

`npm init`을 실행하면 프로젝트 이름, 버전, 설명 등을 입력받아 package.json 파일을 생성합니다. `-y` 플래그를 사용하면 모든 값을 기본값으로 설정합니다.

### 프로젝트 실행
```bash
npm install  # 프로젝트 내의 의존성들을 설치
npm start    # 프로젝트 실행
```

### 패키지 설치
```bash
npm install upper-case                # node_modules에 설치
npm install upper-case --save         # package.json의 dependencies에 추가 (npm 5+ 에서는 기본 동작)
npm install eslint --save-dev         # devDependencies에 추가 (개발용)
npm install -g nodemon                # 전역(global) 설치
```

`--save`는 npm 5 이후부터 기본 동작이 되어 별도로 지정하지 않아도 됩니다. `--save-dev`는 테스트 도구나 빌드 도구처럼 개발 시에만 필요한 패키지에 사용합니다. 전역 설치(`-g`)는 CLI 도구를 시스템 전체에서 사용할 때 적합합니다.

### 패키지 사용
```javascript
var uc = require('upper-case');
```

### 패키지 관리
```bash
npm update                # 모든 패키지 업데이트
npm update upper-case     # 특정 패키지 업데이트
npm uninstall upper-case  # 패키지 제거
npm list                  # 설치된 패키지 목록 확인
npm list --depth=0        # 최상위 패키지만 확인
npm outdated              # 업데이트 가능한 패키지 확인
```

## package.json 설정

package.json은 프로젝트의 설정 파일입니다. `scripts.start`에 처음 실행할 파일을 설정합니다.

```json
{
  "name": "slacktest",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "start": "node ./bin/www"
  },
  "dependencies": {
    "body-parser": "~1.18.2",
    "cookie-parser": "~1.4.3",
    "debug": "~2.6.9",
    "express": "~4.15.5",
    "jade": "~1.11.0",
    "morgan": "~1.9.0",
    "serve-favicon": "~2.4.5"
  }
}
```

### 버전 표기법

package.json의 의존성 버전에는 특수한 기호가 사용됩니다:

| 기호 | 의미 | 예시 |
|------|------|------|
| `~` | 패치 버전까지 허용 | `~1.18.2` → 1.18.x |
| `^` | 마이너 버전까지 허용 | `^1.18.2` → 1.x.x |
| 없음 | 정확한 버전만 사용 | `1.18.2` |
| `*` | 모든 버전 허용 | `*` |

`~`는 버그 수정 업데이트만 허용하므로 안정적이고, `^`는 하위 호환성이 유지되는 범위까지 업데이트를 허용합니다.

### scripts 활용

`scripts` 필드에 자주 사용하는 명령어를 등록해두면 편리합니다:

```json
{
  "scripts": {
    "start": "node ./bin/www",
    "dev": "nodemon ./bin/www",
    "test": "jest",
    "build": "webpack --mode production",
    "lint": "eslint ."
  }
}
```

```bash
npm start       # scripts.start 실행 (npm run 생략 가능)
npm test        # scripts.test 실행 (npm run 생략 가능)
npm run dev     # 커스텀 스크립트는 'npm run' 필요
npm run build   # 빌드 실행
```

`start`와 `test`는 특별한 스크립트로 `npm run` 없이 바로 실행할 수 있지만, 그 외의 커스텀 스크립트는 반드시 `npm run`을 붙여야 합니다.

## package-lock.json

`npm install`을 실행하면 `package-lock.json` 파일이 자동 생성됩니다. 이 파일은 설치된 패키지의 정확한 버전 정보를 기록하여, 팀원 모두가 동일한 버전의 패키지를 사용할 수 있도록 보장합니다. **반드시 버전 관리에 포함(git commit)해야 합니다.**

## npx 사용하기

npx는 npm 5.2+부터 포함된 도구로, 패키지를 전역 설치 없이 일회성으로 실행할 수 있습니다:

```bash
npx create-react-app my-app    # React 프로젝트 생성
npx eslint .                   # eslint 일회성 실행
```

전역 설치를 최소화하고 항상 최신 버전을 사용할 수 있어 편리합니다.
