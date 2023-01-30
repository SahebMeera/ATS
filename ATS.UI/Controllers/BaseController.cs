using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;

namespace ATS.Controllers
{
    public class BaseController : ControllerBase
    {
        protected readonly string ConString = "Data Source=sql-db-devinfohr.database.windows.net; Initial Catalog=ATS;User ID=ihruser; Password=Info@123";
        protected int companyID;
        protected int userID;
        protected string RoleShort;

        public BaseController(IHttpContextAccessor contextAccessor)
        {
            var authenticatedUser = contextAccessor.HttpContext.User.Identity.Name;
            IEnumerable<Claim> claims = contextAccessor.HttpContext.User.Claims;
            if (claims != null)
            {
                this.companyID = Convert.ToInt32(claims.Where(x => x.Type == "CompanyID").Select(c => c.Value).SingleOrDefault());
                this.userID = Convert.ToInt32(claims.Where(x => x.Type == "UserID").Select(c => c.Value).SingleOrDefault());
                this.RoleShort = claims.Where(x => x.Type == "RoleShort").Select(c => c.Value).SingleOrDefault();
            }
        }
    }
}
