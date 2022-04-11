import React from 'react';
import { createTheme } from '@mui/material/styles';

export const ChessTheme = createTheme({
    components: {
        MuiTab: {
            styleOverrides: {
                root: {
                    fontFamily: "var(--bs-font-secondary)",
                    fontSize: ".725rem",
                }
            }
        },
        MuiCardHeader: {
            styleOverrides: {
                content: {
                    "& .title": {
                        fontFamily: "var(--bs-font-secondary)",
                        textTransform: "uppercase",
                        display: "inline-block",
                        letterSpacing: "0.06em",
                        fontSize: ".725rem",
                        fontWeight: 500,
                        margin: 0,
                        padding: 0,
                        lineHeight: "normal",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        "& i": {
                            fontSize: "2em"
                        }
                    }
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