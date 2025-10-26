import React, { FC, useReducer } from 'react';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Box,
    Tooltip,
    IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { IdNameType } from '../Types';
import { useDataStore } from '../DataStoreProvider';
import AreYouSureForm from './AreYouSureForm';

// TODO: 9879 need to make the buttons pretty

interface IdNamesFormState {
    formData: IdNameType[];
    deleteConfirmOpen: boolean;
    itemToDelete: IdNameType | null;
}

type IdNamesFormAction =
    | { type: 'UPDATE', idNameType: IdNameType }
    | { type: 'REMOVE', idNameType: IdNameType }
    | { type: 'ADD', idNameType: IdNameType }
    | { type: 'OPEN_DELETE_CONFIRM', idNameType: IdNameType }
    | { type: 'CLOSE_DELETE_CONFIRM' }
    | { type: 'CONFIRM_DELETE' }

function idNameFormReducer(state: IdNamesFormState, action: IdNamesFormAction): IdNamesFormState {
    switch (action.type) {
        case 'UPDATE':
            {
                const updatedFormData = state.formData.map(x =>
                    x.id === action.idNameType.id
                        ? { ...x, name: action.idNameType.name }
                        : x
                );
                return { ...state, formData: updatedFormData };
            }
        case 'ADD':
            {
                const updatedFormData = [action.idNameType, ...state.formData];
                return { ...state, formData: updatedFormData };
            }
        case 'REMOVE':
            {
                const updatedFormData = state.formData.filter(x => x.id !== action.idNameType.id);
                return { ...state, formData: updatedFormData };
            }
        case 'OPEN_DELETE_CONFIRM':
            {
                return {
                    ...state,
                    deleteConfirmOpen: true,
                    itemToDelete: action.idNameType
                };
            }
        case 'CLOSE_DELETE_CONFIRM':
            {
                return {
                    ...state,
                    deleteConfirmOpen: false,
                    itemToDelete: null
                };
            }
        case 'CONFIRM_DELETE':
            {
                if (!state.itemToDelete) return state;
                const updatedFormData = state.formData.filter(x => x.id !== state.itemToDelete!.id);
                return {
                    ...state,
                    formData: updatedFormData,
                    deleteConfirmOpen: false,
                    itemToDelete: null
                };
            }
    }
}

type EntityType = 
    'Companies'
    | 'Priorities'
    | 'Statuses'
    | 'NWNOfferings'
    | 'Managers'
    | 'ApiTypes'
    | 'AuthenticationTypes';

interface IdNamesFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (formData: IdNameType[]) => void;
    idNames: IdNameType[];
    entityType: EntityType;
}

const IdNamesForm: FC<IdNamesFormProps> = ({
    open,
    onClose,
    onSubmit,
    idNames,
    entityType,
}) => {

    const [state, dispatch] =
        useReducer(idNameFormReducer, {
            formData: idNames.filter(item => item.name !== ""),
            deleteConfirmOpen: false,
            itemToDelete: null
        })

    const {
        allPartnerOfferings,
        isLoading
    } = useDataStore();


    // Check if an ID is in use by any partner offering
    const isIdInUse = (id: string): boolean => {
        return allPartnerOfferings.some(offering => {
            switch (entityType) {
                case 'Companies':
                    return offering.company.id === id;
                case 'Priorities':
                    return offering.priority.id === id;
                case 'Statuses':
                    return offering.status.id === id;
                case 'NWNOfferings':
                    return offering.nwnOffering.id === id;
                case 'Managers':
                    return offering.nwnOffering.manager.id === id;
                case 'ApiTypes':
                    return offering.apis.some(api => api.apiType.id === id);
                case 'AuthenticationTypes':
                    return offering.apis.some(api => api.authenticationType.id === id);
                default:
                    return false;
            }
        });
    };

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

    const handleDeleteClick = (item: IdNameType) => {
        dispatch({
            type: 'OPEN_DELETE_CONFIRM',
            idNameType: item
        });
    };

    const handleDeleteConfirm = () => {
        dispatch({ type: 'CONFIRM_DELETE' });
    };

    const handleDeleteCancel = () => {
        dispatch({ type: 'CLOSE_DELETE_CONFIRM' });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (onSubmit) {
            onSubmit(state.formData);
        }
    };

    return (
        <>
            <Dialog closeAfterTransition={false} open={open} onClose={onClose} maxWidth="sm" fullWidth>
                <DialogTitle>Enter details for {entityType}</DialogTitle>
                {!isLoading && (
                    <>
                        <IconButton
                            onClick={handleAdd}
                            color="primary"
                            sx={{ alignSelf: 'flex-start', ml: 2, mt: 1 }}
                        >
                            <AddIcon />
                        </IconButton>
                        <DialogContent>
                            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                                {state.formData
                                    .map((item, index) => {
                                        const inUse = isIdInUse(item.id);
                                        return (
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
                                                <Tooltip
                                                    title={inUse ? "Cannot delete - in use by partner offerings" : "Delete"}
                                                    arrow
                                                >
                                                    <span>
                                                        <IconButton
                                                            color="error"
                                                            onClick={() => handleDeleteClick(item)}
                                                            disabled={inUse}
                                                            sx={{ mt: 1 }}
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </span>
                                                </Tooltip>
                                            </Box>
                                        );
                                    })}
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
                    </>
                )}
            </Dialog>

            <AreYouSureForm
                open={state.deleteConfirmOpen}
                onClose={handleDeleteCancel}
                onYes={handleDeleteConfirm}
                label={`Are you sure you want to delete "${state.itemToDelete?.name}"?`}
            />
        </>
    );
};

export default IdNamesForm;