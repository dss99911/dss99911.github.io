---
layout: post
title: "Python 연산자 완벽 가이드"
date: 2026-01-11
categories: [programming, python]
tags: [python, operators, comparison, logical]
description: "Python의 모든 연산자를 상세히 설명합니다. 산술, 비교, 논리, 비트, 멤버십, 아이덴티티 연산자와 연산자 우선순위를 다룹니다."
image: /assets/images/posts/python-operators.png
---

Python은 다양한 연산자를 제공하여 데이터를 조작하고 비교할 수 있게 합니다. 이 글에서는 Python의 모든 연산자 유형과 사용법을 상세히 알아봅니다.

## 산술 연산자

기본적인 수학 연산을 수행합니다.

```python
a, b = 10, 3

print(a + b)    # 덧셈: 13
print(a - b)    # 뺄셈: 7
print(a * b)    # 곱셈: 30
print(a / b)    # 나눗셈: 3.333...
print(a // b)   # 정수 나눗셈 (몫): 3
print(a % b)    # 나머지: 1
print(a ** b)   # 거듭제곱: 1000
```

| 연산자 | 설명 | 예시 | 결과 |
|--------|------|------|------|
| `+` | 덧셈 | `10 + 3` | 13 |
| `-` | 뺄셈 | `10 - 3` | 7 |
| `*` | 곱셈 | `10 * 3` | 30 |
| `/` | 나눗셈 | `10 / 3` | 3.333... |
| `//` | 정수 나눗셈 | `10 // 3` | 3 |
| `%` | 나머지 | `10 % 3` | 1 |
| `**` | 거듭제곱 | `10 ** 3` | 1000 |

### 정수 나눗셈 주의사항

```python
# 양수
print(9 // 2)      # 4
print(9.0 // 2.0)  # 4.0

# 음수 - 항상 내림 (음의 무한대 방향)
print(-11 // 3)    # -4 (not -3)
print(-11.0 // 3)  # -4.0

# 나머지도 영향받음
print(-11 % 3)     # 1 (not -2)
# 검증: -11 = 3 * (-4) + 1
```

---

## 비교 연산자

두 값을 비교하여 `True` 또는 `False`를 반환합니다.

```python
a, b = 10, 20

print(a == b)   # 같음: False
print(a != b)   # 다름: True
print(a > b)    # 초과: False
print(a < b)    # 미만: True
print(a >= b)   # 이상: False
print(a <= b)   # 이하: True
```

| 연산자 | 설명 | 예시 | 결과 |
|--------|------|------|------|
| `==` | 같음 | `10 == 20` | False |
| `!=` | 다름 | `10 != 20` | True |
| `>` | 초과 | `10 > 20` | False |
| `<` | 미만 | `10 < 20` | True |
| `>=` | 이상 | `10 >= 20` | False |
| `<=` | 이하 | `10 <= 20` | True |

### 체이닝 비교

Python에서는 비교 연산자를 연결할 수 있습니다.

```python
x = 5

# 기존 방식
if x > 0 and x < 10:
    print("0과 10 사이")

# 체이닝 (더 읽기 쉬움)
if 0 < x < 10:
    print("0과 10 사이")

# 여러 비교 연결
if 1 <= x <= 5 <= 10:
    print("조건 만족")

# 다른 비교 연산자도 가능
if a == b == c:
    print("모두 같음")
```

---

## 논리 연산자

불리언 값을 조합합니다.

```python
a, b = True, False

print(a and b)    # 논리곱: False
print(a or b)     # 논리합: True
print(not a)      # 부정: False
```

| 연산자 | 설명 | 예시 | 결과 |
|--------|------|------|------|
| `and` | 둘 다 참이면 참 | `True and False` | False |
| `or` | 하나라도 참이면 참 | `True or False` | True |
| `not` | 부정 | `not True` | False |

### 단축 평가 (Short-circuit Evaluation)

```python
# and: 첫 번째가 False면 두 번째 평가 안 함
result = False and expensive_function()  # 함수 호출 안 됨

# or: 첫 번째가 True면 두 번째 평가 안 함
result = True or expensive_function()    # 함수 호출 안 됨

# 실제 반환값
print(0 and 5)      # 0 (첫 번째 falsy 값)
print(3 and 5)      # 5 (마지막 값)
print(0 or 5)       # 5 (첫 번째 truthy 값)
print(3 or 5)       # 3 (첫 번째 truthy 값)

# 기본값 설정에 활용
name = user_name or "Anonymous"
```

---

## 할당 연산자

값을 변수에 할당합니다.

```python
x = 10       # 기본 할당

x += 5       # x = x + 5  -> 15
x -= 3       # x = x - 3  -> 12
x *= 2       # x = x * 2  -> 24
x /= 4       # x = x / 4  -> 6.0
x //= 2      # x = x // 2 -> 3.0
x %= 2       # x = x % 2  -> 1.0
x **= 3      # x = x ** 3 -> 1.0

# 비트 연산 할당
x = 10
x &= 7       # x = x & 7
x |= 4       # x = x | 4
x ^= 2       # x = x ^ 2
x <<= 1      # x = x << 1
x >>= 1      # x = x >> 1
```

### Walrus 연산자 (:=)

Python 3.8에서 추가된 대입 표현식입니다.

```python
# 기존 방식
data = get_data()
if data:
    process(data)

# Walrus 연산자 사용
if (data := get_data()):
    process(data)

# 리스트 컴프리헨션에서 활용
results = [y for x in data if (y := expensive_func(x)) > 0]

# while 루프에서 활용
while (line := file.readline()):
    print(line)
```

---

## 멤버십 연산자

시퀀스나 컬렉션에 특정 값이 포함되어 있는지 확인합니다.

```python
# 리스트에서
my_list = [1, 2, 3, 4, 5]
print(3 in my_list)       # True
print(10 not in my_list)  # True

# 문자열에서
text = "Hello, World!"
print("Hello" in text)    # True
print("hello" in text)    # False (대소문자 구분)

# 딕셔너리에서 (키를 확인)
my_dict = {'a': 1, 'b': 2}
print('a' in my_dict)     # True
print(1 in my_dict)       # False (값은 확인 안 됨)
print(1 in my_dict.values())  # True

# 튜플, 세트에서도 동일
my_tuple = (1, 2, 3)
my_set = {1, 2, 3}
print(2 in my_tuple)      # True
print(2 in my_set)        # True
```

| 연산자 | 설명 | 예시 | 결과 |
|--------|------|------|------|
| `in` | 포함됨 | `3 in [1, 2, 3]` | True |
| `not in` | 포함 안 됨 | `4 not in [1, 2, 3]` | True |

---

## 아이덴티티 연산자

두 객체가 동일한 객체인지 (같은 메모리 위치) 확인합니다.

```python
a = [1, 2, 3]
b = [1, 2, 3]
c = a

print(a == b)     # True (값이 같음)
print(a is b)     # False (다른 객체)
print(a is c)     # True (같은 객체)

print(id(a))      # 예: 140234567890
print(id(b))      # 예: 140234567891 (다름)
print(id(c))      # 예: 140234567890 (a와 같음)

# None 비교에 권장
x = None
if x is None:     # 권장
    print("x is None")

if x == None:     # 동작하지만 권장하지 않음
    print("x equals None")
```

| 연산자 | 설명 | 예시 |
|--------|------|------|
| `is` | 동일한 객체 | `a is b` |
| `is not` | 다른 객체 | `a is not b` |

### 주의: 작은 정수와 문자열 캐싱

```python
# 작은 정수 (-5 ~ 256)는 캐싱됨
a = 100
b = 100
print(a is b)     # True (캐싱됨)

a = 1000
b = 1000
print(a is b)     # False (캐싱 안 됨)

# 짧은 문자열도 캐싱됨
s1 = "hello"
s2 = "hello"
print(s1 is s2)   # True

# 공백 포함 문자열은 캐싱 안 될 수 있음
s1 = "hello world"
s2 = "hello world"
print(s1 is s2)   # 상황에 따라 다름
```

---

## 비트 연산자

정수를 이진수로 처리합니다.

```python
a = 60    # 0011 1100
b = 13    # 0000 1101

print(bin(a))         # '0b111100'
print(bin(b))         # '0b1101'

print(a & b)          # AND: 12  (0000 1100)
print(a | b)          # OR:  61  (0011 1101)
print(a ^ b)          # XOR: 49  (0011 0001)
print(~a)             # NOT: -61 (보수)
print(a << 2)         # 왼쪽 시프트: 240 (1111 0000)
print(a >> 2)         # 오른쪽 시프트: 15 (0000 1111)
```

| 연산자 | 설명 | 예시 | 결과 |
|--------|------|------|------|
| `&` | AND | `60 & 13` | 12 |
| `\|` | OR | `60 \| 13` | 61 |
| `^` | XOR | `60 ^ 13` | 49 |
| `~` | NOT (보수) | `~60` | -61 |
| `<<` | 왼쪽 시프트 | `60 << 2` | 240 |
| `>>` | 오른쪽 시프트 | `60 >> 2` | 15 |

### 비트 연산 활용 예제

```python
# 플래그 관리
READ = 0b001
WRITE = 0b010
EXECUTE = 0b100

# 권한 부여
permissions = READ | WRITE  # 0b011

# 권한 확인
if permissions & READ:
    print("읽기 권한 있음")

# 권한 제거
permissions &= ~WRITE  # READ만 남음

# 홀수/짝수 확인 (마지막 비트)
n = 5
if n & 1:
    print("홀수")
else:
    print("짝수")

# 2의 거듭제곱 확인
def is_power_of_2(n):
    return n > 0 and (n & (n - 1)) == 0

print(is_power_of_2(16))  # True
print(is_power_of_2(15))  # False
```

---

## 연산자 우선순위

높은 우선순위부터 낮은 우선순위 순서입니다.

| 우선순위 | 연산자 | 설명 |
|----------|--------|------|
| 1 | `()` | 괄호 |
| 2 | `**` | 거듭제곱 |
| 3 | `+x`, `-x`, `~x` | 단항 연산자 |
| 4 | `*`, `/`, `//`, `%` | 곱셈, 나눗셈 |
| 5 | `+`, `-` | 덧셈, 뺄셈 |
| 6 | `<<`, `>>` | 비트 시프트 |
| 7 | `&` | 비트 AND |
| 8 | `^` | 비트 XOR |
| 9 | `\|` | 비트 OR |
| 10 | `==`, `!=`, `<`, `<=`, `>`, `>=`, `is`, `is not`, `in`, `not in` | 비교 |
| 11 | `not` | 논리 NOT |
| 12 | `and` | 논리 AND |
| 13 | `or` | 논리 OR |
| 14 | `:=` | 대입 표현식 |

```python
# 우선순위 예제
print(2 + 3 * 4)      # 14 (곱셈 먼저)
print((2 + 3) * 4)    # 20 (괄호 먼저)

print(2 ** 3 ** 2)    # 512 (오른쪽부터: 2 ** 9)
print((2 ** 3) ** 2)  # 64

# 복잡한 표현식
x = 5
result = x > 3 and x < 10 or x == 0
# (x > 3) and (x < 10) or (x == 0)
# True and True or False
# True
```

---

## 특수 연산자

### 문자열 연산

```python
# 연결
"Hello" + " " + "World"  # "Hello World"

# 반복
"Ha" * 3                 # "HaHaHa"

# 포매팅
name = "Python"
f"Hello, {name}!"        # "Hello, Python!"
"Hello, %s!" % name      # "Hello, Python!"
```

### 리스트/튜플 연산

```python
# 연결
[1, 2] + [3, 4]          # [1, 2, 3, 4]

# 반복
[0] * 5                  # [0, 0, 0, 0, 0]

# 언패킹
a, b, *rest = [1, 2, 3, 4, 5]
# a=1, b=2, rest=[3, 4, 5]
```

---

## 실전 예제

### 조건부 표현식 (삼항 연산자)

```python
# 기본 형태
result = "양수" if x > 0 else "음수 또는 0"

# 중첩 (가독성 주의)
result = "양수" if x > 0 else ("음수" if x < 0 else "0")

# 리스트 컴프리헨션에서
numbers = [1, -2, 3, -4, 5]
signs = ["+" if n > 0 else "-" for n in numbers]
```

### 논리 연산자 활용

```python
# 기본값 설정
name = user_input or "Anonymous"
port = config.get('port') or 8080

# 조건부 실행
debug and print("디버그 모드")  # debug가 True일 때만 출력

# None 체크
value = data and data.get('value')
```

### 비교 연산 활용

```python
# 범위 체크
if 0 <= age <= 120:
    print("유효한 나이")

# 문자열 사전순 비교
if "apple" < "banana":
    print("apple이 먼저")

# 리스트 비교 (요소별)
if [1, 2, 3] < [1, 2, 4]:
    print("첫 번째 리스트가 작음")
```

---

## 참고 자료

- [Python 연산자 공식 문서](https://docs.python.org/3/reference/expressions.html#operator-precedence)
- [Python 비트 연산 가이드](https://wiki.python.org/moin/BitwiseOperators)
