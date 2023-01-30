import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, observable } from 'rxjs';
import { ICandidate, ICandidateDisplay } from '../../core/interfaces/candidate';
import { ICompanyDisplay } from '../../core/interfaces/company';
import { ICountryDisplay } from '../../core/interfaces/country';
import { IInterviewSchedule, IInterviewScheduleDisplay } from '../../core/interfaces/interviewSchedule';
import { IStateDisplay } from '../../core/interfaces/state';

//import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class InterviewScheduleService {

    addInterviewScheduleApiMethod = "api/InterviewSchedule";
    updateInterviewScheduleApiMethod = "api/InterviewSchedule";
    getInterviewScheduleApiMethod = "api/InterviewSchedule";

    constructor(private http: HttpClient) { }
  
    getInterviewSchedule() {
        return this.http.get<IInterviewScheduleDisplay[]>(`${this.getInterviewScheduleApiMethod}`);
    }
    addInterviewSchedule(interview: IInterviewSchedule): Observable<any> {
        return this.http.post<any>(`${this.addInterviewScheduleApiMethod}`, interview);
    }
    updateInterviewSchedule(interview: IInterviewSchedule): Observable<any[]> {
        console.log("interview", interview)
        return this.http.put<any>(`${this.updateInterviewScheduleApiMethod}/${interview.InterviewScheduleID}`, interview);
    }
 
}
