import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
} from '@mui/material';
import { partnerOfferingType } from './Types';
import UrlTextFieldValidation from './Validators/UrlTextFieldValidation';
import SelectionValidation from './Validators/SelectionValidation';

interface EditPartnerOfferingProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: partnerOfferingType) => void;
  partnerOfferingData: partnerOfferingType;
  connectionStatusOptions: { id: string; name: string }[];
  nwnOfferingOptions: { id: string; name: string; manager: { id: string } }[];
  managerOptions: { id: string; name: string }[];
  companyOptions: { id: string; name: string }[];
  priorityOptions: { id: string; name: string }[];
  apiTypeOptions: { id: string; name: string }[];
  authenticationTypeOptions: { id: string; name: string }[];
}

const EditPartnerOfferingForm: React.FC<EditPartnerOfferingProps> = ({
  open,
  onClose,
  onSubmit,
  partnerOfferingData,
  connectionStatusOptions,
  nwnOfferingOptions,
  managerOptions,
  companyOptions,
  priorityOptions,
  apiTypeOptions,
  authenticationTypeOptions,
}) => {

  const [formData, setFormData] = useState<partnerOfferingType>(partnerOfferingData);
  const [expandedApis, setExpandedApis] = useState<Set<string>>(new Set(partnerOfferingData.apis.map(api => api.id)));
  const [valid, setValid] = useState(true);

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
    value: object
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
    value: object
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
          apiType: { name: '' },
          authenticationType: { name: '' },
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

  const toggleApiExpanded = (apiId: string) => {
    setExpandedApis(prev => {
      const newSet = new Set(prev);
      if (newSet.has(apiId)) {
        newSet.delete(apiId);
      } else {
        newSet.add(apiId);
      }
      return newSet;
    });
  };

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
            value={formData.status.name}
            options={connectionStatusOptions}
            fullWidth
            onChange={(e) => handleNestedChange("status", "name", e.target.value)}
          />
          {/* TODO: 9879 add manager */}
          <SelectionValidation
            label="NWN Offering"
            value={formData.nwnOffering.name}
            options={nwnOfferingOptions}
            fullWidth
            onChange={(e) => handleNestedChange("nwnOffering", "name", e.target.value)}
          />
          <SelectionValidation
            label="Company"
            value={formData.company.name}
            options={companyOptions}
            fullWidth
            onChange={(e) => handleNestedChange("company", "name", e.target.value)}
          />
          <SelectionValidation
            label="Priority"
            value={formData.priority.name}
            options={priorityOptions}
            fullWidth
            onChange={(e) => handleNestedChange("priority", "name", e.target.value)}
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

export default EditPartnerOfferingForm;