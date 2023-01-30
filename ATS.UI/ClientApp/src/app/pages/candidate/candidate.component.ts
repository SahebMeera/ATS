import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { CommonUtils } from '../../common/common-utils';
import { ConstantModules, RoleShortConstants } from '../../constant';
import { ICandidateDisplay } from '../../core/interfaces/candidate';
import { ICompanyDisplay } from '../../core/interfaces/company';
import { INoteDisplay } from '../../core/interfaces/note';
import { IRolePermissionDisplay } from '../../core/interfaces/rolePermission';
import { IUserDisplay } from '../../core/interfaces/user';
import { ReviewQueueService } from '../review-queue/review-queue.service';
import { AddEditCandidateComponent } from './add-edit-candidate/add-edit-candidate.component';
import { CandidateService } from './candidate.service';

@Component({
  selector: 'app-candidate',
  templateUrl: './candidate.component.html',
  styleUrls: ['./candidate.component.scss']
})
export class CandidateComponent implements OnInit {
    commonUtils = new CommonUtils();
    candidateList: ICandidateDisplay[] = [];
    candidates: ICandidateDisplay[] = [];
    roleShortConstants = RoleShortConstants;
    constantModules = ConstantModules;
    rolePermissions: IRolePermissionDisplay[] = [];
    rolePermission: IRolePermissionDisplay;
    isAddRolePermission: boolean = false;
    isUpdateRolePermission: boolean = false;
    selectedCompanys: number[] = [];
    companyList: ICompanyDisplay[] = [];
    isPublicList: any[] = [];
    userDetails: IUserDisplay;
    isPublicID: number = 0;
    isPublic: boolean = false;
    userName: string = '';
    items: MenuItem[];

    @ViewChild('addEditCandidate') addEditCandidateModalPopUP: AddEditCandidateComponent;

    cols: any[];
    constructor(private candidateService: CandidateService, private reviewQueueService: ReviewQueueService) {
        this.userDetails = JSON.parse(localStorage.getItem('ats-current-loggedin-user'));
        this.rolePermissions = JSON.parse(localStorage.getItem('role-permission'));
        this.userName = this.userDetails.firstName + '' + this.userDetails.lastName;
        if (this.rolePermissions !== null && this.rolePermissions !== undefined && this.rolePermissions.length > 0) {
            this.rolePermission = this.rolePermissions.find(x => x.moduleShort === this.constantModules.CANDIDATE);
            this.isAddRolePermission = false;
            this.isUpdateRolePermission = false;
            if (this.rolePermission !== null && this.rolePermission !== undefined && this.rolePermission.add === false) {
                this.isAddRolePermission = true;
            }
            if (this.rolePermission !== null && this.rolePermission !== undefined && this.rolePermission.update === false) {
                this.isUpdateRolePermission = true;
            }
        }
        this.loadCandidateList();
        this.candidateService.getCompanyList().subscribe(result => {
            this.companyList = result;
        })
    }

    ngOnInit(): void {
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
        this.isPublicList = [
            { label: 'Internal', value: 0 },
            { label: 'External', value: 1 }
        ]
        //this.loadMobilesItems();
    }
    activeItem: ICandidateDisplay;
    loadMobilesItems() {
        this.items = [
            { label: 'Edit', icon: 'pi pi-pencil', styleClass: this.getClass(), command: (e) => { this.editcandidate(this.activeItem) } },
            { label: 'Notes', icon: 'fa fa-commenting-o', command: (e) => { this.openNotesList(this.activeItem) } },
        ];
    }
    getClass(): string {
        if (this.isUpdateRolePermission === true) {
            return 'display-none';
        } else {
            return '';
        }
    }
    loadCandidateList() {
        this.candidateService.getCandidateList(this.isPublic).subscribe(result => {
            this.candidates = result;
            this.candidateList = result;
            this.loadMobilesItems();
        })
    }

    addcandidate() {
        this.addEditCandidateModalPopUP.show();
    }
    editcandidate(candidate: ICandidateDisplay) {
        this.addEditCandidateModalPopUP.editShow(candidate);
    }
    toggleMenu(menu, event, rowData) {
        this.activeItem = rowData;
        menu.toggle(event);
    }
    onChangeCompany(event: any) {
        this.selectedCompanys = [];
        this.selectedCompanys = event.value;
        this.filterRequirementList()
    }
    filterRequirementList() {
        if (this.selectedCompanys.length > 0) {
            //const result = serviceList.filter(({ id }) => !activeIds.includes(id));
            this.candidateList = this.candidates.filter(({ companyID }) => this.selectedCompanys.includes(companyID));
        } else {
            this.candidateList = this.candidates;
        }
    }

    onChangePublic(event: any) {
        if (event.value !== null) {
            this.isPublic = event.value === 0 ? false : true
            this.candidateService.getCandidateList(this.isPublic).subscribe(result => {
                this.candidates = result;
                this.candidateList = result;
            })
        }
    }

    addEditHeaderText: string = 'Candidates Notes';
    notesDialog: boolean = false;
    noteList: INoteDisplay[] = [];
    openNotesList(candidate: ICandidateDisplay) {
        this.reviewQueueService.getCondidateNoteList(candidate.candidateID).subscribe(result => {
            this.noteList = result;
            this.notesDialog = true;
        })
    }

    openResume(candidate: ICandidateDisplay) {
        if (candidate.fileName.split('.')[1].trim() === "pdf") {
            window.open(candidate.resumeURL);
        } else {
            window.open('https://view.officeapps.live.com/op/view.aspx?src=' + candidate.resumeURL);
        }
    }
    applyFilterGlobal() {
        this.commonUtils.SearchFunction();
    }

}
