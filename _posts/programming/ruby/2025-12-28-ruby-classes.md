---
layout: post
title: "Ruby 클래스와 객체지향 프로그래밍"
date: 2025-12-28
categories: [programming, ruby]
tags: [ruby, class, oop, inheritance]
---

Ruby의 클래스와 객체지향 프로그래밍에 대해 알아봅니다.

## 기본 클래스

```ruby
class Test
  puts :Test.object_id.to_s
  def test
    puts :test.object_id.to_s
    @test = 10
    puts :test.object_id.to_s
  end
end

t = Test.new
t.test
```

## 생성자와 인스턴스 변수

```ruby
class Dog
  def initialize(breed, name)
    # 인스턴스 변수
    @breed = breed
    @name = name
  end

  def bark
    puts 'Ruff! Ruff!'
  end

  def display
    puts "I am of #{@breed} breed and my name is #{@name}"
  end
end

d = Dog.new('Labrador', 'Benzy')

# 객체 ID 확인
puts "The id of d is #{d.object_id}."

# 메서드 존재 여부 확인
if d.respond_to?("talk")
  d.talk
else
  puts "Sorry, d doesn't understand the 'talk' message."
end

d.bark
d.display

# 객체 참조 복사
d1 = d
d1.display

# nil 참조
d = nil
# d1 = nil  # 이 시점에서 Dog 객체는 GC 대상
```

## method_missing

존재하지 않는 메서드 호출 시 처리합니다.

```ruby
class Dummy
  def method_missing(m, *args, &block)
    puts "There's no method called #{m} here -- please try again."
  end
end

Dummy.new.anything
# 출력: There's no method called anything here -- please try again.
```

## 클래스에 메서드 추가

### 기존 클래스에 메서드 추가

```ruby
require_relative 'p030motorcycle'
m = MotorCycle.new('Yamaha', 'red')
m.start_engine

class MotorCycle
  def disp_attr
    puts 'Color of MotorCycle is ' + @color
    puts 'Make of MotorCycle is ' + @make
  end
end

m.disp_attr
m.start_engine
puts self.class
puts self
```

### 기본 클래스에 메서드 추가

```ruby
class String
  def write_size
    self.size
  end
end

size_writer = "Tell me my size!"
puts size_writer.write_size
```

## 상속

```ruby
class Mammal
  def breathe
    puts "inhale and exhale"
  end
end

class Cat < Mammal
  def speak
    puts "Meow"
  end
end

rani = Cat.new
rani.breathe
rani.speak
```

### 메서드 오버라이드

```ruby
class Bird
  def preen
    puts "I am cleaning my feathers."
  end
  def fly
    puts "I am flying."
  end
end

class Penguin < Bird
  def fly
    puts "Sorry. I'd rather swim."
  end
end

p = Penguin.new
p.preen
p.fly
```

### super 키워드

```ruby
class Dog
  def initialize(breed)
    @breed = breed
  end
end

class Lab < Dog
  def initialize(breed, name)
    super(breed)
    @name = name
  end

  def to_s
    "(#@breed, #@name)"
  end
end

puts Lab.new("Labrador", "Benzy").to_s
```

### 추상 클래스

```ruby
class AbstractKlass
  def welcome
    puts "#{hello} #{name}"
  end
end

class ConcreteKlass < AbstractKlass
  def hello; "Hello"; end
  def name; "Ruby students"; end
end

ConcreteKlass.new.welcome  # "Hello Ruby students"
```

## 접근 제어

```ruby
class ClassAccess
  def m1          # public
  end

  protected
    def m2        # protected
    end

  private
    def m3        # private
    end
end

# 또는
class ClassAccess
  def m1
  end
  public :m1
  protected :m2, :m3
  private :m4, :m5
end
```

## 클래스 구조 확인

```ruby
# 메서드 구조 확인
puts self.private_methods.sort
s.class

# 부모 클래스 확인
a = [1, 2, 3, 4]
print a.class.ancestors

# Object ID
puts "string".object_id
puts "string".object_id  # 다른 ID
```
