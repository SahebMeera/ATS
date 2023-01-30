import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { IRoleDisplay } from '../../../../core/interfaces/role';
import { IRolePermissionDisplay } from '../../../../core/interfaces/rolePermission';
import { User } from '../../../../_models/user';
import { RolePermissionService } from '../role-permission.service';

@Component({
  selector: 'app-add-edit-role-permission',
  templateUrl: './add-edit-role-permission.component.html',
  styleUrls: ['./add-edit-role-permission.component.scss']
})
export class AddEditRolePermissionComponent implements OnInit {
    @Output() loadRolePermissionDetails = new EventEmitter<any>();
    addEditHeaderText: string = 'Add Role Permission';
    isCandidateAddEdit: boolean = true;
    userDetails: User;
    roles: IRoleDisplay[] = [];
    roleName: string = '';
    @Input() roleID: number = 0;
    userName: string = '';
    rolePermissionDialog: boolean = false;
    submitted: boolean;
    isSaveButtonDisabled: boolean = false;
    addEditRolePermissionForm: FormGroup;
    rolePermissionList: IRolePermissionDisplay[] = [];
    modulesList: any[] = [];
    ErrorMessage: string = "";


    constructor(private messageService: MessageService,
        private fb: FormBuilder,private rolePermissionService: RolePermissionService) {
        this.userDetails = JSON.parse(localStorage.getItem('ats-current-loggedin-user'));
        this.userName = this.userDetails.firstName + '' + this.userDetails.lastName;
        this.buildAddEditRolePermissionForm({}, 'New');
        this.loadRoleDropdown();
        this.loadDropDownList();
       
    }

  ngOnInit(): void {
  }
    loadRoleDropdown() {
        this.rolePermissionService.getRole().subscribe(result => {
            this.roles = result;
        })
    }

    loadDropDownList() {
        this.rolePermissionService.getModule().subscribe(result => {
            console.log(result);
            this.modulesList = result;
        });
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
    buildAddEditRolePermissionForm(data: any, keyName: string) {
        this.addEditRolePermissionForm = this.fb.group({
            RolePermissionID: [keyName === 'New' ? 0 : data.rolePermissionID],
            RoleID: [keyName === 'New' ? null : data.roleID, Validators.required],
            ModuleID: [keyName === 'New' ? null : data.moduleID, Validators.required],
            View: [keyName === 'New' ? false : data.view],
            Add: [keyName === 'New' ? false : data.add],
            Update: [keyName === 'New' ? false : data.update],
            Delete: [keyName === 'New' ? false : data.delete],
            DateCreated: [keyName === 'New' ? new Date() : data.dateCreated],
            CreatedBy: [keyName === 'New' ? this.userDetails.firstName + ' ' + this.userDetails.lastName : data.createdBy],
            DateModified: [keyName === 'New' ? new Date() : data.dateModified],
            ModifiedBy: [keyName === 'New' ? this.userDetails.firstName + ' ' + this.userDetails.lastName : data.modifiedBy]
        });
    }
    show() {
        this.ErrorMessage = "";
        this.isSaveButtonDisabled = false;
        this.addEditHeaderText = 'Add Role Permission';
        if (this.roles !== undefined && this.roles !== null) {
            this.roleName = this.roles.find(x => x.roleID === this.roleID).roleName;
        }
        this.loadDropDownList();
        this.buildAddEditRolePermissionForm({}, 'New');
        this.addEditRolePermissionForm.controls.RoleID.patchValue(this.roleID);
        if (this.roleID !== null && this.roleID !== undefined && this.roleID !== 0) {
            this.loadRolePermission(this.roleID)
        }
        this.rolePermissionDialog = true
    }
    editShow(rolePermission: IRolePermissionDisplay) {
        this.ErrorMessage = "";
        this.isSaveButtonDisabled = false;
        this.addEditHeaderText = 'Edit Role Permission';
        this.roleName = rolePermission.roleName;
        this.buildAddEditRolePermissionForm(rolePermission, 'Edit');
        this.rolePermissionDialog = true
    }
    Cancel() {
        this.rolePermissionDialog = false;
        this.submitted = false;
        this.isSaveButtonDisabled = false;
    }
    close() {
        this.isSaveButtonDisabled = false;
        this.rolePermissionDialog = false;
        this.submitted = false;
    }
    savePermission() {
        this.submitted = true;
        console.log(this.addEditRolePermissionForm.value);
        if (this.addEditRolePermissionForm.invalid) {
            this.addEditRolePermissionForm.markAllAsTouched();
            return;
        } else {
            this.isSaveButtonDisabled = true;
            var rolePermission = this.rolePermissionList.find(x => x.roleID === this.addEditRolePermissionForm.value.RoleID && x.moduleID === this.addEditRolePermissionForm.value.ModuleID);
            if (rolePermission !== null && rolePermission !== undefined && this.addEditRolePermissionForm.value.RolePermissionID === 0) {
                this.ErrorMessage = 'Role Permission already exists in the system';
                this.isSaveButtonDisabled = false;
            } else {
                if (this.addEditRolePermissionForm.value.RolePermissionID === 0) {
                    this.rolePermissionService.addRolePermission(this.addEditRolePermissionForm.value).subscribe(result => {
                        if (result !== null && result !== undefined) {
                            this.messageService.add({ severity: 'success', summary: 'Role Permission Save Successfully', detail: '' });
                            this.isSaveButtonDisabled = true;
                        } else {
                            this.isSaveButtonDisabled = false;
                        }
                        this.submitted = false;
                        this.loadRolePermissionDetails.emit(this.roleID);
                        this.rolePermissionDialog = false;
                        this.buildAddEditRolePermissionForm({}, 'New');
                    })
                } else {
                    this.rolePermissionService.updateRolePermission(this.addEditRolePermissionForm.value).subscribe(result => {
                        if (result !== null && result !== undefined) {
                            this.messageService.add({ severity: 'success', summary: 'Role Permission Save Successfully', detail: '' });
                            this.isSaveButtonDisabled = true;
                        } else {
                            this.isSaveButtonDisabled = false;
                        }
                        this.submitted = false;
                        this.loadRolePermissionDetails.emit(this.roleID);
                        this.rolePermissionDialog = false;
                        this.buildAddEditRolePermissionForm({}, 'New');
                    })
                }
            }
        }
    }


    get addEditRolePermissionControls() { return this.addEditRolePermissionForm.controls; }
}
