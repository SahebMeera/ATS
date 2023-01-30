using System;

namespace ATS.DTO
{
    public class ReviewQueue : AbstractDataObject
    {
        public int ReviewQueueID
        {
            get { return base.RecordID; }
            set { base.RecordID = value; }
        }
        public int RequirementID { get; set; }
        public int CandidateID { get; set; }
        public int? CompanyID { get; set; }
        [Ignore]
        public int? CandidateCompanyID { get; set; }
        public int? Rate { get; set; }
        public int? RateTypeID { get; set; }
        public int SubmittedBy { get; set; } // current logged in user ID
        public DateTime? DateSubmitted { get; set; }
        public int? ReviewerID { get; set; }
        public DateTime? DateReviewed { get; set; }
        public int ReviewStatusID { get; set; }  // 8
        public string Note { get; set; }

        [Ignore]
        public string Requirement { get; set; }
        [Ignore]
        public string Candidate { get; set; }
        [Ignore]
        public string RateType { get; set; }
        [Ignore]
        public string SubmittedByName { get; set; }
        [Ignore]
        public string Reviewer { get; set; }
        [Ignore]
        public string ReviewStatus { get; set; }
        [Ignore]
        public string ResumeURL { get; set; }
        [Ignore]
        public string FileName { get; set; }
        [Ignore]
        public string WorkAuth { get; set; }
    }

}
