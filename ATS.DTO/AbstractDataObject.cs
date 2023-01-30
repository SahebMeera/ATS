using System;
using System.Text.Json.Serialization;

namespace ATS.DTO
{
    public abstract class AbstractDataObject
    {
        [Ignore]
        public int RecordID { get; set; }
        
        public DateTime? DateCreated { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? DateModified { get; set; }
        public string ModifiedBy { get; set; }
        [Ignore]
        public Byte[] TimeStamp { get; set; }
        //public int ReturnCode { get; set; }
    }
}

[AttributeUsage(AttributeTargets.Property, Inherited = true, AllowMultiple = true)]
sealed class IgnoreAttribute : Attribute
{
    public IgnoreAttribute()
    {

    }
}
