app.controller('myapps', function ($scope, categoriesFactory, AppsFactory) {
    $scope.allcategories = categoriesFactory.query();
    $scope.allapps = AppsFactory.query();
});