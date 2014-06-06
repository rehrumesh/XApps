using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace XApps.WebApi.Models
{
    public class App
    {
        public int AppID { get; set; }
        public string AppName { get; set; }
        public int AuthorID { get; set; }
        public int CategoryID { get; set; }
        public int UserCount { get; set; }
        public String RepoName { get; set; }
        public String LatestHash { get; set; }
        public Boolean isPublished { get; set; }

        public virtual User Author { get; set; }
        public virtual Category Category { get; set; }
        public virtual ICollection<UserApp> UserApps { get; private set; }
        public virtual ICollection<Contributor> Contributors { get; private set; }
        public virtual ICollection<Rating> Ratings { get; private set; }
        public virtual ICollection<Feedback> Feedbacks { get; private set; }
    }
}