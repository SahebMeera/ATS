
using System;
using System.Collections.Generic;

namespace ATS.DTO
{
    public class Role: AbstractDataObject
    {
        public int RoleID
        {
            get { return base.RecordID; }
            set { base.RecordID = value; }
        }
        public string RoleShort { get; set; }
        public string RoleName { get; set; }
        public bool IsActive { get; set; }
        public List<RolePermission> RolePermissions { get; set; }
    }
}
