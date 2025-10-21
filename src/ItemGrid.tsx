import React, { ReactNode } from 'react';
import { Box } from '@mui/material';

interface ItemGridProps {
  children: ReactNode;
}

const ItemGrid: React.FC<ItemGridProps> = ({ children }) => {
  return (
    <Box sx={{ backgroundColor: 'transparent', p: 4 }}>
      <Box sx={{ mx: 'auto' }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)',
              xl: 'repeat(5, 1fr)',
            },
            gap: 3,
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default ItemGrid;