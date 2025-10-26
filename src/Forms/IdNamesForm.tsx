import React, { FC, useReducer } from 'react';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Box,
} from '@mui/material';
import { IdNameType } from '../Types';

// TODO: 9879 need to make the buttons pretty
// TODO: 9879 need to ask "are you sure" before deletion.

interface IdNamesFormState {
    formData: IdNameType[]
}

type IdNamesFormAction =
    | { type: 'UPDATE', idNameType: IdNameType }
    | { type: 'REMOVE', idNameType: IdNameType }
    | { type: 'ADD', idNameType: IdNameType }

function idNameFormReducer(state: IdNamesFormState, action: IdNamesFormAction): IdNamesFormState {
    switch (action.type) {
        case 'UPDATE':
            {
                const updatedFormData = state.formData.map(x =>
                    x.id === action.idNameType.id
                        ? { ...x, name: action.idNameType.name }
                        : x
                );
                return { formData: updatedFormData };
            }
        case 'ADD':
            {
                const updatedFormData = [action.idNameType, ...state.formData];
                return { formData: updatedFormData };
            }
        case 'REMOVE':
            {
                const updatedFormData = state.formData.filter(x => x.id !== action.idNameType.id);
                return { formData: updatedFormData };
            }
    }
}

interface IdNamesFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (formData: IdNameType[]) => void;
    idNames: IdNameType[];
}

const IdNamesForm: FC<IdNamesFormProps> = ({
    open,
    onClose,
    onSubmit,
    idNames,
}) => {

    const [state, dispatch] =
        useReducer(idNameFormReducer, {
            formData: idNames.filter(item => item.name !== "")
        })

    const hasDuplicates = state.formData.some((item, index) =>
        state.formData.findIndex(x => x.name.trim() !== "" && x.name === item.name) !== index
    );

    const firstFieldRef = React.useRef<HTMLDivElement>(null);

    const hasEmptyFields = state.formData.some(item => item.name.trim() === "");

    const isValid = state.formData.length > 0 && !hasEmptyFields && !hasDuplicates;

    const getDuplicateNames = () => {
        const names = state.formData.map(item => item.name.trim()).filter(name => name !== "");
        return names.filter((name, index) => names.indexOf(name) !== index);
    };

    const duplicateNames = getDuplicateNames();

    const handleAdd = () => {
        dispatch({
            type: 'ADD',
            idNameType: { id: crypto.randomUUID(), name: "" }
        })

        // Scroll to top after state updates
        setTimeout(() => {
            firstFieldRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 0);
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (onSubmit) {
            onSubmit(state.formData);
        }
    };

    return (
        <Dialog closeAfterTransition={false} open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Enter Details</DialogTitle>
            <Button
                onClick={handleAdd}
            >
                Add
            </Button>
            <DialogContent>
                <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                    {state.formData
                        .map((item, index) => (
                            <Box key={item.id} sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                                <TextField
                                    key={item.id}
                                    label={item.name}
                                    ref={index === 0 ? firstFieldRef : null}
                                    type="text"
                                    value={item.name}
                                    onChange={(e) => {
                                        dispatch({
                                            type: 'UPDATE',
                                            idNameType: { id: item.id, name: e.target.value },
                                        })
                                    }}
                                    error={
                                        item.name.trim() === "" ||
                                        duplicateNames.includes(item.name.trim())
                                    }
                                    helperText={
                                        item.name.trim() === ""
                                            ? "Cannot be empty"
                                            : duplicateNames.includes(item.name.trim())
                                                ? "Duplicate name"
                                                : ""
                                    }
                                    fullWidth
                                />
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={() => {
                                        dispatch({
                                            type: 'REMOVE',
                                            idNameType: item,
                                        })
                                    }}
                                    sx={{ minWidth: 'auto', mt: 1 }}
                                >
                                    Delete
                                </Button>
                            </Box>
                        ))}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    onClick={handleSubmit} variant="contained"
                    disabled={!isValid}
                >
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default IdNamesForm;