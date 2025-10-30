import { Box, Tab, Tabs, Typography } from '@mui/material';
import { useState } from 'react';
import { RenderLinkOrText } from "./RenderLinkOrText";
import { partnerOfferingType } from "./Types";

// Helper component for label-value pairs
const LabelValue = ({ label, value }: { label: string; value?: string }) => (
  <Box sx={{ mt: 1 }}>
    <Typography component="span" sx={{ fontWeight: 'bold' }}>
      {label}:
    </Typography>
    {' '}
    <Typography component="span">
      {value}
    </Typography>
  </Box>
);

// Component to load and display APIs
function ApiList(
  { partnerOffering }:
    {
      partnerOffering: partnerOfferingType
    }
) {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  if (!partnerOffering.apis || partnerOffering.apis.length === 0) {
    return null;
  }

  return (
    <Box>
      <Tabs value={activeTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
        {partnerOffering.apis.map((api, index) => (
          <Tab key={api.id} label={api.apiType.name} value={index} />
        ))}
      </Tabs>

      {partnerOffering.apis.map((api, index) => (
        <Box
          key={api.id}
          role="tabpanel"
          hidden={activeTab !== index}
          sx={{ py: 2 }}
        >
          {activeTab === index && (
            <Box sx={{ padding: 1 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <RenderLinkOrText label="Doc link" value={api.docLink} />
                <RenderLinkOrText label="Training link" value={api.trainingLink} />
                <LabelValue label="Sandbox Environment" value={api.sandboxEnvironment} />
                <LabelValue label="Endpoint" value={api.endpoint} />
                <LabelValue label="Authentication info" value={api.authenticationInfo} />
                <LabelValue label="Authentication type" value={api.authenticationType?.name} />
              </Box>
            </Box>
          )}
        </Box>
      ))}
    </Box>
  );
}

export default ApiList;