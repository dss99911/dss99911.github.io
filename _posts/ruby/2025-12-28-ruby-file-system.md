---
layout: post
title: "Ruby 파일 처리와 시스템 명령"
date: 2025-12-28
categories: ruby
tags: [ruby, file, io, system]
---

Ruby에서 파일 처리와 시스템 명령 실행 방법을 알아봅니다.

## 파일 읽기

```ruby
File.open('p014constructs.rb', 'r') do |f1|
  while line = f1.gets
    puts line
  end
end
```

## 파일 쓰기

```ruby
File.open('test.rb', 'w') do |f2|
  f2.puts "Created by Satish\nThank God!"
end
```

## 파일 인코딩

```ruby
File.open('p014constructs.rb', 'r:UTF-16LE:UTF-8') do |f1|
  # ...
end
```

## 디렉토리 순회

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

## 랜덤 액세스

```ruby
f = File.new("hellousa.rb")

# SEEK_CUR - 현재 위치에서 상대 이동
# SEEK_END - 파일 끝에서 상대 이동 (음수 값 사용)
# SEEK_SET - 절대 위치로 이동
f.seek(12, IO::SEEK_SET)
print f.readline
f.close
```

---

## 루비 파일 로딩

### load

파일을 실행할 때마다 포함합니다.

```ruby
load 'filename.rb'
```

### require

파일을 한 번만 로드합니다. (확장자 `.rb` 생략 가능)

```ruby
require 'filename'
```

### require_relative

상대 경로로 파일을 로드합니다.

```ruby
require_relative 'p030motorcycle'
```

---

## 시스템 명령 실행

### 백틱 사용

```ruby
puts `ls`
```

### system 메서드

처리 성공 여부를 true/false로 반환합니다.

```ruby
system("pwd")
```

### 환경 변수

```ruby
ENV.each { |k, v| puts "#{k}: #{v}" }
```
