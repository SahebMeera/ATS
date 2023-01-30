import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { Role } from '../../_models/role';
import { CompanyComponent } from './company/company.component';
import { AdminComponent } from './admin.component';
import { ClientComponent } from './client/client.component';
import { ReviewRegistrationComponent } from './review-registration/review-registration.component';
import { RolePermissionComponent } from './role-permission/role-permission.component';


const routes: Routes = [
    {
        path: '', component: AdminComponent, children:[
            {
                path: '', redirectTo: 'user', pathMatch: 'full',
            },
            {
                path: 'user', component: UserComponent,
            },
            {
                path: 'reviewRegistration',
                component: ReviewRegistrationComponent
            },
            {
                path: 'company',
                component: CompanyComponent
            },
            {
                path: 'client',
                component: ClientComponent
            },
            {
                path: 'role-permission',
                component: RolePermissionComponent
            }
          
	 ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
