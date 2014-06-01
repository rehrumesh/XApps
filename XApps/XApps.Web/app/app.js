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
        //added new view
    .when("/createnewapp", {
        controller: "createnewapp",
        templateUrl: "app/createnewapp/createnewapp.html"
    })
        //newly added
        .when("/createnewapp/html", {
            controller: "HTML",
            templateUrl: "app/createnewapp/htmlediter/Htmlpage.html"
        })

        .when("/createnewapp/css", {
            controller: "CSS",
            templateUrl: "app/createnewapp/cssediter/css.html"
        })

        .when("/createnewapp/javascript", {
            controller: "Javascript",
            templateUrl: "app/createnewapp/jsediter/javascript.html"
        })

    .when("/dashboard", {
        controller: "dashboard",
        templateUrl: "app/dashboard/dashboard.html"
    });
    //$routeProvider.otherwise({ redirectTo: "http://localhost:6406/requestHandler.ashx" });

});
//
//default route is http://localhost:6580/
// want to make it as http://localhost:6580/#/
// add dynamic routing.
//default -> dashboard