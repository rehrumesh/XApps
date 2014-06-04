app.controller('createnewapp', function ($scope, $compile, $q, $http, requestFactory) {
    $scope.devName = "Rumesh";
    $scope.path = "<li><span class='file'>BIZAPP.css</span></li>";
    $scope.githubUserName = "Xapps00";
    $scope.githubPassword = "xapps00xapps00";
    $scope.githubRepoName = "";
    $scope.currentFile = "hello.js";
    $scope.currentFileType = 0;     //0 HTML 1 CSS 2 JS
    $scope.currentFilePath = "src/";
    $scope.fileContent = "";
    $scope.showDetails = false;
    $scope.showloading = false;

    ace.require("ace/ext/language_tools");
    var editor = ace.edit("editor");


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
                    commitJSON += '"' + $scope.app[0].children[i].children[j].path + $scope.app[0].children[i].children[j].fileName + '":"' + $scope.app[0].children[i].children[j].context+'"';

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
        var fName = prompt("Enter the file name", "myfile.html");
        if (fName == null || fName == "") {
            return;
        }
        $scope.currentFile = fName;
        $scope.app[0].children[0].children.push({
            fileName: fName,
            context: "My name is rumesh Eranga",
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
        $scope.showloading = true;
        var userName = $scope.githubUserName;
        $scope.repoList;
        $http.get("https://api.github.com/users/" + userName + "/repos")
            .success(function (data) {
                $scope.showloading = false;
                $scope.repoList = data;
                $scope.showDetails = true;
                //alert(JSON.stringify($scope.repoList));
            }).error(function () {
                alert("error loading repo");
            });
    }

    $scope.openRepo = function (repo) {
        $scope.showDetails = false;
        $scope.showloading = true;
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
            //alert(JSON.stringify(contentResponseObj));
            for (var i = 0; i < Object.keys(filesResponseObj.tree).length; i++) {
                for (var j = 0; j < Object.keys(contentResponseObj).length; j++) {
                    
                    if (filesResponseObj.tree[i].sha == contentResponseObj[j].sha) {
                        var path = filesResponseObj.tree[i].path;
                        var content = decodeBase64(contentResponseObj[j].content);
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
            $scope.showloading = false;
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

    };

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

});