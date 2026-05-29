---
layout: post
title: "Grunt - JavaScript Task Runner"
date: 2025-12-28
categories: [frontend, nodejs]
tags: [nodejs, grunt, task-runner, build-tool]
image: /assets/images/posts/thumbnails/2025-12-28-nodejs-grunt.png
redirect_from:
  - "/frontend/nodejs/2025/12/28/nodejs-grunt.html"
---

Grunt는 JavaScript 기반의 태스크 러너로, 반복적인 개발 작업(파일 압축, 컴파일, 테스트, 린트 등)을 자동화하는 데 사용됩니다. Gruntfile에 태스크를 정의하고 명령어 하나로 실행할 수 있어 빌드 프로세스를 효율적으로 관리할 수 있습니다.

## 설치 요구사항

- Node.js
- npm
- Java (일부 플러그인에서 필요)

## 설치

### Grunt CLI 전역 설치

먼저 Grunt 명령줄 인터페이스를 전역으로 설치합니다:

```bash
npm install -g grunt-cli
```

`grunt-cli`는 프로젝트 로컬에 설치된 Grunt를 찾아 실행하는 역할을 합니다. 전역에 설치해도 프로젝트별로 다른 버전의 Grunt를 사용할 수 있습니다.

### 프로젝트에 Grunt 설치

```bash
npm install grunt --save-dev
```

`--save-dev`로 설치하여 개발 의존성에 추가합니다. Grunt는 빌드 도구이므로 프로덕션 환경에서는 필요하지 않습니다.

## Gruntfile 작성

프로젝트 루트에 `Gruntfile.js` 파일을 생성합니다. 이 파일에서 태스크를 설정하고 등록합니다:

```javascript
module.exports = function(grunt) {

    // 프로젝트 설정
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // uglify 플러그인 설정 - JS 파일 압축
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'src/<%= pkg.name %>.js',
                dest: 'build/<%= pkg.name %>.min.js'
            }
        },

        // jshint 플러그인 설정 - JS 코드 검사
        jshint: {
            files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
            options: {
                globals: {
                    jQuery: true
                }
            }
        },

        // watch 플러그인 설정 - 파일 변경 감지
        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['jshint']
        }
    });

    // 플러그인 로드
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // 기본 태스크 등록
    grunt.registerTask('default', ['jshint', 'uglify']);
};
```

## 주요 플러그인

Grunt의 강점은 풍부한 플러그인 생태계에 있습니다. 자주 사용되는 플러그인을 소개합니다:

| 플러그인 | 설명 | 설치 명령어 |
|---------|------|------------|
| `grunt-contrib-uglify` | JavaScript 파일 압축 | `npm install grunt-contrib-uglify --save-dev` |
| `grunt-contrib-jshint` | JavaScript 코드 품질 검사 | `npm install grunt-contrib-jshint --save-dev` |
| `grunt-contrib-watch` | 파일 변경 감지 및 자동 실행 | `npm install grunt-contrib-watch --save-dev` |
| `grunt-contrib-concat` | 여러 파일을 하나로 병합 | `npm install grunt-contrib-concat --save-dev` |
| `grunt-contrib-cssmin` | CSS 파일 압축 | `npm install grunt-contrib-cssmin --save-dev` |
| `grunt-contrib-clean` | 파일/디렉토리 삭제 | `npm install grunt-contrib-clean --save-dev` |
| `grunt-contrib-copy` | 파일 복사 | `npm install grunt-contrib-copy --save-dev` |

## 태스크 실행

```bash
grunt           # 기본(default) 태스크 실행
grunt uglify    # 특정 태스크만 실행
grunt watch     # 파일 감시 모드 시작
```

## 커스텀 태스크 만들기

직접 태스크를 정의할 수도 있습니다:

```javascript
grunt.registerTask('hello', 'My custom task', function() {
    grunt.log.writeln('Hello from custom task!');
});

// 여러 태스크를 조합한 태스크
grunt.registerTask('build', ['clean', 'jshint', 'concat', 'uglify', 'cssmin']);
```

## Grunt vs 현대적 대안

Grunt는 한때 프론트엔드 빌드 도구의 표준이었지만, 현재는 여러 대안이 등장했습니다:

| 도구 | 특징 |
|------|------|
| **Grunt** | 설정 기반, 풍부한 플러그인, 직관적 |
| **Gulp** | 코드 기반, 스트림 처리로 빠른 속도 |
| **Webpack** | 모듈 번들러, 현대 프론트엔드 표준 |
| **Vite** | 빠른 개발 서버, ES Modules 기반 |

새 프로젝트에서는 Webpack이나 Vite를 사용하는 것이 일반적이지만, Grunt는 레거시 프로젝트에서 여전히 사용되고 있으며, 단순한 빌드 작업에서는 설정이 직관적이라는 장점이 있습니다.

## 팁

- `Gruntfile.js`가 커지면 설정을 별도 파일로 분리하는 `load-grunt-config` 플러그인을 사용하세요
- `time-grunt` 플러그인으로 각 태스크의 실행 시간을 측정할 수 있습니다
- `jit-grunt` 플러그인으로 사용하는 태스크만 자동 로드하여 실행 속도를 개선할 수 있습니다
