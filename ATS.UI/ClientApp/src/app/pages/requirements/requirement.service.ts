import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, observable } from 'rxjs';
import { IListValue } from '../../core/interfaces/listValue';
import { IRequirementDisplay, IRequirementForm } from '../../core/interfaces/requirements';
import { IReviewQueueForm } from '../../core/interfaces/reviewQueue';


//import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RequirementService {
    getListValuesApiMethod = "api/ListValue";
    addRequirementsApiMethod = "api/Requirement";
    updateRequirementsApiMethod = "api/Requirement";
    getRequirementsApiMethod = "api/Requirement/GetRequirement";
    addReviewQueueApiMethod = "api/ReviewQueue";


    constructor(private http: HttpClient) { }

    getListValues() {
        return this.http.get<IListValue[]>(`${this.getListValuesApiMethod}`);
    }
    getRequirementsList(isPublic: boolean) {
        return this.http.get<IRequirementDisplay[]>(`${this.getRequirementsApiMethod}/${isPublic}`);
    }
    addRequirements(requirment: IRequirementForm): Observable<any> {
        return this.http.post<any>(`${this.addRequirementsApiMethod}`, requirment);
    }
    updateRequirements(requirment: IRequirementForm):Observable<any[]> {
        return this.http.put<any>(`${this.updateRequirementsApiMethod}/${requirment.RequirementID}`, requirment);
    }
    addReviewQueue(reviewQueueForm: IReviewQueueForm): Observable<any> {
        return this.http.post<any>(`${this.addReviewQueueApiMethod}`, reviewQueueForm);
    }
 
}
