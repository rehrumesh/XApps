app.controller('dashboard', function ($scope, $route, $location, dynamics, AppsFactory, categoriesFactory) {

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

    $scope.allcategories = categoriesFactory.query();

    //rating $scope

    $scope.rating = 0;
    $scope.ratings = [{
        current: 5,
        max: 10
    }, {
        current: 3,
        max: 5
    }];

    $scope.getSelectedRating = function (rating) {
        console.log(rating);
    }

    //rating $scope

});

app.directive('starRating', function () {
    return {
        restrict: 'A',
        template: '<ul class="rating">' +
            '<li ng-repeat="star in stars" ng-class="star" ng-click="toggle($index)">' +
            '\u2605' +
            '</li>' +
            '</ul>',
        scope: {
            ratingValue: '=',
            max: '=',
            onRatingSelected: '&'
        },
        link: function (scope, elem, attrs) {

            var updateStars = function () {
                scope.stars = [];
                for (var i = 0; i < scope.max; i++) {
                    scope.stars.push({
                        filled: i < scope.ratingValue
                    });
                }
            };

            scope.toggle = function (index) {
                scope.ratingValue = index + 1;
                scope.onRatingSelected({
                    rating: index + 1
                });
            };

            scope.$watch('ratingValue', function (oldVal, newVal) {
                if (newVal) {
                    updateStars();
                }
            });
        }
    }
});

