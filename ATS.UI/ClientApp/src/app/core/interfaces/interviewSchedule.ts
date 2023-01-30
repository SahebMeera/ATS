export class IInterviewScheduleDisplay {
    interviewScheduleID: number;
    reviewQueueID: number;
    reviewStatusID: number;
    reviewer?: string;
    dateInterview: Date;
    duration: number;
    interviewTypeID: number;
    interviewType?: string;
    timeZone: string;
    comment: string;
    status?: string;
    candidate?: string;
    requirement?: string;
    recruiter?: string;
}

export class IInterviewSchedule {
    InterviewScheduleID: number;
    ReviewQueueID: number;
    ReviewStatusID: number;
    DateInterview?: string;
    Duration: number;
    InterviewTypeID: number;
    TimeZone: string;
    Comment: string;
    DateCreated?: Date
    CreatedBy?: string;
    DateModified?: Date;
    ModifiedBy?: string;
    CommentBy?: number;
}
