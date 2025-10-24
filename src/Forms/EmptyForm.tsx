import React, { FC, useEffect, useState } from 'react';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
} from '@mui/material';
import { IdNameType } from '../Types';
import SelectionValidation from '../Validators/SelectionValidation';
import { useDataStore } from '../DataStoreProvider';

interface EmptyFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (managerOptions: IdNameType[]) => void;
}

const EmptyForm: FC<EmptyFormProps> = ({
    open,
    onClose,
    onSubmit,
}) => {

    const {
        managerOptions,
    } = useDataStore();

    const [valid, setValid] = useState(true);

    useEffect(() => {
        // Just set valid for now.  No checking yet.
        setValid(true);
    }, [])

    const handleChange = (
        idNameType: IdNameType,
    ) => {
        // TODO: 9879 do something like change an edit box
        console.log("Changed selecttion in empty " + idNameType);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (onSubmit) {
            onSubmit(managerOptions);
        }
    };

    return (
        <Dialog closeAfterTransition={false} open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Enter Details</DialogTitle>
            <DialogContent>
                <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                    <SelectionValidation
                        label="Managers"
                        value={managerOptions.length > 0 ? managerOptions[0] : { id: "", name: "" }}
                        options={managerOptions}
                        fullWidth
                        onChange={(e) => {
                            handleChange(e);
                        }}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    onClick={handleSubmit} variant="contained"
                    disabled={!valid}
                >
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EmptyForm;