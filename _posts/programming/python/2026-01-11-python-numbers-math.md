---
layout: post
title: "Python 숫자 타입과 수학 함수 완벽 가이드"
date: 2026-01-11
categories: [programming, python]
tags: [python, numbers, math, random]
description: "Python의 숫자 타입(int, float, complex)과 수학 함수, 난수 생성, 삼각함수까지 상세히 설명합니다."
image: /assets/images/posts/python-numbers-math.png
---

Python은 다양한 숫자 타입과 풍부한 수학 함수를 제공합니다. 이 글에서는 숫자 타입의 특징과 `math`, `random` 모듈의 활용법을 상세히 알아봅니다.

## 숫자 타입

### 정수 (int)

Python 3에서는 정수의 크기 제한이 없습니다.

```python
# 정수 리터럴
x = 10
y = -5
z = 0

# 매우 큰 정수도 처리 가능
big_num = 12345678901234567890123456789

# 다양한 진법 표현
binary = 0b1010      # 2진수: 10
octal = 0o12         # 8진수: 10
hexadecimal = 0xFF   # 16진수: 255

# 가독성을 위한 언더스코어
million = 1_000_000
```

### 부동소수점 (float)

```python
# 부동소수점 리터럴
f = 3.14
g = -0.5
h = 2.0

# 지수 표기법
scientific = 1.5e10   # 1.5 * 10^10
small = 2.5e-4        # 0.00025

# 특수 값
import math
inf = float('inf')    # 무한대
neg_inf = float('-inf')
nan = float('nan')    # Not a Number

# 확인
math.isinf(inf)       # True
math.isnan(nan)       # True
```

### 복소수 (complex)

```python
# 복소수 리터럴 (j 사용)
c1 = 3 + 4j
c2 = 2 - 1j

# 복소수 생성
c3 = complex(3, 4)    # 3 + 4j

# 실수부와 허수부
print(c1.real)        # 3.0
print(c1.imag)        # 4.0

# 켤레 복소수
print(c1.conjugate()) # 3 - 4j

# 연산
print(c1 + c2)        # (5+3j)
print(c1 * c2)        # (10+5j)
print(abs(c1))        # 5.0 (크기)
```

---

## 기본 수학 연산

### 산술 연산자

```python
a, b = 10, 3

print(a + b)    # 덧셈: 13
print(a - b)    # 뺄셈: 7
print(a * b)    # 곱셈: 30
print(a / b)    # 나눗셈: 3.333...
print(a // b)   # 정수 나눗셈: 3
print(a % b)    # 나머지: 1
print(a ** b)   # 거듭제곱: 1000

# 음수 나눗셈 주의
print(-11 // 3)   # -4 (내림)
print(-11 % 3)    # 1
```

### 내장 함수

```python
# 절대값
abs(-5)           # 5
abs(-3.14)        # 3.14
abs(3 + 4j)       # 5.0 (복소수 크기)

# 거듭제곱
pow(2, 3)         # 8
pow(2, 3, 5)      # 3 (2**3 % 5)

# 반올림
round(3.14159)    # 3
round(3.14159, 2) # 3.14
round(2.5)        # 2 (은행가 반올림)
round(3.5)        # 4

# divmod (몫과 나머지)
divmod(10, 3)     # (3, 1)

# 최대/최소
max(1, 5, 3)      # 5
min(1, 5, 3)      # 1
max([1, 2, 3])    # 3 (리스트)

# 합계
sum([1, 2, 3, 4]) # 10
sum([1, 2, 3], 10) # 16 (초기값 10)
```

---

## math 모듈

```python
import math
```

### 기본 수학 함수

```python
import math

# 올림, 내림
math.ceil(3.2)      # 4
math.floor(3.8)     # 3
math.trunc(3.8)     # 3 (0 방향으로 절삭)
math.trunc(-3.8)    # -3

# 절대값
math.fabs(-3.14)    # 3.14 (항상 float 반환)

# 제곱근
math.sqrt(16)       # 4.0
math.isqrt(17)      # 4 (정수 제곱근)

# 거듭제곱
math.pow(2, 3)      # 8.0

# 팩토리얼
math.factorial(5)   # 120

# 최대공약수, 최소공배수
math.gcd(12, 18)    # 6
math.lcm(12, 18)    # 36 (Python 3.9+)

# 부호 복사
math.copysign(5, -1)  # -5.0
```

### 로그 함수

```python
import math

# 자연로그 (밑 e)
math.log(math.e)      # 1.0
math.log(10)          # 2.302...

# 밑이 있는 로그
math.log(100, 10)     # 2.0
math.log(8, 2)        # 3.0

# 편의 함수
math.log10(100)       # 2.0 (상용로그)
math.log2(8)          # 3.0

# log(1+x) - 작은 x에 대해 정확
math.log1p(0.0001)    # 0.00009999...

# 지수 함수
math.exp(1)           # 2.718... (e^1)
math.exp(2)           # 7.389... (e^2)
math.expm1(0.0001)    # exp(x) - 1, 작은 x에 정확
```

### 삼각함수

```python
import math

# 기본 삼각함수 (라디안)
math.sin(math.pi / 2)   # 1.0
math.cos(0)             # 1.0
math.tan(math.pi / 4)   # 1.0 (근사값)

# 역삼각함수
math.asin(1)            # 1.5707... (pi/2)
math.acos(0)            # 1.5707... (pi/2)
math.atan(1)            # 0.7853... (pi/4)

# atan2 - 4사분면 고려
math.atan2(1, 1)        # 0.7853... (pi/4)
math.atan2(-1, -1)      # -2.356... (-3pi/4)

# 쌍곡선 함수
math.sinh(1)
math.cosh(1)
math.tanh(1)

# 빗변 계산
math.hypot(3, 4)        # 5.0
math.hypot(3, 4, 5)     # 7.07... (Python 3.8+)
```

### 각도 변환

```python
import math

# 라디안 -> 도
math.degrees(math.pi)      # 180.0
math.degrees(math.pi / 2)  # 90.0

# 도 -> 라디안
math.radians(180)          # 3.14159...
math.radians(90)           # 1.5707...
```

### 수학 상수

```python
import math

math.pi      # 3.141592653589793
math.e       # 2.718281828459045
math.tau     # 6.283185307179586 (2 * pi)
math.inf     # 무한대
math.nan     # Not a Number
```

### 특수 함수

```python
import math

# 감마 함수
math.gamma(5)           # 24.0 (4!)
math.lgamma(5)          # log(gamma(5))

# 오차 함수
math.erf(1)             # 0.842...
math.erfc(1)            # 0.157... (1 - erf(x))

# 정수/유한 확인
math.isfinite(100)      # True
math.isfinite(float('inf'))  # False
math.isinf(float('inf'))     # True
math.isnan(float('nan'))     # True

# 가까운 값 확인
math.isclose(0.1 + 0.2, 0.3)  # True
```

---

## random 모듈

```python
import random
```

### 난수 생성

```python
import random

# 0 이상 1 미만 실수
random.random()           # 예: 0.7234...

# 범위 내 실수
random.uniform(1.5, 5.5)  # 예: 3.245...

# 범위 내 정수 (양 끝 포함)
random.randint(1, 10)     # 예: 7

# 범위 내 정수 (끝 미포함)
random.randrange(0, 10)   # 0-9
random.randrange(0, 10, 2) # 0, 2, 4, 6, 8 중 하나
```

### 시퀀스에서 선택

```python
import random

items = ['a', 'b', 'c', 'd', 'e']

# 하나 선택
random.choice(items)      # 예: 'c'

# 여러 개 선택 (중복 없음)
random.sample(items, 3)   # 예: ['b', 'e', 'a']

# 여러 개 선택 (중복 허용, Python 3.6+)
random.choices(items, k=3)  # 예: ['a', 'a', 'c']

# 가중치 적용
weights = [1, 2, 3, 4, 5]  # 뒤로 갈수록 확률 높음
random.choices(items, weights=weights, k=3)
```

### 셔플

```python
import random

deck = list(range(1, 53))

# 리스트 섞기 (원본 수정)
random.shuffle(deck)
print(deck)

# 원본 유지하며 섞기
shuffled = random.sample(deck, len(deck))
```

### 시드 설정

```python
import random

# 재현 가능한 난수
random.seed(42)
print(random.random())    # 항상 같은 값

# 시스템 시간 기반 (기본값)
random.seed()
```

### 분포 함수

```python
import random

# 정규 분포 (가우시안)
random.gauss(0, 1)        # 평균 0, 표준편차 1
random.normalvariate(0, 1)

# 균등 분포
random.uniform(0, 10)

# 삼각 분포
random.triangular(0, 10, 5)  # 최소, 최대, 최빈값

# 지수 분포
random.expovariate(1/5)   # 람다 = 1/5

# 베타 분포
random.betavariate(2, 5)
```

---

## 실전 예제

### 주사위 시뮬레이션

```python
import random

def roll_dice(num_dice=1, sides=6):
    """주사위 굴리기"""
    return [random.randint(1, sides) for _ in range(num_dice)]

# 주사위 2개 굴리기
result = roll_dice(2)
print(f"주사위: {result}, 합계: {sum(result)}")
```

### 간단한 통계 계산

```python
import math

def statistics(numbers):
    """기본 통계 계산"""
    n = len(numbers)
    mean = sum(numbers) / n

    # 분산
    variance = sum((x - mean) ** 2 for x in numbers) / n

    # 표준편차
    std_dev = math.sqrt(variance)

    return {
        'count': n,
        'sum': sum(numbers),
        'mean': mean,
        'min': min(numbers),
        'max': max(numbers),
        'variance': variance,
        'std_dev': std_dev
    }

data = [10, 20, 30, 40, 50]
stats = statistics(data)
for key, value in stats.items():
    print(f"{key}: {value}")
```

### 피보나치 수열

```python
def fibonacci(n):
    """n번째 피보나치 수 계산"""
    if n <= 1:
        return n
    a, b = 0, 1
    for _ in range(2, n + 1):
        a, b = b, a + b
    return b

# 처음 10개
for i in range(10):
    print(fibonacci(i), end=' ')
# 출력: 0 1 1 2 3 5 8 13 21 34
```

### 소수 판별

```python
import math

def is_prime(n):
    """소수 판별"""
    if n < 2:
        return False
    if n == 2:
        return True
    if n % 2 == 0:
        return False

    for i in range(3, int(math.sqrt(n)) + 1, 2):
        if n % i == 0:
            return False
    return True

# 1-100 사이의 소수
primes = [n for n in range(1, 101) if is_prime(n)]
print(primes)
```

### 비밀번호 생성기

```python
import random
import string

def generate_password(length=12):
    """안전한 비밀번호 생성"""
    characters = string.ascii_letters + string.digits + string.punctuation
    password = ''.join(random.choices(characters, k=length))
    return password

print(generate_password())
# 예: Kj#9mP&x2Lq!
```

---

## 타입 변환

```python
# 정수로 변환
int(3.14)         # 3
int("42")         # 42
int("1010", 2)    # 10 (2진수)
int("ff", 16)     # 255 (16진수)

# 실수로 변환
float(3)          # 3.0
float("3.14")     # 3.14

# 복소수로 변환
complex(3)        # (3+0j)
complex(3, 4)     # (3+4j)
complex("3+4j")   # (3+4j)

# 진법 변환
bin(10)           # '0b1010'
oct(10)           # '0o12'
hex(255)          # '0xff'
```

---

## 참고 자료

- [Python math 모듈 공식 문서](https://docs.python.org/3/library/math.html)
- [Python random 모듈 공식 문서](https://docs.python.org/3/library/random.html)
- [Python numbers 모듈 공식 문서](https://docs.python.org/3/library/numbers.html)
