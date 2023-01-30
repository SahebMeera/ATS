import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonUtils } from '../../common/common-utils';
import { ConstantModules, RoleShortConstants } from '../../constant';
import { IInterviewScheduleDisplay } from '../../core/interfaces/interviewSchedule';
import { INoteDisplay } from '../../core/interfaces/note';
import { IRolePermissionDisplay } from '../../core/interfaces/rolePermission';
import { User } from '../../_models/user';
import { ReviewQueueService } from '../review-queue/review-queue.service';
import { AddEditInterviewScheduleComponent } from './add-edit-interview-schedule/add-edit-interview-schedule.component';
import { InterviewScheduleService } from './interview-schedule.service';

@Component({
  selector: 'app-interview-schedule',
  templateUrl: './interview-schedule.component.html',
  styleUrls: ['./interview-schedule.component.scss']
})
export class InterviewScheduleComponent implements OnInit {
    commonUtils = new CommonUtils();
    interviewScheduleList: IInterviewScheduleDisplay[] = [];
    interviewSchedules: IInterviewScheduleDisplay[] = [];
    roleShortConstants = RoleShortConstants;
    constantModules = ConstantModules;
    rolePermissions: IRolePermissionDisplay[] = [];
    rolePermission: IRolePermissionDisplay;
    isAddRolePermission: boolean = false;
    isUpdateRolePermission: boolean = false;
    userDetails: User;
    userName: string = '';

    cols: any[];
    @ViewChild('addEditInterviewSchedule') addEditInterviewScheduleModalPopUP: AddEditInterviewScheduleComponent;


    constructor(private interviewScheduleService: InterviewScheduleService,
        private reviewQueueService: ReviewQueueService) {
        this.userDetails = JSON.parse(localStorage.getItem('ats-current-loggedin-user'));
        this.rolePermissions = JSON.parse(localStorage.getItem('role-permission'));
        this.userName = this.userDetails.firstName + '' + this.userDetails.lastName;
        if (this.rolePermissions !== null && this.rolePermissions !== undefined && this.rolePermissions.length > 0) {
            this.rolePermission = this.rolePermissions.find(x => x.moduleShort === this.constantModules.INTERVIEWSCHEDULE);
            this.isAddRolePermission = false;
            this.isUpdateRolePermission = false;
            if (this.rolePermission !== null && this.rolePermission !== undefined && this.rolePermission.add === false) {
                this.isAddRolePermission = true;
            }
            if (this.rolePermission !== null && this.rolePermission !== undefined && this.rolePermission.update === false) {
                this.isUpdateRolePermission = true;
            }
        }
        this.loadinterviewSchedule();
    }

    ngOnInit(): void {
        this.cols = [
            { field: 'reviewer', header: 'Reviewer' },
            { field: 'interviewType', header: 'interviewType' },
            { field: 'dateInterview', header: 'dateInterview' },
            { field: 'duration', header: 'duration' },
            { field: 'timeZone', header: 'timeZone' },
        ];
  }

    loadinterviewSchedule() {
        this.interviewScheduleService.getInterviewSchedule().subscribe(result => {
            this.interviewScheduleList = result;
        })
    }

    addInterviewSchedule() {
       this.addEditInterviewScheduleModalPopUP.show(false, 0);
    }
    editInterviewSchedule(interview: IInterviewScheduleDisplay) {
        this.addEditInterviewScheduleModalPopUP.editShow(interview);
    }

    applyFilterGlobal() {
        this.commonUtils.SearchFunction();
    }
    addEditHeaderText: string = 'Interview Schedule Notes';
    notesDialog: boolean = false;
    noteList: INoteDisplay[] = [];
    openNotesList(interviewSchedule: IInterviewScheduleDisplay) {
        this.reviewQueueService.getNoteList(interviewSchedule.reviewQueueID).subscribe(result => {
            this.noteList = result;
            this.notesDialog = true;
        })
    }
}
