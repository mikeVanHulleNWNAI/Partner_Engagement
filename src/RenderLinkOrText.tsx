import { Box, Link, Typography } from '@mui/material';

// renders a link if it is found to be a link or text if it is not a link.
export const RenderLinkOrText = ({ label, value }: { label: string; value: string }) => {

  const isValidUrl = (text: string) => {
    try {
      new URL(text);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <Box>
      <Typography component="strong" sx={{ fontWeight: 'bold', mr: 1 }}>
        {label}
      </Typography>
      {isValidUrl(value) ? (
        <Link 
          href={value} 
          target="_blank" 
          rel="noopener noreferrer"
          sx={{
            color: 'primary.main',
            textDecoration: 'underline',
            '&:hover': {
              color: 'primary.dark',
            },
          }}
        >
          {value}
        </Link>
      ) : (
        <Typography component="span">
          {value}
        </Typography>
      )}
    </Box>
  );
};