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
    public class ListValueController : BaseController
    {

        private IConfiguration _config;
        ListValueFactory listValueFac;
        public ListValueController(IConfiguration config, IHttpContextAccessor contextAccessor) : base(contextAccessor)
        {
            _config = config;
            listValueFac = new ListValueFactory(base.ConString, _config);
        }

        [HttpGet]
        public List<ListValue>  Get()
        {
            return listValueFac.GetList(new ListValue()).Data;
        }

        [HttpGet("{id}")]
        public ListValue Get(int id)
        {
            ListValue LstVal = new ListValue();
            LstVal.ListValueID = id;
            return listValueFac.GetByID(LstVal).Data;
        }

        [HttpPost]
        public ListValue Post([FromBody] ListValue LstVal)
        {
            return listValueFac.Save(LstVal).Data;
        }

        [HttpPut("{id}")]
        public ListValue Put(int id, [FromBody] ListValue LstVal)
        {
            LstVal.ListValueID = id;
            return listValueFac.Save(LstVal).Data;
        }

        [HttpDelete("{id}/{modifiedBy}")]
        public ListValue Delete(int id, string modifiedBy)
        {
            ListValue LstVal = new ListValue();
            LstVal.ListValueID = id;
            LstVal.ModifiedBy = modifiedBy; //curent user
            return listValueFac.Delete(LstVal).Data;
        }
    }
}
