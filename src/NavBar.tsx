import { AppBar, Box, Container, Toolbar, Typography, } from "@mui/material";

export default function NavBar() {

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="fixed"
                sx={{
                    backgroundImage: 'linear-gradient(135deg, #182a73 0%, #218aae 69%, #20a7ac 89%)',
                }}>
                <Container maxWidth='xl'>
                    <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Box>
                            <Typography sx={{ position: 'relative' }} variant="h6" fontWeight='bold'>
                                API Connections Manager
                            </Typography>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
        </Box>)
}