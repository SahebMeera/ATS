using System;

namespace ATS.DTO
{
    public class Client : AbstractDataObject
    {
        public int ClientID
        {
            get { return base.RecordID; }
            set { base.RecordID = value; }
        }
        public string ClientName { get; set; }
        public int CompanyID { get; set; }
        [Ignore]
        public string CompanyName { get; set; }
        public int ClientTypeID { get; set; }
        [Ignore]
        public string ClientType { get; set; }
        public int Markup { get; set; }
    }
}
