export class IReviewQueueDisplay {
    reviewQueueID: number;
    requirementID: number;
    requirement: string;
    candidateID: number;
    companyID: number;
    candidateCompanyID: number;
    candidate: string;
    rate: number;
    rateTypeID: number;
    rateType: string;
    submittedBy: number;
    submittedByName: string;
    dateSubmitted: Date;
    reviewerID: number;
    reviewer: string;
    dateReviewed: Date;
    reviewStatusID: number;
    reviewStatus: string;
    recordID?: number;
    dateCreated: Date;
    createdBy: string;
    dateModified: Date;
    modifiedBy: string;
    timeStamp: Date;
    requirementCandidate?: string;
    fileName: string;
    resumeURL: string;
    note?: string;
    workAuth?: string;
}

export class IReviewQueueForm {
    ReviewQueueID: number;
    RequirementID: number;
    CandidateID: number;
    Rate?: number;
    RateTypeID?: number;
    SubmittedBy: number;
    DateSubmitted: Date;
    ReviewerID?: number;
    DateReviewed?: Date;
    ReviewStatusID: number;
    Note: string;
    //recordID?: number;
    DateCreated: Date;
    CreatedBy: string;
    DateModified: Date;
    ModifiedBy: string;
    //TimeStamp: Date;
}
