using System;
using System.Collections.Generic;
using System.Data;
using ATS.DTO;
using Dapper;
using System.Linq;
using Microsoft.Extensions.Configuration;

namespace ATS.DAL
{
    public class InterviewScheduleFactory : AbstractFactory
    {
        #region     
        private readonly string InsertSPName = "usp_InsUpdInterviewSchedule";
        private readonly string UpdateSPName = "usp_InsUpdInterviewSchedule";
        private readonly string DeleteSPName = "usp_DeleteInterviewSchedule";
        private readonly string SelectSPName = "usp_GetInterviewSchedule";
        #endregion

        public InterviewScheduleFactory(string connString, IConfiguration config)
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
            InterviewSchedule obj = new InterviewSchedule();
            obj = reader.Read<InterviewSchedule>().FirstOrDefault();
            return (T)Convert.ChangeType(obj, typeof(T));
        }

        public override Response<T> Save<T>(T obj)
        {
            InterviewSchedule obj1 = obj as InterviewSchedule;
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