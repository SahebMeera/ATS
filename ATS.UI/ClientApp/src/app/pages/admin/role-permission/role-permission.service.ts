import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, observable } from 'rxjs';
import { IRoleDisplay } from '../../../core/interfaces/role';
import { IRolePermissionDisplay,IRolePermission} from '../../../core/interfaces/rolePermission';

@Injectable({ providedIn: 'root' })
export class RolePermissionService {

    addRolePermissionApiMethod = "api/RolePermission";
    updateRolePermissionApiMethod = "api/RolePermission";
    getRolePermissionApiMethod = "api/RolePermission";
    getRoleApiMethod = "api/Role";
    getModuleApiMethod = "api/Module";

    constructor(private http: HttpClient) { }
  
    getRolePermission() {
        return this.http.get<IRolePermissionDisplay[]>(`${this.getRolePermissionApiMethod}`);
    }
    getModule() {
        return this.http.get<IRolePermissionDisplay[]>(`${this.getModuleApiMethod}`);
    }
    getRole() {
        return this.http.get<IRoleDisplay[]>(`${this.getRoleApiMethod}`);
    }
    addRolePermission(rolePermission: IRolePermission): Observable<any> {
        return this.http.post<any>(`${this.addRolePermissionApiMethod}`, rolePermission);
    }
    updateRolePermission(rolePermission: IRolePermission): Observable<any[]> {
        return this.http.put<any>(`${this.updateRolePermissionApiMethod}/${rolePermission.RolePermissionID}`, rolePermission);
    }
 
}
