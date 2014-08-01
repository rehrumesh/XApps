app.controller('myapps', function ($scope, $rootScope, categoriesFactory, AppsFactory, dynamics, $location) {
    $scope.allcategories = categoriesFactory.query();
    $scope.allapps = AppsFactory.query();

    $scope.userID = 0;


    $scope.init = function () {
        $scope.userID = $rootScope.loogedInUser.UserID;
        console.log($scope.searchText);
    };

    $scope.init();

    $scope.defineRoute = function (appName) {

        dynamics.addRoute('/' + appName, {
            templateUrl: 'app/apps/pub/' + appName + '/html/index.html'
        });

        $location.path('/' + appName);



    };
});