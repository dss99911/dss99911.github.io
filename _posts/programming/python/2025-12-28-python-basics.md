---
layout: post
title: "Python 기초 문법 완벽 가이드"
date: 2025-12-28 12:08:00 +0900
categories: [programming, python]
tags: [python, programming, basics, tutorial]
description: "Python의 변수, 자료형, 조건문, 반복문, 함수 등 기초 문법을 상세히 설명합니다."
---

## Python 기본 정보

Python은 들여쓰기로 코드 블록을 구분하는 인터프리터 언어입니다.

### 인코딩 선언

```python
# -*- coding: utf-8 -*-
```

파일 상단에 위 주석을 추가하면 한글 등 유니코드 문자를 사용할 수 있습니다.

---

## 변수와 자료형

### 변수 선언

```python
# 기본 할당
x = 10
name = "Python"
is_valid = True

# 다중 할당
a, b, c = 1, 2, 3

# 동일 값 할당
x = y = z = 0
```

### 기본 자료형

| 타입 | 예시 | 설명 |
|------|------|------|
| int | 10, -5 | 정수 |
| long | 51924361L | 긴 정수 (Python 2) |
| float | 3.14, -0.5 | 부동소수점 |
| complex | 3.14j | 복소수 |
| str | "hello" | 문자열 |
| bool | True, False | 불리언 |

---

## 문자열 (String)

### 기본 사용

```python
s = 'Hello'
s = "Hello"
s = '''여러 줄
문자열'''
s = """여러 줄
문자열"""
```

### 문자열 연산

```python
s = "Hello" + " World"    # 연결
s = "Hi" * 3              # 반복: "HiHiHi"
len(s)                    # 길이
```

### 포매팅

```python
# % 연산자
"Name: %s, Age: %d" % ("John", 25)

# format 메서드
"Name: {}, Age: {}".format("John", 25)
"Name: {name}, Age: {age}".format(name="John", age=25)

# f-string (Python 3.6+)
name = "John"
age = 25
f"Name: {name}, Age: {age}"
```

### 주요 메서드

```python
s.upper()           # 대문자 변환
s.lower()           # 소문자 변환
s.strip()           # 양쪽 공백 제거
s.split(',')        # 분할하여 리스트로
s.replace('a', 'b') # 치환
s.find('x')         # 위치 찾기 (없으면 -1)
s.startswith('He')  # 시작 문자 확인
s.endswith('lo')    # 끝 문자 확인
```

---

## 리스트 (List)

### 생성과 접근

```python
# 생성
lst = [1, 2, 3, 4, 5]
lst = ['a', 'b', 'c']
lst = [1, 'hello', 3.14, True]  # 혼합 가능

# 접근
lst[0]      # 첫 번째 요소
lst[-1]     # 마지막 요소
lst[1:3]    # 슬라이싱 [2, 3]
lst[::2]    # 2칸씩 건너뛰기
```

### 주요 연산

```python
# 추가
lst.append(6)           # 끝에 추가
lst.insert(0, 'start')  # 특정 위치에 추가
lst.extend([7, 8, 9])   # 리스트 확장

# 삭제
del lst[0]              # 인덱스로 삭제
lst.remove('a')         # 값으로 삭제
lst.pop()               # 마지막 요소 꺼내기
lst.pop(0)              # 특정 인덱스 꺼내기

# 기타
len(lst)                # 길이
lst.sort()              # 정렬
lst.reverse()           # 역순
lst.index('a')          # 인덱스 찾기
'a' in lst              # 포함 여부
```

### 리스트 컴프리헨션

```python
# 기본
squares = [x**2 for x in range(10)]

# 조건 포함
evens = [x for x in range(10) if x % 2 == 0]

# 중첩
matrix = [[i*j for j in range(3)] for i in range(3)]
```

---

## 딕셔너리 (Dictionary)

### 생성과 접근

```python
# 생성
d = {'name': 'John', 'age': 25}
d = dict(name='John', age=25)

# 접근
d['name']           # 키로 접근
d.get('name')       # get 메서드 (없으면 None)
d.get('gender', 'N/A')  # 기본값 지정
```

### 주요 연산

```python
# 추가/수정
d['email'] = 'john@example.com'

# 삭제
del d['age']
d.pop('name')

# 순회
for key in d:
    print(key, d[key])

for key, value in d.items():
    print(key, value)

# 키/값 목록
d.keys()
d.values()
d.items()
```

---

## 튜플 (Tuple)

튜플은 변경 불가능(immutable)한 리스트입니다.

```python
# 생성
t = (1, 2, 3)
t = 1, 2, 3         # 괄호 생략 가능
t = (1,)            # 단일 요소 튜플

# 접근
t[0]
t[1:3]

# 언패킹
a, b, c = (1, 2, 3)
```

---

## 조건문

```python
# if-else
if x > 0:
    print("양수")
elif x < 0:
    print("음수")
else:
    print("영")

# 삼항 연산자
result = "양수" if x > 0 else "음수 또는 영"

# 한 줄 if
if x > 0: print("양수")
```

---

## 반복문

### for 문

```python
# 리스트 순회
for item in [1, 2, 3]:
    print(item)

# range 사용
for i in range(5):          # 0, 1, 2, 3, 4
    print(i)

for i in range(1, 10, 2):   # 1, 3, 5, 7, 9
    print(i)

# enumerate
for i, item in enumerate(['a', 'b', 'c']):
    print(i, item)
```

### while 문

```python
count = 0
while count < 5:
    print(count)
    count += 1
```

### 제어문

```python
for i in range(10):
    if i == 3:
        continue    # 다음 반복으로
    if i == 7:
        break       # 반복 종료
    print(i)

# for-else
for i in range(10):
    if i == 5:
        break
else:
    print("break 없이 완료")  # break 없으면 실행
```

---

## 함수

### 기본 문법

```python
def greet(name):
    """함수 설명 (docstring)"""
    return f"Hello, {name}!"

# 호출
result = greet("Python")
```

### 매개변수

```python
# 기본값
def greet(name="World"):
    return f"Hello, {name}!"

# 키워드 인자
greet(name="Python")

# 가변 인자
def sum_all(*args):
    return sum(args)

sum_all(1, 2, 3, 4)  # 10

# 키워드 가변 인자
def print_info(**kwargs):
    for key, value in kwargs.items():
        print(f"{key}: {value}")

print_info(name="John", age=25)
```

### Lambda

```python
# 익명 함수
square = lambda x: x ** 2
add = lambda x, y: x + y

# 고차 함수와 함께
numbers = [1, 2, 3, 4, 5]
squares = list(map(lambda x: x**2, numbers))
evens = list(filter(lambda x: x % 2 == 0, numbers))
```

---

## 클래스

```python
class Dog:
    # 클래스 변수
    species = "Canis familiaris"

    # 생성자
    def __init__(self, name, age):
        self.name = name    # 인스턴스 변수
        self.age = age

    # 인스턴스 메서드
    def bark(self):
        return f"{self.name} says Woof!"

    # 특수 메서드
    def __str__(self):
        return f"{self.name}, {self.age} years old"

# 상속
class Labrador(Dog):
    def __init__(self, name, age, color):
        super().__init__(name, age)
        self.color = color

    def bark(self):
        return f"{self.name} says WOOF!"

# 사용
dog = Dog("Buddy", 3)
print(dog.bark())
```

---

## 예외 처리

```python
try:
    result = 10 / 0
except ZeroDivisionError:
    print("0으로 나눌 수 없습니다")
except Exception as e:
    print(f"오류 발생: {e}")
else:
    print("성공")
finally:
    print("항상 실행")

# 예외 발생
raise ValueError("잘못된 값입니다")

# 사용자 정의 예외
class CustomError(Exception):
    pass
```

---

## 파일 처리

```python
# 읽기
with open('file.txt', 'r', encoding='utf-8') as f:
    content = f.read()
    # 또는
    lines = f.readlines()

# 쓰기
with open('file.txt', 'w', encoding='utf-8') as f:
    f.write("Hello, World!")

# 추가
with open('file.txt', 'a', encoding='utf-8') as f:
    f.write("\nNew line")
```

---

## 모듈과 패키지

```python
# import
import os
import math as m
from datetime import datetime
from os.path import join, exists

# 모듈 함수 사용
os.getcwd()
m.sqrt(16)
datetime.now()
```

---

## 유용한 내장 함수

```python
len([1, 2, 3])          # 길이: 3
range(5)                # [0, 1, 2, 3, 4]
type(x)                 # 타입 확인
isinstance(x, int)      # 타입 검사
max(1, 2, 3)            # 최대값: 3
min(1, 2, 3)            # 최소값: 1
sum([1, 2, 3])          # 합계: 6
abs(-5)                 # 절대값: 5
round(3.14159, 2)       # 반올림: 3.14
sorted([3, 1, 2])       # 정렬: [1, 2, 3]
zip([1, 2], ['a', 'b']) # [(1, 'a'), (2, 'b')]
map(str, [1, 2, 3])     # ['1', '2', '3']
filter(lambda x: x > 0, [-1, 0, 1, 2])  # [1, 2]
```

---

## 참고 자료

- [Python 공식 튜토리얼](https://docs.python.org/3/tutorial/)
- [TutorialsPoint Python](https://www.tutorialspoint.com/python/index.htm)
