import { AppBar, Toolbar, Typography, } from "@mui/material";

export default function NavBar() {

    return (
        <AppBar position="fixed" sx={{ backgroundColor: '#b19367ff', boxShadow: 'none' }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'flex-start', height: '64px', minHeight: '64px' }}>
                <Typography sx={{ color: '#000000', position: 'relative', textAlign: 'left' }} variant="h5" fontWeight='bold'>
                    Partner Offerings
                </Typography>
            </Toolbar>
        </AppBar>
    )
}