import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { IRequirementDisplay, IRequirementForm } from '../../../core/interfaces/requirements';
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
import { ListTypeConstants, RequirementStatusConstants, RequirementTypeConstants, ReviewStatusConstants } from '../../../constant';
import { UserService } from '../../admin/user/user.service';
import { DataProvider } from '../../../core/providers/data.provider';
import { ActivatedRoute, Router } from '@angular/router';
import { ICandidate, ICandidateDisplay } from '../../../core/interfaces/candidate';
import { Table } from 'primeng/table';
import { IReviewQueueForm } from '../../../core/interfaces/reviewQueue';
import { User } from '../../../_models/user';
import { IClientDisplay } from '../../../core/interfaces/client';
import { MessageService } from 'primeng/api';
import { ClientService } from '../../admin/client/client.service';

@Component({
  selector: 'app-add-edit-requirement',
  templateUrl: './add-edit-requirement.component.html',
  styleUrls: ['./add-edit-requirement.component.scss']
})

export class AddEditRequirementComponent implements OnInit {
    @Output() loadRequimentDetails = new EventEmitter<any>();
    requirements: IRequirementDisplay[] = [];
    reviewStatusConstants = ReviewStatusConstants;
    requirementStatusConstants = RequirementStatusConstants;
    requirementTypeConstants = RequirementTypeConstants;
    addEditHeaderText: string = 'Add Requirement';
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
    assignedToList: IUserDisplay[] = [];
    reviewerList: IUserDisplay[] = [];
    isAtciveRelocationStatus: any[] = [];
    skillValues: string[] = [];
    isSavebuttonDisabled: boolean = false;
    clientList: IClientDisplay[] = [];
    clientsList: IClientDisplay[] = [];
    requirementDetail: IRequirementDisplay;
    isPublicID: number = 0;
    isPublicList: any[] = [];
    reviewStatusList: IListValue[] = [];


    _tinymceconfig = {
        inline: true,
        height: 300,
    };
   

    constructor(private messageService: MessageService,
        private fb: FormBuilder,
        private dataProvider: DataProvider,
        private router: Router,
        private activeRoute: ActivatedRoute,
        private requirementService: RequirementService,
        private userService: UserService,
        private candidateService: CandidateService,
        private clientService: ClientService) {
        this.userDetails = JSON.parse(localStorage.getItem('ats-current-loggedin-user'));
        this.userName = this.userDetails.firstName + '' + this.userDetails.lastName;
        if (this.dataProvider.storage) {
            this.isEditMode = this.dataProvider.storage["isEditMode"]
            this.isPublicID = this.dataProvider.storage["isPublicID"]
            if (this.isEditMode) {
                var requirementDetails: any = this.dataProvider.storage['requirementDetails']
                this.addEditHeaderText = 'Edit Requirement';
                this.skillValues = requirementDetails.primarySkills !== null ? requirementDetails.primarySkills.split(',') : [];
                this.requirementDetail = requirementDetails;
                this.buildAddEditRequirementForm(requirementDetails, 'Edit');
            } else {
                this.buildAddEditRequirementForm({}, 'New');
            }
        } else {
            this.buildAddEditRequirementForm({}, 'New');
        }
        this.isAtciveRelocationStatus = [
            { label: 'All', value: null },
            { label: 'Yes', value: true },
            { label: 'No', value: false }
        ]
        this.loadDropDownList();

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

    buildAddEditRequirementForm(data: any, keyName: string) {
        this.addEditRequirementForm = this.fb.group({
            RequirementID: [keyName === 'New' ? 0 : data.requirementID],
            CompanyID: [keyName === 'New' ? null : data.companyID, Validators.required],
            ClientID: [keyName === 'New' ? '' : data.clientID, Validators.required],
            ClientTypeID: [keyName === 'New' ? null : data.clientTypeID, Validators.required],
            RequirementTypeID: [keyName === 'New' ? null : data.requirementTypeID, Validators.required],
            JobID: [keyName === 'New' ? '' : data.jobID],
            JobTitle: [keyName === 'New' ? '' : data.jobTitle],
            JobDesc: [keyName === 'New' ? '' : data.jobDesc],  
            InternalNote: [keyName === 'New' ? '' : data.internalNote], 
            PrimarySkills: [keyName === 'New' ? '' : this.skillValues],
            Duration: [keyName === 'New' ? null : data.duration, Validators.required],
            ClientRate: [keyName === 'New' ? null : data.clientRate],
            PayRate: [keyName === 'New' ? null : data.payRate],
            PayRateTypeID: [keyName === 'New' ? null : data.payRateTypeID],
            DatePosted: [keyName === 'New' ? new Date() : data.datePosted, Validators.required], // pending
            DateClosed: [keyName === 'New' ? null : data.datePosted],  // pending
            City: [keyName === 'New' ? '' : data.city],
            StateID: [keyName === 'New' ? null : data.stateID, Validators.required],
            CountryID: [keyName === 'New' ? null : data.countryID, Validators.required],
            InterviewTypeID: [keyName === 'New' ? null : data.interviewTypeID, Validators.required],
            Priority: [keyName === 'New' ? null : data.priority],
            IsHotRequirement: [keyName === 'New' ? false : data.isHotRequirement],
            IsRemote: [keyName === 'New' ? false : data.isRemote],
            IsPublic: [keyName === 'New' ? false : data.isPublic],
            AssignedTo: [keyName === 'New' ? null : data.assignedTo],
            ReviewerID: [keyName === 'New' ? null : data.reviewerID],
            StatusID: [keyName === 'New' ? null : data.statusID, Validators.required],
            DateCreated: [keyName === 'New' ? new Date() : data.dateCreated],
            CreatedBy: [keyName === 'New' ? this.userDetails.firstName + ' ' + this.userDetails.lastName : data.createdBy],
            DateModified: [keyName === 'New' ? new Date() : data.dateModified],
            ModifiedBy: [keyName === 'New' ? this.userDetails.firstName + ' ' + this.userDetails.lastName : data.modifiedBy],
        });
    }

    loadDropDownList() {
        forkJoin(
            this.candidateService.getCountryList(),
            this.candidateService.getStateList(),
            this.candidateService.getCompanyList(),
            this.requirementService.getListValues(),
            this.userService.getUserList(),
            this.clientService.getClient()
        ).subscribe(result => {
            this.countryList = result[0];
            this.stateList = result[1];
            if (this.stateList !== null && this.stateList.length === 1) {
                this.addEditRequirementForm.controls.StateID.patchValue(this.stateList[0].stateID)
            }
            if (this.countryList.length === 1) {
                this.addEditRequirementForm.controls.CountryID.patchValue(this.stateList[0].countryID)
            }
            this.companyList = result[2];
            if (this.userDetails.roleShort === Role.Admin && this.companyList !== null && this.companyList.length > 0) {
                this.companyList = result[2].filter(x => x.companyID === this.userDetails.companyID);
                this.addEditRequirementForm.controls.CompanyID.patchValue(this.companyList[0].companyID)
            } else if (this.userDetails.roleShort === Role.TalentAssociate) {
                this.companyList = result[2].filter(x => x.companyID === this.userDetails.companyID);
                this.addEditRequirementForm.controls.CompanyID.patchValue(this.companyList[0].companyID)
            } else {
                this.companyList = result[2];
            }
            if (result[3] !== null && result[3].length > 0) {
                this.clientTypeListValues = result[3].filter(x => x.type.toUpperCase() === ListTypeConstants.CLIENTTYPE);
                if (this.clientTypeListValues !== null && this.clientTypeListValues.length === 1) {
                    this.addEditRequirementForm.controls.ClientTypeID.patchValue(this.clientTypeListValues[0].listValueID)
                }
                this.RequirementTypeListValues = result[3].filter(x => x.type.toUpperCase() === ListTypeConstants.REQUIREMENTTYPE);
                if (this.RequirementTypeListValues !== null && this.RequirementTypeListValues.length === 1) {
                    this.addEditRequirementForm.controls.RequirementTypeID.patchValue(this.RequirementTypeListValues[0].listValueID)
                }
                this.PayRateTypeListValues = result[3].filter(x => x.type.toUpperCase() === ListTypeConstants.PAYRATETYPE);
                if (this.PayRateTypeListValues !== null && this.PayRateTypeListValues.length === 1) {
                    this.addEditRequirementForm.controls.PayRateTypeID.patchValue(this.PayRateTypeListValues[0].listValueID)
                }
                this.InterviewTypeListValues = result[3].filter(x => x.type.toUpperCase() === ListTypeConstants.INTREVIEWTYPE);
                if (this.InterviewTypeListValues !== null && this.InterviewTypeListValues.length === 1) {
                    this.addEditRequirementForm.controls.InterviewTypeID.patchValue(this.InterviewTypeListValues[0].listValueID)
                }
                this.StatusList = result[3].filter(x => x.type.toUpperCase() === ListTypeConstants.REQUIREMENTSTATUS);
                if (this.isEditMode === false) {
                    this.StatusList = this.StatusList.filter(x => x.valueShort.toUpperCase() === this.requirementStatusConstants.OPEN);
                } 
                this.reviewStatusList = result[3].filter(x => x.type.toUpperCase() === ListTypeConstants.REVIEWSTATUS);
                if (this.StatusList !== null && this.StatusList.length === 1) {
                    this.addEditRequirementForm.controls.StatusID.patchValue(this.StatusList[0].listValueID)
                }
            }
            this.assignedToList = result[4];
            this.reviewerList = result[4];
            this.clientList = result[5];
            this.clientsList = result[5];
            if (this.clientList !== null && this.clientList.length === 1) {
                this.addEditRequirementForm.controls.ClientID.patchValue(this.clientList[0].clientID)
            }
        });
    }

    show() {
        this.skillValues = [];
        this.addEditHeaderText = 'Add Requirement';
        this.requirementDialog = true
    }

    editShow(requirement: IRequirementDisplay) {
        this.addEditHeaderText = 'Edit Requirement';
        this.buildAddEditRequirementForm(requirement, 'Edit');
        this.requirementDialog = true
    }

    Cancel() {
        this.router.navigate(['/requirements']);
        this.requirementDialog = false;
        this.submitted = false;
    }
    onChangeClient(event: any) {
        var client = event.value;
        if (client !== null && client !== undefined && this.clientList !== null && this.clientList.length > 0) {
            var clientType = this.clientList.find(x => x.clientID === client).clientTypeID;
            this.addEditRequirementForm.controls.ClientTypeID.patchValue(clientType);
        }
    }

    saveCandidate() {
        this.submitted = true;
        if (this.addEditRequirementForm.invalid) {
            this.addEditRequirementForm.markAllAsTouched();
            return;
        } else {
            const requirementModel: IRequirementForm = this.addEditRequirementForm.value;
            if (this.addEditRequirementForm.get('PrimarySkills').value !== '') {
                const skills: string[] = this.addEditRequirementForm.get('PrimarySkills').value;
                requirementModel.PrimarySkills = skills.join(',');
            }
            this.isSavebuttonDisabled = true;
            if (this.addEditRequirementForm.value.RequirementID === 0) {
                this.requirementService.addRequirements(requirementModel).subscribe(result => {
                    if (result !== null && result !== undefined) {
                        this.messageService.add({ severity: 'success', summary: 'Requirement Save Successfully', detail: '' });
                        this.isSavebuttonDisabled = true;
                    } else {
                        this.isSavebuttonDisabled = true;
                    }
                    this.submitted = false;
                    this.loadRequimentDetails.emit();
                    this.requirementDialog = false;
                    this.router.navigate(['/requirements'])
                });
            } else {
                this.requirementService.updateRequirements(requirementModel).subscribe(result => {
                    if (result !== null && result !== undefined) {
                        this.messageService.add({ severity: 'success', summary: 'Requirement Save Successfully', detail: '' });
                        this.isSavebuttonDisabled = true;
                    } else {
                        this.isSavebuttonDisabled = true;
                    }
                    this.submitted = false;
                    this.loadRequimentDetails.emit();
                    this.requirementDialog = false;
                });
            }
        }
    }

    get addeditCandidateFormControls() { return this.addEditRequirementForm.controls; }

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
  
    submit() {
        console.log(this.isPublicID);
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
        });
    }
    get candidateReviewQueueFormControls() { return this.candidateReviewQueueForm.controls; }
    onChangeCandidatePublic(event: any) {
        if (event.value !== null) {
            this.isPublic = event.value === 0 ? false : true
            this.loadCandidateList();
        }
    }
    isDurationDisabled: boolean = false;
    onChangeRequirementType(event: any) {
        this.isDurationDisabled = false;
        if (event.value !== null) {
            var requirementType = this.RequirementTypeListValues !== null && this.RequirementTypeListValues !== undefined  && this.RequirementTypeListValues.find(x => x.listValueID === event.value).valueShort;
            if (requirementType !== null && requirementType !== undefined && requirementType === this.requirementTypeConstants.FULLTIME) {
                this.isDurationDisabled = true;
                this.addEditRequirementForm.controls.Duration.patchValue(0);
            } else {
                this.addEditRequirementForm.controls.Duration.patchValue(null);
            }
        }
    }

    onChangeCompany(event: any) {
        if (event.value !== null) {
            this.clientList = this.clientsList !== null && this.clientsList !== undefined && this.clientsList.filter(x => x.companyID === event.value);
            if (this.clientList !== null && this.clientList.length === 1) {
                this.addEditRequirementForm.controls.ClientID.patchValue(this.clientList[0].clientID)
            }
        }
    }
    loadCandidateList() {
        this.isCandidateReviewQueueForm = false;
        this.candidateService.getCandidateList(this.isPublic, this.requirementDetail.requirementID).subscribe(result => {
            this.selectCandidate = null;
            this.selectedCandidate = null;
            this.onRowUnselect(null);
            this.candidateList = result;
        })
    }
    selectCandidate: ICandidateDisplay
    onRowSelect(event) {
        this.selectCandidate = event.data;
        this.loadCandidateReviewQueueForm('New', {});
        this.isCandidateReviewQueueForm = true;
        this.isCandidateSubmitted = false;
    }

    onRowUnselect(event) {
        console.log(event)
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
                RequirementID: this.addEditRequirementForm.value.RequirementID,
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
                this.isCandidateSubmitted = false;
                this.isCandidateReviewQueueForm = false;
                this.isCandidateListDisplay = false;
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
