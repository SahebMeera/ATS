import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { IRequirementDisplay } from '../../../core/interfaces/requirements';
import { IUserDisplay } from '../../../core/interfaces/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ICountryDisplay } from '../../../core/interfaces/country';
import { IStateDisplay } from '../../../core/interfaces/state';
import { ICompanyDisplay } from '../../../core/interfaces/company';
import { Role } from '../../../_models/role';
import { RequirementService } from '../requirement.service';
import { CandidateService } from '../../candidate/candidate.service';
import { IListValue } from '../../../core/interfaces/listValue';
import { ListTypeConstants, ReviewStatusConstants, RequirementStatusConstants } from '../../../constant';
import { UserService } from '../../admin/user/user.service';
import { DataProvider } from '../../../core/providers/data.provider';
import { ActivatedRoute, Router } from '@angular/router';
import { ICandidate, ICandidateDisplay } from '../../../core/interfaces/candidate';
import { Table } from 'primeng/table';
import { IReviewQueueForm } from '../../../core/interfaces/reviewQueue';
import { User } from '../../../_models/user';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-view-detail-requirement',
  templateUrl: './view-detail-requirement.component.html',
  styleUrls: ['./view-detail-requirement.component.scss']
})
export class ViewDetailRequirementComponent implements OnInit {
    @Output() loadRequimentDetails = new EventEmitter<any>();
    requirementStatusConstants = RequirementStatusConstants;
    requirements: IRequirementDisplay[] = [];
    reviewStatusConstants = ReviewStatusConstants;
    addEditHeaderText: string = 'View Requirement';
    userDetails: User;
    userName: string = '';
    requirementDialog: boolean = false;
    isEditMode: boolean = false;
    submitted: boolean;
    addEditRequirementForm: FormGroup;
    countryList: ICountryDisplay[] = [];
    stateList: IStateDisplay[] = [];
    companyList: ICompanyDisplay[] = [];
    clientTypeListValues: IListValue[] = [];
    RequirementTypeListValues: IListValue[] = [];
    PayRateTypeListValues: IListValue[] = [];
    InterviewTypeListValues: IListValue[] = [];
    StatusList: IListValue[] = [];
    reviewStatusList: IListValue[] = [];
    assignedToList: IUserDisplay[] = [];
    reviewerList: IUserDisplay[] = [];
    isAtciveRelocationStatus: any[] = [];
    requirementDetail: IRequirementDisplay;
    jobDesc: string = '';
    isPublicID: number = 0;
    isPayRateText: string = 'Pay Rate';
    isPublicList: any[] = [];
    isReviewQueue: boolean = false;


    constructor(private messageService: MessageService,
        private fb: FormBuilder,
        private dataProvider: DataProvider,
        private router: Router,
        private activeRoute: ActivatedRoute,
        private requirementService: RequirementService,
        private userService: UserService,
        private candidateService: CandidateService) {
        this.userDetails = JSON.parse(localStorage.getItem('ats-current-loggedin-user'));
        this.userName = this.userDetails.firstName + '' + this.userDetails.lastName;
        if (this.dataProvider.storage) {
            this.isEditMode = this.dataProvider.storage["isEditMode"]
            if (this.isEditMode) {
                var requirementDetails: any = this.dataProvider.storage['requirementDetails'];
                this.isPublicID = this.dataProvider.storage['isPublicID'];
                this.isPayRateText = this.isPublicID === 1 ? 'Rate' : 'Pay Rate';
                this.jobDesc = requirementDetails.jobDesc;
                this.requirementDetail = requirementDetails;
                this.addEditHeaderText = 'View Requirement';
                this.isReviewQueue = this.dataProvider.storage['isReviewQueue'];
            }
        }
        this.loadDropDownList()
        // this.buildAddEditCandidationForm({}, 'New');
        this.isAtciveRelocationStatus = [
            { label: 'All', value: null },
            { label: 'Yes', value: true },
            { label: 'No', value: false }
        ]
    }

    ngOnInit(): void {
        if (!this.dataProvider.storage) {
            this.router.navigate(['../'], { relativeTo: this.activeRoute })
        }
        this.isPublicList = [
            { label: 'Internal', value: 0 },
            { label: 'External', value: 1 }
        ]
    }

    Cancel() {
        if (this.isReviewQueue === true) {
            this.router.navigate(['/reviewQueue']);
        } else {
            this.router.navigate(['/requirements']);
            this.requirementDialog = false;
            this.submitted = false;
        }
       
    }
  

    // candidate popup code start here
    isCandidateListDisplay: boolean = false;
    headerTextForCandidateList: string = 'Candidates';
    isReviewQueueNoteFormDisplay: boolean = false;
    isCandidateReviewQueueForm: boolean = false;
    candidateReviewQueueForm: FormGroup;
    candidateList: ICandidateDisplay[] = [];
    isCandidateSubmitted: boolean = false;
    isCandidatePublicID: number = 0;

    @ViewChild('dtCandidate') dtCandidate: Table;
    cols: any[];
    selectedCandidate: any;
    isPublic: boolean = false;

    loadDropDownList() {
        this.requirementService.getListValues().subscribe(result => {
            if (result !== null && result.length > 0) {
                this.PayRateTypeListValues = result.filter(x => x.type.toUpperCase() === ListTypeConstants.PAYRATETYPE);
                this.reviewStatusList = result.filter(x => x.type.toUpperCase() === ListTypeConstants.REVIEWSTATUS);
            }
            });
    }

    submit() {
        this.isCandidatePublicID = 0;
        if (this.isPublicID !== 0) {
            this.isPublicList = [];
            this.isPublicList = [
                { label: 'Internal', value: 0 },
            ]
        }
        this.isPublic = false;
        this.loadCandidateList();
        this.selectedCandidate = null;
        this.isCandidateSubmitted = false;
        this.cols = [
            { field: 'firstName', header: 'FirstName' },
            { field: 'lastName', header: 'LastName' },
            { field: 'companyName', header: 'Company' },
            { field: 'phone', header: 'Phone' },
            { field: 'email', header: 'Email' },
            { field: 'workAuthorization', header: 'WorkAuthorization' },
            { field: 'availability', header: 'Availability' },
            { field: 'isRelocation', header: 'IsRelocation' },
            { field: 'stateName', header: 'State' },

        ];
        this.selectCandidate = null;
        this.loadCandidateReviewQueueForm('New', {});
        this.headerTextForCandidateList = 'Candidates -' + ' ' + this.requirementDetail.jobTitle;
        this.isCandidateListDisplay = true;
    }
    loadCandidateReviewQueueForm(keyName: string, data: any) {
        this.candidateReviewQueueForm = this.fb.group({
            Rate: [keyName === 'New' ? null : data.rate, Validators.required],
            RateTypeID: [keyName === 'New' ? null : data.rateTypeID, Validators.required],
            Note: [keyName === 'New' ? '' : data.Note]
            // TimeStamp: [keyName === 'New' ? new Date() : data.timeStamp],
        });
    }
    get candidateReviewQueueFormControls() { return this.candidateReviewQueueForm.controls; }
    onChangeCandidatePublic(event: any) {
        if (event.value !== null) {
            this.isPublic = event.value === 0 ? false : true
            this.loadCandidateList();
        }
    }
    loadCandidateList() {
        this.isCandidateReviewQueueForm = false;
        this.candidateService.getCandidateList(this.isPublic, this.requirementDetail.requirementID).subscribe(result => {
            this.candidateList = result;
        })
    }
    selectCandidate: ICandidateDisplay
    onRowSelect(event) {
        this.selectCandidate = event.data;
        this.loadCandidateReviewQueueForm('New', {});
        this.isCandidateReviewQueueForm = true;
        this.isCandidateSubmitted = false;
        //this.messageService.add({ severity: 'info', summary: 'Product Selected', detail: event.data.name });
    }

    onRowUnselect(event) {
        console.log(event.data)
        // this.messageService.add({ severity: 'info', summary: 'Product Unselected', detail: event.data.name });
    }
    reviewQueue: IReviewQueueForm
    submitCandidate() {
        this.isCandidateSubmitted = true;
        if (this.candidateReviewQueueForm.invalid) {
            this.candidateReviewQueueForm.markAllAsTouched();
            return;
        } else {
            this.reviewQueue = {
                ReviewQueueID: 0,
                RequirementID: this.requirementDetail.requirementID,
                CandidateID: this.selectCandidate.candidateID,
                Rate: this.candidateReviewQueueForm.value.Rate,
                RateTypeID: this.candidateReviewQueueForm.value.RateTypeID,
                SubmittedBy: this.userDetails.id,
                DateSubmitted: new Date(),
                ReviewerID: null,
                DateReviewed: null,
                ReviewStatusID: this.isCandidatePublicID === 1 ? this.reviewStatusList.find(x => x.valueShort === this.reviewStatusConstants.REQUESTED).listValueID : this.reviewStatusList.find(x => x.valueShort === this.reviewStatusConstants.PENDINGREVIEW).listValueID,
                Note: this.candidateReviewQueueForm.value.Note,
                DateCreated: new Date(),
                CreatedBy: this.userDetails.firstName + ' ' + this.userDetails.lastName,
                DateModified: new Date(),
                ModifiedBy: this.userDetails.firstName + ' ' + this.userDetails.lastName

            }
            this.requirementService.addReviewQueue(this.reviewQueue).subscribe(result => {
                this.messageService.add({ severity: 'success', summary: 'Review Queue Save Successfully', detail: '' });
                this.isCandidateReviewQueueForm = false;
                this.isCandidateListDisplay = false;
                this.isCandidateSubmitted = false;
            })
        }

    }
    CancelCandidateReview() {
        this.isCandidateSubmitted = false;
        this.isCandidateReviewQueueForm = false;
    }
    applyFilterGlobal($event, stringVal) {
        this.isCandidateSubmitted = false;
        this.isCandidateReviewQueueForm = false;
        this.dtCandidate.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
    }

}
