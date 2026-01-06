---
layout: post
title: "프로그래밍 언어 비교 치트시트 - 문법 빠른 참조"
date: 2025-12-28 15:55:00 +0900
categories: [programming, common]
tags: [programming-languages, cheatsheet, syntax, comparison]
description: "다양한 프로그래밍 언어의 문법을 비교한 빠른 참조 가이드입니다."
image: /assets/images/posts/thumbnails/2025-12-28-programming-language-cheatsheet.png
---

# 프로그래밍 언어 비교 치트시트

Python, Kotlin, JavaScript의 문법을 비교한 빠른 참조 가이드입니다.

---

## 변수 (Variable)

### 선언 및 할당

| Python | Kotlin | JavaScript |
|--------|--------|------------|
| `counter = 100` | `var i = 0` (mutable) | `let x = 10` |
| `name = "John"` | `val a: Int = 1` (read-only) | `const y = 20` |
| `a, b, c = 1, 2, 3` | `val b = 2` (type inferred) | `var z = 30` |

### Python 변수 특징
```python
# 다중 할당
a = b = c = 1
a, b, c = 1, 2, "john"

# 변수 삭제
del var1

# 전역 변수 참조
global Money
```

### Kotlin 변수 특징
```kotlin
// Nullable과 Non-null
var a: String = "abc"  // non-null
var b: String? = "abc" // nullable

// Custom getter/setter
var aa: Int
    get() = TODO()
    set(value) {}
```

---

## 데이터 타입

| Python | Kotlin | JavaScript |
|--------|--------|------------|
| `int(x)` | `x.toInt()` | `parseInt(x)` |
| `float(x)` | `x.toDouble()` | `parseFloat(x)` |
| `str(x)` | `x.toString()` | `x.toString()` |
| `list(x)` | `x.toList()` | `Array.from(x)` |

---

## 문자열 (String)

### 기본 사용

| Python | Kotlin | JavaScript |
|--------|--------|------------|
| `str[0]` | `str[0]` | `str[0]` |
| `str[2:5]` | `str.substring(2, 5)` | `str.slice(2, 5)` |
| `str + "text"` | `"$str text"` | `` `${str} text` `` |
| `len(str)` | `str.length` | `str.length` |

### Python 문자열
```python
str = 'Hello World!'
print(str[0])       # H
print(str[2:5])     # llo
print(str[2:])      # llo World!
print(str * 2)      # 반복

# 포맷팅
"Name: %s, Age: %d" % ('Zara', 21)

# Raw String
r'\n'  # 이스케이프 무시

# Triple Quotes
"""여러 줄
문자열"""
```

### Kotlin 문자열
```kotlin
// String Template
"Hello, $name!"
"Hello, ${args[0]}!"

// Raw String
val text = """
    for (c in "foo")
        print(c)
"""

// 메서드
str.contains("pattern".toRegex())
text.trimMargin()
```

### JavaScript 문자열
```javascript
// Template Literal
`log: ${completed}`

// 메서드
str.includes("text")  // contains
str.substr(0, 5)      // length 기준
str.slice(0, 5)       // index 기준
```

---

## 배열/리스트 (Array/List)

### 선언

| Python | Kotlin | JavaScript |
|--------|--------|------------|
| `list = [1, 2, 3]` | `val arr = arrayOf(1, 2, 3)` | `let arr = [1, 2, 3]` |
| `list = []` | `val list = listOf(1, 2, 3)` | `let arr = []` |

### 주요 연산

| 연산 | Python | Kotlin | JavaScript |
|------|--------|--------|------------|
| 추가 | `list.append(x)` | `list.add(x)` | `arr.push(x)` |
| 삭제 | `list.remove(x)` | `list.remove(x)` | `arr.splice(i, 1)` |
| 길이 | `len(list)` | `list.size` | `arr.length` |
| 포함 | `x in list` | `x in list` | `arr.includes(x)` |
| 정렬 | `list.sort()` | `list.sortedBy {}` | `arr.sort()` |

### Python 리스트
```python
list = ['abcd', 786, 2.23, 'john']
print(list[0])      # 'abcd'
print(list[1:3])    # [786, 2.23]
print(list[-2])     # 'john' (역방향)

# 리스트 컴프리헨션
list = [x*5 for x in range(2, 10, 2)]

# 삭제
del list[2]
```

### Kotlin 배열/리스트
```kotlin
val arr = arrayOf(1, 2, 3)
val list = listOf(1, 2, 3)

// Lambda 연산
fruits
    .filter { it.startsWith("a") }
    .sortedBy { it }
    .map { it.uppercase() }
    .forEach { println(it) }

// Null 필터링
val intList: List<Int> = nullableList.filterNotNull()

// 인덱스 순회
for (index in items.indices) {
    println("item at $index is ${items[index]}")
}
```

### JavaScript 배열
```javascript
// 추가/삭제
arr.push(item);      // 끝에 추가
arr.pop();           // 끝에서 제거
arr.unshift(item);   // 앞에 추가
arr.shift();         // 앞에서 제거
arr.splice(2, 0, "Lemon", "Kiwi");  // 중간 삽입

// 배열 확인
Array.isArray(arr);

// 정렬
arr.sort((a, b) => a - b);  // 숫자 정렬
arr.sort((a, b) => 0.5 - Math.random());  // 랜덤

// 최대/최소
Math.max.apply(null, arr);
Math.min.apply(null, arr);
```

---

## Map/Dictionary

### 선언 및 사용

| Python | Kotlin | JavaScript |
|--------|--------|------------|
| `dict = {}` | `val map = mapOf("a" to 1)` | `let map = new Map()` |
| `dict['key']` | `map["key"]` | `map.get(key)` |
| `dict['key'] = val` | `map["key"] = val` | `map.set(key, val)` |
| `dict.keys()` | `map.keys` | `map.keys()` |
| `dict.values()` | `map.values` | `map.values()` |

### Python Dictionary
```python
dict = {'name': 'john', 'code': 6734}
dict['key'] = value

# 순회
for key in dict:
    print(dict[key])

# 삭제
del dict['key']
dict.clear()
```

### Kotlin Map
```kotlin
val map = mapOf("a" to 1, "b" to 2)

// 순회
for ((k, v) in map) {
    println("$k -> $v")
}

// Destructuring
map.mapValues { (key, value) -> "$value!" }
```

### JavaScript Map
```javascript
let map = new Map();
map.set(1, "a");
map.get(1);

// 순회
let iter = map.entries();
for (let [key, value] of map) {
    console.log(key, value);
}
```

---

## 조건문 (If Statement)

### 기본 구문

| Python | Kotlin | JavaScript |
|--------|--------|------------|
| `if x:` | `if (x) {}` | `if (x) {}` |
| `elif:` | `else if` | `else if` |
| `else:` | `else` | `else` |

### Python
```python
if var1 == 100:
    print("100입니다")
elif var1 > 100:
    print("100보다 큽니다")
else:
    print("100보다 작습니다")
```

### Kotlin
```kotlin
// Expression으로 사용
val max = if (a > b) a else b

// When (Switch 대체)
when (language) {
    "EN" -> "Hello!"
    "FR" -> "Salut!"
    1, 2, 3 -> "One or 2 or 3"
    in 1..10 -> "1부터 10 사이"
    is Long -> "Long 타입"
    else -> "기타"
}

// 조건 없는 When
when {
    x.isOdd() -> print("홀수")
    x.isEven() -> print("짝수")
}
```

---

## 반복문 (Loop)

### For Loop

| Python | Kotlin | JavaScript |
|--------|--------|------------|
| `for x in list:` | `for (x in list)` | `for (x in obj)` |
| `for i in range(n):` | `for (i in 0..n)` | `for (let i=0; i<n; i++)` |

### Python
```python
# 리스트 순회
for fruit in fruits:
    print(fruit)

# 인덱스 순회
for i in range(len(fruits)):
    print(fruits[i])

# else (break 없이 완료시)
for num in range(10, 20):
    if num % 2 == 0:
        break
else:
    print("모두 홀수")
```

### Kotlin
```kotlin
// 기본 순회
for (name in args) println(name)

// 인덱스와 함께
for ((index, value) in array.withIndex()) {
    println("$index: $value")
}

// 범위
for (i in 1..4) print(i)        // 1234
for (i in 4 downTo 1) print(i)  // 4321
for (i in 1..4 step 2) print(i) // 13
for (i in 1 until 10) {}        // 1~9

// Label
loop@ for (i in 1..100) {
    for (j in 1..100) {
        if (...) break@loop
    }
}

// forEach
ints.forEach {
    if (it == 0) return@forEach
    print(it)
}
```

### JavaScript
```javascript
// for...in (객체 키/배열 인덱스)
for (let x in obj) {
    console.log(obj[x]);
}

// forEach
numbers.forEach(function(item, index) {
    console.log(index, item);
});
```

### While Loop

| Python | Kotlin | JavaScript |
|--------|--------|------------|
| `while x:` | `while (x) {}` | `while (x) {}` |

---

## 함수 (Function)

### 선언

| Python | Kotlin | JavaScript |
|--------|--------|------------|
| `def func(a, b):` | `fun func(a: Int, b: Int): Int` | `function func(a, b)` |

### Python
```python
def printme(str):
    "문서 문자열"
    print(str)
    return

# 키워드 인자
printme(str="My string")

# 기본값
def printinfo(name, age=35):
    pass

# 가변 인자
def printinfo(arg1, *vartuple):
    for var in vartuple:
        print(var)

# Lambda
sum = lambda a, b: a + b
```

### Kotlin
```kotlin
// 기본
fun sum(a: Int, b: Int): Int {
    return a + b
}

// 단일 표현식
fun double(x: Int) = x * 2

// 기본값
fun read(b: Array<Byte>, off: Int = 0) {}

// 가변 인자
fun foo(vararg strings: String) {}

// Named Arguments
reformat(str, wordSeparator = '_')

// Infix
infix fun Int.shl(x: Int): Int { }
1 shl 2  // 사용

// Inline
inline fun <T> lock(body: () -> T): T { }
```

### JavaScript
```javascript
// 선언
function myFunction(a, b) {
    return a * b;
}

// 익명 함수
var x = function(a, b) { return a * b };

// 화살표 함수
const add = (a, b) => a + b;

// 자기 호출
(function() {
    var x = "Hello!";
})();

// arguments 객체
function findMax() {
    for (let i = 0; i < arguments.length; i++) {
        // arguments[i]
    }
}
```

---

## 예외 처리 (Exception)

### 기본 구문

| Python | Kotlin | JavaScript |
|--------|--------|------------|
| `try:` | `try {}` | `try {}` |
| `except:` | `catch (e: Exception) {}` | `catch (err) {}` |
| `finally:` | `finally {}` | `finally {}` |

### Python
```python
try:
    fh = open("testfile", "w")
except IOError:
    print("파일을 열 수 없습니다")
except (Exception1, Exception2):
    print("여러 예외 처리")
else:
    print("예외 없음")
finally:
    fh.close()

# 예외 발생
raise ValueError("Invalid value")
```

### Kotlin
```kotlin
// Expression으로 사용
val result = try {
    count()
} catch (e: ArithmeticException) {
    throw IllegalStateException(e)
}

val a: Int? = try {
    parseInt(input)
} catch (e: NumberFormatException) {
    null
}
```

### JavaScript
```javascript
try {
    // 코드
} catch(err) {
    console.log(err.name);
    console.log(err.message);
}

throw "Too big";
throw 500;
```

---

## 연산자 (Operator)

### 비교 연산자

| 연산 | Python | Kotlin | JavaScript |
|------|--------|--------|------------|
| 같음 | `==` | `==` (.equals) | `==` (타입변환) |
| 동일 | `is` | `===` | `===` (엄격) |
| 포함 | `in` | `in` | `includes()` |

### Python 특수 연산자
```python
# 거듭제곱
a ** b  # a의 b승

# 정수 나눗셈
9 // 2  # 4

# 멤버십
if a in list:
    print("포함됨")

# 동일성
x is y      # 같은 객체
x is not y  # 다른 객체
```

### Kotlin 비트 연산자
```kotlin
val x = (1 shl 2) and 0x000FF000
// shl, shr, ushr, and, or, xor, inv()
```

### JavaScript
```javascript
// 타입 포함 비교
"1" == 1   // true
"1" === 1  // false

// OR 연산자 (기본값)
3000 || 5000  // 3000
0 || 5000     // 5000
```

---

## Range

### Kotlin
```kotlin
// 범위
if (x in 1..y-1) println("OK")

// 역방향
for (i in 4 downTo 1) print(i)  // 4321

// 스텝
for (i in 1..4 step 2) print(i)  // 13

// 마지막 제외
for (i in 1 until 10) {}  // 1~9
```

### Python
```python
# range(start, stop, step)
for i in range(0, 10, 2):
    print(i)  # 0, 2, 4, 6, 8
```

---

## 클래스 (Class)

### 선언

| Python | Kotlin | JavaScript |
|--------|--------|------------|
| `class MyClass:` | `class MyClass {}` | `class MyClass {}` |

### Python
```python
class Employee:
    empCount = 0  # 클래스 변수

    def __init__(self, name, salary):
        self.name = name
        self.salary = salary
        Employee.empCount += 1

    def displayEmployee(self):
        print("Name:", self.name)

    def __del__(self):
        print("객체 삭제됨")

# 상속
class Child(Parent):
    def __init__(self):
        print("자식 생성자")
```

### Kotlin
```kotlin
// 기본 클래스
class Greeter(val name: String, var age: Int) {
    fun greet() = println("Hello, $name")
}

// 상속 (open 필요)
open class A {
    open fun f() {}
}

class B : A() {
    override fun f() {}
}

// Abstract
abstract class Shape(val sides: List<Double>) {
    abstract fun calculateArea(): Double
}

// 생성자
class Person(val name: String) {
    constructor(name: String, parent: Person) : this(name) {
        parent.children.add(this)
    }

    init {
        println("초기화: $name")
    }
}

// Inner class
class Outer {
    inner class Inner {
        fun foo() = bar
    }
}
```

---

## 유용한 팁

### Python
- `pass`: 빈 블록 placeholder
- `globals()`, `locals()`: 변수 목록 확인
- List Comprehension: `[x*2 for x in range(10)]`

### Kotlin
- Null Safety: `?.`, `?:`, `!!`
- Extension Functions: 기존 클래스에 함수 추가
- Data Class: `data class User(val name: String)`
- Coroutines: 비동기 프로그래밍

### JavaScript
- Hoisting: 함수 선언 전 호출 가능
- `this`: 컨텍스트에 따라 다름
- `call()`, `apply()`: 다른 객체의 메서드 호출

---

이 치트시트는 기본적인 문법 비교를 위한 것입니다. 각 언어의 상세한 기능은 공식 문서를 참조하세요.
