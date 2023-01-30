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
    public class ClientController : BaseController
    {
        private IConfiguration _config;
        ClientFactory clientFac;
        public ClientController(IConfiguration config, IHttpContextAccessor contextAccessor) : base(contextAccessor)
        {
            _config = config;
            clientFac = new ClientFactory(base.ConString, _config);
        }

        [HttpGet]
        public List<Client> Get()
        {
            Client client = new Client();
            if (this.RoleShort != "SUPERADMIN")
                client.CompanyID = this.companyID;
            return clientFac.GetList(client).Data;
        }

        [HttpGet("{id}")]
        public Client Get(int id)
        {
            Client client  = new Client();
            client.ClientID = id;
            return clientFac.GetByID(client).Data;        
        }

        [HttpPost]
        public Client Post([FromBody] Client client)
        {
            return clientFac.Save<Client>(client).Data;
        }

        [HttpPut("{id}")]
        public Client Put(int id, [FromBody] Client client)
        {
            client.ClientID = id;
            return clientFac.Save<Client>(client).Data;
        }
    }
}
