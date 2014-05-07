app.controller('createnewapp', function ($scope,$compile) {
    $scope.devName = "Rumesh";
    $scope.path = "<li><span class='file'>BIZAPP.css</span></li>";
    $scope.githubUserName = "Xapps00";
    $scope.githubPassword = "xapps00xapps00";
    $scope.githubRepoName = "";
    $scope.currentFile = "hello.js";
    $scope.currentFileType = "js";
    $scope.currentFilePath = "src/";
    $scope.fileContent = "";

    ace.require("ace/ext/language_tools");
    var editor = ace.edit("editor");


    $scope.save = function () {
        var gh = new Octokit({
            username: $scope.githubUserName,
            password: $scope.githubPassword
        });

        if ($scope.githubRepoName == "") {
            var repoName = prompt("Please enter the repository name");
            if (repoName == null) {
                alert("No repo name provided");
                return;
            }
            $scope.githubRepoName = repoName;
            var repoObj = {
                "name": $scope.githubRepoName,
                "description": "Created using XApps",
                "homepage": "https://github.com",
                "private": false,
                "has_issues": true,
                "has_wiki": true,
                "has_downloads": true,
                "auto_init": true
            };


            var user = gh.getUser();
            user.createRepo(repoName, repoObj).then(
                function () {
                    var repo = gh.getRepo($scope.githubUserName, $scope.githubRepoName);
                    var branch = repo.getBranch();

                    $scope.fileContent = editor.getValue();
                    var message = prompt("Commit Message");
                    if (message == null) {
                        message = "Default commit message";
                    }

                    var isBinary = false;

                    branch.write($scope.currentFilePath + "" + $scope.currentFile, $scope.fileContent, message, isBinary)
                        .then(function () {
                            alert("Successfully Commited");
                        });
                }
            );


        } else {
            var repo = gh.getRepo($scope.githubUserName, $scope.githubRepoName);
            var branch = repo.getBranch();

            $scope.fileContent = editor.getValue();
            var message = prompt("Commit Message");
            if (message == null) {
                message = "Default commit message";
            }

            var isBinary = false;

            branch.write($scope.currentFilePath + "" + $scope.currentFile, $scope.fileContent, message, isBinary)
                .then(function () {
                    alert("Successfully Commited");
                });
        }


    };

    function getText() {
        alert("asdasdasas");
    };

    function commitFiles() {
        var repo = gh.getRepo($scope.githubUserName, $scope.githubRepoName);
        var branch = repo.getBranch();

        $scope.fileContent = editor.getValue();
        var message = prompt("Commit Message");
        if (message == null) {
            message = "Default commit message";
        }

        var isBinary = false;

        branch.write($scope.currentFilePath + "" + $scope.currentFile, $scope.fileContent, message, isBinary)
			.then(function () {
			    alert("Successfully Commited");
			});
    }

    $scope.newHtmlFile = function () {
        var fName = prompt("Enter the file name", "myfile.html");
        if (fName == null) {
            return;
        }
        $scope.currentFile = fName;
        var html = "<li><span class='file'> <a ng-click=\"htmlClicked(\'"+fName+"\')\">" + fName + "</a></span></li>";
        
        var branches = $compile(html)($scope).appendTo("#htmlfile");
        $("#browser").treeview({
            add: branches
        });
    };

    $scope.newCssFile = function () {
        var fName = prompt("Enter the file name", "myfile.css");
        if (fName == null) {
            return;
        }
        $scope.currentFile = fName;
        var html = "<li><span class='file'> <a ng-click=\"cssClicked(\'" + fName + "\')\">" + fName + "</a></span></li>";

        var branches = $compile(html)($scope).appendTo("#cssfile");
        $("#browser").treeview({
            add: branches
        });
    };

    $scope.newJsFile = function () {
        var fName = prompt("Enter the file name", "myfile.js");
        if (fName == null) {
            return;
        }
        $scope.currentFile = fName;
        var html = "<li><span class='file'> <a ng-click=\"jsClicked(\'" + fName + "\')\">" + fName + "</a></span></li>";

        var branches = $compile(html)($scope).appendTo("#jsfile");
        $("#browser").treeview({
            add: branches
        });
    };

    $scope.htmlClicked = function (tmpFile) {
        //alert(tmpFile);
        $scope.currentFile = tmpFile;
        alert("Current working file : "+$scope.currentFile);
        editor.getSession().setMode("ace/mode/html");
        editor.setValue("");
        $scope.currentFileType = "html";
        $scope.currentFilePath = "html/";
    };

    $scope.jsClicked = function (tmpFile) {
        
        $scope.currentFile = tmpFile;
        alert("Current working file : " + $scope.currentFile);
        editor.getSession().setMode("ace/mode/javascript");
        editor.setValue("");
        $scope.currentFileType = "js";
        $scope.currentFilePath = "javascript/";
    };

    $scope.cssClicked = function (tmpFile) {
        
        $scope.currentFile = tmpFile;
        alert("Current working file : " + $scope.currentFile);
        editor.getSession().setMode("ace/mode/css");
        editor.setValue("");
        $scope.currentFileType = "css";
        $scope.currentFilePath = "css/";
    };

});


