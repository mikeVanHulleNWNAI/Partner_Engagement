import { memo, useEffect, useState } from "react";
import { createInitialDataSettings, createPartnerOffering, deleteAll, deletePartnerOffering } from "./Utils/CreateData"
import { CLIENT } from "./Utils/Constants";
import ItemGrid from "./ItemGrid";
import Sidebar from "./Sidebar";
import ApiList from "./ApiList";
import EditPartnerOfferingForm from "./EditPartnerOfferingForm";
import PartnerOfferingTile from "./PartnerOfferingTile";
import { partnerOfferingType } from "./Types";

// the memo may make redrawing more efficent
const PartnerOfferingTileMemo = memo<{
  partnerOffering: partnerOfferingType
  isHighlighted?: boolean
  onClick: () => void
}>
  (
    ({
      partnerOffering,
      isHighlighted,
      onClick,
    }) => (
      <PartnerOfferingTile
        key={partnerOffering.id}
        partnerOffering={partnerOffering}
        isHighlighted={isHighlighted}
        onClick={onClick}
      />
    )
  );

function UserInterface() {
  const [partnerOfferings, setPartnerOfferings] = useState<partnerOfferingType[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activePartnerOffering, setActivePartnerOffering] = useState<partnerOfferingType>();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedManager, setSelectedManager] = useState<string | null>("");
  const [selectedNwnOffering, setSelectedNwnOffering] = useState<string | null>("");
  const [selectedApiType, setSelectedApiType] = useState<string | null>("");
  const [managers, setManagers] = useState<Array<{ id: string; name: string }>>([]);
  const [nwnOfferings, setNwnOfferings] = useState<Array<{ id: string; name: string }>>([]);
  const [apiTypes, setApiTypes] = useState<Array<{ id: string; name: string }>>([]);

  useEffect(() => {
    const partnerOfferingSubscription = CLIENT.models.PartnerOffering.observeQuery(
      {
        selectionSet: [
          'id',
          'offeringName',
          'contactInfo',
          'dashboard',
          'notes',
          'status.name',
          'nwnOffering.name',
          'nwnOffering.manager.name',
          'company.name',
          'priority.name',
          'apis.id',
          'apis.docLink',
          'apis.trainingLink',
          'apis.sandboxEnvironment',
          'apis.endpoint',
          'apis.apiType.name',
          'apis.authenticationType.name',
          'apis.authenticationInfo',
        ]
      }
    ).subscribe({
      next: async (data) => {
        // Check if any items have null status
        const hasNullStatus = data.items.some(item => item.status === null);

        if (hasNullStatus) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // This code fixes https://github.com/aws-amplify/amplify-js/issues/13267 .
        // Which is considered a bug.  When a new record is inserted into GraphQL,
        // the item returned to the observable does not have any of its nested items
        // populated.  This code finds items that have item.status as null.  It
        // looks in the GraphQL database and replaces those items with good ones.
        const partnerOfferingMap = (await Promise.all(
          data.items.map(async (item) => {
            if (item.status === null) {
              const refetchedItem = await CLIENT.models.PartnerOffering.get(
                { id: item.id },
                {
                  selectionSet: [
                    'id',
                    'offeringName',
                    'contactInfo',
                    'dashboard',
                    'notes',
                    'status.name',
                    'nwnOffering.name',
                    'nwnOffering.manager.name',
                    'company.name',
                    'priority.name',
                    'apis.id',
                    'apis.docLink',
                    'apis.trainingLink',
                    'apis.sandboxEnvironment',
                    'apis.endpoint',
                    'apis.apiType.name',
                    'apis.authenticationType.name',
                    'apis.authenticationInfo',
                  ]
                }
              );
              return refetchedItem.data;
            }
            return item;
          })
        ))
          .filter((item): item is partnerOfferingType => item !== null && item !== undefined)
          .filter((item) => {
            const matchesManager = !selectedManager || item.nwnOffering.manager?.name === selectedManager;
            const matchesNwnOffering = !selectedNwnOffering || item.nwnOffering?.name === selectedNwnOffering;
            const matchesApiType = !selectedApiType || item.apis?.some(api => api.apiType?.name === selectedApiType);
            return matchesManager && matchesNwnOffering && matchesApiType;
          })
          .sort((a, b) => {
            // Sort by nwnOffering.name first
            const nwnOfferingA = a.nwnOffering?.name?.toLowerCase() || '';
            const nwnOfferingB = b.nwnOffering?.name?.toLowerCase() || '';
            if (nwnOfferingA !== nwnOfferingB) {
              return nwnOfferingA.localeCompare(nwnOfferingB);
            }

            // Then by company.name
            const companyA = a.company?.name?.toLowerCase() || '';
            const companyB = b.company?.name?.toLowerCase() || '';
            if (companyA !== companyB) {
              return companyA.localeCompare(companyB);
            }

            // Finally by offeringName
            const offeringA = a.offeringName?.toLowerCase() || '';
            const offeringB = b.offeringName?.toLowerCase() || '';
            return offeringA.localeCompare(offeringB);
          });

        setPartnerOfferings(partnerOfferingMap);
      }
    })

    return () => {
      partnerOfferingSubscription.unsubscribe();
    }
  }, [selectedManager, selectedNwnOffering, selectedApiType]);

  useEffect(() => {
    const managerSubscription = CLIENT.models.Manager.observeQuery({
      selectionSet: ['id', 'name']
    }).subscribe({
      next: (data) => {
        const managers = data.items
          .filter((item): item is { id: string; name: string } => item !== null && item !== undefined && item.name !== "")
          .sort((a, b) => a.name.localeCompare(b.name));
        setManagers(managers);
      }
    });

    return () => {
      managerSubscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const nwnOfferingSubscription = CLIENT.models.NwnOffering.observeQuery({
      selectionSet: ['id', 'name']
    }).subscribe({
      next: (data) => {
        const offerings = data.items
          .filter((item): item is { id: string; name: string } => item !== null && item !== undefined && item.name !== "")
          .sort((a, b) => a.name.localeCompare(b.name));
        setNwnOfferings(offerings);
      }
    });

    return () => {
      nwnOfferingSubscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const apiTypeSubscription = CLIENT.models.ApiType.observeQuery({
      selectionSet: ['id', 'name']
    }).subscribe({
      next: (data) => {
        const types = data.items
          .filter((item): item is { id: string; name: string } => item !== null && item !== undefined && item.name !== "")
          .sort((a, b) => a.name.localeCompare(b.name));
        setApiTypes(types);
      }
    });

    return () => {
      apiTypeSubscription.unsubscribe();
    };
  }, []);

  const deleteTemps = async () => {
    const test = partnerOfferings.filter((value) => value.company.name === "ApexaiQ");
    test.forEach(async (value) => await deletePartnerOffering(value.id));
    await createPartnerOffering(
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
  }

  const activateSidebar = (
    productOffering: partnerOfferingType,
  ) => {
    setActivePartnerOffering(productOffering);
    setIsOpen(true);
  }

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleSubmitForm = (data: { name: string; email: string }) => {
    console.log('Form submitted with data:', data);
    // Perform actions with the submitted data, e.g., send to an API
  };

  return (
    <main>
      <div className="mb-4 flex gap-4">
        <div>
          <label htmlFor="manager-select" className="mr-2 font-semibold">
            Manager:
          </label>
          <select
            id="manager-select"
            value={selectedManager || ''}
            onChange={(e) => setSelectedManager(e.target.value || null)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Managers</option>
            {managers.map((manager) => (
              <option key={manager.id} value={manager.name}>
                {manager.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="nwnOffering-select" className="mr-2 font-semibold">
            NWN Offering:
          </label>
          <select
            id="nwnOffering-select"
            value={selectedNwnOffering || ''}
            onChange={(e) => setSelectedNwnOffering(e.target.value || null)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Offerings</option>
            {nwnOfferings.map((offering) => (
              <option key={offering.id} value={offering.name}>
                {offering.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="apiType-select" className="mr-2 font-semibold">
            API Type:
          </label>
          <select
            id="apiType-select"
            value={selectedApiType || ''}
            onChange={(e) => setSelectedApiType(e.target.value || null)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            {apiTypes.map((type) => (
              <option key={type.id} value={type.name}>
                {type.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <button hidden className="select-none" onClick={async () => {
        await deleteAll();
        await createInitialDataSettings();
      }}>Delete and Restore</button>
      <button hidden className="select-none" onClick={async () => {
        await deleteTemps();
      }}>Delete temps</button>
      <Sidebar
        isOpen={isOpen}
        onClose={() => {
          setActivePartnerOffering(undefined);
          setIsOpen(false)
        }}>
        <div className="p-6 mt-14">
          {activePartnerOffering ? (
            <div>
              <button hidden onClick={async () => {
                await createPartnerOffering(
                  "Test 1234",
                  "Pragti Aggarwal <pragti@apexaiq.com>; Engineering support: lokesh@apexaiq.com",
                  "https://nwn.okta.com/app/UserHome",
                  "",
                  "Connected",
                  "",
                  "ApexaiQ",
                  "LOW",
                  ["REST"],
                  [""],
                  [""],
                  [""],
                  [""],
                  [""]
                );
              }}>New Partner Offering</button>
              <button hidden className="select-none" onClick={handleOpenPopup}>
                Test Form
              </button>
              <EditPartnerOfferingForm
                open={isPopupOpen}
                onClose={handleClosePopup}
                onSubmit={handleSubmitForm}
              />
              <div>
                <ul>
                  <li>
                    <PartnerOfferingTile
                      partnerOffering={activePartnerOffering}
                    />
                    <div><strong>Manager: </strong>{activePartnerOffering.nwnOffering?.manager?.name}</div>
                    <div><strong>ContactInfo: </strong>{activePartnerOffering.contactInfo}</div>
                    <div><strong>Dashboard: </strong>{activePartnerOffering.dashboard}</div>
                    <div><strong>Notes: </strong>{activePartnerOffering.notes}</div>
                    <div><strong>Status: </strong>{activePartnerOffering.status.name}</div>
                    <div><strong>NWN Offering: </strong>{activePartnerOffering.nwnOffering?.name}</div>
                    <div><strong>Company: </strong>{activePartnerOffering.company?.name}</div>
                    <div><strong>Priority: </strong>{activePartnerOffering.priority?.name}</div>
                    <ApiList
                      partnerOffering={activePartnerOffering}
                    />
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            "Non selected"
          )}
        </div>
      </Sidebar>
      <ItemGrid>
        {partnerOfferings.map((partnerOffering) => (
          <PartnerOfferingTileMemo
            key={partnerOffering.id}
            partnerOffering={partnerOffering}
            isHighlighted={activePartnerOffering?.id === partnerOffering.id}
            onClick={() => activateSidebar(partnerOffering)}
          />
        ))}
      </ItemGrid>
    </main>
  );
}

export default UserInterface;
