import React, { useReducer } from 'react';
import {
    Button,
    Menu,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Box,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

// Define state type
interface DialogState {
    contactDialog: boolean;
    feedbackDialog: boolean;
    subscribeDialog: boolean;
}

// Define action types
type DialogAction =
    | { type: 'OPEN_CONTACT' }
    | { type: 'CLOSE_CONTACT' }
    | { type: 'OPEN_FEEDBACK' }
    | { type: 'CLOSE_FEEDBACK' }
    | { type: 'OPEN_SUBSCRIBE' }
    | { type: 'CLOSE_SUBSCRIBE' }

// Initial state
const initialState: DialogState = {
    contactDialog: false,
    feedbackDialog: false,
    subscribeDialog: false
};

// Reducer function
function dialogReducer(state: DialogState, action: DialogAction): DialogState {
    switch (action.type) {
        case 'OPEN_CONTACT':
            return { ...state, contactDialog: true };
        case 'CLOSE_CONTACT':
            return { ...state, contactDialog: false };
        case 'OPEN_FEEDBACK':
            return { ...state, feedbackDialog: true };
        case 'CLOSE_FEEDBACK':
            return { ...state, feedbackDialog: false };
        case 'OPEN_SUBSCRIBE':
            return { ...state, subscribeDialog: true };
        case 'CLOSE_SUBSCRIBE':
            return { ...state, subscribeDialog: false };
        default:
            return state;
    }
}

export default function DialogMenu() {
    const [state, dispatch] = useReducer(dialogReducer, initialState);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const menuOpen = Boolean(anchorEl);

    const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleContactOpen = () => {
        dispatch({ type: 'OPEN_CONTACT' });
        handleMenuClose();
    };

    const handleFeedbackOpen = () => {
        dispatch({ type: 'OPEN_FEEDBACK' });
        handleMenuClose();
    };

    const handleSubscribeOpen = () => {
        dispatch({ type: 'OPEN_SUBSCRIBE' });
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
                MenuListProps={{
                    'aria-labelledby': 'menu-button',
                }}
            >
                <MenuItem onClick={handleContactOpen}>Contact Us</MenuItem>
                <MenuItem onClick={handleFeedbackOpen}>Send Feedback</MenuItem>
                <MenuItem onClick={handleSubscribeOpen}>Subscribe</MenuItem>
            </Menu>

            {/* Contact Dialog */}
            <Dialog
                open={state.contactDialog}
                onClose={() => dispatch({ type: 'CLOSE_CONTACT' })}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Contact Us</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                        <TextField
                            label="Name"
                            variant="outlined"
                            fullWidth
                            required
                        />
                        <TextField
                            label="Email"
                            type="email"
                            variant="outlined"
                            fullWidth
                            required
                        />
                        <TextField
                            label="Message"
                            variant="outlined"
                            multiline
                            rows={4}
                            fullWidth
                            required
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => dispatch({ type: 'CLOSE_CONTACT' })}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => dispatch({ type: 'CLOSE_CONTACT' })}
                    >
                        Send
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Feedback Dialog */}
            <Dialog
                open={state.feedbackDialog}
                onClose={() => dispatch({ type: 'CLOSE_FEEDBACK' })}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Send Feedback</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                        <TextField
                            label="Subject"
                            variant="outlined"
                            fullWidth
                            required
                        />
                        <TextField
                            label="Your Feedback"
                            variant="outlined"
                            multiline
                            rows={6}
                            fullWidth
                            required
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => dispatch({ type: 'CLOSE_FEEDBACK' })}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => dispatch({ type: 'CLOSE_FEEDBACK' })}
                    >
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Subscribe Dialog */}
            <Dialog
                open={state.subscribeDialog}
                onClose={() => dispatch({ type: 'CLOSE_SUBSCRIBE' })}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Subscribe to Newsletter</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                        <TextField
                            label="Full Name"
                            variant="outlined"
                            fullWidth
                            required
                        />
                        <TextField
                            label="Email Address"
                            type="email"
                            variant="outlined"
                            fullWidth
                            required
                        />
                        <TextField
                            label="Phone Number (Optional)"
                            variant="outlined"
                            fullWidth
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => dispatch({ type: 'CLOSE_SUBSCRIBE' })}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => dispatch({ type: 'CLOSE_SUBSCRIBE' })}
                    >
                        Subscribe
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}