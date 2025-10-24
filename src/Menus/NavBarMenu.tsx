import React, { useCallback, useReducer } from 'react';
import {
    Button,
    Menu,
    MenuItem,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { IdNameType } from '../Types';
import EmptyForm from '../Forms/EmptyForm';

// Define state type
interface NavBarMenuState {
    empty1: boolean;
    empty2: boolean;
}

// Define action types
type NavBarMenuAction =
    | { type: 'OPEN_EMPTY1' }
    | { type: 'CLOSE_EMPTY1' }
    | { type: 'OPEN_EMPTY2' }
    | { type: 'CLOSE_EMPTY2' }

// Initial state
const initialState: NavBarMenuState = {
    empty1: false,
    empty2: false,
};

// Reducer function
function navBarMenuReducer(state: NavBarMenuState, action: NavBarMenuAction): NavBarMenuState {
    switch (action.type) {
        case 'OPEN_EMPTY1':
            return { ...state, empty1: true };
        case 'CLOSE_EMPTY1':
            return { ...state, empty1: false };
        case 'OPEN_EMPTY2':
            return { ...state, empty2: true };
        case 'CLOSE_EMPTY2':
            return { ...state, empty2: false };
        default:
            return state;
    }
}

const NavBarMenu = () => {
    const [state, dispatch] = useReducer(navBarMenuReducer, initialState);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const menuOpen = Boolean(anchorEl);

    const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleEmpty1Open = () => {
        dispatch({ type: 'OPEN_EMPTY1' });
        handleMenuClose();
    };

    const handleEmpty1Close = () => {
        dispatch({ type: 'CLOSE_EMPTY1' });
        handleMenuClose();
    };

    const handleEmpty1Submit = useCallback((managerOptions: IdNameType[]) => {
        dispatch({ type: 'CLOSE_EMPTY1' });
        console.log("Submit " + managerOptions);
        // TODO: 9879 Perform actions with the submitted data, e.g., send to an API
    }, []);

    const handleEmpty2Open = () => {
        dispatch({ type: 'OPEN_EMPTY1' });
        handleMenuClose();
    };

    const handleEmpty2Close = () => {
        dispatch({ type: 'CLOSE_EMPTY1' });
        handleMenuClose();
    };

    const handleEmpty2Submit = useCallback((managerOptions: IdNameType[]) => {
        dispatch({ type: 'CLOSE_EMPTY2' });
        console.log("Submit " + managerOptions);
        // TODO: 9879 Perform actions with the submitted data, e.g., send to an API
    }, []);

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
                <MenuItem onClick={handleEmpty1Open}>Empty 1</MenuItem>
                <MenuItem onClick={handleEmpty2Open}>Empty 2</MenuItem>
            </Menu>

            {/* Empty1 */}
            <EmptyForm
                open={state.empty1}
                onClose={handleEmpty1Close}
                onSubmit={handleEmpty1Submit}
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