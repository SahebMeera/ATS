import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, observable } from 'rxjs';
import { environment } from '../../../environments/environment'; 
import { ICountryDisplay } from '../../core/interfaces/country';
import { IRegistration, IRegistrationDisplay } from '../../core/interfaces/registration';import { IStateDisplay } from '../../core/interfaces/state';
;

//import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RegistrationService {
    addRegistartionApiMethod = "api/Registration";
    sendEmailRegistartionApiMethod = "api/Registration/SendEmail";
    updateRegistartionApiMethod = "api/Registration";
    getRegistartionApiMethod = "api/Registration";
    approveAccountApiMetod = 'api/Registration/ApproveAccount';
    getStateApiMethod = 'api/State';
    getCountryApiMethod = 'api/Country';
    constructor(private http: HttpClient) { }


    getCountryList(): Observable<ICountryDisplay[]> {
        return this.http.get<ICountryDisplay[]>(`${this.getCountryApiMethod}`);
    }
    getStateList(): Observable<IStateDisplay[]> {
        return this.http.get<IStateDisplay[]>(`${this.getStateApiMethod}`);
    }
    getRegistrationList(): Observable<IRegistrationDisplay[]> {
        return this.http.get<IRegistrationDisplay[]>(`${this.getRegistartionApiMethod}`);
    }

    addRegistration(addRegistration: IRegistration): Observable<any> {
       return this.http.post<any>(`${this.addRegistartionApiMethod}`, addRegistration);
    }

    sendRegistrationMail(sendMailRegistration: IRegistration): Observable<any> {
        return this.http.post<any>(`${this.sendEmailRegistartionApiMethod}`, sendMailRegistration);
    }

    approveAccount(guid: string): Observable<any> {
        return this.http.get<any>(`${this.approveAccountApiMetod}/${guid}`);
    }

    updateRegistration(updateRegistrationDataRequest: IRegistration):Observable<any[]> {
        return this.http.put<any>(`${this.updateRegistartionApiMethod}/${updateRegistrationDataRequest.RegistrationID}`, updateRegistrationDataRequest);
    }
 
}
