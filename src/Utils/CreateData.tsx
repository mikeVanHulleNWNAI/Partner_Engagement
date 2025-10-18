import { CLIENT } from "./Constants";

const managers = [
    "Kevin Basden",
    "Brian Fichter",
    "Austin Rose",
    "Mike Patton",
    "Alvaro Rivera",
    "Chris Poe",
    "Mike Patton",
    "Alec Saffrin",
    ""
];

const connectionStatus = [
    "Connected",
    "In Process",
    "Meeting Scheduled",
    "Upcoming",
    ""
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
    "Zenoss Cloud",
    ""
];

const priorities = [
    "LOW",
    "MEDIUM",
    "HIGH",
    ""
];

const apiTypes = [
    "REST",
    "REST (OKTA)",
    "MCP",
    "GRAPHQL",
    "SDK",
    "REST & SOAP",
    "REST & GRAPH",
    ""
];

const authenticationType = [
    "Test authentication",
    ""
];

// add a ProductOffering
export async function createPartnerOffering(
    offeringName: string,
    contactInfo: string,
    dashboard: string,
    notes: string,
    status: string,
    nwnOffering: string,
    company: string,
    priority: string,
    apiList: string[],
    docLinkList: string[],
    trainingLinkList: string[],
    sandboxEnvList: string[],
    authenticationTypeList: string[],
    authenticationTypeInfoList: string[]
) {

    // Create a uuid for the PartnerOffering because we are going to include
    // in on the client side.  This way everything for PartnerOffering is updated once.
    const partnerOfferingId = crypto.randomUUID();

    const statusResult = await CLIENT.models.ConnectionStatus.list({ filter: { name: { eq: status } } })
    const statusId = statusResult.data[0].id;

    const nwnOfferingResult = await CLIENT.models.NwnOffering.list({ filter: { name: { eq: nwnOffering } } })
    const nwnOfferingId = nwnOfferingResult.data?.[0]?.id;

    const companyResult = await CLIENT.models.Company.list({ filter: { name: { eq: company } } })
    const companyId = companyResult.data[0].id;

    const priorityResult = await CLIENT.models.Priority.list({ filter: { name: { eq: priority } } })
    const priorityId = priorityResult.data[0].id;

    for (let i = 0; i < apiList.length; i++) {
        const apiTypeResult = await CLIENT.models.ApiType.list({ filter: { name: { eq: apiList[i] } } })
        const apiTypeId = apiTypeResult.data[0].id;
        const authenticationTypeResult = await CLIENT.models.ApiType.list({ filter: { name: { eq: authenticationTypeList[i] } } })
        const authenticationTypeId = authenticationTypeResult.data[0].id;
        await CLIENT.models.Api.create({
            docLink: docLinkList[i],
            trainingLink: trainingLinkList[i],
            sandboxEnvironment: sandboxEnvList[i],
            endpoint: "",
            partnerOfferingId: partnerOfferingId,
            apiTypeId: apiTypeId,
            authenticationTypeId: authenticationTypeId,
            authenticationInfo: authenticationTypeInfoList[i]
        })
    }

    await CLIENT.models.PartnerOffering.create({
        id: partnerOfferingId,
        offeringName: offeringName,
        contactInfo: contactInfo,
        dashboard: dashboard,
        notes: notes,
        statusId: statusId,
        nwnOfferingId: nwnOfferingId,
        companyId: companyId,
        priorityId: priorityId,
    });
}

export async function deletePartnerOffering(id: string) {
    try {
        // First, get the partner offering with its APIs
        const partnerOfferingToDelete = await CLIENT.models.PartnerOffering.get(
            { id: id },
            {
                selectionSet: ['id', 'apis.id']
            }
        );

        // Delete all associated APIs first
        if (partnerOfferingToDelete?.data?.apis) {
            // Call apis as a function to get the actual array
            const apisResult = partnerOfferingToDelete.data.apis;
            
            if (apisResult && apisResult.length > 0) {
                await Promise.all(
                    apisResult.map(api =>
                        CLIENT.models.Api.delete({ id: api.id })
                    )
                );
            }
        }

        // Then delete the partner offering
        await CLIENT.models.PartnerOffering.delete({ id });

    } catch (error) {
        console.error('Error deleting partner offering:', error);
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
            filter: { name: { eq: "Kevin Basden" } }
        })).data[0].id
    })
    await CLIENT.models.NwnOffering.create({
        name: "Visual Collaboration",
        managerId: (await CLIENT.models.Manager.list({
            filter: { name: { eq: "Brian Fichter" } }
        })).data[0].id
    })
    await CLIENT.models.NwnOffering.create({
        name: "Intelligent Cloud",
        managerId: (await CLIENT.models.Manager.list({
            filter: { name: { eq: "Austin Rose" } }
        })).data[0].id
    })
    await CLIENT.models.NwnOffering.create({
        name: "Managed Devices",
        managerId: (await CLIENT.models.Manager.list({
            filter: { name: { eq: "Mike Patton" } }
        })).data[0].id
    })
    await CLIENT.models.NwnOffering.create({
        name: "Intelligent Workspace (edge)",
        managerId: (await CLIENT.models.Manager.list({
            filter: { name: { eq: "Alvaro Rivera" } }
        })).data[0].id
    })
    await CLIENT.models.NwnOffering.create({
        name: "Intelligent Connectivity",
        managerId: (await CLIENT.models.Manager.list({
            filter: { name: { eq: "Chris Poe" } }
        })).data[0].id
    })
    await CLIENT.models.NwnOffering.create({
        name: "Cyber Security",
        managerId: (await CLIENT.models.Manager.list({
            filter: { name: { eq: "Alec Saffrin" } }
        })).data[0].id
    })
    await CLIENT.models.NwnOffering.create({
        name: "",
        managerId: (await CLIENT.models.Manager.list({
            filter: { name: { eq: "" } }
        })).data[0].id
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

    // AuthenticationType
    for (const name of authenticationType)
        await CLIENT.models.AuthenticationType.create({ name });

    createAllPartnerOfferings();
}

async function createAllPartnerOfferings() {
    createPartnerOffering(
        "",
        "",
        "https://nwn-demo.command.verkada.com",
        "To request Access please reach out to Org Admin to send invitation (dsalins@nwn.ai)",
        "Connected",
        "Customer Experience",
        "Genysis",
        "LOW",
        ["REST"],
        ["https://all.docs.genesys.com/Developer/APIbyService"],
        ["https://beyond.genesys.com/explore/"],
        ['{"Environment":"Sandbox"{'],
        [""],
        [""]);
    createPartnerOffering(
        "",
        "Brian Norton <brian.norton@five9.com>",
        " https://login.five9.com/and; https://admin.us.five9.net/.",
        "",
        "In Process",
        "Customer Experience",
        "Five9's",
        "HIGH",
        ["REST"],
        ["https://documentation.five9.com/category/dev"],
        ["https://www.five9.com/contact-center-services/training"],
        ['{"Client ID": "122g33Y5tsTYjrGQpHVlCdUMjNxIsWfD",'],
        [""],
        [""]);
    createPartnerOffering(
        "",
        "",
        "https://nwn.okta.com/app/UserHome",
        "OKTA",
        "Connected",
        "Visual Collaboration",
        "Verkada",
        "LOW",
        ["REST (OKTA)"],
        ["https://nwn-demo.command.verkada.com/admin/settings/api-integrations"],
        [""],
        [""],
        [""],
        [""]);
    createPartnerOffering(
        "",
        "Pragti Aggarwal <pragti@apexaiq.com>; Engineering support: lokesh@apexaiq.com",
        "https://nwn.okta.com/app/UserHome",
        "",
        "Connected",
        "",
        "ApexaiQ",
        "LOW",
        ["REST"],
        ["https://app.apexaiq.com/docs"],
        ["https://www.apexaiq.com/resources/"],
        [""],
        [""],
        [""]);
    createPartnerOffering(
        "AWS",
        "",
        "",
        "",
        "Connected",
        "Intelligent Cloud",
        "Amazon",
        "LOW",
        ["REST", "MCP"],
        ["https://docs.aws.amazon.com/", "https://github.com/awslabs/mcp"],
        ["https://www.aws.training/", "https://github.com/awslabs/mcp"],
        ["", "https://github.com/awslabs/mcp"],
        ["", ""],
        ["", ""]);
    createPartnerOffering(
        "Azure",
        "",
        "",
        "",
        "Connected",
        "Intelligent Cloud",
        "Microsoft",
        "LOW",
        ["MCP", "GRAPHQL", "REST"],
        ["https://github.com/Azure/azure-mcp", "", "https://learn.microsoft.com/en-us/rest/api/azure/"],
        ["https://github.com/Azure/azure-mcp", "", "https://learn.microsoft.com/en-us/training/azure/"],
        ["https://github.com/Azure/azure-mcp", "", ""],
        ["", "", ""],
        ["", "", ""]);
    createPartnerOffering(
        "",
        "Prakash Birdja <pbirdja@nectarcorp.com>",
        "https://us.nectar.services/dapi/doc",
        "via OKTA card.",
        "In Process",
        "Visual Collaboration",
        "Nectar",
        "HIGH",
        ["REST (OKTA)"],
        ["https://portal.nectar.software/docs"],
        ["https://support.nectarcorp.com/docs/training"],
        [""],
        [""],
        [""]);
    createPartnerOffering(
        "Connect",
        "Vu Le <vumle@amazon.com>",
        "https://console.aws.amazon.com/",
        "",
        "In Process",
        "Customer Experience",
        "Amazon",
        "HIGH",
        ["SDK"],
        ["https://docs.aws.amazon.com/connect/latest/APIReference/connect-service-api.html"],
        ["https://aws.amazon.com/blogs/training-and-certification/category/contact-center/amazon-connect/"],
        [""],
        [""],
        [""]);
    createPartnerOffering(
        "Intune",
        "",
        "",
        "",
        "In Process",
        "Managed Devices",
        "Microsoft",
        "HIGH",
        ["MCP"],
        ["https://learn.microsoft.com/en-us/purview/developer/"],
        ["https://learn.microsoft.com/en-us/training/purview/"],
        [""],
        [""],
        [""]);
    createPartnerOffering(
        "Teams",
        "",
        "",
        "",
        "In Process",
        "Intelligent Workspace (edge)",
        "Microsoft",
        "HIGH",
        ["MCP"],
        ["https://learn.microsoft.com/en-us/graph/api/resources/teams-api-overview?view=graph-rest-1.0"],
        ["https://learn.microsoft.com/en-us/training/modules/microsoft-intune/"],
        [""],
        [""],
        [""]);
    createPartnerOffering(
        "MIST",
        "",
        "",
        "",
        "In Process",
        "Intelligent Connectivity",
        "Juniper",
        "HIGH",
        ["REST"],
        ["https://www.juniper.net/documentation/us/en/software/mist/automation-integration/topics/concept/restful-api-overview.html"],
        ["https://learningportal.juniper.net/juniper/user_activity_info.aspx?id=11584"],
        [""],
        [""],
        [""]);
    createPartnerOffering(
        "DNA Center",
        "",
        "",
        "",
        "In Process",
        "Intelligent Connectivity",
        "CISCO",
        "HIGH",
        ["REST"],
        ["https://developer.cisco.com/docs/dna-center/overview/"],
        ["https://learningnetwork.cisco.com/s/cisco-dna-center-training-videos"],
        [""],
        [""],
        [""]);
    createPartnerOffering(
        "1000 eyes",
        "",
        "",
        "",
        "In Process",
        "Intelligent Connectivity",
        "CISCO",
        "HIGH",
        ["REST"],
        [""],
        [""],
        [""],
        [""],
        [""]);
    createPartnerOffering(
        "Cat Center",
        "",
        "",
        "",
        "In Process",
        "Intelligent Connectivity",
        "CISCO",
        "HIGH",
        ["REST"],
        [""],
        [""],
        [""],
        [""],
        [""]);
    createPartnerOffering(
        "Meraki",
        "",
        "",
        "",
        "In Process",
        "Intelligent Connectivity",
        "CISCO",
        "HIGH",
        ["REST"],
        [""],
        [""],
        [""],
        [""],
        [""]);
    createPartnerOffering(
        "AIOps",
        "",
        "",
        "",
        "In Process",
        "Intelligent Connectivity",
        "CISCO",
        "HIGH",
        [],
        [],
        [],
        [],
        [],
        []);
    createPartnerOffering(
        "Aruba Central",
        "",
        "",
        "",
        "Meeting Scheduled",
        "Intelligent Connectivity",
        "HPE",
        "MEDIUM",
        ["REST"],
        ["https://developer.arubanetworks.com/central/docs/api-gateway, https://developer.greenlake.hpe.com/docs/greenlake/services"],
        ["https://sthpe-education.insite-la.com/us/en/training/portfolio/aruba.html; https://education.hpe.com/ww/en/training/portfolio/greenlake.html"],
        [""],
        [""],
        [""]);
    createPartnerOffering(
        "Workspace Analytics",
        "",
        "",
        "",
        "Meeting Scheduled",
        "Managed Devices",
        "HPE",
        "MEDIUM",
        ["REST"],
        ["https://developers.hp.com/hp-proactive-insights/api/hp-workforce-solutions-analytics-api"],
        ["https://education.hpe.com/ww/en/training/index.html"],
        [""],
        [""],
        [""]);
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

    // AuthenticationType
    const allAuthenticationTypes = await CLIENT.models.AuthenticationType.list();
    await Promise.all(allAuthenticationTypes.data.map((d) => CLIENT.models.AuthenticationType.delete(d)));

    // PartnerOfferings
    const allPartnerOfferings = await CLIENT.models.PartnerOffering.list();
    await Promise.all(allPartnerOfferings.data.map((d) => CLIENT.models.PartnerOffering.delete(d)));
}

