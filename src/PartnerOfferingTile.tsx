import { Card, CardContent, Box, Typography } from '@mui/material';
import { partnerOfferingType } from "./Types";

function PartnerOfferingTile({ partnerOffering, onClick, isHighlighted = false }:
    {
        partnerOffering: partnerOfferingType
        isHighlighted?: boolean
        onClick?: () => void
    }) {

    let tileColor = '#e5e7eb'; // gray-200
    if (partnerOffering.priority) {
        switch (partnerOffering.priority.name) {
            case "LOW": 
                tileColor = '#e5e7eb'; // gray-200
                break;
            case "MEDIUM": 
                tileColor = '#fef08a'; // yellow-200
                break;
            case "HIGH": 
                tileColor = '#fecaca'; // red-200
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