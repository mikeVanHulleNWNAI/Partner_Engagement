import { useState, useRef, useEffect } from 'react';
import { Box, IconButton, Drawer } from '@mui/material';
import { ChevronRightIcon } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  backgroundColor?: string;
  positionFromTop: number;
}

function Sidebar({ 
    isOpen, 
    onClose, 
    children, 
    backgroundColor = '#ffffff',
    positionFromTop = 16
  }: SidebarProps) {
  const [width, setWidth] = useState(384); // Default width (384px)
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const minWidth = 200;
  const maxWidth = 800;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const windowWidth = window.innerWidth;
      const newWidth = windowWidth - e.clientX;

      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'ew-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing]);

  const handleMouseDown = () => {
    setIsResizing(true);
  };

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: `${width}px`,
          top: `${positionFromTop * 4}px`,
          height: `calc(100% - ${positionFromTop * 4}px)`,
          backgroundColor: backgroundColor,
          boxShadow: 3,
          overflowY: 'auto',
        },
      }}
      ModalProps={{
        keepMounted: false,
      }}
    >
      <Box ref={sidebarRef} sx={{ position: 'relative', height: '100%' }}>
        {/* Resize Handle */}
        <Box
          onMouseDown={handleMouseDown}
          sx={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            width: '4px',
            cursor: 'ew-resize',
            backgroundColor: isResizing ? 'primary.main' : 'grey.300',
            '&:hover': {
              backgroundColor: 'primary.main',
            },
            '&:active': {
              backgroundColor: 'primary.dark',
            },
            transition: 'background-color 0.2s',
            zIndex: 10,
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              left: 0,
              top: 0,
              height: '100%',
              width: '8px',
              transform: 'translateX(-50%)',
            }}
          />
        </Box>

        {/* Close Button */}
        <IconButton
          onClick={onClose}
          aria-label="Close sidebar"
          title="Close sidebar"
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            zIndex: 50,
            p: 0.75,
            backgroundColor: 'background.paper',
            border: 1,
            borderColor: 'grey.300',
            boxShadow: 1,
            '&:hover': {
              backgroundColor: 'grey.100',
            },
            '&:focus': {
              outline: 'none',
              boxShadow: (theme) => `0 0 0 2px ${theme.palette.primary.main}`,
            },
          }}>
          <ChevronRightIcon style={{ width: 16, height: 16, color: '#4b5563' }} />
        </IconButton>

        {/* Content */}
        <Box sx={{ pt: 4 }}>
          {children}
        </Box>
      </Box>
    </Drawer>
  );
}

export default Sidebar;