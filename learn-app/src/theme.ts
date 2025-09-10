import {createTheme} from "@mui/material";

const getCssVariable = (variableName: string): string =>
    getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();

const theme = createTheme({
    typography: {
        fontFamily: "var(--font-family-body), sans-serif",
    },
    palette: {
        primary: {
            main: getCssVariable("--color-primary-100"),
        },
        secondary: {
            main: getCssVariable("--color-secondary-100"),        },
        text: {
            primary: getCssVariable("--color-body-100"),
        },
        background: {
            default: getCssVariable("--color-bg"),
            paper: getCssVariable("--color-basic-100"),
        }
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: "var(--color-bg)",
                    color: "var(--color-body-100)",
                },
            },
        },
    },
});

export default theme;
