import React, { useState, ChangeEvent, FC, useCallback, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Alert,
  Card,
  CardContent,
  Chip,
  Stack,
  CircularProgress,
  Divider,
  DialogContent,
  DialogActions,
  Dialog,
  DialogTitle
} from '@mui/material';
import {
  Upload as UploadIcon,
  Download as DownloadIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';
import { downloadCSV, uploadCSV } from '../Utils/CSV';
import { partnerOfferingType } from '../Types';
import { useDataStore } from '../DataStoreProvider';

type StatusType = 'success' | 'error';

interface UploadStatus {
  type: StatusType;
  message: string;
}

interface CSVManagerProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (offerings: partnerOfferingType[]) => void;
}

const CSVManager: FC<CSVManagerProps> = ({
  open,
  onClose,
  onSubmit,
}) => {

  const [uploadedOfferings, setUploadedOfferings] = useState<partnerOfferingType[]>([]);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  useEffect(() => {
    // when we open, we should clear out the uploaded offerings
    if (open) {
      setUploadedOfferings([]);
      setUploadStatus(null);
    }
  }, [open]);

  const {
    allPartnerOfferings,
    isLoading,
  } = useDataStore();

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadStatus(null);

    try {
      const parsedOfferings = await uploadCSV(file);
      setUploadedOfferings(parsedOfferings);
      setUploadStatus({
        type: 'success',
        message: `Successfully imported ${parsedOfferings.length} offering(s)`
      });
    } catch (error) {
      setUploadStatus({
        type: 'error',
        message: `Error uploading file: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleDownload = (): void => {
    if (allPartnerOfferings.length === 0) {
      setUploadStatus({
        type: 'error',
        message: 'No offerings to download. Please upload a CSV first.'
      });
      return;
    }

    try {
      downloadCSV(allPartnerOfferings, `partner-offerings-${Date.now()}.csv`);
      setUploadStatus({
        type: 'success',
        message: 'CSV downloaded successfully'
      });
    } catch (error) {
      setUploadStatus({
        type: 'error',
        message: `Error downloading file: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  };

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (onSubmit) {
        onSubmit(uploadedOfferings);
      }
    },
    [onSubmit, uploadedOfferings]
  );

  return (
    <Dialog closeAfterTransition={false} open={open} onClose={onClose} maxWidth='md' fullWidth>
      <DialogTitle>CSV Upload and Download</DialogTitle>
      <DialogContent>
        {!isLoading ? (
          <>
            <Box sx={{ bgcolor: 'grey.50', py: 4 }}>
              <Container maxWidth="lg">
                <Paper elevation={3} sx={{ p: 4 }}>
                  {/* Header */}
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                    <DescriptionIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                    <Typography variant="h4" component="h1" fontWeight="bold">
                      Partner Offerings CSV Manager
                    </Typography>
                  </Stack>

                  <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    Upload a CSV file to import partner offerings, or download the current data as CSV.
                  </Typography>

                  {/* Status Alert */}
                  {uploadStatus && (
                    <Alert
                      severity={uploadStatus.type}
                      onClose={() => setUploadStatus(null)}
                      sx={{ mb: 3 }}
                    >
                      {uploadStatus.message}
                    </Alert>
                  )}

                  {/* Action Buttons */}
                  <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={3}
                    sx={{ mb: 4 }}
                  >
                    {/* Upload Section */}
                    <Card
                      variant="outlined"
                      sx={{
                        flex: 1,
                        border: 2,
                        borderStyle: 'dashed',
                        borderColor: isUploading ? 'grey.300' : 'primary.main',
                        bgcolor: isUploading ? 'grey.50' : 'primary.50',
                        transition: 'all 0.3s',
                        '&:hover': !isUploading ? {
                          borderColor: 'primary.dark',
                          bgcolor: 'primary.100'
                        } : {}
                      }}
                    >
                      <CardContent sx={{ textAlign: 'center', py: 4 }}>
                        <input
                          accept=".csv"
                          style={{ display: 'none' }}
                          id="csv-upload-input"
                          type="file"
                          onChange={handleFileChange}
                          disabled={isUploading}
                        />
                        <label htmlFor="csv-upload-input">
                          <Box sx={{ cursor: isUploading ? 'not-allowed' : 'pointer' }}>
                            {isUploading ? (
                              <CircularProgress size={48} sx={{ mb: 2 }} />
                            ) : (
                              <UploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                            )}
                            <Typography variant="h6" gutterBottom>
                              {isUploading ? 'Uploading...' : 'Upload CSV'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Click to select a CSV file
                            </Typography>
                          </Box>
                        </label>
                      </CardContent>
                    </Card>

                    {/* Download Section */}
                    <Card
                      variant="outlined"
                      sx={{
                        flex: 1,
                        border: 2,
                        borderColor: allPartnerOfferings.length === 0 ? 'grey.300' : 'success.main',
                        bgcolor: allPartnerOfferings.length === 0 ? 'grey.50' : 'success.50',
                        transition: 'all 0.3s',
                        '&:hover': allPartnerOfferings.length > 0 ? {
                          borderColor: 'success.dark',
                          bgcolor: 'success.100'
                        } : {}
                      }}
                    >
                      <CardContent sx={{ textAlign: 'center', py: 4 }}>
                        <Button
                          onClick={handleDownload}
                          disabled={allPartnerOfferings.length === 0}
                          fullWidth
                          sx={{ height: '100%', textTransform: 'none' }}
                        >
                          <Stack alignItems="center">
                            <DownloadIcon
                              sx={{
                                fontSize: 48,
                                color: allPartnerOfferings.length === 0 ? 'grey.400' : 'success.main',
                                mb: 2
                              }}
                            />
                            <Typography variant="h6" gutterBottom>
                              Download CSV
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Export current offerings
                            </Typography>
                          </Stack>
                        </Button>
                      </CardContent>
                    </Card>
                  </Stack>

                  {/* Data Preview */}
                  {uploadedOfferings.length > 0 && (
                    <>
                      <Divider sx={{ my: 3 }} />
                      <Box>
                        <Typography variant="h5" gutterBottom fontWeight="bold">
                          Uploaded Offerings ({uploadedOfferings.length})
                        </Typography>
                        <Paper
                          variant="outlined"
                          sx={{
                            maxHeight: 400,
                            overflow: 'auto',
                            bgcolor: 'grey.50',
                            p: 2
                          }}
                        >
                          <Stack spacing={2}>
                            {uploadedOfferings.map((offering, index) => (
                              <Card key={offering.id || index}>
                                <CardContent>
                                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                    <Box sx={{ flex: 1 }}>
                                      <Typography variant="h6" gutterBottom>
                                        {offering.offeringName || 'Unnamed Offering'}
                                      </Typography>
                                      <Typography variant="body2" color="text.secondary" gutterBottom>
                                        ID: {offering.id || 'N/A'}
                                      </Typography>
                                      {offering.company?.name && (
                                        <Typography variant="body2" color="text.secondary">
                                          Company: {offering.company.name}
                                        </Typography>
                                      )}
                                    </Box>
                                    <Chip
                                      label={`${offering.apis?.length || 0} API(s)`}
                                      color="primary"
                                      size="small"
                                    />
                                  </Stack>
                                </CardContent>
                              </Card>
                            ))}
                          </Stack>
                        </Paper>
                      </Box>
                    </>
                  )}

                  {/* Instructions */}
                  <Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: 'divider' }}>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      CSV Format
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Your CSV file should include the following columns:
                    </Typography>
                    <Stack component="ul" spacing={0.5} sx={{ pl: 3 }}>
                      <Typography component="li" variant="body2" color="text.secondary">
                        id, offeringName, contactInfo, dashboard, notes
                      </Typography>
                      <Typography component="li" variant="body2" color="text.secondary">
                        status, nwnOffering, nwnOfferingManager
                      </Typography>
                      <Typography component="li" variant="body2" color="text.secondary">
                        company, priority
                      </Typography>
                      <Typography component="li" variant="body2" color="text.secondary">
                        apiDocLink, apiTrainingLink, apiSandboxEnvironment, apiEndpoint
                      </Typography>
                      <Typography component="li" variant="body2" color="text.secondary">
                        apiType, authenticationType, authenticationInfo
                      </Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                      Multiple rows with the same ID will be grouped into a single offering with multiple APIs.
                    </Typography>
                  </Box>
                </Paper>
              </Container>
            </Box>
          </>
        ) :
          (
            <Typography>Loading...</Typography>
          )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={uploadedOfferings.length === 0}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CSVManager;