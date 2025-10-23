import { useState, useEffect, createContext, ReactNode } from 'react';
import { CLIENT } from './Utils/Constants';
import { IdNameType, IdNameAndManagerIdNameType, partnerOfferingType } from './Types';

interface DatabaseSubscriptionContextType {
    allPartnerOfferings: partnerOfferingType[];
    connectionStatusOptions: IdNameType[];
    nwnOfferingOptions: IdNameAndManagerIdNameType[];
    managerOptions: IdNameType[];
    companyOptions: IdNameType[];
    priorityOptions: IdNameType[];
    apiTypeOptions: IdNameType[];
    authenticationTypeOptions: IdNameType[];
    isLoading: boolean;
}

const DatabaseSubscriptionContext = createContext<DatabaseSubscriptionContextType | undefined>(undefined);

// Singleton state - only one instance ever exists
class DatabaseSubscriptionStore {
    private static instance: DatabaseSubscriptionStore;
    private subscribers = new Set<(data: DatabaseSubscriptionContextType) => void>();
    private subscriptionsInitialized = false;

    private state: DatabaseSubscriptionContextType = {
        allPartnerOfferings: [],
        connectionStatusOptions: [],
        nwnOfferingOptions: [],
        managerOptions: [],
        companyOptions: [],
        priorityOptions: [],
        apiTypeOptions: [],
        authenticationTypeOptions: [],
        isLoading: true
    };

    private loadingStates = {
        partnerOfferings: true,
        connectionStatuses: true,
        managers: true,
        nwnOfferings: true,
        companies: true,
        priorities: true,
        apiTypes: true,
        authenticationTypes: true
    };

    static getInstance(): DatabaseSubscriptionStore {
        if (!DatabaseSubscriptionStore.instance) {
            DatabaseSubscriptionStore.instance = new DatabaseSubscriptionStore();
        }
        return DatabaseSubscriptionStore.instance;
    }

    private constructor() {
        // Private constructor ensures singleton
    }

    subscribe(callback: (data: DatabaseSubscriptionContextType) => void): () => void {
        this.subscribers.add(callback);

        // Initialize subscriptions only once
        if (!this.subscriptionsInitialized) {
            this.initializeSubscriptions();
        } else {
            // If already initialized, immediately call with current state
            callback(this.state);
        }

        // Return unsubscribe function
        return () => {
            this.subscribers.delete(callback);
        };
    }

    private notifySubscribers() {
        // Create a NEW object with updated isLoading
        this.state = {
            ...this.state,
            isLoading: Object.values(this.loadingStates).some(s => s)
        };
        this.subscribers.forEach(callback => callback(this.state));
    }

    private initializeSubscriptions() {
        if (this.subscriptionsInitialized) return;
        this.subscriptionsInitialized = true;

        console.log('Initializing subscriptions (should only happen once)');

        // PartnerOffering subscription
        CLIENT.models.PartnerOffering.observeQuery({
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

                this.state.allPartnerOfferings = partnerOfferingMap;
                this.loadingStates.partnerOfferings = false;
                this.notifySubscribers();
            }
        });

        // Connection Status subscription
        CLIENT.models.ConnectionStatus.observeQuery({
            selectionSet: ['id', 'name']
        }).subscribe({
            next: (data) => {
                this.state.connectionStatusOptions = data.items
                    .filter((item): item is IdNameType =>
                        item !== null && item !== undefined && item.name !== ""
                    )
                    .sort((a, b) => a.name.localeCompare(b.name));
                this.loadingStates.connectionStatuses = false;
                this.notifySubscribers();
            }
        });

        // NWN Offerings subscription
        CLIENT.models.NwnOffering.observeQuery({
            selectionSet: ['id', 'name', 'manager.id', 'manager.name']
        }).subscribe({
            next: (data) => {
                const offerings = data.items
                    .filter((item) =>
                        item !== null && item !== undefined && item.name !== ""
                    )
                    .sort((a, b) => a.name.localeCompare(b.name));
                this.state.nwnOfferingOptions = offerings.map((o) => ({
                    nwnOffering: { id: o.id, name: o.name },
                    manager: { id: o.manager.id, name: o.manager.name }
                }));
                this.loadingStates.nwnOfferings = false;
                this.notifySubscribers();
            }
        });

        // Managers subscription
        CLIENT.models.Manager.observeQuery({
            selectionSet: ['id', 'name']
        }).subscribe({
            next: (data) => {
                this.state.managerOptions = data.items
                    .filter((item): item is IdNameType =>
                        item !== null && item !== undefined && item.name !== ""
                    )
                    .sort((a, b) => a.name.localeCompare(b.name));
                this.loadingStates.managers = false;
                this.notifySubscribers();
            }
        });

        // Companies subscription
        CLIENT.models.Company.observeQuery({
            selectionSet: ['id', 'name']
        }).subscribe({
            next: (data) => {
                this.state.companyOptions = data.items
                    .filter((item): item is IdNameType =>
                        item !== null && item !== undefined && item.name !== ""
                    )
                    .sort((a, b) => a.name.localeCompare(b.name));
                this.loadingStates.companies = false;
                this.notifySubscribers();
            }
        });

        // Priorities subscription
        CLIENT.models.Priority.observeQuery({
            selectionSet: ['id', 'name']
        }).subscribe({
            next: (data) => {
                this.state.priorityOptions = data.items
                    .filter((item): item is IdNameType =>
                        item !== null && item !== undefined && item.name !== ""
                    )
                    .sort((a, b) => a.name.localeCompare(b.name));
                this.loadingStates.priorities = false;
                this.notifySubscribers();
            }
        });

        // API Types subscription
        CLIENT.models.ApiType.observeQuery({
            selectionSet: ['id', 'name']
        }).subscribe({
            next: (data) => {
                this.state.apiTypeOptions = data.items
                    .filter((item): item is IdNameType =>
                        item !== null && item !== undefined && item.name !== ""
                    )
                    .sort((a, b) => a.name.localeCompare(b.name));
                this.loadingStates.apiTypes = false;
                this.notifySubscribers();
            }
        });

        // Authentication Types subscription
        CLIENT.models.AuthenticationType.observeQuery({
            selectionSet: ['id', 'name']
        }).subscribe({
            next: (data) => {
                this.state.authenticationTypeOptions = data.items
                    .filter((item): item is IdNameType =>
                        item !== null && item !== undefined && item.name !== ""
                    )
                    .sort((a, b) => a.name.localeCompare(b.name));
                this.loadingStates.authenticationTypes = false;
                this.notifySubscribers();
            }
        });
    }

    getState(): DatabaseSubscriptionContextType {
        return this.state;
    }
}

// Hook that subscribes to the singleton store
export function useDatabaseSubscription(): DatabaseSubscriptionContextType {
    const store = DatabaseSubscriptionStore.getInstance();
    const [DatabaseSubscription, setDatabaseSubscription] = useState<DatabaseSubscriptionContextType>(store.getState());

    useEffect(() => {
        // Subscribe to store updates
        const unsubscribe = store.subscribe(setDatabaseSubscription);

        // Cleanup
        return unsubscribe;
    }, [store]);

    return DatabaseSubscription;
}

export function DatabaseSubscriptionProvider({ children }: { children: ReactNode }) {
    const databaseSubscription = useDatabaseSubscription();

    return (
        <DatabaseSubscriptionContext.Provider value={databaseSubscription}>
            {children}
        </DatabaseSubscriptionContext.Provider>
    );
}
