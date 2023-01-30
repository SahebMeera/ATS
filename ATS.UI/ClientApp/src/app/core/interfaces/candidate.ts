export class ICandidateDisplay {
    candidateID: number;
    companyID: number;
    companyName: string;
    firstName: string;
    lastName: string;
    email: string;
    linkedInURL: string;
    jobTitle: string;
    skills: string;
    phone: string;
    city: string;
    stateID?: number;
    stateName: string;
    countryID?: number;
    countryName: string;
    workAuthID: number;
    workAuthorization: string;
    billingRate: number;
    experience: number;
    availabilityID: number;
    availability: string;
    isRelocation?: boolean;
    isActive?: boolean;
    isPublic?: boolean;
    fileName: string;
    resumeBase64: string;
    resumeURL: string;
    //ReturnCode: number;
}

export class ICandidate {
    CandidateID: number;
    CompanyID: number;
    FirstName: string;
    LastName: string;
    Email: string;
    LinkedInURL: string;
    JobTitle: string;
    Skills: string;
    Phone: string;
    City: string;
    StateID?: number;
    CountryID?: number;
    WorkAuthID?: number;
    BillingRate: number;
    Experience: number;
    AvailabilityID?: number;
    IsRelocation?: boolean;
    IsActive?: boolean;
    IsPublic?: boolean;
    //ReturnCode: number;
}
