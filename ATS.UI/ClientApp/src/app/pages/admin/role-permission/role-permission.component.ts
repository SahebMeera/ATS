import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonUtils } from '../../../common/common-utils';
import { RoleShortConstants } from '../../../constant';
import { IRoleDisplay } from '../../../core/interfaces/role';
import { IRolePermissionDisplay } from '../../../core/interfaces/rolePermission';
import { User } from '../../../_models/user';
import { AddEditRolePermissionComponent } from './add-edit-role-permission/add-edit-role-permission.component';
import { RolePermissionService } from './role-permission.service';

@Component({
  selector: 'app-role-permission',
  templateUrl: './role-permission.component.html',
  styleUrls: ['./role-permission.component.scss']
})
export class RolePermissionComponent implements OnInit {
    @ViewChild('addEditRolePermission') addEditRolePermissionModalPopUP: AddEditRolePermissionComponent;
    commonUtils = new CommonUtils();
    rolePermissionList: IRolePermissionDisplay[] = [];
    rolePermissions: IRolePermissionDisplay[] = [];
    roles: IRoleDisplay[] = [];
    roleID: number = 0;
    roleShortConstants = RoleShortConstants;
    userDetails: User;
    userName: string = '';
    cols: any[] = [];

    constructor(private rolePermissionService: RolePermissionService) {
        this.userDetails = JSON.parse(localStorage.getItem('ats-current-loggedin-user'));
        this.userName = this.userDetails.firstName + '' + this.userDetails.lastName;
        this.loadRoleDropdown();
    }

    ngOnInit(): void {
        this.cols = [
            { field: 'roleName', header: 'Role Name' },
            { field: 'moduleName', header: 'Module Name' },
            { field: 'add', header: 'Add' },
            { field: 'view', header: 'View' },
            { field: 'edit', header: 'Edit' },
            { field: 'delete', header: 'Delete' },

        ];
  }
    loadRoleDropdown() {
        this.rolePermissionService.getRole().subscribe(result => {
            this.roles = result;
        })
    }
    onChangeRole(event: any) {
        if (event.value !== null) {
            this.roleID = event.value;
            this.loadRolePermission(this.roleID);
        }
    }
    loadRolePermission(roleID: number) {
        this.rolePermissionService.getRolePermission().subscribe(result => {
            if (result !== null && result !== undefined && result.length > 0) {
                this.rolePermissionList = result.filter(x => x.roleID === roleID);
            } else {
                this.rolePermissionList = result
            }
        })
    }
    loadRolePermissions(event) {
        this.rolePermissionService.getRolePermission().subscribe(result => {
            if (result !== null && result !== undefined && result.length > 0) {
                this.rolePermissionList = result.filter(x => x.roleID === event);
            } else {
                this.rolePermissionList = result
            }
        })
    }

    addRole() {
        this.addEditRolePermissionModalPopUP.roleID = this.roleID;
        this.addEditRolePermissionModalPopUP.show();
    }
    editRole(rolePermission: IRolePermissionDisplay) {
        console.log(rolePermission);
        this.addEditRolePermissionModalPopUP.editShow(rolePermission);
    }

}
