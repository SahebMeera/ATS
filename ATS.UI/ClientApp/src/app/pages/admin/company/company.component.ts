import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonUtils } from '../../../common/common-utils';
import { ConstantModules, RoleShortConstants } from '../../../constant';
import { ICompanyDisplay } from '../../../core/interfaces/company';
import { IRolePermissionDisplay } from '../../../core/interfaces/rolePermission';
import { User } from '../../../_models/user';
import { AddEditCompanyComponent } from './add-edit-company/add-edit-company.component';
import { CompanyService } from './company.service';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {
    commonUtils = new CommonUtils();
    companyList: ICompanyDisplay[] = [];
    companys: ICompanyDisplay[] = [];
    roleShortConstants = RoleShortConstants;
    constantModules = ConstantModules;
    rolePermissions: IRolePermissionDisplay[] = [];
    rolePermission: IRolePermissionDisplay;
    isAddRolePermission: boolean = false;
    isUpdateRolePermission: boolean = false;
    userDetails: User;
    userName: string = '';
    cols: any[];
    @ViewChild('addEditCompany') addEditCompanyModalPopUP: AddEditCompanyComponent;

    constructor(private companyService: CompanyService) {
        this.userDetails = JSON.parse(localStorage.getItem('ats-current-loggedin-user'));
        this.rolePermissions = JSON.parse(localStorage.getItem('role-permission'));
        this.userName = this.userDetails.firstName + '' + this.userDetails.lastName;
        if (this.rolePermissions !== null && this.rolePermissions !== undefined && this.rolePermissions.length > 0) {
            this.rolePermission = this.rolePermissions.find(x => x.moduleShort === this.constantModules.COMPANY);
            this.isAddRolePermission = false;
            this.isUpdateRolePermission = false;
            if (this.rolePermission !== null && this.rolePermission !== undefined && this.rolePermission.add === false) {
                console.log('here')
                this.isAddRolePermission = true;
            }
            if (this.rolePermission !== null && this.rolePermission !== undefined && this.rolePermission.update === false) {
                this.isUpdateRolePermission = true;
            }
        }
        this.loadCompanys();
    }

  ngOnInit(): void {
  }
    loadCompanys() {
        this.companyService.getCompany().subscribe(result => {
            this.companyList = result;
        })
    }

    addCompany() {
      this.addEditCompanyModalPopUP.show();
    }
    editCompany(company: ICompanyDisplay) {
        this.addEditCompanyModalPopUP.editShow(company);
    }
    applyFilterGlobal() {
        this.commonUtils.SearchFunction();
    }

}
