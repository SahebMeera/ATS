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
    public class InterviewScheduleController : BaseController
    {
        private IConfiguration _config;
        InterviewScheduleFactory interviewFac;
        public InterviewScheduleController(IConfiguration config, IHttpContextAccessor contextAccessor) : base(contextAccessor)
        {
            _config = config;
            interviewFac = new InterviewScheduleFactory(base.ConString, _config);
        }

        [HttpGet]
        public List<InterviewSchedule> Get()
        {
            InterviewSchedule interviewSchedule = new InterviewSchedule();
            //if (this.RoleShort == "ADMIN")
            //    interviewSchedule.i = this.companyID;
            return interviewFac.GetList(interviewSchedule).Data;
        }

        [HttpGet("{id}")]
        public InterviewSchedule Get(int id)
        {
            InterviewSchedule interviewSchedule = new InterviewSchedule();
            interviewSchedule.InterviewScheduleID = id;
            return interviewFac.GetByID(interviewSchedule).Data;        
        }

        [HttpPost]
        public InterviewSchedule Post([FromBody] InterviewSchedule interviewSchedule)
        {
            return interviewFac.Save<InterviewSchedule>(interviewSchedule).Data;
        }

        [HttpPut("{id}")]
        public InterviewSchedule Put(int id, [FromBody] InterviewSchedule InterviewSchedule)
        {
            InterviewSchedule.InterviewScheduleID = id;
            return interviewFac.Save<InterviewSchedule>(InterviewSchedule).Data;
        }
    }
}
