import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, observable } from 'rxjs';
import { ICandidate, ICandidateDisplay } from '../../core/interfaces/candidate';
import { ICompanyDisplay } from '../../core/interfaces/company';
import { ICountryDisplay } from '../../core/interfaces/country';
import { IStateDisplay } from '../../core/interfaces/state';

//import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CandidateService {
    addCompanyApiMethod = "api/Company";
    addRoleApiMethod = "api/Role";
    addCandidateApiMethod = "api/Candidate";
    updateCandidateApiMethod = "api/Candidate";
    getCandidateApiMethod = "api/Candidate/GetCandidates";
    getCandidateByIDApiMethod = "api/Candidate";
    getStateApiMethod = 'api/State';
    getCountryApiMethod = 'api/Country';
    uploadCandidateApiMethod = 'api/Candidate/Upload';

    constructor(private http: HttpClient) { }



    getCountryList(): Observable<ICountryDisplay[]> {
        return this.http.get<ICountryDisplay[]>(`${this.getCountryApiMethod}`);
    }
    getStateList(): Observable<IStateDisplay[]> {
        return this.http.get<IStateDisplay[]>(`${this.getStateApiMethod}`);
    }
    getCompanyList() {
        return this.http.get<ICompanyDisplay[]>(`${this.addCompanyApiMethod}`);
    }

    getCandidateByID(candidateID: number) {
        return this.http.get<ICandidateDisplay>(`${this.getCandidateByIDApiMethod}/${candidateID}`);
    }
    getCandidateList(isPublic: boolean, RequirementID: number = 0) {
        return this.http.get<ICandidateDisplay[]>(`${this.getCandidateApiMethod}/${isPublic}/${RequirementID}`);
    }
    addCandidate(candidate: ICandidate): Observable<ICandidate> {
        return this.http.post<ICandidate>(`${this.addCandidateApiMethod}`, candidate);
    }
    updateCandidate(candidate: ICandidate):Observable<any[]> {
        return this.http.put<any>(`${this.updateCandidateApiMethod}/${candidate.CandidateID}`, candidate);
    }


    uploadResume(candidateId,fileName, formData: FormData): Observable<any> {
        return this.http.post<any>(`${this.uploadCandidateApiMethod}/${candidateId}/${fileName}`, formData);
    }
 
}
