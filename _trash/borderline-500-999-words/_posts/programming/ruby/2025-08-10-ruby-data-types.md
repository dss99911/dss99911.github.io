---
layout: post
title: "Ruby 데이터 타입 - 문자열, 배열, 맵"
date: 2025-12-28
categories: [programming, ruby]
tags: [ruby, string, array, hash, data-types]
image: /assets/images/posts/thumbnails/2025-12-28-ruby-data-types.png
redirect_from:
  - "/programming/ruby/2025/12/28/ruby-data-types.html"
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

---

## 심볼 (Symbol)

심볼은 Ruby에서 자주 사용되는 불변 식별자입니다. 문자열과 비슷하지만 메모리 효율이 더 높습니다. 동일한 심볼은 항상 같은 객체를 참조하기 때문에 Hash의 키로 많이 사용됩니다.

```ruby
# 심볼 생성
:name
:age
:"complex symbol"

# 문자열과 심볼 변환
"hello".to_sym    # :hello
:hello.to_s       # "hello"

# 같은 심볼은 항상 같은 object_id를 가짐
puts :name.object_id   # 항상 동일
puts :name.object_id   # 위와 동일
puts "name".object_id  # 매번 다름
puts "name".object_id  # 위와 다름
```

---

## 숫자 (Numeric)

Ruby의 숫자 타입은 `Integer`와 `Float`이 있으며, 자동으로 큰 정수도 처리합니다.

```ruby
# 정수
42
-17
1_000_000   # 가독성을 위한 언더스코어 (1000000과 동일)

# 실수
3.14
2.0e3       # 2000.0

# 유용한 메서드
42.even?    # true
42.odd?     # false
-5.abs      # 5
3.14.round  # 3
3.14.ceil   # 4
3.14.floor  # 3
```

---

## 배열 고급 메서드

Ruby 배열은 매우 풍부한 메서드를 제공합니다.

### 요소 추가/제거

```ruby
arr = [1, 2, 3]

arr.push(4)       # [1, 2, 3, 4]  (끝에 추가)
arr << 5           # [1, 2, 3, 4, 5]  (push와 동일)
arr.unshift(0)     # [0, 1, 2, 3, 4, 5]  (앞에 추가)
arr.pop            # 5  (끝에서 제거하고 반환)
arr.shift          # 0  (앞에서 제거하고 반환)
arr.delete(3)      # 3  (값으로 제거)
arr.delete_at(0)   # 1  (인덱스로 제거)
```

### 함수형 메서드

```ruby
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# map: 각 요소를 변환
numbers.map { |n| n * 2 }
# [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

# select: 조건에 맞는 요소만 필터링
numbers.select { |n| n.even? }
# [2, 4, 6, 8, 10]

# reject: 조건에 맞는 요소를 제외
numbers.reject { |n| n.even? }
# [1, 3, 5, 7, 9]

# reduce: 누적 계산
numbers.reduce(0) { |sum, n| sum + n }
# 55

# flat_map: map + flatten
[[1, 2], [3, 4]].flat_map { |arr| arr }
# [1, 2, 3, 4]

# zip: 여러 배열을 조합
['a', 'b', 'c'].zip([1, 2, 3])
# [["a", 1], ["b", 2], ["c", 3]]
```

---

## Hash 고급 활용

```ruby
# 기본값 설정
counter = Hash.new(0)
counter[:apple] += 1
counter[:banana] += 3
puts counter[:apple]    # 1
puts counter[:cherry]   # 0 (기본값)

# merge: 두 Hash 병합
defaults = { color: 'red', size: 'medium' }
custom = { size: 'large', weight: 'heavy' }
result = defaults.merge(custom)
# { color: 'red', size: 'large', weight: 'heavy' }

# select/reject
h = { a: 1, b: 2, c: 3, d: 4 }
h.select { |k, v| v > 2 }   # { c: 3, d: 4 }
h.reject { |k, v| v > 2 }   # { a: 1, b: 2 }

# transform_values (Ruby 2.4+)
h.transform_values { |v| v * 10 }
# { a: 10, b: 20, c: 30, d: 40 }
```
