import React, { useReducer, useRef, useMemo, useCallback } from 'react';
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
    | { type: 'UPDATE'; idName: T }
    | { type: 'REMOVE'; idName: T }
    | { type: 'ADD'; idName: T }
    | { type: 'OPEN_DELETE_CONFIRM'; idName: T }
    | { type: 'CLOSE_DELETE_CONFIRM' }
    | { type: 'CONFIRM_DELETE' };

function idNameFormReducer<T extends IIdName>(
    state: IdNamesFormState<T>,
    action: IdNamesFormAction<T>
): IdNamesFormState<T> {
    switch (action.type) {
        case 'UPDATE':
            return {
                ...state,
                formData: state.formData.map(x =>
                    x.id === action.idName.id ? { ...x, ...action.idName } : x
                ),
            };
        case 'ADD':
            return { ...state, formData: [action.idName, ...state.formData] };
        case 'REMOVE':
            return {
                ...state,
                formData: state.formData.filter(x => x.id !== action.idName.id),
            };
        case 'OPEN_DELETE_CONFIRM':
            return {
                ...state,
                deleteConfirmOpen: true,
                itemToDelete: action.idName,
            };
        case 'CLOSE_DELETE_CONFIRM':
            return {
                ...state,
                deleteConfirmOpen: false,
                itemToDelete: null,
            };
        case 'CONFIRM_DELETE':
            if (!state.itemToDelete) return state;
            return {
                ...state,
                formData: state.formData.filter(x => x.id !== state.itemToDelete!.id),
                deleteConfirmOpen: false,
                itemToDelete: null,
            };
        default:
            return state;
    }
}

type EntityType =
    | 'Companies'
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
    const [state, dispatch] = useReducer(idNameFormReducer<T>, {
        formData: idNames.filter(item => item.name !== ''),
        deleteConfirmOpen: false,
        itemToDelete: null,
    });

    const { allPartnerOfferings, managerOptions } = useDataStore();
    const firstFieldRef = useRef<HTMLDivElement>(null);

    // Memoize ID usage check
    const idsInUse = useMemo(() => {
        const ids = new Set<string>();
        allPartnerOfferings.forEach(offering => {
            switch (entityType) {
                case 'Companies':
                    ids.add(offering.company.id);
                    break;
                case 'Priorities':
                    ids.add(offering.priority.id);
                    break;
                case 'ConnectionStatuses':
                    ids.add(offering.status.id);
                    break;
                case 'NWNOfferings':
                    ids.add(offering.nwnOffering.id);
                    break;
                case 'Managers':
                    ids.add(offering.nwnOffering.manager.id);
                    break;
                case 'ApiTypes':
                    offering.apis.forEach(api => ids.add(api.apiType.id));
                    break;
                case 'AuthenticationTypes':
                    offering.apis.forEach(api => ids.add(api.authenticationType.id));
                    break;
            }
        });
        return ids;
    }, [allPartnerOfferings, entityType]);

    // Memoize duplicate names
    const duplicateNames = useMemo(() => {
        const names = state.formData
            .map(item => item.name.trim())
            .filter(name => name !== '');
        return new Set(names.filter((name, index) => names.indexOf(name) !== index));
    }, [state.formData]);

    // Memoize validation
    const { isValid } = useMemo(() => {
        const hasEmpty = state.formData.some(item => item.name.trim() === '');
        const hasDupes = duplicateNames.size > 0;
        return {
            isValid: state.formData.length > 0 && !hasEmpty && !hasDupes,
        };
    }, [state.formData, duplicateNames]);

    const handleAdd = useCallback(() => {
        let newItem: T;
        if (entityType !== 'NWNOfferings') {
            newItem = { id: crypto.randomUUID(), name: '' } as T;
        } else {
            const manager = managerOptions.find(x => x.name === '');
            newItem = {
                id: crypto.randomUUID(),
                name: '',
                manager: { id: manager?.id, name: manager?.name },
            } as unknown as T;
        }
        dispatch({ type: 'ADD', idName: newItem });

        setTimeout(() => {
            firstFieldRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            });
        }, 0);
    }, [entityType, managerOptions]);

    const handleDeleteClick = useCallback((item: T) => {
        dispatch({ type: 'OPEN_DELETE_CONFIRM', idName: item });
    }, []);

    const handleDeleteConfirm = useCallback(() => {
        dispatch({ type: 'CONFIRM_DELETE' });
    }, []);

    const handleDeleteCancel = useCallback(() => {
        dispatch({ type: 'CLOSE_DELETE_CONFIRM' });
    }, []);

    const handleSubmit = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            onSubmit(state.formData);
        },
        [onSubmit, state.formData]
    );

    const handleNameChange = useCallback((item: T, value: string) => {
        dispatch({
            type: 'UPDATE',
            idName: { ...item, name: value },
        });
    }, []);

    const handleManagerChange = useCallback(
        (item: T, managerId: string) => {
            const selectedManager = managerOptions.find(m => m.id === managerId);
            if (selectedManager) {
                dispatch({
                    type: 'UPDATE',
                    idName: { ...item, manager: selectedManager } as T,
                });
            }
        },
        [managerOptions]
    );

    return (
        <>
            <Dialog
                closeAfterTransition={false}
                open={open}
                onClose={onClose}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Enter details for {entityType}</DialogTitle>
                <Tooltip title="Add new item">
                    <IconButton
                        onClick={handleAdd}
                        color="primary"
                        sx={{ alignSelf: 'flex-start', ml: 2, mt: 1 }}
                    >
                        <AddIcon />
                    </IconButton>
                </Tooltip>
                <DialogContent>
                    <Box
                        component="form"
                        sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}
                    >
                        {state.formData.map((item, index) => {
                            const inUse = idsInUse.has(item.id);
                            const trimmedName = item.name.trim();
                            const isEmpty = trimmedName === '';
                            const isDuplicate = duplicateNames.has(trimmedName);

                            return (
                                <Box
                                    key={item.id}
                                    sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}
                                >
                                    <TextField
                                        label={item.name}
                                        ref={index === 0 ? firstFieldRef : null}
                                        type="text"
                                        value={item.name}
                                        onChange={e => handleNameChange(item, e.target.value)}
                                        error={isEmpty || isDuplicate}
                                        helperText={
                                            isEmpty
                                                ? 'Cannot be empty'
                                                : isDuplicate
                                                    ? 'Duplicate name'
                                                    : ''
                                        }
                                        fullWidth
                                    />
                                    {entityType === 'NWNOfferings' && (
                                        <TextField
                                            select
                                            label="Manager"
                                            value={(item as unknown as IIdNameAndManager).manager.id}
                                            onChange={e => handleManagerChange(item, e.target.value)}
                                            sx={{ minWidth: 200 }}
                                            slotProps={{
                                                select: {
                                                    native: true,
                                                },
                                            }}
                                        >
                                            {managerOptions.map(manager => (
                                                <option key={manager.id} value={manager.id}>
                                                    {manager.name}
                                                </option>
                                            ))}
                                        </TextField>
                                    )}
                                    <Tooltip
                                        title={
                                            inUse
                                                ? 'Cannot delete - in use by partner offerings'
                                                : 'Delete'
                                        }
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
                    <Button onClick={handleSubmit} variant="contained" disabled={!isValid}>
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