import Header from "./components/layout/Header/Header.tsx";
import {Outlet} from "react-router";
import Footer from "./components/layout/Footer/Footer.tsx";
import ScrollToTop from "./components/common/ScrollToTop/ScrollToTop.tsx";
import {CssBaseline, ThemeProvider as MuiThemeProvider} from "@mui/material";
import theme from "./theme.ts";
import Toaster from "./components/ui/Toaster/Toaster.tsx";
import {ThemeProvider} from "./context/ThemeContext.tsx";

function App() {
    return (
        <ThemeProvider>
            <MuiThemeProvider theme={theme}>
                <CssBaseline />
                <div className="flex flex-col min-h-screen">
                    <ScrollToTop/>
                    <Header />
                    <main className="flex-grow flex justify-center px-5 py-12 min-h-screen">
                        <Outlet/>
                        <Toaster />
                    </main>
                    <Footer/>
                </div>
            </MuiThemeProvider>
        </ThemeProvider>
    )
}

export default App
