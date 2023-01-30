using System;

namespace ATS.DTO
{
    public class User: AbstractDataObject
    {
        public int UserID
        {
            get { return base.RecordID; }
            set { base.RecordID = value; }
        }
        public string Email { get; set; }
        public string Password { get; set; }
        public int CompanyID { get; set; }
        [Ignore]
        public string CompanyName { get; set; }
        public int RoleID { get; set; }
        [Ignore]
        public string RoleName { get; set; }
        public string RoleShort { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        [Ignore]
        public string UserName { get; set; }
        public bool IsActive { get; set; }
        [Ignore]
        public bool IsCompanyActive { get; set; }
        public bool IsTempPassword { get; set; }
    }

    public class UserInfo
    {
        public int ID { get; set; }
        public int CompanyID { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public bool IsTempPassword { get; set; }
        public bool IsValid { get; set; }
        public bool IsActive { get; set; }
        public bool IsCompanyActive { get; set; }
        public string Token { get; set; }
        public int RoleID { get; set; }
        public string RoleShort { get; set; }
        public string RoleName { get; set; }

    }

    public class LoginUser
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
