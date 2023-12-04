---
layout: post
title: Obsidian 노트를 개인 서버에 Jekyll을 이용해 게시하기 (Amazon Linux2 on EC2 환경)
date: 2023-12-03 21:05:37 +0900
categories: obsidian korean
description: Amazon Linux2 on EC2에서 Jekyll을 이용해 Obsidian 노트를 개인 서버에 게시하는 방법을 알아보세요. 설정부터 업로드까지 단계별 안내를 제공합니다
locale: ko-KR
---
이 가이드는 Amazon Linux2 EC2 인스턴스에서 Jekyll을 설정하고 Obsidian 노트를 개인 서버에 게시하는 과정을 안내합니다.

## Jekyll 설정

먼저, 필요한 패키지를 설치하고 Jekyll을 설정해야 합니다. 다음은 그 과정입니다:

```bash
# Jekyll이 실행될 포트를 정의합니다.
PORT=4000

# Ruby 3.0을 설치합니다.
sudo amazon-linux-extras install -y ruby3.0

# Ruby 개발 도구를 설치합니다.
sudo yum install -y ruby-devel

# 개발 도구를 설치합니다.
sudo yum groupinstall "Development Tools" -y

# Bundler와 Jekyll을 설치합니다.
sudo gem install bundler
sudo gem update --system
sudo gem install jekyll

# 새로운 Jekyll 사이트를 생성합니다.
jekyll new my-site
cd my-site

# 사이트에 필요한 gem을 설치합니다.
sudo bundle install
```

Jekyll 사이트를 테스트하려면 다음 명령어를 실행할 수 있습니다:

```bash
bundle exec jekyll serve --host=0.0.0.0 --port=$PORT
```

그런 다음 `{your-address}:4000`에서 사이트에 접속할 수 있습니다. 보안 그룹에서 포트를 열어두는 것을 잊지 마세요.

## Jekyll을 서비스로 실행하기

재부팅 시 Jekyll이 시작되도록 설정하려면, 서비스로 설정할 수 있습니다:

```bash
# Jekyll 사이트의 경로를 정의합니다.
JEKYLL_PATH="/home/ec2-user/my-site"
PORT=4000

# 서비스 파일을 생성합니다.
echo "[Unit]
Description=Jekyll
After=network.target

[Service]
ExecStart=/usr/local/bin/bundle exec jekyll serve --host=0.0.0.0 --port=$PORT
WorkingDirectory=$JEKYLL_PATH
Restart=always
User=ec2-user
Group=ec2-user
Environment='PATH=/usr/local/bin:$PATH'

[Install]
WantedBy=multi-user.target" | sudo tee /etc/systemd/system/jekyll.service

# 서비스 파일에 대한 권한을 설정합니다.
sudo chmod 644 /etc/systemd/system/jekyll.service

# systemd 데몬을 재시작합니다.
sudo systemctl daemon-reload

# Jekyll 서비스를 활성화합니다.
sudo systemctl enable jekyll.service

# Jekyll 서비스를 시작합니다.
sudo systemctl start jekyll.service
```

## Obsidian 노트를 Jekyll에 맞게 형식 변경하기

Obsidian 노트를 Jekyll과 호환되도록 하려면, 각 노트에 다음 헤더를 추가해야 합니다:

```markdown
---
layout: post
title:  "{your post title}"
date:   2023-12-03 10:24:45 +0000
categories: obsidian
---
```

또한, 노트 파일 이름 형식을 `{date format of yyyy-MM-dd}-{title}.md`로 변경해야 합니다.

아래 스크립트는 노트 이름으로 제목을 추가하고, 디렉토리 이름으로 카테고리를 설정하며, 파일 수정 날짜를 설정합니다. 스크립트를 실행하기 전에, 파일을 백업하는 것을 잊지 마세요. 파일 이름에 "가 포함되어 있거나 알 수 없는 경우에는 제대로 작동하지 않을 수 있습니다.

```bash
PUBLISH_DIRECTORY={your-note-directory-to-publish}
find $PUBLISH_DIRECTORY -type f -name "*.md" | while read file; do
    # 파일 이름에서 확장자를 제거합니다.
    title=$(basename "$file" .md)

    # 파일이 위치한 디렉토리 이름을 가져옵니다.
    directory=$(basename $(dirname "$file"))

    # 현재 날짜와 시간을 가져옵니다.
    modified_date=$(date -r "$file" +"%Y-%m-%d %T %z")

    temp="$file-temp"

    # 각 파일에 헤더를 추가합니다.
    echo "---" > "$temp"
    echo "layout: post" >> "$temp"
    echo "title:  "'"'"$title"'"' >> "$temp"
    echo "date:   $modified_date" >> "$temp"
    echo "categories: $directory" >> "$temp"
    echo "---" >> "$temp"
    cat "$file" >> "$temp"

    # 원본 파일을 임시 파일로 대체합니다.
    mv "$temp" "$file"

    # 파일 이름에 현재 날짜를 접두사로 추가합니다.
    mv "$file" "$(dirname "$file")/$(date -r "$file" +"%Y-%m-%d")-$title.md"
done
```

## EC2 서버에 파일 업로드하기

마지막으로, 노트를 EC2 서버에 업로드할 수 있습니다:

```bash
#!/bin/bash
PUBLISH_DIRECTORY={your-note-directory-to-publish}
JEKYLL_PATH="/home/ec2-user/my-site"
KEY_PATH={your-key.pem}
EC2_IP={your-ec2-ip}

rsync -av --delete -e "ssh -i $KEY_PATH" "$PUBLISH_DIRECTORY" ec2-user@"$EC2_IP":"$JEKYLL_PATH/_posts"
```
`--delete` 옵션은 로컬에서 파일이 삭제되면 서버에서도 해당 파일을 삭제하도록 하는 기능입니다. 만약 파일을 삭제하면 안 된다면, `--delete` 옵션을 제외하고 명령어를 실행해 주세요.

그럼 이제 다 됐습니다! Amazon Linux2 on EC2에서 Jekyll을 사용하여 Obsidian 노트를 개인 서버에 성공적으로 게시했습니다. 블로그 쓰는 즐거움을 느껴보세요!