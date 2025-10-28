import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { CLIENT } from './Utils/Constants';
import { IIdNameAndManager, IIdName, partnerOfferingType } from './Types';

interface DataStoreState {
  // Data
  allPartnerOfferings: partnerOfferingType[];
  connectionStatusOptions: IIdName[];
  nwnOfferingOptions: IIdNameAndManager[];
  managerOptions: IIdName[];
  companyOptions: IIdName[];
  priorityOptions: IIdName[];
  apiTypeOptions: IIdName[];
  authenticationTypeOptions: IIdName[];

  // Active selection
  activePartnerOffering: partnerOfferingType | undefined;
  setActivePartnerOffering: (offering: partnerOfferingType | undefined) => void;

  // Loading states
  isLoading: boolean;
  loadingStates: {
    connectionStatuses: boolean;
    managers: boolean;
    nwnOfferings: boolean;
    companies: boolean;
    partnerOfferings: boolean;
    apiTypes: boolean;
    authenticationTypes: boolean;
    priorities: boolean;
  };
}

const DataStoreContext = createContext<DataStoreState | undefined>(undefined);

export const useDataStore = () => {
  const context = useContext(DataStoreContext);
  if (!context) {
    throw new Error('useDataStore must be used within a DataStoreProvider');
  }
  return context;
};

interface DataStoreProviderProps {
  children: ReactNode;
}

export const DataStoreProvider = ({ children }: DataStoreProviderProps) => {
  // Data state
  const [allPartnerOfferings, setAllPartnerOfferings] = useState<partnerOfferingType[]>([]);
  const [connectionStatusOptions, setConnectionStatusOptions] = useState<IIdName[]>([]);
  const [nwnOfferingOptions, setNwnOfferingOptions] = useState<IIdNameAndManager[]>([]);
  const [managerOptions, setManagerOptions] = useState<IIdName[]>([]);
  const [companyOptions, setCompanyOptions] = useState<IIdName[]>([]);
  const [priorityOptions, setPriorityOptions] = useState<IIdName[]>([]);
  const [apiTypeOptions, setApiTypeOptions] = useState<IIdName[]>([]);
  const [authenticationTypeOptions, setAuthenticationTypeOptions] = useState<IIdName[]>([]);

  // Active selection state
  const [activePartnerOffering, setActivePartnerOffering] = useState<partnerOfferingType | undefined>(undefined);

  // Loading state
  const [loadingStates, setLoadingStates] = useState({
    connectionStatuses: true,
    managers: true,
    nwnOfferings: true,
    companies: true,
    partnerOfferings: true,
    apiTypes: true,
    authenticationTypes: true,
    priorities: true,
  });

  // Compute overall loading state
  const isLoading = useMemo(
    () => Object.values(loadingStates).some((state) => state),
    [loadingStates]
  );

  // Keep activePartnerOffering in sync with allPartnerOfferings
  useEffect(() => {
    if (activePartnerOffering) {
      // Find the updated version of the active offering
      const updatedOffering = allPartnerOfferings.find(
        (offering) => offering.id === activePartnerOffering.id
      );

      if (updatedOffering) {
        // Update to the latest version from the subscription
        setActivePartnerOffering(updatedOffering);
      } else {
        // The offering was deleted, clear the selection
        setActivePartnerOffering(undefined);
      }
    }
  }, [allPartnerOfferings, activePartnerOffering]);

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
        'status.id',
        'status.name',
        'nwnOffering.id',
        'nwnOffering.name',
        'nwnOffering.manager.id',
        'nwnOffering.manager.name',
        'company.id',
        'company.name',
        'priority.id',
        'priority.name',
        'apis.id',
        'apis.docLink',
        'apis.trainingLink',
        'apis.sandboxEnvironment',
        'apis.endpoint',
        'apis.apiType.id',
        'apis.apiType.name',
        'apis.authenticationType.id',
        'apis.authenticationType.name',
        'apis.authenticationInfo',
      ],
    }).subscribe({
      next: async (data) => {
        // Check if any items have null status (Amplify bug workaround)
        const hasNullStatus = data.items.some((item) => item.status === null);

        if (hasNullStatus) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        // Fix for Amplify bug #13267: refetch items with null status
        const partnerOfferingMap = (
          await Promise.all(
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
                      'status.id',
                      'status.name',
                      'nwnOffering.id',
                      'nwnOffering.name',
                      'nwnOffering.manager.id',
                      'nwnOffering.manager.name',
                      'company.id',
                      'company.name',
                      'priority.id',
                      'priority.name',
                      'apis.id',
                      'apis.docLink',
                      'apis.trainingLink',
                      'apis.sandboxEnvironment',
                      'apis.endpoint',
                      'apis.apiType.id',
                      'apis.apiType.name',
                      'apis.authenticationType.id',
                      'apis.authenticationType.name',
                      'apis.authenticationInfo',
                    ],
                  }
                );
                return refetchedItem.data;
              }
              return item;
            })
          )
        )
          .filter(
            (item): item is partnerOfferingType =>
              item !== null && item !== undefined
          )
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
        setLoadingStates((prev) => ({ ...prev, partnerOfferings: false }));
      },
    });

    // Subscribe to Connection Status
    const connectionStatusSubscription = CLIENT.models.ConnectionStatus.observeQuery({
      selectionSet: ['id', 'name'],
    }).subscribe({
      next: (data) => {
        const connectionStatuses = data.items
          .filter(
            (item): item is IIdName =>
              item !== null && item !== undefined
          )
          .sort((a, b) => a.name.localeCompare(b.name));
        setConnectionStatusOptions(connectionStatuses);
        setLoadingStates((prev) => ({ ...prev, connectionStatuses: false }));
      },
    });

    // Subscribe to NWN Offerings
    const nwnOfferingSubscription = CLIENT.models.NwnOffering.observeQuery({
      selectionSet: ['id', 'name', 'manager.id', 'manager.name'],
    }).subscribe({
      next: (data) => {
        const offerings = data.items
          .filter((item) => item !== null && item !== undefined)
          .sort((a, b) => a.name.localeCompare(b.name));
        setNwnOfferingOptions(
          offerings.map((o) => ({
            id: o.id, name: o.name,
            manager: { id: o.manager.id, name: o.manager.name },
          }))
        );
        setLoadingStates((prev) => ({ ...prev, nwnOfferings: false }));
      },
    });

    // Subscribe to Managers
    const managerSubscription = CLIENT.models.Manager.observeQuery({
      selectionSet: ['id', 'name'],
    }).subscribe({
      next: (data) => {
        const managers = data.items
          .filter(
            (item): item is IIdName =>
              item !== null && item !== undefined
          )
          .sort((a, b) => a.name.localeCompare(b.name));
        setManagerOptions(managers);
        setLoadingStates((prev) => ({ ...prev, managers: false }));
      },
    });

    // Subscribe to Companies
    const companySubscription = CLIENT.models.Company.observeQuery({
      selectionSet: ['id', 'name'],
    }).subscribe({
      next: (data) => {
        const companies = data.items
          .filter(
            (item): item is IIdName =>
              item !== null && item !== undefined
          )
          .sort((a, b) => a.name.localeCompare(b.name));
        setCompanyOptions(companies);
        setLoadingStates((prev) => ({ ...prev, companies: false }));
      },
    });

    // Subscribe to Priorities
    const prioritySubscription = CLIENT.models.Priority.observeQuery({
      selectionSet: ['id', 'name'],
    }).subscribe({
      next: (data) => {
        const priorities = data.items
          .filter(
            (item): item is IIdName =>
              item !== null && item !== undefined
          )
          .sort((a, b) => a.name.localeCompare(b.name));
        setPriorityOptions(priorities);
        setLoadingStates((prev) => ({ ...prev, priorities: false }));
      },
    });

    // Subscribe to API Types
    const apiTypeSubscription = CLIENT.models.ApiType.observeQuery({
      selectionSet: ['id', 'name'],
    }).subscribe({
      next: (data) => {
        const apiTypes = data.items
          .filter(
            (item): item is IIdName =>
              item !== null && item !== undefined
          )
          .sort((a, b) => a.name.localeCompare(b.name));
        setApiTypeOptions(apiTypes);
        setLoadingStates((prev) => ({ ...prev, apiTypes: false }));
      },
    });

    // Subscribe to Authentication Types
    const authenticationTypesSubscription =
      CLIENT.models.AuthenticationType.observeQuery({
        selectionSet: ['id', 'name'],
      }).subscribe({
        next: (data) => {
          const authenticationTypes = data.items
            .filter(
              (item): item is IIdName =>
                item !== null && item !== undefined
            )
            .sort((a, b) => a.name.localeCompare(b.name));
          setAuthenticationTypeOptions(authenticationTypes);
          setLoadingStates((prev) => ({ ...prev, authenticationTypes: false }));
        },
      });

    // Subscribe to API changes to trigger PartnerOffering refresh
    // Track previous API snapshot to detect actual changes
    let previousApiSnapshot = new Map<string, string>();
    
    const apiSubscription = CLIENT.models.Api.observeQuery({
      selectionSet: ['id', 'partnerOfferingId', 'docLink', 'trainingLink', 'sandboxEnvironment', 'endpoint', 'apiTypeId', 'authenticationTypeId', 'authenticationInfo'],
    }).subscribe({
      next: async (data) => {
        // Create current snapshot of all APIs
        const currentApiSnapshot = new Map<string, string>();
        const partnerOfferingIdsToRefresh = new Set<string>();
        
        // Build current snapshot and detect changes
        for (const api of data.items) {
          if (api?.id && api?.partnerOfferingId) {
            const apiFingerprint = JSON.stringify({
              id: api.id,
              partnerOfferingId: api.partnerOfferingId,
              docLink: api.docLink,
              trainingLink: api.trainingLink,
              sandboxEnvironment: api.sandboxEnvironment,
              endpoint: api.endpoint,
              apiTypeId: api.apiTypeId,
              authenticationTypeId: api.authenticationTypeId,
              authenticationInfo: api.authenticationInfo,
            });
            
            currentApiSnapshot.set(api.id, apiFingerprint);
            
            // Check if this API changed or is new
            const previousFingerprint = previousApiSnapshot.get(api.id);
            if (!previousFingerprint || previousFingerprint !== apiFingerprint) {
              partnerOfferingIdsToRefresh.add(api.partnerOfferingId);
            }
          }
        }
        
        // Check for deleted APIs
        for (const [apiId, fingerprint] of previousApiSnapshot.entries()) {
          if (!currentApiSnapshot.has(apiId)) {
            // API was deleted, extract partnerOfferingId from fingerprint
            const data = JSON.parse(fingerprint);
            if (data.partnerOfferingId) {
              partnerOfferingIdsToRefresh.add(data.partnerOfferingId);
            }
          }
        }
        
        // Update snapshot for next comparison
        previousApiSnapshot = currentApiSnapshot;
        
        // Only refetch PartnerOfferings that actually changed
        if (partnerOfferingIdsToRefresh.size > 0) {
          console.log('Refreshing PartnerOfferings:', Array.from(partnerOfferingIdsToRefresh));
          
          for (const offeringId of partnerOfferingIdsToRefresh) {
            const refetchedOffering = await CLIENT.models.PartnerOffering.get(
              { id: offeringId },
              {
                selectionSet: [
                  'id',
                  'offeringName',
                  'contactInfo',
                  'dashboard',
                  'notes',
                  'status.id',
                  'status.name',
                  'nwnOffering.id',
                  'nwnOffering.name',
                  'nwnOffering.manager.id',
                  'nwnOffering.manager.name',
                  'company.id',
                  'company.name',
                  'priority.id',
                  'priority.name',
                  'apis.id',
                  'apis.docLink',
                  'apis.trainingLink',
                  'apis.sandboxEnvironment',
                  'apis.endpoint',
                  'apis.apiType.id',
                  'apis.apiType.name',
                  'apis.authenticationType.id',
                  'apis.authenticationType.name',
                  'apis.authenticationInfo',
                ],
              }
            );

            if (refetchedOffering.data) {
              // Update the offering in the list
              setAllPartnerOfferings((prev) => {
                const index = prev.findIndex((o) => o.id === offeringId);
                if (index >= 0) {
                  const updated = [...prev];
                  updated[index] = refetchedOffering.data as partnerOfferingType;
                  return updated;
                }
                return prev;
              });
            }
          }
        }
      },
    });

    // Cleanup all subscriptions
    return () => {
      partnerOfferingSubscription.unsubscribe();
      connectionStatusSubscription.unsubscribe();
      managerSubscription.unsubscribe();
      companySubscription.unsubscribe();
      prioritySubscription.unsubscribe();
      nwnOfferingSubscription.unsubscribe();
      apiTypeSubscription.unsubscribe();
      authenticationTypesSubscription.unsubscribe();
      apiSubscription.unsubscribe();
    };
  }, []);

  const value = useMemo(
    () => ({
      allPartnerOfferings,
      connectionStatusOptions,
      nwnOfferingOptions,
      managerOptions,
      companyOptions,
      priorityOptions,
      apiTypeOptions,
      authenticationTypeOptions,
      activePartnerOffering,
      setActivePartnerOffering,
      isLoading,
      loadingStates,
    }),
    [
      allPartnerOfferings,
      connectionStatusOptions,
      nwnOfferingOptions,
      managerOptions,
      companyOptions,
      priorityOptions,
      apiTypeOptions,
      authenticationTypeOptions,
      activePartnerOffering,
      setActivePartnerOffering,
      isLoading,
      loadingStates,
    ]
  );

  return (
    <DataStoreContext.Provider value={value}>
      {children}
    </DataStoreContext.Provider>
  );
};