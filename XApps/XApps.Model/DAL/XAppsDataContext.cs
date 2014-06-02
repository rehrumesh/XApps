using System;
using System.Collections.Generic;
using XApps.Models;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using System.Linq;
using System.Web;

namespace XApps.DAL
{
    public class XAppsDataContext : DbContext
    {
        public XAppsDataContext() : base("XAppsDataContext")
        {
        }

        public DbSet<XApps.Models.App> Apps { get; set; }
        public DbSet<XApps.Models.User> Users { get; set; }
        public DbSet<XApps.Models.UserApp> UserApps { get; set; }
        public DbSet<XApps.Models.Contributor> Contributors { get; set; }
        public DbSet<XApps.Models.Rating> Ratings { get; set; }
        public DbSet<XApps.Models.Feedback> Feedbacks { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
        }
    }
}