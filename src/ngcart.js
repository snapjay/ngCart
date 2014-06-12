'use strict';


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

        this.addItem = function (item) {

//            var i =  angular.copy(ngCartItem); // TODO: This might be better achieved with a new constructor
//            i.setItem(item);

            var i = {
                item: item,
                quantity: 1
            }

            this.$cart.push(i);
            this.$saveCart(this.$cart);
        };

        this.itemInCart = function (itemId) {
            var result = false;
            angular.forEach(this.$cart, function (value) {
                if (itemId == value.item.id) result = true;
            });
            return result;
        }

       this.totalItems = function () {
            return  this.$cart.length;
        }


       this.totalCost= function () {
            var total = 0;
            angular.forEach(this.$cart, function (value) {
                total += (value.item.price * value.quantity);
            });
            return total
        }

        this.quantity = function (index, offset) {
            log (index);
            log (offset);
            var quantity = this.$cart[index].quantity + offset;
            if (quantity < 1) quantity = 1;
            this.$cart[index].quantity = quantity;
            this.$saveCart(this.$cart);
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
            if (Modernizr.localstorage)  localStorage.setItem('cart', JSON.stringify(this.$cart));

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

    }]);


