import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ICompanyDisplay } from '../../core/interfaces/company';
import { IListValue } from '../../core/interfaces/listValue';
import { IRequirementDisplay } from '../../core/interfaces/requirements';
import { IUserDisplay } from '../../core/interfaces/user';
import { DataProvider } from '../../core/providers/data.provider';
import { CandidateService } from '../candidate/candidate.service';
import { AddEditRequirementComponent } from './add-edit-requirement/add-edit-requirement.component';
import { RequirementService } from './requirement.service';
import { forkJoin } from 'rxjs';
import { ConstantModules, ListTypeConstants, RequirementStatusConstants, RoleShortConstants } from '../../constant';
import { INoteDisplay } from '../../core/interfaces/note';
import { ReviewQueueService } from '../review-queue/review-queue.service';
import { MenuItem } from 'primeng/api';
import { CommonUtils } from '../../common/common-utils';
import { CandidateSuccessMissComponent } from '../../shared/candidate-success-miss/candidate-success-miss.component';
import { IRolePermissionDisplay } from '../../core/interfaces/rolePermission';

@Component({
  selector: 'app-requirements',
  templateUrl: './requirements.component.html',
  styleUrls: ['./requirements.component.scss']
})
export class RequirementsComponent implements OnInit {
    commonUtils = new CommonUtils();
    roleShortConstants = RoleShortConstants;
    requirementStatusConstants = RequirementStatusConstants;
    constantModules = ConstantModules;
    rolePermissions: IRolePermissionDisplay[] = [];
    rolePermission: IRolePermissionDisplay;
    isAddRolePermission: boolean = false;
    isUpdateRolePermission: boolean = false;
    requirementList: IRequirementDisplay[] = [];
    requirements: IRequirementDisplay[] = [];
    companyID: number;
    selectedCompanys: number[] = [];
    companyList: ICompanyDisplay[] = [];
    userDetails: IUserDisplay;
    userName: string = '';
    isPublicList: any[] = [];
    isPayRateText: string = 'Pay Rate';
    isPublicID: number = 0;
    isPublic: boolean = false;
    StatusList: IListValue[] = [];
    selectedStatus: number[] = [];
    isStatusID: number;
    items: MenuItem[];
    closenButtonItems: MenuItem[];

    @ViewChild('addEditRequirment') addEditRequirmentModalPopUP: AddEditRequirementComponent;

    cols: any[];
    constructor(private requirementService: RequirementService, private router: Router,
        private dataProvider: DataProvider,
        private reviewQueueService: ReviewQueueService,
        private candidateService: CandidateService) {
        this.userDetails = JSON.parse(localStorage.getItem('ats-current-loggedin-user'));
        this.rolePermissions = JSON.parse(localStorage.getItem('role-permission'));
        this.userName = this.userDetails.firstName + '' + this.userDetails.lastName;
        if (this.rolePermissions !== null && this.rolePermissions !== undefined && this.rolePermissions.length > 0) {
            this.rolePermission = this.rolePermissions.find(x => x.moduleShort === this.constantModules.REQUIREMENT);
            this.isAddRolePermission = false;
            this.isUpdateRolePermission = false;
            if (this.rolePermission !== null && this.rolePermission !== undefined && this.rolePermission.add === false) {
                this.isAddRolePermission = true;
            }
            if (this.rolePermission !== null && this.rolePermission !== undefined && this.rolePermission.update === false) {
                this.isUpdateRolePermission = true;
            }
        }
        this.loadDropDownList();
        this.loadRequirmentList();
    }

    ngOnInit(): void {
        this.router.navigate(['/requirements']);
        this.cols = [
            { field: 'companyName', header: 'Company' },
            { field: 'clientName', header: 'Client' },
            { field: 'clientType', header: 'ClientType' },
            { field: 'requirementType', header: 'RequirementType' },
            { field: 'interviewType', header: 'InterviewType' },
            { field: 'payRateType', header: 'PayRateType' },
            { field: 'statusName', header: 'Status' },
            //{ field: 'isRelocation', header: 'IsRelocation' },
            //{ field: 'stateName', header: 'State' },
        ];

        this.isPublicList = [
            { label: 'Internal', value: 0 },
            { label: 'External', value: 1 }
        ]
        this.loadMobilesItems();
        this.loadCloseMenuButton()
    }
    activeItem: any;
    requirementDetails: IRequirementDisplay;
    loadMobilesItems() {
        this.items = [
            { label: 'Edit', icon: 'pi pi-pencil', disabled: false, styleClass: this.getClass(), command: (e) => { this.editrequirment(this.activeItem) } },
            { label: 'View', icon: 'pi pi-microsoft', command: (e) => { this.viewRequirement(this.activeItem) } },
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
       toggleMenu(menu, event, rowData) {
        this.activeItem = rowData;
        if (this.isPublicID === 0) {
            this.items[0].disabled = false;
        } else {
            this.items[0].disabled = true;
        }
        menu.toggle(event);
    }
   
    loadRequirmentList() {
        this.requirementService.getRequirementsList(false).subscribe(result => {
            this.requirements = result;
            this.requirementList = result;
            this.filterRequirementList();
        })
    }
    loadDropDownList() {
        forkJoin(
            this.candidateService.getCompanyList(),
            this.requirementService.getListValues(),
        ).subscribe(result => {
            this.companyList = result[0];
            this.StatusList = result[1].filter(x => x.type.toUpperCase() === ListTypeConstants.REQUIREMENTSTATUS);
            this.selectedStatus = [];
            if (this.StatusList.length > 0) {
                this.selectedStatus.push(this.StatusList.find(x => x.valueShort === 'OPEN').listValueID)
              //  this.isStatusID = this.StatusList.find(x => x.valueShort === 'OPEN').listValueID;
                this.filterRequirementList();
                this.loadMobilesItems();
            };
        })
    }

    addrequirment() {
        this.dataProvider.storage = {
            isEditMode: false,
            isPublicID: this.isPublicID
        };
      this.router.navigate(['requirements/addEditRequirement']);
     // this.addEditRequirmentModalPopUP.show();
    }
    editrequirment(requirement: IRequirementDisplay) {
        console.log('requirement', requirement)
        this.dataProvider.storage = {
            isEditMode: true,
            isPublicID: this.isPublicID,
            requirementDetails: requirement
        };
     this.router.navigate(['requirements/addEditRequirement']);
     // this.addEditRequirmentModalPopUP.editShow(candidate);
    }
    viewRequirement(requirement: IRequirementDisplay) {
        this.dataProvider.storage = {
            isEditMode: true,
            requirementDetails: requirement,
            isPublicID: this.isPublicID,
            isReviewQueue: false
        };
        this.router.navigate(['requirements/viewDetailRequirement']);
    }

    onChangePublic(event: any) {
        if (event.value !== null) {
            this.isPublic = event.value === 0 ? false : true
            this.isPayRateText = this.isPublicID === 1 ? 'Rate' : 'Pay Rate';
            this.requirementService.getRequirementsList(this.isPublic).subscribe(result => {
                this.requirements = result;
                this.requirementList = result;
                this.filterRequirementList()
                this.loadMobilesItems();
            })
        }
    }

    onChangeCompany(event: any) {
        this.companyID = event.value;
        this.selectedCompanys = [];
        this.selectedCompanys = event.value;
        this.filterRequirementList()
    }

    onChangeStatus(event: any) {
        this.companyID = event.value;
        this.selectedStatus = [];
        this.selectedStatus = event.value;
        this.filterRequirementList()
    }

    //onChangeStatuss(event: any) {
    //    if (event.value !== null) {
    //        this.isStatusID = event.value;
    //        console.log(this.isStatusID)
    //        this.filterRequirementList()
    //    }
    //}
    onChangeStatuss(event: any) {
        this.selectedStatus = [];
        this.selectedStatus = event.value;
        this.filterRequirementList();
        // this.loadMobilesItems();
    }
    filterRequirementList() {
        //console.log(this.selectedCompanys);
        //console.log(this.selectedStatus);
        if (this.selectedCompanys.length > 0 && this.selectedStatus.length > 0) {
            this.requirementList = this.requirements.filter(x => this.selectedCompanys.includes(x.companyID) && this.selectedStatus.includes(x.statusID));
        } else if (this.selectedCompanys.length > 0 && this.selectedStatus.length === 0) {
            this.requirementList = this.requirements.filter(({ companyID }) => this.selectedCompanys.includes(companyID));
        } else if (this.selectedCompanys.length === 0 && this.selectedStatus.length > 0) {
            this.requirementList = this.requirements.filter(({ statusID }) => this.selectedStatus.includes(statusID));
        } else {
            this.requirementList = this.requirements;
        }
    }

    //filterRequirementList() {
    //    if (this.selectedCompanys.length > 0 && this.isStatusID !== null && this.isStatusID !== undefined) {
    //        this.requirementList = this.requirements.filter(x => this.selectedCompanys.includes(x.companyID) && x.statusID === this.isStatusID);
    //    } else if (this.selectedCompanys.length > 0 && this.isStatusID === null) {
    //        this.requirementList = this.requirements.filter(({ companyID }) => this.selectedCompanys.includes(companyID));
    //    } else if (this.selectedCompanys.length === 0 && this.isStatusID !== null) {
    //        this.requirementList = this.requirements.filter(x => x.statusID === this.isStatusID  );
    //    } else {
    //        this.requirementList = this.requirements;
    //    }
    //}

    addEditHeaderText: string = 'Requirements Notes';
    notesDialog: boolean = false;
    noteList: INoteDisplay[] = [];
    openNotesList(requirement: IRequirementDisplay) {
        this.reviewQueueService.getRequirementsNoteList(requirement.requirementID).subscribe(result => {
            this.noteList = result;
            this.notesDialog = true;
        })
    }
    applyFilterGlobal() {
        this.commonUtils.SearchFunction();
    }
    requirementID: number = 0;
    @ViewChild('candidateSuccessMiss') candidateSuccessMiss: CandidateSuccessMissComponent;
    toggleMenuCloseButton(menu, event, rowData) {
        console.log(rowData)
        this.requirementDetails = rowData;
        this.requirementID = rowData.requirementID;
        if (this.requirementDetails.status.toUpperCase() !== this.requirementStatusConstants.MISS && this.requirementDetails.status.toUpperCase() !== this.requirementStatusConstants.SUCCESS) {
            console.log('Here')
            menu.toggle(event);
        }
    }
    loadCloseMenuButton() {
        this.closenButtonItems = [
            { label: 'Success', icon: 'fa fa-thumbs-o-up', disabled: false, command: (e) => { this.isCandidateSuccess(this.requirementDetails, true) } },
            { label: 'Miss', icon: 'fa fa-thumbs-o-down', command: (e) => { this.isCandidateMiss(this.requirementDetails, false) } },
        ];
    }
    isCandidateCloseDialog: boolean = false;
    isCloseCandidateHaderText: string = 'Test';
    isCloseCandidate: boolean = false;;
    isCandidateSuccess(requirementDetail: IRequirementDisplay, success: boolean) {
        this.isCloseCandidateHaderText = requirementDetail.jobTitle;
        this.isCloseCandidate = success;
        this.candidateSuccessMiss.isCloseCandidate = success;
        this.candidateSuccessMiss.requirementID = requirementDetail.requirementID;
        this.candidateSuccessMiss.requirementDetails = requirementDetail;
        this.candidateSuccessMiss.loadData();
        this.isCandidateCloseDialog = true;
    }
    isCandidateMiss(requirementDetail: IRequirementDisplay, miss: boolean) {
        this.isCloseCandidateHaderText = requirementDetail.jobTitle;
        this.isCloseCandidate = miss;
        this.candidateSuccessMiss.isCloseCandidate = miss;
        this.candidateSuccessMiss.requirementID = requirementDetail.requirementID;
        this.candidateSuccessMiss.requirementDetails = requirementDetail;
        this.candidateSuccessMiss.loadData();
        this.isCandidateCloseDialog = true;
    }
    CloseCancel() {
        this.isCandidateCloseDialog = false;
    }

}
