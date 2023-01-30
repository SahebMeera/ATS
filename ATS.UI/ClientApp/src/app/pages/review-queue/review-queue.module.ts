import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { TableModule } from 'primeng/table';


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
import { ReviewQueueComponent } from './review-queue.component';
import { ReviewQueueRoutingModule } from './review-queue-routing.module';
import { ReviewQueueService } from './review-queue.service';
import { AddEditReviewQueueComponent } from './add-edit-review-queue/add-edit-review-queue.component';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { SharedModule } from '../../shared/shared.module';
import { AddEditInterviewScheduleComponent } from '../interview-schedule/add-edit-interview-schedule/add-edit-interview-schedule.component';
import { InterviewScheduleModule } from '../interview-schedule/interview-schedule.module';
import { MenuModule } from 'primeng/menu';
import { ToastModule } from 'primeng/toast';



@NgModule({
  declarations: [
    ReviewQueueComponent,
   AddEditReviewQueueComponent
  ],
    imports: [
      SharedModule,
      CommonModule,
      ReviewQueueRoutingModule,
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
        InterviewScheduleModule,
        MenuModule,
        ToastModule
     // NoteComponent
    ],
     providers: [
        IconService,
         MessageService,
         ReviewQueueService
    ]
})
export class ReviewQueueModule { }
