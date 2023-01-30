using System;

namespace ATS.DTO
{
    public class Requirement: AbstractDataObject
    {
        public int RequirementID
        {
            get { return base.RecordID; }
            set { base.RecordID = value; }
        }
        public int CompanyID { get; set; }
        public int ClientID { get; set; }
        [Ignore]
        public string ClientName { get; set; }
        public int ClientTypeID { get; set; }
        public int RequirementTypeID { get; set; }
        public string JobID { get; set; }
        public string JobTitle { get; set; }
        public string JobDesc { get; set; }
        public string InternalNote { get; set; }
        public string PrimarySkills { get; set; }
        public int Duration { get; set; }
        public int? ClientRate { get; set; }
        public int? PayRate { get; set; }
        public int? PayRateTypeID { get; set; }
        public DateTime? DatePosted { get; set; }
        public DateTime? DateClosed { get; set; }
        public string City { get; set; }
        public int StateID { get; set; }
        public int CountryID { get; set; }
        public bool IsRemote { get; set; }
        public int InterviewTypeID { get; set; }
        public int? Priority { get; set; }
        public bool IsHotRequirement { get; set; }
        public bool IsPublic { get; set; }
        public int? AssignedTo { get; set; }
        public int? ReviewerID { get; set; }
        public int? StatusID { get; set; }

        [Ignore]
        public string RequirementType { get; set; }
        [Ignore]

        public string PayRateType { get; set; }
        [Ignore]

        public string StateName { get; set; }
        [Ignore]

        public string StateShort { get; set; }
        [Ignore]

        public string CountryName { get; set; }
        [Ignore]

        public string AssignedToName { get; set; }
        [Ignore]

        public string Status { get; set; }

        [Ignore]

        public string CompanyName { get; set; }

        [Ignore]

        public string Reviewer { get; set; }

        [Ignore]

        public string InterviewType { get; set; }
        [Ignore]

        public string ClientType { get; set; }

    }
}
