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
    })

    //$routeProvider.otherwise({ redirectTo: "http://localhost:6406/requestHandler.ashx" });
    .when("/error", {
        controller: "error",
        templateUrl: "app/ErrorPage/error.html"
    });
});

//CROS
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
                makeToast("App successfully published",2);
            }
            defer.resolve(data);

        });

        return defer.promise;
    };

    return obj;
});

app.factory('AppsFactory', function($resource) {
    return $resource('http://localhost:12666/api/App/:id', { id: '@id' }, { update: { method: 'PUT' } });//, query: { method: 'GET' }
});

app.factory('AppsByNameFactory', function ($resource) {
    return $resource('http://localhost:12666/api/App/AppByAppName/:appname',null, {'query': { method: 'GET', isArray: false } });//, query: { method: 'GET', isArray: false } 
});

app.factory('categoriesFactory', function ($resource) {
    return $resource('http://localhost:12666/api/Category/:id', { id: '@id' }, { update: { method: 'PUT' } });
});

app.factory('userFactory', function($resource) {
    return $resource('http://localhost:12666/api/User/:id', { id: '@id' }, { update: { method: 'PUT' } });
});

app.factory('userByUserNameFactory', function ($resource) {
    return $resource('http://localhost:12666/api/user/userbyusername/:username', null, { 'query': { method: 'GET', isArray: false } });
});


// type : 1 info 2 success 3 fail 4 warning
function makeToast(text, type) {
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "positionClass": "toast-bottom-right",
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };

    switch (type) {
        case 1:
            toastr.info(text);
            break;
        case 2:
            toastr.success(text);
            break;
        case 3:
            toastr.error(text);
            break;
        case 4:
            toastr.warning(text);
            break;
        default:
            toastr.info(text);
            break;
    }
}
