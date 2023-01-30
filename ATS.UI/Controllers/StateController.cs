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
    public class StateController : BaseController
    {
        private IConfiguration _config;
        private string conStr;
        StateFactory stateFac;
        public StateController(IConfiguration config, IHttpContextAccessor contextAccessor) : base(contextAccessor)
        {
            _config = config;
            stateFac = new StateFactory(base.ConString, _config);
        }

        [HttpGet]
        [AllowAnonymous]
        public List<State> Get()
        {
            State objState = new State();
            var lstState = stateFac.GetList<State>(objState);
            return lstState.Data;
        }

        [HttpGet("{id}")]
        public State Get(int id)
        {
            State State = new State();
            State.StateID = id;
            return stateFac.GetByID(State).Data;
        }

        [HttpPost]
        public State Post([FromBody] State State)
        {
            stateFac.Save(State);
            return State;
        }

        [HttpPut("{id}")]
        public State Put(int id, [FromBody] State State)
        {
            State.StateID = id;
            stateFac.Save(State);
            return State;
        }

    }
}
