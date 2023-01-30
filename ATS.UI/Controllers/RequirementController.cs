using ATS.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;

using ATS.DAL;
using ATS.DTO;

namespace ATS.UI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class RequirementController : BaseController
    {
        private IConfiguration _config;
        RequirementFactory reqFac;
        public RequirementController(IConfiguration config, IHttpContextAccessor contextAccessor) : base(contextAccessor)
        {
            _config = config;
            reqFac = new RequirementFactory(base.ConString, _config);
        }

        [HttpGet("GetRequirement/{isPublic}")]
        public List<Requirement> Get(bool isPublic)
        {
            Requirement Requirement = new Requirement();
            Requirement.IsPublic = isPublic;
            if (this.RoleShort != "SUPERADMIN")
                Requirement.CompanyID = this.companyID;
            return reqFac.GetList(Requirement).Data;
        }

        [HttpGet("{id}")]
        public Requirement Get(int id)
        {
            Requirement requirement = new Requirement();
            requirement.RequirementID = id;
            return reqFac.GetByID<Requirement>(requirement).Data;
        }

        [HttpPost]
        public Requirement Post([FromBody] Requirement requirement)
        {
            return reqFac.Save<Requirement>(requirement).Data;
        }

        [HttpPut("{id}")]
        public Requirement Put(int id, [FromBody] Requirement requirement)
        {
            requirement.RequirementID = id;
            return reqFac.Save<Requirement>(requirement).Data;
        }
    }
}
