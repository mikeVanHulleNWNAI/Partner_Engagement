import { AppBar, Toolbar, Typography, CircularProgress } from "@mui/material";
import { NAVBAR_COLOR } from "./Utils/Constants";
import { adjustColorHSL } from "./Utils/adjustColor";
import NavBarMenu from "./Menus/NavBarMenu";
import { useDataStore } from "./DataStoreProvider";

interface NavBarProps {
    height?: number;
}

export default function NavBar({
    height = 16
}: NavBarProps) {
    const navHeight = Math.max(height, 16);

    const {
        isLoading
    } = useDataStore();

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
                {!isLoading && (
                    <NavBarMenu />
                )}
            </Toolbar>
        </AppBar>
    );
}