---
layout: post
title: "Bootstrap Complete Guide - Responsive Web Design"
date: 2025-12-28 12:10:00 +0900
categories: [frontend, javascript]
tags: [bootstrap, css, responsive, frontend]
description: "Comprehensive Bootstrap guide covering layout, components, utilities, and responsive design patterns"
---

Bootstrap is the most popular HTML, CSS, and JavaScript framework for developing responsive, mobile-first websites.

## Getting Started

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
</head>
<body>
</body>
</html>
```

## Layout

### Container

```html
<div class="container">
    <!-- Fixed-width container with responsive breakpoints -->
</div>

<div class="container-fluid">
    <!-- Full-width container -->
</div>
```

### Grid System

Bootstrap uses a 12-column grid system. [Learn more](https://www.w3schools.com/bootstrap/bootstrap_grid_system.asp)

## Typography

### Text Colors (Contextual)

```html
<p class="text-muted">Muted text</p>
<p class="text-primary">Important text</p>
<p class="text-success">Success text</p>
<p class="text-info">Information text</p>
<p class="text-warning">Warning text</p>
<p class="text-danger">Danger text</p>
```

### Background Colors

```html
<p class="bg-primary">Primary background</p>
<p class="bg-success">Success background</p>
<p class="bg-info">Info background</p>
<p class="bg-warning">Warning background</p>
<p class="bg-danger">Danger background</p>
```

### Text Alignment

```html
<p class="text-left">Left aligned</p>
<p class="text-center">Center aligned</p>
<p class="text-right">Right aligned</p>
<p class="text-justify">Justified text</p>
```

### Text Transform

```html
<p class="text-lowercase">LOWERCASED TEXT</p>
<p class="text-uppercase">uppercased text</p>
<p class="text-capitalize">capitalized text</p>
```

### Text Size

```html
<span class="small">Smaller text</span>
```

## Buttons

### Button Styles

```html
<button class="btn btn-default">Default</button>
<button class="btn btn-primary">Primary</button>
<button class="btn btn-success">Success</button>
<button class="btn btn-info">Info</button>
<button class="btn btn-warning">Warning</button>
<button class="btn btn-danger">Danger</button>
<button class="btn btn-link">Link</button>
```

### Button Sizes

```html
<button class="btn btn-primary btn-lg">Large</button>
<button class="btn btn-primary btn-md">Medium</button>
<button class="btn btn-primary btn-sm">Small</button>
<button class="btn btn-primary btn-xs">Extra Small</button>
```

### Block Button

```html
<button class="btn btn-primary btn-block">Full Width Button</button>
```

### Button States

```html
<button class="btn btn-primary active">Active</button>
<button class="btn btn-primary disabled">Disabled</button>
```

### Button Groups

```html
<div class="btn-group">
    <button class="btn btn-primary">Apple</button>
    <button class="btn btn-primary">Samsung</button>
    <button class="btn btn-primary">Sony</button>
</div>

<!-- Vertical group -->
<div class="btn-group-vertical">...</div>

<!-- Justified (full width) -->
<div class="btn-group btn-group-justified">...</div>
```

### Dropdown Button

```html
<div class="dropdown">
    <button class="btn btn-primary dropdown-toggle" data-toggle="dropdown">
        Dropdown <span class="caret"></span>
    </button>
    <ul class="dropdown-menu">
        <li class="dropdown-header">Header</li>
        <li><a href="#">Option 1</a></li>
        <li class="divider"></li>
        <li class="active"><a href="#">Option 2</a></li>
        <li class="disabled"><a href="#">Disabled</a></li>
    </ul>
</div>
```

## Tables

```html
<table class="table">...</table>
<table class="table table-striped">...</table>
<table class="table table-bordered">...</table>
<table class="table table-hover">...</table>
<table class="table table-condensed">...</table>
```

### Contextual Classes

```html
<tr class="success">...</tr>
<tr class="danger">...</tr>
<tr class="info">...</tr>
<tr class="warning">...</tr>
<tr class="active">...</tr>
```

### Responsive Table

```html
<div class="table-responsive">
    <table class="table">...</table>
</div>
```

## Images

```html
<img src="..." class="img-rounded" alt="">
<img src="..." class="img-circle" alt="">
<img src="..." class="img-thumbnail" alt="">
<img src="..." class="img-responsive" alt=""> <!-- Responsive sizing -->
```

### Thumbnail Gallery

```html
<div class="thumbnail">
    <a href="#">
        <img src="..." alt="" style="width:100%">
        <div class="caption">
            <p>Caption text</p>
        </div>
    </a>
</div>
```

## Alerts

```html
<div class="alert alert-success">Success message</div>
<div class="alert alert-info">Info message</div>
<div class="alert alert-warning">Warning message</div>
<div class="alert alert-danger">Danger message</div>

<!-- Dismissible alert -->
<div class="alert alert-success alert-dismissable">
    <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
    Success!
</div>

<!-- With animation -->
<div class="alert alert-danger alert-dismissable fade in">...</div>
```

## Badges and Labels

```html
<a href="#">News <span class="badge">5</span></a>
<button class="btn btn-primary">Messages <span class="badge">7</span></button>

<span class="label label-default">Default</span>
<span class="label label-primary">Primary</span>
<span class="label label-success">Success</span>
<span class="label label-info">Info</span>
<span class="label label-warning">Warning</span>
<span class="label label-danger">Danger</span>
```

## Progress Bars

```html
<div class="progress">
    <div class="progress-bar" style="width:70%">70%</div>
</div>

<!-- Colored -->
<div class="progress">
    <div class="progress-bar progress-bar-success" style="width:40%">40%</div>
</div>

<!-- Striped -->
<div class="progress">
    <div class="progress-bar progress-bar-striped" style="width:40%">40%</div>
</div>

<!-- Animated -->
<div class="progress">
    <div class="progress-bar progress-bar-striped active" style="width:40%">40%</div>
</div>
```

## Lists and Panels

### Lists

```html
<ul class="list-unstyled">...</ul>
<ul class="list-inline">...</ul>  <!-- Horizontal list -->

<!-- List group -->
<ul class="list-group">
    <li class="list-group-item">Item <span class="badge">12</span></li>
    <li class="list-group-item list-group-item-success">Success</li>
</ul>

<!-- Linked list group -->
<div class="list-group">
    <a href="#" class="list-group-item active">Active</a>
    <a href="#" class="list-group-item disabled">Disabled</a>
</div>
```

### Panels

```html
<div class="panel panel-default">
    <div class="panel-heading">Panel Heading</div>
    <div class="panel-body">Panel Content</div>
    <div class="panel-footer">Panel Footer</div>
</div>

<!-- Panel colors -->
<div class="panel panel-primary">...</div>
<div class="panel panel-success">...</div>
<div class="panel panel-info">...</div>
<div class="panel panel-warning">...</div>
<div class="panel panel-danger">...</div>
```

## Navigation

### Tabs

```html
<ul class="nav nav-tabs">
    <li class="active"><a href="#">Home</a></li>
    <li><a href="#">Menu 1</a></li>
    <li><a href="#">Menu 2</a></li>
</ul>
```

### Pills

```html
<ul class="nav nav-pills">
    <li class="active"><a href="#">Home</a></li>
    <li><a href="#">Menu 1</a></li>
</ul>
```

### Pagination

```html
<ul class="pagination">
    <li><a href="#">1</a></li>
    <li class="active"><a href="#">2</a></li>
    <li class="disabled"><a href="#">3</a></li>
</ul>

<!-- Pager -->
<ul class="pager">
    <li class="previous"><a href="#">Previous</a></li>
    <li class="next"><a href="#">Next</a></li>
</ul>

<!-- Breadcrumbs -->
<ul class="breadcrumb">
    <li><a href="#">Home</a></li>
    <li><a href="#">Products</a></li>
    <li class="active">Details</li>
</ul>
```

## Components

### Jumbotron

```html
<div class="jumbotron">
    <h1>Welcome!</h1>
    <p>This is a jumbotron.</p>
</div>
```

### Well

```html
<div class="well">Basic Well</div>
<div class="well well-sm">Small Well</div>
<div class="well well-lg">Large Well</div>
```

### Page Header

```html
<div class="page-header">
    <h1>Page Title</h1>
</div>
```

### Glyphicons

```html
<span class="glyphicon glyphicon-envelope"></span>
<span class="glyphicon glyphicon-search"></span>
<span class="glyphicon glyphicon-print"></span>

<button class="btn btn-default">
    <span class="glyphicon glyphicon-search"></span> Search
</button>
```

## Collapse

```html
<button data-toggle="collapse" data-target="#demo">Toggle</button>
<div id="demo" class="collapse">
    Hidden content here...
</div>

<!-- Show by default -->
<div id="demo" class="collapse in">...</div>

<!-- Via JavaScript -->
$(window.location.hash).collapse('show');
$(window.location.hash).collapse('hide');
```

### Accordion

Multiple collapsible panels where opening one closes others.

## Modal

```html
<!-- Trigger button -->
<button data-toggle="modal" data-target="#myModal">Open Modal</button>

<!-- Modal -->
<div id="myModal" class="modal fade">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                <h4 class="modal-title">Modal Title</h4>
            </div>
            <div class="modal-body">
                <p>Modal content...</p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-default" data-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>
```

## Carousel

Image slideshow component. [Learn more](https://www.w3schools.com/bootstrap/bootstrap_carousel.asp)

## Scrollspy

Automatically update navigation based on scroll position. [Learn more](https://www.w3schools.com/bootstrap/bootstrap_scrollspy.asp)

## Video Embed

```html
<div class="embed-responsive embed-responsive-16by9">
    <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/..."></iframe>
</div>

<div class="embed-responsive embed-responsive-4by3">
    <iframe class="embed-responsive-item" src="..."></iframe>
</div>
```

## Scrollable Content

```html
<pre class="pre-scrollable">
Long content that will scroll...
</pre>
```

## Utilities

### Margin

```html
<div class="container">...</div>  <!-- Adds left/right margin -->
```

### Form Inputs

[Forms Reference](https://www.w3schools.com/bootstrap/bootstrap_forms.asp)

[Form Inputs](https://www.w3schools.com/bootstrap/bootstrap_forms_inputs.asp)

[Input Sizing](https://www.w3schools.com/bootstrap/bootstrap_forms_sizing.asp)

---

Bootstrap provides a comprehensive set of CSS and JavaScript components for building responsive websites quickly. Its grid system and pre-built components make it easy to create professional-looking web applications.
