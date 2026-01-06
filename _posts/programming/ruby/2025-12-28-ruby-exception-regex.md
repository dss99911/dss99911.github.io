---
layout: post
title: "Ruby 예외 처리와 정규 표현식"
date: 2025-12-28
categories: [programming, ruby]
tags: [ruby, exception, regex]
image: /assets/images/posts/thumbnails/2025-12-28-ruby-exception-regex.png
---

Ruby의 예외 처리와 정규 표현식 사용법에 대해 알아봅니다.

## 예외 처리

### raise (예외 발생)

```ruby
def raise_exception
  puts 'I am before the raise.'
  raise 'An error has occured'
  puts 'I am after the raise'  # 실행되지 않음
end

raise_exception
```

### begin/rescue (try/catch)

```ruby
def raise_and_rescue
  begin
    puts 'I am before the raise.'
    raise 'An error has occured.'
    puts 'I am after the raise.'
  rescue
    puts 'I am rescued.'
  end
  puts 'I am after the begin block.'
end

raise_and_rescue
```

### 여러 예외 타입 처리

```ruby
begin
  # ...
rescue OneTypeOfException
  # ...
rescue AnotherTypeOfException
  # ...
else
  # 다른 예외들
end
```

### 예외 정보 얻기

```ruby
begin
  raise 'A test exception.'
rescue Exception => e
  puts e.message
  puts e.backtrace.inspect
end
```

---

## 정규 표현식 (Regex)

### 기본 사용법

```ruby
m1 = /Ruby/.match("The future is Ruby")
puts m1.class  # MatchData

m2 = "The future is Ruby" =~ /Ruby/
puts m2        # 14 (매칭 시작 위치)
```

### 캡처 그룹

```ruby
string = "My phone number is (123) 555-1234."
phone_re = /\((\d{3})\)\s+(\d{3})-(\d{4})/
m = phone_re.match(string)

unless m
  puts "There was no match..."
  exit
end

print "The whole string we started with: "
puts m.string

print "The entire part of the string that matched: "
puts m[0]

puts "The three captures: "
3.times do |index|
  puts "Capture ##{index + 1}: #{m.captures[index]}"
end

puts "Here's another way to get at the first capture:"
print "Capture #1: "
puts m[1]
```
