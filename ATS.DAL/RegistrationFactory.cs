using System;
using System.Collections.Generic;
using System.Data;
using ATS.DTO;
using Dapper;
using System.Linq;
using Microsoft.Extensions.Configuration;

namespace ATS.DAL
{
    public class RegistrationFactory : AbstractFactory
    {
        #region     
        private readonly string InsertSPName = "usp_InsUpdRegistration";
        private readonly string UpdateSPName = "usp_InsUpdRegistration";
        private readonly string DeleteSPName = "usp_DeleteRegistration";
        private readonly string SelectSPName = "usp_GetRegistration";
        private readonly string ApproveSPName = "usp_ApproveAccount";
        #endregion

        public RegistrationFactory(string connString, IConfiguration config)
            : base(connString, config)
        {
        }
        public override Response<T> GetByID<T>(T obj)
        {
            base.parms.Add("@GUID", (obj as Registration).GUID);
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
            Registration obj = new Registration();
            obj = reader.Read<Registration>().FirstOrDefault();
            return (T)Convert.ChangeType(obj, typeof(T));
        }

        public override Response<T> Save<T>(T obj)
        {
            Registration obj1 = obj as Registration;
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

        public Response<T> AccountApprovalAction<T>(T obj)
        {
            Registration obj1 = obj as Registration;
            base.parms.Add("@GUID", obj1.GUID);
            //base.parms.Add("@ReturnCode", obj1.RecordID, direction: ParameterDirection.Output, size: sizeof(int));
            base.getStoredProc = ApproveSPName;
            return base.SaveInstanceReturnOutput<T>(obj);
        }


    }
}