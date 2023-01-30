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
    public class NoteController : BaseController
    {
        private IConfiguration _config;
        NoteFactory noteFac;
        public NoteController(IConfiguration config, IHttpContextAccessor contextAccessor) : base(contextAccessor)
        {
            _config = config;
            noteFac = new NoteFactory(base.ConString, _config);
        }

        [HttpGet("{reviewQueueID}/{requirementID}/{candidateID}")]
        public List<Note> Get(int reviewQueueID, int requirementID, int candidateID)
        {
            Note note = new Note();
            note.ReviewQueueID = reviewQueueID;
            note.RequirementID = requirementID;
            note.CandidateID = candidateID;
            return noteFac.GetList(note).Data;
        }

        [HttpGet("{id}")]
        public Note Get(int id)
        {
            Note note = new Note();
            note.NoteID = id;
            return noteFac.GetByID<Note>(note).Data;
        }

        [HttpPost]
        public Note Post([FromBody] Note note)
        {
            return noteFac.Save<Note>(note).Data;
        }

        [HttpPut("{id}")]
        public Note Put(int id, [FromBody] Note note)
        {
            note.NoteID = id;
            return noteFac.Save<Note>(note).Data;
        }
    }
}
