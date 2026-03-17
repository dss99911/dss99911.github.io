---
layout: post
title: "Node.js 이메일 전송 - Nodemailer"
date: 2025-12-28
categories: [frontend, nodejs]
tags: [nodejs, email, nodemailer]
image: /assets/images/posts/thumbnails/2025-12-28-nodejs-email.png
redirect_from:
  - "/frontend/nodejs/2025/12/28/nodejs-email.html"
---

Node.js에서 Nodemailer를 사용하여 이메일을 전송하는 방법을 알아봅니다. Nodemailer는 Node.js 환경에서 가장 널리 사용되는 이메일 전송 라이브러리로, 간단한 텍스트 메일부터 HTML 템플릿, 첨부파일까지 다양한 형태의 이메일을 손쉽게 보낼 수 있습니다.

## 설치

```bash
npm install nodemailer
```

## 기본 사용법

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
- `cc`: 참조 수신자
- `bcc`: 숨은 참조 수신자
- `replyTo`: 답장 받을 주소 지정

## Gmail 앱 비밀번호 사용하기

Gmail을 사용할 때는 일반 비밀번호 대신 **앱 비밀번호(App Password)**를 사용해야 합니다. Google 계정에서 2단계 인증을 활성화한 후, 앱 비밀번호를 생성하여 사용합니다.

```javascript
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com',
        pass: 'your-app-password'  // 앱 비밀번호 사용
    }
});
```

보안을 위해 비밀번호는 환경 변수로 관리하는 것이 좋습니다:

```javascript
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
```

## SMTP 직접 설정

Gmail 외에 다른 SMTP 서버를 사용하려면 직접 설정할 수 있습니다:

```javascript
var transporter = nodemailer.createTransport({
    host: 'smtp.example.com',
    port: 587,
    secure: false,  // true for 465, false for other ports
    auth: {
        user: 'your-email@example.com',
        pass: 'your-password'
    }
});
```

`secure` 옵션은 포트 465를 사용할 때 `true`로, 587 포트를 사용할 때는 `false`로 설정합니다. 587 포트에서는 STARTTLS를 통해 암호화가 적용됩니다.

## HTML 이메일 보내기

HTML 형식으로 이메일을 보내면 스타일이 적용된 풍부한 내용의 메일을 전달할 수 있습니다:

```javascript
var mailOptions = {
    from: '"My App" <your-email@gmail.com>',
    to: 'recipient@example.com',
    subject: '가입을 환영합니다!',
    html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h1 style="color: #333;">환영합니다!</h1>
            <p>저희 서비스에 가입해 주셔서 감사합니다.</p>
            <a href="https://example.com/verify"
               style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none;">
               이메일 인증하기
            </a>
        </div>
    `
};
```

## 파일 첨부

이메일에 파일을 첨부하려면 `attachments` 옵션을 사용합니다:

```javascript
var mailOptions = {
    from: 'your-email@gmail.com',
    to: 'recipient@example.com',
    subject: '첨부파일 포함 이메일',
    text: '첨부파일을 확인해 주세요.',
    attachments: [
        {
            filename: 'report.pdf',
            path: './documents/report.pdf'
        },
        {
            filename: 'image.png',
            content: imageBuffer  // Buffer 객체도 가능
        }
    ]
};
```

## async/await 패턴 사용

콜백 대신 Promise 기반의 async/await 패턴을 사용하면 코드가 더 깔끔해집니다:

```javascript
const nodemailer = require('nodemailer');

async function sendEmail() {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: 'recipient@example.com',
            subject: '테스트 이메일',
            html: '<p>async/await로 보낸 이메일입니다.</p>'
        });
        console.log('Email sent:', info.messageId);
    } catch (error) {
        console.error('Email error:', error);
    }
}
```

## 자주 발생하는 문제와 해결 방법

### 인증 실패
Gmail에서 "Less secure app access" 관련 에러가 나면 앱 비밀번호를 사용해야 합니다. Google은 2022년부터 기본 비밀번호를 통한 서드파티 앱 접근을 차단하고 있습니다.

### 전송 제한
Gmail은 하루에 약 500통(일반 계정) 또는 2,000통(Google Workspace)의 전송 제한이 있습니다. 대량 발송이 필요한 경우 SendGrid, Mailgun, AWS SES 같은 전문 이메일 서비스를 고려하세요.

### 스팸 분류 방지
발신자 정보를 정확히 설정하고, SPF/DKIM 레코드를 구성하면 이메일이 스팸으로 분류되는 것을 줄일 수 있습니다.
