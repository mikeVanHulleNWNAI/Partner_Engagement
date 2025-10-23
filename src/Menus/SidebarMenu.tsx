import React, { FC, useCallback, useReducer } from 'react';
import {
    Button,
    Menu,
    MenuItem,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import EditPartnerOfferingForm from '../EditPartnerOfferingForm';
import { partnerOfferingType } from '../Types';

// Define state type
interface SidebarMenuState {
    editPartnerOffering: boolean;
    deletePartnerOffering: boolean;
}

// Define action types
type SidebarMenuAction =
    | { type: 'OPEN_EDITPARTNEROFFERING' }
    | { type: 'CLOSE_EDITPARTNEROFFERING' }
    | { type: 'OPEN_DELETEPARTNEROFFERING' }
    | { type: 'CLOSE_DELETEPARTNEROFFERING' }

// Initial state
const initialState: SidebarMenuState = {
    editPartnerOffering: false,
    deletePartnerOffering: false,
};

// Reducer function
function sidebarMenuReducer(state: SidebarMenuState, action: SidebarMenuAction): SidebarMenuState {
    switch (action.type) {
        case 'OPEN_EDITPARTNEROFFERING':
            return { ...state, editPartnerOffering: true };
        case 'CLOSE_EDITPARTNEROFFERING':
            return { ...state, editPartnerOffering: false };
        case 'OPEN_DELETEPARTNEROFFERING':
            return { ...state, deletePartnerOffering: true };
        case 'CLOSE_DELETEPARTNEROFFERING':
            return { ...state, deletePartnerOffering: false };
        default:
            return state;
    }
}

interface SidebarMenuProps {
    activePartnerOffering: partnerOfferingType;
}

const SidebarMenu: FC<SidebarMenuProps> = ({
    activePartnerOffering
}) => {
    const [state, dispatch] = useReducer(sidebarMenuReducer, initialState);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const menuOpen = Boolean(anchorEl);

    const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleEditPartnerOfferingOpen = () => {
        dispatch({ type: 'OPEN_EDITPARTNEROFFERING' });
        handleMenuClose();
    };

    const handleEditPartnerOfferingClose = () => {
        dispatch({ type: 'CLOSE_EDITPARTNEROFFERING' });
        handleMenuClose();
    };

    const handleEditPartnerOfferingSubmit = useCallback((partnerOffering: partnerOfferingType) => {
        dispatch({ type: 'CLOSE_EDITPARTNEROFFERING' });
        console.log('Form submitted with partnerOffering:', partnerOffering);
        // TODO: 9879 Perform actions with the submitted data, e.g., send to an API
    }, []);

    const handleDeletePartnerOfferingOpen = () => {
        dispatch({ type: 'OPEN_DELETEPARTNEROFFERING' });
        handleMenuClose();
    };

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
                <MenuItem onClick={handleEditPartnerOfferingOpen}>Edit</MenuItem>
                <MenuItem onClick={handleDeletePartnerOfferingOpen}>Delete</MenuItem>
            </Menu>

            {/* EditPartnerOfferingForm */}
            <EditPartnerOfferingForm
                open={state.editPartnerOffering}
                onClose={handleEditPartnerOfferingClose}
                onSubmit={handleEditPartnerOfferingSubmit}
                partnerOfferingData={structuredClone(activePartnerOffering)}
            />

            {/* DeletePartnerOfferingForm */}
        </>
    );
}

export default SidebarMenu;