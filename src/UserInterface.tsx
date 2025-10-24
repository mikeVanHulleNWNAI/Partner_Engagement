import { memo, useState, useCallback, useMemo } from "react";
import { Box, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { createInitialDataSettings, createPartnerOfferingRemove9879, deleteAll, deletePartnerOffering } from "./Utils/CreateData"
import { BODY_COLOR } from "./Utils/Constants";
import ItemGrid from "./ItemGrid";
import Sidebar from "./Sidebar";
import PartnerOfferingTile from "./PartnerOfferingTile";
import NavBar from "./NavBar";
import { partnerOfferingType } from './Types';
import { adjustColorHSL } from "./Utils/adjustColor";
import { useDataStore } from "./DataStoreProvider";

// Memoized tile component for better performance
const PartnerOfferingTileMemo = memo<{
  partnerOffering: partnerOfferingType
  isHighlighted?: boolean
  onClick: () => void
}>(
  ({ partnerOffering, isHighlighted, onClick }) => (
    <PartnerOfferingTile
      key={partnerOffering.id}
      partnerOffering={partnerOffering}
      isHighlighted={isHighlighted}
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
  const activateSidebar = useCallback((partnerOffering: partnerOfferingType) => {
    setActivePartnerOffering(partnerOffering);
    setIsSidebarOpen(true);
  }, []);

  const handleCloseSidebar = useCallback(() => {
    setActivePartnerOffering(undefined);
    setIsSidebarOpen(false);
  }, []);

  // Fixed async function - use Promise.all instead of forEach
  const deleteTemps = useCallback(async () => {
    const test = allPartnerOfferings.filter((value) => value.company.name === "ApexaiQ");

    // Properly handle async operations
    await Promise.all(test.map(value => deletePartnerOffering(value.id)));

    await createPartnerOfferingRemove9879(
      "",
      "Pragti Aggarwal <pragti@apexaiq.com>; Engineering support: lokesh@apexaiq.com",
      "https://nwn.okta.com/app/UserHome",
      "",
      "Connected",
      "",
      "ApexaiQ",
      "LOW",
      ["REST"],
      ["https://app.apexaiq.com/docs"],
      ["https://www.apexaiq.com/resources/"],
      [""],
      [""],
      [""]
    );
  }, [allPartnerOfferings]);

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
          pt: `${navBarHeight * 4}px`,
          background: `linear-gradient(180deg, ${adjustColorHSL(BODY_COLOR, +30)}, ${adjustColorHSL(BODY_COLOR, +50)})`,
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
            >
              <MenuItem value="">All Offerings</MenuItem>
              {nwnOfferingOptions.map((offering) => (
                <MenuItem key={offering.nwnOffering.id} value={offering.nwnOffering.name}>
                  {offering.nwnOffering.name}
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

        {/* Debug Buttons (hidden) */}
        <Button
          sx={{ display: 'none' }}
          onClick={handleDeleteAndRestore}
        >
          Delete and Restore
        </Button>
        <Button
          sx={{ display: 'none' }}
          onClick={deleteTemps}
        >
          Delete temps
        </Button>

        {/* Item Grid */}
        <ItemGrid>
          {filteredPartnerOfferings.map((partnerOffering) => (
            <PartnerOfferingTileMemo
              key={partnerOffering.id}
              partnerOffering={partnerOffering}
              isHighlighted={activePartnerOffering?.id === partnerOffering.id}
              onClick={() => activateSidebar(partnerOffering)}
            />
          ))}
        </ItemGrid>

        {/* Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={handleCloseSidebar}
          backgroundColor={`${adjustColorHSL(BODY_COLOR, +50)}`}
          positionFromTop={navBarHeight}
        >
        </Sidebar>
      </Box>
    </>
  );
}

export default UserInterface;