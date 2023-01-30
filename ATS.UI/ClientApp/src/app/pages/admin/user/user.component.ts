import { Component, OnInit, ViewChild } from '@angular/core';
import { IUser, IUserDisplay, IUserForm } from '../../../core/interfaces/user';
import { UserService } from './user.service';
import { Table } from 'primeng/table/primeng-table';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { IRoleDisplay } from '../../../core/interfaces/role';
import { ICompanyDisplay } from '../../../core/interfaces/company';
import { forkJoin } from 'rxjs';
import { MessageService, SelectItem } from 'primeng/api';
import { Role } from '../../../_models/role';
import { CommonUtils } from '../../../common/common-utils';
import { IRolePermissionDisplay } from '../../../core/interfaces/rolePermission';
import { ConstantModules } from '../../../constant';



@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
    @ViewChild('dt') table: Table;
    commonUtils = new CommonUtils();
    users: IUserDisplay[];
    roles: IRoleDisplay[];
    companyList: ICompanyDisplay[];
    cols: any[];
    userDialog: boolean = false;
    addEditHeaderText: string = 'Add User';
    isUserAddEdit: boolean = true;
    userDetails: IUserDisplay;
    constantModules = ConstantModules;
    rolePermissions: IRolePermissionDisplay[] = [];
    rolePermission: IRolePermissionDisplay;
    isAddRolePermission: boolean = false;
    isUpdateRolePermission: boolean = false;
    userName: string = '';

    submitted: boolean;
    addEditUserForm: FormGroup;
    registration: IUserDisplay;
    updateRegistrationForm: IUserForm;
    rolesFilters: SelectItem[] = [];
    isAtciveStatus: SelectItem[] = [];
    selectedScopes: any[];
    rolesFilters1: any[] = [];
    isSaveButtonDisabled: boolean = false;

    constructor(private messageService: MessageService,private userService: UserService, private fb: FormBuilder) {
        this.userDetails = JSON.parse(localStorage.getItem('ats-current-loggedin-user'));
        this.rolePermissions = JSON.parse(localStorage.getItem('role-permission'));
        this.userName = this.userDetails.firstName + '' + this.userDetails.lastName;
        if (this.rolePermissions !== null && this.rolePermissions !== undefined && this.rolePermissions.length > 0) {
            this.rolePermission = this.rolePermissions.find(x => x.moduleShort === this.constantModules.USER);
            this.isAddRolePermission = false;
            this.isUpdateRolePermission = false;
            if (this.rolePermission !== null && this.rolePermission !== undefined && this.rolePermission.add === false) {
                this.isAddRolePermission = true;
            }
            if (this.rolePermission !== null && this.rolePermission !== undefined && this.rolePermission.update === false) {
                this.isUpdateRolePermission = true;
            }
        }
        this.buildAddEditUserForm({}, 'New');
       this.loadDropDownList();
        this.loadUserList();
       
    }

    ngOnInit(): void {
        this.cols = [
            { field: 'firstName', header: 'FirstName' },
            { field: 'lastName', header: 'LastName' },
            { field: 'companyName', header: 'Company' },
            { field: 'roleName', header: 'Role' },
            { field: 'email', header: 'Email' }
        ];
        this.rolesFilters = [
            { label: 'Admin', value: 'Admin' },
            { label: 'Super Admin', value: 'Super Admin' }
        ]
        this.rolesFilters1 = [
            { ID: 1, label: 'Admin', value: 'Admin', IsSelected: false },
            { ID: 2, label: 'Super Admin', value: 'Super Admin', IsSelected: false }
        ]
        this.isAtciveStatus = [
            { label: 'Active', value: true },
            { label: 'NotActive', value: false }
        ]
        this.selectedScopes = [];
        //this.rolesFilters.map((item) => this.selectedScopes.push(item.value === 'Admin' ? item.value : ""));
        this.loadUserList();
        
        
    }
    loadDropDownList() {
        forkJoin(
            this.userService.getRoleList(),
            this.userService.getCompanyList()
        ).subscribe(result => {
            if (this.userDetails.roleShort === Role.Admin) {
                this.roles = result[0].filter(x => x.roleShort !== Role.SuperAdmin);
            } else {
                this.roles = result[0];
            }
            this.companyList = result[1];
        })
    }

    loadUserList() {
        this.userService.getUserList().subscribe(result => {
            this.users = result;
            //this.table.filteredValue=['roleName']
            //this.table.filters = { value: 'Admin', matchMode: 'search' }
            //this.table.filters['roleName'] = [{ value: 'Admin', matchMode: 'in', operator: 'text'}];
        });
    }

    buildAddEditUserForm(data: any, keyName: string) {
        this.addEditUserForm = this.fb.group({
            UserID: [keyName === 'New' ? 0 : data.userID],
            FirstName: [keyName === 'New' ? '' : data.firstName, Validators.required],
            LastName: [keyName === 'New' ? '' : data.lastName, Validators.required],
            Email: [keyName === 'New' ? '' : data.email, [Validators.required, Validators.email]],
            Password: [keyName === 'New' ? '' : data.password, Validators.required],
            CompanyID: [keyName === 'New' ? null : data.companyID, Validators.required],
            RoleID: [keyName === 'New' ? null : data.roleID, Validators.required],
            IsActive: [keyName === 'New' ? false : data.isActive, Validators.required],
            CreatedBy: [keyName === 'New' ? this.userDetails.firstName + ' ' + this.userDetails.lastName : data.createdBy],
            ModifiedBy: [keyName === 'New' ? this.userDetails.firstName + ' ' + this.userDetails.lastName : data.modifiedBy],
            IsTempPassword: [keyName === 'New' ? true : data.isTempPassword],
        });
    }
    addUser() {
        this.ErrorMessage = "";
        this.addEditHeaderText = 'Add User';
        this.buildAddEditUserForm({}, 'New');
        this.loadDropDownList();
        this.isSaveButtonDisabled = false;
        this.isUserAddEdit = true;
        this.userDialog = true;
    }
    editUser(user: IUser) {
        this.ErrorMessage = "";
        this.buildAddEditUserForm(user, 'Edit');
        this.addEditHeaderText = 'Edit User';
        this.isUserAddEdit = false;
        this.isSaveButtonDisabled = false;
        this.userDialog = true;
    }
    ErrorMessage: string = '';
    userValidation() {
        this.submitted = true;
        if (this.addEditUserForm.invalid) {
            this.addEditUserForm.markAllAsTouched();
            return;
        } else {
            this.ErrorMessage = '';
            if (this.userDetails.roleShort !== Role.SuperAdmin) {
                if (this.users != null && this.users.length > 0) {
                    var emailsList = this.users.map(e => ({ email: e.email.split('@')[1].toLowerCase(), isActive: e.isActive }));
                    var email = this.addEditUserForm.value.Email.toLowerCase().split('@');
                    console.log("email", email)
                    console.log("email", emailsList)
                    var isEmailExist = emailsList.find(x => x.email === email[1]);
                    console.log('isEmailExist', isEmailExist)
                    if (isEmailExist != null && isEmailExist !== undefined && this.addEditUserForm.value.UserID === 0) {
                        this.ErrorMessage = "Email required for same company domain";
                    } else {
                        this.saveUser();
                    }
                } else {
                    this.saveUser();
                }
            } else {
                this.saveUser();
            }
        }
    }

    saveUser() {
        this.isSaveButtonDisabled = true;
        if (this.addEditUserForm.value.UserID === 0) {
            this.userService.addUser(this.addEditUserForm.value).subscribe(result => {
                if (result !== null && result !== undefined) {
                    this.messageService.add({ severity: 'success', summary: 'User Save Successfully', detail: '' });
                    this.isSaveButtonDisabled = true;
                } else {
                    this.isSaveButtonDisabled = true;
                }
                this.isUserAddEdit = true;
                this.submitted = false;
                this.loadUserList();
                this.userDialog = false;
            })
        } else {
            this.userService.updateUser(this.addEditUserForm.value).subscribe(result => {
                if (result !== null && result !== undefined) {
                    this.messageService.add({ severity: 'success', summary: 'User Save Successfully', detail: '' });
                    this.isSaveButtonDisabled = true;
                } else {
                    this.isSaveButtonDisabled = true;
                }
                this.isUserAddEdit = true;
                this.submitted = false;
                this.loadUserList();
                this.userDialog = false;
            })
        }
    }
    Cancel() {
        this.isSaveButtonDisabled = false;
        this.userDialog = false;
        this.submitted = false;
    }
    close() {
        this.isSaveButtonDisabled = false;
        this.userDialog = false;
        this.submitted = false;
    }

    get addeditUserFormControls() { return this.addEditUserForm.controls; }
    applyFilterGlobal() {
        this.commonUtils.SearchFunction();
    }


}
