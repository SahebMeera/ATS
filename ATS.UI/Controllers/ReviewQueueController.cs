using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Authorization;

using ATS.DTO;
using ATS.DAL;
using Microsoft.AspNetCore.Http;

namespace ATS.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ReviewQueueController : BaseController
    {
        private IConfiguration _config;
        ReviewQueueFactory reviewQueueFac;
        public ReviewQueueController(IConfiguration config, IHttpContextAccessor contextAccessor) : base(contextAccessor)
        {
            _config = config;
            reviewQueueFac = new ReviewQueueFactory(base.ConString, _config);
        }

        [HttpGet]
        public List<ReviewQueue> Get()
        {
            ReviewQueue reviewQueue = new ReviewQueue();
            if (this.RoleShort != "SUPERADMIN")
                reviewQueue.CompanyID = this.companyID;
            List<ReviewQueue> reviewQueues = reviewQueueFac.GetList(reviewQueue).Data;
            reviewQueues.ForEach(x =>
            {
                if (!String.IsNullOrEmpty(x.FileName))
                {
                    x.ResumeURL = "https://stvmilt.blob.core.windows.net/devats/" + x.FileName;
                }
            });
            return reviewQueues;
        }

        [HttpGet("{id}")]
        public ReviewQueue Get(int id)
        {
            ReviewQueue reviewQueue = new ReviewQueue();
            reviewQueue.ReviewQueueID = id;
            return reviewQueueFac.GetByID<ReviewQueue>(reviewQueue).Data;
        }

        [HttpGet("GetReviewQueueCandidate/{RequirementID}")]
        public List<ReviewQueue> GetReviewQueueCandidate(int RequirementID)
        {
            ReviewQueue reviewQueue = new ReviewQueue();
            //if (this.RoleShort != "SUPERADMIN")
            //    reviewQueue.CompanyID = this.companyID;
            reviewQueue.RequirementID = RequirementID;
            List<ReviewQueue> reviewQueues = reviewQueueFac.GetList(reviewQueue).Data;
            reviewQueues.ForEach(x =>
            {
                if (!String.IsNullOrEmpty(x.FileName))
                {
                    x.ResumeURL = "https://stvmilt.blob.core.windows.net/devats/" + x.FileName;
                }
            });
            return reviewQueues;
        }

        [HttpPost]
        public ReviewQueue Post([FromBody] ReviewQueue reviewQueue)
        {
            return reviewQueueFac.Save<ReviewQueue>(reviewQueue).Data;
        }

        [HttpPost("UpdateReviewQueueStatus")]
        public List<ReviewQueue> UpdateReviewQueueStatus([FromBody] List<ReviewQueue> reviewQueues)
        {
            List<ReviewQueue> rQueue = new List<ReviewQueue>();
            foreach (ReviewQueue reviewQueue in reviewQueues)
            {
                ReviewQueue queue = reviewQueueFac.Save<ReviewQueue>(reviewQueue).Data;
                rQueue.Add(queue);
            }
            return rQueue;
        }

        [HttpPut("{id}")]
        public ReviewQueue Put(int id, [FromBody] ReviewQueue reviewQueue)
        {
            reviewQueue.ReviewQueueID = id;
            return reviewQueueFac.Save<ReviewQueue>(reviewQueue).Data;
        }
    }
}
