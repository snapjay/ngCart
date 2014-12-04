ngCart
======

Really simple shopping cart for AngularJS
-----------------------------------------------------------------
AngularJS module consists of a set of directives to help you quickly impliment a shopping cart on your AngularJS app


Demo
----

To view a demo go here:
http://ngcart.snapjay.com/
You can see all 3 directive active on the page - Add items to the cart and change the quantities.

Setup
-----
1. Get the package:
    * bower install ngcart

2. Include the  `dist/ngCart.js` file in your index.html
3. Include add `ngCart` as a dependency in your app in the angular.module

Something like this:
```
<!doctype html>
<html ng-app="myApp">
<head>
    <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.2.23/angular.min.js"></script>
    <script>
        var myApp = angular.module('myApp', ['ngCart']);
    </script>
    ...
</head>
<body>
    ...
</body>
</html>
```


# Directives
-------

## addtocart

Renders an 'Add To Cart' Button

```
<ngcart-addtocart id="{{ item.id }}" name="{{ item.name }}" price="{{ item.price }}" data="item">Add To Cart</ngcart-addtocart>
```


| Attribute  |  Description |
| ------------- | ------------- |
| *id  | Unique identifier for this item.  |
| *name | Text description of item |
| *price | Numerical value representing the value of the item|
| quantity | Numerical value representing the quantity of the item to add to cart, defaults to 1|
| data | This can be an object that may store additional information about the item to be uses later e.g. image, options etc. |

*Required Attributes

## cart

Renders a view of the cart

```
<ngcart-cart></ngcart-cart>
```



## summary

Renders a summary  of the content of the cart (Typically used in the header bar of a website
```
<ngcart-summary></ngcart-summary>
```



Grunt
------------
This project is built with GruntJS. To contribute to this project make sure to install node.js and npm.
Assuming npm is installed, run `$ npm install` inside the project directory to install the dependencies and you should
be ready to go.
Once you make a change, use `$ grunt build` inside the project folder to build the distribution files.
The version number is determined from the `package.json` file inside the project directory.


Download on Github
------------------
https://github.com/snapjay/ngCart.git



License
-------

This module is licensed using the MIT License:

```
The MIT License (MIT)

Copyright (c) 2013 Dan Shreim

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```



Credit
------
Dan Shreim <br />
<a href="http://www.twitter.com/snapjay/">@snapjay</a> <br />
http://snapjay.com
If you use the script, please let me know @snapjay;  Don't worry, I won't ask for anything!
