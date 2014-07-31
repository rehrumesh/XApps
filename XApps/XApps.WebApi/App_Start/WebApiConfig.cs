using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;

namespace XApps.WebApi
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services
            config.EnableCors();
            // Web API routes
            config.MapHttpAttributeRoutes();

            //new route 
            config.Routes.MapHttpRoute(
                name: "ActionApi",
                routeTemplate: "api/{controller}/AppByAppName/{Appname}",
                defaults: new { Appname = RouteParameter.Optional }
                );

            
             config.Routes.MapHttpRoute(
                name: "Action2Api",
                routeTemplate: "api/{controller}/AppBycategory/{CategoryName}",
                defaults: new { Appname = RouteParameter.Optional }
                );

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );

            config.Formatters.XmlFormatter.SupportedMediaTypes.Remove(
                config.Formatters.XmlFormatter.SupportedMediaTypes.FirstOrDefault(t => t.MediaType == "application/xml"));

            config.Routes.MapHttpRoute(
                name: "UserActionApi",
                routeTemplate: "api/{controller}/UserByUserName/{UserName}",
                defaults: new {UserName = RouteParameter.Optional }
                );

            //Getusersbyappid
            /*
            config.Routes.MapHttpRoute(
                name: "UsersByAppIDApi",
                routeTemplate: "api/{contoller}/UsersByAppID/{AppID}",
                defaults: new { AppID = RouteParameter.Optional }
                );
             */ 
        }
    }
}
