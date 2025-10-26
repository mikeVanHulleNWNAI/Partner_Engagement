import React, { useCallback, useReducer } from 'react';
import {
    Button,
    Menu,
    MenuItem,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CreateIcon from '@mui/icons-material/Create';
import BusinessIcon from '@mui/icons-material/Business';
import FlagIcon from '@mui/icons-material/Flag';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InventoryIcon from '@mui/icons-material/Inventory';
import PersonIcon from '@mui/icons-material/Person';
import ApiIcon from '@mui/icons-material/Api';
import LockIcon from '@mui/icons-material/Lock';

import { IdNameType, partnerOfferingType } from '../Types';
import IdNamesForm from '../Forms/IdNamesForm';
import EditPartnerOfferingForm from '../Forms/EditPartnerOfferingForm';
import { createPartnerOffering } from '../Utils/CreateData';
import { useDataStore } from '../DataStoreProvider';

// Define state type
interface NavBarMenuState {
    createPartnerOffering: boolean;
    editCompany: boolean;
    editPriority: boolean;
    editStatus: boolean;
    editNwnOffering: boolean;
    editManager: boolean;
    editApiType: boolean;
    editAuthenticationType: boolean;
}

// Define action types
type NavBarMenuAction =
    | { type: 'OPEN_CREATEPARTNEROFFERING' }
    | { type: 'OPEN_COMPANY' }
    | { type: 'OPEN_PRIORITY' }
    | { type: 'OPEN_STATUS' }
    | { type: 'OPEN_NWNOFFERING' }
    | { type: 'OPEN_MANAGER' }
    | { type: 'OPEN_APITYPE' }
    | { type: 'OPEN_AUTHENTICATIONTYPE' }
    | { type: 'CLOSE_ALL' }

// Initial state
const initialState: NavBarMenuState = {
    createPartnerOffering: false,
    editCompany: false,
    editPriority: false,
    editStatus: false,
    editNwnOffering: false,
    editManager: false,
    editApiType: false,
    editAuthenticationType: false,
};

// Reducer function
function navBarMenuReducer(state: NavBarMenuState, action: NavBarMenuAction): NavBarMenuState {
    switch (action.type) {
        case 'OPEN_CREATEPARTNEROFFERING':
            return { ...state, createPartnerOffering: true };
        case 'OPEN_COMPANY':
            return { ...state, editCompany: true };
        case 'OPEN_PRIORITY':
            return { ...state, editPriority: true };
        case 'OPEN_STATUS':
            return { ...state, editStatus: true };
        case 'OPEN_NWNOFFERING':
            return { ...state, editNwnOffering: true };
        case 'OPEN_MANAGER':
            return { ...state, editManager: true };
        case 'OPEN_APITYPE':
            return { ...state, editApiType: true };
        case 'OPEN_AUTHENTICATIONTYPE':
            return { ...state, editAuthenticationType: true };
        case 'CLOSE_ALL':
            return {
                ...state,
                createPartnerOffering: false,
                editCompany: false,
                editPriority: false,
                editStatus: false,
                editNwnOffering: false,
                editManager: false,
                editApiType: false,
                editAuthenticationType: false,
            };
        default:
            return state;
    }
}

const NavBarMenu = () => {
    const [state, dispatch] = useReducer(navBarMenuReducer, initialState);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const menuOpen = Boolean(anchorEl);

    const {
        connectionStatusOptions,
        nwnOfferingOptions,
        companyOptions,
        priorityOptions,
        apiTypeOptions,
        authenticationTypeOptions
    } = useDataStore();

    const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleCreatePartnerOfferingOpen = () => {
        dispatch({ type: 'OPEN_CREATEPARTNEROFFERING' });
        handleMenuClose();
    };

    const handleCreatePartnerOfferingClose = () => {
        dispatch({ type: 'CLOSE_ALL' });
        handleMenuClose();
    };

    const handleCreatePartnerOfferingSubmit = useCallback((partnerOffering: partnerOfferingType) => {
        dispatch({ type: 'CLOSE_ALL' });
        createPartnerOffering(partnerOffering);
    }, []);

    const handleCompanyOpen = () => {
        dispatch({ type: 'OPEN_COMPANY' });
        handleMenuClose();
    };

    const handleCompanyClose = () => {
        dispatch({ type: 'CLOSE_ALL' });
        handleMenuClose();
    };

    const handleCompanySubmit = useCallback((companyOptions: IdNameType[]) => {
        dispatch({ type: 'CLOSE_ALL' });
        console.log("Submit " + companyOptions);
        // TODO: 9879 Perform actions with the submitted data, e.g., send to an API
    }, []);

    const handlePriorityOpen = () => {
        dispatch({ type: 'OPEN_PRIORITY' });
        handleMenuClose();
    };

    const handlePriorityClose = () => {
        dispatch({ type: 'CLOSE_ALL' });
        handleMenuClose();
    };

    const handlePrioritySubmit = useCallback((priorities: IdNameType[]) => {
        dispatch({ type: 'CLOSE_ALL' });
        console.log("Submit " + priorities);
        // TODO: 9879 Perform actions with the submitted data, e.g., send to an API
    }, []);

    const handleStatusOpen = () => {
        dispatch({ type: 'OPEN_STATUS' });
        handleMenuClose();
    };

    const handleStatusClose = () => {
        dispatch({ type: 'CLOSE_ALL' });
        handleMenuClose();
    };

    const handleStatusSubmit = useCallback((statuses: IdNameType[]) => {
        dispatch({ type: 'CLOSE_ALL' });
        console.log("Submit " + statuses);
        // TODO: 9879 Perform actions with the submitted data, e.g., send to an API
    }, []);

    const handleNwnOfferingOpen = () => {
        dispatch({ type: 'OPEN_NWNOFFERING' });
        handleMenuClose();
    };

    const handleNwnOfferingClose = () => {
        dispatch({ type: 'CLOSE_ALL' });
        handleMenuClose();
    };

    const handleNwnOfferingSubmit = useCallback((nwnOfferings: IdNameType[]) => {
        dispatch({ type: 'CLOSE_ALL' });
        console.log("Submit " + nwnOfferings);
        // TODO: 9879 Perform actions with the submitted data, e.g., send to an API
    }, []);

    const handleManagerOpen = () => {
        dispatch({ type: 'OPEN_MANAGER' });
        handleMenuClose();
    };

    const handleManagerClose = () => {
        dispatch({ type: 'CLOSE_ALL' });
        handleMenuClose();
    };

    const handleManagerSubmit = useCallback((managers: IdNameType[]) => {
        dispatch({ type: 'CLOSE_ALL' });
        console.log("Submit " + managers);
        // TODO: 9879 Perform actions with the submitted data, e.g., send to an API
    }, []);

    const handleApiTypeOpen = () => {
        dispatch({ type: 'OPEN_APITYPE' });
        handleMenuClose();
    };

    const handleApiTypeClose = () => {
        dispatch({ type: 'CLOSE_ALL' });
        handleMenuClose();
    };

    const handleApiTypeSubmit = useCallback((apiTypes: IdNameType[]) => {
        dispatch({ type: 'CLOSE_ALL' });
        console.log("Submit " + apiTypes);
        // TODO: 9879 Perform actions with the submitted data, e.g., send to an API
    }, []);

    const handleAuthenticationTypeOpen = () => {
        dispatch({ type: 'OPEN_AUTHENTICATIONTYPE' });
        handleMenuClose();
    };

    const handleAuthenticationTypeClose = () => {
        dispatch({ type: 'CLOSE_ALL' });
        handleMenuClose();
    };

    const handleAuthenticationTypeSubmit = useCallback((authenticationTypes: IdNameType[]) => {
        dispatch({ type: 'CLOSE_ALL' });
        console.log("Submit " + authenticationTypes);
        // TODO: 9879 Perform actions with the submitted data, e.g., send to an API
    }, []);

    // these are used to determine if we have the options
    const firstConnectionsStatus =
        connectionStatusOptions.find((x) => x.name == "") ||
        { id: "", name: "" };
    const firstNwnOffering =
        nwnOfferingOptions.find((x) => x.nwnOffering.name == "") ||
        { nwnOffering: { id: "", name: "" }, manager: { id: "", name: "" } };
    const firstCompany =
        companyOptions.find((x) => x.name == "") ||
        { id: "", name: "" };
    const firstPriority =
        priorityOptions.find((x) => x.name == "") ||
        { id: "", name: "" };

    return (
        <>
            <Button
                sx={{
                    color: 'black',
                }}
                onClick={handleMenuClick}
                startIcon={<MenuIcon />}
            />
            <Menu
                id="main-menu"
                anchorEl={anchorEl}
                open={menuOpen}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleCreatePartnerOfferingOpen}>
                    <CreateIcon sx={{ marginRight: 1 }} />
                    Create Partner Offering
                </MenuItem>
                <MenuItem onClick={handleCompanyOpen}>
                    <BusinessIcon sx={{ marginRight: 1 }} />
                    Companies
                </MenuItem>
                <MenuItem onClick={handlePriorityOpen}>
                    <FlagIcon sx={{ marginRight: 1 }} />
                    Priorities
                </MenuItem>
                <MenuItem onClick={handleStatusOpen}>
                    <CheckCircleIcon sx={{ marginRight: 1 }} />
                    Statuses
                </MenuItem>
                <MenuItem onClick={handleNwnOfferingOpen}>
                    <InventoryIcon sx={{ marginRight: 1 }} />
                    NWN Offerings
                </MenuItem>
                <MenuItem onClick={handleManagerOpen}>
                    <PersonIcon sx={{ marginRight: 1 }} />
                    Managers
                </MenuItem>
                <MenuItem onClick={handleApiTypeOpen}>
                    <ApiIcon sx={{ marginRight: 1 }} />
                    API Types
                </MenuItem>
                <MenuItem onClick={handleAuthenticationTypeOpen}>
                    <LockIcon sx={{ marginRight: 1 }} />
                    Authentication Types
                </MenuItem>
            </Menu>

            {/* CreatePartnerOffering */}
            {state.createPartnerOffering && (
                <EditPartnerOfferingForm
                    open={state.createPartnerOffering}
                    onClose={handleCreatePartnerOfferingClose}
                    onSubmit={handleCreatePartnerOfferingSubmit}
                    partnerOfferingData={{
                        id: "",
                        offeringName: "",
                        contactInfo: "",
                        dashboard: "",
                        notes: "",
                        status: firstConnectionsStatus,
                        nwnOffering: {
                            id: firstNwnOffering.nwnOffering.id,
                            name: firstNwnOffering.nwnOffering.name,
                            manager: {
                                id: firstNwnOffering.manager.id,
                                name: firstNwnOffering.manager.name
                            }
                        },
                        company: firstCompany,
                        priority: firstPriority,
                        apis: []
                    }}
                />
            )}

            {/* Company */}
            {state.editCompany && (
                <IdNamesForm
                    open={state.editCompany}
                    onClose={handleCompanyClose}
                    onSubmit={handleCompanySubmit}
                    idNames={structuredClone(companyOptions)}
                    entityType='Companies'
                />
            )}

            {/* Priority */}
            {state.editPriority && (
                <IdNamesForm
                    open={state.editPriority}
                    onClose={handlePriorityClose}
                    onSubmit={handlePrioritySubmit}
                    idNames={structuredClone(priorityOptions)}
                    entityType='Priorities'
                />
            )}

            {/* Status */}
            {state.editStatus && (
                <IdNamesForm
                    open={state.editStatus}
                    onClose={handleStatusClose}
                    onSubmit={handleStatusSubmit}
                    idNames={structuredClone(connectionStatusOptions)}
                    entityType='Statuses'
                />
            )}

            {/* NWN Offering */}
            {state.editNwnOffering && (
                <IdNamesForm
                    open={state.editNwnOffering}
                    onClose={handleNwnOfferingClose}
                    onSubmit={handleNwnOfferingSubmit}
                    idNames={structuredClone(nwnOfferingOptions.map(x => x.nwnOffering))}
                    entityType='NWNOfferings'
                />
            )}

            {/* Manager */}
            {state.editManager && (
                <IdNamesForm
                    open={state.editManager}
                    onClose={handleManagerClose}
                    onSubmit={handleManagerSubmit}
                    idNames={structuredClone(nwnOfferingOptions.map(x => x.manager))}
                    entityType='Managers'
                />
            )}

            {/* API Type */}
            {state.editApiType && (
                <IdNamesForm
                    open={state.editApiType}
                    onClose={handleApiTypeClose}
                    onSubmit={handleApiTypeSubmit}
                    idNames={structuredClone(apiTypeOptions)}
                    entityType='ApiTypes'
                />
            )}

            {/* Authentication Type */}
            {state.editAuthenticationType && (
                <IdNamesForm
                    open={state.editAuthenticationType}
                    onClose={handleAuthenticationTypeClose}
                    onSubmit={handleAuthenticationTypeSubmit}
                    idNames={structuredClone(authenticationTypeOptions)} // TODO: 9879 You'll need to add authenticationTypeOptions to useDataStore
                    entityType='AuthenticationTypes'
                />
            )}
        </>
    );
}

export default NavBarMenu;