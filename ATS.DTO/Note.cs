using System;

namespace ATS.DTO
{
    public class Note : AbstractDataObject
    {
        public int NoteID
        {
            get { return base.RecordID; }
            set { base.RecordID = value; }
        }
        public int? RequirementID { get; set; }
        public int? CandidateID { get; set; }
        public int? ReviewQueueID { get; set; }
        public int? ReviewerID { get; set; }
        public int? ReviewStatusID { get; set; }
        public string NoteDesc { get; set; }
        public int NoteBy { get; set; }
        public DateTime? DateNoted { get; set; }
        [Ignore]
        public string Requirement { get; set; }
        [Ignore]
        public string Candidate { get; set; }
        [Ignore]
        public string NoteByName { get; set; }
        [Ignore]
        public string Reviewer { get; set; }
        [Ignore]
        public string ReviewStatus { get; set; }
    }
}