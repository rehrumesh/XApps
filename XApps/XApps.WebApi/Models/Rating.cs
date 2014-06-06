using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace XApps.WebApi.Models
{
    public class Rating
    {
        [Key]
        [Column(Order = 0)]
        public int AppID { get; set; }

        [Key]
        [Column(Order = 1)]
        public int UserID { get; set; }
        public int Ratings { get; set; }

        public virtual App App { get; set; }
        public virtual User User { get; set; }
    }
}