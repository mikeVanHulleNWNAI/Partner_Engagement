import { Card, CardContent, Box, Typography } from '@mui/material';
import { partnerOfferingType } from "./Types";
import { grey } from '@mui/material/colors';
import { lightGreen } from '@mui/material/colors';
import { amber } from '@mui/material/colors';
import { deepOrange } from '@mui/material/colors';
import { yellow } from '@mui/material/colors';

function PartnerOfferingTile({
    partnerOffering,
    isHighlighted = false,
    disabled = false,
    onClick }:
    {
        partnerOffering: partnerOfferingType
        isHighlighted?: boolean
        disabled?: boolean
        onClick?: () => void
    }) {

    let tileColor = '#e5e7eb'; // gray-200
    if (partnerOffering.status) {
        switch (partnerOffering.status.name) {
            case "NOT_STARTED":
                tileColor = `${grey['100']}`;
                break;
            case "DISCOVERY":
                tileColor = `${lightGreen['A100']}`;
                break;
            case "EXPERIMENTING":
                tileColor = `${lightGreen['A200']}`;
                break;
            case "INTEGRATING":
                tileColor = `${lightGreen['A400']}`;
                break;
            case "BLOCKED_ACCESS":
                tileColor = `${amber['500']}`;
                break;
            case "BLOCKED_ISSUE":
                tileColor = `${deepOrange['500']}`;
                break;
            case "COMPLETE":
                tileColor = `${lightGreen['A700']}`;
                break;
            case "GENERAL":
                tileColor = `${grey[900]}`;
                break;
            case "DELAYED":
                tileColor = `${yellow[500]}`;
                break;
        }
    }

    return (
        <Card
            onClick={onClick}
            sx={{
                backgroundColor: tileColor,
                borderRadius: 2,
                boxShadow: 2,
                overflow: 'hidden',
                userSelect: 'none',
                transition: 'all 0.3s',
                cursor: onClick ? 'pointer' : 'default',
                pointerEvents: disabled ? 'none' : 'auto',
                ...(isHighlighted && {
                    outline: '4px solid',
                    outlineColor: 'primary.main',
                    outlineOffset: '2px',
                }),
                '&:hover': {
                    boxShadow: onClick ? 6 : 2,
                    ...(onClick && {
                        transform: 'scale(1.05)',
                    }),
                },
            }}
        >
            <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {/* Header with dot indicator */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                            sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                backgroundColor: 'primary.main'
                            }}
                        />
                        <Typography
                            variant="subtitle2"
                            sx={{
                                fontWeight: 600,
                                color: 'text.secondary',
                                textTransform: 'uppercase',
                                letterSpacing: 0.5,
                            }}
                        >
                            {partnerOffering.nwnOffering?.name}
                        </Typography>
                    </Box>

                    {/* Company name with border */}
                    <Box
                        sx={{
                            borderLeft: 4,
                            borderColor: 'grey.400',
                            pl: 1.5,
                        }}
                    >
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 700,
                                color: 'grey.900',
                            }}
                        >
                            {partnerOffering.company?.name}
                        </Typography>
                    </Box>

                    {/* Offering name */}
                    <Box
                        sx={{
                            pt: 1,
                            borderTop: 1,
                            borderColor: 'grey.300',
                        }}
                    >
                        <Typography
                            variant="body2"
                            sx={{
                                color: 'text.secondary',
                            }}
                        >
                            {partnerOffering.offeringName}
                        </Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}

export default PartnerOfferingTile;