using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace XApps.WebApi.Models
{
    public class Category
    {
        public int CategoryID { get; set; }
        public String CategoryName { get; set; }

        public virtual ICollection<App> Apps { get; private set; }
    }
}