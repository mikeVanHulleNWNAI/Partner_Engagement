import React, { FC, useEffect, useState } from 'react';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';

interface AreYouSureFormProps {
    open: boolean;
    onNo: () => void;
    onYes: () => void;
    label: string;
}

const AreYouSureForm: FC<AreYouSureFormProps> = ({
    open,
    onNo,
    onYes,
    label
}) => {

    const [valid, setValid] = useState(true);

    useEffect(() => {
        // Just set valid for now.  No checking yet.
        setValid(true);
    }, [])

    const handleYes = (e: React.FormEvent) => {
        e.preventDefault();
        if (onYes) {
            onYes();
        }
    };

    return (
        <Dialog closeAfterTransition={false} open={open} onClose={onNo} maxWidth="sm" fullWidth>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogContent>
                {label}
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={handleYes} variant="contained"
                    disabled={!valid}
                >
                    Yes
                </Button>
                <Button onClick={onNo}>No</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AreYouSureForm;