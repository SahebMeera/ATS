using System;
using ATS.DAL;
using ATS.DTO;
using Microsoft.Extensions.Configuration;

namespace ATS.Test
{
    class Program
    {
        IConfiguration _config;
        public static void Main(string[] args)
        {
            Program pobjProg = new Program();
            pobjProg.TestMethod();
        }
        public void TestMethod()
        {
            string conStr = "server=iltats.com; user id=skywalkg_ats; password=InfoATS@123; database=skywalkg_ats; default command timeout=0; convert zero datetime=True";
            
            RoleFactory RoleDAL = new RoleFactory(conStr, _config);
            Role objRole = new Role();
            var lstRole = RoleDAL.GetList<Role>(objRole);
            objRole.RoleID = 1;
            var resRole = RoleDAL.GetByID<Role>(objRole);

            RegistrationFactory RegDAL = new RegistrationFactory(conStr, _config);
            Registration objReg = new Registration();
            var lstReg = RegDAL.GetList<Registration>(objReg);
            objReg.RegistrationID = 1;
            var resReg = RegDAL.GetByID<Registration>(objReg);

            CountryFactory CountryDAL = new CountryFactory(conStr, _config);
            Country objCountry = new Country();
            var lstCountry = CountryDAL.GetList<Country>(objCountry);
            objCountry.CountryID = 1;
            var resCountry = CountryDAL.GetByID<Country>(objCountry);

            CompanyFactory CompanyDAL = new CompanyFactory(conStr, _config);
            Company objCompany = new Company();
            var lstCompany = CompanyDAL.GetList<Company>(objCompany);
            objCountry.CountryID = 1;
            var resCompany = CompanyDAL.GetByID<Company>(objCompany);

            CandidateFactory CandidateDAL = new CandidateFactory(conStr, _config);
            Candidate objCandidate = new Candidate();
            var lstCandidate = CandidateDAL.GetList<Candidate>(objCandidate);
            objCandidate.CandidateID = 1;
            var resCandidate = CandidateDAL.GetByID<Candidate>(objCandidate);


        }
    }
}
