export class IUserToken {
    user: any;
    token: string;
    isvalid: boolean;
    Message: string;
    MessageType: string;
}

export class IUser {
    Email: string;
    Password: string;
    UserID: number
}
export class IUserForm {
    UserID: number;
    Email: string;
    FirstName: string;
    LastName: string;
    Password: string;
    CompanyID: number;
    RoleID: number;
    IsActive?: boolean;
    IsTempPassword?: boolean;
    CreatedBy: string;
    DateCreated?: Date;
    DateModified?: Date;
    ModifiedBy?: string;
}
export class IUserDisplay {
    userID: number;
    email: string;
    firstName: string;
    lastName: string;
    userName?: string;
    password?: string;
    companyID?: number;
    companyName: string;
    roleID?: number;
    roleName: string;
    roleShort?: string;
    isActive?: boolean;
    IsTempPassword?: boolean;
    recordID?: number;
    dateCreated: Date;
    createdBy: string;
    dateModified: Date;
    modifiedBy: string;
    timeStamp: Date;
    //ReturnCode: number;
}




