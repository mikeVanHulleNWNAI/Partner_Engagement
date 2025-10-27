
export type partnerOfferingType = {
    id: string;
    offeringName: string;
    contactInfo: string;
    dashboard: string;
    notes: string;
    status: {
        id: string;
        name: string;
    };
    nwnOffering: {
        id: string;
        name: string;
        manager: {
            id: string;
            name: string;
        };
    };
    company: {
        id: string;
        name: string;
    };
    priority: {
        id: string;
        name: string;
    };
    apis: {
        id: string;
        docLink: string;
        trainingLink: string;
        sandboxEnvironment: string;
        endpoint: string;
        apiType: {
            id: string;
            name: string;
        };
        authenticationType: {
            id: string;
            name: string;
        };
        authenticationInfo: string;
    }[];
}

export interface IIdName { 
    id: string; 
    name: string 
}

export interface IIdNameAndManager extends IIdName { 
    manager: IIdName 
}
