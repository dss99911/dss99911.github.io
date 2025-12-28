---
layout: post
title: "Ruby 제어문 - 조건문과 반복문"
date: 2025-12-28
categories: [programming, ruby]
tags: [ruby, control-flow, if, while, loop]
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
