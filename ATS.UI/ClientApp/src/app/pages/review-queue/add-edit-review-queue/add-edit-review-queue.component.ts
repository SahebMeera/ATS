import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ICandidateDisplay } from '../../../core/interfaces/candidate';
import { IUserDisplay } from '../../../core/interfaces/user';
import { CandidateService } from '../../candidate/candidate.service';
import { forkJoin } from 'rxjs';
import { IReviewQueueDisplay, IReviewQueueForm } from '../../../core/interfaces/reviewQueue';
import { RequirementService } from '../../requirements/requirement.service';
import { IRequirementDisplay, IRequirementForm } from '../../../core/interfaces/requirements';
import { UserService } from '../../admin/user/user.service';
import { ListTypeConstants, ReviewStatusConstants, RoleShortConstants } from '../../../constant';
import { IListValue } from '../../../core/interfaces/listValue';
import { INoteDisplay, INoteForm } from '../../../core/interfaces/note';
import { User } from '../../../_models/user';
import { ReviewQueueService } from '../review-queue.service';
import { MessageService } from 'primeng/api';
import { IStatusFlowForDisplay } from '../../../core/interfaces/statusFlow';

@Component({
  selector: 'app-add-edit-review-queue',
  templateUrl: './add-edit-review-queue.component.html',
  styleUrls: ['./add-edit-review-queue.component.scss']
})
export class AddEditReviewQueueComponent implements OnInit {
    @Output() loadReviewQueueDetails = new EventEmitter<any>();
    reviewStatusConstants = ReviewStatusConstants;
    requirements: IRequirementDisplay[] = [];
    reviewerList: IUserDisplay[] = [];
    submittedByList: IUserDisplay[] = [];
    reviewStatusList: IListValue[] = [];
    PayRateTypeListValues: IListValue[] = [];
    addEditHeaderText: string = 'Add ReviewQueue';
    userDetails: User;
    userName: string = '';
    reviewQueueDialog: boolean = false;
    isEditableRateTypeRate: boolean = false;
    submitted: boolean;
    addEditReviewQueueForm: FormGroup;
    reviewQueueForm: IReviewQueueForm
    isSaveButtonDisabled: boolean = false;
    statusFlow: IStatusFlowForDisplay[] = [];
    currentStatusID: number = 0;
    isReviewerDisabled = false;

    constructor(private messageService: MessageService,private fb: FormBuilder, private candidateService: CandidateService,
        private userService: UserService,
        private requirementService: RequirementService,
        private reviewQueueService: ReviewQueueService) {
        this.userDetails = JSON.parse(localStorage.getItem('ats-current-loggedin-user'));
        this.userName = this.userDetails.firstName + '' + this.userDetails.lastName;
        this.buildAddEditReviewQueueForm({}, 'New');
        this.loadDropDownList();
    }


  ngOnInit(): void {
  }

    buildAddEditReviewQueueForm(data: any, keyName: string) {
        this.addEditReviewQueueForm = this.fb.group({
            ReviewQueueID: [keyName === 'New' ? 0 : data.reviewQueueID],
            RequirementID: [keyName === 'New' ? 0 : data.requirementID],
            CandidateID: [keyName === 'New' ? 0 : data.candidateID],
            Rate: [keyName === 'New' ? null : data.rate],
            RateTypeID: [keyName === 'New' ? null : data.rateTypeID],
            SubmittedBy: [keyName === 'New' ? null : data.submittedBy],
            DateSubmitted: [keyName === 'New' ? '' : data.dateSubmitted],
            ReviewerID: [keyName === 'New' ? 0 : data.reviewerID],
            ReviewStatusID: [keyName === 'New' ? null : data.reviewStatusID],
            ReviewerDate: [keyName === 'New' ? '' : data.reviewerDate],
            DateCreated: [keyName === 'New' ? new Date() : data.dateCreated],
            CreatedBy: [keyName === 'New' ? this.userDetails.firstName + ' ' + this.userDetails.lastName : data.createdBy],
            DateModified: [keyName === 'New' ? new Date() : data.dateModified],
            ModifiedBy: [keyName === 'New' ? this.userDetails.firstName + ' ' + this.userDetails.lastName : data.modifiedBy],
            Note: [keyName === 'New' ? '' : data.note]
            // TimeStamp: [keyName === 'New' ? new Date() : data.timeStamp],
        });
    }

    loadDropDownList() {
        forkJoin(
            this.userService.getUserList(),
            this.requirementService.getListValues(),
            //this.reviewQueueService.getStatusFlow(this.currentStatusID, 7)
        ).subscribe(result => {
            this.reviewerList = result[0].filter(x => (x.roleShort === RoleShortConstants.ADMIN || x.roleShort === RoleShortConstants.REVIEWER) && x.companyID === this.userDetails.companyID);
            this.submittedByList = result[0];
            this.reviewStatusList = result[1].filter(x => x.type.toUpperCase() === ListTypeConstants.REVIEWSTATUS);
            //this.statusFlow = result[2];
            //console.log(this.statusFlow);
            this.PayRateTypeListValues = result[1].filter(x => x.type.toUpperCase() === ListTypeConstants.PAYRATETYPE);
            if (this.PayRateTypeListValues !== null && this.PayRateTypeListValues.length === 1) {
                this.addEditReviewQueueForm.controls.RateTypeID.patchValue(this.PayRateTypeListValues[0].listValueID)
            }
        });
    }
    show() {
        this.addEditHeaderText = 'Add ReviewQueue';
        //this.buildAddEditCandidationForm({}, 'New');
        //this.loadDropDownList();
        this.reviewQueueDialog = true
    }
    noteList: INoteDisplay[] = [];
    loadNotesList(reviewQueueID: number) {
        this.reviewQueueService.getNoteList(reviewQueueID).subscribe(result => {
            this.noteList = result;
        })
    }
    isStatusRequested: boolean = false;
    isSaveLabel: string = 'Save';
    isReviewerRequired: boolean = false;
    editShow(reviewQueue: IReviewQueueDisplay) {
        this.isSaveButtonDisabled = false;
        this.isStatusRequested = false;
        this.isSaveLabel = 'Save';
        this.isReviewerRequired = false;
        if ((this.userDetails.roleShort === RoleShortConstants.ADMIN || this.userDetails.roleShort === RoleShortConstants.TALENTASSOCIATE) && (reviewQueue.reviewStatus !== null && reviewQueue.reviewStatus.replace(' ', '').toUpperCase() === this.reviewStatusConstants.PENDINGREVIEW)) {
            this.isEditableRateTypeRate = false;
        } else {
            this.isEditableRateTypeRate = true;
        }
        // reviewer required condition
        if (reviewQueue !== null && reviewQueue !== undefined && reviewQueue.reviewStatus.toUpperCase() !== this.reviewStatusConstants.REQUESTED && reviewQueue.reviewStatus.replace(' ', '').toUpperCase() !== this.reviewStatusConstants.PENDINGREVIEW) {
            this.isReviewerRequired = true;
        } else {
            this.isReviewerRequired = false;
        }
        // Review Status is Requested , Save button label change to Consent for Review and status dropdown disabled 
        if (reviewQueue !== null && reviewQueue !== undefined && reviewQueue.reviewStatus.toUpperCase() === this.reviewStatusConstants.REQUESTED) {
            this.isStatusRequested = true;
            this.isSaveLabel = 'Consent for Review';
        } else {
            this.isStatusRequested = false;
            this.isSaveLabel = 'Save';
        }
        this.loadNotesList(reviewQueue.reviewQueueID);
        this.addEditHeaderText = 'Edit ReviewQueue';
        this.buildAddEditReviewQueueForm(reviewQueue, 'Edit');

        if (reviewQueue.companyID !== this.userDetails.companyID) {
            this.isReviewerDisabled = true;
        } else {
            this.isReviewerDisabled = false;
        }
        this.currentStatusID = reviewQueue.reviewStatusID;
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
        // reviewerID set current login userID for Reviewer, Admin, same company
        if (this.reviewerList !== null && this.reviewerList !== undefined && reviewQueue !== null && reviewQueue.reviewer === null) {
            var findReviewer = this.reviewerList.find(x => x.userID === this.userDetails.id);
            this.addEditReviewQueueForm.controls.ReviewerID.patchValue(findReviewer.userID);
        }
        this.reviewQueueDialog = true;
    }
    onChangeStatus(event: any) {
        this.isSaveLabel = 'Save';
        var value = event.value;
        if (value !== null && value !== undefined && this.reviewStatusList !== null && this.reviewStatusList !== undefined && this.reviewStatusList.length > 0) {
            var reviewStatus = this.reviewStatusList.find(x => x.listValueID === value).value;
            if (reviewStatus.toUpperCase() === this.reviewStatusConstants.REQUESTED) {
                this.isStatusRequested = true;
                this.isSaveLabel = 'Consent for Review';
            } else {
                this.isStatusRequested = false;
                this.isSaveLabel = 'Save';
            }
        }
    }

    Cancel() {
        this.reviewQueueDialog = false;
        this.submitted = false;
    }


    isReviewerIDRequired: boolean = false;
    saveReviewQueue() {
        this.submitted = true;
        if (this.addEditReviewQueueForm.invalid) {
            this.addEditReviewQueueForm.markAllAsTouched();
            return;
        } else {
            if (this.isReviewerRequired === true && this.addEditReviewQueueForm.value.ReviewerID === null) {
                this.isReviewerIDRequired = true;
                return;
            } else {
                this.isReviewerIDRequired = false;
                this.reviewQueueForm = {
                    ReviewQueueID: this.addEditReviewQueueForm.value.ReviewQueueID,
                    RequirementID: this.addEditReviewQueueForm.value.RequirementID,
                    CandidateID: this.addEditReviewQueueForm.value.CandidateID,
                    ReviewerID: this.addEditReviewQueueForm.value.ReviewerID,
                    Rate: this.addEditReviewQueueForm.value.Rate,
                    RateTypeID: this.addEditReviewQueueForm.value.RateTypeID,
                    SubmittedBy: this.userDetails.id,
                    DateSubmitted: new Date(),
                    DateReviewed: new Date(),
                    ReviewStatusID: this.addEditReviewQueueForm.value.ReviewStatusID,
                    Note: this.addEditReviewQueueForm.value.Note,
                    DateCreated: new Date(),
                    CreatedBy: this.userName,
                    DateModified: new Date(),
                    ModifiedBy: this.userName,
                }
                if (this.isStatusRequested === true) {
                    this.reviewQueueForm.ReviewStatusID = this.reviewStatusList.find(x => x.valueShort === this.reviewStatusConstants.PENDINGREVIEW).listValueID;
                }
                this.isSaveButtonDisabled = true;
                this.reviewQueueService.updateReviewQueue(this.reviewQueueForm).subscribe(result => {
                    if (result !== null && result !== undefined) {
                        this.messageService.add({ severity: 'success', summary: 'Review Queue Save Successfully', detail: '' });
                        this.isSaveButtonDisabled = true;
                    } else {
                        this.isSaveButtonDisabled = false;
                    }
                    this.loadReviewQueueDetails.emit();
                    this.reviewQueueDialog = false;
                    this.submitted = false;
                });
            }
        }
    }

    get addEditReviewQueueFormControls() { return this.addEditReviewQueueForm.controls; }


}
