using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace XApps.Models
{
    public class User
    {
        [Key]
        public int UserID { get; set; }   
        public string Name { get; set; }
        public String Email { get; set; }
        public String Designation { get; set; }
        public String Department { get; set; }
        public String Contact { get; set; }

        public virtual ICollection<App> Apps { get; set; }
        public virtual ICollection<UserApp> UserApps { get; set; }
        public virtual ICollection<Contributor> Contributors { get; set; }
        public virtual ICollection<Rating> Ratings { get; set; }
        public virtual ICollection<Feedback> Feedbacks { get; set; }
    }
}