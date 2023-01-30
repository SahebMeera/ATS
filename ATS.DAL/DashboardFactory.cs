using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using Dapper;
using ATS.DTO;
using ATS.DAL;
using Microsoft.Extensions.Configuration;

namespace ATS.DAL
{
    public class DashboardFactory : AbstractFactory
    {

        #region ProcedureNames
        private readonly string InsertSPName = "usp_InsUpdGetDashboard";
        private readonly string UpdateSPName = "usp_InsUpdGetDashboard";
        private readonly string DeleteSPName = "USP_DeleteGetDashboard";
        private readonly string SelectSPName = "usp_GetDashboardCounts";
        #endregion

        public DashboardFactory(string connString, IConfiguration config)
            : base(connString, config)
        {
        }

        public override Response<List<T>> GetList<T>(T obj)
        {
            base.getStoredProc = SelectSPName;
            base.parms = SetDynamicParameters(obj);
            return base.GetList<T>();
        }

        public override Response<T> GetByID<T>(T obj)
        {
            base.getStoredProc = SelectSPName;
            base.parms = SetDynamicParameters(obj);
            return base.GetByID<T>();
        }

        public override Response<T> GetRelatedObjectsByID<T>(T obj)
        {
            base.getStoredProc = SelectSPName;
            base.parms = SetDynamicParameters(obj);
            return base.GetRelatedObjectsByID<T>();
        }

        public override Response<T> Delete<T>(T obj)
        {
            base.getStoredProc = DeleteSPName;
            base.parms = SetDynamicParameters(obj);
            return base.DeleteInstance<T>();
        }

        public override Response<T> Save<T>(T obj)
        {
            base.getStoredProc = InsertSPName;
            base.selectStoredProc = SelectSPName;
            base.parms = SetDynamicParameters(obj);
            return base.SaveInstanceReturnOutput<T>(obj);
        }

        protected override T LoadRelatedObjects<T>(SqlMapper.GridReader reader)
        {
            Dashboard obj = new Dashboard();
            obj = reader.Read<Dashboard>().FirstOrDefault();
            return (T)Convert.ChangeType(obj, typeof(T));
        }

        public int Compare(AbstractDataObject x, AbstractDataObject y)
        {
            return 0;
        }
         
    }
}