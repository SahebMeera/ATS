import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core'
import { MessageService } from 'primeng/api';
import { ListTypeConstants, RequirementStatusConstants, ReviewStatusConstants } from '../../constant';
import { IListValue } from '../../core/interfaces/listValue';
import { IRequirementDisplay, IRequirementForm } from '../../core/interfaces/requirements';
import { IReviewQueueDisplay, IReviewQueueForm } from '../../core/interfaces/reviewQueue';
import { IUserDisplay } from '../../core/interfaces/user';
import { RequirementService } from '../../pages/requirements/requirement.service';
import { ReviewQueueService } from '../../pages/review-queue/review-queue.service';

@Component({
  selector: 'app-candidate-success-miss',
  templateUrl: './candidate-success-miss.component.html',
  styleUrls: ['./candidate-success-miss.component.scss']
})
export class CandidateSuccessMissComponent implements OnInit {
    @Output() cancel = new EventEmitter<any>();
    @Output() loadRequirmentListDetails = new EventEmitter<any>();
    userDetails: IUserDisplay;
    constructor(private reviewQueueService: ReviewQueueService, private requirementService: RequirementService,
        private messageService: MessageService) {
        this.userDetails = JSON.parse(localStorage.getItem('ats-current-loggedin-user'));
        this.loadListValue();
    }
    @Input() isCloseCandidate: boolean = true;
    @Input() requirementID: number = 0;
    @Input() requirementDetails: IRequirementDisplay;
    reviewQueueList: IReviewQueueDisplay[] = [];
    reviewStatusConstants = ReviewStatusConstants;
    requirementStatusConstants = RequirementStatusConstants;
    submittedNewStatus: any[] = [];
    reviewStatusList: IListValue[] = [];
    requirementStatusList: IListValue[] = [];
    scheduledNewStatusList: any[] = [];
    isSubmittedStatusId: number = 34;
    isScheduledNewStatusId: number = 34;


    ngOnInit(): void {
        this.submittedNewStatus = [
            { label: 'Success', value: 33 },
            { label: 'Miss', value: 34 },
            { label: 'Client Rejected', value: 24 }
        ]
        this.scheduledNewStatusList = [
            { label: 'Success', value: 33 },
            { label: 'Miss', value: 34 },
            { label: 'Client Rejected', value: 24 }
        ]
        if (this.requirementID !== 0) {
            this.loadReviewQueueList();
        }
    }
    loadData() {
        if (this.requirementID !== 0) {
            this.loadReviewQueueList();
        }
    }
    loadListValue() {
        this.requirementService.getListValues().subscribe(result => {
            if (result !== null) {
                this.reviewStatusList = result.filter(x => x.type.toUpperCase() === ListTypeConstants.REVIEWSTATUS);
                this.requirementStatusList = result.filter(x => x.type.toUpperCase() === ListTypeConstants.REQUIREMENTSTATUS);
            }
        })
    }
    
    loadReviewQueueList() {
        this.reviewQueueList = [];
        if (this.requirementID !== 0) {
            this.reviewQueueService.getReviewQueueCandidateList(this.requirementID).subscribe(result => {
            if (result !== null && result !== undefined && result.length > 0) {
                this.reviewQueueList = result.filter(x => x.reviewStatus.replace(' ', '').toUpperCase() !== this.reviewStatusConstants.CLIENTREJECTED && x.reviewStatus.replace(' ', '').toUpperCase() !== this.reviewStatusConstants.REVIEWERREJECTED && x.reviewStatus.replace(' ', '').toUpperCase() !== this.reviewStatusConstants.WITHDRAWN &&
                    x.reviewStatus.replace(' ', '').toUpperCase() !== this.reviewStatusConstants.SUCCESS && x.reviewStatus.replace(' ', '').toUpperCase() !== this.reviewStatusConstants.MISS)
            }
                if (this.isCloseCandidate === false) {
                    this.reviewQueueList.forEach(x => {
                        x.reviewStatusID = this.reviewStatusList.find(x => x.valueShort === this.reviewStatusConstants.MISS).listValueID;
                        //console.log(this.reviewStatusList.find(x => x.valueShort === this.reviewStatusConstants.MISS).listValueID)
                    })
                } else {
                    this.reviewQueueList.forEach(x => {
                        if (x !== null && x.reviewStatus !== null && x.reviewStatus.replace(' ', '').toUpperCase() !== this.reviewStatusConstants.SUBMITTED && x.reviewStatus.replace(' ', '').toUpperCase() !== this.reviewStatusConstants.SCHEDULED) {
                            x.reviewStatusID = this.reviewStatusList.find(x => x.valueShort === this.reviewStatusConstants.MISS).listValueID;
                        }
                    })
                }
        });
       }
    }
    onChangeSubmittedStatus(event, reviewQueue: IReviewQueueDisplay) {
        var value = event.value;
        if (value !== null && value !== undefined) {
            this.isSubmittedStatusId = value;
            reviewQueue.reviewStatusID = value;
            this.reviewQueueList.forEach((x, index) => {
                if (x.reviewQueueID === reviewQueue.reviewQueueID) {
                    this.reviewQueueList[index] = reviewQueue;
                    //  x.reviewStatusID = value;
                }
            })
            
        }
    }
    onChangeScheduledStatus(event, reviewQueue: IReviewQueueDisplay) {
        var value = event.value;
        if (value !== null && value !== undefined) {
            this.isScheduledNewStatusId = value;
            reviewQueue.reviewStatusID = value;
            this.reviewQueueList.forEach((x, index) => {
                if (x.reviewQueueID === reviewQueue.reviewQueueID) {
                    this.reviewQueueList[index] = reviewQueue;
                  //  x.reviewStatusID = value;
                }

            })
        }
    }
    updateReviewStatus(statusID: number, reviewQueue: IReviewQueueDisplay) {
        if (statusID !== null && statusID !== undefined) {
            reviewQueue.reviewStatusID = statusID;
            this.reviewQueueList.forEach((x, index) => {
                if (x.reviewQueueID === reviewQueue.reviewQueueID) {
                    this.reviewQueueList[index] = reviewQueue;
                }
            })
        }
    }
    reviewQueueForm: IReviewQueueForm[] = [];
    SaveReviewQueueStatus() {
        //console.log(this.reviewQueueList);
        this.reviewQueueForm = [];
        this.reviewQueueList.forEach(x => {
            if (x !== null && x !== undefined) {
                this.reviewQueueForm.push({
                    ReviewQueueID: x.reviewQueueID,
                    RequirementID: x.requirementID,
                    CandidateID: x.candidateID,
                    Rate: x.rate,
                    RateTypeID: x.rateTypeID,
                    SubmittedBy: x.submittedBy,
                    DateSubmitted: x.dateCreated,
                    ReviewerID: x.reviewerID,
                    DateReviewed: x.dateReviewed,
                    ReviewStatusID: x.reviewStatusID,
                    Note: x.note,
                    //recordID?: number;
                    DateCreated: new Date(),
                    CreatedBy: this.userDetails.firstName + ' ' + this.userDetails.lastName,
                    DateModified: new Date(),
                    ModifiedBy: this.userDetails.firstName + ' ' + this.userDetails.lastName
                })
            }
        })
        if (this.reviewQueueForm.length > 0) {
           // console.log(this.reviewQueueForm)
            this.reviewQueueService.updateReviewQueueStatus(this.reviewQueueForm).subscribe(result => {
               this.updateRequirementStatus()
            })
        }
    }
    requirementForm: IRequirementForm;
    updateRequirementStatus() {
        this.requirementForm = {
            RequirementID: this.requirementDetails.requirementID,
            CompanyID: this.requirementDetails.companyID,
            ClientName: this.requirementDetails.clientName,
            ClientID: this.requirementDetails.clientID,
            ClientTypeID: this.requirementDetails.clientTypeID,
            RequirementTypeID: this.requirementDetails.requirementTypeID,
            JobID: this.requirementDetails.jobID,
            JobTitle: this.requirementDetails.jobTitle,
            JobDesc: this.requirementDetails.jobDesc,
            InternalNote: this.requirementDetails.internalNote,
            PrimarySkills: this.requirementDetails.primarySkills,
            Duration: this.requirementDetails.duration,
            ClientRate: this.requirementDetails.clientRate,
            PayRate: this.requirementDetails.payRate,
            PayRateTypeID: this.requirementDetails.payRateTypeID,
            DatePosted: this.requirementDetails.datePosted,
            DateClosed: this.requirementDetails.dateClosed,
            City: this.requirementDetails.city,
            StateID: this.requirementDetails.stateID,
            CountryID: this.requirementDetails.countryID,
            InterviewTypeID: this.requirementDetails.interviewTypeID,
            Priority: this.requirementDetails.priority,
            IsHotRequirement: this.requirementDetails.isHotRequirement,
            IsRemote: this.requirementDetails.isRemote,
            IsPublic: this.requirementDetails.isPublic,
            AssignedTo: this.requirementDetails.assignedTo,
            ReviewerID: this.requirementDetails.reviewerID,
            StatusID: this.isCloseCandidate === false ? this.requirementStatusList.find(x => x.valueShort === this.requirementStatusConstants.MISS).listValueID : this.requirementStatusList.find(x => x.valueShort === this.requirementStatusConstants.SUCCESS).listValueID,
            DateCreated: this.requirementDetails.dateCreated,
            CreatedBy: this.requirementDetails.createdBy,
            DateModified: new Date(),
            ModifiedBy: this.userDetails.firstName + ' ' + this.userDetails.lastName
        }
        this.requirementService.updateRequirements(this.requirementForm).subscribe(result => {
            this.messageService.add({ severity: 'success', summary: 'Requirement Save Successfully', detail: '' });
            this.Cancel();
        })
    }
    Cancel() {
        this.cancel.emit();
        this.loadRequirmentListDetails.emit();
    }
}
