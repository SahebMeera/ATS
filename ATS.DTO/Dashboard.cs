using System;
using System.Collections.Generic;

namespace ATS.DTO
{
    public class Dashboard
    {
        [Ignore]
        public int UserCount { get; set; }
        [Ignore]
        public int CandidateCount { get; set; }
        [Ignore]
        public int ResumeRequests { get; set; }

        [Ignore]
        public int OpenRequirements { get; set; }
        public int CompanyID { get; set; }
    }
}
