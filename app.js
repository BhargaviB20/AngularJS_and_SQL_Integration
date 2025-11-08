// 1. Define the app and include the 'ngRoute' module
var app = angular.module('inventoryApp', ['ngRoute']);

// 2. Configure the routes (pages)
app.config(function($routeProvider) {
    $routeProvider
        .when('/products', {
            templateUrl: 'product-list.html',
            controller: 'ProductController'
        })
        .when('/add', {
            templateUrl: 'product-form.html',
            controller: 'ProductController'
        })
        .otherwise({
            // By default, go to the product list
            redirectTo: '/products'
        });
});