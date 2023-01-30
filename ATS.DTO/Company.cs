using System;

namespace ATS.DTO
{
    public class Company : AbstractDataObject
    {
        public int CompanyID 
        {
            get { return base.RecordID; }
            set { base.RecordID = value; }
        }
        public string CompanyName { get; set; }
        public string CompanyURL { get; set; }
        public string Phone { get; set; }
        public string City { get; set; }
        public int StateID { get; set; }
        [Ignore]
        public string StateName { get; set; }
        public int CountryID { get; set; }
        [Ignore]
        public string CountryName { get; set; }
        public string ZIPCode { get; set; }
        public bool IsActive { get; set; }
    }
}
