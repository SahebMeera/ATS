using System;
using System.ComponentModel.DataAnnotations;

namespace ATS.DTO
{
    public class Module: AbstractDataObject
    {
		public int ModuleID
		{
			get { return base.RecordID; }
			set { base.RecordID = value; }
		}
		public string ModuleShort { get; set; }
		[Ignore]
		public string ModuleName { get; set; }
	}
}
