import { memo, useEffect, useState, useCallback, useMemo } from "react";
import { createInitialDataSettings, createPartnerOffering, deleteAll, deletePartnerOffering } from "./Utils/CreateData"
import { CLIENT } from "./Utils/Constants";
import ItemGrid from "./ItemGrid";
import Sidebar from "./Sidebar";
import ApiList from "./ApiList";
import EditPartnerOfferingForm from "./EditPartnerOfferingForm";
import PartnerOfferingTile from "./PartnerOfferingTile";
import NavBar from "./NavBar";
import { partnerOfferingType } from "./Types";
import { RenderLinkOrText } from "./RenderLinkOrText";

// Memoized tile component for better performance
const PartnerOfferingTileMemo = memo<{
  partnerOffering: partnerOfferingType
  isHighlighted?: boolean
  onClick: () => void
}>(
  ({ partnerOffering, isHighlighted, onClick }) => (
    <PartnerOfferingTile
      key={partnerOffering.id}
      partnerOffering={partnerOffering}
      isHighlighted={isHighlighted}
      onClick={onClick}
    />
  )
);

function UserInterface() {
  // NavBar height can not be less then 16
  const navBarHeight: number = 16;

  // Data state
  const [allPartnerOfferings, setAllPartnerOfferings] = useState<partnerOfferingType[]>([]);
  const [managers, setManagers] = useState<Array<{ id: string; name: string }>>([]);
  const [nwnOfferings, setNwnOfferings] = useState<Array<{ id: string; name: string }>>([]);
  const [apiTypes, setApiTypes] = useState<Array<{ id: string; name: string }>>([]);

  // Loading state
  const [loadingStates, setLoadingStates] = useState({
    partnerOfferings: true,
    managers: true,
    nwnOfferings: true,
    apiTypes: true
  });

  // Compute overall loading state
  const isLoading = useMemo(() =>
    Object.values(loadingStates).some(state => state),
    [loadingStates]
  );

  // UI state
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activePartnerOffering, setActivePartnerOffering] = useState<partnerOfferingType>();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Filter state
  const [selectedManager, setSelectedManager] = useState<string>("");
  const [selectedNwnOffering, setSelectedNwnOffering] = useState<string>("");
  const [selectedApiType, setSelectedApiType] = useState<string>("");

  // Combined subscription effect for all data
  useEffect(() => {
    // Subscribe to PartnerOfferings
    const partnerOfferingSubscription = CLIENT.models.PartnerOffering.observeQuery({
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
    }).subscribe({
      next: async (data) => {
        // Check if any items have null status (Amplify bug workaround)
        const hasNullStatus = data.items.some(item => item.status === null);

        if (hasNullStatus) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // Fix for Amplify bug #13267: refetch items with null status
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

        setAllPartnerOfferings(partnerOfferingMap);
        setLoadingStates(prev => ({ ...prev, partnerOfferings: false }));
      }
    });

    // Subscribe to Managers
    const managerSubscription = CLIENT.models.Manager.observeQuery({
      selectionSet: ['id', 'name']
    }).subscribe({
      next: (data) => {
        const managers = data.items
          .filter((item): item is { id: string; name: string } =>
            item !== null && item !== undefined && item.name !== ""
          )
          .sort((a, b) => a.name.localeCompare(b.name));
        setManagers(managers);
        setLoadingStates(prev => ({ ...prev, managers: false }));
      }
    });

    // Subscribe to NWN Offerings
    const nwnOfferingSubscription = CLIENT.models.NwnOffering.observeQuery({
      selectionSet: ['id', 'name']
    }).subscribe({
      next: (data) => {
        const offerings = data.items
          .filter((item): item is { id: string; name: string } =>
            item !== null && item !== undefined && item.name !== ""
          )
          .sort((a, b) => a.name.localeCompare(b.name));
        setNwnOfferings(offerings);
        setLoadingStates(prev => ({ ...prev, nwnOfferings: false }));
      }
    });

    // Subscribe to API Types
    const apiTypeSubscription = CLIENT.models.ApiType.observeQuery({
      selectionSet: ['id', 'name']
    }).subscribe({
      next: (data) => {
        const types = data.items
          .filter((item): item is { id: string; name: string } =>
            item !== null && item !== undefined && item.name !== ""
          )
          .sort((a, b) => a.name.localeCompare(b.name));
        setApiTypes(types);
        setLoadingStates(prev => ({ ...prev, apiTypes: false }));
      }
    });

    // Cleanup all subscriptions
    return () => {
      partnerOfferingSubscription.unsubscribe();
      managerSubscription.unsubscribe();
      nwnOfferingSubscription.unsubscribe();
      apiTypeSubscription.unsubscribe();
    };
  }, []);

  // Apply filters client-side using useMemo for performance
  const filteredPartnerOfferings = useMemo(() => {
    return allPartnerOfferings.filter((item) => {
      const matchesManager = !selectedManager ||
        item.nwnOffering?.manager?.name === selectedManager;
      const matchesNwnOffering = !selectedNwnOffering ||
        item.nwnOffering?.name === selectedNwnOffering;
      const matchesApiType = !selectedApiType ||
        item.apis?.some(api => api.apiType?.name === selectedApiType);

      return matchesManager && matchesNwnOffering && matchesApiType;
    });
  }, [allPartnerOfferings, selectedManager, selectedNwnOffering, selectedApiType]);

  // Callbacks
  const activateSidebar = useCallback((productOffering: partnerOfferingType) => {
    setActivePartnerOffering(productOffering);
    setIsOpen(true);
  }, []);

  const handleCloseSidebar = useCallback(() => {
    setActivePartnerOffering(undefined);
    setIsOpen(false);
  }, []);

  const handleOpenPopup = useCallback(() => {
    setIsPopupOpen(true);
  }, []);

  const handleClosePopup = useCallback(() => {
    setIsPopupOpen(false);
  }, []);

  const handleSubmitForm = useCallback((data: { name: string; email: string }) => {
    console.log('Form submitted with data:', data);
    // Perform actions with the submitted data, e.g., send to an API
  }, []);

  // Fixed async function - use Promise.all instead of forEach
  const deleteTemps = useCallback(async () => {
    const test = allPartnerOfferings.filter((value) => value.company.name === "ApexaiQ");

    // Properly handle async operations
    await Promise.all(test.map(value => deletePartnerOffering(value.id)));

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
      [""]
    );
  }, [allPartnerOfferings]);

  const handleDeleteAndRestore = useCallback(async () => {
    await deleteAll();
    await createInitialDataSettings();
  }, []);

  return (
    <>
      <NavBar isLoading={isLoading} height={navBarHeight}/>
      <main className={`pt-${navBarHeight}`}>
        <br />
        {/* Filter Controls */}
        <div className="mb-4 flex flex-wrap gap-4">
          <div className="flex items-center">
            <label htmlFor="manager-select" className="mr-2 font-semibold">
              Manager:
            </label>
            <select
              id="manager-select"
              value={selectedManager}
              onChange={(e) => setSelectedManager(e.target.value)}
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

          <div className="flex items-center">
            <label htmlFor="nwnOffering-select" className="mr-2 font-semibold">
              NWN Offering:
            </label>
            <select
              id="nwnOffering-select"
              value={selectedNwnOffering}
              onChange={(e) => setSelectedNwnOffering(e.target.value)}
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

          <div className="flex items-center">
            <label htmlFor="apiType-select" className="mr-2 font-semibold">
              API Type:
            </label>
            <select
              id="apiType-select"
              value={selectedApiType}
              onChange={(e) => setSelectedApiType(e.target.value)}
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

        {/* Debug Buttons (hidden) */}
        <button
          hidden
          className="select-none"
          onClick={handleDeleteAndRestore}
        >
          Delete and Restore
        </button>
        <button
          hidden
          className="select-none"
          onClick={deleteTemps}
        >
          Delete temps
        </button>

        {/* Item Grid */}
        <ItemGrid>
          {filteredPartnerOfferings.map((partnerOffering) => (
            <PartnerOfferingTileMemo
              key={partnerOffering.id}
              partnerOffering={partnerOffering}
              isHighlighted={activePartnerOffering?.id === partnerOffering.id}
              onClick={() => activateSidebar(partnerOffering)}
            />
          ))}
        </ItemGrid>

        {/* Sidebar */}
        <Sidebar
          isOpen={isOpen}
          onClose={handleCloseSidebar}
          backgroundColor='bg-gray-100'
          positionFromTop={navBarHeight}
        >
          <div className="p-4">
            {activePartnerOffering ? (
              <div>
                {/* Debug Buttons (hidden) */}
                <button
                  hidden
                  onClick={async () => {
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
                  }}
                >
                  New Partner Offering
                </button>
                <button
                  hidden
                  className="select-none"
                  onClick={handleOpenPopup}
                >
                  Test Form
                </button>

                <EditPartnerOfferingForm
                  open={isPopupOpen}
                  onClose={handleClosePopup}
                  onSubmit={handleSubmitForm}
                />

                {/* Partner Offering Details */}
                <div>
                  <PartnerOfferingTile partnerOffering={activePartnerOffering} />
                  <div className="mt-4 space-y-2">
                    <div>
                      <strong>Manager: </strong>
                      {activePartnerOffering.nwnOffering?.manager?.name}
                    </div>
                    <div>
                      <strong>Contact Info: </strong>
                      {activePartnerOffering.contactInfo}
                    </div>
                    <RenderLinkOrText
                      label="Dashboard: "
                      value={activePartnerOffering.dashboard}
                    />
                    <div>
                      <strong>Notes: </strong>
                      {activePartnerOffering.notes}
                    </div>
                    <div>
                      <strong>Status: </strong>
                      {activePartnerOffering.status?.name}
                    </div>
                    <div>
                      <strong>NWN Offering: </strong>
                      {activePartnerOffering.nwnOffering?.name}
                    </div>
                    <div>
                      <strong>Company: </strong>
                      {activePartnerOffering.company?.name}
                    </div>
                    <div>
                      <strong>Priority: </strong>
                      {activePartnerOffering.priority?.name}
                    </div>

                    <ApiList partnerOffering={activePartnerOffering} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-gray-500">No item selected</div>
            )}
          </div>
        </Sidebar>
      </main>
    </>
  );
}

export default UserInterface;