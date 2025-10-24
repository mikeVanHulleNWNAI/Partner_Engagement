import { Box } from '@mui/material';
import UserInterface from './UserInterface';
import { DataStoreProvider } from './DataStoreProvider';

function App() {
  return (
    <DataStoreProvider>
      <Box>
        <UserInterface />
      </Box>
    </DataStoreProvider>
  );
}

export default App;