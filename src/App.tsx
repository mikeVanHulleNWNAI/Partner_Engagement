import { Box } from '@mui/material';
import UserInterface from './UserInterface';
import { DataStoreProvider } from './DataStoreProvider';
import { adjustColorHSL } from './Utils/adjustColor';
import { BODY_COLOR } from './Utils/Constants';

document.body.style.background = adjustColorHSL(BODY_COLOR, +40);

function App() {
  return (
    <>
      <DataStoreProvider>
        <Box>
          <UserInterface />
        </Box>
      </DataStoreProvider>
    </>
  );
}

export default App;