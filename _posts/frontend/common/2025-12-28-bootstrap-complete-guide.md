---
layout: post
title: "Bootstrap Complete Guide"
date: 2025-12-28 12:00:00 +0900
categories: [frontend, common]
tags: [bootstrap, css, responsive, frontend]
description: "Bootstrap framework complete guide with components, layout, forms, and utilities"
image: /assets/images/posts/thumbnails/2025-12-28-bootstrap-complete-guide.png
---

## Basic Setup

Add the following to your HTML document:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Bootstrap Example</title>
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

## Container and Layout

### Container
`.container` - Adds left/right margins

### Grid System
Reference: [W3Schools Bootstrap Grid System](https://www.w3schools.com/bootstrap/bootstrap_grid_system.asp)

## Typography and Text

### Text Alignment
- `.text-left`
- `.text-center`
- `.text-right`
- `.text-justify`

### Text Format
- `.text-lowercase`
- `.text-uppercase`
- `.text-capitalize`

### Text Size
- `.small`

### Contextual Colors
Text colors:
- `.text-muted`
- `.text-primary`
- `.text-success`
- `.text-info`
- `.text-warning`
- `.text-danger`

Background colors:
- `.bg-primary`
- `.bg-success`
- `.bg-info`
- `.bg-warning`
- `.bg-danger`

## Buttons

### Button Styles
```html
<button type="button" class="btn">Basic</button>
<button type="button" class="btn btn-default">Default</button>
<button type="button" class="btn btn-primary">Primary</button>
<button type="button" class="btn btn-success">Success</button>
<button type="button" class="btn btn-info">Info</button>
<button type="button" class="btn btn-warning">Warning</button>
<button type="button" class="btn btn-danger">Danger</button>
<button type="button" class="btn btn-link">Link</button>
```

### Button Sizes
- `.btn-lg` - Large
- `.btn-md` - Medium
- `.btn-sm` - Small
- `.btn-xs` - Extra small

### Full Width Button
```html
<button type="button" class="btn btn-primary btn-block">Full Width Button</button>
```

### Button States
```html
<button type="button" class="btn btn-primary active">Active</button>
<button type="button" class="btn btn-primary disabled">Disabled</button>
```

### Button Groups
```html
<div class="btn-group">
  <button type="button" class="btn btn-primary">Apple</button>
  <button type="button" class="btn btn-primary">Samsung</button>
  <button type="button" class="btn btn-primary">Sony</button>
</div>
```

Size variations: `.btn-group-lg`, `.btn-group-sm`, `.btn-group-xs`

Layout options:
- `.btn-group-vertical` - Vertical buttons
- `.btn-group-justified` - Full width distributed

### Dropdown Button
```html
<div class="dropdown">
  <button class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">
    Dropdown Example <span class="caret"></span>
  </button>
  <ul class="dropdown-menu">
    <li class="dropdown-header">Header 1</li>
    <li class="active"><a href="#">HTML</a></li>
    <li class="disabled"><a href="#">CSS</a></li>
    <li><a href="#">JavaScript</a></li>
    <li class="divider"></li>
    <li class="dropdown-header">Header 2</li>
    <li><a href="#">About Us</a></li>
  </ul>
</div>
```

### Split Dropdown Button
```html
<div class="btn-group">
  <button type="button" class="btn btn-primary">Sony</button>
  <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown">
    <span class="caret"></span>
  </button>
  <ul class="dropdown-menu" role="menu">
    <li><a href="#">Tablet</a></li>
    <li><a href="#">Smartphone</a></li>
  </ul>
</div>
```

## Tables

### Table Classes
- `.table` - Basic horizontal lines
- `.table-striped` - Striped rows
- `.table-bordered` - Bordered cells
- `.table-hover` - Hover effect on rows
- `.table-condensed` - Reduced padding
- `.table-responsive` - Horizontal scroll

### Contextual Classes for Rows
- `.active`
- `.success`
- `.info`
- `.warning`
- `.danger`

```html
<table class="table table-striped">
  <thead>
    <tr>
      <th>Name</th>
      <th>Email</th>
    </tr>
  </thead>
  <tbody>
    <tr class="success">
      <td>John</td>
      <td>john@example.com</td>
    </tr>
    <tr class="danger">
      <td>Mary</td>
      <td>mary@example.com</td>
    </tr>
  </tbody>
</table>
```

## Images

### Image Classes
- `.img-rounded` - Rounded corners
- `.img-circle` - Circle shape
- `.img-thumbnail` - Thumbnail border
- `.img-responsive` - Responsive sizing

```html
<img src="photo.jpg" class="img-responsive img-rounded" alt="Photo">
```

### Thumbnail Gallery
```html
<div class="thumbnail">
  <a href="/images/nature.jpg">
    <img src="/images/nature.jpg" alt="Nature" style="width:100%">
    <div class="caption">
      <p>Description text here</p>
    </div>
  </a>
</div>
```

## Alerts

### Alert Types
```html
<div class="alert alert-success">
  <strong>Success!</strong> Indicates a successful action.
</div>
<div class="alert alert-info">
  <strong>Info!</strong> Indicates informative change.
</div>
<div class="alert alert-warning">
  <strong>Warning!</strong> Indicates a warning.
</div>
<div class="alert alert-danger">
  <strong>Danger!</strong> Indicates a dangerous action.
</div>
```

### Dismissible Alert
```html
<div class="alert alert-success alert-dismissable fade in">
  <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
  <strong>Success!</strong> Message here.
</div>
```

## Badges and Labels

### Badge
```html
<a href="#">News <span class="badge">5</span></a>
<button type="button" class="btn btn-primary">
  Primary <span class="badge">7</span>
</button>
```

### Labels
```html
<span class="label label-default">Default</span>
<span class="label label-primary">Primary</span>
<span class="label label-success">Success</span>
<span class="label label-info">Info</span>
<span class="label label-warning">Warning</span>
<span class="label label-danger">Danger</span>
```

## Progress Bars

### Basic Progress Bar
```html
<div class="progress">
  <div class="progress-bar" role="progressbar" aria-valuenow="70"
       aria-valuemin="0" aria-valuemax="100" style="width:70%">
    70%
  </div>
</div>
```

### Colors
- `.progress-bar-success`
- `.progress-bar-info`
- `.progress-bar-warning`
- `.progress-bar-danger`

### Striped and Animated
```html
<div class="progress">
  <div class="progress-bar progress-bar-success progress-bar-striped active"
       role="progressbar" style="width:40%">
    40%
  </div>
</div>
```

### Stacked Progress Bar
```html
<div class="progress">
  <div class="progress-bar progress-bar-success" style="width:40%">Free</div>
  <div class="progress-bar progress-bar-warning" style="width:10%">Warning</div>
  <div class="progress-bar progress-bar-danger" style="width:20%">Danger</div>
</div>
```

## Lists and Panels

### Unstyled List
```html
<ul class="list-unstyled">
  <li>Item 1</li>
  <li>Item 2</li>
</ul>
```

### Inline List
```html
<ul class="list-inline">
  <li>Coffee</li>
  <li>Tea</li>
  <li>Milk</li>
</ul>
```

### List Group with Badges
```html
<ul class="list-group">
  <li class="list-group-item">New <span class="badge">12</span></li>
  <li class="list-group-item">Deleted <span class="badge">5</span></li>
</ul>
```

### List Group with Links
```html
<div class="list-group">
  <a href="#" class="list-group-item active">First item</a>
  <a href="#" class="list-group-item disabled">Second item</a>
  <a href="#" class="list-group-item">Third item</a>
</div>
```

### Contextual List Items
- `.list-group-item-success`
- `.list-group-item-info`
- `.list-group-item-warning`
- `.list-group-item-danger`

### Panel
```html
<div class="panel panel-default">
  <div class="panel-heading">Panel Heading</div>
  <div class="panel-body">Panel Content</div>
  <div class="panel-footer">Panel Footer</div>
</div>
```

Panel colors: `.panel-default`, `.panel-primary`, `.panel-success`, `.panel-info`, `.panel-warning`, `.panel-danger`

### Panel Group
```html
<div class="panel-group">
  <div class="panel panel-default">
    <div class="panel-body">Panel Content</div>
  </div>
  <div class="panel panel-default">
    <div class="panel-body">Panel Content</div>
  </div>
</div>
```

## Navigation

### Navigation Bar
Reference: [W3Schools Bootstrap Navbar](https://www.w3schools.com/bootstrap/bootstrap_navbar.asp)

### Tab Menu
```html
<ul class="nav nav-tabs">
  <li class="active"><a href="#">Home</a></li>
  <li><a href="#">Menu 1</a></li>
  <li><a href="#">Menu 2</a></li>
</ul>
```

### Pills (Pill-shaped menu)
Reference: [W3Schools Bootstrap Tabs Pills](https://www.w3schools.com/bootstrap/bootstrap_tabs_pills.asp)

## Pagination

### Basic Pagination
```html
<ul class="pagination">
  <li><a href="#">1</a></li>
  <li class="active"><a href="#">2</a></li>
  <li><a href="#">3</a></li>
  <li class="disabled"><a href="#">4</a></li>
</ul>
```

Sizes: `.pagination-lg`, `.pagination-sm`

### Pager
```html
<ul class="pager">
  <li class="previous"><a href="#">Previous</a></li>
  <li class="next"><a href="#">Next</a></li>
</ul>
```

### Breadcrumbs
```html
<ul class="breadcrumb">
  <li><a href="#">Home</a></li>
  <li><a href="#">Private</a></li>
  <li class="active">Pictures</li>
</ul>
```

## Jumbotron and Well

### Jumbotron
```html
<div class="container">
  <div class="jumbotron">
    <h1>Bootstrap Tutorial</h1>
    <p>Welcome message here</p>
  </div>
</div>
```

### Well
```html
<div class="well">Basic Well</div>
<div class="well well-sm">Small Well</div>
<div class="well well-lg">Large Well</div>
```

## Page Header
```html
<div class="container">
  <div class="page-header">
    <h1>Example Page Header</h1>
  </div>
  <p>Content here</p>
</div>
```

## Glyphicons

```html
<!-- Icon -->
<span class="glyphicon glyphicon-envelope"></span>

<!-- Link with icon -->
<a href="#"><span class="glyphicon glyphicon-envelope"></span></a>

<!-- Button with icon -->
<button type="button" class="btn btn-default">
  <span class="glyphicon glyphicon-search"></span> Search
</button>
```

Common icons: `glyphicon-envelope`, `glyphicon-search`, `glyphicon-print`

## Collapse

### Basic Collapse
```html
<button data-toggle="collapse" data-target="#demo">Collapsible</button>
<div id="demo" class="collapse">
  Content here...
</div>
```

### Default Expanded
```html
<div id="demo" class="collapse in">
  Expanded by default
</div>
```

### Collapsible Panel
```html
<div class="panel-group">
  <div class="panel panel-default">
    <div class="panel-heading">
      <h4 class="panel-title">
        <a data-toggle="collapse" href="#collapse1">Collapsible panel</a>
      </h4>
    </div>
    <div id="collapse1" class="panel-collapse collapse">
      <div class="panel-body">Panel Body</div>
    </div>
  </div>
</div>
```

### JavaScript Control
```javascript
$(window.location.hash).collapse('show');
$(window.location.hash).collapse('hide');
```

## Scrollspy

Active navigation item changes based on scroll position. Clicking navigation items scrolls to that section.

Reference: [W3Schools Bootstrap Scrollspy](https://www.w3schools.com/bootstrap/bootstrap_scrollspy.asp)

## Affix

Fix header position during scroll.

## Carousel (Slide)

Image slideshow component.

Reference: [W3Schools Bootstrap Carousel](https://www.w3schools.com/bootstrap/bootstrap_carousel.asp)

## Modal (Popup)

Reference:
- [W3Schools Bootstrap Modal](https://www.w3schools.com/bootstrap/bootstrap_modal.asp)
- [W3Schools Bootstrap Modal Reference](https://www.w3schools.com/bootstrap/bootstrap_ref_js_modal.asp)

## Tooltip

Small popup labels.

Reference: [W3Schools Bootstrap Tooltip](https://www.w3schools.com/bootstrap/bootstrap_tooltip.asp)

## Responsive Video

```html
<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/XGSy3_Czz8k"></iframe>
</div>
```

Aspect ratios:
- `.embed-responsive-16by9`
- `.embed-responsive-4by3`

## Scrollable Pre

```html
<pre class="pre-scrollable">
  Long preformatted text...
</pre>
```

## Forms

Reference:
- [W3Schools Bootstrap Forms](https://www.w3schools.com/bootstrap/bootstrap_forms.asp)
- [W3Schools Bootstrap Form Inputs](https://www.w3schools.com/bootstrap/bootstrap_forms_inputs.asp)
- [W3Schools Bootstrap Form Inputs Advanced](https://www.w3schools.com/bootstrap/bootstrap_forms_inputs2.asp)
- [W3Schools Bootstrap Form Sizing](https://www.w3schools.com/bootstrap/bootstrap_forms_sizing.asp)

## Media Objects

For aligning images, videos with text.

Reference: [W3Schools Bootstrap Media Objects](https://www.w3schools.com/bootstrap/bootstrap_media_objects.asp)

## Date Picker

Libraries:
- bootstrap-datetimepicker-master
- [Eonasdan Bootstrap DateTimePicker](http://eonasdan.github.io/bootstrap-datetimepicker/)

## Resources

- [W3Schools Bootstrap Typography](https://www.w3schools.com/bootstrap/bootstrap_typography.asp)
- [W3Schools Bootstrap Templates](https://www.w3schools.com/bootstrap/bootstrap_templates.asp)
