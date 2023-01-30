import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, observable } from 'rxjs';
import { ICandidate, ICandidateDisplay } from '../../core/interfaces/candidate';
import { ICompanyDisplay } from '../../core/interfaces/company';
import { ICountryDisplay } from '../../core/interfaces/country';
import { INoteDisplay, INoteForm } from '../../core/interfaces/note';
import { IReviewQueueDisplay, IReviewQueueForm } from '../../core/interfaces/reviewQueue';
import { IStateDisplay } from '../../core/interfaces/state';
import { IStatusFlowForDisplay } from '../../core/interfaces/statusFlow';

//import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ReviewQueueService {
    getCandidateApiMethod = "api/Candidate";
    addReviewQueueApiMethod = "api/ReviewQueue";
    getReviewQueueCandidateApiMethod = "api/ReviewQueue/GetReviewQueueCandidate";
    updateReviewQueueApiMethod = "api/ReviewQueue";
    updateReviewQueueStatusApiMethod = "api/ReviewQueue/UpdateReviewQueueStatus";
    getReviewQueueApiMethod = "api/ReviewQueue";
    addNoteApiMethod = "api/Note";
    getNoteApiMethod = "api/Note";
    getStatusFlowApiMethod = "api/StatusFlow";



    constructor(private http: HttpClient) { }

  
    getCandidateList() {
        return this.http.get<ICandidateDisplay[]>(`${this.getCandidateApiMethod}`);
    }
    getReviewQueueList() {
        return this.http.get<IReviewQueueDisplay[]>(`${this.getReviewQueueApiMethod}`);
    }
    getReviewQueueCandidateList(requirementID: number) {
        return this.http.get<IReviewQueueDisplay[]>(`${this.getReviewQueueCandidateApiMethod}/${requirementID}`);
    }
    addReviewQueue(candidate: IReviewQueueForm): Observable<any> {
        return this.http.post<any>(`${this.addReviewQueueApiMethod}`, candidate);
    }
    updateReviewQueueStatus(reviewQueueList: IReviewQueueForm[]): Observable<any[]> {
        return this.http.post<any[]>(`${this.updateReviewQueueStatusApiMethod}`, reviewQueueList);
    }
    updateReviewQueue(candidate: IReviewQueueForm): Observable<any[]> {
        return this.http.put<any>(`${this.updateReviewQueueApiMethod}/${candidate.ReviewQueueID}`, candidate);
    }
    addNote(note: INoteForm): Observable<any> {
        return this.http.post<any>(`${this.addNoteApiMethod}`, note);
    }
    getNoteList(reviewQueueID: number) {
        return this.http.get<INoteDisplay[]>(`${this.getNoteApiMethod}/${reviewQueueID}/0/0`);
    }
    getRequirementsNoteList(requirementID: number) {
        return this.http.get<INoteDisplay[]>(`${this.getNoteApiMethod}/0/${requirementID}/0`);
    }
    getCondidateNoteList(candidateID: number) {
        return this.http.get<INoteDisplay[]>(`${this.getNoteApiMethod}/0/0/${candidateID}`);
    }
    getStatusFlow(ListTypeID: Number, CurrentStatusID: Number) {
        return this.http.get<IStatusFlowForDisplay[]>(`${this.getStatusFlowApiMethod}/${ListTypeID}/${CurrentStatusID}`);
    }
}
