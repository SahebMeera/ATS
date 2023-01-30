using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Authorization;

using ATS.DTO;
using ATS.DAL;
using Microsoft.AspNetCore.Http;
using System.IO;
using System.Threading.Tasks;
using Azure.Storage.Blobs;
using System.Text;
using Azure.Storage.Blobs.Models;
using System.Linq;

namespace ATS.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CandidateController : BaseController
    {
        private IConfiguration _config;
        CandidateFactory canFac;
        ResumeFactory resumeFactory;

        public CandidateController(IConfiguration config, IHttpContextAccessor contextAccessor) : base(contextAccessor)
        {
            _config = config;
            canFac = new CandidateFactory(base.ConString, _config);
            resumeFactory = new ResumeFactory(base.ConString, _config);
        }

        [HttpGet("GetCandidates/{isPublic}/{RequirementID?}")]
        public List<Candidate> Get(bool isPublic, int RequirementID = 0)
        {
            Candidate candidate = new Candidate();
            candidate.RequirementID = RequirementID;
            candidate.IsPublic = isPublic;
            if (this.RoleShort != "SUPERADMIN")
                candidate.CompanyID = this.companyID;

            List<Candidate> candidates = canFac.GetList(candidate).Data;

            candidates.ForEach(x =>
            {
                //if (x.ResumeBytes != null)
                //{
                //    x.ResumeBase64 = Convert.ToBase64String(x.ResumeBytes);
                //}
                if (!String.IsNullOrEmpty(x.FileName))
                {
                    x.ResumeURL = "https://stvmilt.blob.core.windows.net/devats/" + x.FileName;
                }
            });
            return candidates;
            //return canFac.GetList(candidate).Data;
            //return new List<Candidate>();
        }

        [HttpGet("{id}")]
        public Candidate Get(int id)
        {
            Candidate candidate = new Candidate();
            candidate.CandidateID = id;
            candidate = canFac.GetByID<Candidate>(candidate).Data;
            candidate.ResumeURL = "https://stvmilt.blob.core.windows.net/devats/" + candidate.FileName;
            return candidate;
        }

        [HttpPost]
        public Candidate Post([FromBody] Candidate candidate)
        {
            return canFac.Save<Candidate>(candidate).Data;
        }

        [HttpPut("{id}")]
        public Candidate Put(int id, [FromBody] Candidate candidate)
        {
            candidate.CandidateID = id;
            return canFac.Save<Candidate>(candidate).Data;
        }


        [HttpPost("Upload/{CandidateId}/{FileName}")]
        public async Task Upload(int CandidateId, string FileName)
        {
            var file = Request.Form.Files[0];
            var filePath = Path.GetTempFileName();
            byte[] data;
            string ext, fileContent = "";

            Candidate candidate = new Candidate();
            candidate.CandidateID = CandidateId;
            candidate = canFac.GetByID<Candidate>(candidate).Data;

            ext = file.FileName.Split('.').LastOrDefault();

            string candidateFileName = ""; 
            if (candidate != null)
                candidateFileName = candidate.FileName.Split('.')[0].Trim();

            if (!String.IsNullOrEmpty(candidateFileName))
            {
                FileName = candidateFileName;
            }
            else
            {
                FileName =  FileName.Trim() + '-' + Guid.NewGuid().ToString();
            }

            var connectionString = _config["AzureBlobConnectionString"];
            BlobServiceClient blobServiceClient = new BlobServiceClient(connectionString);
            BlobContainerClient containerClient = blobServiceClient.GetBlobContainerClient("devats");
            await containerClient.CreateIfNotExistsAsync();
            BlobClient blobClient = containerClient.GetBlobClient(FileName+'.'+ext);

            BlobHttpHeaders httpHeaders = new BlobHttpHeaders()
            {
                ContentType = file.ContentType
            };

            await blobClient.UploadAsync(file.OpenReadStream(), httpHeaders);

            Stream str = file.OpenReadStream();

            if (file.Length > 0)
            {
                //StringBuilder fileContent = new StringBuilder();
                //using (var reader = new  StreamReader(file.OpenReadStream()))
                //{
                //    //file        = reader.ReadToEnd();
                //    while (reader.Peek() >= 0)
                //        fileContent.AppendLine(reader.ReadLine());
                //}

                //string content = file.ContentDisposition;
                // string fileContent;

                // using (var fileStream = file.OpenReadStream())
                // {
                //     using var sr = new StreamReader(fileStream, Encoding.UTF8);
                //     content = sr.ReadToEnd();
                // }

                // using (var stream = file.OpenReadStream())
                // using (var reader = new StreamReader(file.OpenReadStream()))
                // {
                //     fileContent = await reader.ReadToEndAsync();
                // }

                using (var inputStream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(inputStream);
                    data = new byte[inputStream.Length];
                    inputStream.Seek(0, SeekOrigin.Begin);
                    inputStream.Read(data, 0, data.Length);
                }

                Resume resume = new Resume()
                {
                    CandidateID = CandidateId,
                    Data = data,
                    Content = fileContent.ToString(),
                    extension = ext,
                    fileName = FileName,
                    CreatedBy = "Admin"
                };
                resumeFactory.Save(resume);
            }
        }

        [AllowAnonymous]
        [HttpGet("Download/{ResumeID}")]
        public async Task<IActionResult> Download(int ResumeID)
        {
            Resume resume = new Resume()
            {
                ResumeID = ResumeID
            };
            Resume result =  resumeFactory.GetByID(resume).Data;
            string fileName = resume.fileName + resume.extension;

            //FileStream file = System.IO.File.Create(fileName);

            //file.Write(result.Data, 0, result.Data.Length);
            //return file;

           string resumeBase64 = Convert.ToBase64String(result.Data);

            var memStream = new MemoryStream(result.Data);
            return File(memStream, "text/plain", fileName);
        }

    }
}
