var app = angular.module('app', ['ngRoute']);
app.config(function ($routeProvider) {

    $routeProvider.when("/", {
        controller: "dashboard",
        templateUrl: "app/dashboard/dashboard.html"
    })
    .when("/myapps", {
        controller: "myapps",
        templateUrl: "app/myapps/myapps.html"
    })
    .when("/hotapps", {
        controller: "hotapps",
        templateUrl: "app/hotapps/hotapps.html"
    })
    .when("/dashboard", {
        controller: "dashboard",
        templateUrl: "app/dashboard/dashboard.html"
    });
    $routeProvider.otherwise({ redirectTo: "/dashboard" });

});
//
//default route is http://localhost:6580/
// want to make it as http://localhost:6580/#/
// add dynamic routing.
//default -> dashboard