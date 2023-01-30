using System;
using System.Collections.Generic;

namespace ATS.DTO
{
    public partial class Country : AbstractDataObject
    {
        public int CountryID
        {
            get { return base.RecordID; }
            set { base.RecordID = value; }
        }
        public string CountryShort { get; set; }
        public string CountryName { get; set; }
        public bool IsActive { get; set; }
        public List<State> States{ get; set; }
    }
}
