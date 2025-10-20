import { AppBar, Toolbar, Typography, CircularProgress } from "@mui/material";
import { NAVBAR_COLOR } from "./Utils/Constants";
import { adjustColorHSL } from "./Utils/adjustColor";

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
            className="shadow-none"
            style={{
                backgroundColor: `${adjustColorHSL(NAVBAR_COLOR, 0)}`,
                borderBottom: `2px solid ${adjustColorHSL(NAVBAR_COLOR, -15)}`
            }}
        >
            <Toolbar 
                className="flex justify-start"
                style={{ height: `${navHeight * 4}px` }}
            >
                <Typography className="text-black relative text-left" variant="h5" fontWeight='bold'>
                    Partner Offerings
                </Typography>
                {isLoading && (
                    <CircularProgress
                        size={24}
                        className="ml-2 text-black"
                    />
                )}
            </Toolbar>
        </AppBar>
    )
}