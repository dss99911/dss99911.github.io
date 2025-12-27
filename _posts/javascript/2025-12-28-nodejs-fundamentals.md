---
layout: post
title: "Node.js Fundamentals - Server-Side JavaScript"
date: 2025-12-28 12:08:00 +0900
categories: nodejs
tags: [nodejs, javascript, server, backend]
description: "Complete guide to Node.js fundamentals including modules, HTTP server, file system, and NPM package management"
---

Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine, enabling JavaScript to run on the server side.

## Getting Started

### Running Node.js

```bash
node test.js
```

### Console Output

```javascript
console.log('Hello, Node.js!');
console.log("Server running at http://%s:%s", host, port);
```

### Command Line Arguments

```javascript
process.argv.forEach((val, index) => {
    console.log(`${index}: ${val}`);
});

// Output:
// 0: /usr/local/bin/node
// 1: /path/to/script.js
// 2: arg1
```

### Exiting

```javascript
process.exit(0);  // Exit with success code
process.exit(1);  // Exit with error code
```

## NPM (Node Package Manager)

### Installing Packages

```bash
npm install upper-case           # Install package
npm install upper-case --save    # Install and add to dependencies
npm install                      # Install all dependencies from package.json
npm start                        # Run start script
npm help install                 # Get help
```

### Using Packages

```javascript
var uc = require('upper-case');
```

### package.json

```json
{
  "name": "myproject",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "start": "node ./bin/www"
  },
  "dependencies": {
    "body-parser": "~1.18.2",
    "express": "~4.15.5"
  }
}
```

## Modules

### Creating a Module

```javascript
// myfirstmodule.js
exports.myDateTime = function() {
    return new Date();
};
```

### Using a Module

```javascript
var dt = require('./myfirstmodule');
console.log(dt.myDateTime());
```

> **Note:** Only `exports` properties are accessible from other files. This differs from `<script src>` which shares all global variables.

## HTTP Module

### Creating a Server

```javascript
var http = require('http');

http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write("Hello World!");
    res.end();
}).listen(8080);
```

### Request Object

```javascript
req.url  // URL path after domain
```

## URL Module

```javascript
var url = require('url');

var adr = 'http://localhost:8080/default.htm?year=2017&month=february';
var q = url.parse(adr, true);

console.log(q.host);       // 'localhost:8080'
console.log(q.pathname);   // '/default.htm'
console.log(q.search);     // '?year=2017&month=february'
console.log(q.query.month); // 'february'
```

## File System Module

### Reading Files

```javascript
var fs = require('fs');

fs.readFile('myfile.html', function(err, data) {
    if (err) throw err;
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    res.end();
});
```

### Writing Files

```javascript
// Append to file
fs.appendFile('newfile.txt', 'Hello content!', function(err) {
    if (err) throw err;
    console.log('Saved!');
});

// Write/overwrite file
fs.writeFile('newfile.txt', 'Hello content!', function(err) {
    if (err) throw err;
    console.log('Saved!');
});
```

### Other Operations

```javascript
// Delete file
fs.unlink('file.txt', function(err) {
    if (err) throw err;
    console.log('File deleted!');
});

// Rename file
fs.rename('oldname.txt', 'newname.txt', function(err) {
    if (err) throw err;
    console.log('File Renamed!');
});

// Open file
fs.open('file.txt', 'w', function(err, file) {
    if (err) throw err;
    console.log('Saved!');
});
```

## Events

Node.js uses an event-driven architecture:

```javascript
var events = require('events');
var eventEmitter = new events.EventEmitter();

// Create event handler
var myEventHandler = function() {
    console.log('I hear a scream!');
};

// Assign handler to event
eventEmitter.on('scream', myEventHandler);

// Fire the event
eventEmitter.emit('scream');
```

## Express Framework

Express simplifies routing and request handling.

### Basic Setup

```javascript
var express = require('express');
var app = express();

app.get('/', function(req, res) {
    res.send('Hello World');
});

app.get('/about', function(req, res) {
    res.sendFile(__dirname + "/about.htm");
});

var server = app.listen(8081, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log("App listening at http://%s:%s", host, port);
});
```

### Query Parameters

```javascript
// URL: http://localhost:3000/?query=test
router.get('/', function(req, res, next) {
    var query = req.query['query'];
});
```

### Static Files

```javascript
app.use(express.static('public'));
// public/images/logo.png -> localhost:8080/images/logo.png
```

### POST Handling

```javascript
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.post('/result', urlencodedParser, function(req, res) {
    console.log(req.body);  // Form data
});
```

### File Upload

```javascript
var multer = require('multer');
app.use(multer({ dest: '/tmp/' }));

app.post('/file_upload', function(req, res) {
    console.log(req.files.file.name);
    console.log(req.files.file.path);
    console.log(req.files.file.type);
});
```

## Router

Separate routes into different files:

### Main App

```javascript
var index = require('./routes/index');
var users = require('./routes/users');

app.use('/', index);
app.use('/users', users);
```

### Route File (index.js)

```javascript
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

module.exports = router;
```

## Cookie Handling

```javascript
var cookieParser = require('cookie-parser');
app.use(cookieParser());

app.get('/', function(req, res) {
    console.log("Cookies: ", req.cookies);
});
```

## Template Engines

Popular template engines: Pug (Jade), Mustache, EJS

### EJS Setup

```javascript
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
```

## Email Sending

```javascript
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your.email@gmail.com',
        pass: 'yourpassword'
    }
});

var mailOptions = {
    from: 'your.email@gmail.com',
    to: 'recipient@example.com',
    subject: 'Test Email',
    text: 'Plain text body',
    // OR html: '<h1>HTML body</h1>'
};

transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response);
    }
});
```

## File Upload with Formidable

```javascript
var formidable = require('formidable');
var fs = require('fs');

http.createServer(function(req, res) {
    if (req.url == '/fileupload') {
        var form = new formidable.IncomingForm();
        form.parse(req, function(err, fields, files) {
            var oldpath = files.filetoupload.path;
            var newpath = '/uploads/' + files.filetoupload.name;
            fs.rename(oldpath, newpath, function(err) {
                if (err) throw err;
                res.write('File uploaded!');
                res.end();
            });
        });
    }
}).listen(8080);
```

## Grunt - Task Runner

```bash
npm install grunt
```

Grunt automates repetitive tasks like minification, compilation, and testing.

---

Node.js enables full-stack JavaScript development, allowing developers to use the same language on both client and server sides.
