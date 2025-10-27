import React, { useReducer } from 'react';
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
import { IIdName, IIdNameAndManager } from '../Types';
import { useDataStore } from '../DataStoreProvider';
import AreYouSureForm from './AreYouSureForm';

interface IdNamesFormState<T extends IIdName> {
    formData: T[];
    deleteConfirmOpen: boolean;
    itemToDelete: T | null;
}

type IdNamesFormAction<T extends IIdName> =
    | { type: 'UPDATE', idName: T }
    | { type: 'REMOVE', idName: T }
    | { type: 'ADD', idName: T }
    | { type: 'OPEN_DELETE_CONFIRM', idName: T }
    | { type: 'CLOSE_DELETE_CONFIRM' }
    | { type: 'CONFIRM_DELETE' }

function idNameFormReducer<T extends IIdName>(state: IdNamesFormState<T>, action: IdNamesFormAction<T>): IdNamesFormState<T> {
    switch (action.type) {
        case 'UPDATE':
            {
                const updatedFormData = state.formData.map(x =>
                    x.id === action.idName.id
                        ? { ...x, ...action.idName }
                        : x
                );
                return { ...state, formData: updatedFormData };
            }
        case 'ADD':
            {
                const updatedFormData = [action.idName, ...state.formData];
                return { ...state, formData: updatedFormData };
            }
        case 'REMOVE':
            {
                const updatedFormData = state.formData.filter(x => x.id !== action.idName.id);
                return { ...state, formData: updatedFormData };
            }
        case 'OPEN_DELETE_CONFIRM':
            {
                return {
                    ...state,
                    deleteConfirmOpen: true,
                    itemToDelete: action.idName
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
    | 'ConnectionStatuses'
    | 'NWNOfferings'
    | 'Managers'
    | 'ApiTypes'
    | 'AuthenticationTypes';

interface IdNamesFormProps<T extends IIdName> {
    open: boolean;
    onClose: () => void;
    onSubmit: (formData: T[]) => void;
    idNames: T[];
    entityType: EntityType;
}

function IdNamesForm<T extends IIdName>({
    open,
    onClose,
    onSubmit,
    idNames,
    entityType,
}: IdNamesFormProps<T>) {

    const [state, dispatch] =
        useReducer(idNameFormReducer<T>, {
            formData: idNames.filter(item => item.name !== ""),
            deleteConfirmOpen: false,
            itemToDelete: null
        })

    const {
        allPartnerOfferings,
        managerOptions
    } = useDataStore();


    // Check if an ID is in use by any partner offering
    const isIdInUse = (id: string): boolean => {
        return allPartnerOfferings.some(offering => {
            switch (entityType) {
                case 'Companies':
                    return offering.company.id === id;
                case 'Priorities':
                    return offering.priority.id === id;
                case 'ConnectionStatuses':
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
        // Create a basic IIdName object and cast to T
        let newItem;
        if (entityType !== 'NWNOfferings') {
            newItem = { id: crypto.randomUUID(), name: "" } as T;
        }
        else {
            // this is an NWNOffering
            // find the blank manager
            const manager = managerOptions.find(x => x.name === "")
            newItem = {
                id: crypto.randomUUID(),
                name: "",
                manager: { id: manager?.id, name: manager?.name }
            } as unknown as T
        }
        dispatch({
            type: 'ADD',
            idName: newItem
        })

        // Scroll to top after state updates
        setTimeout(() => {
            firstFieldRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 0);
    }

    const handleDeleteClick = (item: T) => {
        dispatch({
            type: 'OPEN_DELETE_CONFIRM',
            idName: item
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
                                                    idName: { ...item, name: e.target.value },
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
                                        {entityType === 'NWNOfferings' && (
                                            <TextField
                                                select
                                                label="Manager"
                                                value={(item as unknown as IIdNameAndManager).manager.id}
                                                onChange={(e) => {
                                                    const selectedManager = managerOptions.find(m => m.id === e.target.value);
                                                    if (selectedManager) {
                                                        dispatch({
                                                            type: 'UPDATE',
                                                            idName: {
                                                                ...item,
                                                                manager: selectedManager
                                                            } as T,
                                                        });
                                                    }
                                                }}
                                                sx={{ minWidth: 200 }}
                                                slotProps={{
                                                    select: {
                                                        native: true,
                                                    },
                                                }}
                                            >
                                                {managerOptions.map((manager) => (
                                                    <option key={manager.id} value={manager.id}>
                                                        {manager.name}
                                                    </option>
                                                ))}
                                            </TextField>
                                        )}
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
            </Dialog>

            <AreYouSureForm
                open={state.deleteConfirmOpen}
                onClose={handleDeleteCancel}
                onYes={handleDeleteConfirm}
                label={`Are you sure you want to delete "${state.itemToDelete?.name}"?`}
            />
        </>
    );
}

export default IdNamesForm;