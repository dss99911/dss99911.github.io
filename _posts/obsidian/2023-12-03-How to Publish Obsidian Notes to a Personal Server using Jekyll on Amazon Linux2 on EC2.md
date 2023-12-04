---
layout: post
title: How to Publish Obsidian Notes to a Personal Server using Jekyll on Amazon Linux2 on EC2
date: 2023-12-03 21:05:37 +0900
categories: obsidian
description: Publish Obsidian notes to a personal server using Jekyll on Amazon Linux2 on EC2. Learn setup, running as a service, note formatting, and uploading files.
---
This guide will walk you through the process of setting up Jekyll on an Amazon Linux2 EC2 instance and using it to publish your Obsidian notes to your personal server.

## Setting Up Jekyll

First, we need to install the necessary packages and set up Jekyll. Here are the steps:

```bash
# Define the port Jekyll will run on
PORT=4000

# Install Ruby 3.0
sudo amazon-linux-extras install -y ruby3.0

# Install Ruby development tools
sudo yum install -y ruby-devel

# Install development tools
sudo yum groupinstall "Development Tools" -y

# Install Bundler and Jekyll
sudo gem install bundler
sudo gem update --system
sudo gem install jekyll

# Create a new Jekyll site
jekyll new my-site
cd my-site

# Install the necessary gems for your site
sudo bundle install
```

To test your Jekyll site, you can run the following command:

```bash
bundle exec jekyll serve --host=0.0.0.0 --port=$PORT
```

You can then access your site at `{your-address}:4000`. Don’t forget to open the port in your security group.

## Running Jekyll as a Service

To ensure that Jekyll starts on reboot, we can set it up as a service:

```bash
# Define the path to your Jekyll site
JEKYLL_PATH="/home/ec2-user/my-site"
PORT=4000

# Create a service file
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

# Set permissions for the service file
sudo chmod 644 /etc/systemd/system/jekyll.service

# Reload the systemd daemon
sudo systemctl daemon-reload

# Enable the Jekyll service
sudo systemctl enable jekyll.service

# Start the Jekyll service
sudo systemctl start jekyll.service
```

## Formatting Obsidian Notes for Jekyll

To make your Obsidian notes compatible with Jekyll, you need to add the following header to each note:

```markdown
---
layout: post
title:  "{your post title}"
date:   2023-12-03 10:24:45 +0000
categories: obsidian
---
```

Also, you need to change the note file name format to `{date format of yyyy-MM-dd}-{title}.md`.

The script below adds the title with the note name, sets the categories with the directory name, and sets the file modified date. Before running the script, don’t forget to backup your files. It may not work properly if the file name contains " or in some unknown cases.

```bash
PUBLISH_DIRECTORY={your-note-directory-to-publish}
find $PUBLISH_DIRECTORY -type f -name "*.md" | while read file; do
    # Remove the extension from the file name
    title=$(basename "$file" .md)

    # Get the name of the directory the file is in
    directory=$(basename $(dirname "$file"))

    # Get the current date and time
    modified_date=$(date -r "$file" +"%Y-%m-%d %T %z")

    temp="$file-temp"

    # Add a header to each file
    echo "---" > "$temp"
    echo "layout: post" >> "$temp"
    echo "title:  "'"'"$title"'"' >> "$temp"
    echo "date:   $modified_date" >> "$temp"
    echo "categories: $directory" >> "$temp"
    echo "---" >> "$temp"
    cat "$file" >> "$temp"

    # Replace the original file with the temporary file
    mv "$temp" "$file"

    # Add the current date as a prefix to the file name
    mv "$file" "$(dirname "$file")/$(date -r "$file" +"%Y-%m-%d")-$title.md"
done
```

## Uploading Files to the EC2 Server

Finally, you can upload your notes to your EC2 server:

```bash
#!/bin/bash
PUBLISH_DIRECTORY={your-note-directory-to-publish}
JEKYLL_PATH="/home/ec2-user/my-site"
KEY_PATH={your-key.pem}
EC2_IP={your-ec2-ip}

rsync -av --delete -e "ssh -i $KEY_PATH" "$PUBLISH_DIRECTORY" ec2-user@"$EC2_IP":"$JEKYLL_PATH/_posts"
```
The `--delete` option allows for the deletion of files on the server if they have been deleted locally. If you do not want files to be deleted, please execute the command without the `--delete` option.

And that’s it! You’ve successfully published your Obsidian notes to your personal server using Jekyll on Amazon Linux2 on EC2. Happy blogging!