import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConstantModules, RoleShortConstants } from '../constant';
import { IDashboardDisplay } from '../core/interfaces/dashboard';
import { IRolePermissionDisplay } from '../core/interfaces/rolePermission';
import { DataProvider } from '../core/providers/data.provider';
import { User } from '../_models';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    roleShortConstants = RoleShortConstants;
    constantModules = ConstantModules;
    rolePermissions: IRolePermissionDisplay[] = [];
    dashboardRolePermission: IRolePermissionDisplay;
    userDetails: User;
    companyID: number = 0;
    dashboard: IDashboardDisplay;
    isUserNavigate: boolean = false;

    constructor(private dashboardService: DashboardService, private router: Router, private dataProvider: DataProvider,) {
        this.userDetails = JSON.parse(localStorage.getItem('ats-current-loggedin-user'));
        this.rolePermissions = JSON.parse(localStorage.getItem('role-permission'));
        this.dashboardRolePermission = this.rolePermissions.find(x => x.moduleShort === this.constantModules.DASHBOARD);
        this.companyID = this.userDetails.companyID;
        this.isUserNavigate = false;
        if (this.userDetails.roleShort === this.roleShortConstants.ADMIN || this.userDetails.roleShort === this.roleShortConstants.SUPERADMIN) {
            this.isUserNavigate = true;
        }
    }

    ngOnInit(): void {
        this.dashboardService.getDashboardCounts(this.companyID).subscribe(result => {
            this.dashboard = result;
        });
    }
    redirectToUser() {
        this.router.navigate(['/admin/user']);
    }
    redirectToCandidate() {
        this.router.navigate(['/candidate']);
    }
    redirectToRequirement() {
        this.router.navigate(['/requirements']);
    }
    redirectToReviewQueue() {
        this.dataProvider.storage = {
            isredirectDashboard: true
        }
        this.router.navigate(['/reviewQueue']);
    }

}
