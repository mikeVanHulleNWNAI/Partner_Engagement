
export type partnerOfferingType = {
    id: string;
    offeringName: string;
    contactInfo: string;
    dashboard: string;
    notes: string;
    status: {
        readonly id: string;
        readonly name: string;
    };
    nwnOffering: {
        readonly id: string;
        readonly name: string;
        readonly manager: {
            readonly id: string;
            readonly name: string;
        };
    };
    company: {
        readonly id: string;
        readonly name: string;
    };
    priority: {
        readonly id: string;
        readonly name: string;
    };
    apis: {
        readonly id: string;
        readonly docLink: string;
        readonly trainingLink: string;
        readonly sandboxEnvironment: string;
        readonly endpoint: string;
        readonly authenticationInfo: string;
        readonly apiType: {
            readonly id: string;
            readonly name: string;
        };
        readonly authenticationType: {
            readonly id: string;
            readonly name: string;
        };
    }[];
}

