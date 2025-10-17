
export type partnerOfferingType = {
    id: string;
    offeringName: string;
    contactInfo: string;
    dashboard: string;
    notes: string;
    status: {
        readonly name: string;
    };
    nwnOffering: {
        readonly name: string;
        readonly manager: {
            readonly name: string;
        };
    };
    company: {
        readonly name: string;
    };
    priority: {
        readonly name: string;
    };
    apis: {
        readonly docLink: string;
        readonly trainingLink: string;
        readonly sandboxEnvironment: string;
        readonly endpoint: string;
        readonly authenticationInfo: string;
        readonly id: string;
        readonly apiType: {
            readonly name: string;
        };
        readonly authenticationType: {
            readonly name: string;
        };
    }[];
}

