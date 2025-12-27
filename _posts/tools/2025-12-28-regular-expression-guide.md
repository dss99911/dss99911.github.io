---
layout: post
title: "정규표현식 완벽 가이드: 그룹, 반복, Lookahead/Lookbehind"
date: 2025-12-28 12:06:00 +0900
categories: tools
tags: [regex, regular-expression, pattern-matching, programming]
description: "정규표현식의 그룹핑, 반복 패턴, Lookahead와 Lookbehind 사용법을 상세히 설명합니다."
---

## 정규표현식 기초

정규표현식(Regular Expression)은 문자열에서 특정 패턴을 찾거나 대체하기 위한 표현 방식입니다.

---

## 기본 메타 문자

| 문자 | 설명 | 예시 |
|------|------|------|
| `.` | 모든 문자 | `a.c` -> abc, aXc |
| `^` | 문자열 시작 | `^abc` |
| `$` | 문자열 끝 | `abc$` |
| `\d` | 숫자 [0-9] | `\d+` |
| `\w` | 단어 문자 [a-zA-Z0-9_] | `\w+` |
| `\s` | 공백 문자 | `\s+` |
| `\D` | 숫자가 아닌 것 | `\D+` |
| `\W` | 단어가 아닌 것 | `\W+` |
| `\S` | 공백이 아닌 것 | `\S+` |

---

## 반복 (Quantifiers)

### 기본 반복

| 패턴 | 설명 | 예시 |
|------|------|------|
| `*` | 0회 이상 | `ab*c` -> ac, abc, abbc |
| `+` | 1회 이상 | `ab+c` -> abc, abbc (ac는 불일치) |
| `?` | 0회 또는 1회 | `ab?c` -> ac, abc |
| `{n}` | 정확히 n회 | `a{3}` -> aaa |
| `{n,}` | n회 이상 | `a{2,}` -> aa, aaa, aaaa |
| `{n,m}` | n회 이상 m회 이하 | `a{2,4}` -> aa, aaa, aaaa |

### Greedy vs Lazy

```regex
# Greedy (기본값) - 최대한 많이 매칭
<.*>     : <div>content</div> 전체 매칭

# Lazy - 최소한 매칭
<.*?>    : <div>만 매칭
```

**Lazy 수량자:**
- `*?` : 0회 이상 (최소)
- `+?` : 1회 이상 (최소)
- `??` : 0회 또는 1회 (최소)
- `{n,m}?` : n~m회 (최소)

---

## 그룹 (Groups)

### 캡처 그룹

```regex
# 기본 그룹
(abc)+          : abc, abcabc, abcabcabc

# 번호로 참조
(\w+)-(\d+)     : word-123
                  $1 = word, $2 = 123

# 역참조 (Backreference)
(\w+)\s+\1      : hello hello (같은 단어 반복)
```

### 이름 있는 그룹 (Named Groups)

```regex
# Python/PCRE 스타일
(?P<name>\w+)-(?P<number>\d+)

# .NET/Java 스타일
(?<name>\w+)-(?<number>\d+)
```

### 비캡처 그룹 (Non-capturing Groups)

캡처하지 않고 그룹화만 할 때 사용:

```regex
(?:abc)+        : 그룹화는 하지만 캡처하지 않음
```

---

## Lookahead와 Lookbehind

패턴을 확인하지만 실제로 소비하지 않는 Zero-width Assertions입니다.

### Lookahead (전방 탐색)

**Positive Lookahead (?=...)**
```regex
# "다음에 특정 패턴이 있는" 위치 매칭
\w+(?=:)        : "name:" 에서 "name" 매칭
foo(?=bar)      : "foobar"에서 "foo" 매칭
```

**Negative Lookahead (?!...)**
```regex
# "다음에 특정 패턴이 없는" 위치 매칭
\w+(?!:)        : "name"만 있을 때 매칭
foo(?!bar)      : "foobaz"에서 "foo" 매칭
```

### Lookbehind (후방 탐색)

**Positive Lookbehind (?<=...)**
```regex
# "앞에 특정 패턴이 있는" 위치 매칭
(?<=\$)\d+      : "$100"에서 "100" 매칭
(?<=@)\w+       : "@username"에서 "username" 매칭
```

**Negative Lookbehind (?<!...)**
```regex
# "앞에 특정 패턴이 없는" 위치 매칭
(?<!\$)\d+      : 앞에 $가 없는 숫자 매칭
```

### 실용적인 예시

```regex
# 비밀번호 검증: 숫자와 문자 모두 포함
^(?=.*[A-Za-z])(?=.*\d).+$

# 이메일에서 도메인만 추출
(?<=@)[^\s]+

# 파일 확장자 제외한 이름
.*(?=\.[^.]+$)
```

---

## 비밀번호 규칙 예제

다양한 비밀번호 정책을 정규표현식으로 구현:

### 최소 요구사항

```regex
# 8자 이상
^.{8,}$

# 숫자 포함
(?=.*\d)

# 영문 소문자 포함
(?=.*[a-z])

# 영문 대문자 포함
(?=.*[A-Z])

# 특수문자 포함
(?=.*[!@#$%^&*])
```

### 종합 비밀번호 검증

```regex
# 8자 이상, 대소문자, 숫자, 특수문자 모두 포함
^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$
```

### 실제 사용 예시 (JavaScript)

```javascript
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

function validatePassword(password) {
    if (!passwordRegex.test(password)) {
        return "비밀번호는 8자 이상, 대소문자, 숫자, 특수문자를 포함해야 합니다.";
    }
    return "유효한 비밀번호입니다.";
}
```

---

## 언어별 정규표현식

### JavaScript

```javascript
// 리터럴
const regex = /pattern/flags;

// 생성자
const regex = new RegExp('pattern', 'flags');

// 주요 메서드
regex.test(string)      // boolean 반환
string.match(regex)     // 매칭 배열 반환
string.replace(regex, replacement)
string.split(regex)
```

### Python

```python
import re

# 기본 사용
re.match(pattern, string)   # 시작부터 매칭
re.search(pattern, string)  # 어디서든 매칭
re.findall(pattern, string) # 모든 매칭 찾기
re.sub(pattern, repl, string) # 대체

# 컴파일
regex = re.compile(pattern)
regex.search(string)
```

### Java

```java
import java.util.regex.*;

Pattern pattern = Pattern.compile("\\d+");
Matcher matcher = pattern.matcher("abc123def");

while (matcher.find()) {
    System.out.println(matcher.group());
}
```

---

## 플래그 (Flags)

| 플래그 | 설명 |
|--------|------|
| `i` | 대소문자 무시 |
| `g` | 전역 검색 |
| `m` | 멀티라인 모드 |
| `s` | .이 개행도 매칭 |
| `u` | 유니코드 모드 |
| `x` | 확장 모드 (공백 무시) |

---

## 유용한 정규표현식 모음

```regex
# 이메일
^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$

# 전화번호 (한국)
^01[016789]-?\d{3,4}-?\d{4}$

# URL
https?://[\w.-]+(?:/[\w./-]*)?

# IP 주소
\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b

# 한글만
[가-힣]+

# HTML 태그
<[^>]+>

# 숫자에 콤마 추가 (역참조 활용)
(\d)(?=(\d{3})+(?!\d))  -> $1,
```
