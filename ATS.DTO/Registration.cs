using System;

namespace ATS.DTO
{
    public class Registration : AbstractDataObject
    {
        public int RegistrationID 
        {
            get { return base.RecordID; }
            set { base.RecordID = value; }
        }
        public string Email { get; set; }
        public string Password { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Phone { get; set; }
        public string Company { get; set; }
        public string CompanyURL { get; set; }
        public string City { get; set; }
        public int? StateID { get; set; }
        public string StateName { get; set; }
        public int? CountryID { get; set; }
        public string CountryName { get; set; }
        public string ZIPCode { get; set; }
        public Guid? GUID { get; set; }
        public bool IsActive { get; set; }
        public bool IsComplete { get; set; }
    }
}
