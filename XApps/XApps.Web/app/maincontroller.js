app.controller('maincontroller', function ($scope, $compile, $http, userFactory, userByUserNameFactory, $rootScope) {
    $scope.onSideBarLoaded = function() {

        $("#browser").treeview({
            toggle: function() {
                console.log("%s was toggled.", $(this).find(">span").text());
            }
        });

        $("#browser").treeview();

        $compile($("#browser"))($scope);

    };
    /*
    Client ID
    739ed9983efe3f0260f5
    Client Secret
    9c92dd882f4ca86079a04d2e4a7255be77405213
    token
    1aac3b3d9eebde2dc2d1d26844cd461071fdf3bb
    */
    $rootScope.user = { "login": "Login with Github", "avatar_url": "" };
    $rootScope.userAccess = "undefined";
    $scope.showLogin = true;
    $scope.showLogout = false;

    $rootScope.user_authenticate = function () {
        OAuth.initialize('gVSwp4XmyIU6A-VfLSeA6Njh_2Q');
        OAuth.popup('github', function(error, result) {

            $scope.userAccess = result;

            $http.get("https://api.github.com/user?access_token=" + $scope.userAccess.access_token)
                .success(function(data) {
                    $scope.user = data;
                            $scope.showLogin = false;
                            $scope.showLogout = true;
                            console.log(data.login);
                            var usr = userByUserNameFactory.query({ username: data.login });

                //console.log(usr);
                    usr.$promise.then(function(tempdata) {
                        console.log(tempdata);
                        console.info(JSON.stringify(data));
                        makeToast("Hi "+data.login +".",1);
                    }, function(reason) {
                        console.log("User not found. Adding to database");
                        var usrObj = {
                            "UserID": 1,
                            "UserName": data.login,
                            "Email": "",
                            "Designation": null,
                            "Department": null,
                            "Contact": null
                        };
                        var userInsert = userFactory.save(usrObj);
                        userInsert.$promise.then(function(result) {
                            makeToast("Hi " + data.login + ". Welcome to XApps. Please update your profile", 2);
                        }, function(result) {
                            makeToast("Could not create an account for you", 4);
                        });
                    });
                    
                }).error(function() {
                    console.error("Error loading user details");
                });
        });


    };


    $rootScope.user_logout = function () {
        $scope.user = { "login": "Login with Github", "avatar_url": "" };
        $scope.userAccess = "undefined";
        $scope.showLogin = true;
        $scope.showLogout = false;
    };
});