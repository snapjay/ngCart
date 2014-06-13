'use strict';

function log(a){
    console.log (a);
}
// Declare app level module which depends on filters, and services


angular.module('ngCart', [])

    .config([function () {

    }])

    .provider('$ngCart', function () {

        this.$get = function () {

        };

    })

    .run(['ngCart', function (ngCart) {


        if (Modernizr.localstorage && angular.isArray(JSON.parse(localStorage.getItem('cart')))) {
            ngCart.setCart(JSON.parse(localStorage.getItem('cart')));
        } else {
            ngCart.setCart([]);
        }

    }])






    .service('ngCart', ['ngCartItem', function (ngCartItem) {


        this.setCart = function (cart) {
            this.$cart = cart;
        }

        this.getCart = function(){
            return this.$cart;
        }

        this.addItem = function (id, name, price, quantity, data) {

//            var i =  angular.copy(ngCartItem); // TODO: This might be better achieved with a new constructor
//            i.setItem(item);

            if (!quantity) quantity = 1;

            var i = {
                id: id,
                name: name,
                price: price,
                quantity: quantity,
                data: data
            }

            this.$cart.push(i);
            this.$saveCart(this.$cart);
        };

        this.itemInCart = function (itemId) {
            var result = false;
            angular.forEach(this.getCart(), function (item) {
                if (itemId == item.id) result = true;
            });
            return result;
        }

       this.totalItems = function () {
            return  this.getCart().length;
        }


       this.totalCost= function () {
            var total = 0;
            angular.forEach(this.getCart(), function (item) {
                total += (item.price * item.quantity);
            });
            return total
        }

        this.quantity = function (index, offset) {
            var quantity = this.$cart[index].quantity + offset;
            if (quantity < 1) quantity = 1;
            this.$cart[index].quantity = quantity;
            this.$saveCart();
        }

        this.removeItem = function (index) {
            this.$cart.splice(index, 1);
            this.$saveCart(this.$cart);
        }

        this.empty = function () {
            this.$cart = [];
            if (Modernizr.localstorage)  localStorage.removeItem('cart');
        }

        this.$saveCart = function () {
            if (Modernizr.localstorage)  localStorage.setItem('cart', JSON.stringify(this.getCart()));

        }

    }])

    .service('ngCartItem', [ function () {
        this.$item = null;        
        this.$quantity = 1;
        
        this.getTotal = function(){
            return this.$quantity * this.$item.price;
        }
        this.getQuantity = function(){
            return this.$quantity;
        }

        this.getItem = function(){
            return this.$item;
        }

        this.setItem = function (item){
             this.$item = item;
        }
        this.setQuantity = function (int){
             this.$quantity = int;
        }

    }])

    .controller('CartController',['$scope', 'ngCart', function($scope, ngCart){

        $scope.cart = ngCart;

        $scope.addToCart = function(id, name, price, quantity, data){
            ngCart.addItem(id, name, price, quantity, data);
        };

    }])

    .directive('addtocart', function(){
        return {
            restrict : 'E',
            controller : 'CartController',
            scope: {},
            transclude: true,
            templateUrl: '/template/addtocart.html',
            link:function(scope, element, attrs){
                element.on('click', function(){
                    scope.addToCart(attrs.id, attrs.name, attrs.price, attrs.quantity, attrs.data)
                });
            }
        };

    })

    .directive('cart', function(){
        return {
            restrict : 'E',
            controller : 'CartController',
            scope: {},
            templateUrl: '/template/cart.html',
            link:function(scope, element, attrs){


            }
        };

    })



;


