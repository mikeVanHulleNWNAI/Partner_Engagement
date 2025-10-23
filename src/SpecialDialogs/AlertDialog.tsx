import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  IconButton,
  Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import { FC } from 'react';

interface AlertDialogProps {
  open: boolean;
  severity?: 'error' | 'warning' | 'info' | 'success';
  title?: string;
  message: string;
  onClose?: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
}

const AlertDialog: FC<AlertDialogProps> = ({
  open,
  severity = 'info',
  title,
  message,
  onClose,
  onConfirm,
  confirmText = 'OK',
  cancelText = 'Cancel',
  showCancel = false
}) => {
  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    if (onClose) onClose();
  };

  const handleClose = () => {
    if (onClose) onClose();
  };

  const getIcon = () => {
    const iconProps = { sx: { fontSize: 60 } };
    switch (severity) {
      case 'success':
        return <CheckCircleIcon color="success" {...iconProps} />;
      case 'error':
        return <ErrorIcon color="error" {...iconProps} />;
      case 'warning':
        return <WarningIcon color="warning" {...iconProps} />;
      case 'info':
      default:
        return <InfoIcon color="info" {...iconProps} />;
    }
  };

  const getButtonColor = () => {
    switch (severity) {
      case 'success':
        return 'success';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
      default:
        return 'primary';
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          p: 1
        }
      }}
    >
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>

      <Box sx={{ textAlign: 'center', pt: 3, pb: 2 }}>
        {getIcon()}
      </Box>

      {title && (
        <DialogTitle sx={{ textAlign: 'center', pb: 1, pt: 0 }}>
          {title}
        </DialogTitle>
      )}

      <DialogContent>
        <DialogContentText sx={{ textAlign: 'center' }}>
          {message}
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center', pb: 3, px: 3 }}>
        {showCancel && (
          <Button
            onClick={handleClose}
            variant="outlined"
            size="large"
            sx={{ minWidth: 100 }}
          >
            {cancelText}
          </Button>
        )}
        <Button
          onClick={handleConfirm}
          variant="contained"
          color={getButtonColor()}
          size="large"
          sx={{ minWidth: 100 }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

/*
export const AlertDialogDemo: React.FC = () => {
  const [dialogs, setDialogs] = useState({
    success: false,
    info: false,
    warning: false,
    error: false,
    confirm: false
  });

  const openDialog = (type: keyof typeof dialogs) => {
    setDialogs(prev => ({ ...prev, [type]: true }));
  };

  const closeDialog = (type: keyof typeof dialogs) => {
    setDialogs(prev => ({ ...prev, [type]: false }));
  };

  return (
    <Box sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <h1>Material-UI Alert Dialog</h1>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Button
          variant="contained"
          color="success"
          size="large"
          onClick={() => openDialog('success')}
        >
          Show Success Alert
        </Button>

        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => openDialog('info')}
        >
          Show Info Alert
        </Button>

        <Button
          variant="contained"
          color="warning"
          size="large"
          onClick={() => openDialog('warning')}
        >
          Show Warning Alert
        </Button>

        <Button
          variant="contained"
          color="error"
          size="large"
          onClick={() => openDialog('error')}
        >
          Show Error Alert
        </Button>

        <Button
          variant="contained"
          color="secondary"
          size="large"
          onClick={() => openDialog('confirm')}
        >
          Show Confirmation Dialog
        </Button>
      </Box>

      // Alert Dialogs
      <AlertDialog
        open={dialogs.success}
        severity="success"
        title="Success!"
        message="Your operation has been completed successfully."
        onClose={() => closeDialog('success')}
      />

      <AlertDialog
        open={dialogs.info}
        severity="info"
        title="Information"
        message="Here's some important information you should know about."
        onClose={() => closeDialog('info')}
      />

      <AlertDialog
        open={dialogs.warning}
        severity="warning"
        title="Warning"
        message="Please proceed with caution. This action may have consequences."
        onClose={() => closeDialog('warning')}
      />

      <AlertDialog
        open={dialogs.error}
        severity="error"
        title="Error"
        message="Something went wrong. Please try again later."
        onClose={() => closeDialog('error')}
      />

      <AlertDialog
        open={dialogs.confirm}
        severity="warning"
        title="Are you sure?"
        message="This action cannot be undone. Do you want to proceed?"
        showCancel={true}
        confirmText="Yes, proceed"
        cancelText="No, cancel"
        onConfirm={() => {
          console.log('Confirmed!');
          closeDialog('confirm');
        }}
        onClose={() => closeDialog('confirm')}
      />
    </Box>
  );
};
*/

export default AlertDialog;