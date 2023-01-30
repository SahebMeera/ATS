import { Component, OnInit } from '@angular/core';
import { Role } from './_models/role';
import { AuthenticationService } from './_services/authentication.service';

@Component({
    selector: 'app-menu',
    template: `
        <div class="menu">
            <ul class="layout-menu">
                <li app-menuitem *ngFor="let item of model; let i = index;" [item]="item" [index]="i" [root]="true"></li>
            </ul>
        </div>
    `
})
export class AppMenuComponent implements OnInit {

    model: any[];
    role: string;
    constructor(private authenticationService: AuthenticationService) {
        this.role = authenticationService.userValue.roleShort;
    }

    ngOnInit() {

        this.model = [
            { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/dashboard'] },
            {
                label: 'Admin', icon: 'pi pi-fw pi-compass', routerLink: ['admin'], visible: this.role === Role.Admin || this.role === Role.SuperAdmin,
                items: [
                    { label: 'User', icon: 'pi pi-fw pi-user', routerLink: ['admin/user'], visible: this.role === Role.Admin || this.role === Role.SuperAdmin },
                   // { label: 'Role', icon: 'pi pi-fw pi-cog', routerLink: ['admin/roles'], visible: this.role === Role.SuperAdmin },
                    { label: 'Role Permission', icon: 'pi pi-cog', routerLink: ['admin/role-permission'], visible: this.role === Role.SuperAdmin },
                    { label: 'Review Registration', icon: 'pi pi-fw pi-user', routerLink: ['admin/reviewRegistration'], visible: this.role === Role.SuperAdmin },
                    { label: 'Company', icon: 'pi pi-fw pi-user', routerLink: ['admin/company'], visible: this.role === Role.Admin || this.role === Role.SuperAdmin },
                    { label: 'Clients', icon: 'pi pi-fw pi-user', routerLink: ['admin/client'], visible: this.role === Role.Admin || this.role === Role.SuperAdmin },
                    
                    //{label: 'Skills', icon: 'pi pi-fw pi-external-link', routerLink: ['admin/skills']},
                ]
            },
            {
                label: 'Requirements', icon: 'pi pi-fw pi-compass', routerLink: ['/requirements']
            },
            {
                label: 'Review Queue', icon: 'pi pi-fw pi-user', routerLink: ['/reviewQueue']
            },
           
            {
                label: 'Interview Schedule', icon: 'pi pi-fw pi-compass', routerLink: ['interviewSchedule']
            },
            {
                label: 'Candidate', icon: 'pi pi-fw pi-user', routerLink: ['/candidate']
            },
            //{
            //    label: 'Documentation', icon: 'pi pi-fw pi-info-circle', routerLink: ['/documentation']
            //}
            {
                label: 'Logout', icon: 'pi pi-fw pi-power-off', routerLink: ['/login']
            }
        ];
    }
}
