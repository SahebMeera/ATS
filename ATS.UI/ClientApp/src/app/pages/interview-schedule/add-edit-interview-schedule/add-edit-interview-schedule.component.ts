import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IInterviewSchedule, IInterviewScheduleDisplay } from '../../../core/interfaces/interviewSchedule';
import { User } from '../../../_models/user';
import { RequirementService } from '../../requirements/requirement.service';
import { ReviewQueueService } from '../../review-queue/review-queue.service';
import { forkJoin } from 'rxjs';
import { IReviewQueueDisplay } from '../../../core/interfaces/reviewQueue';
import { ListTypeConstants } from '../../../constant';
import { IListValue } from '../../../core/interfaces/listValue';
import { InterviewScheduleService } from '../interview-schedule.service';
import { CommonUtils } from '../../../common/common-utils';
import { MessageService } from 'primeng/api';
import { IStatusFlowForDisplay } from '../../../core/interfaces/statusFlow';

@Component({
  selector: 'app-add-edit-interview-schedule',
  templateUrl: './add-edit-interview-schedule.component.html',
  styleUrls: ['./add-edit-interview-schedule.component.scss']
})
export class AddEditInterviewScheduleComponent implements OnInit {
    @Output() loadInterviewScheduleDetails = new EventEmitter<any>();
    @Output() loadReviewQueueDetails = new EventEmitter<any>();
    candidateList: IInterviewScheduleDisplay[] = [];
    addEditHeaderText: string = 'Add Interview Schedule';
    isCandidateAddEdit: boolean = true;
    userDetails: User;
    userName: string = '';
    interviewScheduleDialog: boolean = false;
    submitted: boolean;
    addEditInterviewScheduleForm: FormGroup;
    reviewQueueList: IReviewQueueDisplay[] = [];
    interviewTypeList: IListValue[] = [];
    reviewStatusList: IListValue[] = [];
    timesoneList: any[] = [];
    minimumDate = new Date();
    commonUtils = new CommonUtils();
    interviewScheduleForm: IInterviewSchedule
    isSaveButtonDisabled: boolean = false;
    statusFlow: IStatusFlowForDisplay[] = [];
    currentStatusID: number = 0;

    constructor(private messageService: MessageService,private fb: FormBuilder, private requirementService: RequirementService, private interviewScheduleService: InterviewScheduleService,
        private reviewQueueService: ReviewQueueService) {
        this.userDetails = JSON.parse(localStorage.getItem('ats-current-loggedin-user'));
        this.userName = this.userDetails.firstName + '' + this.userDetails.lastName;
        this.buildAddEditInteviewScheduleForm({}, 'New');
        this.loadDropDownList();
    }

    ngOnInit(): void {
        this.timesoneList = [
            { label: 'EST', value: 'EST'},
            { label: 'CST', value: 'CST'},
            { label: 'MST', value: 'MST'},
            { label: 'PST', value: 'PST'},
            { label: 'IST', value: 'IST'}
        ]
  }
    

    loadDropDownList() {
        forkJoin(
            this.reviewQueueService.getReviewQueueList(),
            this.requirementService.getListValues()
        ).subscribe(result => {
            if (result[0] !== null && result[0].length > 0) {
                if (this.isReviewQueueID !== 0) {
                    this.reviewQueueList = result[0].filter(x => x.reviewQueueID === this.isReviewQueueID);
                } else {
                    this.reviewQueueList = result[0];
                }
                //this.reviewQueueList = result[0];
                this.reviewQueueList = this.reviewQueueList.map((x: any) => ({ ...x, requirementCandidate: x.candidate + ' ' + x.requirement }))
            }
            if (this.reviewQueueList !== null && this.reviewQueueList.length === 1) {

                this.addEditInterviewScheduleForm.controls.ReviewQueueID.patchValue(this.reviewQueueList[0].reviewQueueID)
            }
            if (result[1] !== null && result[1].length > 0) {
                this.interviewTypeList = result[1].filter(x => x.type.toUpperCase() === ListTypeConstants.INTREVIEWTYPE);
                this.reviewStatusList = result[1].filter(x => x.type.toUpperCase() === ListTypeConstants.REVIEWSTATUS);

            }
        })
    }

    buildAddEditInteviewScheduleForm(data: any, keyName: string) {
      this.addEditInterviewScheduleForm = this.fb.group({
            InterviewScheduleID: [keyName === 'New' ? 0 : data.interviewScheduleID],
            ReviewQueueID: [keyName === 'New' ? null : data.reviewQueueID, Validators.required],
            ReviewStatusID: [keyName === 'New' ? null : data.reviewStatusID],
            DateInterview: [keyName === 'New' ? '' : new Date(data.dateInterview), Validators.required],
            Duration: [keyName === 'New' ? null : data.duration, Validators.required],
            InterviewTypeID: [keyName === 'New' ? null : data.interviewTypeID, Validators.required],
            TimeZone: [keyName === 'New' ? '' : data.timeZone, Validators.required],
            Comment: [keyName === 'New' ? '' : data.comment],
            DateCreated: [keyName === 'New' ? new Date() : data.dateCreated],
            CreatedBy: [keyName === 'New' ? this.userDetails.firstName + ' ' + this.userDetails.lastName : data.createdBY],
            DateModified: [keyName === 'New' ? new Date() : data.dateModified],
            ModifiedBy: [keyName === 'New' ? this.userDetails.firstName + ' ' + this.userDetails.lastName : data.modifiedBy],
           // TimeStamp: [keyName === 'New' ? new Date() : data.timeStamp],
        });
    }
    isReviewQueue: boolean = false;
    isReviewQueueID: number = 0;
    show(isReviewQueue: boolean, isReviewQueueID: number) {
        this.isReviewQueue = isReviewQueue;
        this.isReviewQueueID = isReviewQueueID;
        this.addEditHeaderText = 'Add Interview Schedule';
        this.loadDropDownList();
        this.buildAddEditInteviewScheduleForm({}, 'New');
        let DateInterview = this.commonUtils.defaultDateTimeLocalSet(new Date());
        this.addEditInterviewScheduleForm.controls.DateInterview.patchValue(new Date(DateInterview));
        if (this.reviewStatusList.length > 0) {
            this.addEditInterviewScheduleForm.controls.ReviewStatusID.patchValue(this.reviewStatusList.find(x => x.valueShort === 'SCHEDULED').listValueID);
        }
        this.interviewScheduleDialog = true
    }

    editShow(interview: IInterviewScheduleDisplay) {
        this.addEditHeaderText = 'Edit Interview Schedule';
        this.buildAddEditInteviewScheduleForm(interview, 'Edit');
        this.addEditInterviewScheduleForm.controls.TimeZone.patchValue(this.timesoneList.find(x => x.value === interview.timeZone).value);
        if (this.reviewQueueList.length > 0) {
            this.addEditInterviewScheduleForm.controls.ReviewQueueID.patchValue(this.reviewQueueList.find(x => x.reviewQueueID === interview.reviewQueueID))
        }
        this.interviewScheduleDialog = true;
        this.currentStatusID = interview.reviewStatusID;
        forkJoin([
            this.requirementService.getListValues(),
            this.reviewQueueService.getStatusFlow(7, this.currentStatusID)
        ]).subscribe(result => {
            this.reviewStatusList = result[0].filter(x => x.type.toUpperCase() === ListTypeConstants.REVIEWSTATUS);
            this.statusFlow = result[1];
            let arr = [];
            this.statusFlow.forEach(x => {
                arr.push(x.nextStatus);
            });
            this.reviewStatusList = this.reviewStatusList.filter(x => arr.includes(x.listValueID));
        });
    }

    Cancel() {
        this.interviewScheduleDialog = false;
        this.submitted = false;
    }
    saveCandidate() {
        this.submitted = true;
        if (this.addEditInterviewScheduleForm.invalid) {
            this.addEditInterviewScheduleForm.markAllAsTouched();
            return;
        } else {
            let DateInterview = this.commonUtils.defaultDateTimeLocalSet(this.addEditInterviewScheduleForm.value.DateInterview);
           // this.addEditInterviewScheduleForm.controls.DateInterview.patchValue(new Date(DateInterview));
            this.interviewScheduleForm = {
                InterviewScheduleID: this.addEditInterviewScheduleForm.value.InterviewScheduleID,
                ReviewQueueID: this.addEditInterviewScheduleForm.value.ReviewQueueID.reviewQueueID,
                ReviewStatusID: this.addEditInterviewScheduleForm.value.ReviewStatusID,
                DateInterview: DateInterview,
                Duration: this.addEditInterviewScheduleForm.value.Duration,
                InterviewTypeID: this.addEditInterviewScheduleForm.value.InterviewTypeID,
                TimeZone: this.addEditInterviewScheduleForm.value.TimeZone,
                Comment: this.addEditInterviewScheduleForm.value.Comment,
                DateCreated: this.addEditInterviewScheduleForm.value.DateCreated ,
                CreatedBy: this.addEditInterviewScheduleForm.value.CreatedBy,
                DateModified: this.addEditInterviewScheduleForm.value.DateModified,
                ModifiedBy: this.addEditInterviewScheduleForm.value.ModifiedBy,
                CommentBy: this.userDetails.id
            }
            this.isSaveButtonDisabled = true;
            if (this.interviewScheduleForm.InterviewScheduleID === 0) {
                this.interviewScheduleService.addInterviewSchedule(this.interviewScheduleForm).subscribe(result => {
                    if (result !== null && result !== undefined) {
                        this.messageService.add({ severity: 'success', summary: 'Interview Schedule Save Successfully', detail: '' });
                        this.isSaveButtonDisabled = true;
                    } else {
                        this.isSaveButtonDisabled = false;
                    }
                    this.submitted = false;
                    if (this.isReviewQueue === true) {
                        this.loadReviewQueueDetails.emit();
                    } else {
                        this.loadInterviewScheduleDetails.emit();
                    }
                    this.interviewScheduleDialog = false;
                    this.buildAddEditInteviewScheduleForm({}, 'New');
                })
            } else {
                this.interviewScheduleService.updateInterviewSchedule(this.interviewScheduleForm).subscribe(result => {
                    if (result !== null && result !== undefined) {
                        this.messageService.add({ severity: 'success', summary: 'Interview Schedule Save Successfully', detail: '' });
                        this.isSaveButtonDisabled = true;
                    } else {
                        this.isSaveButtonDisabled = false;
                    }
                    this.submitted = false;
                    this.loadInterviewScheduleDetails.emit();
                    this.interviewScheduleDialog = false;
                    this.buildAddEditInteviewScheduleForm({}, 'New');

               })
            }
        }
    }
    filteredReviewQueueList: IReviewQueueDisplay[] = [];

    filterCountry(event) {
        //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
        let filtered: any[] = [];
        let query = event.query;

        for (let i = 0; i < this.reviewQueueList.length; i++) {
            let country = this.reviewQueueList[i];
            if (country.requirementCandidate.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                filtered.push(country);
            }
        }
        this.filteredReviewQueueList = filtered;
    }
 
   get addEditInterviewScheduleFormControls() { return this.addEditInterviewScheduleForm.controls; }


}
