import { useEffect, useState } from "react";
import { Card, CardContent, Box, Typography } from '@mui/material';
import type { Schema } from "../amplify/data/resource";

function CompanyTile({ company, onClick }:
    {
        company: Schema["Company"]["type"]
        onClick?: () => void
    }) {

    const [partnerOfferings, setPartnerOfferings] = useState<Array<Schema["PartnerOffering"]["type"]>>([]);

    useEffect(() => {
        const fetchData = async () => {
            if (company) {
                await company.partnerOfferings();
                const { data } = await company.partnerOfferings();
                if (data) {
                    setPartnerOfferings(data);
                }
            }
        }

        fetchData();
    }, [company]);

    const hasOffering = partnerOfferings.length > 0;
    const offeringLength = partnerOfferings.length;

    return (
        <Card
            onClick={onClick}
            sx={{
                backgroundColor: 'grey.200',
                borderRadius: 2,
                boxShadow: 2,
                overflow: 'hidden',
                userSelect: 'none',
                height: 128,
                cursor: onClick ? 'pointer' : 'default',
                transition: 'box-shadow 0.3s',
                '&:hover': {
                    boxShadow: 6,
                },
            }}
        >
            <CardContent 
                sx={{ 
                    height: '100%',
                    p: 1,
                    '&:last-child': {
                        pb: 1,
                    },
                }}
            >
                <Box 
                    sx={{ 
                        height: '100%',
                        display: 'flex', 
                        flexDirection: 'column', 
                        justifyContent: 'space-between',
                        color: hasOffering ? 'success.main' : 'inherit',
                    }}
                >
                    <Typography>
                        {company.name}
                    </Typography>
                    {hasOffering && (
                        <Typography 
                            sx={{ 
                                color: 'success.main',
                                fontWeight: 'medium',
                            }}
                        >
                            {offeringLength}
                        </Typography>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
}

export default CompanyTile;