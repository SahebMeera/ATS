import { RouterModule, PreloadAllModules } from '@angular/router';
import {NgModule} from '@angular/core';
// import {DashboardDemoComponent} from './demo/view/dashboarddemo.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import {AppMainComponent} from './app.main.component';
import {AppNotfoundComponent} from './pages/app.notfound.component';
import {AppErrorComponent} from './pages/app.error.component';
import {AppAccessdeniedComponent} from './pages/app.accessdenied.component';
import {AppLoginComponent} from './pages/app.login.component';
import {AppCrudComponent} from './pages/app.crud.component';
import {AppCalendarComponent} from './pages/app.calendar.component';
import {AppInvoiceComponent} from './pages/app.invoice.component';
import {AppHelpComponent} from './pages/app.help.component';

import { AppTimelineDemoComponent } from './pages/app.timelinedemo.component';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { ApproveAccountComponent } from './pages/registration/approve-account/approve-account.component';
import { AuthGuard } from './_helpers';
import { Role } from './_models/role';

@NgModule({
    imports: [
        RouterModule.forRoot([
            { path: '', component: HomeComponent },
            {
                path: '', component: AppMainComponent,
                children: [
                  //  { path: '', component: HomeComponent },
                    {
                        path: 'dashboard',
                        component: DashboardComponent,
                        canActivate: [AuthGuard],
                        data: { roles: [Role.SuperAdmin, Role.Admin, Role.Reviewer, Role.TalentAssociate] }
                    },
                    {
                        path: 'candidate',
                        loadChildren: () => import('./pages/candidate/candidate.module').then(m => m.CandidateModule),
                        canActivate: [AuthGuard],
                        data: { roles: [Role.SuperAdmin, Role.Admin, Role.Reviewer, Role.TalentAssociate] }
                    },
                    //{
                    //    path: 'reviewRegistration',
                    //    loadChildren: () => import('./pages/review-registration/review-registration.module').then(m => m.ReviewRegistrationModule),
                    //    canActivate: [AuthGuard],
                    //    data: { roles: [Role.SuperAdmin] }
                    //},
                    {
                        path: 'admin',
                        loadChildren: () => import('./pages/admin/admin.module').then(m => m.AdminModule),
                        canActivate: [AuthGuard],
                        data: { roles: [Role.SuperAdmin, Role.Admin] }
                    },
                    {
                        path: 'reviewQueue',
                        loadChildren: () => import('./pages/review-queue/review-queue.module').then(m => m.ReviewQueueModule),
                        canActivate: [AuthGuard],
                        data: { roles: [Role.SuperAdmin, Role.Admin, Role.Reviewer, Role.TalentAssociate] }
                    },
                     {
                        path: 'requirements',
                        loadChildren: () => import('./pages/requirements/requirements.module').then(m => m.RequirementsModule),
                        canActivate: [AuthGuard],
                         data: { roles: [Role.SuperAdmin, Role.Admin, Role.Reviewer, Role.TalentAssociate] }
                    },
                    {
                        path: 'interviewSchedule',
                        loadChildren: () => import('./pages/interview-schedule/interview-schedule.module').then(m => m.InterviewScheduleModule),
                        canActivate: [AuthGuard],
                        data: { roles: [Role.SuperAdmin, Role.Admin, Role.Reviewer, Role.TalentAssociate] }
                    },
                    //{
                    //    path: 'client',
                    //    loadChildren: () => import('./pages/client/client.module').then(m => m.ClientModule),
                    //    canActivate: [AuthGuard],
                    //    data: { roles: [Role.SuperAdmin, Role.Admin] }
                    //},
                    //{
                    //    path: 'company',
                    //    loadChildren: () => import('./pages/company/company.module').then(m => m.CompanyModule),
                    //    canActivate: [AuthGuard],
                    //    data: { roles: [Role.SuperAdmin] }
                    //}
                ]
            },
            {
                path: 'registration',
                loadChildren: () => import('./pages/registration/registration.module').then(m => m.RegistrationModule)
            },
            {path: 'error', component: AppErrorComponent},
            {path: 'access', component: AppAccessdeniedComponent},
            {path: 'notfound', component: AppNotfoundComponent},
            { path: 'login', component: LoginComponent},
            { path: 'Registration/ApproveAccount/:Guid', component: ApproveAccountComponent},
            {path: '**', redirectTo: '/notfound'},
        ],  {
            preloadingStrategy: PreloadAllModules
    })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
