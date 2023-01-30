using System;
using System.Net;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Authorization;
using System.Security.Cryptography;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

using ATS.DTO;
using ATS.DAL;
using Microsoft.AspNetCore.Http;
using System.IO;

namespace ATS.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UserController : BaseController
    {

        private IConfiguration _config;
        UserFactory usrFac;

        public UserController(IConfiguration config, IHttpContextAccessor contextAccessor) : base(contextAccessor)
        {
            _config = config;
            usrFac = new UserFactory(base.ConString, _config);
        }

        [HttpGet]
        public List<User> Get()
        {
            User objUser = new User();
            if (this.RoleShort != "SUPERADMIN")
                objUser.CompanyID = this.companyID;
            var lstUser = usrFac.GetList<User>(objUser);
            return lstUser.Data;
        }

        [HttpGet("{id}")]
        public User Get(int id)
        {

            User objUser = new User();
            objUser.UserID = id;
            var resReg = usrFac.GetByID<User>(objUser);
            return objUser;
        }

        [HttpPost]
        public Response<User> Post(User user)
        {
            return usrFac.Save(user);
        }

        [HttpPut("{id}")]
        public Response<User> Put(int id, [FromBody] User user)
        {
            // registration.RegistrationID = id;
            return usrFac.Save(user);
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("ValidateLoginUser", Name = "ValidateLoginUser")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        public UserInfo ValidateLoginUser([FromBody]LoginUser loginuser)
        {
            User usr = new User();
            usr.Email = loginuser.Email;
            usr.Password = loginuser.Password;
            Response<User> response = usrFac.ValidateUser(usr);
            UserInfo userInfo = new UserInfo();
            userInfo.IsValid = false;
            if (response.Data != null ) // && response.Data.IsActive != false && response.Data.IsCompanyActive != false)
            {
                if (DecryptStringAES(response.Data.Password) == DecryptStringAES(usr.Password))
                {
                    userInfo.IsValid = true;
                    userInfo.ID = response.Data.UserID;
                    userInfo.CompanyID = response.Data.CompanyID;
                    userInfo.Email = response.Data.Email;
                    userInfo.FirstName = response.Data.FirstName;
                    userInfo.LastName = response.Data.LastName;
                    userInfo.RoleShort = response.Data.RoleShort;
                    userInfo.IsTempPassword = response.Data.IsTempPassword;
                    userInfo.RoleID = response.Data.RoleID;
                    userInfo.IsActive = response.Data.IsActive;
                    userInfo.IsCompanyActive = response.Data.IsCompanyActive;
                    userInfo.RoleName = response.Data.RoleName;
                    if (userInfo.IsActive && userInfo.IsCompanyActive)
                        userInfo.Token = GenerateJSONWebToken(userInfo);
                }
            }
            return userInfo;
        }
        private string DecryptStringAES(string encryptedValue)
        {
            var keybytes = Encoding.UTF8.GetBytes("7534275896345678");
            var iv = Encoding.UTF8.GetBytes("7534275896345678");

            //DECRYPT FROM CRIPTOJS
            var encrypted = Convert.FromBase64String(encryptedValue);
            var decriptedFromJavascript = DecryptStringFromBytes(encrypted, keybytes, iv);

            return decriptedFromJavascript;
        }

        private static string DecryptStringFromBytes(byte[] cipherText, byte[] key, byte[] iv)
        {
            // Check arguments.
            if (cipherText == null || cipherText.Length <= 0)
            {
                throw new ArgumentNullException("cipherText");
            }
            if (key == null || key.Length <= 0)
            {
                throw new ArgumentNullException("key");
            }
            if (iv == null || iv.Length <= 0)
            {
                throw new ArgumentNullException("key");
            }

            // Declare the string used to hold
            // the decrypted text.
            string plaintext = null;

            // Create an RijndaelManaged object
            // with the specified key and IV.
            using (var rijAlg = new RijndaelManaged())
            {
                //Settings
                rijAlg.Mode = CipherMode.CBC;
                rijAlg.Padding = PaddingMode.PKCS7;
                rijAlg.FeedbackSize = 128;

                rijAlg.Key = key;
                rijAlg.IV = iv;

                // Create a decrytor to perform the stream transform.
                var decryptor = rijAlg.CreateDecryptor(rijAlg.Key, rijAlg.IV);

                // Create the streams used for decryption.
                using (var msDecrypt = new MemoryStream(cipherText))
                {
                    using (var csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read))
                    {
                        using (var srDecrypt = new StreamReader(csDecrypt))
                        {
                            // Read the decrypted bytes from the decrypting stream
                            // and place them in a string.
                            plaintext = srDecrypt.ReadToEnd();
                        }
                    }
                }
            }

            return plaintext;
        }

        private string GenerateJSONWebToken(UserInfo userInfo)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[] {
                        new Claim(JwtRegisteredClaimNames.Email, userInfo.Email),
                        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                        new Claim("UserID", userInfo.ID.ToString()),
                        new Claim("CompanyID",userInfo.CompanyID.ToString()),
                        new Claim("RoleShort",userInfo.RoleShort.ToString())
                      };

            var token = new JwtSecurityToken(_config["Jwt:Issuer"],
              _config["Jwt:Issuer"],
              claims,
              expires: DateTime.Now.AddMinutes(Convert.ToInt32(_config["Jwt:ExpiryMinutes"])),
              signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private string ComputeMD5Hash(string rawData)
        {
            using (MD5 sha256Hash = MD5.Create())
            {
                byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(rawData));
                StringBuilder builder = new StringBuilder();
                for (int i = 0; i < bytes.Length; i++)
                {
                    builder.Append(bytes[i].ToString("x2"));
                }
                return builder.ToString();
            }
        }
    }

    
}
