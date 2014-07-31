app.controller('myapps', function ($scope,$rootScope, categoriesFactory, AppsFactory) {
    $scope.allcategories = categoriesFactory.query();
    $scope.allapps = AppsFactory.query();

    $scope.userID = 0;

    //get userid
    $scope.init = function () {
        $scope.userID = $rootScope.loogedInUser.UserID;
        console.log($scope.searchText);
    };

    $scope.init();
});