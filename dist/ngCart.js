'use strict';


angular.module('ngCart.directives', [])

    .controller('CartController',['$scope', 'ngCart', function($scope, ngCart) {

        $scope.ngCart = ngCart;


    }])

    .directive('ngcartAddtocart', ['ngCart', function(ngCart){
        return {
            restrict : 'E',
            controller : 'CartController',
            scope: {
                id:'@',
                name:'@',
                quantity:'@',
                price:'@',
                data:'='
            },
            transclude: true,
            templateUrl: 'template/ngCart/addtocart.html',
            link:function(scope, element, attrs){
                scope.attrs = attrs;
                scope.inCart = function(){
                    return ngCart.getItemById(attrs.id);
                }
            }
        };
    }])

    .directive('ngcartCart', ['ngCart', function(ngCart){
        return {
            restrict : 'E',
            controller : 'CartController',
            scope: {},
            templateUrl: 'template/ngCart/cart.html',
            link:function(scope, element, attrs){

            }
        };
    }])

    .directive('ngcartSummary', ['ngCart', function(ngCart){
        return {
            restrict : 'E',
            controller : 'CartController',
            scope: {},
            transclude: true,
            templateUrl: 'template/ngCart/summary.html'
        };
    }]);

;'use strict';


angular.module('ngCart', ['ngCart.directives'])

    .config([function () {

    }])

    .provider('$ngCart', function () {

        var shipping = false;
        var tax = false;
        this.$get = function () {

        };

    })

    .run(['$rootScope', 'ngCart','ngCartItem', 'store', function ($rootScope, ngCart, ngCartItem, store) {

        $rootScope.$on('ngCart:change', function(){
            ngCart.$save();
        });

        if (angular.isObject(store.get('cart'))) {
            ngCart.$restore(store.get('cart'));

        } else {
            ngCart.init();
        }

    }])

    .service('ngCart', ['$rootScope', 'ngCartItem', 'store', function ($rootScope, ngCartItem, store) {

        this.init = function(){
            this.$cart = {
                shipping : null,
                tax : null,
                items : []
            };
        }

        this.addItem = function (id, name, price, quantity, data) {

            var inCart = this.getItemById(id);

            if (typeof inCart === 'object'){
                //Update quantity of an item if it's already in the cart
                inCart.setQuantity(quantity, false);
            } else {
                var newItem = new ngCartItem(id, name, price, quantity, data);
                this.$cart.items.push(newItem);
                $rootScope.$broadcast('ngCart:itemAdded', newItem);
            }

            $rootScope.$broadcast('ngCart:change', {});
        };

        this.getItemById = function (itemId) {
            var items = this.getCart().items;

            var build;
            angular.forEach(items, function (item) {
                if  (item.getId() === itemId) {
                    build = item;
                }
            });
            return build;
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

        this.getItems = function(){
            return this.getCart().items;
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
            $rootScope.$broadcast('ngCart:itemRemoved', {});
            $rootScope.$broadcast('ngCart:change', {});

        }

        this.empty = function () {
            this.$cart.items = [];
            localStorage.removeItem('cart');
        }


        this.$restore = function(storedCart){
            var _self = this;
            _self.init();
            _self.$cart.shipping = storedCart.shipping;
            _self.$cart.tax = storedCart.tax;

            angular.forEach(storedCart.items, function (item) {
                _self.$cart.items.push(new ngCartItem(item._id,  item._name, item._price, item._quantity, item._data));
            });
            this.$save();
        }

        this.$save = function () {
            return store.set('cart', JSON.stringify(this.getCart()));
        }

    }])

    .factory('ngCartItem', ['$rootScope', 'store', function ($rootScope, store) {

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
                console.error('An ID must be provided');
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
                } else {
                    this._quantity = quantity;
                }
                if (this._quantity < 1) this._quantity = 1;

            } else {
                this._quantity = 1;
                console.info('Quantity must be an integer and was defaulted to 1');
            }
            $rootScope.$broadcast('ngCart:change', {});

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

    .service('store', ['$window', function ($window) {

        return {

            get: function (key) {
                if ($window.localStorage [key]) {
                    var cart = angular.fromJson($window.localStorage [key]);
                    return JSON.parse(cart);
                }
                return false;

            },


            set: function (key, val) {

                if (val === undefined) {
                    $window.localStorage .removeItem(key);
                } else {
                    $window.localStorage [key] = angular.toJson(val);
                }
                return $window.localStorage [key];
            }
        }
    }])

    .controller('CartController',['$scope', 'ngCart', function($scope, ngCart) {
        $scope.ngCart = ngCart;
    }])

    .value('version', '0.0.1-rc.2');