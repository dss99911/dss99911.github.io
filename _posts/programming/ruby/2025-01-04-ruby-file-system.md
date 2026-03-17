---
layout: post
title: "Ruby 파일 처리와 시스템 명령"
date: 2025-12-28
categories: [programming, ruby]
tags: [ruby, file, io, system]
image: /assets/images/posts/thumbnails/2025-12-28-ruby-file-system.png
redirect_from:
  - "/programming/ruby/2025/12/28/ruby-file-system.html"
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

---

## 파일 유틸리티 메서드

Ruby의 `File` 클래스는 파일 정보를 확인하는 다양한 유틸리티 메서드를 제공합니다.

### 파일 존재 여부 및 정보

```ruby
# 파일 존재 여부 확인
File.exist?('test.rb')      # true/false

# 파일 크기 (바이트)
File.size('test.rb')         # 1234

# 파일 타입 확인
File.file?('test.rb')        # true (일반 파일)
File.directory?('/tmp')      # true (디렉토리)
File.symlink?('link.rb')     # true (심볼릭 링크)

# 파일명과 확장자 분리
File.basename('/path/to/file.rb')         # "file.rb"
File.basename('/path/to/file.rb', '.rb')  # "file"
File.extname('file.rb')                   # ".rb"
File.dirname('/path/to/file.rb')          # "/path/to"
```

### 파일 경로 조합

```ruby
File.join('path', 'to', 'file.rb')  # "path/to/file.rb"
File.expand_path('~/documents')      # "/Users/username/documents"
```

---

## IO 클래스 활용

`File`은 `IO` 클래스를 상속하므로 다양한 IO 메서드를 사용할 수 있습니다.

### 한 번에 읽기/쓰기

```ruby
# 파일 전체 내용을 문자열로 읽기
content = File.read('test.rb')

# 파일 전체 내용을 줄 단위 배열로 읽기
lines = File.readlines('test.rb')
lines.each { |line| puts line }

# 한 번에 쓰기
File.write('output.txt', 'Hello, Ruby!')
```

### 임시 파일 (Tempfile)

테스트나 임시 데이터 처리에 유용한 `Tempfile` 클래스입니다.

```ruby
require 'tempfile'

Tempfile.create('prefix') do |f|
  f.write('임시 데이터')
  f.rewind
  puts f.read
end
# 블록이 끝나면 임시 파일이 자동 삭제됩니다
```

---

## 디렉토리 작업

```ruby
# 현재 디렉토리
Dir.pwd

# 디렉토리 생성
Dir.mkdir('new_dir')

# 재귀적으로 디렉토리 생성
require 'fileutils'
FileUtils.mkdir_p('path/to/nested/dir')

# 디렉토리 내 파일 목록
Dir.entries('.')              # [".", "..", "file1.rb", ...]
Dir.glob('*.rb')              # ["file1.rb", "file2.rb"]
Dir.glob('**/*.rb')           # 재귀적으로 모든 .rb 파일 검색
```

---

## 실무 팁

- **파일을 열었으면 반드시 닫아야 합니다.** 블록 형태의 `File.open`을 사용하면 블록 종료 시 자동으로 닫히므로 권장됩니다
- **대용량 파일**은 전체를 메모리에 읽지 말고 줄 단위(`each_line`)나 청크 단위(`read(size)`)로 처리하세요
- **인코딩 문제**가 발생하면 `File.open`의 인코딩 옵션(`r:UTF-8`, `r:EUC-KR:UTF-8` 등)을 명시적으로 지정하세요
- 시스템 명령 실행 시 사용자 입력을 직접 전달하면 **보안 취약점(Command Injection)**이 발생할 수 있으므로 `Shellwords.escape`를 사용하세요

---

## FileUtils 모듈

Ruby 표준 라이브러리의 `FileUtils`는 파일과 디렉토리를 다루는 고수준 유틸리티를 제공합니다.

### 파일 복사, 이동, 삭제

```ruby
require 'fileutils'

# 파일 복사
FileUtils.cp('source.txt', 'dest.txt')
FileUtils.cp_r('source_dir', 'dest_dir')  # 재귀적 복사

# 파일 이동 (이름 변경)
FileUtils.mv('old_name.txt', 'new_name.txt')

# 파일 삭제
FileUtils.rm('file.txt')
FileUtils.rm_f('file.txt')       # 파일이 없어도 에러 없음
FileUtils.rm_rf('directory')      # 재귀적 강제 삭제 (주의!)

# 파일 권한 변경
FileUtils.chmod(0755, 'script.rb')
FileUtils.chmod_R(0644, 'public/')  # 재귀적 권한 변경

# 파일 소유자 변경
FileUtils.chown('user', 'group', 'file.txt')
```

### 안전한 삭제 패턴

프로덕션 코드에서는 `rm_rf`를 사용할 때 특히 주의해야 합니다.

```ruby
def safe_remove(path)
  unless File.exist?(path)
    puts "경로가 존재하지 않습니다: #{path}"
    return false
  end

  # 절대 경로가 허용 범위 내인지 확인
  expanded = File.expand_path(path)
  allowed_base = File.expand_path('~/workspace/tmp')

  unless expanded.start_with?(allowed_base)
    raise "삭제 허용 범위 밖의 경로입니다: #{expanded}"
  end

  FileUtils.rm_rf(expanded)
  true
end
```

---

## Pathname 클래스

`Pathname`은 파일 경로를 객체 지향적으로 다루는 클래스입니다. `File`, `Dir`, `FileUtils`의 기능을 하나의 인터페이스로 통합합니다.

```ruby
require 'pathname'

path = Pathname.new('/Users/ruby/projects/myapp/config/database.yml')

# 경로 정보
path.basename           # #<Pathname:database.yml>
path.extname            # ".yml"
path.dirname            # #<Pathname:/Users/ruby/projects/myapp/config>
path.parent             # #<Pathname:/Users/ruby/projects/myapp/config>

# 경로 조합
config_dir = Pathname.new('/Users/ruby/projects/myapp/config')
db_path = config_dir / 'database.yml'    # + 또는 / 연산자 사용 가능

# 파일 확인
path.exist?             # true/false
path.file?              # true
path.directory?         # false
path.readable?          # true/false
path.writable?          # true/false

# 파일 읽기/쓰기
content = path.read
path.write("new content")
lines = path.readlines

# 디렉토리 탐색
Pathname.new('.').children.each do |child|
  puts "#{child} (#{child.file? ? 'file' : 'dir'})"
end
```

---

## CSV 파일 처리

Ruby는 CSV 파일을 처리하는 표준 라이브러리를 제공합니다.

```ruby
require 'csv'

# CSV 읽기
CSV.foreach('data.csv', headers: true) do |row|
  puts "Name: #{row['name']}, Age: #{row['age']}"
end

# CSV를 배열로 읽기
data = CSV.read('data.csv', headers: true)
puts data[0]['name']

# CSV 쓰기
CSV.open('output.csv', 'w') do |csv|
  csv << ['name', 'age', 'city']
  csv << ['Alice', 30, 'Tokyo']
  csv << ['Bob', 25, 'Seoul']
end

# 문자열에서 CSV 파싱
csv_string = "name,age\nAlice,30\nBob,25"
CSV.parse(csv_string, headers: true).each do |row|
  puts row.to_h
end
```

---

## JSON 파일 처리

```ruby
require 'json'

# JSON 파일 읽기
data = JSON.parse(File.read('config.json'))
puts data['database']['host']

# JSON 파일 쓰기
config = {
  database: {
    host: 'localhost',
    port: 5432,
    name: 'myapp_production'
  },
  cache: {
    enabled: true,
    ttl: 3600
  }
}

File.write('config.json', JSON.pretty_generate(config))
```

---

## YAML 파일 처리

```ruby
require 'yaml'

# YAML 파일 읽기
config = YAML.load_file('config.yml')
puts config['database']['host']

# YAML 파일 쓰기 (안전한 방법)
config = {
  'database' => {
    'host' => 'localhost',
    'port' => 5432
  }
}

File.write('config.yml', YAML.dump(config))

# Ruby 3.1+ 에서는 permitted_classes 지정 필요
config = YAML.safe_load_file('config.yml', permitted_classes: [Date, Time])
```

---

## 파일 감시 (File Watching)

파일 변경을 감지하여 자동으로 작업을 수행하는 패턴입니다.

### 간단한 파일 감시

```ruby
def watch_file(path, interval: 1)
  last_mtime = File.mtime(path)

  loop do
    current_mtime = File.mtime(path)
    if current_mtime != last_mtime
      puts "파일이 변경되었습니다: #{path}"
      yield path if block_given?
      last_mtime = current_mtime
    end
    sleep interval
  end
end

# 사용 예시
watch_file('config.yml') do |path|
  puts "설정 파일 다시 로드: #{path}"
  reload_config(path)
end
```

### Listen gem 사용

대규모 프로젝트에서는 `listen` gem이 더 효율적입니다. OS 수준의 파일 시스템 이벤트를 활용합니다.

```ruby
# Gemfile에 추가: gem 'listen'
require 'listen'

listener = Listen.to('app/', 'config/') do |modified, added, removed|
  puts "Modified: #{modified}" unless modified.empty?
  puts "Added: #{added}" unless added.empty?
  puts "Removed: #{removed}" unless removed.empty?
end

listener.start
sleep  # 프로그램이 종료되지 않도록 대기
```

---

## 시스템 명령 실행 고급 기법

### Open3 모듈

`Open3`은 시스템 명령의 stdin, stdout, stderr을 개별적으로 제어할 수 있습니다.

```ruby
require 'open3'

# stdout, stderr, 종료 상태를 모두 캡처
stdout, stderr, status = Open3.capture3('ls', '-la', '/tmp')
puts "Exit code: #{status.exitstatus}"
puts "Output: #{stdout}"
puts "Errors: #{stderr}" unless stderr.empty?

# 실시간 출력 처리
Open3.popen3('long_running_command') do |stdin, stdout, stderr, wait_thr|
  stdout.each_line { |line| puts "OUT: #{line}" }
  stderr.each_line { |line| puts "ERR: #{line}" }
  exit_status = wait_thr.value
  puts "Process finished with #{exit_status}"
end
```

### 안전한 명령 실행

```ruby
require 'shellwords'

# 사용자 입력을 안전하게 이스케이프
user_input = "file with spaces & special; chars"
safe_input = Shellwords.escape(user_input)
system("ls #{safe_input}")

# 배열 형태로 전달하면 셸을 거치지 않아 더 안전
system('ls', '-la', user_input)  # 셸 해석 없이 직접 실행
```
