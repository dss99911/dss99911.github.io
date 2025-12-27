---
layout: post
title: "Ruby 프로그래밍 기초 가이드"
date: 2025-12-28 12:09:00 +0900
categories: language
tags: [ruby, programming, basics, scripting]
description: "Ruby 언어의 기초 문법, 클래스, 블록, 예외 처리 등을 상세히 설명합니다."
---

## Ruby 기본 정보

Ruby는 객체지향 스크립트 언어입니다.

### 기본 특징

- 파일 확장자: `.rb`
- 실행: `ruby 파일명.rb`
- 인터프리터 언어
- 모든 것이 객체

### 코멘트

```ruby
# 한 줄 코멘트

=begin
여러 줄
코멘트
=end
```

### 줄바꿈과 구분자

```ruby
# 백슬래시로 줄 바꿈
puts \
  'hello'

# 세미콜론으로 명령 구분 (줄바꿈 시 생략 가능)
a = 1; b = 2
```

---

## 변수와 자료형

### 변수 선언

```ruby
x = 10
name = "Ruby"

# 병렬 할당
x, y, z = [true, 'two', false]

# nil 체크 후 기본값
@variable ||= "default value"
```

### 심볼 (Symbol)

```ruby
:my_symbol

# 해시의 키로 자주 사용
options = { :name => "Ruby", :version => 3 }
# 또는
options = { name: "Ruby", version: 3 }
```

### Bang 메서드 (!)

```ruby
a = 'aaaA'
a.downcase!  # 원본 객체 수정
puts a       # "aaaa"
```

---

## 문자열

### 기본 사용

```ruby
s = "Hello"
s = 'Hello'
s = 'a' + 'b'     # "ab"
s = 'a' * 3       # "aaa"
```

### 문자열 변환

```ruby
'2'.to_i    # 정수 변환: 2
'2'.to_f    # 실수 변환: 2.0
2.to_s      # 문자열 변환: "2"
'hello'.length  # 길이: 5
```

### 문자열 보간

```ruby
name = "World"
"Hello, #{name}!"   # "Hello, World!"
```

---

## 배열 (Array)

### 생성

```ruby
arr = [1, 2, 3, 4, 5]
arr = ['ann', 'richard', 'william']
arr = %w{ann richard william}  # 문자열 배열 간편 생성
```

### 주요 메서드

```ruby
arr.sort          # 정렬
arr.length        # 길이
arr.first         # 첫 번째 요소
arr.last          # 마지막 요소
arr.include?(5)   # 포함 여부

# Range
digits = -1..9
digits.include?(5)  # true
digits.min          # -1
digits.max          # 9

# Range를 배열로
(1..10).to_a        # [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# 필터링
digits.reject { |i| i < 5 }  # [5, 6, 7, 8, 9]
```

---

## 해시 (Hash)

```ruby
# 생성
h = {'dog' => 'canine', 'cat' => 'feline', 12 => 'dozen'}
h = { dog: 'canine', cat: 'feline' }  # 심볼 키

# 접근
h['dog']       # 'canine'
h[:dog]        # 심볼 키 접근

# 크기
h.length       # 2

# 빈 해시
people = Hash.new
people[:name] = 'John'
```

---

## 조건문

### if/elsif/else

```ruby
if name == 'Satish'
  puts 'Nice name!'
elsif name == 'Sunil'
  puts 'Another nice name!'
else
  puts 'Hello!'
end
```

### unless

```ruby
unless ARGV.length == 2
  puts "Usage: program.rb arg1 arg2"
  exit
end
```

### 후위 조건문

```ruby
puts "Enrollments will now Stop" if participants > 2500
```

### case/when

```ruby
year = 2000
leap = case
  when year % 400 == 0 then true
  when year % 100 == 0 then false
  else year % 4 == 0
end
```

---

## 반복문

### times

```ruby
5.times { puts "Hello!" }

5.times do |i|
  puts "Iteration #{i}"
end
```

### while

```ruby
count = 0
while count < 10
  puts count
  count += 1
end
```

### each

```ruby
['apple', 'banana', 'cherry'].each do |fruit|
  puts "I love #{fruit}!"
end

# 해시 순회
h.each do |key, value|
  puts "#{key}: #{value}"
end
```

### Range

```ruby
(1..10).each { |i| puts i }
```

---

## 함수 (메서드)

### 정의와 호출

```ruby
def hello
  'Hello'
end

def hello(name)
  'Hello ' + name
end

puts hello('Ruby')

# 괄호 생략 가능
def hello name
  'Hello ' + name
end

puts hello 'Ruby'
```

### 기본값

```ruby
def greet(name, greeting = "Hello")
  "#{greeting}, #{name}!"
end
```

### 가변 인자

```ruby
def sum(*numbers)
  numbers.sum
end

sum(1, 2, 3, 4)  # 10
```

### 별칭

```ruby
def original_method
  "original"
end

alias new_method original_method
```

---

## 블록과 Yield

### 블록 기본

```ruby
def call_block
  puts 'Start'
  yield
  yield
  puts 'End'
end

call_block { puts 'In the block' }
```

### 블록에 매개변수

```ruby
def call_block
  yield('hello', 99)
end

call_block { |str, num| puts "#{str} #{num}" }
```

### 블록 존재 확인

```ruby
def try
  if block_given?
    yield
  else
    puts "no block"
  end
end
```

---

## Lambda와 Proc

```ruby
# Lambda
greet = lambda { puts 'Hello' }
greet.call

# 또는
toast = lambda do
  'Cheers'
end
puts toast.call

# 매개변수 있는 Lambda
add = lambda { |x, y| x + y }
puts add.call(3, 4)  # 7
```

---

## 클래스

### 기본 클래스

```ruby
class Dog
  def initialize(breed, name)
    @breed = breed  # 인스턴스 변수
    @name = name
  end

  def bark
    puts 'Woof!'
  end

  def display
    puts "#{@breed}: #{@name}"
  end
end

dog = Dog.new('Labrador', 'Buddy')
dog.bark
dog.display
```

### 상속

```ruby
class Animal
  def breathe
    puts "inhale and exhale"
  end
end

class Cat < Animal
  def speak
    puts "Meow"
  end
end

cat = Cat.new
cat.breathe  # 상속된 메서드
cat.speak
```

### 접근 제어

```ruby
class Example
  def public_method
    # 기본적으로 public
  end

  protected
    def protected_method
    end

  private
    def private_method
    end
end
```

### 메서드 오버라이드

```ruby
class Bird
  def fly
    puts "I am flying."
  end
end

class Penguin < Bird
  def fly
    puts "Sorry, I can't fly."
  end
end
```

---

## 예외 처리

### try-catch 구조

```ruby
begin
  # 위험한 코드
  result = 10 / 0
rescue ZeroDivisionError => e
  puts "Error: #{e.message}"
rescue => e
  puts "Other error: #{e.message}"
else
  puts "No error occurred"
ensure
  puts "Always executed"
end
```

### 예외 발생

```ruby
def validate(value)
  raise "Invalid value" if value < 0
end
```

---

## 파일 처리

### 읽기

```ruby
File.open('file.txt', 'r') do |f|
  while line = f.gets
    puts line
  end
end

# 또는
content = File.read('file.txt')
```

### 쓰기

```ruby
File.open('file.txt', 'w') do |f|
  f.puts "Hello World"
end
```

### 인코딩 지정

```ruby
File.open('file.txt', 'r:UTF-8') do |f|
  # ...
end
```

### 디렉토리 순회

```ruby
require 'find'

Find.find('./') do |f|
  type = case
    when File.file?(f) then "F"
    when File.directory?(f) then "D"
    else "?"
  end
  puts "#{type}: #{f}"
end
```

---

## 정규표현식

```ruby
# 매칭
m = /Ruby/.match("The future is Ruby")
puts m.class  # MatchData

# 매칭 위치
"The future is Ruby" =~ /Ruby/  # 14

# 그룹 캡처
phone = /\((\d{3})\)\s+(\d{3})-(\d{4})/
m = phone.match("(123) 555-1234")
puts m[1]  # 123
puts m[2]  # 555
puts m[3]  # 1234
```

---

## 시스템 명령 실행

```ruby
# 백틱으로 실행
puts `ls`

# system 메서드 (성공 여부 반환)
result = system("pwd")  # true/false

# 환경 변수
ENV.each { |k, v| puts "#{k}: #{v}" }
```

---

## 모듈 로딩

```ruby
# 매번 로드
load 'filename.rb'

# 한 번만 로드 (.rb 생략 가능)
require 'filename'

# 상대 경로
require_relative 'lib/helper'
```
