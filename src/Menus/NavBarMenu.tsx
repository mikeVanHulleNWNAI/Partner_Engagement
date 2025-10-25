import React, { useCallback, useReducer } from 'react';
import {
    Button,
    Menu,
    MenuItem,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CreateIcon from '@mui/icons-material/Create';

import { IdNameType, partnerOfferingType } from '../Types';
import EmptyForm from '../Forms/EmptyForm';
import EditPartnerOfferingForm from '../Forms/EditPartnerOfferingForm';
import { createPartnerOffering } from '../Utils/CreateData';
import { useDataStore } from '../DataStoreProvider';

// Define state type
interface NavBarMenuState {
    createPartnerOffering: boolean;
    empty2: boolean;
}

// Define action types
type NavBarMenuAction =
    | { type: 'OPEN_CREATEPARTNEROFFERING' }
    | { type: 'OPEN_EMPTY2' }
    | { type: 'CLOSE_ALL' }

// Initial state
const initialState: NavBarMenuState = {
    createPartnerOffering: false,
    empty2: false,
};

// Reducer function
function navBarMenuReducer(state: NavBarMenuState, action: NavBarMenuAction): NavBarMenuState {
    switch (action.type) {
        case 'OPEN_CREATEPARTNEROFFERING':
            return { ...state, createPartnerOffering: true };
        case 'OPEN_EMPTY2':
            return { ...state, empty2: true };
        case 'CLOSE_ALL':
            return { 
                ...state, 
                createPartnerOffering: false,
                empty2: false
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

    const handleEmpty2Open = () => {
        dispatch({ type: 'OPEN_EMPTY2' });
        handleMenuClose();
    };

    const handleEmpty2Close = () => {
        dispatch({ type: 'CLOSE_ALL' });
        handleMenuClose();
    };

    const handleEmpty2Submit = useCallback((managerOptions: IdNameType[]) => {
        dispatch({ type: 'CLOSE_ALL' });
        console.log("Submit " + managerOptions);
        // TODO: 9879 Perform actions with the submitted data, e.g., send to an API
    }, []);

    // these are used to determine if we have the options
    const firstConnectionsStatus = 
        connectionStatusOptions.find((x) => x.name == "") || 
            { id: "", name: "" };
    const firstNwnOffering =
        nwnOfferingOptions.find((x) => x.nwnOffering.name == "") || 
            {nwnOffering: { id: "", name: ""}, manager: { id: "", name: ""}};
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
                <MenuItem onClick={handleEmpty2Open}>Empty 2</MenuItem>
            </Menu>

            {/* CreatePartnerOffering */}
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

            {/* Empty2 */}
            <EmptyForm
                open={state.empty2}
                onClose={handleEmpty2Close}
                onSubmit={handleEmpty2Submit}
            />
        </>
    );
}

export default NavBarMenu;