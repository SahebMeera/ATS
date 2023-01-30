import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { CommonUtils } from '../../common/common-utils';
import { ConstantModules, ListTypeConstants, ReviewStatusConstants, RoleShortConstants } from '../../constant';
import { ICompanyDisplay } from '../../core/interfaces/company';
import { IListValue } from '../../core/interfaces/listValue';
import { INoteDisplay } from '../../core/interfaces/note';
import { IReviewQueueDisplay } from '../../core/interfaces/reviewQueue';
import { IRolePermissionDisplay } from '../../core/interfaces/rolePermission';
import { IUserDisplay } from '../../core/interfaces/user';
import { DataProvider } from '../../core/providers/data.provider';
import { User } from '../../_models/user';
import { CandidateService } from '../candidate/candidate.service';
import { AddEditInterviewScheduleComponent } from '../interview-schedule/add-edit-interview-schedule/add-edit-interview-schedule.component';
import { RequirementService } from '../requirements/requirement.service';
import { AddEditReviewQueueComponent } from './add-edit-review-queue/add-edit-review-queue.component';
import { ReviewQueueService } from './review-queue.service';

@Component({
  selector: 'app-review-queue',
  templateUrl: './review-queue.component.html',
  styleUrls: ['./review-queue.component.scss']
})
export class ReviewQueueComponent implements OnInit {
    commonUtils = new CommonUtils();
    @ViewChild('addEditReviewQueue') addEditReviewQueueModalPopUP: AddEditReviewQueueComponent;
    @ViewChild('addEditInterviewSchedule') addEditInterviewScheduleModalPopUP: AddEditInterviewScheduleComponent;
    reviewStatusConstants = ReviewStatusConstants;
    reviewQueueList: IReviewQueueDisplay[] = [];
    roleShortConstants = RoleShortConstants;
    reviewQueues: IReviewQueueDisplay[] = [];
    reviewQueuesFilterList: IReviewQueueDisplay[] = [];
    constantModules = ConstantModules;
    rolePermissions: IRolePermissionDisplay[] = [];
    rolePermission: IRolePermissionDisplay;
    isAddRolePermission: boolean = false;
    isUpdateRolePermission: boolean = false;
    selectedStatus: number[] = [];
    selectedReviewer: number[] = [];
    reviewStatusList: IListValue[] = [];
    companyList: ICompanyDisplay[] = [];
    userDetails: User;
    companyID: number = 0;
    userName: string = '';
    cols: any[];
    items: MenuItem[];
    isredirectDashboard: boolean = false;

    constructor(private reviewQueueService: ReviewQueueService,
        private dataProvider: DataProvider,
        private router: Router,
        private requirementService: RequirementService,
        private candidateService: CandidateService) {
        this.userDetails = JSON.parse(localStorage.getItem('ats-current-loggedin-user'));
        this.rolePermissions = JSON.parse(localStorage.getItem('role-permission'));
        this.userName = this.userDetails.firstName + '' + this.userDetails.lastName;
        if (this.rolePermissions !== null && this.rolePermissions !== undefined && this.rolePermissions.length > 0) {
            this.rolePermission = this.rolePermissions.find(x => x.moduleShort === this.constantModules.REVIEWQUEUE);
            this.isAddRolePermission = false;
            this.isUpdateRolePermission = false;
            if (this.rolePermission !== null && this.rolePermission !== undefined && this.rolePermission.add === false) {
                this.isAddRolePermission = true;
            }
            if (this.rolePermission !== null && this.rolePermission !== undefined && this.rolePermission.update === false) {
                this.isUpdateRolePermission = true;
            }
        }
        this.companyID = this.userDetails.companyID;
        console.log(this.dataProvider.storage);
        if (this.dataProvider.storage) {
            this.isredirectDashboard = this.dataProvider.storage["isredirectDashboard"]
        }
        this.requirementService.getListValues().subscribe(result => {
            if (result !== null) {
                this.reviewStatusList = result.filter(x => x.type.toUpperCase() === ListTypeConstants.REVIEWSTATUS);
                this.reviewStatusList.forEach(x => {
                    if (this.isredirectDashboard === true) {
                        if (x.valueShort === this.reviewStatusConstants.REQUESTED ) {
                            this.selectedStatus.push(x.listValueID);
                        }
                    } else {
                        if (x.valueShort === this.reviewStatusConstants.PENDINGREVIEW || x.valueShort === this.reviewStatusConstants.REQUESTED || x.valueShort === this.reviewStatusConstants.SHORTLISTED) {
                            this.selectedStatus.push(x.listValueID);
                        }
                    }
                   
                });
            }
            if (this.reviewStatusList.length > 0) {
                this.loadReviewQueueList();
            }
        })
    }

    ngOnInit(): void {
        this.cols = [
            { field: 'requirement', header: 'Requirement' },
            { field: 'candidate', header: 'Candidate' },
            { field: 'rateType', header: 'RateType' },
            { field: 'reviewer', header: 'Reviewer' },
            { field: 'reviewerStatus', header: 'ReviewerStatus' },
            { field: 'submittedByName', header: 'SubmittedByName' }
        ];
       // this.loadMobilesItems();
    }
    activeItem: IReviewQueueDisplay;
    loadMobilesItems() {
        this.items = [
            { label: 'Edit', icon: 'pi pi-pencil', disabled: false, styleClass: this.getClass(), command: (e) => { this.activeItem !== null ? this.editreviewQueue(this.activeItem) : "" } },
            { label: 'View', icon: 'pi pi-microsoft', disabled: false, command: (e) => { this.activeItem !== null ? this.addInterviewShcedule(this.activeItem) : "" }},
            { label: 'Notes', icon: 'fa fa-commenting-o', command: (e) => { this.activeItem !== null ? this.openNotesList(this.activeItem) : ""} },
        ];
    }
    getClass(): string {
        if (this.isUpdateRolePermission === true) {
            return 'display-none';
        } else {
            return '';
        }
    }
    toggleMenu(menu, event, rowData)
    {
        this.activeItem = rowData;
        if (this.activeItem !== null && this.activeItem !== undefined) {
            if (this.activeItem.reviewStatus.toUpperCase() === this.reviewStatusConstants.SUBMITTED) {
                this.items[1].disabled = false;
            } else {
                this.items[1].disabled = true;
            }
            if (this.companyID !== 0 && this.activeItem.companyID === this.companyID) {
                this.items[0].disabled = false;
            } else {
                this.items[0].disabled = true;
            }
        }
        menu.toggle(event);
    }
    loadReviewQueueList() {
        this.reviewQueueService.getReviewQueueList().subscribe(result => {
            this.reviewQueues = result;
            this.reviewQueueList = result;
            if (result !== null && result !== undefined && result.length > 0) {
                this.reviewQueuesFilterList = result.filter((s => a => a.reviewerID !== null && !s.has(a.reviewerID) && s.add(a.reviewerID))(new Set));
                this.filterReviewQueueList();
                this.loadMobilesItems();
            }
        });
    }


    addreviewQueue() {
        this.addEditReviewQueueModalPopUP.show();
    }
    editreviewQueue(candidate: IReviewQueueDisplay) {
        this.addEditReviewQueueModalPopUP.editShow(candidate);
    }

    addInterviewShcedule(reviewQueue: IReviewQueueDisplay) {
        this.addEditInterviewScheduleModalPopUP.show(true, reviewQueue.reviewQueueID)
    }

    onChangeCompany(event: any) {
        this.selectedReviewer = [];
        this.selectedReviewer = event.value;
        this.filterReviewQueueList()
    }
    onChangeStatus(event: any) {
        this.selectedStatus = [];
        this.selectedStatus = event.value;
        this.filterReviewQueueList()
       // this.loadMobilesItems();
    }
    filterReviewQueueList() {
        if (this.selectedReviewer.length > 0 && this.selectedStatus.length > 0) {
            this.reviewQueueList = this.reviewQueues.filter(x => this.selectedReviewer.includes(x.reviewerID) && this.selectedStatus.includes(x.reviewStatusID));
        } else if (this.selectedReviewer.length > 0 && this.selectedStatus.length === 0) {
           this.reviewQueueList = this.reviewQueues.filter(({ reviewerID }) => this.selectedReviewer.includes(reviewerID));
        } else if (this.selectedReviewer.length === 0 && this.selectedStatus.length > 0) {
            this.reviewQueueList = this.reviewQueues.filter(({ reviewStatusID }) => this.selectedStatus.includes(reviewStatusID));
        } else {
            this.reviewQueueList = this.reviewQueues;
        }
        this.loadMobilesItems();
    }
    addEditHeaderText: string = 'Review Queue Notes';
    notesDialog: boolean = false;
    noteList: INoteDisplay[] = [];
    openNotesList(reviewQueue: IReviewQueueDisplay) {
        this.reviewQueueService.getNoteList(reviewQueue.reviewQueueID).subscribe(result => {
            this.noteList = result;
            this.notesDialog = true;
        })
    }

    openResume(reviewQueue: IReviewQueueDisplay) {
        if (reviewQueue.fileName.split('.')[1].trim() === "pdf") {
            window.open(reviewQueue.resumeURL);
        } else {
            window.open('https://view.officeapps.live.com/op/view.aspx?src=' + reviewQueue.resumeURL);
        }
    }

    applyFilterGlobal() {
        this.commonUtils.SearchFunction();
    }
    viewRequirement(reviewQueue: IReviewQueueDisplay) {
        this.requirementService.getRequirementsList(false).subscribe(result => {
            if (result !== null && result !== undefined && result.length > 0) {
                var requirement = result.find(x => x.requirementID === reviewQueue.requirementID);
                 this.dataProvider.storage = {
                    isEditMode: true,
                    requirementDetails: requirement,
                    isPublicID: 0,
                   isReviewQueue: true
                };
                this.router.navigate(['requirements/viewDetailRequirement']);
            }
        })
       
    }

}
