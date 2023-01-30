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
    public class StatusFlowController : BaseController
    {
        private IConfiguration _config;
        StatusFlowFactory statusFlowFac;
        public StatusFlowController(IConfiguration config, IHttpContextAccessor contextAccessor) : base(contextAccessor)
        {
            _config = config;
            statusFlowFac = new StatusFlowFactory(base.ConString, _config);
        }

        [HttpGet("{ListTypeID}/{CurrentStatusID}")]
        public List<StatusFlow> Get(int ListTypeID, int CurrentStatusID)
        {
            StatusFlow statusFlow = new StatusFlow();
            statusFlow.ListTypeID = ListTypeID;
            statusFlow.CurrentStatusID = CurrentStatusID;
            return statusFlowFac.GetList(statusFlow).Data;
        }

        [HttpGet("{id}")]
        public StatusFlow Get(int id)
        {
            StatusFlow statusFlow = new StatusFlow();
            return statusFlowFac.GetByID(statusFlow).Data;        
        }

        [HttpPost]
        public StatusFlow Post([FromBody] StatusFlow statusFlow)
        {
            return statusFlowFac.Save<StatusFlow>(statusFlow).Data;
        }

        [HttpPut("{id}")]
        public StatusFlow Put(int id, [FromBody] StatusFlow statusFlow)
        {
            return statusFlowFac.Save<StatusFlow>(statusFlow).Data;
        }
    }
}
