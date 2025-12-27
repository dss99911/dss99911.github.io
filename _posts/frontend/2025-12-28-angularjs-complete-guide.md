---
layout: post
title: "AngularJS Complete Guide"
date: 2025-12-28 12:00:00 +0900
categories: frontend
tags: [angularjs, javascript, frontend, spa]
description: "AngularJS framework complete guide including directives, services, filters, routing, forms and more"
---

## Basic Concepts

### Directive
A directive is used as an attribute of a tag to perform some processing.
- Example: `ng-model`

### Expression
Use double curly braces to add code between tags:
```html
{{ expression }}
```

### Loading AngularJS Library
```html
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular.min.js"></script>
```

### App and Controller Setup
```html
<div ng-app="myApp" ng-controller="myCtrl">
</div>

<script>
var app = angular.module('myApp', []);

app.controller('myCtrl', function($scope) {
});
</script>
```

### Using Code in Attributes
```html
<input style="background-color:{{myCol}}" ng-model="myCol" value="{{myCol}}">
```

## Directives

### Basic Directives

| Directive | Description |
|-----------|-------------|
| `ng-app` | Application owner |
| `ng-show`, `ng-hide`, `ng-if` | Show/hide elements (true/false) |
| `ng-disabled` | Disable element when true |
| `ng-model` | Bind variable to input tag |
| `ng-bind` | Bind variable to tag |
| `ng-init` | Code called during initialization |

### ng-init Example
```html
<div ng-init="a=1">
```

### ng-repeat Directive
Repeat tags for arrays:
```html
<li ng-repeat="x in names"> {{ x }} </li>
```

Special variables:
- `$index`: current index
- `$odd`: true if index is odd
- `$even`: true if index is even

For Maps:
```html
<li ng-repeat="(key, value) in map">
```

### ng-options Directive
For select tags (unlike ng-repeat, allows object binding to ng-model):
```html
<!-- String array -->
<select ng-options="x for x in names">

<!-- Object array with label -->
<select ng-options="t.value as t.label for t in selectMessageType">

<!-- Object keys and values -->
<select ng-options="x as y for (x, y) in cars">
```

### ng-switch Directive
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

### ng-bind-html Directive
Bind innerHTML:
```html
<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.3.15/angular-sanitize.js"></script>
<script>
var app = angular.module("app", ['ngSanitize']);
</script>
<div ng-bind-html="htmlContent"></div>
```

### ng-href and ng-attr-id
```html
<a ng-href="http://www.gravatar.com/avatar/{{hash}}">link</a>
<div ng-attr-id="collapseUssdInformation{{$index}}">
```

### Event Listeners
- ng-blur, ng-change, ng-click, ng-copy, ng-cut
- ng-dblclick, ng-focus, ng-keydown, ng-keypress, ng-keyup
- ng-mousedown, ng-mouseenter, ng-mouseleave, ng-mousemove
- ng-mouseover, ng-mouseup, ng-paste

### $event Object
```html
<div ng-click="handleClick($event)">
```
Properties: `.clientX`, `.clientY`

## Services

Services are added to controllers:
```javascript
app.controller('myCtrl', function($scope, $location) {
});
```

### $scope Service
Watch model variables:
```javascript
$scope.$watch('passw1', function() {
    $scope.test();
});
```

### $location Service
```javascript
$location.absUrl()
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
    url: '/api/endpoint',
    data: data
}).then(function(response) {
    // success
}, function(response) {
    // error
});
```

Methods: `.delete()`, `.get()`, `.head()`, `.jsonp()`, `.patch()`, `.post()`, `.put()`

Response properties:
- `.config`: object used to generate the request
- `.data`: response from the server
- `.headers`: function to get header information
- `.status`: HTTP status number
- `.statusText`: HTTP status string

## Filters

Filters change how values are displayed using the pipe symbol:
```html
{{ lastName | uppercase }}
```

### Built-in Filters

| Filter | Description |
|--------|-------------|
| `uppercase` | Convert to uppercase |
| `lowercase` | Convert to lowercase |
| `orderBy` | Change order |
| `currency` | Format as currency |
| `filter` | Select subset |
| `date` | Format date |

### Examples
```html
<!-- Order by country -->
<li ng-repeat="x in names | orderBy:'country'">

<!-- Currency formatting -->
{{ price | currency : "Rupee" : 3 }}

<!-- Filter by object properties -->
<li ng-repeat="x in names | filter : {'name' : 'H', 'city': 'London'}">

<!-- Date formatting -->
<p ng-bind="date | date:'MM/dd/yyyy'"></p>
```

### Custom Filter
```javascript
app.filter('myFormat', function() {
    return function(x) {
        var txt = "";
        for (var i = 0; i < x.length; i++) {
            var c = x[i];
            if (i % 2 == 0) {
                c = c.toUpperCase();
            }
            txt += c;
        }
        return txt;
    };
});
```

## Custom Directives

### Defining a Directive
```javascript
app.directive("w3TestDirective", function() {
    return {
        template: "I was made in a directive constructor!"
    };
});
```

### Using Custom Directives
```html
<!-- As attribute -->
<div w3-test-directive></div>

<!-- As element -->
<w3-test-directive></w3-test-directive>

<!-- As class -->
<div class="w3-test-directive"></div>

<!-- As comment -->
<!-- directive: w3-test-directive -->
```

### Restricting Usage
```javascript
app.directive("w3TestDirective", function() {
    return {
        restrict: "A",  // Attribute only
        template: "<h1>Made by a directive!</h1>"
    };
});
```

Restrict values:
- `E`: Element name
- `A`: Attribute
- `C`: Class
- `M`: Comment
- Default: `EA`

Note: Use camelCase for directive names (`myDirective`), but dash-separated when invoking (`my-directive`).

## Forms

### Input States
```html
<form name="myForm">
    <input type="email" name="myAddress" ng-model="myText" required>

    Valid: {{myForm.myAddress.$valid}}
    Dirty: {{myForm.myAddress.$dirty}}
    Touched: {{myForm.myAddress.$touched}}
</form>
```

Input field states:
- `$untouched`: field not touched yet
- `$touched`: field has been touched
- `$pristine`: field not modified yet
- `$dirty`: field has been modified
- `$invalid`: field content not valid
- `$valid`: field content is valid

Form states:
- `$pristine`, `$dirty`, `$invalid`, `$valid`, `$submitted`

### CSS Classes
```css
input.ng-invalid {
    background-color: lightblue;
}
```

Available classes: `ng-empty`, `ng-not-empty`, `ng-touched`, `ng-untouched`, `ng-valid`, `ng-invalid`, `ng-dirty`, `ng-pending`, `ng-pristine`

### Custom Form Validation
```javascript
app.directive('myDirective', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attr, mCtrl) {
            function myValidation(value) {
                if (value.indexOf("e") > -1) {
                    mCtrl.$setValidity('charE', true);
                } else {
                    mCtrl.$setValidity('charE', false);
                }
                return value;
            }
            mCtrl.$parsers.push(myValidation);
        }
    };
});
```

### Async Validation with $pending
```html
<input type="text" name="userName" ng-model="registration.userName" required is-unique />
<div ng-if="registrationForm.userName.$pending">Checking....</div>
```

```javascript
app.directive("isUnique", function($q, $http) {
    return {
        restrict: "A",
        require: "ngModel",
        link: function(scope, element, attributes, ngModel) {
            ngModel.$asyncValidators.isUnique = function(modelValue, viewValue) {
                return $http.post('/username-check', {username: viewValue}).then(
                    function(response) {
                        if (!response.data.validUsername) {
                            return $q.reject(response.data.errorMessage);
                        }
                        return true;
                    }
                );
            };
        }
    };
});
```

## Routing

### Setup
```html
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular.min.js"></script>
<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular-route.js"></script>

<body ng-app="myApp">
    <a href="#/">Main</a>
    <a href="#red">Red</a>
    <a href="#green">Green</a>

    <div ng-view></div>
</body>
```

### Route Configuration
```javascript
var app = angular.module("myApp", ["ngRoute"]);

app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl: "main.htm"
    })
    .when("/red", {
        templateUrl: "red.htm"
    })
    .otherwise({
        template: "<h1>Nothing</h1><p>Nothing has been selected</p>"
    });
});
```

### Routes with Controllers
```javascript
app.config(function($routeProvider) {
    $routeProvider
    .when("/london", {
        templateUrl: "london.htm",
        controller: "londonCtrl"
    });
});

app.controller("londonCtrl", function($scope) {
    $scope.msg = "I love London";
});
```

## Animation

### Setup
```html
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular-animate.js"></script>
<script>
angular.module('myApp', ['ngAnimate']);
</script>
```

### CSS Transition Example
```html
<div ng-hide="myCheck"></div>

<style>
div {
    transition: all linear 0.5s;
    background-color: lightblue;
    height: 100px;
}
.ng-hide {
    height: 0;
    background-color: transparent;
}
</style>
```

### CSS Animation Example
```css
@keyframes myChange {
    from { height: 100px; }
    to { height: 0; }
}

div.ng-hide {
    animation: 0.5s myChange;
}
```

## Cookies

### Setup
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.6.1/angular-cookies.js"></script>
<script>
var app = angular.module("app", ['ngCookies']);

app.controller("controller", function($scope, $http, $cookies) {
    // Put Cookie
    $cookies.put("username", $scope.username);

    // Get Cookie
    var user = $cookies.get('username');

    // Remove Cookie
    $cookies.remove('username');
});
</script>
```

## Include

### Basic Include
```html
<div ng-include="'myFile.htm'"></div>
```

### Cross Domain Include
```javascript
app.config(function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
        'http://www.example.com/**'
    ]);
});
```

Server must include CORS header:
```
Access-Control-Allow-Origin: *
```

## ng-repeat Multiple Rows
```html
<tr ng-repeat-start="cr in results.crs">
    <td>cell 1</td>
    <td>cell 2</td>
</tr>
<tr ng-repeat-end>
    <td>The Special Cell</td>
</tr>
```

## Application Structure

### Multiple Controllers with $rootScope
```javascript
var app = angular.module('myApp', []);

app.run(function($rootScope) {
    $rootScope.color = 'blue';
});

app.controller('myCtrl', function($scope) {
    $scope.color = "red";  // Overrides rootScope for this controller
});
```

### Separating Files
```html
<div ng-app="myApp" ng-controller="myCtrl"></div>
<script src="myApp.js"></script>
<script src="myCtrl.js"></script>
```

**myApp.js:**
```javascript
var app = angular.module("myApp", []);
```

**myCtrl.js:**
```javascript
app.controller("myCtrl", function($scope) {
    $scope.firstName = "John";
    $scope.lastName = "Doe";
});
```

## Global API

```javascript
// Object copy
angular.copy($scope.master);

// Utility functions
angular.lowercase()   // Converts string to lowercase
angular.uppercase()   // Converts string to uppercase
angular.isString()    // Returns true if reference is a string
angular.isNumber()    // Returns true if reference is a number
```

## Debugging
Chrome debugging plugin: [AngularJS Batarang](https://chrome.google.com/webstore/detail/gjhmfjbfdbeeekiijofbikifokdkfhcc)

## Reference
- [W3Schools AngularJS Tutorial](https://www.w3schools.com/angular/default.asp)
