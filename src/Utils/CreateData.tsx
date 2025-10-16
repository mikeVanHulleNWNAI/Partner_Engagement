import { CLIENT } from "./Constants";

const managers = [
    "Kevin Basden",
    "Brian Fichter",
    "Austin Rose",
    "Mike Patton",
    "Alvaro Rivera",
    "Chris Poe",
    "Mike Patton",
    "Alec Saffrin"
];

const connectionStatus = [
    "Connected",
    "In Process",
    "Meeting Scheduled",
    "Upcoming"
];

const companies = [
    "Genysis",
    "Five9's",
    "Verkada",
    "ApexaiQ",
    "Amazon",
    "Microsoft",
    "Nectar",
    "Juniper",
    "CISCO",
    "HPE",
    "ServiceNow",
    "NextThink API",
    "Big fix",
    "Webex",
    "Contrivian",
    "Mettel.net",
    "Google",
    "Deepseas",
    "Proficio",
    "Splunk",
    "Continel",
    "XSIAM",
    "Crowd Strike",
    "Quium (LeverageIS = NWN Acq)",
    "Kurmi (www.kurmi-software.com",
    "Asana",
    "Salesforce",
    "Gong",
    "GovIQ",
    "Calendar APIs",
    "Aiva",
    "EMP",
    "Demandbase",
    "6sense",
    "ZoomInfo",
    "EMP",
    "Webex Control Hub",
    "ServiceNow (ITSM)",
    "Zoom Admin / QoS Dashboard",
    "Avaya Cloud Office",
    "Cisco Catalyst Center (DNA Center)",
    "Cisco Meraki Dashboard",
    "Cisco ThousandEyes",
    "CISCO DEVELOPMENT RESOURCES",
    "Juniper Mist Cloud",
    "Juniper Session Smart WAN (Mist)",
    "HPE Aruba EdgeConnect",
    "HPE Aruba Central",
    "Contrivian (Internet & Satellite)",
    "CMDB (ServiceNow CMDB)",
    "OpsRamp",
    "Zenoss Cloud"
];

const priorities = [
    "LOW",
    "MEDIUM",
    "HIGH"
];

const apiTypes = [
    "REST",
    "REST (OKTA)",
    "MCP",
    "GRAPHQL",
    "SDK",
    "REST & SOAP",
    "REST & GRAPH"
];

// add a ProductOffering
export async function createPartnerOffering(
) {
    const prompt = window.prompt("Offering content");
    if (prompt !== null) {
        // Create a uuid for the PartnerOffering because we are going to include
        // in on the client side.  This way everything for PartnerOffering is updated once.
        const partnerOfferingId = crypto.randomUUID();

        // pick a random priority
        const randomPriority = priorities[Math.floor(Math.random() * priorities.length)];
        const priorityResult = await CLIENT.models.Priority.list({ filter: { name: { eq: randomPriority } } })
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
            priorityId: priorityId,
        });
    }
}

// populate the database with initial values
export async function createInitialDataSettings() {
    // Manager
    for (const name of managers) {
        const { data: existing } = await CLIENT.models.Manager.list({
            filter: { name: { eq: name } }
        });

        if (!existing || existing.length === 0) {
            await CLIENT.models.Manager.create({ name });
        }
    }

    // NwnOffering
    await CLIENT.models.NwnOffering.create({
        name: "Customer Experience",
        managerId: (await CLIENT.models.Manager.list({
            filter: { name: { eq: "Kevin Basden" } } })).data[0].id
    })
    await CLIENT.models.NwnOffering.create({
        name: "Visual Collaboration",
        managerId: (await CLIENT.models.Manager.list({
            filter: { name: { eq: "Brian Fichter" } } })).data[0].id
    })
    await CLIENT.models.NwnOffering.create({
        name: "Intelligent Cloud",
        managerId: (await CLIENT.models.Manager.list({
            filter: { name: { eq: "Austin Rose" } } })).data[0].id
    })
    await CLIENT.models.NwnOffering.create({
        name: "Managed Devices",
        managerId: (await CLIENT.models.Manager.list({
            filter: { name: { eq: "Mike Patton" } } })).data[0].id
    })
    await CLIENT.models.NwnOffering.create({
        name: "Intelligent Workspace (edge)",
        managerId: (await CLIENT.models.Manager.list({
            filter: { name: { eq: "Alvaro Rivera" } } })).data[0].id
    })
    await CLIENT.models.NwnOffering.create({
        name: "Intelligent Connectivity",
        managerId: (await CLIENT.models.Manager.list({
            filter: { name: { eq: "Chris Poe" } } })).data[0].id
    })
    await CLIENT.models.NwnOffering.create({
        name: "Cyber Security",
        managerId: (await CLIENT.models.Manager.list({
            filter: { name: { eq: "Alec Saffrin" } } })).data[0].id
    })

    // ConnectionStatus
    for (const name of connectionStatus)
        await CLIENT.models.ConnectionStatus.create({ name });

    // Company
    for (const name of companies)
        await CLIENT.models.Company.create({ name });

    // Priority
    for (const name of priorities)
        await CLIENT.models.Priority.create({ name });

    // ApiType
    for (const name of apiTypes)
       await CLIENT.models.ApiType.create({ name });
}

export async function deleteAll() {
    // Manager
    const allManagers = await CLIENT.models.Manager.list();
    await Promise.all(allManagers.data.map((d) => CLIENT.models.Manager.delete(d)));

    // NwnOffering
    const allNwnOffering = await CLIENT.models.NwnOffering.list();
    await Promise.all(allNwnOffering.data.map((d) => CLIENT.models.NwnOffering.delete(d)));

    // ConnectionStatus
    const allConnectionStatus = await CLIENT.models.ConnectionStatus.list();
    await Promise.all(allConnectionStatus.data.map((d) => CLIENT.models.ConnectionStatus.delete(d)));

    // Company
    const allCompanies = await CLIENT.models.Company.list();
    await Promise.all(allCompanies.data.map((d) => CLIENT.models.Company.delete(d)))

    // Priority
    const allPriroities = await CLIENT.models.Company.list();
    await Promise.all(allPriroities.data.map((d) => CLIENT.models.Company.delete(d)));

    // Api
    const allApis = await CLIENT.models.Api.list();
    await Promise.all(allApis.data.map((d) => CLIENT.models.Api.delete(d)));

    // ApiType
    const allApiTypes = await CLIENT.models.ApiType.list();
    await Promise.all(allApiTypes.data.map((d) => CLIENT.models.ApiType.delete(d)));

    const allPartnerOfferings = await CLIENT.models.PartnerOffering.list();
    await Promise.all(allPartnerOfferings.data.map((d) => CLIENT.models.PartnerOffering.delete(d)));
}

