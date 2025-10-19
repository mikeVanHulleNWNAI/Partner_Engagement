import { AppBar, Toolbar, Typography, CircularProgress } from "@mui/material";
import { NAVBAR_COLOR } from "./Utils/Constants";
import { adjustColorHSL } from "./Utils/adjustColor";

interface NavBarProps {
    isLoading?: boolean;
}

export default function NavBar({ isLoading = false }: NavBarProps) {
    return (
        <AppBar 
            position="fixed" 
            sx={{ 
                backgroundColor:`${adjustColorHSL(NAVBAR_COLOR, 0)}`, 
                boxShadow: 'none',
                borderBottom: `2px solid ${adjustColorHSL(NAVBAR_COLOR, -15)}` // Darker border
            }}
        >
            <Toolbar sx={{ display: 'flex', justifyContent: 'flex-start', height: '64px', minHeight: '64px' }}>
                <Typography sx={{ color: '#000000', position: 'relative', textAlign: 'left' }} variant="h5" fontWeight='bold'>
                    Partner Offerings
                </Typography>
                {isLoading && (
                    <CircularProgress 
                        size={24} 
                        sx={{ 
                            marginLeft: 2,
                            color: '#000000'
                        }} 
                    />
                )}
            </Toolbar>
        </AppBar>
    )
}