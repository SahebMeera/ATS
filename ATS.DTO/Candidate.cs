using System;

namespace ATS.DTO
{
    public class Candidate: AbstractDataObject
    {
        public int CandidateID
        {
            get { return base.RecordID; }
            set { base.RecordID = value; }
        }
        public int CompanyID { get; set; }
        [Ignore]
        public string CompanyName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string LinkedInURL { get; set; }
        public string JobTitle { get; set; }
        public string Skills { get; set; }
        public string Phone { get; set; }
        public string City { get; set; }
        public int StateID { get; set; }
        [Ignore]
        public string StateName { get; set; }
        public int CountryID { get; set; }
        [Ignore]
        public string CountryName { get; set; }
        public int? WorkAuthID { get; set; }
        [Ignore]
        public string WorkAuthorization { get; set; }
        public int? BillingRate { get; set; }
        public int Experience { get; set; }
        public int? AvailabilityID { get; set; }
        [Ignore]
        public string Availability { get; set; }
        public bool IsRelocation { get; set; }
        public bool IsActive { get; set; }
        public bool IsPublic { get; set; }
        [Ignore]
        public string FileName { get; set; }
        [Ignore]
        public int ResumeID { get; set; }

        [Ignore]
        public string ResumeBase64 { get; set; }
        [Ignore]
        public byte[] ResumeBytes { get; set; }
        [Ignore]
        public string ResumeURL { get; set; }
        public int RequirementID { get; set; }
    }
}
