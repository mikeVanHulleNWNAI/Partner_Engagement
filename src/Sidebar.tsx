import { Box, IconButton, Drawer, Typography } from '@mui/material';
import { ChevronRightIcon } from 'lucide-react';
import SidebarMenu from './Menus/SidebarMenu';
import PartnerOfferingTile from './PartnerOfferingTile';
import { RenderLinkOrText } from './RenderLinkOrText';
import ApiList from './ApiList';
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

  const {
    activePartnerOffering
  } = useDataStore();

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={onClose}
      variant="persistent"
      sx={{
        width: isOpen ? { xs: '100%', sm: '40%' } : 0,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: { xs: '100%', sm: '40%' },
          top: `${positionFromTop * 4}px`,
          height: `calc(100% - ${positionFromTop * 4}px)`,
          backgroundColor: backgroundColor,
          boxShadow: 3,
          overflowY: 'auto',
          position: 'fixed',  // Change from default 'fixed'
          transition: 'width 0.3s ease-in-out',
        }
      }}
      ModalProps={{
        keepMounted: false,
      }}
    >
      <Box sx={{ 
        position: 'relative', 
        overflow: 'auto',
        height: '100%' 
      }}>
        <Box
          sx={{
            position: 'sticky',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1,
            backgroundColor: 'white',
            boxShadow: 1,
            padding: 2
          }}
        >
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
          <Box sx={{ pl: 4}}>
            <SidebarMenu
              onCloseSidebar={onClose}
            />
          </Box>
        </Box>

        {/* Content */}
        <Box sx={{ pt: 4, p: 2 }}>
          {activePartnerOffering ? (
            <Box>
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
    </Drawer>
  );
}

export default Sidebar;