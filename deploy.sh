#!/bin/bash

PUBLISH_DIRECTORY=.
JEKYLL_PATH="/home/ec2-user/my-site"
KEY_PATH=~/.ssh/hyun.kim.stock.pem
EC2_IP=13.209.158.212


rsync -av --delete -e "ssh -i $KEY_PATH" "$PUBLISH_DIRECTORY" ec2-user@"$EC2_IP":"$JEKYLL_PATH/_posts"