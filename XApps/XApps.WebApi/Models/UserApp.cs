using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace XApps.WebApi.Models
{
    public class UserApp
    {
        [Key]
        [Column(Order = 0)]
        public int UserID { get; set; }

        [Key]
        [Column(Order = 1)]
        public int AppID { get; set; }

        public virtual User User { get; set; }
        public virtual App App { get; set; }
    }
}