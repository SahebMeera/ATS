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
    public class RoleController : BaseController
    {
        private IConfiguration _config;
        RoleFactory roleFac;
        public RoleController(IConfiguration config, IHttpContextAccessor contextAccessor) : base(contextAccessor)
        {
            _config = config;
            roleFac = new RoleFactory(base.ConString, _config);
        }

        [HttpGet]
        public List<Role> Get()
        {
            return roleFac.GetList(new Role()).Data;
        }

        [HttpGet("{id}")]
        public Role Get(int id)
        {
            Role role = new Role();
            return role;        
        }

        [HttpPost]
        public Role Post([FromBody] Role role)
        {
            return role;
        }

        [HttpPut("{id}")]
        public Role Put(int id, [FromBody] Role role)
        {
            role.RoleID = id;
            return role;
        }
    }
}
