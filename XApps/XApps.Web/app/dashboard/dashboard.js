app.controller('dashboard', ['$scope', '$http', function ($scope, $http) {
    $scope.devName = "Rumesh";

    //Retriving data from App table

    getApps();

    function getApps() {
        //defining the $http service for getting the apps
        alert("working");
        $http({
            method: 'GET',
            url: '/api/app'
        }).
        success(function (data) {
            //Assigning app data to the $scope variable
            $scope.apps = data;
        }).
        error(function (error) {
            //showing error message
            $scope.status = 'unable to retrieve app' + error.message;
            alert("error");
        });
    }
}]);