using System;

namespace ATS.DTO
{
    public partial class State : AbstractDataObject
    {
        public int StateID
        {
            get { return base.RecordID; }
            set { base.RecordID = value; }
        }
        public int CountryID { get; set; }
        [Ignore]
        public string CountryName { get; set; }
        public string StateShort { get; set; }
        public string StateName { get; set; }
    }
}