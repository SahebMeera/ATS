using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ATS.DTO
{
    public class InterviewSchedule : AbstractDataObject
    {
        public int InterviewScheduleID { get; set; }
        public int ReviewQueueID { get; set; }
        public int ReviewStatusID { get; set; }
        public DateTime? DateInterview { get; set; }
        public int Duration { get; set; }
        public int InterviewTypeID { get; set; }
        [Ignore]
        public string InterviewType { get; set; }
        public string TimeZone { get; set; }
        public string Comment { get; set; }
        public int CommentBy { get; set; }
        [Ignore]
        public string Reviewer { get; set; }

        [Ignore]
        public string Status { get; set; }
        [Ignore]
        public string Candidate { get; set; }
        [Ignore]
        public string Requirement { get; set; }
        [Ignore]
        public string Recruiter { get; set; }
    }
}
