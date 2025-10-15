import { CLIENT } from "./Constants";

const apiTypeNames = [
    "REST",
    "REST (OKTA)",
    "MCP",
    "GRAPHQL",
    "SDK",
    "REST & SOAP",
    "REST & GRAPH"
];

const priorities = [
    "LOW",
    "MEDIUM",
    "HIGH"
];

// add a ProductOffering
export async function createPartnerOffering() {
    await createInitialDataSettings();

    const prompt = window.prompt("Offering content");
    if (prompt !== null) {
        // Create a uuid for the PartnerOffering because we are going to include
        // in on the client side.  This way everything for PartnerOffering is updated once.
        const partnerOfferingId = crypto.randomUUID();

        // pick a random priority
        const randomPriority = priorities[Math.floor(Math.random() * priorities.length)];
        const priorityResult = await CLIENT.models.Priority.list({ filter: { name: { eq: randomPriority} } })
        const priorityId = priorityResult.data[0].id;

        const [apiTypeRESTResult, apiTypeGRAPHQLResult] = await Promise.all([
            CLIENT.models.ApiType.list({ filter: { name: { eq: "REST" } } }),
            CLIENT.models.ApiType.list({ filter: { name: { eq: "GRAPHQL" } } })
        ])
        const apiTypeRESTId = apiTypeRESTResult.data?.[0]?.id;
        const apiTypeGRAPHQLId = apiTypeGRAPHQLResult.data?.[0]?.id;

        const name = "Test authentication";
        let { data: existing } = await CLIENT.models.AuthenticationType.list({
            filter: { name: { eq: name } }
        });
        if (!existing || existing.length === 0) {
            const { data: created } = await CLIENT.models.AuthenticationType.create({ name });
            existing = created ? [created] : [];
        }
        const authenticationTypeId = existing[0].id;

        await CLIENT.models.Api.create({
            partnerOfferingId: partnerOfferingId,
            docLink: "abcd1",
            apiTypeId: apiTypeRESTId,
            trainingLink: "",
            sandboxEnvironment: "",
            endpoint: "",
            authenticationTypeId: authenticationTypeId ?? "",
            authenticationInfo: ""
        })

        await CLIENT.models.Api.create({
            partnerOfferingId: partnerOfferingId,
            docLink: "abcd2",
            apiTypeId: apiTypeGRAPHQLId,
            trainingLink: "",
            sandboxEnvironment: "",
            endpoint: "",
            authenticationTypeId: authenticationTypeId ?? "",
            authenticationInfo: ""
        })

        await CLIENT.models.PartnerOffering.create({
            id: partnerOfferingId,
            offeringName: prompt,
            contactInfo: "Mr. Jones",
            dashboard: "www.google.com",
            notes: "This is a test",
            priorityId: priorityId
        });
    }
}

// populate the database with initial values
async function createInitialDataSettings() {
    for (const name of apiTypeNames) {
        const { data: existing } = await CLIENT.models.ApiType.list({
            filter: { name: { eq: name } }
        });

        if (!existing || existing.length === 0) {
            await CLIENT.models.ApiType.create({ name });
        }
    }

    for (const name of priorities) {
        const { data: existing } = await CLIENT.models.Priority.list({
            filter: { name: { eq: name } }
        });

        if (!existing || existing.length === 0) {
            await CLIENT.models.Priority.create({ name });
        }
    }
}

export async function deleteAll() {
    const allApis = await CLIENT.models.Api.list();
    await Promise.all(allApis.data.map((d) => CLIENT.models.Api.delete(d)));

    const allApiTypes = await CLIENT.models.ApiType.list();
    await Promise.all(allApiTypes.data.map((d) => CLIENT.models.ApiType.delete(d)));

    const allPartnerOfferings = await CLIENT.models.PartnerOffering.list();
    await Promise.all(allPartnerOfferings.data.map((d) => CLIENT.models.PartnerOffering.delete(d)));
}

