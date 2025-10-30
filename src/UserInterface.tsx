import { memo, useState, useCallback, useMemo } from "react";
import { Box, Button, FormControl, InputLabel, Select, MenuItem, IconButton, Tooltip } from '@mui/material';
import { createInitialDataSettings, deleteAll } from "./Utils/CreateData"
import { BODY_COLOR } from "./Utils/Constants";
import ItemGrid from "./ItemGrid";
import Sidebar from "./Sidebar";
import PartnerOfferingTile from "./PartnerOfferingTile";
import NavBar from "./NavBar";
import { partnerOfferingType } from './Types';
import { adjustColorHSL } from "./Utils/adjustColor";
import { useDataStore } from "./DataStoreProvider";
import AddIcon from '@mui/icons-material/Add';

// Memoized tile component for better performance
const PartnerOfferingTileMemo = memo<{
  partnerOffering: partnerOfferingType
  isHighlighted?: boolean
  disabled?: boolean
  onClick: () => void
}>(
  ({ partnerOffering, isHighlighted, disabled, onClick }) => (
    <PartnerOfferingTile
      key={partnerOffering.id}
      partnerOffering={partnerOffering}
      isHighlighted={isHighlighted}
      disabled={disabled}
      onClick={onClick}
    />
  )
);

function UserInterface() {
  // NavBar height can not be less then 16
  const navBarHeight: number = 16;

  const {
    allPartnerOfferings,
    nwnOfferingOptions,
    managerOptions,
    apiTypeOptions,
    activePartnerOffering,
    setActivePartnerOffering,
  } = useDataStore();

  // UI state
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // Filter state
  const [selectedManager, setSelectedManager] = useState<string>("");
  const [selectedNwnOffering, setSelectedNwnOffering] = useState<string>("");
  const [selectedApiType, setSelectedApiType] = useState<string>("");
  const [disabled, setDisabled] = useState(false);

  // Apply filters client-side using useMemo for performance
  const filteredPartnerOfferings = useMemo(() => {
    return allPartnerOfferings.filter((item) => {
      const matchesManager = !selectedManager ||
        item.nwnOffering?.manager?.name === selectedManager;
      const matchesNwnOffering = !selectedNwnOffering ||
        item.nwnOffering?.name === selectedNwnOffering;
      const matchesApiType = !selectedApiType ||
        item.apis?.some(api => api.apiType?.name === selectedApiType);

      return matchesManager && matchesNwnOffering && matchesApiType;
    });
  }, [allPartnerOfferings, selectedManager, selectedNwnOffering, selectedApiType]);

  // Callbacks
  const activateSidebar = useCallback((partnerOffering: partnerOfferingType | undefined) => {
    setActivePartnerOffering(partnerOffering);
    setIsSidebarOpen(true);
  }, []);

  const handleCloseSidebar = useCallback(() => {
    setActivePartnerOffering(undefined);
    setIsSidebarOpen(false);
  }, []);

  const handleEditSidebar = useCallback((edit: boolean) => {
    setDisabled(edit);
  }, [])

  const handleDeleteAndRestore = useCallback(async () => {
    await deleteAll();
    await createInitialDataSettings();
  }, []);

  return (
    <>
      <NavBar
        height={navBarHeight}
      />
      <Box
        sx={{
          display: 'flex',
          overflow: 'hidden',
        }} >
        <Box
          sx={{
            flexGrow: 1,
            pt: `${navBarHeight * 4}px`,
          }}
        >
          <Box sx={{ mb: 2 }} />

          {/* Filter Controls */}
          <Box
            sx={{
              mb: 2,
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2,
              px: 2,
            }}
          >
            <FormControl
              size="small"
              sx={{ minWidth: 200 }}
            >
              <InputLabel id="manager-select-label">Manager</InputLabel>
              <Select
                labelId="manager-select-label"
                id="manager-select"
                value={selectedManager}
                label="Manager"
                onChange={(e) => setSelectedManager(e.target.value)}
                disabled={disabled}
              >
                <MenuItem value="">All Managers</MenuItem>
                {managerOptions.map((manager) => (
                  <MenuItem key={manager.id} value={manager.name}>
                    {manager.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl
              size="small"
              sx={{ minWidth: 200 }}
            >
              <InputLabel id="nwnOffering-select-label">NWN Offering</InputLabel>
              <Select
                labelId="nwnOffering-select-label"
                id="nwnOffering-select"
                value={selectedNwnOffering}
                label="NWN Offering"
                onChange={(e) => setSelectedNwnOffering(e.target.value)}
                disabled={disabled}
              >
                <MenuItem value="">All Offerings</MenuItem>
                {nwnOfferingOptions.map((offering) => (
                  <MenuItem key={offering.id} value={offering.name}>
                    {offering.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl
              size="small"
              sx={{ minWidth: 200 }}
            >
              <InputLabel id="apiType-select-label">API Type</InputLabel>
              <Select
                labelId="apiType-select-label"
                id="apiType-select"
                value={selectedApiType}
                label="API Type"
                onChange={(e) => setSelectedApiType(e.target.value)}
                disabled={disabled}
              >
                <MenuItem value="">All Types</MenuItem>
                {apiTypeOptions.map((type) => (
                  <MenuItem key={type.id} value={type.name}>
                    {type.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Tooltip title="Create new">
            <IconButton
              onClick={() => activateSidebar(undefined)}
              disabled={disabled}
              sx={{
                position: 'absolute',
                top: 75,
                right: 8,
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
              <AddIcon style={{ width: 16, height: 16, color: '#4b5563' }} />
            </IconButton>
          </Tooltip>

          {/* Debug Buttons (hidden) */}
          <Button
            sx={{ display: 'none' }}
            onClick={handleDeleteAndRestore}
          >
            Delete and Restore
          </Button>

          {/* Item Grid */}
          <ItemGrid>
            {filteredPartnerOfferings.map((partnerOffering) => (
              <PartnerOfferingTileMemo
                key={partnerOffering.id}
                partnerOffering={partnerOffering}
                isHighlighted={activePartnerOffering?.id === partnerOffering.id}
                disabled={disabled}
                onClick={() => activateSidebar(partnerOffering)}
              />
            ))}
          </ItemGrid>
        </Box>

        {/* Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={handleCloseSidebar}
          onEdit={handleEditSidebar}
          backgroundColor={`${adjustColorHSL(BODY_COLOR, +50)}`}
          positionFromTop={navBarHeight}
        >
        </Sidebar>
      </Box>
    </>
  );
}

export default UserInterface;