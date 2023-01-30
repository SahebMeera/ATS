using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Authorization;

using MimeKit;
using MimeKit.Text;
using MailKit.Net.Smtp;
using MailKit.Security;

using ATS.DTO;
using ATS.DAL;
using Microsoft.AspNetCore.Http;

namespace ATS.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    //[Authorize]
    [AllowAnonymous]
    public class RegistrationController : BaseController
    {
        private IConfiguration _config;
        RegistrationFactory regFac;

        public RegistrationController(IConfiguration config, IHttpContextAccessor contextAccessor) : base(contextAccessor)
        {
            _config = config;
            regFac = new RegistrationFactory(base.ConString, _config);
        }

        [HttpGet]
        public List<Registration> Get()
        {
            Registration objReg = new Registration();
            var lstReg = regFac.GetList<Registration>(objReg);
            return lstReg.Data;
        }

        [HttpGet("{id}")]
        public Registration Get(int id)
        {

            Registration objReg = new Registration();
            objReg.RegistrationID = 1;
            var resReg = regFac.GetByID<Registration>(objReg);
            return objReg;
        }

        [HttpPost]
        public Response<Registration> Post(Registration registration)
        {
            registration.GUID = Guid.NewGuid();
            return regFac.Save(registration);
        }

        [HttpPut("{id}")]
        public Response<Registration> Put(int id, [FromBody] Registration registration)
        {
            // registration.RegistrationID = id;
            return regFac.Save(registration);
        }

        [Route("SendEmail", Name = "SendEmail")]
        [HttpPost]
        public bool SendEmail(Registration registration)
        {
            sendMail(registration);
            return true;
        }

        private int sendMail(Registration registration)
        {
            try
            {
                var emailFrom = _config["EmailConfig:FromEmail"];
                string uri = "https://localhost:5001/Registration/ApproveAccount/"+registration.GUID;
                var userId = _config["EmailConfig:UserID"];
                var password = _config["EmailConfig:Password"];
                var email = new MimeMessage();
                email.From.Add(MailboxAddress.Parse(emailFrom));
                email.To.Add(MailboxAddress.Parse(registration.Email));
                email.Subject = "Account Registration";
                email.Body = new TextPart(TextFormat.Html)
                {
                    Text = "<br/><a href='" + uri + "'>Click here</a> to verify.<br/><div>NOTE: This is an outgoing message only. Please do not reply to this message</div>"
                };

                //// send email
                using var smtp = new SmtpClient();
                smtp.Connect("smtp.office365.com", 587, SecureSocketOptions.StartTls);
                smtp.Authenticate(userId, password);
                smtp.Send(email);
                smtp.Disconnect(true);
            }
            catch (Exception ex)
            {
            }
            finally
            {

            }
            return 1;
        }

        [HttpGet("ApproveAccount/{Guid}")]
        [AllowAnonymous]
        public bool ApproveAccount(string Guid)
        {
            Registration objReg = new Registration();
            objReg.GUID = new System.Guid(Guid);
            Response<Registration> responseReg = regFac.AccountApprovalAction(objReg);
            return true;
        }

    }
}
