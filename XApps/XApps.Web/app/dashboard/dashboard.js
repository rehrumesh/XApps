app.controller('dashboard', function ($scope, $route, $location, dynamics, AppsFactory, categoriesFactory) {

    $scope.defineRoute = function (appName) {
        
        dynamics.addRoute('/' + appName, {
            templateUrl: 'app/apps/pub/' + appName + '/html/index.html'
        });

        $location.path('/' + appName);
       


    };

    $scope.allapps = AppsFactory.query();

    $scope.allcategories = categoriesFactory.query();

    //rating $scope


    

    //$scope.rating = 0;
    //$scope.ratings = [{
    //    current: 1,
    //    max: 5
    //}];

    //$scope.getSelectedRating = function (rating) {
    //    console.log(rating);
    //}
    
    /*
    $scope.RatingApp = function () {
        RatingFactory.save($scope.ratingApp);
    }

    $scope.ratingApp = {
        AppID: 1,
        UserID: 1,
        Rating: 2
    };
    */
    //rating $scope

});



//app.directive('starRating', function () {
//    return {
//        restrict: 'A',
//        template: '<ul class="rating">' +
//            '<li ng-repeat="star in stars" ng-class="star" ng-click="toggle($index)">' +
//            '\u2605' +
//            '</li>' +
//            '</ul>',
//        scope: {
//            ratingValue: '=',
//            max: '=',
//            onRatingSelected: '&'
//        },
//        link: function (scope, elem, attrs) {

//            var updateStars = function () {
//                scope.stars = [];
//                for (var i = 0; i < scope.max; i++) {
//                    scope.stars.push({
//                        filled: i < scope.ratingValue
//                    });
//                }
//            };

//            scope.toggle = function (index) {
//                scope.ratingValue = index + 1;
//                scope.onRatingSelected({
//                    rating: index + 1
//                });
//            };

//            scope.$watch('ratingValue', function (oldVal, newVal) {
//                if (newVal) {
//                    updateStars();
//                }
//            });
//        }
//    }
//});

