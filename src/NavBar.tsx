import { AppBar, Toolbar, Typography, CircularProgress } from "@mui/material";
import { NAVBAR_COLOR } from "./Utils/Constants";
import { adjustColorHSL } from "./Utils/adjustColor";
import DialogMenu from "./SpecialDialogs/DialogMenu";

interface NavBarProps {
    isLoading?: boolean;
    height?: number;
}

export default function NavBar({
    isLoading = false,
    height = 16
}: NavBarProps) {
    const navHeight = Math.max(height, 16);

    return (
        <AppBar
            position="fixed"
            sx={{
                boxShadow: 'none',
                backgroundColor: adjustColorHSL(NAVBAR_COLOR, 0),
                borderBottom: `2px solid ${adjustColorHSL(NAVBAR_COLOR, -15)}`,
            }}
        >
            <Toolbar
                sx={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    height: `${navHeight * 4}px`,
                    minHeight: `${navHeight * 4}px`,
                }}
            >
                <Typography
                    variant="h5"
                    component="h1"
                    sx={{
                        fontWeight: 'bold',
                        color: 'black',
                        textAlign: 'left',
                        position: 'relative'
                    }}
                >
                    Partner Offerings
                </Typography>
                {isLoading && (
                    <CircularProgress
                        size={24}
                        sx={{ ml: 2, color: 'black' }}
                    />
                )}
                <DialogMenu />
            </Toolbar>
        </AppBar>
    );
}