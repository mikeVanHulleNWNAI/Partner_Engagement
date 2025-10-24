import React, { FC, useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Stack,
} from '@mui/material';
import { partnerOfferingType } from '../Types';
import UrlTextFieldValidation from '../Validators/UrlTextFieldValidation';
import SelectionValidation from '../Validators/SelectionValidation';
import SelectionNwnOfferingValidation from '../Validators/SelectionNwnOfferingValidation';
import { useDataStore } from '../DataStoreProvider';

interface EditPartnerOfferingProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: partnerOfferingType) => void;
  partnerOfferingData: partnerOfferingType;
}

const EditPartnerOfferingForm: FC<EditPartnerOfferingProps> = ({
  open,
  onClose,
  onSubmit,
  partnerOfferingData,
}) => {

  const [formData, setFormData] = useState<partnerOfferingType>(partnerOfferingData);
  const [valid, setValid] = useState(true);
  const [activeApiNumber, setActiveApiNumber] = useState(formData.apis.length > 0 ? 0 : null);

  useEffect(() => {
    setFormData(partnerOfferingData);
    setActiveApiNumber(partnerOfferingData.apis.length > 0 ? 0 : null);
  }, [partnerOfferingData]);

  const {
    connectionStatusOptions,
    nwnOfferingOptions,
    companyOptions,
    priorityOptions,
    apiTypeOptions,
    authenticationTypeOptions,
  } = useDataStore();

  const handleChange = (
    field: string,
    value: unknown
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedChange = (
    parent: keyof partnerOfferingType,
    field: string,
    value: unknown
  ) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...(prev[parent] as Record<string, unknown>),
        [field]: value,
      },
    }));
  };

  const handleDeepNestedChange = (
    parent: keyof partnerOfferingType,
    middle: string,
    field: string,
    value: unknown
  ) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...(prev[parent] as Record<string, unknown>),
        [middle]: {
          ...((prev[parent] as Record<string, unknown>)?.[middle] as Record<string, unknown> || {}),
          [field]: value,
        },
      },
    }));
  };

  const handleApiChange = (
    index: number,
    field: string,
    value: unknown
  ) => {
    setFormData((prev) => ({
      ...prev,
      apis: prev.apis.map((api, i) =>
        i === index ? { ...api, [field]: value } : api
      ),
    }));
  };

  const handleApiNestedChange = (
    index: number,
    parent: string,
    field: string,
    value: unknown
  ) => {
    setFormData((prev) => ({
      ...prev,
      apis: prev.apis.map((api, i) =>
        i === index
          ? {
            ...api,
            [parent]: {
              ...(api[parent as keyof typeof api] as object),
              [field]: value,
            },
          }
          : api
      ),
    }));
  };

  /* TODO: 9879 need to add the ability to add and remove APIS
  const addApi = () => {
    const newId = `api-${Date.now()}`;
    setFormData((prev) => ({
      ...prev,
      apis: [
        ...prev.apis,
        {
          docLink: '',
          trainingLink: '',
          sandboxEnvironment: '',
          endpoint: '',
          authenticationInfo: '',
          id: newId,
          apiType: { id: '', name: '' },
          authenticationType: { id: '', name: '' },
        },
      ],
    }));
    setExpandedApis(prev => new Set([...prev, newId]));
  };

  const removeApi = (index: number) => {
    const apiId = formData.apis[index].id;
    setFormData((prev) => ({
      ...prev,
      apis: prev.apis.filter((_, i) => i !== index),
    }));
    setExpandedApis(prev => {
      const newSet = new Set(prev);
      newSet.delete(apiId);
      return newSet;
    });
  };
  */

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <Dialog closeAfterTransition={false} open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Enter Details</DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField
            label="Offering Name"
            type="text"
            value={formData.offeringName}
            onChange={(e) => handleChange('offeringName', e.target.value)}
            fullWidth
          />
          <TextField
            label="Contact Info"
            type="text"
            value={formData.contactInfo}
            onChange={(e) => handleChange('contactInfo', e.target.value)}
            fullWidth
          />
          <UrlTextFieldValidation
            label="Dashboard"
            urlValue={formData.dashboard}
            canBeEmpty={true}
            onChange={(e) => handleChange('dashboard', e.target.value)}
            onValid={(validEntry) => setValid(validEntry)}
            fullWidth
          />
          <TextField
            label="Notes"
            type="text"
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            multiline
            rows={4}
            fullWidth
          />
          <SelectionValidation
            label="Connection Status"
            value={{ id: formData.status.id, name: formData.status.name }}
            options={connectionStatusOptions}
            fullWidth
            onChange={(e) => {
              handleNestedChange("status", "id", e.id);
              handleNestedChange("status", "name", e.name);
            }}
          />
          <SelectionNwnOfferingValidation
            label="NWN Offering"
            value={{
              nwnOffering: { id: formData.nwnOffering.id, name: formData.nwnOffering.name },
              manager: { id: formData.nwnOffering.manager.id, name: formData.nwnOffering.manager.name }
            }}
            options={nwnOfferingOptions}
            fullWidth
            onChange={(e) => {
              handleNestedChange("nwnOffering", "id", e.nwnOffering.id);
              handleNestedChange("nwnOffering", "name", e.nwnOffering.name);
              handleDeepNestedChange("nwnOffering", "manager", "id", e.manager.id);
              handleDeepNestedChange("nwnOffering", "manager", "name", e.manager.name);
            }}
          />
          <SelectionValidation
            label="Company"
            value={{ id: formData.company.id, name: formData.company.name }}
            options={companyOptions}
            fullWidth
            onChange={(e) => {
              handleNestedChange("company", "id", e.id);
              handleNestedChange("company", "name", e.name);
            }}
          />
          <SelectionValidation
            label="Priority"
            value={{ id: formData.priority.id, name: formData.priority.name }}
            options={priorityOptions}
            fullWidth
            onChange={(e) => {
              handleNestedChange("priority", "id", e.id);
              handleNestedChange("priority", "name", e.name);
            }}
          />
          {activeApiNumber != null ? (
            <>
              <SelectionValidation
                label="APIs"
                value={{
                  id: formData.apis[activeApiNumber].id,
                  name: formData.apis[activeApiNumber].apiType.name
                }}
                options={formData.apis.map((a) => ({
                  id: a.id,
                  name: a.apiType.name
                }))}
                onChange={(e) => {
                  setActiveApiNumber(formData.apis.findIndex((a) => a.id === e.id));
                }}
                fullWidth />
              <Box
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
                      id: formData.apis[activeApiNumber].apiType.id,
                      name: formData.apis[activeApiNumber].apiType.name
                    }}
                    options={apiTypeOptions}
                    fullWidth
                    onChange={(e) => {
                      handleApiNestedChange(activeApiNumber, "apiType", "id", e.id);
                      handleApiNestedChange(activeApiNumber, "apiType", "name", e.name);
                    }}
                  />
                  <UrlTextFieldValidation
                    label="Doc Link"
                    urlValue={formData.apis[activeApiNumber].docLink}
                    canBeEmpty={true}
                    onChange={(e) => handleApiChange(activeApiNumber, 'docLink', e.target.value)}
                    onValid={(validEntry) => setValid(validEntry)}
                    fullWidth
                  />
                  <UrlTextFieldValidation
                    label="Training Link"
                    urlValue={formData.apis[activeApiNumber].trainingLink}
                    canBeEmpty={true}
                    onChange={(e) => handleApiChange(activeApiNumber, 'trainingLink', e.target.value)}
                    onValid={(validEntry) => setValid(validEntry)}
                    fullWidth
                  />
                  <TextField
                    label="Sandbox Environment"
                    type="text"
                    value={formData.apis[activeApiNumber].sandboxEnvironment}
                    onChange={(e) => handleApiChange(activeApiNumber, 'sandboxEndironment', e.target.value)}
                    multiline
                    rows={4}
                    fullWidth
                  />
                  <TextField
                    label="Endpoint"
                    type="text"
                    value={formData.apis[activeApiNumber].endpoint}
                    onChange={(e) => handleApiChange(activeApiNumber, 'endpoint', e.target.value)}
                    fullWidth
                  />
                  <SelectionValidation
                    label="Authentication Type"
                    value={{
                      id: formData.apis[activeApiNumber].authenticationType?.id,
                      name: formData.apis[activeApiNumber].authenticationType?.name
                    }}
                    options={authenticationTypeOptions}
                    fullWidth
                    onChange={(e) => {
                      handleApiNestedChange(activeApiNumber, "authenticationType", "id", e.id);
                      handleApiNestedChange(activeApiNumber, "authenticationType", "name", e.name);
                    }}
                  />
                  <TextField
                    label="Authentication Info"
                    type="text"
                    value={formData.apis[activeApiNumber].authenticationInfo}
                    onChange={(e) => handleApiChange(activeApiNumber, 'authenticationInfo', e.target.value)}
                    fullWidth
                  />
                </Stack>
              </Box>
            </>
          ) : (
            <div>No APIs</div>
          )}
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

export default EditPartnerOfferingForm;