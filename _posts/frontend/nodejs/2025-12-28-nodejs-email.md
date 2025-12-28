---
layout: post
title: "Node.js 이메일 전송 - Nodemailer"
date: 2025-12-28
categories: [frontend, nodejs]
tags: [nodejs, email, nodemailer]
---

Node.js에서 Nodemailer를 사용하여 이메일을 전송하는 방법을 알아봅니다.

## 설치

```bash
npm install nodemailer
```

## 사용법

```javascript
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com',
        pass: 'your-password'
    }
});

var mailOptions = {
    from: 'your-email@gmail.com',
    to: 'recipient1@example.com, recipient2@example.com',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
    // 또는 HTML 형식
    // html: '<h1>Welcome</h1><p>That was easy!</p>'
};

transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response);
    }
});
```

## 주요 옵션

- `text`: 일반 텍스트 내용 (text와 html 중 하나만 사용)
- `html`: HTML 형식의 내용
- `to`: 여러 수신자는 쉼표로 구분
