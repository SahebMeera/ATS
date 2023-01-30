export class INoteDisplay {
    noteID: number;
    requirementID: number;
    requirement: string;
    candidateID: number;
    candidate: string;
    reviewQueueID: number;
    reviewQueue: string;
    reviewerID: number;
    reviewStatusID: number;
    reviewStatus: string;
    rateType?: string;
    rate?: number;
    reviewer: string;
    noteDesc: string;
    noteBy: number;
    dateNoted: Date;
    recordID?: number;
    dateCreated: Date;
    createdBy: string;
    dateModified: Date;
    modifiedBy: string;
    timeStamp: Date;
}

export class INoteForm {
    NoteID: number;
    RequirementID: number;
    CandidateID: number;
    ReviewQueueID: number;
    ReviewerID: number;
    ReviewStatusID: number;
    NoteDesc: string;
    NoteBy: number;
    DateNoted: Date;
    //recordID?: number;
    DateCreated: Date;
    CreatedBy: string;
    DateModified: Date;
    ModifiedBy: string;
   // TimeStamp: Date;
}
