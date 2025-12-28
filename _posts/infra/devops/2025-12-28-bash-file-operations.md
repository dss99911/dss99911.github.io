---
layout: post
title: "Bash 파일 및 디렉토리 작업"
date: 2025-12-28 12:09:00 +0900
categories: [infra, devops]
tags: [bash, shell, linux, file-system, commands]
description: "Bash에서 파일과 디렉토리를 다루는 방법 - 생성, 복사, 이동, 삭제, 권한 설정을 설명합니다."
---

# Bash 파일 및 디렉토리 작업

Bash에서 파일과 디렉토리를 효율적으로 관리하는 방법을 정리했습니다.

## 현재 위치 확인

```bash
pwd
echo $PWD
```

## 디렉토리 이동

```bash
cd ~user_name   # 특정 사용자의 홈 디렉토리
cd -            # 이전 디렉토리로 이동
```

## ls 명령어

```bash
ls -l          # 상세 정보
ls ~ /         # 여러 위치 동시 조회
ls -t          # 수정 시간순 (최신 먼저)
ls -R          # 하위 디렉토리 포함
ls -d */       # 디렉토리만
ls -p          # 디렉토리에 / 표시
ls -d $PWD/*   # 전체 경로
ls -lh file    # 파일 용량 (human readable)
```

## 파일/디렉토리 생성

### 디렉토리 생성

```bash
mkdir -p /path/to/directory  # 경로상의 모든 디렉토리 생성
```

### 파일 생성

```bash
touch filename
```

### 파일 내용과 함께 생성

```bash
# 덮어쓰기
cat <<END >a.txt
aa
ab
da
END

# 추가
cat <<END >> a.txt
aa
ab
da
END

# 한 줄 추가
echo "aa" >> a.txt
```

> Note: `$`가 텍스트에 포함된 경우 `\$`를 사용해야 합니다.

## 파일 복사/이동/삭제

### 복사 (cp)

```bash
cp source_file destination_file
cp -i file1 file2              # 덮어쓰기 전 확인
cp *.txt directory
cp * /home/tom/backup
cp -R * /home/tom/backup       # 재귀적 복사
```

### 이동 (mv)

```bash
mv source_file destination_file
mv -i file1 file2              # 덮어쓰기 전 확인
mv file1 file2 file3 dir1      # 여러 파일을 디렉토리로
```

### 삭제 (rm)

```bash
rm file1 file2
rm -i file1 file2              # 삭제 전 확인
rm -r dir1 dir2                # 디렉토리 재귀 삭제
rm mysql*                      # 패턴으로 삭제
```

## 파일 내용 보기

```bash
cat filename      # 전체 내용
less a.txt        # 페이지 단위
file a.zip        # 파일 타입 확인
```

## 파일 정보

```bash
# 파일명만 추출
basename $file_path

# 라인/단어/글자 수
wc filename
wc -l             # 라인 수만
```

## 파일 권한

### chmod

```bash
# Classes: a(all), u(user/owner), g(group), o(other)
# Permissions: read(r,4), write(w,2), execute(x,1)
# Operators: +(add), -(remove)

chmod -R +xr directory   # 재귀적으로 권한 설정
chmod 400 file           # 소유자만 읽기
chmod 600 file           # 소유자만 읽기/쓰기
```

### chown

```bash
sudo chown -R mysql /usr/local/mysql/data
sudo chown -R $(whoami) /usr/local/sbin
```

## 파일 시스템 구조

| 경로 | 설명 |
|------|------|
| `/boot` | 커널 및 부트 로더 |
| `/etc` | 설정 파일 |
| `/etc/init.d` | 시스템 서비스 스크립트 |
| `/bin, /usr/bin` | 프로그램 (/bin: 시스템, /usr/bin: 사용자) |
| `/sbin, /usr/sbin` | 슈퍼유저 프로그램 |
| `/usr/local` | 사용자 설치 애플리케이션 |
| `/var` | 변경되는 파일 (로그 등) |
| `/var/log` | 로그 파일 |
| `/lib` | 공유 라이브러리 |
| `/tmp` | 임시 파일 |
| `/dev` | 장치 파일 |

## 디렉토리 사용량

```bash
du             # 디렉토리 용량
df -h          # 디스크 사용량
```

## Pathname Expansion

`*`는 파일명의 모든 문자와 매칭됩니다:

```bash
ls *           # 현재 위치와 하위 폴더 파일
echo D*        # D로 시작하는 파일
echo [[:upper:]]*    # 대문자로 시작하는 파일
echo /usr/*/share

# 디렉토리 내 파일 반복
for filename in $dir/*; do
    fn=$(basename "$filename")
    if [ -f "$filename" ]; then
        echo "$fn"
    fi
done
```

## Tilde Expansion

```bash
echo ~         # 현재 사용자 홈
echo ~hyun     # hyun 사용자의 홈
```

## 파일 검색

```bash
sudo find / -name 'wp-content'
```

## 링크

```bash
# Symbolic link 생성
ln -s /path/to/original /path/to/link
sudo ln -s /var/myapp/myapp.jar /etc/init.d/myapp
```

## 압축

### tar

```bash
# 압축
tar -czvf name-of-archive.tar.gz /path/to/directory-or-file

# 해제
tar -xzvf archive.tar.gz
```

### zip

```bash
# 암호화 압축
zip -er archive.zip folder
zip -e archive.zip file

# 폴더 제외하고 압축
cd MyFolder; zip -r -X "../MyFolder.zip" *
```

## 스니펫

### 스크립트 위치 가져오기

```bash
${0%/*}
```

### 폴더 없으면 생성

```bash
if [ ! -d "/Users/hyun/temp" ]; then
    mkdir /Users/hyun/temp
fi
```

### PATH에 경로 추가

```bash
echo 'export PATH=/usr/local/mysql/bin:$PATH' >> ~/.bash_profile
```
