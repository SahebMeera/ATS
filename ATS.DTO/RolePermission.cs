using System;
using System.ComponentModel.DataAnnotations;

namespace ATS.DTO
{
    public class RolePermission: AbstractDataObject
    {

		public int RolePermissionID
		{
			get { return base.RecordID; }
			set { base.RecordID = value; }
		}
		public int RoleID { get; set; }
		[Ignore]
		public string RoleName { get; set; }
		[Required]
		[Range(1, 100000)]
		public int ModuleID { get; set; }
		[Ignore]
		public string ModuleShort { get; set; }
		[Ignore]
		public string ModuleName { get; set; }
		public bool View { get; set; }
		public bool Add { get; set; }
		public bool Update { get; set; }
		public bool Delete { get; set; }

	}
}
