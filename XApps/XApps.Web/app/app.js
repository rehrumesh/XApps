var app = angular.module('app', ['ngRoute', 'ngResource']);

//app.run(function ($rootScope, $templateCache) {
//    $rootScope.$on('$routeChangeStart', function (event, next, current) {
//        if (typeof (current) !== 'undefined') {
//            $templateCache.remove(current.templateUrl);
//        }
//    });
//});

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
        

    .when("/dashboard", {
        controller: "dashboard",
        templateUrl: "app/dashboard/dashboard.html"
    });
    //$routeProvider.otherwise({ redirectTo: "http://localhost:6406/requestHandler.ashx" });

});

app.config(function($httpProvider) {
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
});

app.factory('dynamics',function($route) {

    var dynamicsMethods = {};

    dynamicsMethods.addRoute = function (path, route) {
        $route.routes[path] = angular.extend({
            reloadOnSearch: true
        },
        route,
        path && dynamicsMethods.pathRegExp(path, route));
        
        // create redirection for trailing slashes
        if (path) {
            var redirectPath = (path[path.length - 1] == '/') ? path.substr(0, path.length - 1) : path + '/';
            
            $route.routes[redirectPath] = angular.extend({
                redirectTo: path
            },

            dynamicsMethods.pathRegExp(redirectPath, route));
        }

        return this;
    };

    dynamicsMethods.pathRegExp = function(path, opts) {
        var insensitive = opts.caseInsensitiveMatch,
            ret = {
                originalPath: path,
                regexp: path
            },
            keys = ret.keys = [];

        path = path.replace(/([().])/g, '\\$1')
            .replace(/(\/)?:(\w+)([\?\*])?/g, function(_, slash, key, option) {
                var optional = option === '?' ? option : null;
                var star = option === '*' ? option : null;
                keys.push({
                    name: key,
                    optional: !!optional
                });
                slash = slash || '';
                return '' + (optional ? '' : slash) + '(?:' + (optional ? slash : '') + (star && '(.+?)' || '([^/]+)') + (optional || '') + ')' + (optional || '');
            })
            .replace(/([\/$\*])/g, '\\$1');

        ret.regexp = new RegExp('^' + path + '$', insensitive ? 'i' : '');
        return ret;
    };

    return dynamicsMethods;
});

app.factory('requestFactory', function ($http, $q) {

    var obj = {};
    obj.data = "abcd";
    obj.getResponse = function (appid,mode) {
        var temp = {};
        var defer = $q.defer();
        $http.get('requesthandler.ashx?appid='+appid+'&mode='+mode).then(function (data) {
            //alert(JSON.stringify(data));
            temp = data;
            if (mode == "2") {
                alert("App published");
            }
            defer.resolve(data);

        });

        return defer.promise;
    };

    return obj;
});

app.factory('publishedAppsFactory', function($resource) {
    return $resource('http://localhost:12666/api/App/:id', { id: '@id' }, { update: { method: 'PUT' } });//, query: { method: 'GET' }
});

app.factory('AppsByNameFactory', function ($resource) {
    return $resource('http://localhost:12666/api/App/', { id: '@id' }, { update: { method: 'PUT' } });//, query: { method: 'GET', isArray: false } 
});

app.factory('categoriesFactory', function ($resource) {
    return $resource('http://localhost:12666/api/Category/:id', { id: '@id' }, { update: { method: 'PUT' } });
});
