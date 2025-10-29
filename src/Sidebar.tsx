import { Box, IconButton, Drawer } from '@mui/material';
import { useDataStore } from './DataStoreProvider';
import PartnerOfferingShow from './PartnerOfferingShow';
import { useCallback, useEffect, useReducer } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PublishIcon from '@mui/icons-material/Publish';
import CancelIcon from '@mui/icons-material/Cancel';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { partnerOfferingType } from './Types';
import PartnerOfferingEdit from './PartnerOfferingEdit';

// Define state type
interface SidebarState {
  editButtonActive: boolean;
  backButtonActive: boolean;
  deleteButtonActive: boolean;
  submitButtonActive: boolean;
  cancelButtonActive: boolean;
  editPartnerOffering: boolean;
  areYouSure: boolean;
  lastActiveId: string | undefined;
  blankPartnerOffering: partnerOfferingType;
}

// Define action types
type SidebarAction =
  | { type: 'OPEN_AREYOUSURE' }
  | { type: 'CLOSE_ALL' }
  | { type: 'CREATE_PO' }
  | { type: 'EDIT_PO' }
  | { type: 'SHOW_PO' }
  | { type: 'SET_BLANK', blank: partnerOfferingType }
  | { type: 'SET_LASTACTIVEID', newLastActiveId: string | undefined }

// Initial state
const initialState: SidebarState = {
  editButtonActive: false,
  backButtonActive: false,
  deleteButtonActive: false,
  submitButtonActive: false,
  cancelButtonActive: false,
  editPartnerOffering: false,
  areYouSure: false,
  lastActiveId: undefined,
  blankPartnerOffering: {
    id: "",
    offeringName: "",
    contactInfo: "",
    dashboard: "",
    notes: "",
    status: {
      id: "",
      name: ""
    },
    nwnOffering: {
      id: "",
      name: "",
      manager: {
        id: "",
        name: ""
      }
    },
    company: {
      id: "",
      name: ""
    },
    priority: {
      id: "",
      name: ""
    },
    apis: []
  },
};

// Reducer function
function sidebarReducer(state: SidebarState, action: SidebarAction): SidebarState {
  switch (action.type) {
    case 'OPEN_AREYOUSURE':
      return { ...state, areYouSure: true };
    case 'CLOSE_ALL':
      return {
        ...state,
        editPartnerOffering: false,
        areYouSure: false
      };
    case 'CREATE_PO':
      return {
        ...state,
        editButtonActive: false,
        backButtonActive: true,
        deleteButtonActive: false,
        submitButtonActive: true,
        cancelButtonActive: true,
        editPartnerOffering: true,
      }
    case 'EDIT_PO':
      return {
        ...state,
        editButtonActive: false,
        backButtonActive: true,
        deleteButtonActive: false,
        submitButtonActive: true,
        cancelButtonActive: true,
        editPartnerOffering: true,
      }
    case 'SHOW_PO':
      return {
        ...state,
        editButtonActive: true,
        backButtonActive: false,
        deleteButtonActive: true,
        submitButtonActive: false,
        cancelButtonActive: false,
        editPartnerOffering: false,
      }
    case 'SET_BLANK':
      return {
        ...state,
        blankPartnerOffering: action.blank
      }
    case 'SET_LASTACTIVEID':
      return {
        ...state,
        lastActiveId: action.newLastActiveId
  }
    default:
  return state;
}
}

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

  const [state, dispatch] = useReducer(sidebarReducer, initialState);

  const {
    activePartnerOffering,
    connectionStatusOptions,
    nwnOfferingOptions,
    companyOptions,
    priorityOptions
  } = useDataStore();

  // this useEffect puts us in a mode where we are create a new PO if we do not have an active PO
  useEffect(() => {
    const newActiveId = activePartnerOffering ? activePartnerOffering.id : undefined;

    // If we're transitioning from undefined to a value (new PO selected), show it
    if (state.lastActiveId === undefined && newActiveId !== undefined) {
      dispatch({ type: 'SHOW_PO' });
    }
    if (state.lastActiveId !== undefined && newActiveId !== undefined && 
        state.lastActiveId !== newActiveId) {
      dispatch({ type: 'SHOW_PO' });
    }

    // Update the lastActiveId
    dispatch({
      type: 'SET_LASTACTIVEID',
      newLastActiveId: newActiveId
    });
  }, [activePartnerOffering, state.lastActiveId]);

  useEffect(() => {
    // show
    if (isOpen)
      dispatch({ type: 'SHOW_PO' });
  }, [isOpen]);

  useCallback(() => {
    // these are used to determine if we have the options
    const firstConnectionsStatus =
      connectionStatusOptions.find((x) => x.name == "") ||
      { id: "", name: "" };
    const firstNwnOffering =
      nwnOfferingOptions.find((x) => x.name == "") ||
      { id: "", name: "", manager: { id: "", name: "" } };
    const firstCompany =
      companyOptions.find((x) => x.name == "") ||
      { id: "", name: "" };
    const firstPriority =
      priorityOptions.find((x) => x.name == "") ||
      { id: "", name: "" };

    const blankPartnerOffering = {
      id: "",
      offeringName: "",
      contactInfo: "",
      dashboard: "",
      notes: "",
      status: firstConnectionsStatus,
      nwnOffering: {
        id: firstNwnOffering.id,
        name: firstNwnOffering.name,
        manager: {
          id: firstNwnOffering.manager.id,
          name: firstNwnOffering.manager.name
        }
      },
      company: firstCompany,
      priority: firstPriority,
      apis: []
    }
    dispatch({ type: 'SET_BLANK', blank: blankPartnerOffering })
  }, [companyOptions, connectionStatusOptions, nwnOfferingOptions, priorityOptions])

  const handleGoBack = () => {
    dispatch({ type: 'SHOW_PO' });
  }

  const handleEdit = () => {
    dispatch({ type: 'EDIT_PO' });
  }

  const handleDelete = () => {
    dispatch({ type: 'OPEN_AREYOUSURE' });
  }

  const handleEditPartnerOfferingFormClose = () => {

  }

  const handleEditPartnerOfferingFormSubmit = (partnerOffering: partnerOfferingType) => {

  }

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
          <Box sx={{ display: 'flex' }}>
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
            <Box sx={{ pl: 4 }}>
              {state.backButtonActive && (
                <IconButton
                  onClick={handleGoBack}
                >
                  <ArrowBackIcon sx={{ marginRight: 1 }} />
                </IconButton>
              )}
              {state.editButtonActive && (
                <IconButton
                  onClick={handleEdit}
                >
                  <EditIcon sx={{ marginRight: 1 }} />
                </IconButton>
              )}
              {state.deleteButtonActive && (
                <IconButton
                  onClick={handleDelete}
                >
                  <DeleteIcon sx={{ marginRight: 1 }} />
                </IconButton>
              )}
              {state.submitButtonActive && (
                <IconButton
                  onClick={handleDelete}
                >
                  <PublishIcon sx={{ marginRight: 1 }} />
                </IconButton>
              )}
              {state.cancelButtonActive && (
                <IconButton
                  onClick={handleDelete}
                >
                  <CancelIcon sx={{ marginRight: 1 }} />
                </IconButton>
              )}
            </Box>
          </Box>
        </Box>

        {/* Content */}
        <Box sx={{ pt: 4, p: 2 }}>
          {/* Show if editPartnerOffering is true */}
          {state.editPartnerOffering && (
            <PartnerOfferingEdit
              partnerOfferingData={
                activePartnerOffering ?
                  structuredClone(activePartnerOffering) :
                  state.blankPartnerOffering
              }
            />
          )}

          {/* If we are not editing and we have an active, then we are showing. */}
          {!state.editPartnerOffering && activePartnerOffering && (
            <PartnerOfferingShow
              activePartnerOffering={activePartnerOffering}
            />
          )}

          {/* If we are not editing and we have do not have an active, then we are trying to create a new one. */}
          {!state.editPartnerOffering && !activePartnerOffering && (
            <PartnerOfferingEdit
              partnerOfferingData={
                state.blankPartnerOffering
              }
            />
          )}
        </Box>
      </Box>
    </Drawer >
  );
}

export default Sidebar;