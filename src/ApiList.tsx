import { Box, List, ListItem, Typography } from '@mui/material';
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

  return (
    <List sx={{ p: 0 }}>
      {partnerOffering.apis?.map((api) => (
        <ListItem
          key={api.id}
          sx={{
            display: 'block',
            px: 0,
            py: 2,
            '&:not(:last-child)': {
              borderBottom: 1,
              borderColor: 'divider',
            },
          }}
        >
          <Box sx={{ padding: 1 }}>
            <Typography
              variant="h6"
              sx={{
                fontSize: '1.4em',
                fontWeight: 'bold',
                color: 'mediumpurple',
              }}
            >
              {api.apiType.name}
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5}}>
              <RenderLinkOrText label="Doc link" value={api.docLink} />
              <RenderLinkOrText label="Training link" value={api.trainingLink} />
              <LabelValue label="Sandbox Environment" value={api.sandboxEnvironment} />
              <LabelValue label="Endpoint" value={api.endpoint} />
              <LabelValue label="Authentication info" value={api.authenticationInfo} />
              <LabelValue label="Authentication type" value={api.authenticationType?.name} />
            </Box>
          </Box>
        </ListItem>
      ))}
    </List>
  );
}

export default ApiList;