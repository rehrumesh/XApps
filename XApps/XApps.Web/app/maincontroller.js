app.controller('maincontroller', function ($scope, $compile, $http, userFactory) {
    $scope.onSideBarLoaded = function () {
       
            $("#browser").treeview({
                toggle: function () {
                    console.log("%s was toggled.", $(this).find(">span").text());
                }
            });
       
            $("#browser").treeview();
           
            $compile($("#browser"))($scope);
            
    }
    /*
    Client ID
    739ed9983efe3f0260f5
    Client Secret
    9c92dd882f4ca86079a04d2e4a7255be77405213
    token
    1aac3b3d9eebde2dc2d1d26844cd461071fdf3bb
    */
    $scope.user;
    $scope.userAccess = "undefined";

    $scope.user_authenticate = function() {
        OAuth.initialize('gVSwp4XmyIU6A-VfLSeA6Njh_2Q');
        OAuth.popup('github', function(error, result) {

            $scope.userAccess = result;

            $http.get("https://api.github.com/user?access_token=" + $scope.userAccess.access_token)
                .success(function(data) {
                    $scope.user = data;
                console.log(data.login);
                    var usr = userFactory.query({ username: data.login });
                    usr.$promise.then(function(tempdata) {
                        console.log(tempdata);
                        console.info(JSON.stringify(data));
                    });
                    
                }).error(function() {
                    console.error("Error loading user details");
                });
        });


    };
});