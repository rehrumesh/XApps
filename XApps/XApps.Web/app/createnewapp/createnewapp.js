app.controller('createnewapp', function ($scope, $compile) {
    $scope.devName = "Rumesh";
    $scope.path = "<li><span class='file'>BIZAPP.css</span></li>";
    $scope.githubUserName = "Xapps00";
    $scope.githubPassword = "xapps00xapps00";
    $scope.githubRepoName = "";
    $scope.currentFile = "hello.js";
    $scope.currentFileType = 0;     //0 HTML 1 CSS 2 JS
    $scope.currentFilePath = "src/";
    $scope.fileContent = "";

    ace.require("ace/ext/language_tools");
    var editor = ace.edit("editor");


    $scope.app = [
            {
                appName: "newapp",
                children: [
                    {
                        folderName: "HTML",
                        children: [
                            {
                                fileName: "appindex.html",
                                context: "<html>",
                                hasChanged: true,
                                hash: "",
                                path: "html/"
                            }
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




    $scope.openRepo = function () {
        var userName = $scope.githubUserName;
        var repoName = prompt("Enter the repo name");
        var requestFiles;
        var filesResponseObj;
        var requestContent;
        var contentResponseObj;

        //the following line is to allocate 25mb local storage
        //var fso = new FSO(1024 * 1024 * 25, false);

        function bringFiles() {
            filesResponseObj = JSON.parse(requestFiles.responseText);
            var forLoopVar = 0;

            for (forLoopVar = 0; forLoopVar < Object.keys(filesResponseObj.tree).length; forLoopVar++) {

                if (filesResponseObj.tree[forLoopVar].type == "blob") {

                    function writeContent() {
                        contentResponseObj = JSON.parse(this.responseText);
                        /*//another baase64 decoding algorithm
                        function decode_base64(s) {
                            var e = {}, i, k, v = [], r = '', w = String.fromCharCode;
                            var n = [[65, 91], [97, 123], [48, 58], [43, 44], [47, 48]];

                            for (z in n) { for (i = n[z][0]; i < n[z][1]; i++) { v.push(w(i)); } }
                            for (i = 0; i < 64; i++) { e[v[i]] = i; }

                            for (i = 0; i < s.length; i += 72) {
                                var b = 0, c, x, l = 0, o = s.substring(i, i + 72);
                                    for (x = 0; x < o.length; x++) {
                                        c = e[o.charAt(x)]; b = (b << 6) + c; l += 6;
                                        while (l >= 8) { r += w((b >>> (l -= 8)) % 256); }
                                    }
                            }
                            return r;
                        }*/


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

                        //writeFile decodeBase64(contentResponseObj.content)
                        //text = filesResponseObj.tree[i].path + " *** " + decodeBase64(contentResponseObj.content);
                        alert("file content: " + decodeBase64(contentResponseObj.content));

                    }
                    requestContent = new XMLHttpRequest();
                    requestContent.onload = writeContent;
                    requestContent.open('get', 'https://api.github.com/repos/Xapps00/' + repoName + '/git/blobs/' + filesResponseObj.tree[forLoopVar].sha, true);
                    requestContent.send();

                    // the following method is to check whether the the request is fetched
                    // this writes the fetched http request to the text editor
                    requestContent.onreadystatechange = function () {
                        if (requestContent.readyState == 4 && requestContent.status == 200) {

                            document.getElementById("editor").innerHTML = requestContent.responseText;
                        }
                    }//check method finish from here

                }

            }

        }
        requestFiles = new XMLHttpRequest();
        requestFiles.onload = bringFiles;//.then(function () { alert("came here"); });
        requestFiles.open('get', 'https://api.github.com/repos/Xapps00/' + repoName + '/git/trees/master?recursive=1', true);//https://api.github.com/users/Xapps00/repos
        requestFiles.send();

        /*// the following method is tocheck whether the the request is fetched
        // this writes the fetched http request to the text editor
        requestFiles.onreadystatechange = function () {
            if (requestFiles.readyState == 4 && requestFiles.status == 200) {

                document.getElementById("editor").innerHTML = requestFiles.responseText;

            }
        }*/


        /*
            the problem I want to solve here is,

            first a http call is made and when the data is fetched we call 'bringFiles' function. this function is called asynchronously (line 256)
            all the file paths in the repository will be loaded to 'filesResponseObj' variable as a json object (line 192)
            then for each file loaded we call another http call to bring the content of each file and there we call 'writeContent' function. this function is also called asynchronously (ine 237)
            there we assign all the file content to 'contentResponseObj' variable as a json object

            only when all these asynchronous functions are called we can write content of each file to the local storage.
            how can we know when all these function are over??
            in line 256 i tried using then(). but it doesn't seem to be working. coz then 'bringFiles' will not be called

            we have another option also
            in line 257 and 238 when we open the http call we pass the third parameter as true to say that this all can happen asynchronously
            coz if we make it false the whole app will be stuck until the data is fetched
            so I ddin't try doing that
        */

    };


    // type : 1 info 2 success 3 fail 4 warning
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


