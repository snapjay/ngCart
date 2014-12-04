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

