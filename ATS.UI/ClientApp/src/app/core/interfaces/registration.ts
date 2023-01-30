export class IRegistration {
    RegistrationID: number;
    FirstName: string;
    LastName: string;
    Email: string;
    Password: string;
    ConfirmPassword: string;
    Phone: string;
    Company: string;
    CompanyURL: string;
    City: string;
    StateID?: number;
    CountryID?: number;
    ZIPCode: string;
    GUID: string;
    IsComplete?: boolean;
    IsActive?: boolean;
    RecordID?: number;
    DateCreated: Date;
    CreatedBy: string;
    DateModified: Date;
    ModifiedBy: string;
   // TimeStamp: Date;
    //ReturnCode: number;
}
export class IRegistrationDisplay {
    registrationID: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone: string;
    company: string;
    companyURL: string;
    city: string;
    stateID: number;
    countryID: number;
    zipCode: string;
    guid: string;
    isComplete?: boolean;
    isActive?: boolean;
    recordID?: number;
    dateCreated: Date;
    createdBy: string;
    dateModified: Date;
    modifiedBy: string;
    timeStamp: Date;
    //ReturnCode: number;
}



