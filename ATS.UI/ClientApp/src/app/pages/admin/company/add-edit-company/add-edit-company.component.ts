import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../../../_models/user';
import { forkJoin } from 'rxjs';
import { ListTypeConstants } from '../../../../constant';
import { IListValue } from '../../../../core/interfaces/listValue';
import { CommonUtils } from '../../../../common/common-utils';
import { CandidateService } from '../../../candidate/candidate.service';
import { ICompanyDisplay } from '../../../../core/interfaces/company';
import { MessageService } from 'primeng/api';
import { ICountryDisplay } from '../../../../core/interfaces/country';
import { IStateDisplay } from '../../../../core/interfaces/state';
import { CompanyService } from '../company.service';

@Component({
  selector: 'app-add-edit-company',
  templateUrl: './add-edit-company.component.html',
  styleUrls: ['./add-edit-company.component.scss']
})
export class AddEditCompanyComponent implements OnInit {
    @Output() loadCompanyDetails = new EventEmitter<any>();
    addEditHeaderText: string = 'Add Client';
    isCandidateAddEdit: boolean = true;
    userDetails: User;
    userName: string = '';
    companyDialog: boolean = false;
    submitted: boolean;
    addEditCompanyForm: FormGroup;
    clientTypeListValues: IListValue[] = [];
    commonUtils = new CommonUtils();
    companyList: ICompanyDisplay[] = [];
    isSaveButtonDisabled: boolean = false;
    countryList: ICountryDisplay[] = [];
    stateList: IStateDisplay[] = [];

    constructor(private messageService: MessageService,
        private fb: FormBuilder,
        private candidateService: CandidateService,
        private companyService: CompanyService,) {
        this.userDetails = JSON.parse(localStorage.getItem('ats-current-loggedin-user'));
        this.userName = this.userDetails.firstName + '' + this.userDetails.lastName;
        this.buildAddEditCompanyForm({}, 'New');
        this.loadDropDownList();
    }

  ngOnInit(): void {
  }
    loadDropDownList() {
        forkJoin(
            this.candidateService.getCountryList(),
            this.candidateService.getStateList()
        ).subscribe(result => {
            this.countryList = result[0];
            this.stateList = result[1];
        })
    }
    buildAddEditCompanyForm(data: any, keyName: string) {
        this.addEditCompanyForm = this.fb.group({
            CompanyID: [keyName === 'New' ? 0 : data.companyID],
            CompanyName: [keyName === 'New' ? '' : data.companyName, Validators.required],
            CompanyURL: [keyName === 'New' ? null : data.companyURL, Validators.required],
            Phone: [keyName === 'New' ? null : data.phone],
            City: [keyName === 'New' ? '' : data.city, Validators.required],
            StateID: [keyName === 'New' ? null : data.stateID, Validators.required],
            CountryID: [keyName === 'New' ? null : data.countryID, Validators.required],
            ZIPCode: [keyName === 'New' ? null : data.zipCode, Validators.required],
            IsActive: [keyName === 'New' ? false : data.isActive],
            DateCreated: [keyName === 'New' ? new Date() : data.dateCreated],
            CreatedBy: [keyName === 'New' ? this.userDetails.firstName + ' ' + this.userDetails.lastName : data.createdBy],
            DateModified: [keyName === 'New' ? new Date() : data.dateModified],
            ModifiedBy: [keyName === 'New' ? this.userDetails.firstName + ' ' + this.userDetails.lastName : data.modifiedBy]
        });
    }
    show() {
        this.isSaveButtonDisabled = false;
        this.addEditHeaderText = 'Add Client';
        this.buildAddEditCompanyForm({}, 'New');
        if (this.stateList !== null && this.stateList.length === 1) {
            this.addEditCompanyForm.controls.StateID.patchValue(this.stateList[0].stateID)
        }
        if (this.countryList.length === 1) {
            this.addEditCompanyForm.controls.CountryID.patchValue(this.stateList[0].countryID)
        }
        this.companyDialog = true
    }
    editShow(company: ICompanyDisplay) {
        this.isSaveButtonDisabled = false;
        this.addEditHeaderText = 'Edit Company';
        this.buildAddEditCompanyForm(company, 'Edit');
        this.companyDialog = true
    }

    Cancel() {
        this.companyDialog = false;
        this.submitted = false;
        this.isSaveButtonDisabled = false;
    }
    saveCompany() {
        this.submitted = true;
        if (this.addEditCompanyForm.invalid) {
           console.log('Herre')
            this.addEditCompanyForm.markAllAsTouched();
            return;
        } else {
            this.isSaveButtonDisabled = true;
            this.addEditCompanyForm.value.ZIPCode = this.addEditCompanyForm.value.ZIPCode.toString();
            if (this.addEditCompanyForm.value.CompanyID === 0) {
                this.companyService.addCompany(this.addEditCompanyForm.value).subscribe(result => {
                    if (result !== null && result !== undefined) {
                        this.messageService.add({ severity: 'success', summary: 'Company Save Successfully', detail: '' });
                        this.isSaveButtonDisabled = true;
                    } else {
                        this.isSaveButtonDisabled = false;
                    }
                    this.submitted = false;
                    this.loadCompanyDetails.emit();
                    this.companyDialog = false;
                    this.buildAddEditCompanyForm({}, 'New');
                })
            } else {
                this.companyService.updateCompany(this.addEditCompanyForm.value).subscribe(result => {
                    if (result !== null && result !== undefined) {
                        this.messageService.add({ severity: 'success', summary: 'Company Save Successfully', detail: '' });
                        this.isSaveButtonDisabled = true;
                    } else {
                        this.isSaveButtonDisabled = false;
                    }
                    this.submitted = false;
                    this.loadCompanyDetails.emit();
                    this.companyDialog = false;
                    this.buildAddEditCompanyForm({}, 'New');

                })
            }
        }
    }
    close() {
        this.isSaveButtonDisabled = false;
        this.companyDialog = false;
        this.submitted = false;

    }


    get addEditCompanyControls() { return this.addEditCompanyForm.controls; }

}
