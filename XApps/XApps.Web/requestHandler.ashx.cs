using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.Remoting.Channels;
using System.Security.AccessControl;
using System.Security.Principal;
using System.Text;
using System.Web;



namespace XApps.Web
{
    /// <summary>
    /// Summary description for requestHandler
    /// </summary>
    public class requestHandler : IHttpHandler
    {
        private string appPath = "";
        private string appPathDev = "";
        private string appPathPub = "";
        public void ProcessRequest(HttpContext context)
        {
            string path = System.Web.HttpContext.Current.Server.MapPath("/");
            appPath = path + "app\\apps\\";
            appPathDev = path + "app\\apps\\dev\\";
            appPathPub = path + "app\\apps\\pub\\";
            
            try
            {

                context.Response.ContentType = "text/plain";
                string appName = context.Request.QueryString.Get("appid");
                string mode = context.Request.QueryString.Get("mode");  //mode 1 dev mode 2 publish
                if (appName == null)
                {
                    context.Response.StatusCode = 404;
                    context.Response.Write("appid not found");
                    context.Response.End();
                    return;
                }

                if (mode == null)
                {
                    context.Response.StatusCode = 404;
                    context.Response.Write("mode not found");
                    context.Response.End();
                    return;
                }

                if (mode == "1")
                {
                    appPath = appPathDev;
                }
                else if (mode == "2")
                {
                    appPath = appPathPub;
                }


                var credentials = new Octokit.Credentials("Xapps00", "xapps00xapps00");
                var connection = new Octokit.Connection(new Octokit.ProductHeaderValue("XApps"))
                {
                    Credentials = credentials
                };
                var octokitClient = new Octokit.GitHubClient(connection);
                var branch = octokitClient.Repository.GetBranch("xapps00", appName, "master").Result;
                var branchTree = octokitClient.GitDatabase.Tree.Get("xapps00", appName, branch.Commit.Sha).Result;




                if (Directory.Exists(appPath + appName))
                {


                }
                else
                {
                    Directory.CreateDirectory(appPath + appName);


                }


                foreach (var treeItem in branchTree.Tree)
                {
                    if (treeItem.Type.Equals(Octokit.TreeType.Tree))
                    {
                        if (!Directory.Exists(appPath + "/" + appName + "/" + treeItem.Path))
                        {
                            Directory.CreateDirectory(appPath + "/" + appName + "/" + treeItem.Path);
                        }

                        var subBranch = octokitClient.GitDatabase.Tree.Get("xapps00", appName, treeItem.Sha).Result;

                        foreach (var item in subBranch.Tree)
                        {
                            if (item.Type.Equals(Octokit.TreeType.Blob))
                            {
                                var tempBlob = octokitClient.GitDatabase.Blob.Get("xapps00", appName, item.Sha).Result;
                                var tempContents = tempBlob.Content;


                                byte[] data = Convert.FromBase64String(tempContents);
                                string decodedString = Encoding.UTF8.GetString(data);


                                if (!File.Exists(appPath + "/" + appName + "/" + treeItem.Path))
                                {
                                    //File.Create(appPath + "/" + appName + "/" + treeItem.Path+"/"+item.Path);
                                    StreamWriter file =
                                        new StreamWriter(appPath + "/" + appName + "/" + treeItem.Path + "/" + item.Path);
                                    file.Write(decodedString);
                                    file.Close();
                                }
                                else
                                {
                                    //TO-DO: check the hash values from DB and retrive
                                }



                            }
                        }


                    }
                }

                context.Response.StatusCode = 200;
                context.Response.Write("{appName:'" + appName + "', appPath:'" + appPath + "'");
            }
            catch (Exception e)
            {
                context.Response.StatusCode = 404;
            }
            
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}