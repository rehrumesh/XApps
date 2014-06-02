using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace XApps.Models
{
    public class App
    {
        public int AppID { get; set; }
        public string Name { get; set; }
        public int AuthorID { get; set; }
        public int CategoryID { get; set; }
        public int UserCount { get; set; }
        public String RepoName { get; set; }
        public String LatestHash { get; set; }

        public virtual ICollection<UserApp> UserApps { get; set; }
        public virtual ICollection<Contributor> Contributors { get; set; }
        public virtual ICollection<Rating> Ratings { get; set; }
        public virtual ICollection<Feedback> Feedbacks { get; set; }
        public virtual User Author { get; set; }
    }
}