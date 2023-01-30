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
    [Authorize]
    [Route("api/[controller]")]
    public class ListTypeController : BaseController
    {

        private IConfiguration _config;
        ListTypeFactory listTypeFac;
        public ListTypeController(IConfiguration config, IHttpContextAccessor contextAccessor) : base(contextAccessor)
        {
            _config = config;
            listTypeFac = new ListTypeFactory(base.ConString, _config);
        }

        [HttpGet]
        public Response<List<ListType>> Get()
        {
            return listTypeFac.GetList(new ListType());
        }

        [HttpGet("{id}")]
        public Response<ListType> Get(int id)
        {
            ListType LstType = new ListType();
            LstType.ListTypeID = id;
            return listTypeFac.GetRelatedObjectsByID(LstType);
        }

        [HttpPost]
        public Response<ListType> Post([FromBody] ListType LstType)
        {
            return listTypeFac.Save(LstType);
        }

        [HttpPut("{id}")]
        public Response<ListType> Put(int id, [FromBody] ListType LstType)
        {
            LstType.ListTypeID = id;
            return listTypeFac.Save(LstType);
        }

        [HttpDelete("{id}")]
        public Response<ListType> Delete(int id)
        {
            ListType LstType = new ListType();
            LstType.ListTypeID = id;
            LstType.ModifiedBy = "Admin"; //curent user
            return listTypeFac.Delete(LstType);
        }
    }
}
