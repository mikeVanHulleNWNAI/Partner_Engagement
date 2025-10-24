import { useState, useRef, useEffect } from 'react';
import { Box, IconButton, Drawer, Button, Typography } from '@mui/material';
import { ChevronRightIcon } from 'lucide-react';
import SidebarMenu from './Menus/SidebarMenu';
import PartnerOfferingTile from './PartnerOfferingTile';
import { RenderLinkOrText } from './RenderLinkOrText';
import ApiList from './ApiList';
import { createPartnerOfferingRemove9879 } from './Utils/CreateData';
import { useDataStore } from './DataStoreProvider';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  backgroundColor?: string;
  positionFromTop: number;
}

function Sidebar({
  isOpen,
  onClose,
  backgroundColor = '#ffffff',
  positionFromTop = 16
}: SidebarProps) {
  const [width, setWidth] = useState(384); // Default width (384px)
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const minWidth = 200;
  const maxWidth = 800;

  const {
    activePartnerOffering
  } = useDataStore();

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
          <Box sx={{ p: 2 }}>
            {activePartnerOffering ? (
              <Box>
                {/* Debug Buttons (hidden) */}
                <Button
                  sx={{ display: 'none' }}
                  onClick={async () => {
                    await createPartnerOfferingRemove9879(
                      "Test 1234",
                      "Pragti Aggarwal <pragti@apexaiq.com>; Engineering support: lokesh@apexaiq.com",
                      "https://nwn.okta.com/app/UserHome",
                      "",
                      "Connected",
                      "",
                      "ApexaiQ",
                      "LOW",
                      ["REST"],
                      [""],
                      [""],
                      [""],
                      [""],
                      [""]
                    );
                  }}
                >
                  New Partner Offering
                </Button>
                <SidebarMenu 
                  onCloseSidebar={onClose}
                />
                {/* Partner Offering Details */}
                <Box>
                  <PartnerOfferingTile partnerOffering={activePartnerOffering} />
                  <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box>
                      <Typography component="span" sx={{ fontWeight: 'bold' }}>
                        Manager:
                      </Typography>
                      {' '}
                      <Typography component="span">
                        {activePartnerOffering.nwnOffering?.manager?.name}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography component="span" sx={{ fontWeight: 'bold' }}>
                        Contact Info:
                      </Typography>
                      {' '}
                      <Typography component="span">
                        {activePartnerOffering.contactInfo}
                      </Typography>
                    </Box>
                    <RenderLinkOrText
                      label="Dashboard"
                      value={activePartnerOffering.dashboard}
                    />
                    <Box>
                      <Typography component="span" sx={{ fontWeight: 'bold' }}>
                        Notes:
                      </Typography>
                      {' '}
                      <Typography component="span">
                        {activePartnerOffering.notes}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography component="span" sx={{ fontWeight: 'bold' }}>
                        Connection Status:
                      </Typography>
                      {' '}
                      <Typography component="span">
                        {activePartnerOffering.status?.name}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography component="span" sx={{ fontWeight: 'bold' }}>
                        NWN Offering:
                      </Typography>
                      {' '}
                      <Typography component="span">
                        {activePartnerOffering.nwnOffering?.name}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography component="span" sx={{ fontWeight: 'bold' }}>
                        Company:
                      </Typography>
                      {' '}
                      <Typography component="span">
                        {activePartnerOffering.company?.name}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography component="span" sx={{ fontWeight: 'bold' }}>
                        Priority:
                      </Typography>
                      {' '}
                      <Typography component="span">
                        {activePartnerOffering.priority?.name}
                      </Typography>
                    </Box>

                    <ApiList partnerOffering={activePartnerOffering} />
                  </Box>
                </Box>
              </Box>
            ) : (
              <Typography sx={{ color: 'text.secondary' }}>
                No item selected
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
}

export default Sidebar;