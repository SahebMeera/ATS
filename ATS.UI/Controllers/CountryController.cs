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
    public class CountryController : BaseController
    {
        private IConfiguration _config;
        CountryFactory countryFac;
        public CountryController(IConfiguration config, IHttpContextAccessor contextAccessor) : base(contextAccessor)
        {
            _config = config;
            countryFac = new CountryFactory(base.ConString, _config);
        }

        [HttpGet]
        [AllowAnonymous]
        public List<Country> Get()
        {
            Country objCountry = new Country();
            var lstCountry = countryFac.GetList<Country>(objCountry);
            return lstCountry.Data;
        }

        [HttpGet("{id}")]
        public Country Get(int id)
        {
            Country country = new Country();
            country.CountryID = id;
            var lstCountry = countryFac.GetByID<Country>(country);
            return lstCountry.Data;
        }

        [HttpPost]
        public Country Post([FromBody] Country country)
        {
           return countryFac.Save(country).Data;
        }

        [HttpPut("{id}")]
        public Country Put(int id, [FromBody] Country country)
        {
            country.CountryID = id;
            return countryFac.Save(country).Data;
        }

    }
}
