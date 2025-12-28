---
layout: post
title: "Bash 문자열 조작 및 연산자"
date: 2025-12-28 12:12:00 +0900
categories: [infra, devops]
tags: [bash, shell, linux, string, operators]
description: "Bash에서 문자열을 다루는 방법 - 포맷팅, 치환, 비교 연산자, 리다이렉션을 설명합니다."
---

# Bash 문자열 조작 및 연산자

Bash에서 문자열을 효과적으로 다루는 방법을 정리했습니다.

## Quoting

### Double Quote

변수와 명령어가 확장됩니다:

```bash
echo "$USER $((2+2)) $(cal)"
```

### Single Quote

모든 것이 그대로 출력됩니다:

```bash
echo 'text $USER $(command)'
# => text $USER $(command)
```

### Quote의 목적

- 여러 단어를 하나의 인자로 처리
- 공백과 줄바꿈 유지

```bash
echo text ~/*.txt {a,b} $(echo foo) $((2+2)) $USER
# => text /home/me/ls-output.txt a b foo 4 me

echo "text ~/*.txt {a,b} $(echo foo) $((2+2)) $USER"
# => text ~/*.txt {a,b} foo 4 me
```

## Escape Character

```bash
echo -e "Inserting several blank lines\n\n\n"
```

## 문자열 포맷팅

```bash
printf "a%s\n" "a"
```

## 문자열 길이

```bash
echo ${#AA}    # 문자열 길이
```

## 문자열 포함 여부

```bash
string='My long string'
if [[ $string == *$TEST* ]]; then
    echo "It's there"
fi
```

## 문자열 연산자

참고: [Linux Journal - String Operators](http://www.linuxjournal.com/article/8919)

### 기억하기

- `#`는 `$`의 왼쪽에 있음 -> 왼쪽에서 삭제
- `%`는 `$`의 오른쪽에 있음 -> 오른쪽에서 삭제

### 왼쪽에서 삭제

```bash
foo=1:2:3

# ## : 가장 긴 매칭 삭제
echo ${foo##*:}   # => 3

# # : 가장 짧은 매칭 삭제
echo ${foo#*:}    # => 2:3
```

### 오른쪽에서 삭제

```bash
foo="this is a test"

# % : 가장 짧은 매칭 삭제
echo ${foo%t*st}   # => this is a

# %% : 가장 긴 매칭 삭제
echo ${foo%%t*st}  # => (빈 문자열)
```

### 기본값 설정

```bash
# :- 비어있으면 대체값 반환 (변수는 변경 안 됨)
foo=""
echo ${foo:-one}   # => one
echo $foo          # => (빈 문자열)

# := 비어있으면 대체값 설정 및 반환
foo=""
echo ${foo:=one}   # => one
echo $foo          # => one

# :+ 값이 있으면 대체값 반환
foo="test"
echo ${foo:+bar}   # => bar
```

## 문자열 분리 (IFS)

```bash
IN="bla@some.com;john@home.com"
IFS=';'
mails2=$IN
for x in $mails2; do
    echo "> [$x]"
done
```

## 리다이렉션 연산자

### 출력 리다이렉션

```bash
# > : 덮어쓰기
ls > file_list.txt

# >> : 추가
ls >> file_list.txt
```

### 입력 리다이렉션

```bash
# < : 파일을 입력으로
sort < file_list.txt

# << : Here Document
cat << _EOF_
<html>
<head>
    <title>Page Title</title>
</head>
</html>
_EOF_
```

### 파이프라인

왼쪽 명령의 출력을 오른쪽 명령의 입력으로:

```bash
ls -l | less
find . -type f -print | wc -l   # 파일 개수
```

## 비교 연산자

### 숫자 비교

| 연산자 | 의미 |
|--------|------|
| `-eq` | equal |
| `-ne` | not equal |
| `-gt` | greater than |
| `-ge` | greater than or equal |
| `-lt` | less than |
| `-le` | less than or equal |

```bash
if [ "$a" -eq "$b" ]; then
    echo "Equal"
fi

# 또는 (( )) 사용
if (( "$a" < "$b" )); then
    echo "Less"
fi
```

### 문자열 비교

```bash
if [ "$a" = "$b" ]; then
    echo "Equal"
fi

if [ "$a" != "$b" ]; then
    echo "Not equal"
fi
```

## Expansion

확장은 명령 실행 전에 처리됩니다:

```bash
# 공백 유지 안 됨
echo $(cal)
# => February 2008 Su Mo Tu We Th Fr Sa 1 2 ...

# 공백 유지됨
echo "$(cal)"
# =>
# February 2008
# Su Mo Tu We Th Fr Sa
# ...
```

## 기호 정리

| 기호 | 용도 | 예시 |
|------|------|------|
| `${}` | 변수 | `${arr[0]}` |
| `$()` | 명령어 치환 | `$(command)` |
| `$(())` | 산술 연산 | `$((num+1))` |
| `#` | 배열 길이/문자열 길이 | `${#arr[*]}` |
| `*` | 전체 배열 | `${arr[*]}` |

## Pipe 연산자

```bash
# 값을 다음 명령에 전달
echo "dsf" | md5
```

## 여러 명령 실행

```bash
cd a; ls         # 둘 다 실행
cd a || ls       # 첫 번째 실패 시 두 번째 실행
cd a && ls       # 첫 번째 성공 시 두 번째 실행
```

## BackSlash (긴 명령어)

```bash
ls -l \
   --reverse \
   --human-readable \
   --full-time
```

## 출력 옵션

```bash
echo -n "text"   # 줄바꿈 없이 출력
```

## 환경 변수 파일

| 파일 | 설명 |
|------|------|
| `/etc/profile` | 모든 사용자 적용 |
| `~/.bash_profile` | 사용자별 시작 스크립트 |
| `~/.bash_login` | bash_profile 없을 때 |
| `~/.profile` | Debian 기반 기본값 |

```bash
printenv   # 환경 변수 출력
```

### 디버깅

```bash
set -x    # 실행 내용 표시
set +x    # 표시 끄기
```

### PATH 추가

```bash
export PATH=$PATH:/opt/gradle/bin
echo "export PATH=$PATH:~/Library/Android/sdk/tools/" >> ~/.bash_profile
```
