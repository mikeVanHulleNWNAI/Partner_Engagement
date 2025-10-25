import React, { FC, useCallback, useReducer } from 'react';
import {
    Button,
    Menu,
    MenuItem,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import EditPartnerOfferingForm from '../Forms/EditPartnerOfferingForm';
import { partnerOfferingType } from '../Types';
import { useDataStore } from '../DataStoreProvider';
import AreYouSureForm from '../Forms/AreYouSureForm';
import { deletePartnerOffering, updatePartnerOffering } from '../Utils/CreateData';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

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
    onCloseSidebar: () => void;
}

const SidebarMenu: FC<SidebarMenuProps> = ({
    onCloseSidebar
}) => {
    const [state, dispatch] = useReducer(sidebarMenuReducer, initialState);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const menuOpen = Boolean(anchorEl);

    const {
        activePartnerOffering
    } = useDataStore();

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
        if (activePartnerOffering)
            updatePartnerOffering(partnerOffering, activePartnerOffering);
    }, []);

    const handleDeletePartnerOfferingOpen = () => {
        dispatch({ type: 'OPEN_DELETEPARTNEROFFERING' });
        handleMenuClose();
    };

    const handleDeletePartnerOfferingClose = () => {
        dispatch({ type: 'CLOSE_DELETEPARTNEROFFERING' });
        handleMenuClose();
    };

    const handleDeletePartnerOfferingYes = useCallback(() => {
        dispatch({ type: 'CLOSE_DELETEPARTNEROFFERING' });
        // close this sidebar
        onCloseSidebar();
        // delete the partner offering
        if (activePartnerOffering)
            deletePartnerOffering(activePartnerOffering.id);
    }, [activePartnerOffering, onCloseSidebar]);

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
                <MenuItem onClick={handleEditPartnerOfferingOpen}>
                    <EditIcon sx={{ marginRight: 1 }} />
                    Edit Partner Offering
                </MenuItem>
                <MenuItem onClick={handleDeletePartnerOfferingOpen}>
                    <DeleteIcon sx={{ marginRight: 1 }} />
                    Delete Partner Offering
                </MenuItem>
            </Menu>

            {/* EditPartnerOfferingForm */}
            {activePartnerOffering ? (
                <EditPartnerOfferingForm
                    open={state.editPartnerOffering}
                    onClose={handleEditPartnerOfferingClose}
                    onSubmit={handleEditPartnerOfferingSubmit}
                    partnerOfferingData={structuredClone(activePartnerOffering)}
                />
            ) : (
                "No Active Partner Offering"
            )}

            {/* DeletePartnerOfferingForm */}
            <AreYouSureForm
                open={state.deletePartnerOffering}
                onClose={handleDeletePartnerOfferingClose}
                onYes={handleDeletePartnerOfferingYes}
                label="Are you sure you want to delete this Partner Offering?"
            >
            </AreYouSureForm>
        </>
    );
}

export default SidebarMenu;