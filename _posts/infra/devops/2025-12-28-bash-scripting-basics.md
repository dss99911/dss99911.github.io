---
layout: post
title: "Bash 스크립팅 기초 - 변수, 조건문, 반복문"
date: 2025-12-28 12:08:00 +0900
categories: [infra, devops]
tags: [bash, shell, scripting, linux, automation]
description: "Bash 스크립트의 기본 문법 - 변수 선언, 조건문, 반복문, 함수 정의 방법을 설명합니다."
image: /assets/images/posts/thumbnails/2025-12-28-bash-scripting-basics.png
---

# Bash 스크립팅 기초

Bash 스크립트는 Linux/Unix 시스템에서 자동화를 위해 필수적인 기술입니다.

## 기본 규칙

- 대입 연산 시 `=` 좌우에 공백 없이 작성: `VAR=text`
- 상수는 대문자, 변수는 소문자
- 단어 분리는 `_` 사용

## 변수

### 변수 선언

```bash
VAR=text  # 같은 쉘에서만 사용 가능
```

### export (환경 변수)

```bash
export VAR=text  # 같은 프로세스 내에서 사용 가능, 프로세스 종료 시 초기화
```

### 변수 사용

```bash
echo "$VAR"
echo "${VAR}"
mkdir ~/temp/db/$1  # 변수 연결
```

## Command Substitution

명령 실행 결과를 변수에 저장:

```bash
$(command)
`command`

# 예시
echo $(ls)
ls -l $(which cp)
echo `ls`
```

## Quoting

```bash
# 따옴표 안에서 변수, 계산, 명령어 사용
echo "$USER $((2+2)) $(cal)"

# Double quote - 변수/명령어 확장됨
echo "text ~/*.txt {a,b} $(echo foo) $((2+2)) $USER"
# => text ~/*.txt {a,b} foo 4 me

# Single quote - 그대로 출력
echo 'text ~/*.txt {a,b} $(echo foo) $((2+2)) $USER'
# => text ~/*.txt {a,b} $(echo foo) $((2+2)) $USER
```

## 조건문

### if문

```bash
# 한 줄
if true; then echo "It's true."; else echo "bb"; fi

# 여러 줄
if [ -f .bash_profile ]; then
    echo "You have a .bash_profile."
elif [ "$character" = "2" ]; then
    echo "You entered two."
else
    echo "Yikes!"
fi
```

### 비교 연산

```bash
if [ $number = "1" ]; then
    echo "Number equals 1"
fi

# 숫자와 문자 구별 안함
if [ 1 = "1" ]; then
    echo "Equal"
fi
```

### case문

```bash
case $character in
    1 ) echo "You entered one."
        ;;
    2 ) echo "You entered two."
        ;;
    [[:lower:]] | [[:upper:]] )
        echo "You typed a letter"
        ;;
    [0-9] )
        echo "You typed a digit"
        ;;
    * ) echo "Unknown input"
esac
```

### test 표현식

```bash
# 파일 테스트
-d file   # directory
-e file   # exists
-f file   # regular file

# 문자열 테스트
-z string     # empty (zero)
-n string     # not empty
string1 = string2
string1 != string2

# 산술 비교
-eq  # equal
-ne  # not equal
-lt  # less than
-le  # less than or equal
-gt  # greater than
-ge  # greater than or equal

# 부정
if [ ! -d $1 ]; then
    echo "Not a directory"
fi
```

## 반복문

### for문

```bash
# 기본 형태
for variable in words; do
    commands
done

# 예시
for i in word1 word2 word3; do
    echo $i
done

# 숫자 범위
for index in 1 2 3 4 5; do
    echo $index
done

# C 스타일
for (( i = 2 ; i <= 16 ; i++ )); do
    cp 1.sqlite $i".sqlite"
done

# 배열 순회
for element in $(seq 0 $((${#script_contents[@]} - 1))); do
    echo -n "${script_contents[$element]}"
done
```

### while문

```bash
number=0
while [ "$number" -lt 10 ]; do
    echo "Number = $number"
    number=$((number + 1))
done
```

### until문 (false일 때 계속)

```bash
number=0
until [ "$number" -ge 10 ]; do
    echo "Number = $number"
    number=$((number + 1))
done
```

## 산술 연산

```bash
# Arithmetic Expansion
echo $((2 + 2))
echo $(((5**2) * 3))

# let
let myvar+=1

# 배열 연산
area[5]=`expr ${area[11]} + ${area[13]}`

# 제곱
$((5**2))

# 나머지
$((5%2))
```

## 배열

```bash
# 선언
area=( zero one two three four )

# 접근
echo ${area[11]}

# 설정
area[11]=abc
area3=([17]=seventeen [24]=twenty-four)

# 길이
echo ${#area[*]}

# 전체 출력
echo ${array[*]}
echo ${array[@]}

# 범위
echo ${array[*]:1:3}  # 1부터 3개

# Brace expansion
list=(Front-{a,b,c}-back)  # Front-a-back Front-b-back Front-c-back
list=(Number_{1..5})       # Number_1 ... Number_5
```

## 함수

### Alias

```bash
alias l='ls -l'
```

### 함수 정의

```bash
today() {
    echo -n "Today's date is: "
    date +"%A, %B %-d, %Y"
}

today  # 함수 호출
```

## Argument 처리

```bash
# sh a.sh a b c

# 위치 파라미터
$0  # 스크립트 경로
$1  # 첫 번째 인자 (a)
$2  # 두 번째 인자 (b)
$#  # 인자 개수

# 반복 처리
while [ "$1" != "" ]; do
    case $1 in
        -f | --file )   shift
                        filename=$1
                        ;;
        -i | --interactive )
                        interactive=1
                        ;;
        -h | --help )   usage
                        exit
                        ;;
        * )             usage
                        exit 1
    esac
    shift
done

# for문 사용
for i in "$@"; do
    echo $i
done
```

## 명령 결과 확인

```bash
# 마지막 명령 결과 (0이면 성공)
echo $?

ls -d /usr/bin
echo $?  # 0

ls -d /bin/usr
echo $?  # 2 (에러)
```

## Shell 실행

```bash
# 새 쉘에서 실행
sh test.sh
. test.sh

# 현재 쉘에서 실행 (변수 공유)
source test.sh
```
