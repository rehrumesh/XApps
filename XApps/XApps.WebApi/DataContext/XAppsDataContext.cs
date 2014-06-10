using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using System.Linq;
using System.Web;

namespace XApps.WebApi.DataContext
{
    public class XAppsDataContext: DbContext
    {
        public DbSet<XApps.WebApi.Models.App> Apps { get; set; }
        public DbSet<XApps.WebApi.Models.User> Users { get; set; }
        public DbSet<XApps.WebApi.Models.UserApp> UserApps { get; set; }
        public DbSet<XApps.WebApi.Models.Contributor> Contributors { get; set; }
        public DbSet<XApps.WebApi.Models.Rating> Ratings { get; set; }
        public DbSet<XApps.WebApi.Models.Feedback> Feedbacks { get; set; }
        public DbSet<XApps.WebApi.Models.Category> Categories { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
        }
    }
}