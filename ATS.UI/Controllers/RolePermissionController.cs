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
    public class RolePermissionController : BaseController
    {
        private IConfiguration _config;
        RolePermissionFactory roleFac;
        public RolePermissionController(IConfiguration config, IHttpContextAccessor contextAccessor) : base(contextAccessor)
        {
            _config = config;
            roleFac = new RolePermissionFactory(base.ConString, _config);
        }

        [HttpGet]
        public List<RolePermission> Get()
        {
            return roleFac.GetList(new RolePermission()).Data;
        }

        [HttpGet("{id}")]
        public RolePermission Get(int id)
        {
            RolePermission rolPermission = new RolePermission();
            rolPermission.RolePermissionID = id;
            return roleFac.GetByID(rolPermission).Data;
        }

        [HttpPost]
        public RolePermission Post([FromBody] RolePermission rolePermission)
        {
            return roleFac.Save(rolePermission).Data;
        }

        [HttpPut("{id}")]
        public RolePermission Put(int id, [FromBody] RolePermission rolePermission)
        {
            rolePermission.RoleID = id;
            return roleFac.Save(rolePermission).Data;
        }

        [HttpDelete("{id}")]
        public Response<RolePermission> Delete(int id)
        {
            RolePermission rolePermission = new RolePermission();
            rolePermission.RolePermissionID = id;
            rolePermission.ModifiedBy = "Admin"; //curent user
            return roleFac.Delete(rolePermission);
        }
    }
}
