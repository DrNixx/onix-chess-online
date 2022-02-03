import React from 'react';
import { createTheme } from '@mui/material/styles';

export const ChessTheme = createTheme({
    components: {
        MuiTab: {
            styleOverrides: {
                root: {
                    fontFamily: "var(--bs-font-secondary)",
                }
            }
        }
    },
    palette: {
        primary: {
            main: '#20748c',
            contrastText: 'white',
        },
        secondary: {
            main: "#0072ec"
        },
        error: {
            main: "#f55753"
        },
        warning: {
            main: "#f8d053"
        },
        info: {
            main: "#1f3953"
        },
        success: {
            main: "#ff8719",
            contrastText: 'white',
        }
    },
    typography: {
        fontFamily: "var(--bs-body-font-family)"
    }
});