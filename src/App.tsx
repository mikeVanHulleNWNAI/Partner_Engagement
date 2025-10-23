import { Box } from '@mui/material';
import UserInterface from './UserInterface';
import { DatabaseSubscriptionProvider } from './DatabaseSubscriptionProvider';

function App() {
  return (
    <DatabaseSubscriptionProvider>
      <Box>
        <UserInterface />
      </Box>
    </DatabaseSubscriptionProvider>
  );
}

export default App;