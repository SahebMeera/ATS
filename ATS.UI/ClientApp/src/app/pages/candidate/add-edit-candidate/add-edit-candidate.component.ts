import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ICandidate, ICandidateDisplay } from '../../../core/interfaces/candidate';
import { IUserDisplay } from '../../../core/interfaces/user';
import { CandidateService } from '../candidate.service';
import { forkJoin } from 'rxjs';
import { ICountryDisplay } from '../../../core/interfaces/country';
import { IStateDisplay } from '../../../core/interfaces/state';
import { ICompanyDisplay } from '../../../core/interfaces/company';
import { Role } from '../../../_models/role';
import { RequirementService } from '../../requirements/requirement.service';
import { ListTypeConstants, RoleShortConstants } from '../../../constant';
import { IListValue } from '../../../core/interfaces/listValue';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-add-edit-candidate',
    templateUrl: './add-edit-candidate.component.html',
    styleUrls: ['./add-edit-candidate.component.scss']
})
export class AddEditCandidateComponent implements OnInit {
    @Output() loadCandidateDetails = new EventEmitter<any>();
    candidateList: ICandidateDisplay[] = [];
    addEditHeaderText: string = 'Add Candidate';
    isCandidateAddEdit: boolean = true;
    userDetails: IUserDisplay;
    userName: string = '';
    candidateDialog: boolean = false;
    submitted: boolean;
    addEditCandidateForm: FormGroup;
    countryList: ICountryDisplay[] = [];
    stateList: IStateDisplay[] = [];
    companyList: ICompanyDisplay[] = [];
    availabilityList: IListValue[] = [];
    workAuthList: IListValue[] = [];
    skillValues: string[] = [];
    roleShortConstants = RoleShortConstants;
    fileNotExist: boolean = false;
    isSaveButtonDisabled: boolean = false;


    constructor(private messageService: MessageService, private fb: FormBuilder, private candidateService: CandidateService, private requirementService: RequirementService) {
        this.userDetails = JSON.parse(localStorage.getItem('ats-current-loggedin-user'));
        this.userName = this.userDetails.firstName + '' + this.userDetails.lastName;

        this.buildAddEditCandidationForm({}, 'New');
        this.loadDropDownList();
    }

    ngOnInit(): void {
    }
    buildAddEditCandidationForm(data: any, keyName: string) {
        this.addEditCandidateForm = this.fb.group({
            CandidateID: [keyName === 'New' ? 0 : data.candidateID],
            CompanyID: [keyName === 'New' ? null : data.companyID, Validators.required],
            FirstName: [keyName === 'New' ? '' : data.firstName, Validators.required],
            LastName: [keyName === 'New' ? '' : data.lastName, Validators.required],
            Email: [keyName === 'New' ? '' : data.email, [Validators.required, Validators.email]],
            LinkedInURL: [keyName === 'New' ? '' : data.linkedInURL],
            JobTitle: [keyName === 'New' ? '' : data.jobTitle, Validators.required],
            Skills: [keyName === 'New' ? [] : this.skillValues, Validators.required],
            Phone: [keyName === 'New' ? '' : data.phone],
            City: [keyName === 'New' ? '' : data.city, Validators.required],
            StateID: [keyName === 'New' ? null : data.stateID, Validators.required],
            CountryID: [keyName === 'New' ? null : data.countryID, Validators.required],
            WorkAuthID: [keyName === 'New' ? null : data.workAuthID, Validators.required],
            BillingRate: [keyName === 'New' ? null : data.billingRate],
            Experience: [keyName === 'New' ? null : data.experience, Validators.required],
            AvailabilityID: [keyName === 'New' ? null : data.availabilityID, Validators.required],
            IsActive: [keyName === 'New' ? false : data.isActive],
            IsRelocation: [keyName === 'New' ? false : data.isRelocation],
            IsPublic: [keyName === 'New' ? false : data.isPublic],
            DateCreated: [keyName === 'New' ? new Date() : data.dateCreated],
            CreatedBy: [keyName === 'New' ? this.userDetails.firstName + ' ' + this.userDetails.lastName : data.createdBy],
            DateModified: [keyName === 'New' ? new Date() : data.dateModified],
            ModifiedBy: [keyName === 'New' ? this.userDetails.firstName + ' ' + this.userDetails.lastName : data.modifiedBy],
            // TimeStamp: [keyName === 'New' ? new Date() : data.timeStamp],
        });
    }

    loadDropDownList() {
        forkJoin(
            this.candidateService.getCountryList(),
            this.candidateService.getStateList(),
            this.candidateService.getCompanyList(),
            this.requirementService.getListValues()
        ).subscribe(result => {
            this.countryList = result[0];
            this.stateList = result[1];
            if (this.stateList.length === 1) {
                this.addEditCandidateForm.controls.StateID.patchValue(this.stateList[0].stateID)
            }
            if (this.countryList.length === 1) {
                this.addEditCandidateForm.controls.CountryID.patchValue(this.stateList[0].countryID)
            }
            this.companyList = result[2];
            if (this.userDetails.roleShort === Role.Admin && this.companyList !== null && this.companyList.length > 0) {
                this.companyList = result[2].filter(x => x.companyID === this.userDetails.companyID);
                this.addEditCandidateForm.controls.CompanyID.patchValue(this.companyList[0].companyID)
            } else if (this.userDetails.roleShort === Role.TalentAssociate) {
                this.companyList = result[2].filter(x => x.companyID === this.userDetails.companyID)
                this.addEditCandidateForm.controls.CompanyID.patchValue(this.companyList[0].companyID)
            } else {
                this.companyList = result[2];
            }
            if (result[3] !== null && result[3].length > 0) {
                this.availabilityList = result[3].filter(x => x.type.toUpperCase() === ListTypeConstants.AVAILABILITY);
                this.workAuthList = result[3].filter(x => x.type.toUpperCase() === ListTypeConstants.WORKAUTHORIZATION);
            }
        })
    }


    show() {
         this.resumeFileControl.nativeElement.value = "";
        this.addEditHeaderText = 'Add Candidate';
        this.skillValues = [];
        this.buildAddEditCandidationForm({}, 'New');
        this.candidate = this.addEditCandidateForm.value;
        this.candidate.fileName = '';
        this.loadDropDownList();
        this.isSaveButtonDisabled = false;
        this.candidateDialog = true;

    }
    candidate: ICandidateDisplay;
    editShow(candidate: ICandidateDisplay) {
         this.resumeFileControl.nativeElement.value = "";
        this.candidate = candidate;
        this.addEditHeaderText = 'Edit Candidate';
        this.skillValues = candidate.skills !== null ? candidate.skills.split(',') : [];
        this.buildAddEditCandidationForm(candidate, 'Edit');
        this.isSaveButtonDisabled = false;
        this.candidateDialog = true;
    }

    Cancel() {
        this.isSaveButtonDisabled = false;
        this.candidateDialog = false;
        this.submitted = false;
    }

    formData: FormData = new FormData();
    progress: number = 30;
    @ViewChild('file', { static: false }) resumeFileControl: ElementRef;
    file: File = null;

    onFileChanged(event) {
        for (const file of event.target.files) {
            this.formData.append(file.name, file);
            this.file = file;
        }
    }

    OnClickResume() {
        let contentType = this.candidate.fileName.split('.')[1];
        if (contentType.trim() === 'pdf') {
            window.open(this.candidate.resumeURL);
        }
        else {
            console.log('https://view.officeapps.live.com/op/view.aspx?src=' + this.candidate.resumeURL);
            window.open('https://view.officeapps.live.com/op/view.aspx?src=' + this.candidate.resumeURL);
        }
    }


    //B64toBlob(b64Data, contentType = '', sliceSize = 512) {
    //    const byteCharacters = atob(b64Data);
    //    const byteArrays = [];

    //    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    //        const slice = byteCharacters.slice(offset, offset + sliceSize);

    //        const byteNumbers = new Array(slice.length);
    //        for (let i = 0; i < slice.length; i++) {
    //            byteNumbers[i] = slice.charCodeAt(i);
    //        }

    //        const byteArray = new Uint8Array(byteNumbers);
    //        byteArrays.push(byteArray);
    //    }

    //    const blob = new Blob(byteArrays, { type: contentType });
    //    return blob;
    //}


    saveCandidate() {
        this.fileNotExist = false;
        const candidateId = this.addEditCandidateForm.value.CandidateID;
        this.submitted = true;
        if (this.addEditCandidateForm.invalid) {
            this.addEditCandidateForm.markAllAsTouched();
            return;
        } else {

            const candidateModel: ICandidate = this.addEditCandidateForm.value;
            if (this.addEditCandidateForm.get('Skills').value !== '') {
                const skills: string[] = this.addEditCandidateForm.get('Skills').value;
                candidateModel.Skills = skills.join(',');
            }
            this.isSaveButtonDisabled = true;
            if (this.addEditCandidateForm.value.CandidateID === 0) {
                if (this.file === null || this.file === undefined) {
                    this.fileNotExist = true
                    this.isSaveButtonDisabled = false;
                } else {
                    this.candidateService.addCandidate(this.addEditCandidateForm.value).subscribe(result => {
                        if (result !== null && result !== undefined && (this.file !== null || this.file !== undefined)) {
                            this.messageService.add({ severity: 'success', summary: 'Candidate Save Successfully', detail: '' });
                            const fileName = this.addEditCandidateForm.value.FirstName + '-' + this.addEditCandidateForm.value.LastName;
                            this.candidateService.uploadResume(result['candidateID'], fileName, this.formData).subscribe(result => {
                                this.submitted = false;
                                this.loadCandidateDetails.emit();
                                this.candidateDialog = false;
                            });
                        } else {
                            this.isSaveButtonDisabled = false;
                        }
                    });
                }
            } else {
                this.candidateService.updateCandidate(this.addEditCandidateForm.value).subscribe(result => {
                    if (result !== null && result !== undefined && this.file !== null && this.file !== undefined) {
                    const fileName = this.addEditCandidateForm.value.FirstName + '-' + this.addEditCandidateForm.value.LastName;
                    this.candidateService.uploadResume(candidateId, fileName, this.formData).subscribe(result => {
                        this.messageService.add({ severity: 'success', summary: 'Candidate Save Successfully', detail: '' });
                        this.submitted = false;
                        this.loadCandidateDetails.emit();
                        this.candidateDialog = false;
                    });
                    } else {
                        this.messageService.add({ severity: 'success', summary: 'Candidate Save Successfully', detail: '' });
                        this.isSaveButtonDisabled = false;
                        this.submitted = false;
                        this.loadCandidateDetails.emit();
                        this.candidateDialog = false;
                    }
                });
            }
        }
    }
    close() {
        this.isSaveButtonDisabled = false;
        this.candidateDialog = false;
        this.submitted = false;
    }

    get addeditCandidateFormControls() { return this.addEditCandidateForm.controls; }

}
