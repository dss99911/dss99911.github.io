---
layout: post
title: "AngularJS Complete Guide - Building Dynamic Web Applications"
date: 2025-12-28 12:07:00 +0900
categories: javascript
tags: [javascript, angularjs, mvc, frontend]
description: "Complete guide to AngularJS covering directives, controllers, services, forms, routing, and application architecture"
---

AngularJS is a structural framework for dynamic web apps that extends HTML with custom attributes and elements.

## Getting Started

### Including AngularJS

```html
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular.min.js"></script>
```

### Basic Structure

```html
<div ng-app="myApp" ng-controller="myCtrl">
    {{ expression }}
</div>

<script>
var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope) {
    // Controller logic
});
</script>
```

### Expression Syntax

Use double curly braces for expressions:

```html
{{ expression }}

<!-- In attributes -->
<input style="background-color:{{myCol}}" ng-model="myCol" value="{{myCol}}">
```

## Directives

Directives are special attributes that extend HTML behavior.

### Core Directives

| Directive | Description |
|-----------|-------------|
| `ng-app` | Defines the application owner |
| `ng-show/ng-hide` | Show/hide based on expression |
| `ng-if` | Conditionally render element |
| `ng-disabled` | Disable element when true |
| `ng-model` | Bind input to variable |
| `ng-bind` | Bind text content |
| `ng-init` | Initialize values |
| `ng-repeat` | Repeat element for each item |
| `ng-options` | Generate select options |
| `ng-switch` | Switch between views |
| `ng-bind-html` | Bind HTML content |
| `ng-href` | Dynamic href attribute |
| `ng-attr-id` | Dynamic id attribute |

### ng-repeat

```html
<li ng-repeat="x in names">{{ x }}</li>

<!-- With index -->
<li ng-repeat="x in names">{{ $index }}: {{ x }}</li>

<!-- Odd/even styling -->
<tr ng-repeat="x in names" ng-class-odd="'odd'" ng-class-even="'even'">

<!-- Map iteration -->
<li ng-repeat="(key, value) in map">{{ key }}: {{ value }}</li>
```

#### Two Rows per Repeat

```html
<tr ng-repeat-start="item in items">
    <td>{{ item.name }}</td>
</tr>
<tr ng-repeat-end>
    <td>Additional info</td>
</tr>
```

### ng-options

```html
<!-- Simple array -->
<select ng-model="selected" ng-options="x for x in names"></select>

<!-- Object with display value -->
<select ng-model="selected" ng-options="t.value as t.label for t in options"></select>

<!-- Object keys and values -->
<select ng-model="selected" ng-options="x as y for (x, y) in cars"></select>
```

### ng-switch

```html
<div ng-switch="myVar">
    <div ng-switch-when="dogs">
        <h1>Dogs</h1>
    </div>
    <div ng-switch-when="cats">
        <h1>Cats</h1>
    </div>
</div>
```

### Event Directives

- `ng-blur`, `ng-change`, `ng-click`, `ng-copy`, `ng-cut`
- `ng-dblclick`, `ng-focus`, `ng-keydown`, `ng-keypress`, `ng-keyup`
- `ng-mousedown`, `ng-mouseenter`, `ng-mouseleave`, `ng-mousemove`
- `ng-mouseover`, `ng-mouseup`, `ng-paste`

```html
<button ng-click="handleClick($event)">Click me</button>

<!-- Access event object -->
<script>
$scope.handleClick = function($event) {
    console.log($event.clientX, $event.clientY);
};
</script>
```

## Custom Directives

```javascript
var app = angular.module("myApp", []);

app.directive("myDirective", function() {
    return {
        restrict: "EA",  // E=Element, A=Attribute, C=Class, M=Comment
        template: "<h1>Custom Directive Content</h1>"
    };
});
```

Usage:

```html
<!-- As element -->
<my-directive></my-directive>

<!-- As attribute -->
<div my-directive></div>

<!-- As class -->
<div class="my-directive"></div>

<!-- As comment -->
<!-- directive: my-directive -->
```

> **Note:** When naming directives, use camelCase (`myDirective`), but when invoking, use dash-separated names (`my-directive`).

## Controllers

### Basic Controller

```javascript
app.controller('myCtrl', function($scope) {
    $scope.firstName = "John";
    $scope.lastName = "Doe";
});
```

### Multiple Controllers

```html
<body ng-app="myApp">
    <p>{{color}}</p>  <!-- Shows rootScope color -->

    <div ng-controller="myCtrl">
        <p>{{color}}</p>  <!-- Shows controller scope color -->
    </div>
</body>

<script>
app.run(function($rootScope) {
    $rootScope.color = 'blue';
});

app.controller('myCtrl', function($scope) {
    $scope.color = "red";
});
</script>
```

### Separating Files

```html
<div ng-app="myApp" ng-controller="myCtrl"></div>
<script src="myApp.js"></script>
<script src="myCtrl.js"></script>
```

## Services

Services are objects that can be injected into controllers.

### Built-in Services

```javascript
app.controller('myCtrl', function($scope, $location, $http) {
    // $location - URL information
    $scope.url = $location.absUrl();

    // $http - HTTP requests
    $http.get("data.json").then(function(response) {
        $scope.data = response.data;
    });
});
```

### $scope.$watch

Watch for model changes:

```javascript
$scope.$watch('password', function() {
    $scope.validatePassword();
});
```

### $http Service

```javascript
// GET request
$http.get("welcome.htm").then(function(response) {
    $scope.myWelcome = response.data;
});

// POST request
$http({
    method: 'POST',
    url: '/api/data',
    data: { name: 'John' }
}).success(function(data) {
    $scope.result = data;
}).error(function(data) {
    alert(JSON.stringify(data));
});
```

#### Response Properties

- `.config` - Request configuration
- `.data` - Response body
- `.headers` - Header function
- `.status` - HTTP status code
- `.statusText` - Status text

## Filters

Filters transform data for display:

```html
{{ lastName | uppercase }}
{{ lastName | lowercase }}
{{ price | currency : "USD" : 2 }}
{{ items | orderBy:'name' }}
{{ items | filter:'search' }}
<p ng-bind="date | date:'MM/dd/yyyy'"></p>
```

### Custom Filter

```javascript
app.filter('myFormat', function() {
    return function(input) {
        var result = "";
        for (var i = 0; i < input.length; i++) {
            result += (i % 2 === 0) ? input[i].toUpperCase() : input[i];
        }
        return result;
    };
});
```

## Forms and Validation

### Form States

Input states: `$untouched`, `$touched`, `$pristine`, `$dirty`, `$invalid`, `$valid`

Form states: `$pristine`, `$dirty`, `$invalid`, `$valid`, `$submitted`

### CSS Classes

- `ng-empty`, `ng-not-empty`
- `ng-touched`, `ng-untouched`
- `ng-valid`, `ng-invalid`
- `ng-dirty`, `ng-pristine`
- `ng-valid-required`, `ng-invalid-required`

### Validation Example

```html
<form name="myForm">
    <input type="email" name="myEmail" ng-model="email" required>
    <span ng-show="myForm.myEmail.$error.email">Invalid email</span>
    <span ng-show="myForm.myEmail.$touched && myForm.myEmail.$invalid">
        Please enter a valid email
    </span>
</form>
```

### Custom Validation Directive

```javascript
app.directive('myValidation', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attr, ctrl) {
            ctrl.$parsers.push(function(value) {
                if (value.indexOf("e") > -1) {
                    ctrl.$setValidity('hasE', true);
                } else {
                    ctrl.$setValidity('hasE', false);
                }
                return value;
            });
        }
    };
});
```

## Routing

### Setup

```html
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular-route.js"></script>
```

```javascript
var app = angular.module("myApp", ["ngRoute"]);

app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl: "main.htm"
    })
    .when("/about", {
        templateUrl: "about.htm",
        controller: "aboutCtrl"
    })
    .otherwise({
        template: "<h1>Not Found</h1>"
    });
});
```

```html
<a href="#/">Main</a>
<a href="#/about">About</a>
<div ng-view></div>
```

## Animation

### Setup

```html
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular-animate.js"></script>
```

```javascript
var app = angular.module('myApp', ['ngAnimate']);
```

### CSS Animation

```css
div {
    transition: all linear 0.5s;
    background-color: lightblue;
    height: 100px;
}

.ng-hide {
    height: 0;
    background-color: transparent;
}
```

## Cookies

### Setup

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.6.1/angular-cookies.js"></script>
```

```javascript
var app = angular.module("app", ['ngCookies']);

app.controller("controller", function($scope, $cookies) {
    // Set cookie
    $cookies.put("username", $scope.username);

    // Get cookie
    var username = $cookies.get('username');

    // Remove cookie
    $cookies.remove('username');
});
```

## Include

```html
<div ng-include="'myFile.htm'"></div>
```

## Global API

```javascript
angular.copy($scope.master);       // Deep copy
angular.lowercase("TEXT");         // To lowercase
angular.uppercase("text");         // To uppercase
angular.isString(value);           // Check if string
angular.isNumber(value);           // Check if number
```

## Debugging

Chrome extension: [AngularJS Batarang](https://chrome.google.com/webstore/detail/angularjs-batarang/ighdmehidhipcmcojjgiloacoafjmpfk)

---

AngularJS provides a comprehensive framework for building dynamic single-page applications. While Angular (2+) has superseded AngularJS, understanding AngularJS concepts is still valuable for maintaining legacy applications.
