import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IInterviewSchedule, IInterviewScheduleDisplay } from '../../../../core/interfaces/interviewSchedule';
import { User } from '../../../../_models/user';
import { RequirementService } from '../../../requirements/requirement.service';
import { ReviewQueueService } from '../../../review-queue/review-queue.service';
import { forkJoin } from 'rxjs';
import { IReviewQueueDisplay } from '../../../../core/interfaces/reviewQueue';
import { ListTypeConstants } from '../../../../constant';
import { IListValue } from '../../../../core/interfaces/listValue';
import { CommonUtils } from '../../../../common/common-utils';
import { CandidateService } from '../../../candidate/candidate.service';
import { ICompanyDisplay } from '../../../../core/interfaces/company';
import { IClientDisplay } from '../../../../core/interfaces/client';
import { ClientService } from '../client.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-add-edit-client',
  templateUrl: './add-edit-client.component.html',
  styleUrls: ['./add-edit-client.component.scss']
})
export class AddEditClientComponent implements OnInit {
    @Output() loadClientDetails = new EventEmitter<any>();
    addEditHeaderText: string = 'Add Client';
    isCandidateAddEdit: boolean = true;
    userDetails: User;
    userName: string = '';
    clientDialog: boolean = false;
    submitted: boolean;
    addEditClientForm: FormGroup;
    reviewQueueList: IReviewQueueDisplay[] = [];
    clientTypeListValues: IListValue[] = [];
    commonUtils = new CommonUtils();
    companyList: ICompanyDisplay[] = [];
    isSaveButtonDisabled: boolean = false;

    constructor(private messageService: MessageService,
        private fb: FormBuilder,
        private requirementService: RequirementService,
        private candidateService: CandidateService,
        private clientService: ClientService) {
        this.userDetails = JSON.parse(localStorage.getItem('ats-current-loggedin-user'));
        this.userName = this.userDetails.firstName + '' + this.userDetails.lastName;
        this.buildAddEditClientForm({}, 'New');
        this.loadDropDownList();
    }

    ngOnInit(): void {
    }


    loadDropDownList() {
        forkJoin(
            this.candidateService.getCompanyList(),
            this.requirementService.getListValues()
        ).subscribe(result => {
            if (result[0] !== null && result[0].length > 0) {
                this.companyList = result[0];
            }
            if (result[1] !== null && result[1].length > 0) {
                this.clientTypeListValues = result[1].filter(x => x.type.toUpperCase() === ListTypeConstants.CLIENTTYPE);
            }
        })
    }

    buildAddEditClientForm(data: any, keyName: string) {
        this.addEditClientForm = this.fb.group({
            ClientID: [keyName === 'New' ? 0 : data.clientID],
            ClientName: [keyName === 'New' ? '' : data.clientName, Validators.required],
            ClientTypeID: [keyName === 'New' ? null : data.clientTypeID, Validators.required],
            CompanyID: [keyName === 'New' ? null : data.companyID, Validators.required],
            Markup: [keyName === 'New' ? null : data.markup],
            DateCreated: [keyName === 'New' ? new Date() : data.dateCreated],
            CreatedBy: [keyName === 'New' ? this.userDetails.firstName + ' ' + this.userDetails.lastName : data.createdBy],
            DateModified: [keyName === 'New' ? new Date() : data.dateModified],
            ModifiedBy: [keyName === 'New' ? this.userDetails.firstName + ' ' + this.userDetails.lastName : data.modifiedBy]
        });
    }
    show() {
        this.isSaveButtonDisabled = false;
        this.addEditHeaderText = 'Add Client';
        this.buildAddEditClientForm({}, 'New');
        if (this.companyList !== null && this.companyList !== undefined && this.companyList.length === 1) {
            this.addEditClientForm.controls.CompanyID.patchValue(this.companyList[0].companyID)
        }
        this.clientDialog = true
    }

    editShow(client: IClientDisplay) {
        this.isSaveButtonDisabled = false;
        this.addEditHeaderText = 'Edit Client';
        this.buildAddEditClientForm(client, 'Edit');
        this.clientDialog = true
    }

    Cancel() {
        this.clientDialog = false;
        this.submitted = false;
        this.isSaveButtonDisabled = false;
    }
    saveClient() {
        this.submitted = true;
        if (this.addEditClientForm.invalid) {
            this.addEditClientForm.markAllAsTouched();
            return;
        } else {
            this.isSaveButtonDisabled = true;
            if (this.addEditClientForm.value.ClientID === 0) {
                this.clientService.addClient(this.addEditClientForm.value).subscribe(result => {
                    if (result !== null && result !== undefined) {
                        this.messageService.add({ severity: 'success', summary: 'Client Save Successfully', detail: '' });
                        this.isSaveButtonDisabled = true;
                    } else {
                        this.isSaveButtonDisabled = false;
                    }
                    this.submitted = false;
                    this.loadClientDetails.emit();
                    this.clientDialog = false;
                    this.buildAddEditClientForm({}, 'New');
                })
            } else {
                this.clientService.updateClient(this.addEditClientForm.value).subscribe(result => {
                    if (result !== null && result !== undefined) {
                        this.messageService.add({ severity: 'success', summary: 'Client Save Successfully', detail: '' });
                        this.isSaveButtonDisabled = true;
                    } else {
                        this.isSaveButtonDisabled = false;
                    }
                    this.submitted = false;
                    this.loadClientDetails.emit();
                    this.clientDialog = false;
                    this.buildAddEditClientForm({}, 'New');

                })
            }
        }
    }
    close() {
        this.isSaveButtonDisabled = false;
        this.clientDialog = false;
        this.submitted = false;

    }
   

    get addEditClientControls() { return this.addEditClientForm.controls; }

}
