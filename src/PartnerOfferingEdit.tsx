import { FC, useEffect, useReducer, useCallback } from 'react';
import {
    Button,
    TextField,
    Box,
    Stack,
    IconButton,
    Tooltip,
} from '@mui/material';
import { partnerOfferingType } from './Types';
import UrlTextFieldValidation from './Validators/UrlTextFieldValidation';
import SelectionValidation from './Validators/SelectionValidation';
import { useDataStore } from './DataStoreProvider';
import AddIcon from '@mui/icons-material/Add';

interface PartnerOfferingEdit {
    currentPOData: partnerOfferingType;
    userChangedData: boolean;
    validFields: boolean;
}

type ApiType = partnerOfferingType['apis'][number];

type PartnerOfferingEditAction =
    | { type: 'SET_DATA'; newData: partnerOfferingType }
    | { type: 'SET_VALID_FIELDS'; newValidFields: boolean }
    | { type: 'UPDATE_FIELD'; field: keyof partnerOfferingType; value: unknown }
    | { type: 'UPDATE_NESTED'; parent: keyof partnerOfferingType; field: string; value: unknown }
    | { type: 'UPDATE_DEEP_NESTED'; parent: keyof partnerOfferingType; middle: string; field: string; value: unknown }
    | { type: 'UPDATE_API'; apiId: string; updates: Partial<ApiType> }
    | { type: 'ADD_API'; defaultApiType: { id: string; name: string }; defaultAuthType: { id: string; name: string } }
    | { type: 'REMOVE_API'; apiId: string };

function partnerOfferingEditReducer(
    state: PartnerOfferingEdit,
    action: PartnerOfferingEditAction
): PartnerOfferingEdit {
    switch (action.type) {
        case 'SET_DATA':
            return { 
                ...state, 
                currentPOData: action.newData,
            };

        case 'SET_VALID_FIELDS':
            return { ...state, validFields: action.newValidFields };

        case 'UPDATE_FIELD':
            return {
                ...state,
                currentPOData: {
                    ...state.currentPOData,
                    [action.field]: action.value,
                },
                userChangedData: true,
            };

        case 'UPDATE_NESTED':
            return {
                ...state,
                currentPOData: {
                    ...state.currentPOData,
                    [action.parent]: {
                        ...(state.currentPOData[action.parent] as Record<string, unknown>),
                        [action.field]: action.value,
                    },
                },
                userChangedData: true,
            };

        case 'UPDATE_DEEP_NESTED':
            return {
                ...state,
                currentPOData: {
                    ...state.currentPOData,
                    [action.parent]: {
                        ...(state.currentPOData[action.parent] as Record<string, unknown>),
                        [action.middle]: {
                            ...((state.currentPOData[action.parent] as Record<string, unknown>)?.[action.middle] as Record<string, unknown> || {}),
                            [action.field]: action.value,
                        },
                    },
                },
                userChangedData: true,
            };

        case 'UPDATE_API':
            return {
                ...state,
                currentPOData: {
                    ...state.currentPOData,
                    apis: state.currentPOData.apis.map((a) =>
                        a.id === action.apiId ? { ...a, ...action.updates } : a
                    ),
                },
                userChangedData: true,
            };

        case 'ADD_API':
            return {
                ...state,
                currentPOData: {
                    ...state.currentPOData,
                    apis: [
                        {
                            id: crypto.randomUUID(),
                            docLink: '',
                            trainingLink: '',
                            sandboxEnvironment: '',
                            endpoint: '',
                            apiType: action.defaultApiType,
                            authenticationType: action.defaultAuthType,
                            authenticationInfo: '',
                        },
                        ...state.currentPOData.apis,
                    ],
                },
                userChangedData: true,
            };

        case 'REMOVE_API':
            return {
                ...state,
                currentPOData: {
                    ...state.currentPOData,
                    apis: state.currentPOData.apis.filter((x) => x.id !== action.apiId),
                },
                userChangedData: true,
            };

        default:
            return state;
    }
}

interface PartnerOfferingEditProps {
    partnerOfferingData: partnerOfferingType;
    onValid?: (valid: boolean) => void;
    onUserChangedData?: (valid: boolean) => void;
}

const PartnerOfferingEdit: FC<PartnerOfferingEditProps> = ({
    partnerOfferingData,
    onValid,
    onUserChangedData,
}) => {

    const {
        connectionStatusOptions,
        nwnOfferingOptions,
        companyOptions,
        priorityOptions,
        apiTypeOptions,
        authenticationTypeOptions,
    } = useDataStore();

    const [state, dispatch] = useReducer(partnerOfferingEditReducer, {
        currentPOData: partnerOfferingData,
        userChangedData: false,
        validFields: true,
    });

    useEffect(() => {
        onValid && onValid(state.validFields);
    }, [state.validFields])

    useEffect(() => {
        onUserChangedData && onUserChangedData(state.userChangedData);
    }, [state.userChangedData])

    useEffect(() => {
        dispatch({ type: 'SET_DATA', newData: partnerOfferingData });
    }, [partnerOfferingData]);

    const handleChange = useCallback((field: keyof partnerOfferingType, value: unknown) => {
        dispatch({ type: 'UPDATE_FIELD', field, value });
    }, []);

    const handleNestedChange = useCallback(
        (parent: keyof partnerOfferingType, field: string, value: unknown) => {
            dispatch({ type: 'UPDATE_NESTED', parent, field, value });
        },
        []
    );

    const handleDeepNestedChange = useCallback(
        (parent: keyof partnerOfferingType, middle: string, field: string, value: unknown) => {
            dispatch({ type: 'UPDATE_DEEP_NESTED', parent, middle, field, value });
        },
        []
    );

    const handleApiChange = useCallback(
        (apiId: string, updates: Partial<ApiType>) => {
            dispatch({ type: 'UPDATE_API', apiId, updates });
        },
        []
    );

    const handleAddApi = useCallback(() => {
        // Get the first available option or empty object as fallback
        const defaultApiType = apiTypeOptions.find(opt => opt.name !== '') || { id: '', name: '' };
        const defaultAuthType = authenticationTypeOptions.find(opt => opt.name !== '') || { id: '', name: '' };

        dispatch({
            type: 'ADD_API',
            defaultApiType,
            defaultAuthType
        });
    }, [apiTypeOptions, authenticationTypeOptions]);

    const handleRemoveApi = useCallback((id: string) => {
        dispatch({ type: 'REMOVE_API', apiId: id });
    }, []);

    const handleNwnOfferingChange = useCallback(
        (e: { id: string; name: string }) => {
            handleNestedChange('nwnOffering', 'id', e.id);
            handleNestedChange('nwnOffering', 'name', e.name);

            const nwnOffering = nwnOfferingOptions.find((x) => x.id === e.id);
            if (nwnOffering) {
                handleDeepNestedChange('nwnOffering', 'manager', 'id', nwnOffering.manager.id);
                handleDeepNestedChange('nwnOffering', 'manager', 'name', nwnOffering.manager.name);
            }
        },
        [nwnOfferingOptions, handleNestedChange, handleDeepNestedChange]
    );

    const handleValidChange = useCallback((validEntry: boolean) => {
        dispatch({ type: 'SET_VALID_FIELDS', newValidFields: validEntry });
    }, []);

    return (
        <>
            <Stack direction="column" spacing={2}>
                <TextField
                    label="Offering Name"
                    type="text"
                    value={state.currentPOData.offeringName}
                    onChange={(e) => handleChange('offeringName', e.target.value)}
                    fullWidth
                />
                <TextField
                    label="Contact Info"
                    type="text"
                    value={state.currentPOData.contactInfo}
                    onChange={(e) => handleChange('contactInfo', e.target.value)}
                    fullWidth
                />
                <UrlTextFieldValidation
                    label="Dashboard"
                    urlValue={state.currentPOData.dashboard}
                    canBeEmpty={true}
                    onChange={(e) => handleChange('dashboard', e.target.value)}
                    onValid={handleValidChange}
                    fullWidth
                />
                <TextField
                    label="Notes"
                    type="text"
                    value={state.currentPOData.notes}
                    onChange={(e) => handleChange('notes', e.target.value)}
                    multiline
                    rows={4}
                    fullWidth
                />
                <SelectionValidation
                    label="Connection Status"
                    value={{ id: state.currentPOData.status.id, name: state.currentPOData.status.name }}
                    options={connectionStatusOptions}
                    fullWidth
                    onChange={(e) => {
                        handleNestedChange('status', 'id', e.id);
                        handleNestedChange('status', 'name', e.name);
                    }}
                />
                <SelectionValidation
                    label="NWN Offering"
                    fullWidth
                    value={{ id: state.currentPOData.nwnOffering.id, name: state.currentPOData.nwnOffering.name }}
                    options={nwnOfferingOptions}
                    onChange={handleNwnOfferingChange}
                />
                <SelectionValidation
                    label="Manager"
                    disabled
                    fullWidth
                    value={state.currentPOData.nwnOffering.manager}
                    options={[state.currentPOData.nwnOffering.manager]}
                    onChange={undefined}
                />
                <SelectionValidation
                    label="Company"
                    value={{ id: state.currentPOData.company.id, name: state.currentPOData.company.name }}
                    options={companyOptions}
                    fullWidth
                    onChange={(e) => {
                        handleNestedChange('company', 'id', e.id);
                        handleNestedChange('company', 'name', e.name);
                    }}
                    checkEmpty
                    onValid={handleValidChange}
                />
                <SelectionValidation
                    label="Priority"
                    value={{ id: state.currentPOData.priority.id, name: state.currentPOData.priority.name }}
                    options={priorityOptions}
                    fullWidth
                    onChange={(e) => {
                        handleNestedChange('priority', 'id', e.id);
                        handleNestedChange('priority', 'name', e.name);
                    }}
                />
                <Tooltip title="Add new API">
                    <IconButton
                        onClick={handleAddApi}
                        color="primary"
                        sx={{ alignSelf: 'flex-start', ml: 2, mt: 1 }}
                    >
                        <AddIcon />
                    </IconButton>
                </Tooltip>
            </Stack>
            {state.currentPOData.apis.map((api) => (
                <Box
                    key={api.id}
                    sx={{
                        gap: 10,
                        p: 2,
                        border: '2px solid grey',
                    }}
                >
                    <Stack direction="column" spacing={2}>
                        <SelectionValidation
                            label="API Type"
                            value={{
                                id: api.apiType.id,
                                name: api.apiType.name,
                            }}
                            options={apiTypeOptions}
                            fullWidth
                            onChange={(e) => {
                                handleApiChange(api.id, {
                                    apiType: { id: e.id, name: e.name }
                                });
                            }}
                        />
                        <UrlTextFieldValidation
                            label="Doc Link"
                            urlValue={api.docLink}
                            canBeEmpty={true}
                            onChange={(e) => handleApiChange(api.id, { docLink: e.target.value })}
                            onValid={handleValidChange}
                            fullWidth
                        />
                        <UrlTextFieldValidation
                            label="Training Link"
                            urlValue={api.trainingLink}
                            canBeEmpty={true}
                            onChange={(e) => handleApiChange(api.id, { trainingLink: e.target.value })}
                            onValid={handleValidChange}
                            fullWidth
                        />
                        <TextField
                            label="Sandbox Environment"
                            type="text"
                            value={api.sandboxEnvironment}
                            onChange={(e) => handleApiChange(api.id, { sandboxEnvironment: e.target.value })}
                            multiline
                            rows={4}
                            fullWidth
                        />
                        <TextField
                            label="Endpoint"
                            type="text"
                            value={api.endpoint}
                            onChange={(e) => handleApiChange(api.id, { endpoint: e.target.value })}
                            fullWidth
                        />
                        <SelectionValidation
                            label="Authentication Type"
                            value={{
                                id: api.authenticationType?.id,
                                name: api.authenticationType?.name,
                            }}
                            options={authenticationTypeOptions}
                            fullWidth
                            onChange={(e) => {
                                handleApiChange(api.id, {
                                    authenticationType: { id: e.id, name: e.name }
                                });
                            }}
                        />
                        <TextField
                            label="Authentication Info"
                            type="text"
                            value={api.authenticationInfo}
                            onChange={(e) => handleApiChange(api.id, { authenticationInfo: e.target.value })}
                            fullWidth
                        />
                        <Button
                            onClick={() => handleRemoveApi(api.id)}
                            variant="outlined"
                            color="error"
                        >
                            Remove API
                        </Button>
                    </Stack>
                </Box>
            ))}
        </>
    );
};

export default PartnerOfferingEdit;