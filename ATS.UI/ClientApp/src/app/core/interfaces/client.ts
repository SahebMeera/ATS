export class IClientDisplay {
    clientID: number;
    clientName: string;
    clientTypeID: number;
    clientType?: string;
    markup: number;
    companyID: number;
    companyName: string;
}

export class IClient {
    ClientID: number;
    ClientName: string;
    ClientTypeID: number;
    Markup: number;
    CompanyID: number;
    DateCreated?: Date
    CreatedBy?: string;
    DateModified?: Date;
    ModifiedBy?: string;
}
