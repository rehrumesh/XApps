app.controller('dashboard', function ($scope, $route, $location, dynamics, AppsFactory) {

    $scope.defineRoute = function (appName) {
        //check app isPublished
        //add 
        
        //var allroutes = [];
        //angular.forEach($route.routes, function (route, key) {
        //    if (route.controller) {
        //        //if (route.originalPath == '/' + appName) {
        //            allroutes.push(route.originalPath);
        //        //}
                
        //    }
        //});

        //alert(JSON.stringify(allroutes));
        //if (allroutes.length == 0) {
            //dynamics.addRoute('/' + appName, {
            //    templateUrl: 'app/apps/app3/html/index.html'
            //});
        //}
        //$location.path('/' + appName);
        //$location.path('/app3');
        //$window.location.href='#/app3';
        //console.log($route);


        dynamics.addRoute('/' + appName, {
            templateUrl: 'app/apps/pub/'+appName+'/html/index.html'
        });

        //compare hashes
        //if hash equals
        $location.path('/' + appName);
        //else
        //retrive files
        //var data = requestFactory.getResponse();

        //alert("response : "+ data);


    };

    $scope.allapps = AppsFactory.query();
});

