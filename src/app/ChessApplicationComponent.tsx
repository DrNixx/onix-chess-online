import React from "react";
import {ThemeProvider} from "@mui/material/styles";
import AlertContext from "../context/AlertContext";
import ChessApplication from "./ChessApplication";
import {ChessApplicationProps} from "./ChessApplicationProps";
import { AuthProvider} from "../providers/AuthProvider";
import {CentrifugeProvider} from "../providers/CentrifugeProvider";
import {ChessTheme} from "../ui/ChessTheme";

const ChessApplicationComponent : React.FC<ChessApplicationProps> = (props) => {
    return (
        <AlertContext>
            <AuthProvider>
                <ThemeProvider theme={ChessTheme}>
                    <CentrifugeProvider>
                        <ChessApplication {...props} />
                    </CentrifugeProvider>
                </ThemeProvider>
            </AuthProvider>
        </AlertContext>
    );
};

export default ChessApplicationComponent;