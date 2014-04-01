(function () {
    'use strict';

    var app = angular.module('app', [
        'ngAnimate',
        'ngRoute',
        'ngSanitize'
    ]);

    app.run(['$route', function ($route) {
        // Include $route to kick start the router.
    }]);
})();