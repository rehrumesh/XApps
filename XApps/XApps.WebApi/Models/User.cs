using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace XApps.WebApi.Models
{
    public class User
    {
        public int UserID { get; set; }
        public string UserName { get; set; }
        public String Email { get; set; }
        public String Designation { get; set; }
        public String Department { get; set; }
        public String Contact { get; set; }

        public virtual ICollection<App> Apps { get; private set; }
        public virtual ICollection<UserApp> UserApps { get; private set; }
        public virtual ICollection<Rating> Ratings { get; private set; }
        public virtual ICollection<Feedback> Feedbacks { get; private set; }
    }
}