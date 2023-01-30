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
    public class DashboardController : BaseController
    {
        private IConfiguration _config;
        DashboardFactory dashboardFac;

        public DashboardController(IConfiguration config, IHttpContextAccessor contextAccessor) : base(contextAccessor)
        {
            _config = config;
            dashboardFac = new DashboardFactory(base.ConString, _config);
        }

        [HttpGet("{CompanyID}")]
        public Dashboard Get(int CompanyID)
        {
            Dashboard dashboard = new Dashboard();
            if (this.RoleShort != "SUPERADMIN")
                dashboard.CompanyID = this.companyID;
            dashboard = dashboardFac.GetByID<Dashboard>(dashboard).Data;
            return dashboard;
        }

    }
}
