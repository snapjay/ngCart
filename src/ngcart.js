'use strict';

function log(a){
    console.log (a);
}

angular.module('ngCart', [])

    .config([function () {

    }])

    .provider('$ngCart', function () {

        var shipping = false;
        var tax = false;

        this.$get = function () {

        };

    })

    .run(['ngCart','ngCartItem', function (ngCart, ngCartItem) {



        if (Modernizr.localstorage && angular.isObject(JSON.parse(localStorage.getItem('cart')))) {


            ngCart.$restoreCart(JSON.parse(localStorage.getItem('cart')));

        } else {
            ngCart.init();
        }



    }])

    .service('ngCart', ['ngCartItem', function (ngCartItem) {


        this.init = function(){

            this.$cart = {
                shipping : null,
                tax : null,
                items : []
            };

        }


        this.addItem = function (id, name, price, quantity, data) {

            var inCart = this.itemInCart(id);

            if (inCart !== false){
                this.quantity(inCart.setQuantity(1, true));
            } else {
                this.$cart.items.push(new ngCartItem(id, name, price, quantity, data));
            }

            this.$saveCart();
        };


        this.itemInCart = function (itemId) {

            var a = _.find(this.getCart().items, {_id:itemId}); // This should really call .getId() - not read the private property
            if (a === undefined) return false
            else return a;
        }




        this.setShipping = function(shipping){
            this.$cart.shipping = shipping;
        }

        this.getShipping = function(){
            if (this.getCart().items.length == 0) return 0;
            return  this.getCart().shipping;
        }



        this.setTax = function(tax){
            this.$cart.tax = tax;
        }



        this.getTax = function(){
            return ((this.getSubTotal()/100) * this.getCart().tax );
        }

        this.setCart = function (cart) {
            this.$cart = cart;
        }

        this.getCart = function(){
            return this.$cart;
        }


        this.totalItems = function () {
            return this.getCart().items.length;
        }

        this.getSubTotal = function(){
            var total = 0;
            angular.forEach(this.getCart().items, function (item) {
                total += item.getTotal();
            });
            return total;
        }


        this.totalCost= function () {
            return this.getSubTotal() + this.getShipping() + this.getTax();
        }


        this.removeItem = function (index) {
            this.$cart.items.splice(index, 1);
            this.$saveCart();
        }

        this.empty = function () {
            this.$cart = [];
            if (Modernizr.localstorage)  localStorage.removeItem('cart');
        }



        this.$restoreCart = function(sessionStore){
            var _self = this;
            _self.init();
            _self.$cart.shpping = sessionStore.shipping;
            _self.$cart.tax = sessionStore.tax;
            angular.forEach(sessionStore.items, function (item) {
                _self.$cart.items.push(new ngCartItem(item._id,  item._name, item._price, item._quantity, item._data));
            });
        }

        this.$saveCart = function () {
            if (Modernizr.localstorage)  localStorage.setItem('cart', JSON.stringify(this.getCart()));

        }

    }])

    .factory('ngCartItem', ['ngCart', function (ngCart) {

        var item = function (id, name, price, quantity, data) {
            this.setId(id);
            this.setName(name);
            this.setPrice(price);
            this.setQuantity(quantity);
            this.setData(data);
        };


        item.prototype.setId = function(id){
            if (id)  this._id = id;
            else {
                console.error('A ID must be provided');
            }
        }

        item.prototype.getId = function(){
            return this._id;
        }


        item.prototype.setName = function(name){
            if (name)  this._name = name;
            else {
                console.error('A name must be provided');
            }
        }
        item.prototype.getName = function(){
            return this._name;
        }

        item.prototype.setPrice = function(price){
            var price = parseFloat(price);
            if (price) {
                if (price <= 0) {
                    console.error('A price must be over 0');
                }
                this._price = (price);
            } else {
                console.error('A price must be provided');
            }
        }
        item.prototype.getPrice = function(){
            return this._price;
        }


        item.prototype.setQuantity = function(quantity, relative){


            var quantity = parseInt(quantity);
            if (quantity % 1 === 0){
                if (relative === true){
                    this._quantity  += quantity;
                    if (this._quantity < 1) this._quantity = 1;

                } else {
                    this._quantity = quantity;
                }


            } else {
                this._quantity = 1;
                console.info('Quantity must be an integer and was defaulted to 1');
            }
            ngCart.$saveCart();

        }

        item.prototype.getQuantity = function(){
            return this._quantity;
        }

        item.prototype.setData = function(data){
            if (data) this._data = data;
        }

        item.prototype.getData = function(){
            if (this._data) return this._data;
            else console.info('This item has no data');
        }

        item.prototype.getTotal = function(){
            return this.getQuantity() * this.getPrice();
        }

        return item;

    }])

    .controller('CartController',['$scope', 'ngCart', function($scope, ngCart) {

        $scope.scopeCart = ngCart;


    }])

    .directive('addtocart', ['ngCart', function(ngCart){
        return {
            restrict : 'E',
            controller : ['$scope',  function($scope){
                $scope.ngCart = ngCart;
            }],
            scope: {
                id:'@',
                name:'@',
                quantity:'@',
                price:'@',
                data:'='
            },
            transclude: true,
            templateUrl: '/template/addtocart.html',
            link:function(scope, element, attrs){
                scope.attrs = attrs;
                scope.inCart = function(){
                    return ngCart.itemInCart(attrs.id);
                }
            }
        };
    }])

    .directive('cart', ['ngCart', function(ngCart){
        return {
            restrict : 'E',
            controller : ['$scope',  function($scope){
                $scope.ngCart = ngCart;
            }],
            scope: {},
            templateUrl: '/template/cart.html',
            link:function(scope, element, attrs){

            }
        };
    }])

    .directive('summary', ['ngCart', function(ngCart){
        return {
            restrict : 'E',
            controller : ['$scope',  function($scope){
                $scope.ngCart = ngCart;
            }],
            scope: {},
            transclude: true,
            templateUrl: '/template/summary.html'

        };
    }])

    .value('version', '0.2');



