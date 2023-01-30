import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { TableModule } from 'primeng/table';
import { EditorModule } from '@tinymce/tinymce-angular';


import { MessageService } from 'primeng/api';
import { IconService } from 'src/app/demo/service/iconservice';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { InputMaskModule } from 'primeng/inputmask';
import { DropdownModule } from 'primeng/dropdown';
import { ToolbarModule } from 'primeng/toolbar';
import { MultiSelectModule } from 'primeng/multiselect';
import { ChipsModule } from 'primeng/chips';
import { RequirementService } from './requirement.service';
import { RequirementsComponent } from './requirements.component';
import { RequirementsRoutingModule } from './requirements-routing.module';
import { AddEditRequirementComponent } from './add-edit-requirement/add-edit-requirement.component';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ViewDetailRequirementComponent } from './view-detail-requirement/view-detail-requirement.component';
import { SharedModule } from '../../shared/shared.module';
import { MenuModule } from 'primeng/menu';
import { ToastModule } from 'primeng/toast';



@NgModule({
  declarations: [
        RequirementsComponent,
        AddEditRequirementComponent,
        ViewDetailRequirementComponent,
  ],
  imports: [
      CommonModule,
      RequirementsRoutingModule,
      CommonModule,
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
      ChipsModule,
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
      InputTextareaModule,
      EditorModule,
      SharedModule,
      MenuModule,
      ToastModule
    ],
     providers: [
        IconService,
         MessageService,
         RequirementService
    ],
    exports: [ViewDetailRequirementComponent],
})
export class RequirementsModule { }
