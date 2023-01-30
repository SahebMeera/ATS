import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonUtils } from '../../../common/common-utils';
import { ConstantModules, RoleShortConstants } from '../../../constant';
import { IClientDisplay } from '../../../core/interfaces/client';
import { IInterviewScheduleDisplay } from '../../../core/interfaces/interviewSchedule';
import { IRolePermissionDisplay } from '../../../core/interfaces/rolePermission';
import { User } from '../../../_models/user';
import { AddEditClientComponent } from './add-edit/add-edit-client.component';
import { ClientService } from './client.service';

@Component({
  selector: 'app-client-schedule',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit {
    commonUtils = new CommonUtils();
    clientList: IClientDisplay[] = [];
    clients: IClientDisplay[] = [];
    roleShortConstants = RoleShortConstants;
    constantModules = ConstantModules;
    rolePermissions: IRolePermissionDisplay[] = [];
    clientRolePermission: IRolePermissionDisplay;
    isClientAddRolePermission: boolean = false;
    isClientUpdateRolePermission: boolean = false;
    userDetails: User;
    userName: string = '';
    cols: any[];

    @ViewChild('addEditClient') addEditClientModalPopUP: AddEditClientComponent;


    constructor(private clientService: ClientService) {
        this.userDetails = JSON.parse(localStorage.getItem('ats-current-loggedin-user'));
        this.rolePermissions = JSON.parse(localStorage.getItem('role-permission'));
        if (this.rolePermissions !== null && this.rolePermissions !== undefined && this.rolePermissions.length > 0) {
            this.clientRolePermission = this.rolePermissions.find(x => x.moduleShort === this.constantModules.CLIENTS);
            this.isClientAddRolePermission = false;
            this.isClientUpdateRolePermission = false;
            if (this.clientRolePermission !== null && this.clientRolePermission !== undefined && this.clientRolePermission.add === false) {
                console.log('here')
                this.isClientAddRolePermission = true;
            }
            if (this.clientRolePermission !== null && this.clientRolePermission !== undefined && this.clientRolePermission.update === false) {
                this.isClientUpdateRolePermission = true;
            }
        }
        console.log(this.isClientAddRolePermission, this.isClientUpdateRolePermission)
        this.userName = this.userDetails.firstName + '' + this.userDetails.lastName;
        this.loadclients();
    }

    ngOnInit(): void {
        this.cols = [
            { field: 'name', header: 'Name' },
            { field: 'company', header: 'Company' },
            { field: 'clientType', header: 'ClientType' },
            //{ field: 'duration', header: 'duration' },
            //{ field: 'timeZone', header: 'timeZone' },

        ];
  }

    loadclients() {
        this.clientService.getClient().subscribe(result => {
            this.clientList = result;
        })
    }

    addClient() {
        this.addEditClientModalPopUP.show();
    }
    editClient(client: IClientDisplay) {
        this.addEditClientModalPopUP.editShow(client);
    }
    applyFilterGlobal() {
        this.commonUtils.SearchFunction();
    }

}
