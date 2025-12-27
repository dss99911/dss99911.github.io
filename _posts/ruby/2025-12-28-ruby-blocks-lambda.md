---
layout: post
title: "Ruby 블록과 Lambda"
date: 2025-12-28
categories: ruby
tags: [ruby, blocks, lambda, closures]
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
