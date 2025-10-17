
export type partnerOfferingType = {
    apisMap: Map<string, {
        readonly docLink: string;
        readonly endpoint: string;
        readonly id: string;
        readonly apiType: {
            readonly name: string;
        };
    }>;
    offeringName: string;
    id: string;
    nwnOffering: {
        readonly name: string;
    };
    company: {
        readonly name: string;
    };
    priority: {
        readonly name: string;
    };
    apis: {
        readonly docLink: string;
        readonly endpoint: string;
        readonly id: string;
        readonly apiType: {
            readonly name: string;
        };
    }[];
}

