import { AppBar, Toolbar, Typography } from "@mui/material";
import { NAVBAR_COLOR } from "./Utils/Constants";
import { adjustColorHSL } from "./Utils/adjustColor";

export default function NavBar() {
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
            </Toolbar>
        </AppBar>
    )
}