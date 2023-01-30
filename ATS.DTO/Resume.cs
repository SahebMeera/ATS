using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ATS.DTO
{
    public class Resume : AbstractDataObject
    {
        public int ResumeID { get; set; }
        public int CandidateID { get; set; }
        public byte[] Data { get; set; }
        public string fileName { get; set; }
        public string extension { get; set; }
        public string Content { get; set; }
    }
}
