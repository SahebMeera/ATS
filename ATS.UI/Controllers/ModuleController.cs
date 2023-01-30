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
    public class ModuleController : BaseController
    {
        private IConfiguration _config;
        ModuleFactory moduleFac;
        public ModuleController(IConfiguration config, IHttpContextAccessor contextAccessor) : base(contextAccessor)
        {
            _config = config;
            moduleFac = new ModuleFactory(base.ConString, _config);
        }

        [HttpGet()]
        public List<Module> Get()
        {
            Module module = new Module();
            return moduleFac.GetList(module).Data;
        }

        [HttpGet("{id}")]
        public Module Get(int id)
        {
            Module module = new Module();
            module.ModuleID = id;
            return moduleFac.GetByID<Module>(module).Data;
        }

        [HttpPost]
        public Module Post([FromBody] Module module)
        {
            return moduleFac.Save<Module>(module).Data;
        }

        [HttpPut("{id}")]
        public Module Put(int id, [FromBody] Module module)
        {
            module.ModuleID = id;
            return moduleFac.Save<Module>(module).Data;
        }
    }
}
