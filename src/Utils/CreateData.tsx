import { IIdNameAndManager, partnerOfferingType } from "../Types";
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
    "NOT_STARTED",
    "DISCOVERY",
    "EXPERIMENTING",
    "INTEGRATING",
    "BLOCKED_ACCESS",
    "BLOCKED_ISSUE",
    "COMPLETE",
    "GENERAL",
    "DELAYED",
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
    "Unknown",
    "Test authentication",
    ""
];

// create a ProductOffering
export async function createPartnerOffering(
    newPartnerOffering: partnerOfferingType
) {
    // Create a uuid for the PartnerOffering because we are going to include
    // it on the client side. This way everything for PartnerOffering is updated once.
    const partnerOfferingId = crypto.randomUUID();

    // Create all APIs in parallel
    await Promise.all(
        newPartnerOffering.apis.map((i) =>
            CLIENT.models.Api.create({
                docLink: i.docLink,
                trainingLink: i.trainingLink,
                sandboxEnvironment: i.sandboxEnvironment,
                endpoint: i.endpoint,
                partnerOfferingId: partnerOfferingId,
                apiTypeId: i.apiType.id,
                authenticationTypeId: i.authenticationType.id,
                authenticationInfo: i.authenticationInfo
            })
        )
    );

    await CLIENT.models.PartnerOffering.create({
        id: partnerOfferingId,
        offeringName: newPartnerOffering.offeringName,
        contactInfo: newPartnerOffering.contactInfo,
        dashboard: newPartnerOffering.dashboard,
        notes: newPartnerOffering.notes,
        statusId: newPartnerOffering.status.id,
        nwnOfferingId: newPartnerOffering.nwnOffering.id,
        companyId: newPartnerOffering.company.id,
        priorityId: newPartnerOffering.priority.id,
    });
}

// add a partner offering
// TODO: 9879 this is only here so we can create a seed database.  It should be removed later on.
export async function createPartnerOfferingRemove9879(
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
    authenticationInfoList: string[]
) {
    // Create a uuid for the PartnerOffering because we are going to include
    // it on the client side. This way everything for PartnerOffering is updated once.
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
        const authenticationTypeResult = await CLIENT.models.AuthenticationType.list({ filter: { name: { eq: authenticationTypeList[i] } } })
        const authenticationTypeId = authenticationTypeResult.data[0].id;
        await CLIENT.models.Api.create({
            docLink: docLinkList[i],
            trainingLink: trainingLinkList[i],
            sandboxEnvironment: sandboxEnvList[i],
            endpoint: "",
            partnerOfferingId: partnerOfferingId,
            apiTypeId: apiTypeId,
            authenticationTypeId: authenticationTypeId,
            authenticationInfo: authenticationInfoList[i]
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

export async function updatePartnerOffering(
    oldPartnerOffering: partnerOfferingType,
    newPartnerOffering: partnerOfferingType
) {
    // Get the id of the partnerOffering
    const partnerOfferingId = newPartnerOffering.id;

    const oldApis = oldPartnerOffering.apis || [];
    const newApis = newPartnerOffering.apis || [];

    // Create a Set of old API IDs for faster lookup
    const oldApiIds = new Set(oldApis.map(api => api.id));

    // APIs to delete (exist in old but not in new)
    const deleteApis = oldApis.filter(
        element => !newApis.find(x => x.id === element.id)
    );

    // APIs to add (exist in new but not in old)
    const addApis = newApis.filter(
        element => !oldApiIds.has(element.id)
    );

    // APIs to update (exist in both - same ID in old and new)
    const updateApis = newApis.filter(
        element => oldApiIds.has(element.id)
    );

    console.log('Delete APIs:', deleteApis.length, deleteApis.map(a => a.id));
    console.log('Add APIs:', addApis.length, addApis.map(a => a.id));
    console.log('Update APIs:', updateApis.length, updateApis.map(a => a.id));

    // Delete APIs
    if (deleteApis.length > 0) {
        await Promise.all(deleteApis.map((i) => CLIENT.models.Api.delete({ id: i.id })));
    }

    // Add new APIs
    if (addApis.length > 0) {
        await Promise.all(addApis.map((i) => CLIENT.models.Api.create({
            docLink: i.docLink,
            trainingLink: i.trainingLink,
            sandboxEnvironment: i.sandboxEnvironment,
            endpoint: i.endpoint,
            partnerOfferingId: partnerOfferingId,
            apiTypeId: i.apiType.id,
            authenticationTypeId: i.authenticationType.id,
            authenticationInfo: i.authenticationInfo
        })));
    }

    // Update existing APIs - only if they actually changed
    if (updateApis.length > 0) {
        const apisToUpdate = updateApis.filter(newApi => {
            const oldApi = oldApis.find(a => a.id === newApi.id);
            if (!oldApi) return true;

            return oldApi.docLink !== newApi.docLink ||
                oldApi.trainingLink !== newApi.trainingLink ||
                oldApi.sandboxEnvironment !== newApi.sandboxEnvironment ||
                oldApi.endpoint !== newApi.endpoint ||
                oldApi.apiType.id !== newApi.apiType.id ||
                oldApi.authenticationType.id !== newApi.authenticationType.id ||
                oldApi.authenticationInfo !== newApi.authenticationInfo;
        });

        if (apisToUpdate.length > 0) {
            await Promise.all(apisToUpdate.map((i) => CLIENT.models.Api.update({
                id: i.id,
                docLink: i.docLink,
                trainingLink: i.trainingLink,
                sandboxEnvironment: i.sandboxEnvironment,
                endpoint: i.endpoint,
                partnerOfferingId: partnerOfferingId,
                apiTypeId: i.apiType.id,
                authenticationTypeId: i.authenticationType.id,
                authenticationInfo: i.authenticationInfo
            })));
        }
    }

    // Check if PartnerOffering fields have changed
    const partnerOfferingChanged =
        oldPartnerOffering.offeringName !== newPartnerOffering.offeringName ||
        oldPartnerOffering.contactInfo !== newPartnerOffering.contactInfo ||
        oldPartnerOffering.dashboard !== newPartnerOffering.dashboard ||
        oldPartnerOffering.notes !== newPartnerOffering.notes ||
        oldPartnerOffering.status.id !== newPartnerOffering.status.id ||
        oldPartnerOffering.nwnOffering.id !== newPartnerOffering.nwnOffering.id ||
        oldPartnerOffering.company.id !== newPartnerOffering.company.id ||
        oldPartnerOffering.priority.id !== newPartnerOffering.priority.id;

    // Only update the partner offering if something changed
    if (partnerOfferingChanged) {
        await CLIENT.models.PartnerOffering.update({
            id: partnerOfferingId,
            offeringName: newPartnerOffering.offeringName,
            contactInfo: newPartnerOffering.contactInfo,
            dashboard: newPartnerOffering.dashboard,
            notes: newPartnerOffering.notes,
            statusId: newPartnerOffering.status.id,
            nwnOfferingId: newPartnerOffering.nwnOffering.id,
            companyId: newPartnerOffering.company.id,
            priorityId: newPartnerOffering.priority.id,
        });
    }
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

type EntityType =
    | 'Company'
    | 'Priority'
    | 'ConnectionStatus'
    | 'Manager'
    | 'ApiType'
    | 'AuthenticationType'
    | 'NwnOffering';

interface BaseEntity {
    id: string;
    name: string;
}

export async function updateAllEntities<T extends BaseEntity>(
    entityType: EntityType,
    oldEntities: T[],
    newEntities: T[]
) {
    // Get all existing entities (don't touch any of the empties)
    const existingEntities = oldEntities.filter(x => x.name !== "");

    // Find entities to delete (exist in DB but not in newEntities)
    const entitiesToDelete = existingEntities.filter(
        existing => !newEntities.find(newEntity => newEntity.id === existing.id)
    );

    // Find entities to add (in newEntities but not in existingEntities)
    // Don't try to add the empties
    const entitiesToAdd = newEntities.filter(
        newEntity => !existingEntities.find(existing => existing.id === newEntity.id) && newEntity.name !== ""
    );

    // Find entities to update (exist in both and have changes)
    const entitiesToUpdate = newEntities.filter(
        newEntity => {
            const existing = existingEntities.find(e => e.id === newEntity.id);
            if (!existing)
                return false;

            // Check if name has changed
            if (existing.name !== newEntity.name)
                return true;

            // If NWNOfferings, also check if manager has changed
            if (entityType === 'NwnOffering') {
                const existingWithManager = existing as unknown as IIdNameAndManager;
                const newWithManager = newEntity as unknown as IIdNameAndManager;
                return existingWithManager.manager.id !== newWithManager.manager.id;
            }

            return false;
        }
    );

    // Delete
    for (const entity of entitiesToDelete) {
        switch (entityType) {
            case 'Company':
                await CLIENT.models.Company.delete({ id: entity.id });
                break;
            case 'Priority':
                await CLIENT.models.Priority.delete({ id: entity.id });
                break;
            case 'ConnectionStatus':
                await CLIENT.models.ConnectionStatus.delete({ id: entity.id });
                break;
            case 'Manager':
                await CLIENT.models.Manager.delete({ id: entity.id });
                break;
            case 'ApiType':
                await CLIENT.models.ApiType.delete({ id: entity.id });
                break;
            case 'AuthenticationType':
                await CLIENT.models.AuthenticationType.delete({ id: entity.id });
                break;
            case 'NwnOffering':
                await CLIENT.models.NwnOffering.delete({ id: entity.id });
                break;
        }
    }

    // Add
    for (const entity of entitiesToAdd) {
        switch (entityType) {
            case 'Company':
                await CLIENT.models.Company.create({ name: entity.name });
                break;
            case 'Priority':
                await CLIENT.models.Priority.create({ name: entity.name });
                break;
            case 'ConnectionStatus':
                await CLIENT.models.ConnectionStatus.create({ name: entity.name });
                break;
            case 'Manager':
                await CLIENT.models.Manager.create({ name: entity.name });
                break;
            case 'ApiType':
                await CLIENT.models.ApiType.create({ name: entity.name });
                break;
            case 'AuthenticationType':
                await CLIENT.models.AuthenticationType.create({ name: entity.name });
                break;
            case 'NwnOffering':
                {
                    const nwnOfferingToAdd = entity as unknown as IIdNameAndManager;
                    await CLIENT.models.NwnOffering.create({
                        name: nwnOfferingToAdd.name,
                        managerId: nwnOfferingToAdd.manager.id
                    });
                    break;
                }
        }
    }

    // Update
    // TODO: 9879 we are updating entries that are not changed.  May need to filter those out.
    for (const entity of entitiesToUpdate) {
        switch (entityType) {
            case 'Company':
                await CLIENT.models.Company.update({ id: entity.id, name: entity.name });
                break;
            case 'Priority':
                await CLIENT.models.Priority.update({ id: entity.id, name: entity.name });
                break;
            case 'ConnectionStatus':
                await CLIENT.models.ConnectionStatus.update({ id: entity.id, name: entity.name });
                break;
            case 'Manager':
                await CLIENT.models.Manager.update({ id: entity.id, name: entity.name });
                break;
            case 'ApiType':
                await CLIENT.models.ApiType.update({ id: entity.id, name: entity.name });
                break;
            case 'AuthenticationType':
                await CLIENT.models.AuthenticationType.update({ id: entity.id, name: entity.name });
                break;
            case 'NwnOffering':
                {
                    const nwnOfferingToUpdate = entity as unknown as IIdNameAndManager;
                    await CLIENT.models.NwnOffering.update({
                        id: nwnOfferingToUpdate.id,
                        name: nwnOfferingToUpdate.name,
                        managerId: nwnOfferingToUpdate.manager.id
                    });
                    break;
                }
        }
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
    createPartnerOfferingRemove9879(
        "",
        "",
        "https://nwn-demo.command.verkada.com",
        "To request Access please reach out to Org Admin to send invitation (dsalins@nwn.ai)",
        "COMPLETE",
        "Customer Experience",
        "Genysis",
        "LOW",
        ["REST"],
        ["https://all.docs.genesys.com/Developer/APIbyService"],
        ["https://beyond.genesys.com/explore/"],
        ['{"Environment":"Sandbox"{'],
        ["Unknown"],
        [""]);
    createPartnerOfferingRemove9879(
        "",
        "Brian Norton <brian.norton@five9.com>",
        " https://login.five9.com/and; https://admin.us.five9.net/.",
        "",
        "GENERAL",
        "Customer Experience",
        "Five9's",
        "HIGH",
        ["REST"],
        ["https://documentation.five9.com/category/dev"],
        ["https://www.five9.com/contact-center-services/training"],
        ['{"Client ID": "122g33Y5tsTYjrGQpHVlCdUMjNxIsWfD",'],
        ["Unknown"],
        [""]);
    createPartnerOfferingRemove9879(
        "",
        "",
        "https://nwn.okta.com/app/UserHome",
        "OKTA",
        "COMPLETE",
        "Visual Collaboration",
        "Verkada",
        "LOW",
        ["REST (OKTA)"],
        ["https://nwn-demo.command.verkada.com/admin/settings/api-integrations"],
        [""],
        [""],
        ["Unknown"],
        [""]);
    createPartnerOfferingRemove9879(
        "",
        "Pragti Aggarwal <pragti@apexaiq.com>; Engineering support: lokesh@apexaiq.com",
        "https://nwn.okta.com/app/UserHome",
        "",
        "COMPLETE",
        "",
        "ApexaiQ",
        "LOW",
        ["REST"],
        ["https://app.apexaiq.com/docs"],
        ["https://www.apexaiq.com/resources/"],
        [""],
        ["Unknown"],
        [""]);
    createPartnerOfferingRemove9879(
        "AWS",
        "",
        "",
        "",
        "COMPLETE",
        "Intelligent Cloud",
        "Amazon",
        "LOW",
        ["REST", "MCP"],
        ["https://docs.aws.amazon.com/", "https://github.com/awslabs/mcp"],
        ["https://www.aws.training/", "https://github.com/awslabs/mcp"],
        ["", "https://github.com/awslabs/mcp"],
        ["Unknown", "Unknown"],
        ["", ""]);
    createPartnerOfferingRemove9879(
        "Azure",
        "",
        "",
        "",
        "COMPLETE",
        "Intelligent Cloud",
        "Microsoft",
        "LOW",
        ["MCP", "GRAPHQL", "REST"],
        ["https://github.com/Azure/azure-mcp", "", "https://learn.microsoft.com/en-us/rest/api/azure/"],
        ["https://github.com/Azure/azure-mcp", "", "https://learn.microsoft.com/en-us/training/azure/"],
        ["https://github.com/Azure/azure-mcp", "", ""],
        ["Unknown", "Unknown", "Unknown"],
        ["", "", ""]);
    createPartnerOfferingRemove9879(
        "",
        "Prakash Birdja <pbirdja@nectarcorp.com>",
        "https://us.nectar.services/dapi/doc",
        "via OKTA card.",
        "INTEGRATING",
        "Visual Collaboration",
        "Nectar",
        "HIGH",
        ["REST (OKTA)"],
        ["https://portal.nectar.software/docs"],
        ["https://support.nectarcorp.com/docs/training"],
        [""],
        ["Unknown"],
        [""]);
    createPartnerOfferingRemove9879(
        "Connect",
        "Vu Le <vumle@amazon.com>",
        "https://console.aws.amazon.com/",
        "",
        "INTEGRATING",
        "Customer Experience",
        "Amazon",
        "HIGH",
        ["SDK"],
        ["https://docs.aws.amazon.com/connect/latest/APIReference/connect-service-api.html"],
        ["https://aws.amazon.com/blogs/training-and-certification/category/contact-center/amazon-connect/"],
        [""],
        ["Unknown"],
        [""]);
    createPartnerOfferingRemove9879(
        "Intune",
        "",
        "",
        "",
        "INTEGRATING",
        "Managed Devices",
        "Microsoft",
        "HIGH",
        ["MCP"],
        ["https://learn.microsoft.com/en-us/purview/developer/"],
        ["https://learn.microsoft.com/en-us/training/purview/"],
        [""],
        ["Unknown"],
        [""]);
    createPartnerOfferingRemove9879(
        "Teams",
        "",
        "",
        "",
        "INTEGRATING",
        "Intelligent Workspace (edge)",
        "Microsoft",
        "HIGH",
        ["MCP"],
        ["https://learn.microsoft.com/en-us/graph/api/resources/teams-api-overview?view=graph-rest-1.0"],
        ["https://learn.microsoft.com/en-us/training/modules/microsoft-intune/"],
        [""],
        ["Unknown"],
        [""]);
    createPartnerOfferingRemove9879(
        "MIST",
        "",
        "",
        "",
        "INTEGRATING",
        "Intelligent Connectivity",
        "Juniper",
        "HIGH",
        ["REST"],
        ["https://www.juniper.net/documentation/us/en/software/mist/automation-integration/topics/concept/restful-api-overview.html"],
        ["https://learningportal.juniper.net/juniper/user_activity_info.aspx?id=11584"],
        [""],
        ["Unknown"],
        [""]);
    createPartnerOfferingRemove9879(
        "DNA Center",
        "",
        "",
        "",
        "INTEGRATING",
        "Intelligent Connectivity",
        "CISCO",
        "HIGH",
        ["REST"],
        ["https://developer.cisco.com/docs/dna-center/overview/"],
        ["https://learningnetwork.cisco.com/s/cisco-dna-center-training-videos"],
        [""],
        ["Unknown"],
        [""]);
    createPartnerOfferingRemove9879(
        "1000 eyes",
        "",
        "",
        "",
        "INTEGRATING",
        "Intelligent Connectivity",
        "CISCO",
        "HIGH",
        ["REST"],
        [""],
        [""],
        [""],
        ["Unknown"],
        [""]);
    createPartnerOfferingRemove9879(
        "Cat Center",
        "",
        "",
        "",
        "INTEGRATING",
        "Intelligent Connectivity",
        "CISCO",
        "HIGH",
        ["REST"],
        [""],
        [""],
        [""],
        ["Unknown"],
        [""]);
    createPartnerOfferingRemove9879(
        "Meraki",
        "",
        "",
        "",
        "INTEGRATING",
        "Intelligent Connectivity",
        "CISCO",
        "HIGH",
        ["REST"],
        [""],
        [""],
        [""],
        ["Unknown"],
        [""]);
    createPartnerOfferingRemove9879(
        "AIOps",
        "",
        "",
        "",
        "INTEGRATING",
        "Intelligent Connectivity",
        "CISCO",
        "HIGH",
        [],
        [],
        [],
        [],
        [],
        []);
    createPartnerOfferingRemove9879(
        "Aruba Central",
        "",
        "",
        "",
        "DISCOVERY",
        "Intelligent Connectivity",
        "HPE",
        "MEDIUM",
        ["REST"],
        ["https://developer.arubanetworks.com/central/docs/api-gateway, https://developer.greenlake.hpe.com/docs/greenlake/services"],
        ["https://sthpe-education.insite-la.com/us/en/training/portfolio/aruba.html; https://education.hpe.com/ww/en/training/portfolio/greenlake.html"],
        [""],
        ["Unknown"],
        [""]);
    createPartnerOfferingRemove9879(
        "Workspace Analytics",
        "",
        "",
        "",
        "DISCOVERY",
        "Managed Devices",
        "HPE",
        "MEDIUM",
        ["REST"],
        ["https://developers.hp.com/hp-proactive-insights/api/hp-workforce-solutions-analytics-api"],
        ["https://education.hpe.com/ww/en/training/index.html"],
        [""],
        ["Unknown"],
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
    const allPriroities = await CLIENT.models.Priority.list();
    await Promise.all(allPriroities.data.map((d) => CLIENT.models.Priority.delete(d)));

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