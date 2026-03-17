---
layout: post
title: "Ruby 예외 처리와 정규 표현식"
date: 2025-12-28
categories: [programming, ruby]
tags: [ruby, exception, regex]
image: /assets/images/posts/thumbnails/2025-12-28-ruby-exception-regex.png
redirect_from:
  - "/programming/ruby/2025/12/28/ruby-exception-regex.html"
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

---

## 예외 처리 고급 기능

### ensure (finally)

예외 발생 여부와 관계없이 반드시 실행되는 코드를 작성할 때 `ensure`를 사용합니다.

```ruby
begin
  file = File.open('data.txt', 'r')
  # 파일 처리 로직
rescue Errno::ENOENT => e
  puts "파일을 찾을 수 없습니다: #{e.message}"
ensure
  file&.close  # 파일이 열려있으면 반드시 닫기
end
```

### retry

`rescue` 블록에서 `retry`를 사용하면 `begin` 블록을 다시 실행합니다. 네트워크 요청 재시도 등에 유용합니다.

```ruby
attempts = 0
begin
  attempts += 1
  response = fetch_data_from_api()
rescue NetworkError => e
  retry if attempts < 3
  puts "3회 시도 후 실패: #{e.message}"
end
```

### 커스텀 예외 클래스

표준 예외 클래스를 상속하여 애플리케이션 고유의 예외를 정의할 수 있습니다.

```ruby
class InsufficientFundsError < StandardError
  attr_reader :amount

  def initialize(amount)
    @amount = amount
    super("잔액이 부족합니다. 필요 금액: #{amount}")
  end
end

begin
  raise InsufficientFundsError.new(50000)
rescue InsufficientFundsError => e
  puts e.message   # "잔액이 부족합니다. 필요 금액: 50000"
  puts e.amount    # 50000
end
```

---

## 정규 표현식 고급 기능

### 주요 메타 문자

| 메타 문자 | 의미 | 예시 |
|-----------|------|------|
| `\d` | 숫자 | `"abc123" =~ /\d+/` → 3 |
| `\w` | 단어 문자 (영문, 숫자, _) | `"hello_world" =~ /\w+/` |
| `\s` | 공백 문자 | `"a b" =~ /\s/` → 1 |
| `.` | 줄바꿈 제외 모든 문자 | `"abc" =~ /a.c/` |
| `^` | 줄 시작 | `"hello" =~ /^h/` |
| `$` | 줄 끝 | `"hello" =~ /o$/` |

### gsub으로 치환

```ruby
# 단순 치환
"Hello World".gsub(/World/, 'Ruby')  # "Hello Ruby"

# 캡처 그룹을 이용한 치환
"2025-01-15".gsub(/(\d{4})-(\d{2})-(\d{2})/, '\3/\2/\1')
# "15/01/2025"

# 블록을 이용한 치환
"hello world".gsub(/\b\w/) { |match| match.upcase }
# "Hello World"
```

### scan으로 모든 매칭 추출

```ruby
"The price is $100 and $200".scan(/\$\d+/)
# ["$100", "$200"]

"John: 25, Jane: 30".scan(/(\w+): (\d+)/)
# [["John", "25"], ["Jane", "30"]]
```

### 명명된 캡처 그룹

```ruby
pattern = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/
match = pattern.match("2025-02-10")

puts match[:year]   # "2025"
puts match[:month]  # "02"
puts match[:day]    # "10"
```

명명된 캡처 그룹은 코드의 가독성을 높이고, 인덱스 대신 이름으로 캡처된 값에 접근할 수 있어 유지보수에 유리합니다.

---

## 예외 처리 베스트 프랙티스

### 1. 구체적인 예외를 먼저 잡기

rescue 블록은 위에서 아래로 순서대로 평가됩니다. 더 구체적인 예외 클래스를 먼저 배치해야 합니다.

```ruby
begin
  # 파일 읽기 작업
  data = File.read('config.json')
  config = JSON.parse(data)
rescue Errno::ENOENT => e
  puts "파일을 찾을 수 없습니다: #{e.message}"
rescue JSON::ParserError => e
  puts "JSON 파싱 실패: #{e.message}"
rescue StandardError => e
  puts "예상치 못한 오류: #{e.message}"
end
```

### 2. 절대 Exception을 잡지 마세요

`Exception`은 `NoMemoryError`, `SyntaxError`, `Interrupt` 등 시스템 수준의 예외도 포함합니다. 일반적으로 `StandardError`나 그 하위 클래스만 잡아야 합니다.

```ruby
# 나쁜 예 - Ctrl+C도 잡혀서 프로그램 종료 불가
begin
  # ...
rescue Exception => e
  puts e.message
end

# 좋은 예
begin
  # ...
rescue StandardError => e
  puts e.message
end
```

### 3. 리소스 정리에 ensure 사용

외부 리소스(파일, 네트워크 연결, 데이터베이스 등)를 사용할 때는 ensure로 정리합니다.

```ruby
def process_file(path)
  file = File.open(path, 'r')
  # 파일 처리...
  file.read
rescue IOError => e
  puts "IO 에러: #{e.message}"
  nil
ensure
  file&.close
end
```

### 4. 예외 대신 조건문 사용 고려

예외 처리는 비용이 높습니다. 예상 가능한 조건은 조건문으로 처리하는 것이 좋습니다.

```ruby
# 나쁜 예 - 예외를 흐름 제어에 사용
begin
  value = hash.fetch(:key)
rescue KeyError
  value = default_value
end

# 좋은 예
value = hash.fetch(:key, default_value)
```

---

## 정규 표현식 실전 예제

### 이메일 유효성 검사

```ruby
email_pattern = /\A[\w+\-.]+@[a-z\d\-]+(\.[a-z\d\-]+)*\.[a-z]+\z/i

emails = ["user@example.com", "invalid@", "test.user@sub.domain.com"]
emails.each do |email|
  valid = email.match?(email_pattern) ? "유효" : "무효"
  puts "#{email}: #{valid}"
end
```

### URL 파싱

```ruby
url_pattern = %r{(?<protocol>https?)://(?<host>[^/:]+)(?::(?<port>\d+))?(?<path>/[^?#]*)?}

url = "https://example.com:8080/api/users?page=1"
match = url_pattern.match(url)

if match
  puts "Protocol: #{match[:protocol]}"  # "https"
  puts "Host: #{match[:host]}"          # "example.com"
  puts "Port: #{match[:port]}"          # "8080"
  puts "Path: #{match[:path]}"          # "/api/users"
end
```

### 로그 파싱

```ruby
log_line = '[2025-02-10 14:30:45] ERROR: Connection timeout (retry: 3/5)'
log_pattern = /\[(?<timestamp>[\d\- :]+)\]\s+(?<level>\w+):\s+(?<message>.+)/

match = log_pattern.match(log_line)
if match
  puts "Time: #{match[:timestamp]}"   # "2025-02-10 14:30:45"
  puts "Level: #{match[:level]}"      # "ERROR"
  puts "Message: #{match[:message]}"  # "Connection timeout (retry: 3/5)"
end
```

### 텍스트에서 숫자 추출

```ruby
text = "상품 가격은 12,500원이고 할인은 15%입니다. 총 10,625원입니다."

# 모든 숫자 추출 (콤마 포함)
prices = text.scan(/[\d,]+/).map { |n| n.delete(',').to_i }
puts prices.inspect  # [12500, 15, 10625]
```

---

## 정규 표현식 성능 최적화

### Regexp 객체 재사용

정규 표현식은 컴파일 비용이 있으므로, 반복 사용 시 상수로 정의합니다.

```ruby
# 나쁜 예 - 매번 새로 컴파일
100.times do |i|
  text.match(/pattern_#{i}/)
end

# 좋은 예 - 미리 컴파일
EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-]+\.[a-z]+\z/i.freeze

def valid_email?(email)
  email.match?(EMAIL_REGEX)
end
```

### 백트래킹 주의

탐욕적(greedy) 수량자가 중첩되면 백트래킹 폭발(catastrophic backtracking)이 발생할 수 있습니다.

```ruby
# 위험 - 입력에 따라 극도로 느려질 수 있음
bad_pattern = /(a+)+b/

# 안전 - 소유적 수량자 사용
safe_pattern = /(a++)b/
```

### match? 메서드 사용

Ruby 2.4부터 `match?` 메서드가 추가되었습니다. `MatchData` 객체를 생성하지 않아 `match`보다 빠릅니다.

```ruby
# 느린 방법 - MatchData 객체 생성
if text.match(/pattern/)
  # ...
end

# 빠른 방법 - boolean만 반환
if text.match?(/pattern/)
  # ...
end
```
