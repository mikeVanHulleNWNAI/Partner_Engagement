import { Box, IconButton, Drawer, Tooltip } from '@mui/material';
import { useDataStore } from './DataStoreProvider';
import PartnerOfferingShow from './PartnerOfferingShow';
import { useEffect, useMemo, useReducer, useCallback, useRef} from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PublishIcon from '@mui/icons-material/Publish';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import PartnerOfferingEdit from './PartnerOfferingEdit';
import AreYouSureForm from './Forms/AreYouSureForm';
import { createPartnerOffering, deletePartnerOffering, updatePartnerOffering } from './Utils/CreateData';
import { useSharedItems } from './SharedItems';
import { PartnerOfferingEditRef } from './IPartnerOfferingEdit';

// Define state type
interface SidebarState {
  editButtonActive: boolean;
  backButtonActive: boolean;
  deleteButtonActive: boolean;
  submitButtonActive: boolean;
  editPartnerOffering: boolean;
  areYouSureEditNoSubmit_GoBack: boolean;
  areYouSureEditNoSubmit_Close: boolean;
  areYouSureDelete: boolean;
  lastActiveId: string | undefined;
  dataInPartnerOfferingValid: boolean;
  userChangedPartnerOfferingData: boolean;
  resetCounter: number;
}

// Define action types
type SidebarAction =
  | { type: 'OPEN_AREYOUSURE_DELETE' }
  | { type: 'CLOSE_AREYOUSURE_DELETE' }
  | { type: 'OPEN_AREYOUSURE_EDITNOSUBMIT_GOBACK' }
  | { type: 'CLOSE_AREYOUSURE_EDITNOSUBMIT_GOBACK' }
  | { type: 'OPEN_AREYOUSURE_EDITNOSUBMIT_CLOSE' }
  | { type: 'CLOSE_AREYOUSURE_EDITNOSUBMIT_CLOSE' }
  | { type: 'CREATE_PO' }
  | { type: 'EDIT_PO' }
  | { type: 'SHOW_PO' }
  | { type: 'CLOSE_PO' }
  | { type: 'SET_LASTACTIVEID', newLastActiveId: string | undefined }
  | { type: 'SET_DATAINPARTNEROFFERINGVALID', newDataInPartnerOfferingValid: boolean }
  | { type: 'SET_USERCHANGEDPARTNEROFFERINGDATA', newUserChangedPartnerOfferingData: boolean }
  | { type: 'RESET_COUNTER' }

// Initial state
const initialState: SidebarState = {
  editButtonActive: false,
  backButtonActive: false,
  deleteButtonActive: false,
  submitButtonActive: false,
  editPartnerOffering: false,
  areYouSureEditNoSubmit_GoBack: false,
  areYouSureEditNoSubmit_Close: false,
  areYouSureDelete: false,
  lastActiveId: undefined,
  dataInPartnerOfferingValid: true,
  userChangedPartnerOfferingData: false,
  resetCounter: 0,
};

// Reducer function
function sidebarReducer(state: SidebarState, action: SidebarAction): SidebarState {
  switch (action.type) {
    // opens the are you sure to delete form
    case 'OPEN_AREYOUSURE_DELETE':
      return { ...state, areYouSureDelete: true };
    // closes the are you sure to delete form
    case 'CLOSE_AREYOUSURE_DELETE':
      return { ...state, areYouSureDelete: false };
    // opens the are you sure to exit editing without a submit when the go back button was pressed
    case 'OPEN_AREYOUSURE_EDITNOSUBMIT_GOBACK':
      return { ...state, areYouSureEditNoSubmit_GoBack: true };
    // closes the are you sure to exit editing without a submit when the go back button was pressed
    case 'CLOSE_AREYOUSURE_EDITNOSUBMIT_GOBACK':
      return { ...state, areYouSureEditNoSubmit_GoBack: false };
    // opens the are you sure to exit editing without a submit when the close button was pressed
    case 'OPEN_AREYOUSURE_EDITNOSUBMIT_CLOSE':
      return { ...state, areYouSureEditNoSubmit_Close: true };
    // closes the are you sure to exit editing without a submit when the close button was pressed
    case 'CLOSE_AREYOUSURE_EDITNOSUBMIT_CLOSE':
      return { ...state, areYouSureEditNoSubmit_Close: false };
    // goes to the create partner offering state and shows the user the create form
    case 'CREATE_PO':
      return {
        ...state,
        editButtonActive: false,
        backButtonActive: false,
        deleteButtonActive: false,
        submitButtonActive: true,
        editPartnerOffering: true,
      }
    // goes to the edit partner offering state and shows the user the edit form
    case 'EDIT_PO':
      return {
        ...state,
        editButtonActive: false,
        backButtonActive: true,
        deleteButtonActive: false,
        submitButtonActive: true,
        editPartnerOffering: true,
      }
    // goes to the show the partner offering state and shows the partner offering
    case 'SHOW_PO':
      return {
        ...state,
        editButtonActive: true,
        backButtonActive: false,
        deleteButtonActive: true,
        submitButtonActive: false,
        editPartnerOffering: false,
      }
    // closes everything
    case 'CLOSE_PO':
      return {
        ...state,
        editButtonActive: false,
        backButtonActive: false,
        deleteButtonActive: false,
        submitButtonActive: false,
        editPartnerOffering: false,
      };
    // sets the last active partner offerint ID
    case 'SET_LASTACTIVEID':
      return {
        ...state,
        lastActiveId: action.newLastActiveId
      }
    // Sets the data in the partner offering as valid.
    // The valid states come from the edit form.  If all fields are valid, then this is true.
    case 'SET_DATAINPARTNEROFFERINGVALID':
      return {
        ...state,
        dataInPartnerOfferingValid: action.newDataInPartnerOfferingValid
      }
    // Sets the user changed partner offering data.
    // If the user changed any values in the edit form, then this will be true.
    case 'SET_USERCHANGEDPARTNEROFFERINGDATA':
      return {
        ...state,
        userChangedPartnerOfferingData: action.newUserChangedPartnerOfferingData
      }
    case 'RESET_COUNTER':
      return {...state, resetCounter: state.resetCounter + 1}
    default:
      return state;
  }
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (edit: boolean) => void;
  backgroundColor?: string;
  positionFromTop: number;
}

function Sidebar({
  isOpen,
  onClose,
  onEdit,
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

  const { setBusyCount } = useSharedItems();

  // Create blank partner offering template
  const blankPartnerOffering = useMemo(() => {
    const firstConnectionsStatus =
      connectionStatusOptions.find((x) => x.name === "") || { id: "", name: "" };
    const firstNwnOffering =
      nwnOfferingOptions.find((x) => x.name === "") || { id: "", name: "", manager: { id: "", name: "" } };
    const firstCompany =
      companyOptions.find((x) => x.name === "") || { id: "", name: "" };
    const firstPriority =
      priorityOptions.find((x) => x.name === "") || { id: "", name: "" };

    return {
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
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyOptions, connectionStatusOptions, nwnOfferingOptions, priorityOptions, state.resetCounter]);

  useEffect(() => {
    // indicate to the parent that we are in edit mode
    onEdit && onEdit(state.editPartnerOffering);
  }, [state.editPartnerOffering]);

  useEffect(() => {
    console.log("submit button " + state.submitButtonActive);
  }, [state.submitButtonActive])

  // Handle active partner offering changes
  useEffect(() => {
    const newActiveId = activePartnerOffering?.id;

    if ((state.lastActiveId === undefined && newActiveId !== undefined) ||
      (state.lastActiveId !== undefined && newActiveId !== undefined && state.lastActiveId !== newActiveId)) {
      dispatch({ type: 'SHOW_PO' });
    }

    dispatch({ type: 'SET_LASTACTIVEID', newLastActiveId: newActiveId });
  }, [activePartnerOffering?.id, state.lastActiveId]);

  // Handle drawer open/close
  useEffect(() => {
    if (isOpen) {
      dispatch({ type: activePartnerOffering ? 'SHOW_PO' : 'CREATE_PO' });
    }
  }, [activePartnerOffering, isOpen]);

  const partnerOfferingEditRef = useRef<PartnerOfferingEditRef>(null);

  const currentPartnerOffering = useMemo(() => {
    if (state.editPartnerOffering || !activePartnerOffering) {
      return activePartnerOffering
        ? structuredClone(activePartnerOffering)
        : structuredClone(blankPartnerOffering);
    }
    return undefined;
  }, [state.editPartnerOffering, activePartnerOffering, blankPartnerOffering]);

  // Memoized handlers
  const handleGoBack = useCallback(() => {
    if (state.submitButtonActive && state.userChangedPartnerOfferingData) {
      dispatch({ type: 'OPEN_AREYOUSURE_EDITNOSUBMIT_GOBACK' });
    } else {
      dispatch({ type: 'SHOW_PO' });
    }
  }, [state.submitButtonActive, state.userChangedPartnerOfferingData]);

  const handleEdit = useCallback(() => {
    dispatch({ type: 'EDIT_PO' });
  }, []);

  const handleDeleteOpen = useCallback(() => {
    dispatch({ type: 'OPEN_AREYOUSURE_DELETE' });
  }, []);

  const handleDeleteClose = useCallback(() => {
    dispatch({ type: 'CLOSE_AREYOUSURE_DELETE' });
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    dispatch({ type: 'CLOSE_AREYOUSURE_DELETE' });
    if (!activePartnerOffering) return;

    setBusyCount(prevCount => prevCount + 1);
    try {
      await deletePartnerOffering(activePartnerOffering.id);
    } finally {
      setBusyCount(prevCount => prevCount - 1);
    }
  }, [activePartnerOffering, setBusyCount]);

  const handleSubmit = useCallback(async () => {
    const partnerOfferingEditData = partnerOfferingEditRef.current?.getCurrentPOData();

    if (!partnerOfferingEditData) return;

    setBusyCount(prevCount => prevCount + 1);
    try {
      if (activePartnerOffering) {
        await updatePartnerOffering(activePartnerOffering, partnerOfferingEditData);
        dispatch({ type: 'SHOW_PO' });
      } else {
        await createPartnerOffering(partnerOfferingEditData);
        // The reset counter increment by one causeing the blankPartnerOffering to
        // reprocess and cause the currentPartnerOffering to refresh with new data.
        dispatch({ type: 'RESET_COUNTER' });
        dispatch({ type: 'CREATE_PO' });
      }
    } catch (error) {
      console.error('Failed to submit partner offering:', error);
    } finally {
      setBusyCount(prevCount => prevCount - 1);
    }
  }, [activePartnerOffering, setBusyCount]);

  const handleEditNoSubmitGoBackClose = useCallback(() => {
    dispatch({ type: 'CLOSE_AREYOUSURE_EDITNOSUBMIT_GOBACK' });
  }, []);

  const handleEditNoSubmitGoBackConfirm = useCallback(() => {
    dispatch({ type: 'CLOSE_AREYOUSURE_EDITNOSUBMIT_GOBACK' });
    dispatch({ type: 'SHOW_PO' });
  }, []);

  const handleEditNoSubmitCloseClose = useCallback(() => {
    dispatch({ type: 'CLOSE_AREYOUSURE_EDITNOSUBMIT_CLOSE' });
  }, []);

  const handleEditNoSubmitCloseConfirm = useCallback(() => {
    dispatch({ type: 'CLOSE_AREYOUSURE_EDITNOSUBMIT_CLOSE' });
    dispatch({ type: 'CLOSE_PO' });
    onClose();
  }, [onClose])

  const handleOnValid = useCallback((valid: boolean) => {
    dispatch({ type: 'SET_DATAINPARTNEROFFERINGVALID', newDataInPartnerOfferingValid: valid });
  }, []);

  const handleUserChangedData = useCallback((valid: boolean) => {
    dispatch({ type: 'SET_USERCHANGEDPARTNEROFFERINGDATA', newUserChangedPartnerOfferingData: valid });
  }, []);

  const showSubmitButton = state.submitButtonActive &&
    state.dataInPartnerOfferingValid &&
    state.userChangedPartnerOfferingData;

  const handleClose = useCallback(() => {
    if (showSubmitButton)
      dispatch({ type: 'OPEN_AREYOUSURE_EDITNOSUBMIT_CLOSE' });
    else {
      dispatch({ type: 'CLOSE_PO' });
      onClose();
    }
  }, [showSubmitButton, onClose]);

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={handleClose}
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
          position: 'fixed',
          transition: 'width 0.3s ease-in-out',
        }
      }}
      ModalProps={{
        keepMounted: false,
      }}
    >
      <Box sx={{ position: 'relative', overflow: 'auto', height: '100%' }}>
        {/* Sticky Header */}
        <Box
          sx={{
            position: 'sticky',
            top: 0,
            left: 0,
            height: 32,
            right: 0,
            zIndex: 1,
            backgroundColor: 'white',
            boxShadow: 1,
            padding: 2
          }}
        >
          <Box sx={{ display: 'flex' }}>
            {/* Close Button */}
            <Tooltip title="Close sidebar">
              <IconButton
                onClick={handleClose}
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
            </Tooltip>

            {/* Action Buttons */}
            <Box sx={{ pl: 4 }}>
              {state.backButtonActive && (
                <Tooltip title="Go back">
                  <IconButton onClick={handleGoBack}>
                    <ArrowBackIcon sx={{ marginRight: 1 }} />
                  </IconButton>
                </Tooltip>
              )}
              {state.editButtonActive && (
                <Tooltip title="Edit">
                  <IconButton onClick={handleEdit}>
                    <EditIcon sx={{ marginRight: 1 }} />
                  </IconButton>
                </Tooltip>
              )}
              {state.deleteButtonActive && (
                <Tooltip title="Delete">
                  <IconButton onClick={handleDeleteOpen}>
                    <DeleteIcon sx={{ marginRight: 1 }} />
                  </IconButton>
                </Tooltip>
              )}
              {showSubmitButton && (
                <Tooltip title="Submit">
                  <IconButton onClick={handleSubmit}>
                    <PublishIcon sx={{ marginRight: 1 }} />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Box>
        </Box>

        {/* Content */}
        <Box sx={{ pt: 4, p: 2 }}>
          {currentPartnerOffering && (
            <PartnerOfferingEdit 
              ref={partnerOfferingEditRef}
              partnerOfferingData={currentPartnerOffering}
              onValid={handleOnValid}
              onUserChangedData={handleUserChangedData}
            />
          )}

          {!state.editPartnerOffering && activePartnerOffering && (
            <PartnerOfferingShow activePartnerOffering={activePartnerOffering} />
          )}
        </Box>

        {/* Confirmation Dialogs */}
        <AreYouSureForm
          open={state.areYouSureDelete}
          onNo={handleDeleteClose}
          onYes={handleDeleteConfirm}
          label={`Do you want to delete "${activePartnerOffering?.offeringName}"?`}
        />
        <AreYouSureForm
          open={state.areYouSureEditNoSubmit_GoBack}
          onNo={handleEditNoSubmitGoBackClose}
          onYes={handleEditNoSubmitGoBackConfirm}
          label="You have not submitted these changes?"
        />
        <AreYouSureForm
          open={state.areYouSureEditNoSubmit_Close}
          onNo={handleEditNoSubmitCloseClose}
          onYes={handleEditNoSubmitCloseConfirm}
          label="You have not submitted these changes?"
        />
      </Box>
    </Drawer>
  );
}

export default Sidebar;