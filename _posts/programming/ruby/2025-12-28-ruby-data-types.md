---
layout: post
title: "Ruby 데이터 타입 - 문자열, 배열, 맵"
date: 2025-12-28
categories: [programming, ruby]
tags: [ruby, string, array, hash, data-types]
---

Ruby의 주요 데이터 타입인 문자열, 배열, 맵(Hash)에 대해 알아봅니다.

## 문자열 (String)

### 표현

```ruby
"a"
'a'
'a' + 'b'
'a\'b'
'a' * 3  # "aaa"
```

### 변환 메서드

```ruby
'2'.to_i   # 문자열을 정수로
'2'.to_f   # 문자열을 실수로
2.to_s     # 숫자를 문자열로
```

### 기타 메서드

```ruby
'a'.length
.inspect   # 객체의 구조를 문자열로 변환
```

### 문자열 보간 (String Interpolation)

```ruby
a = 1
"#{a}"  # "1"
```

---

## 배열 (Array)

### 배열 선언

```ruby
[1, 2]
[a, b]  # 변수를 아이템으로 하는 배열

# 문자열 배열
names1 = ['ann', 'richard', 'william', 'susan', 'pat']
puts names1[0]  # ann
puts names1[3]  # susan

# %w 문법으로 문자열 배열 생성
names2 = %w{ ann richard william susan pat }
puts names2[0]  # ann
puts names2[3]  # susan
```

### 배열 메서드

```ruby
puts newarr.sort
puts newarr.length
puts newarr.first
puts newarr.last
```

### Range

```ruby
digits = -1..9
puts digits.include?(5)          # true
puts digits.min                  # -1
puts digits.max                  # 9
puts digits.reject {|i| i < 5 }  # [5, 6, 7, 8, 9]

# Range에 포함 여부 확인
(1..10) === 5       # true
(1..10) === 15      # false
(1..10) === 3.14159 # true
('a'..'j') === 'c'  # true
('a'..'j') === 'z'  # false

# Range를 배열로 변환
(1..10).to_a  # [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
```

### Grep

```ruby
String.methods.grep /^wr/  # []
```

---

## 맵 (Hash)

```ruby
h = {'dog' => 'canine', 'cat' => 'feline', 'donkey' => 'asinine', 12 => 'dodecine'}
puts h.length  # 4
puts h['dog']  # 'canine'
puts h
puts h[12]     # 'dodecine'
```

### 심볼을 키로 사용

```ruby
people = Hash.new
people[:nickname] = 'IndianGuru'
people[:language] = 'Marathi'
people[:lastname] = 'Talim'
puts people[:lastname]  # Talim
```
