(function () {
    var app = angular.module('app');

    app.constant('routes', getRoutes());

    app.config(['$routeProvider', 'routes', routeConfigurator]);
    function routeConfigurator($routeProvider, routes) {

        routes.forEach(function (r) {
            $routeProvider.when(r.url, r.config);
        });
        $routeProvider.otherwise({ redirectTo: '/dashboard' });
    }


    function getRoutes() {
        return [
            //{
            //    url: '/dashboard',
            //    config: {
            //        templateUrl: 'app/dashboard/dashboard.html',
            //        title: 'dashboard',
            //        settings: {
            //            nav: 1,
            //            content: '<i class="fa fa-dashboard"></i> Dashboard'
            //        }
            //    }
            //}, {
            //    url: '/hotapps',
            //    config: {
            //        title: 'hotapps',
            //        templateUrl: 'app/hotapps/hotapps.html',
            //        settings: {
            //            nav: 2,
            //            content: '<i class="fa fa-lock"></i> Hot Apps'
            //        }
            //    }
            //}, {
            //    url: '/myapps',
            //    config: {
            //        title: 'myapps',
            //        templateUrl: 'app/myapps/myapps.html',
            //        settings: {
            //            nav: 3,
            //            content: '<i class="fa fa-lock"></i> My Apps'
            //        }
            //    }
            //}
        ];
    }
})();


//app.config(function ($routeProvider) {

//    $routeProvider.when("/", {
//        controller: "dashboard",
//        templateUrl: "app/dashboard/dashboard.html"
//    })
//    .when("/myapps", {
//        controller: "myapps",
//        templateUrl: "app/myapps/myapps.html"
//    })
//    .when("/hotapps", {
//        controller: "hotapps",
//        templateUrl: "app/hotapps/hotapps.html"
//    })
//    .when("/dashboard", {
//        controller: "dashboard",
//        templateUrl: "app/dashboard/dashboard.html"
//    });
//    $routeProvider.otherwise({ redirectTo: "/dashboard" });

//});