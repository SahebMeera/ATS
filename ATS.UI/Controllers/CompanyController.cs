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
    public class CompanyController : BaseController
    {
        private IConfiguration _config;
        CompanyFactory comFac;
        public CompanyController(IConfiguration config, IHttpContextAccessor contextAccessor) : base(contextAccessor)
        {
            _config = config;
            comFac = new CompanyFactory(base.ConString, _config);
        }

        [HttpGet]
        public List<Company> Get()
        {
            Company company = new Company();
            if (this.RoleShort == "ADMIN")
                company.CompanyID = this.companyID;
            return comFac.GetList(company).Data;
        }

        [HttpGet("{id}")]
        public Company Get(int id)
        {
            Company company  = new Company();
            company.CompanyID = id;
            return comFac.GetByID(company).Data;        
        }

        [HttpPost]
        public Company Post([FromBody] Company company)
        {
            return comFac.Save<Company>(company).Data;
        }

        [HttpPut("{id}")]
        public Company Put(int id, [FromBody] Company company)
        {
            company.CompanyID = id;
            return comFac.Save<Company>(company).Data;
        }
    }
}
