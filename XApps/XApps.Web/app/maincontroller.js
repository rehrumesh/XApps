app.controller('maincontroller', function ($scope,$compile) {
    $scope.onSideBarLoaded = function () {
       
            $("#browser").treeview({
                toggle: function () {
                    console.log("%s was toggled.", $(this).find(">span").text());
                }
            });
       
            $("#browser").treeview();
           
            $compile($("#browser"))($scope);
    }
});