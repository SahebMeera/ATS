using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ATS.DTO
{
    public class StatusFlow
    {
        public int ListTypeID { get; set; }
        public int CurrentStatusID { get; set; }
        [Ignore]
        public int NextStatus { get; set; }
    }
}
