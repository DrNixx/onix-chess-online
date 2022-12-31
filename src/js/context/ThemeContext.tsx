import React, {PropsWithChildren} from "react";
import { ThemeProvider } from '@mui/material/styles';
import {ChessTheme} from "../ui/ChessTheme";

const ThemeContext = (props: PropsWithChildren<any>) => {
    return (
        <ThemeProvider theme={ChessTheme}>
            {props.children}
        </ThemeProvider>
    );
};

export default ThemeContext;