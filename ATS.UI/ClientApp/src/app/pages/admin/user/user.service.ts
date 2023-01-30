import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, observable } from 'rxjs';
import { ICompanyDisplay } from '../../../core/interfaces/company';
import { IRoleDisplay } from '../../../core/interfaces/role';
import { IUser, IUserDisplay, IUserForm } from '../../../core/interfaces/user';

//import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
    addCompanyApiMethod = "api/Company";
    addRoleApiMethod = "api/Role";
    addUserApiMethod = "api/User";
    updateUserApiMethod = "api/User";
    getUserApiMethod = "api/User"
    constructor(private http: HttpClient) { }

    getRoleList() {
        return this.http.get<IRoleDisplay[]>(`${this.addRoleApiMethod}`);
    }
    getCompanyList() {
        return this.http.get<ICompanyDisplay[]>(`${this.getUserApiMethod}`);
    }
    getUserList() {
        return this.http.get<IUserDisplay[]>(`${this.getUserApiMethod}`);
    }
    getUserDetail(userID: number): Observable<IUserDisplay> {
        return this.http.get<IUserDisplay>(`${this.getUserApiMethod}/${userID}`);
    }

    addUser(addUser: IUserForm): Observable<any> {
        return this.http.post<any>(`${this.addUserApiMethod}`, addUser);
    }

    updateUser(userUserRequest: IUserForm):Observable<any[]> {
        return this.http.put<any>(`${this.updateUserApiMethod}/${userUserRequest.UserID}`, userUserRequest);
    }
    updatePassword(userUserRequest: IUserForm): Observable<any[]> {
        return this.http.put<any>(`${this.updateUserApiMethod}/${userUserRequest.UserID}`, userUserRequest);
    }
}
