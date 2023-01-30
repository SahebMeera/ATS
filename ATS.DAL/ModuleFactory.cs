using System;
using System.Collections.Generic;
using System.Data;
using ATS.DTO;
using Dapper;
using System.Linq;
using Microsoft.Extensions.Configuration;

namespace ATS.DAL
{
    public class ModuleFactory : AbstractFactory
    {
        #region     
        private readonly string InsertSPName = "usp_InsUpdModule";
        private readonly string UpdateSPName = "usp_InsUpdModule";
        private readonly string DeleteSPName = "usp_DeleteModule";
        private readonly string SelectSPName = "usp_GetModule";
        #endregion

          public ModuleFactory(string connString, IConfiguration config)
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
            Module obj = new Module();
            obj = reader.Read<Module>().FirstOrDefault();
            return (T)Convert.ChangeType(obj, typeof(T));
        }

        public override Response<T> Save<T>(T obj)
        {
            Module obj1 = obj as Module;
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