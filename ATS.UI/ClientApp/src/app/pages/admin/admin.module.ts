import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TableModule} from 'primeng/table';


//import { ReviewRegistrationComponent } from './review-registration.component';
import { MessageService } from 'primeng/api';
import { IconService } from 'src/app/demo/service/iconservice';
import { InputTextModule } from 'primeng/inputtext';
import {DialogModule} from 'primeng/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import {InputNumberModule} from 'primeng/inputnumber';
import {InputSwitchModule} from 'primeng/inputswitch';
import {PasswordModule} from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { InputMaskModule } from 'primeng/inputmask';
import { DropdownModule } from 'primeng/dropdown';
import { AdminRoutingModule } from './admin-routing.module';
import { UserComponent } from './user/user.component';
import { UserService } from './user/user.service';
import { ToolbarModule } from 'primeng/toolbar';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToastModule } from 'primeng/toast';
import { CompanyComponent } from './company/company.component';
import { AddEditCompanyComponent } from './company/add-edit-company/add-edit-company.component';
import { CompanyService } from './company/company.service';
import { AdminComponent } from './admin.component';
import { ClientComponent } from './client/client.component';
import { AddEditClientComponent } from './client/add-edit/add-edit-client.component';
import { CalendarModule } from 'primeng/calendar';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ClientService } from './client/client.service';
import { ReviewRegistrationComponent } from './review-registration/review-registration.component';
import { RolePermissionComponent } from './role-permission/role-permission.component';
import { RolePermissionService } from './role-permission/role-permission.service';
import { AddEditRolePermissionComponent } from './role-permission/add-edit-role-permission/add-edit-role-permission.component';



@NgModule({
    declarations: [
    UserComponent,
    CompanyComponent,
        AddEditCompanyComponent,
        ClientComponent,
        AddEditClientComponent,
        ReviewRegistrationComponent,
        RolePermissionComponent,
        AddEditRolePermissionComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    DropdownModule,
    InputTextModule,
    InputMaskModule,
    CheckboxModule,
    ReactiveFormsModule,
	InputNumberModule,
	InputSwitchModule,
    PasswordModule,
    ToolbarModule,
    MultiSelectModule,
      CardModule,
      CalendarModule,
      InputTextareaModule,
      AutoCompleteModule,
      ToastModule,
  ],
   providers: [
    IconService,
       MessageService,
       UserService,
       CompanyService,
       ClientService,
       RolePermissionService
]
})
export class AdminModule { }
