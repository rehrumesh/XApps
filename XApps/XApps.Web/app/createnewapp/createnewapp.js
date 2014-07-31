app.controller('createnewapp', function ($scope, $compile, $q, $http,$location, requestFactory, AppsFactory, categoriesFactory, AppsByNameFactory, dynamics,userFactory) {
    $scope.devName = "Rumesh";
    $scope.path = "<li><span class='file'>BIZAPP.css</span></li>";
    $scope.githubUserName = "Xapps00";
    $scope.githubPassword = "xapps00xapps00";
    $scope.githubRepoName = "";
    $scope.currentFile = "hello.js";
    $scope.currentFileType = 0;     //0 HTML 1 CSS 2 JS
    $scope.currentFilePath = "src/";
    $scope.fileContent = "";
    $scope.show_repo_list = false;
    $scope.showloading_in = false;
    $scope.showloading_out = false;
    $scope.appCategory;
    $scope.tempAppName = "App";
    $scope.tempdir = "Hello";
    $scope.appDetails = {};
    $scope.isRepoOnGitHub = false;
    $scope.userList = null;     //loaded whenpublishUserList function called.

    $scope.createNewA = {
        AppName: "App",
        CategoryID: 1,
        AuthorID: "1",
        UserCount: 2,
        RepoName: "App",
        LatestHash: "",
        isPublished: false
    };



    $scope.isEditingApp = false;

    $scope.allcategories = categoriesFactory.query();
    //$scope.allapps = AppsFactory.query({aName:"slideshare"});
    $scope.allapps = AppsFactory.query();

    var editor;

    $scope.onViewLoaded = function () {
        ace.require("ace/ext/language_tools");
        editor = ace.edit("editor");

        editor.setTheme("ace/theme/Eclipse");
        editor.getSession().setMode("ace/mode/javascript");

        editor.setShowPrintMargin(false);
        editor.setReadOnly(true);

        editor.setOptions({
            enableBasicAutocompletion: true,
            enableSnippets: true
        });
    };

    $scope.update = function () {

        $scope.createNewA.CategoryID = $scope.appCategory.CategoryID;
        console.log($scope.createNewA.CategoryID + "    " + $scope.createNewA.AppName);
        //console.log($scope.createNewA.CategoryName);
        //console.log($scope.allapps);
    };

    $scope.app = [
            {
                appName: "newapp",
                children: [
                    {
                        folderName: "HTML",
                        children: [
                            //{
                            //    fileName: "appindex.html",
                            //    context: "<html>",
                            //    hasChanged: true,
                            //    hash: "",
                            //    path: "html/"
                            //}
                        ]
                    },

                    {
                        folderName: "CSS",
                        children: []
                    },

                    {
                        folderName: "Javascript",
                        children: []
                    }
                ]
            }
    ];

    //Filetree : 0 -> HTML
    //Filetree : 1 -> CSS
    //Filetree : 2 -> JS


    $scope.home = function() {
        $scope.app = [
            {
                appName: "newapp",
                children: [
                    {
                        folderName: "HTML",
                        children: [
                            
                        ]
                    },

                    {
                        folderName: "CSS",
                        children: []
                    },

                    {
                        folderName: "Javascript",
                        children: []
                    }
                ]
            }
        ];
        $scope.githubRepoName = "";
        $scope.currentFile = "";
        $scope.currentFileType = 0;     //0 HTML 1 CSS 2 JS
        $scope.currentFilePath = "";
        $scope.fileContent = "";
        $scope.show_repo_list = false;
        $scope.appCategory = null;
        $scope.appDetails = {};
        $scope.isRepoOnGitHub = false;

        
        $("ul#htmlfile").empty();
        $("ul#cssfile").empty();
        $("ul#jsfile").empty();
        editor.setReadOnly(true);
        editor.setValue("");
    };

    function getFileFromApp(fileName, fileTree) {
        var tmpObj = null;

        for (var obj in $scope.app[0].children[fileTree].children) {
            //alert('File Name : ' + fileName+ '   obj.filename : '+obj.fileName);

            if ($scope.app[0].children[fileTree].children[obj].fileName == fileName) {

                tmpObj = obj;
                break;
            }
        }
        return tmpObj;

    }

    $scope.createNewApp = function () {
        $scope.home();
        $scope.isEditingApp = true;
        //console.log($scope.createNewA);
        $scope.githubRepoName = $scope.createNewA.AppName;
        $scope.createNewA.RepoName = $scope.createNewA.AppName;
        //$scope.createNewA.CategoryName = "News";
        //alert(JSON.stringify($scope.createNewA));
        AppsFactory.save($scope.createNewA, function () {
            makeToast("App created successfully", 2);
            editor.setReadOnly(false);
            
            $('span#treeappname').html($scope.githubRepoName);


        });



    };
    
    $scope.saveGit = function () {
        var gh = new Octokit({
            username: $scope.githubUserName,
            password: $scope.githubPassword
        });
        console.log("savegit : 1");
        //create commite object
        var commitJSON = "{";
        var start = 0;
        for (var i in $scope.app[0].children) {
            for (var j in $scope.app[0].children[i].children) {
                if ($scope.app[0].children[i].children[j].hasChanged == true) {
                    $scope.app[0].children[i].children[j].hasChanged = false;
                    if (start != 0) {
                        start++;
                        commitJSON += ',';
                    } else if (start == 0) {
                        start++;
                    }
                    var content = $scope.app[0].children[i].children[j].context;
                    content = content.replace(/"/g, '\\"');
                    commitJSON += '"' + $scope.app[0].children[i].children[j].path + $scope.app[0].children[i].children[j].fileName + '":"' + content + '"';

                } else {

                }
            }
        }
        commitJSON += "}";
        commitJSON = commitJSON.replace(/\n/g, '\\n');
        //alert(commitJSON);
        var commitObj = JSON.parse(commitJSON);
        //alert(commitObj);

        console.log("savegit: 2");
        if ($scope.githubRepoName == "") {
            var repoName = prompt("Please enter the App/repository name");
            if (repoName == null) {
                makeToast("No repo name provided", 3);
                return;
            } else if (repoName == "") {
                makeToast("No repo name provided", 3);
                return;
            }
            $scope.githubRepoName = repoName;
            $scope.app.appName = repoName;
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
                    var isBinary = false;

                    $scope.fileContent = editor.getValue();
                    var message = prompt("Commit Message");
                    if (message == null) {
                        message = "Default commit message";
                    }
                    $scope.showloading_in = true;
                    branch.writeMany(commitObj, message)
                        .then(function () {
                            requestFactory.getResponse($scope.githubRepoName, 1);
                            $scope.showloading_in = false;
                            makeToast("Successfully Commited", 2);
                            $scope.isRepoOnGitHub = true;
                    });


                }
            );


        } else {
            console.log("savegit: 3");
            var repo = gh.getRepo($scope.githubUserName, $scope.githubRepoName);
            //alert(JSON.stringify(repo));
            //alert(repo.branch);
            console.log("savegit: 4");
            if (repo.branch == null) {
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
                console.log("savegit: 5");



                if ($scope.isRepoOnGitHub) {
                    var branch = repo.getBranch();
                    console.log("savegit: 8");
                    $scope.fileContent = editor.getValue();
                    var message = prompt("Commit Message");
                    if (message == null) {
                        message = "Default commit message";
                    }

                    var isBinary = false;
                    $scope.showloading_in = true;
                    branch.writeMany(commitObj, message)
                                .then(function () {
                                    console.log("savegit: 9");
                                    requestFactory.getResponse($scope.githubRepoName, 1);
                                    $scope.showloading_in = false;
                                    makeToast("Successfully Commited", 2);
                                    $scope.isRepoOnGitHub = true;
                                });
                } else {
                    user.createRepo($scope.githubRepoName, repoObj).then(
                    function () {
                        console.log("savegit: 6");
                        var repo = gh.getRepo($scope.githubUserName, $scope.githubRepoName);
                        var branch = repo.getBranch();
                        var isBinary = false;

                        $scope.fileContent = editor.getValue();
                        var message = prompt("Commit Message");
                        if (message == null) {
                            message = "Default commit message";
                        }
                        console.log("savegit: 7");
                        $scope.showloading_in = true;
                        branch.writeMany(commitObj, message)
                            .then(function () {
                                requestFactory.getResponse($scope.githubRepoName, 1);
                                $scope.showloading_in = false;
                                makeToast("Successfully Commited", 2);
                                $scope.isRepoOnGitHub = true;

                            });


                    }
                );
                }

                
            } else {
                var branch = repo.getBranch();
                console.log("savegit: 8");
                $scope.fileContent = editor.getValue();
                var message = prompt("Commit Message");
                if (message == null) {
                    message = "Default commit message";
                }

                var isBinary = false;
                $scope.showloading_in = true;
                branch.writeMany(commitObj, message)
                            .then(function () {
                                console.log("savegit: 9");
                                requestFactory.getResponse($scope.githubRepoName, 1);
                                $scope.showloading_in = false;
                                makeToast("Successfully Commited", 2);
                                $scope.isRepoOnGitHub = true;
                            });
            }


        }


    };

    $scope.saveFile = function () {
        //alert('C File :' + $scope.currentFile + '  type: ' + $scope.currentFileType);
        for (var tmp in $scope.app[0].children[$scope.currentFileType].children) {
            //alert("Search " + $scope.app[0].children[$scope.currentFileType].children[tmp].fileName);
            if ($scope.app[0].children[$scope.currentFileType].children[tmp].fileName == $scope.currentFile) {
                $scope.app[0].children[$scope.currentFileType].children[tmp].context = editor.getValue();
                $scope.app[0].children[$scope.currentFileType].children[tmp].hasChanged = true;
                makeToast("File saved successfully", 2);
                return;
            }

        }
    };

    $scope.newHtmlFile = function () {
        var fName = prompt("Enter the file name", "index.html");
        if (fName == null || fName == "") {
            return;
        }
        $scope.currentFile = fName;
        $scope.app[0].children[0].children.push({
            fileName: fName,
            context: "<html></html>",
            hasChanged: true,
            hash: "",
            path: "html/"

        });

        var html = "<li><span class='file'> <a ng-click=\"htmlClicked(\'" + fName + "\')\">" + fName + "</a></span></li>";

        var branches = $compile(html)($scope).appendTo("#htmlfile");
        $("#browser").treeview({
            add: branches
        });

        makeToast(fName + " created successfully!", 2);
    };

    $scope.newCssFile = function () {
        var fName = prompt("Enter the file name", "myfile.css");
        if (fName == null || fName == "") {
            return;
        }
        $scope.currentFile = fName;
        $scope.app[0].children[1].children.push({
            fileName: fName,
            context: ".css",
            hasChanged: true,
            hash: "",
            path: "css/"
        });
        var html = "<li><span class='file'> <a ng-click=\"cssClicked(\'" + fName + "\')\">" + fName + "</a></span></li>";

        var branches = $compile(html)($scope).appendTo("#cssfile");
        $("#browser").treeview({
            add: branches
        });
        makeToast(fName + " created successfully!", 2);
    };

    $scope.newJsFile = function () {
        var fName = prompt("Enter the file name", "myfile.js");
        if (fName == null || fName == "") {
            return;
        }
        $scope.currentFile = fName;
        $scope.app[0].children[2].children.push({
            fileName: fName,
            context: "//JS Code",
            hasChanged: true,
            hash: "",
            path: "javascript/"
        });
        var html = "<li><span class='file'> <a ng-click=\"jsClicked(\'" + fName + "\')\">" + fName + "</a></span></li>";

        var branches = $compile(html)($scope).appendTo("#jsfile");
        $("#browser").treeview({
            add: branches
        });
        makeToast(fName + " created successfully!", 2);
    };

    $scope.htmlClicked = function (tmpFile) {
        $scope.saveFile();
        $scope.currentFile = tmpFile;

        makeToast("Current working file : " + $scope.currentFile, 1);
        editor.getSession().setMode("ace/mode/html");
        //search file
        var fileObj = getFileFromApp(tmpFile, 0);
        editor.setValue($scope.app[0].children[0].children[fileObj].context);
        $scope.currentFileType = 0;
        $scope.currentFilePath = "html/";
    };

    $scope.jsClicked = function (tmpFile) {
        $scope.saveFile();
        $scope.currentFile = tmpFile;
        makeToast("Current working file : " + $scope.currentFile, 1);
        editor.getSession().setMode("ace/mode/javascript");
        var fileObj = getFileFromApp(tmpFile, 2);
        editor.setValue($scope.app[0].children[2].children[fileObj].context);
        $scope.currentFileType = 2;
        $scope.currentFilePath = "javascript/";
    };

    $scope.cssClicked = function (tmpFile) {
        $scope.saveFile();
        $scope.currentFile = tmpFile;
        makeToast("Current working file : " + $scope.currentFile, 1);
        editor.getSession().setMode("ace/mode/css");
        var fileObj = getFileFromApp(tmpFile, 1);
        editor.setValue($scope.app[0].children[1].children[fileObj].context);
        $scope.currentFileType = 1;
        $scope.currentFilePath = "css/";
    };


    $scope.loadRepo = function () {
        $scope.showloading_in = true;
        var userName = $scope.githubUserName;
        $scope.repoList;
        $http.get("https://api.github.com/users/" + userName + "/repos")
            .success(function (data) {
                $scope.showloading_in = false;
                $scope.repoList = data;
                $scope.show_repo_list = true;
                //alert(JSON.stringify($scope.repoList));

            }).error(function () {
                alert("error loading repo");
                makeToast("error loading repo", 3);
                $scope.showloading_in = false;
            });
    };

    $scope.openRepo = function (repo) {
        $scope.home();

        $scope.show_repo_list = false;
        $scope.showloading_out = true;
        $scope.app[0].children[0].children = [];
        $scope.app[0].children[1].children = [];
        $scope.app[0].children[2].children = [];
        //$('#browser').empty().html(branches);

        var userName = $scope.githubUserName;
        var repoName = repo;
        var filesResponseObj;
        var contentResponseObj = Array();
        var counter1 = 0;
        var counter2 = 0;

        $('span#treeappname').html(repo);
        editor.setReadOnly(false);
        $http.get("https://api.github.com/repos/" + userName + "/" + repoName + "/git/trees/master?recursive=1")
            .success(function (data) {
                $scope.githubRepoName = repoName;
                $scope.isRepoOnGitHub = true;
                repoRequest(data);
            }).error(function () {
                //alert("error loading repo");
                $scope.showloading_out = false;
                makeToast("Failed to open app " + repoName, 3);
            });

        function repoRequest(data) {
            filesResponseObj = data;

            for (var i = 0; i < Object.keys(filesResponseObj.tree).length; i++) {

                if (filesResponseObj.tree[i].type == "blob") {
                    counter1++;
                    $http.get("https://api.github.com/repos/" + userName + "/" + repoName + "/git/blobs/" + filesResponseObj.tree[i].sha)
                        .success(function (data) {
                            contentRequest(data);
                        }).error(function () {
                            makeToast("error loading content", 3);
                        });
                }
            }
        }

        function contentRequest(data) {
            contentResponseObj.push(data);
            if (++counter2 == counter1) defer.resolve();

        }

        var defer = $q.defer();
        defer.promise.then(function () {

            $scope.app.appName = repoName;
            $scope.githubRepoName = $scope.app.appName;
            //alert(JSON.stringify(contentResponseObj));
            for (var i = 0; i < Object.keys(filesResponseObj.tree).length; i++) {
                for (var j = 0; j < Object.keys(contentResponseObj).length; j++) {

                    if (filesResponseObj.tree[i].sha == contentResponseObj[j].sha) {
                        var path = filesResponseObj.tree[i].path;
                        //var content = decodeBase64(contentResponseObj[j].content);
                        var content = window.atob(contentResponseObj[j].content);
                        var pathDecomposed = path.split("/");

                        if (pathDecomposed[0] == "html" && pathDecomposed.length == 2) {
                            $scope.app[0].children[0].children.push({
                                fileName: pathDecomposed[1],
                                context: content,
                                hasChanged: false,
                                hash: filesResponseObj.tree[i].sha,
                                path: "html/"

                            }); //alert(pathDecomposed[0] + " : " + pathDecomposed[1] + " : " + content);
                            var html = "<li><span class='file'> <a ng-click=\"htmlClicked(\'" + pathDecomposed[1] + "\')\">" + pathDecomposed[1] + "</a></span></li>";

                            var branches = $compile(html)($scope).appendTo("#htmlfile");
                            $("#browser").treeview({
                                add: branches
                            });
                        } else if (pathDecomposed[0] == "javascript" && pathDecomposed.length == 2) {
                            $scope.app[0].children[2].children.push({
                                fileName: pathDecomposed[1],
                                context: content,
                                hasChanged: false,
                                hash: filesResponseObj.tree[i].sha,
                                path: "javascript/"
                            });//alert(pathDecomposed[0] + " : " + pathDecomposed[1] + " : " + content);
                            var html = "<li><span class='file'> <a ng-click=\"jsClicked(\'" + pathDecomposed[1] + "\')\">" + pathDecomposed[1] + "</a></span></li>";

                            var branches = $compile(html)($scope).appendTo("#jsfile");
                            $("#browser").treeview({
                                add: branches
                            });

                        } else if (pathDecomposed[0] == "css" && pathDecomposed.length == 2) {
                            $scope.app[0].children[1].children.push({
                                fileName: pathDecomposed[1],
                                context: content,
                                hasChanged: false,
                                hash: filesResponseObj.tree[i].sha,
                                path: "css/"

                            });
                            var html = "<li><span class='file'> <a ng-click=\"cssClicked(\'" + pathDecomposed[1] + "\')\">" + pathDecomposed[1] + "</a></span></li>";

                            var branches = $compile(html)($scope).appendTo("#cssfile");
                            $("#browser").treeview({
                                add: branches
                            });

                        }

                    }
                }
            }
            $scope.showloading_out = false;
            makeToast(repoName + " app opened", 2);
        });


    };

    $scope.publishApp = function () {
        //modify app details on database
        var a = AppsByNameFactory.query({ appname: $scope.githubRepoName });
        a.$promise.then(function (obj) {
            var tempObj = {
                AppID: obj.AppID,
                AppName: obj.AppName,
                AurthorID: obj.AurthorID,
                CategoryID: obj.CategoryID,
                UserCount: obj.UserCount,
                RepoName: obj.RepoName,
                LatestHash: obj.LatestHash,
                isPublished: true,
                description: obj.description
            };
            $scope.appDetails = tempObj;
            //alert(JSON.stringify(tempObj));

            AppsFactory.update({ id: obj.AppID }, tempObj, function () {
                //makeToast("App details updated", 2);
                requestFactory.getResponse($scope.githubRepoName, 2);
            });
        });

        //alert(JSON.stringify(a));


    };

    $scope.addAppDetailsToDb = function() {
        //TO BE IMPLEMENT
    };

    $scope.updateAppDetails = function() {
        //TO BE IMPLEMENT
    };


    $scope.ChangeTheme = function (theme1) {

        ace.require("ace/ext/language_tools");
        editor = ace.edit("editor");
        var theme = theme1;
        editor.setTheme("ace/theme/" + theme);
        editor.getSession().setMode("ace/mode/javascript");
        makeToast(" Theme Changed to " + theme + " successfully!", 2);

    };

    $scope.Search = function (searchWord) {

        ace.require("ace/ext/language_tools");
        editor = ace.edit("editor");
        editor.find(searchWord, {
            backwards: false,
            wrap: false,
            caseSensitive: false,
            wholeWord: false,
            regExp: false
        });
        editor.findNext();
        editor.findPrevious();
        makeToast(" Search Function!!! " + searchWord, 2);
    };


    $scope.gotoLine = function () {

        var lineNumber = prompt("Please enter the line number", "1");
        editor.gotoLine(lineNumber);
    };

    $scope.create = function() {
        var shortName = $scope.shortname;
        var version = '0.1';
        var displayName = $scope.displayname;
        var maxSize = $scope.maxsize;
        db = openDatabase(shortName, version, displayName, maxSize);
        if (db != null) {
            makeToast("Database \" " + displayName + "\" created!", 2);
        } else {
            makeToast("Database \"" + displayName + "\" failed to inisilze ", 3);
        }

    };

    $scope.runquery = function() {
        var appquery = $scope.mymodel.query;
        db.transaction(
            function(transaction) {

                transaction.executeSql(appquery, undefined, function() { makeToast("Query Excution Successful", 2); }, function() { makeToast("Query Excution Failed", 3); }
                );
            });
    };

    $scope.previewApp = function () {
        //dynamics.addRoute('/dev/' + $scope.githubRepoName, {
        //    templateUrl: 'app/apps/dev/' + $scope.githubRepoName + '/html/index.html'
        //});

        ////compare hashes
        ////if hash equals
        
        var re = $scope.githubRepoName;
        window.open("http://localhost:6406/#/dev/" + $scope.githubRepoName);
        //$location.path('/dev/' + $scope.githubRepoName);
    };

    $scope.ChangeSize = function (size) {

        document.getElementById('editor').style.fontSize = size + 'px';
    };

    $scope.Comment = function () {
        ace.require("ace/ext/language_tools");
        editor = ace.edit("editor");
        editor.toggleCommentLines();
    };

    $scope.Indent = function () {
        ace.require("ace/ext/language_tools");
        editor = ace.edit("editor");
        editor.indent();
    };

    $scope.publishUserList = function () {
        $scope.userList = userFactory.query();
    };

});

