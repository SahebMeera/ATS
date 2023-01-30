using System;

namespace ATS.DTO
{
    public class ListValue : AbstractDataObject
    {
        public int ListValueID
        {
            get { return base.RecordID; }
            set { base.RecordID = value; }
        }
        public int ListTypeID { get; set; }
        public string Type { get; set; }
        public string TypeDesc { get; set; }
        public string Value { get; set; }
        public string ValueShort { get; set; }
        public bool IsActive { get; set; }
    }
}