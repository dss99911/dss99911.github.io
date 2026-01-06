---
layout: post
title: "Ruby 기초 - 문법과 기본 개념"
date: 2025-12-28
categories: [programming, ruby]
tags: [ruby, basics, syntax]
image: /assets/images/posts/thumbnails/2025-12-28-ruby-basics.png
---

Ruby 프로그래밍 언어의 기본 문법과 개념을 알아봅니다.

## 참고 자료

- [Ruby Learning](http://rubylearning.com/satishtalim/first_ruby_program.html)

## 기본 정보

- 파일 형식: `파일명.rb`
- 실행 방법: `ruby 파일명.rb` (확장자가 rb가 아니어도 실행 가능)
- 인터프리터 언어

## 주석

```ruby
# 한 줄 주석

=begin
여러 줄 주석
=end
```

## 구분자 (Delimiters)

```ruby
# 줄바꿈
puts \
  'hello'

# 명령 구분 (라인이 바뀌면 생략 가능)
puts 'hello'; puts 'world'
```

## Bang (!) Methods

호출한 객체에 메서드 결과를 직접 세팅합니다.

```ruby
a = 'aaaA'
a.downcase!
puts a  # "aaaa"
```

## Symbol

심볼은 값은 없고 구별할 때 사용됩니다.

```ruby
:심볼명
```

## 변수 선언

```ruby
x = 10

# 기본값 설정
@variable ||= "default value"

# 병렬 할당 (parallel assignment)
x, y, z = [true, 'two', false]
```

## 메서드 선언

```ruby
# 파라미터 없는 경우
def hello
  'Hello'
end

# 파라미터 있는 경우
def hello1(name)
  'Hello ' + name
end
puts(hello1('satish'))

# 괄호 없이 파라미터 사용
def hello2 name2
  'Hello ' + name2
end
puts(hello2 'talim')

# 파라미터 기본값 설정
def mtd(arg1="Dibya", arg2=arg1 + "Shashank", arg3="Shashank")
  "#{arg1}, #{arg2}, #{arg3}."
end
puts mtd
puts mtd("ruby")

# 메서드 별칭 (alias)
def oldmtd
  "old method"
end
alias newmtd oldmtd
def oldmtd
  "old improved method"
end
puts oldmtd   # "old improved method"
puts newmtd   # "old method"

# 가변 파라미터
def foo(*my_string)
  my_string.inspect
end
puts foo('hello', 'world')
puts foo()
```

## 연산자

```ruby
# || 또는 or
@var = @var || "first"
@var ||= "second"  # var이 없거나 false이면 "second" 사용
```

## 입력

```ruby
# 명령줄 인자
f = ARGV[0]
puts f

# 사용자 입력
city = gets.chomp  # chomp는 개행문자 제거
puts "The city is " + city
```

## 출력

```ruby
puts 'Hello'  # put string (줄바꿈 포함)
p 'hello'     # 구조를 출력
print 'hi'    # 줄바꿈 없음
```

## 랜덤

```ruby
rand(max_value)
```
