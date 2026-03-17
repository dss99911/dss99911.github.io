---
layout: post
title: "Ruby 블록과 Lambda"
date: 2025-12-28
categories: [programming, ruby]
tags: [ruby, blocks, lambda, closures]
image: /assets/images/posts/thumbnails/2025-12-28-ruby-blocks-lambda.png
redirect_from:
  - "/programming/ruby/2025/12/28/ruby-blocks-lambda.html"
---

Ruby의 블록(Block)과 Lambda에 대해 알아봅니다.

## 블록 (Blocks)

블록은 메서드 호출과 함께 코드 블록을 전달하는 방법입니다.

### 기본 사용법

```ruby
def call_block
  puts 'Start of method'
  yield
  yield
  puts 'End of method'
end

call_block { puts 'In the block' }
```

### 파라미터가 있는 블록

```ruby
def call_block
  yield('hello', 99)
end

call_block { |str, num| puts str + ' ' + num.to_s }
```

### 블록 존재 여부 확인

```ruby
def try
  if block_given?
    yield
  else
    puts "no block"
  end
end

try                        # "no block"
try { puts "hello" }       # "hello"
try do puts "hello" end    # "hello"
```

### 블록을 통한 반복

```ruby
x = 10
5.times do |x|
  puts "x inside the block: #{x}"
end
puts "x outside the block: #{x}"
```

---

## Lambda

Lambda는 익명 함수를 만드는 방법입니다.

### 기본 사용법

```ruby
prc = lambda { puts 'Hello' }
prc.call

# 여러 줄 Lambda
toast = lambda do
  'Cheers'
end
puts toast.call
```

### Lambda를 메서드 파라미터로 전달

```ruby
def some_mtd(some_proc)
  puts 'Start of mtd'
  some_proc.call
  puts 'End of mtd'
end

say = lambda do
  puts 'Hello'
end

some_mtd(say)
```

### 파라미터가 있는 Lambda

```ruby
a_Block = lambda { |x| "Hello #{x}!" }
puts a_Block.call('World')  # "Hello World!"
```

---

## Proc

Proc은 블록을 객체로 저장한 것입니다. Lambda와 비슷하지만 몇 가지 중요한 차이점이 있습니다.

### Proc 생성

```ruby
my_proc = Proc.new { |x| puts "Hello, #{x}!" }
my_proc.call('World')  # "Hello, World!"

# 또 다른 생성 방법
my_proc = proc { |x| puts "Hello, #{x}!" }
```

### Lambda와 Proc의 차이점

두 가지 핵심 차이점을 이해하는 것이 중요합니다.

**1. 인자 검사:**

```ruby
# Lambda는 인자 개수를 엄격하게 검사
my_lambda = lambda { |x, y| x + y }
my_lambda.call(1, 2)     # 3
# my_lambda.call(1)       # ArgumentError 발생

# Proc은 인자 개수가 달라도 에러가 나지 않음
my_proc = Proc.new { |x, y| "#{x}, #{y}" }
my_proc.call(1)           # "1, "  (y는 nil)
my_proc.call(1, 2, 3)     # "1, 2" (3은 무시)
```

**2. return 동작:**

```ruby
# Lambda의 return은 Lambda 자체에서 복귀
def test_lambda
  my_lambda = lambda { return 10 }
  result = my_lambda.call
  puts "Lambda returned: #{result}"  # 실행됨
  return 20
end

# Proc의 return은 감싸고 있는 메서드에서 복귀
def test_proc
  my_proc = Proc.new { return 10 }
  my_proc.call
  puts "이 줄은 실행되지 않습니다"  # 실행되지 않음
  return 20
end

test_lambda  # "Lambda returned: 10", 반환값 20
test_proc    # 반환값 10
```

---

## 화살표 Lambda (Stabby Lambda)

Ruby 1.9부터 더 간결한 Lambda 문법을 제공합니다.

```ruby
# 기존 Lambda
multiply = lambda { |x, y| x * y }

# 화살표 Lambda (Stabby Lambda)
multiply = ->(x, y) { x * y }
puts multiply.call(3, 4)  # 12

# .call 대신 다른 호출 방법
multiply.(3, 4)    # 12
multiply[3, 4]     # 12
```

---

## 메서드를 Proc으로 변환

기존 메서드를 `method` 메서드로 Proc 객체로 변환할 수 있습니다.

```ruby
def double(x)
  x * 2
end

# 메서드를 Proc으로 변환
double_proc = method(:double)

[1, 2, 3, 4].map(&double_proc)  # [2, 4, 6, 8]

# 심볼을 Proc으로 변환하는 & 연산자
['hello', 'world'].map(&:upcase)   # ["HELLO", "WORLD"]
[1, 2, 3, 4].select(&:even?)       # [2, 4]
```

`&:method_name` 패턴은 Ruby에서 매우 자주 사용되는 관용구입니다. `Symbol#to_proc`을 호출하여 각 요소에 해당 메서드를 적용하는 Proc을 자동으로 생성합니다.

---

## 실무에서의 블록 활용

블록은 Ruby의 많은 디자인 패턴에서 핵심적으로 사용됩니다.

### 리소스 관리 패턴

```ruby
# 파일을 열고 블록이 끝나면 자동으로 닫기
File.open('data.txt', 'r') do |file|
  file.each_line { |line| puts line }
end
# 여기서는 file이 이미 닫힌 상태

# 데이터베이스 트랜잭션
ActiveRecord::Base.transaction do
  user.save!
  order.save!
  # 예외 발생 시 자동 롤백
end
```

### 설정 패턴 (Configuration Block)

```ruby
class Server
  attr_accessor :host, :port

  def initialize
    yield(self) if block_given?
  end
end

server = Server.new do |s|
  s.host = 'localhost'
  s.port = 8080
end
```

이 패턴은 Rails의 configuration이나 RSpec의 테스트 정의 등 Ruby 생태계 전반에서 광범위하게 사용됩니다.
