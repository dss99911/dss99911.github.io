---
layout: post
title: "Ruby 제어문 - 조건문과 반복문"
date: 2025-12-28
categories: [programming, ruby]
tags: [ruby, control-flow, if, while, loop]
image: /assets/images/posts/thumbnails/2025-12-28-ruby-control-flow.png
redirect_from:
  - "/programming/ruby/2025/12/28/ruby-control-flow.html"
---

Ruby의 조건문과 반복문에 대해 알아봅니다.

## 조건문

### if / else

```ruby
s1 = 'Jonathan'
s2 = 'Jonathan'
s3 = s1

if s1 == s2
  puts 'Both Strings have identical content'
else
  puts 'Both Strings do not have identical content'
end
```

### elsif

```ruby
if name == 'Satish'
  puts 'What a nice name!!'
elsif name == 'Sunil'
  puts 'Another nice name!'
end
```

### unless

`if not`과 동일합니다.

```ruby
unless ARGV.length == 2
  puts "Usage: program.rb 23 45"
  exit
end
```

### 한 줄 조건문

```ruby
puts "Enrollments will now Stop" if participants > 2500
```

### case / when

```ruby
year = 2000
leap = case
       when year % 400 == 0 then true
       when year % 100 == 0 then false
       else year % 4 == 0
       end
puts leap  # true
```

---

## 반복문

### times

```ruby
rice_on_square = 1

64.times do |square|
  puts "On square #{square + 1} are #{rice_on_square} grain(s)"
  rice_on_square *= 2
end

# 간단한 형태
5.times { puts "Mice!\n" }
```

### while

```ruby
var = 0
while var < 10
  puts var
  var += 1
end
```

### Range와 삼항 연산자

```ruby
age = 23
person = (13...19).include?(age) ? "teenager" : "not a teenager"
puts person  # "not a teenager"
```

### each

```ruby
locations.each do |loc|
  puts 'I love ' + loc + '!'
  puts "Don't you?"
end
```

---

## 반복 제어

Ruby는 반복문의 흐름을 제어하는 여러 키워드를 제공합니다.

### break

반복문을 즉시 종료합니다.

```ruby
(1..10).each do |i|
  break if i > 5
  puts i
end
# 출력: 1, 2, 3, 4, 5
```

### next

현재 반복을 건너뛰고 다음 반복으로 넘어갑니다.

```ruby
(1..10).each do |i|
  next if i.even?
  puts i
end
# 출력: 1, 3, 5, 7, 9
```

### redo

현재 반복을 처음부터 다시 실행합니다. 카운터는 증가하지 않으므로 무한 루프에 주의해야 합니다.

```ruby
attempts = 0
(1..3).each do |i|
  attempts += 1
  redo if attempts == 2 && i == 1
  puts "i=#{i}, attempts=#{attempts}"
end
```

---

## 고급 반복문

### upto와 downto

```ruby
1.upto(5) { |i| print "#{i} " }    # 1 2 3 4 5
5.downto(1) { |i| print "#{i} " }  # 5 4 3 2 1
```

### loop

무한 루프를 만들 때 사용합니다. `break`로 탈출합니다.

```ruby
count = 0
loop do
  break if count >= 5
  puts count
  count += 1
end
```

### each_with_index

인덱스가 필요한 경우에 사용합니다.

```ruby
['a', 'b', 'c'].each_with_index do |item, index|
  puts "#{index}: #{item}"
end
# 0: a
# 1: b
# 2: c
```

### each_with_object

반복하면서 객체를 누적할 때 유용합니다.

```ruby
result = (1..5).each_with_object([]) do |num, arr|
  arr << num * 2
end
puts result.inspect  # [2, 4, 6, 8, 10]
```

---

## 조건문 팁

### 후위 조건문 활용

Ruby에서는 간단한 조건문을 한 줄로 작성할 수 있습니다. 코드가 간결해지지만 복잡한 로직에는 사용하지 않는 것이 좋습니다.

```ruby
# if 후위
puts "성인입니다" if age >= 18

# unless 후위
puts "미성년자입니다" unless age >= 18
```

### case에서 정규 표현식 사용

`case/when`에서 정규 표현식을 조건으로 사용할 수 있습니다.

```ruby
email = "user@example.com"

case email
when /\A[\w+\-.]+@gmail\.com\z/
  puts "Gmail 계정"
when /\A[\w+\-.]+@yahoo\.com\z/
  puts "Yahoo 계정"
else
  puts "기타 이메일"
end
```

### case에서 Range 사용

```ruby
score = 85

grade = case score
        when 90..100 then 'A'
        when 80..89  then 'B'
        when 70..79  then 'C'
        when 60..69  then 'D'
        else              'F'
        end
puts grade  # "B"
```
