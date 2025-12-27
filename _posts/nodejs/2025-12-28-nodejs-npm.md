---
layout: post
title: "NPM과 package.json 사용법"
date: 2025-12-28
categories: nodejs
tags: [nodejs, npm, package-json]
---

Node Package Manager(NPM)의 사용법과 package.json 설정에 대해 알아봅니다.

## NPM 이란?

NPM은 Node Package Manager의 약자로, Node.js의 패키지 관리자입니다.
- Package: Node.js에서 모듈에 필요한 모든 파일을 포함하는 단위

## 기본 명령어

### 도움말
```bash
npm help install
```

### 프로젝트 실행
```bash
npm install  # 프로젝트 내의 의존성들을 설치
npm start    # 프로젝트 실행
```

### 패키지 설치
```bash
npm install upper-case
npm install upper-case --save  # package.json의 dependencies에 추가
```

### 패키지 사용
```javascript
var uc = require('upper-case');
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
