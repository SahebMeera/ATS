using System;
using System.Collections.Generic;
using System.Data;
using ATS.DTO;
using Dapper;
using System.Linq;
using Microsoft.Extensions.Configuration;

namespace ATS.DAL
{
    public class RequirementFactory : AbstractFactory
    {
        #region     
        private readonly string InsertSPName = "usp_InsUpdRequirement";
        private readonly string UpdateSPName = "usp_InsUpdRequirement";
        private readonly string DeleteSPName = "usp_DeleteRequirement";
        private readonly string SelectSPName = "usp_GetRequirement";
        #endregion

          public RequirementFactory(string connString, IConfiguration config)
            : base(connString, config)
        {
        }
        public override Response<T> GetByID<T>(T obj)
        {
            base.getStoredProc = SelectSPName;
            base.parms = SetDynamicParameters(obj);
            return base.GetByID<T>();
        }

        public override Response<List<T>> GetList<T>(T obj)
        {
            base.getStoredProc = SelectSPName;
            base.parms = SetDynamicParameters(obj);
            return base.GetList<T>();
        }

        protected override T LoadRelatedObjects<T>(SqlMapper.GridReader reader)
        {
            Requirement obj = new Requirement();
            obj = reader.Read<Requirement>().FirstOrDefault();
            return (T)Convert.ChangeType(obj, typeof(T));
        }

        public override Response<T> Save<T>(T obj)
        {
            Requirement obj1 = obj as Requirement;

            base.parms.Add("@CompanyID", obj1.CompanyID);
            base.parms.Add("@ClientName",obj1.ClientName);
            base.parms.Add("@ClientTypeID",obj1.ClientTypeID);
            base.parms.Add("@RequirementTypeID", obj1.RequirementTypeID);
            base.parms.Add("@JobID", obj1.JobID);
            base.parms.Add("@JobTitle", obj1.JobTitle);
            base.parms.Add("@JobDesc", obj1.JobDesc);
            base.parms.Add("@InternalNote", obj1.InternalNote);
            base.parms.Add("@PrimarySkills",obj1.PrimarySkills);
            base.parms.Add("@Duration", obj1.Duration);
            base.parms.Add("@ClientRate", obj1.ClientRate);
            base.parms.Add("@PayRate", obj1.PayRate);
            base.parms.Add("@PayRateTypeID", obj1.PayRateTypeID);
            base.parms.Add("@DatePosted", obj1.DatePosted);
            base.parms.Add("@DateClosed", obj1.DateClosed);
            base.parms.Add("@City", obj1.City);
            base.parms.Add("@StateID", obj1.StateID);
            base.parms.Add("@CountryID",obj1.CountryID);
            base.parms.Add("@IsRemote", obj1.IsRemote);
            base.parms.Add("@InterviewTypeID", obj1.InterviewTypeID);
            base.parms.Add("@Priority", obj1.Priority);
            base.parms.Add("@StateID", obj1.StateID);
            base.parms.Add("@IsHotRequirement", obj1.IsHotRequirement);
            base.parms.Add("@AssignedTo", obj1.AssignedTo);
            base.parms.Add("@ReviewerID", obj1.ReviewerID);
            base.parms.Add("@StatusID", obj1.StatusID);
            base.parms.Add("@ReturnCode", obj1.RecordID, direction: ParameterDirection.Output, size: sizeof(int));

            base.getStoredProc = InsertSPName;
            base.selectStoredProc = SelectSPName;
            base.parms = SetDynamicParameters(obj);
            return base.SaveInstanceReturnOutput<T>(obj);
        }

        public override Response<T> Delete<T>(T obj)
        {
            base.getStoredProc = DeleteSPName;
            base.parms = SetDynamicParameters(obj);
            return base.DeleteInstance<T>();
        }

        public override Response<T> GetRelatedObjectsByID<T>(T obj)
        {
            base.getStoredProc = SelectSPName;
            base.parms = SetDynamicParameters(obj);
            return base.GetRelatedObjectsByID<T>();
        }
    }
}