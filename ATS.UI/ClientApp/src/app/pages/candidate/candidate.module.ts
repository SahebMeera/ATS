import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CandidateRoutingModule } from './candidate-routing.module';
import { CandidateComponent } from './candidate.component';
import { TableModule } from 'primeng/table';


//import { ReviewRegistrationComponent } from './review-registration.component';
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
import { ChipsModule } from 'primeng/chips';
import { ToolbarModule } from 'primeng/toolbar';
import { MultiSelectModule } from 'primeng/multiselect';
import { CandidateService } from './candidate.service';
import { AddEditCandidateComponent } from './add-edit-candidate/add-edit-candidate.component';
import { SharedModule } from '../../shared/shared.module';
import { DocViewerComponentComponent } from './doc-viewer-component/doc-viewer-component.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { MenuModule } from 'primeng/menu';
import { ToastModule } from 'primeng/toast';


@NgModule({
  declarations: [
    CandidateComponent,
    AddEditCandidateComponent,
    DocViewerComponentComponent
  ],
  imports: [
    CommonModule,
      CandidateRoutingModule,
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
      DropdownModule,
      ChipsModule,
      InputTextModule,
      InputMaskModule,
      CheckboxModule,
      ReactiveFormsModule,
      InputNumberModule,
      InputSwitchModule,
      PasswordModule,
      ToolbarModule,
      MultiSelectModule,
      SharedModule,
      PdfViewerModule,
      MenuModule,
      ToastModule
    ],
     providers: [
        IconService,
         MessageService,
         CandidateService
    ]
})
export class CandidateModule { }
