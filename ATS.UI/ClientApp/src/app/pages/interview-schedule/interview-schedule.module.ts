import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { InterviewScheduleRoutingModule } from './interview-schedule-routing.module';
import { InterviewScheduleService } from './interview-schedule.service';
import { InterviewScheduleComponent } from './interview-schedule.component';
import { AddEditInterviewScheduleComponent } from './add-edit-interview-schedule/add-edit-interview-schedule.component';
import { CalendarModule } from 'primeng/calendar';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ReviewQueueModule } from '../review-queue/review-queue.module';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ToastModule } from 'primeng/toast';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
    declarations: [
        InterviewScheduleComponent,
        AddEditInterviewScheduleComponent
  ],
  imports: [
    CommonModule,
      InterviewScheduleRoutingModule,
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
      CalendarModule,
      InputTextareaModule,
      AutoCompleteModule,
      ToastModule,
      SharedModule
    ],
    exports: [AddEditInterviewScheduleComponent],
     providers: [
        IconService,
         MessageService,
         InterviewScheduleService
    ]
    
})
export class InterviewScheduleModule { }
