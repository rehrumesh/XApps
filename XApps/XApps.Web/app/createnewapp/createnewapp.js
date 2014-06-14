app.controller('createnewapp', function ($scope, $compile, $q, $http, requestFactory, publishedAppsFactory, categoriesFactory) {
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

    $scope.createNewA = {
        AppName: "App",
        CategoryID: 1,
        AuthorID: "1",
        UserCount: 2,
        RepoName :"App",
        LatestHash: "",
        isPublished: false
};
    //$scope.createNewA.AppName = "";
    //$scope.createNewA.CategoryName = "";
    //$scope.createNewA.AuthorID = "";
    //$scope.createNewA.UserCount =2;
    //$scope.createNewA.RepoName ="";
    //$scope.createNewA.LatestHash="";
    //$scope.createNewA.isPublished = false;



    $scope.isEditingApp = false;

    $scope.allcategories = categoriesFactory.query();
    $scope.allapps = publishedAppsFactory.query({aName:"slideshare"});

    var editor;

    $scope.onViewLoaded = function() {
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

    $scope.update = function() {
        
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

    $scope.createNewApp = function() {
        $scope.isEditingApp = true;
        //console.log($scope.createNewA);
        $scope.githubRepoName = $scope.createNewA.AppName;
        $scope.createNewA.RepoName = $scope.createNewA.AppName;
        //$scope.createNewA.CategoryName = "News";
        alert(JSON.stringify($scope.createNewA));
        publishedAppsFactory.save($scope.createNewA, function() {
            makeToast("App created successfully", 2);
            editor.setReadOnly(false);
            //$('#myModal2').popover('hide');

        }); 
        


    };

    


    $scope.saveGit = function () {
        var gh = new Octokit({
            username: $scope.githubUserName,
            password: $scope.githubPassword
        });

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
                    commitJSON += '"' + $scope.app[0].children[i].children[j].path + $scope.app[0].children[i].children[j].fileName + '":"' + $scope.app[0].children[i].children[j].context + '"';

                } else {

                }
            }
        }
        commitJSON += "}";
        commitJSON = commitJSON.replace(/\n/g, '\\n');
        //alert(commitJSON);
        var commitObj = JSON.parse(commitJSON);
        //alert(commitObj);


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

                    branch.writeMany(commitObj, message)
                        .then(function () {
                            makeToast("Successfully Commited", 2);
                        });


                }
            );


        } else {
            var repo = gh.getRepo($scope.githubUserName, $scope.githubRepoName);
            //alert(JSON.stringify(repo));
            //alert(repo.branch);
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
                user.createRepo($scope.githubRepoName, repoObj).then(
                    function () {
                        var repo = gh.getRepo($scope.githubUserName, $scope.githubRepoName);
                        var branch = repo.getBranch();
                        var isBinary = false;

                        $scope.fileContent = editor.getValue();
                        var message = prompt("Commit Message");
                        if (message == null) {
                            message = "Default commit message";
                        }

                        branch.writeMany(commitObj, message)
                            .then(function () {
                                makeToast("Successfully Commited", 2);
                            });


                    }
                );
            } else {
                var branch = repo.getBranch();

                $scope.fileContent = editor.getValue();
                var message = prompt("Commit Message");
                if (message == null) {
                    message = "Default commit message";
                }

                var isBinary = false;
                branch.writeMany(commitObj, message)
                            .then(function () {
                                makeToast("Successfully Commited", 2);
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
        if (fName == null || fName =="") {
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
        //alert(tmpFile);
        $scope.currentFile = tmpFile;
        
        makeToast("Current working file : " + $scope.currentFile,1);
        editor.getSession().setMode("ace/mode/html");
        //search file
        var fileObj = getFileFromApp(tmpFile, 0);
        editor.setValue($scope.app[0].children[0].children[fileObj].context);
        $scope.currentFileType = 0;
        $scope.currentFilePath = "html/";
    };

    $scope.jsClicked = function (tmpFile) {

        $scope.currentFile = tmpFile;
        makeToast("Current working file : " + $scope.currentFile, 1);
        editor.getSession().setMode("ace/mode/javascript");
        var fileObj = getFileFromApp(tmpFile, 2);
        editor.setValue($scope.app[0].children[2].children[fileObj].context);
        $scope.currentFileType = 2;
        $scope.currentFilePath = "javascript/";
    };

    $scope.cssClicked = function (tmpFile) {

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
                $scope.showloading_in = false;
            });
    };

    $scope.openRepo = function (repo) {
        $scope.show_repo_list = false;
        $scope.showloading_out = true;
        $scope.app[0].children[0].children = [];
        $scope.app[0].children[1].children = [];
        $scope.app[0].children[2].children = [];

        var userName = $scope.githubUserName;
        var repoName = repo;
        var filesResponseObj;
        var contentResponseObj = Array();
        var counter1 = 0;
        var counter2 = 0;

        $http.get("https://api.github.com/repos/" + userName + "/" + repoName + "/git/trees/master?recursive=1")
            .success(function (data) {
                repoRequest(data);
            }).error(function () {
                alert("error loading repo");
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
                            alert("error loading content");
                        });
                }
            }
        }

        function contentRequest(data) {
            contentResponseObj.push(data);
            if (++counter2 == counter1) defer.resolve();

        }

        function decodeBase64(s) {
            var e = {}, i, b = 0, c, x, l = 0, a, r = '', w = String.fromCharCode, L = s.length;
            var A = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            for (i = 0; i < 64; i++) { e[A.charAt(i)] = i; }
            for (x = 0; x < L; x++) {
                c = e[s.charAt(x)]; b = (b << 6) + c; l += 6;
                while (l >= 8) { ((a = (b >>> (l -= 8)) & 0xff) || (x < (L - 2))) && (r += w(a)); }
            }
            return r;
        };

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
        

    $scope.testOpen = function() {
        var gh = new Octokit({
            username: $scope.githubUserName,
            password: $scope.githubPassword
        });

        $scope.githubRepoName = "shn";
        var user = gh.getUser();

        var repo = gh.getRepo($scope.githubUserName, $scope.githubRepoName);
        var branch = repo.getBranch();

        //list contents of a folder
        branch.contents('html')
            .then(function(contents) {
                alert(JSON.stringify(contents));
            });

        //read particular file
        branch.read('html/appindex.html')
            .then(function (contents) {
                alert(JSON.stringify(contents));
            });

        /*
        * Steps I suggest
        * from the list contents of a folder part, fill the $scope.app tree. do it for html, javascript, css folders
        * now you have all the files in the tree.
        * then for each element in tree, read the files using 'read particular file' code.
        * all these are promises based calls, so you can block/ or do anythiing as you wish.


        *PLEASE ADD A 'Please Wait' or 'Loading..' popup until files are loaded.
        * refere ng-show
        *   https://docs.angularjs.org/api/ng/directive/ngShow
        *   http://scotch.io/tutorials/javascript/how-to-use-ngshow-and-nghide
        *
        *
        * Note that there is no connection between the file tree view in the createnewapp.html and $scope.app tree.
        * please build a connection between them also.
        */

    };
    // type : 1 info 2 success 3 fail 4 warning

    $scope.publishApp = function() {
        //modify app details on database
        //http request to download files

        requestFactory.getResponse($scope.githubRepoName,2);

    };

    $scope.addAppDetailsToDb = function () { };

    $scope.updateAppDetails = function () { };

    function makeToast(text, type) {
        toastr.options = {
            "closeButton": true,
            "debug": false,
            "positionClass": "toast-bottom-right",
            "onclick": null,
            "showDuration": "300",
            "hideDuration": "1000",
            "timeOut": "5000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        };

        switch (type) {
            case 1:
                toastr.info(text);
                break;
            case 2:
                toastr.success(text);
                break;
            case 3:
                toastr.error(text);
                break;
            case 4:
                toastr.warning(text);
                break;
            default:
                toastr.info(text);
                break;
        }
    }
    $scope.getUser = function () {
        $http.get("https://api.github.com/user")
                .success(function (data) {
                    $scope.userData = data;
                }).error(function () {
                    alert("error login");
                });
        $('.popover-markup > .trigger').popover({
            html: true,
            title: function () {
                return $(this).parent().find('.head').html();
            },
            content: function () {
                return $(this).parent().find('.content').html();
            },
            container: 'body',
            placement: 'bottom'
        });
    }
});


//add create new app menu
    /*
    {
  "login": "octocat",
  "id": 1,
  "avatar_url": "https://github.com/images/error/octocat_happy.gif",
  "gravatar_id": "somehexcode",
  "url": "https://api.github.com/users/octocat",
  "html_url": "https://github.com/octocat",
  "followers_url": "https://api.github.com/users/octocat/followers",
  "following_url": "https://api.github.com/users/octocat/following{/other_user}",
  "gists_url": "https://api.github.com/users/octocat/gists{/gist_id}",
  "starred_url": "https://api.github.com/users/octocat/starred{/owner}{/repo}",
  "subscriptions_url": "https://api.github.com/users/octocat/subscriptions",
  "organizations_url": "https://api.github.com/users/octocat/orgs",
  "repos_url": "https://api.github.com/users/octocat/repos",
  "events_url": "https://api.github.com/users/octocat/events{/privacy}",
  "received_events_url": "https://api.github.com/users/octocat/received_events",
  "type": "User",
  "site_admin": false,
  "name": "monalisa octocat",
  "company": "GitHub",
  "blog": "https://github.com/blog",
  "location": "San Francisco",
  "email": "octocat@github.com",
  "hireable": false,
  "bio": "There once was...",
  "public_repos": 2,
  "public_gists": 1,
  "followers": 20,
  "following": 0,
  "created_at": "2008-01-14T04:33:35Z",
  "updated_at": "2008-01-14T04:33:35Z",
  "total_private_repos": 100,
  "owned_private_repos": 100,
  "private_gists": 81,
  "disk_usage": 10000,
  "collaborators": 8,
  "plan": {
    "name": "Medium",
    "space": 400,
    "private_repos": 20,
    "collaborators": 0
  }
}
    */
