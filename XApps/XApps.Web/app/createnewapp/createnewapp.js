app.controller('createnewapp', function ($scope) {
    $scope.devName = "Rumesh";

    $scope.githubUserName = "Xapps00";
    $scope.githubPassword = "xapps00xapps00";
    $scope.githubRepoName = "";
    $scope.currentFile = "hello.js";
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
            var repoName = prompt();
            if (repoName == null) {
                alert("No repo name provided");
                return;
            }
            $scope.githubRepoName = repoName;
            var repoObj = {
                "name": $scope.githubRepoName,
                "description": "This is your first repository",
                "homepage": "https://github.com",
                "private": false,
                "has_issues": true,
                "has_wiki": true,
                "has_downloads": true,
                "auto_init": true
            };


            var user = gh.getUser();
            user.createRepo(repoName, repoObj).then(
                function() {
                    commitFiles();
                }
            );


        } else {
            commitFiles();
        }


    };


    function commitFiles()
    {
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
});