using System;
using System.Collections.Generic;
using System.Data;
using ATS.DTO;
using Dapper;
using System.Linq;
using Microsoft.Extensions.Configuration;

namespace ATS.DAL
{
    public class StatusFlowFactory : AbstractFactory
    {
        #region     
        private readonly string InsertSPName = "usp_InsUpdStatusFlow";
        private readonly string UpdateSPName = "usp_InsUpdStatusFlow";
        private readonly string DeleteSPName = "usp_DeleteStatusFlow";
        private readonly string SelectSPName = "usp_GetStatusFlow";
        #endregion

          public StatusFlowFactory(string connString, IConfiguration config)
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
            StatusFlow obj = new StatusFlow();
            obj = reader.Read<StatusFlow>().FirstOrDefault();
            return (T)Convert.ChangeType(obj, typeof(T));
        }

        public override Response<T> Save<T>(T obj)
        {
            StatusFlow obj1 = obj as StatusFlow;
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