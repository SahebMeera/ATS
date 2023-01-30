using System;
using System.Collections.Generic;
using System.Data;
using ATS.DTO;
using Dapper;
using System.Linq;
using Microsoft.Extensions.Configuration;

namespace ATS.DAL
{
    public class RoleFactory : AbstractFactory
    {
        #region     
        private readonly string InsertSPName = "usp_InsUpdRole";
        private readonly string UpdateSPName = "usp_InsUpdRole";
        private readonly string DeleteSPName = "usp_DeleteRole";
        private readonly string SelectSPName = "usp_GetRole";
        #endregion

          public RoleFactory(string connString, IConfiguration config)
            : base(connString, config)
        {
        }
        public override Response<T> GetByID<T>(T obj)
        {
            //base.parms.Add("@RoleID", (obj as AbstractDataObject).RecordID);
            base.getStoredProc = SelectSPName;
            base.parms = SetDynamicParameters(obj);
            return base.GetByID<T>();
        }

        public override Response<List<T>> GetList<T>(T obj)
        {
            base.getStoredProc = SelectSPName;
            //base.parms = null;
            base.parms = SetDynamicParameters(obj);
            return base.GetList<T>();
        }

        protected override T LoadRelatedObjects<T>(SqlMapper.GridReader reader)
        {
            Role obj = new Role();
            obj = reader.Read<Role>().FirstOrDefault();
            obj.RolePermissions = reader.Read<RolePermission>().ToList();
            return (T)Convert.ChangeType(obj, typeof(T));
        }

        public override Response<T> Save<T>(T obj)
        {
            Role obj1 = obj as Role;

            //base.parms.Add("@RoleID", obj1.RecordID);
            //base.parms.Add("@RoleShort", obj1.RoleShort);
            //base.parms.Add("@RoleName", obj1.RoleName);
            //base.parms.Add("@CreatedBy", obj1.CreatedBy);
            //base.parms.Add("@ModifiedBy", obj1.ModifiedBy);
            //base.parms.Add("@ReturnCode", obj1.RecordID, direction: ParameterDirection.Output, size: sizeof(int));

            base.getStoredProc = InsertSPName;
            base.selectStoredProc = SelectSPName;
            base.parms = SetDynamicParameters(obj);
            return base.SaveInstanceReturnOutput<T>(obj);

        }


        public override Response<T> Delete<T>(T obj)
        {
            //Role obj1 = obj as Role;
            //base.parms.Add("@RoleID", obj1.RecordID);
            //base.parms.Add("@ModifiedBy", obj1.RoleShort);

            base.getStoredProc = DeleteSPName;
            base.parms = SetDynamicParameters(obj);
            return base.DeleteInstance<T>();
        }

        public override Response<T> GetRelatedObjectsByID<T>(T obj)
        {
            //base.parms.Add("@RoleID", (obj as AbstractDataObject).RecordID);
            base.getStoredProc = SelectSPName;
            base.parms = SetDynamicParameters(obj);
            return base.GetRelatedObjectsByID<T>();
        }
    }
}