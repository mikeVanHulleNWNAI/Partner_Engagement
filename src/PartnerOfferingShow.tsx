import React from 'react';
import { Box, Typography } from '@mui/material';
import PartnerOfferingTile from './PartnerOfferingTile';
import { RenderLinkOrText } from './RenderLinkOrText';
import ApiList from './ApiList';
import { partnerOfferingType } from './Types';

interface PartnerOfferingShowProps {
    activePartnerOffering: partnerOfferingType
}

const PartnerOfferingShow: React.FC<PartnerOfferingShowProps> = ({
    activePartnerOffering
}: PartnerOfferingShowProps) => {
    return (
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
        </Box>);
};

export default PartnerOfferingShow;