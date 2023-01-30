import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, observable } from 'rxjs';
import { ICompany, ICompanyDisplay } from '../../../core/interfaces/company';

@Injectable({ providedIn: 'root' })
export class CompanyService {

    addCompanyApiMethod = "api/Company";
    updateCompanyApiMethod = "api/Company";
    getCompanyApiMethod = "api/Company";

    constructor(private http: HttpClient) { }
  
    getCompany() {
        return this.http.get<ICompanyDisplay[]>(`${this.getCompanyApiMethod}`);
    }
    addCompany(company: ICompany): Observable<any> {
        return this.http.post<any>(`${this.addCompanyApiMethod}`, company);
    }
    updateCompany(company: ICompany): Observable<any[]> {
        return this.http.put<any>(`${this.updateCompanyApiMethod}/${company.CompanyID}`, company);
    }
 
}
