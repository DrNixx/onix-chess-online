import React from 'react';
import NotificationCenterComponent from './NotificationCenterComponent';
import { NotificationCenterProps } from './NotificationCenterProps';
import { CentrifugeProvider } from '../providers/CentrifugeProvider';
import { AuthProvider } from '../providers/AuthProvider';
import {ChessTheme} from "../ui/ChessTheme";
import {ThemeProvider} from "@mui/material/styles";

const NotificationCenter: React.FC<NotificationCenterProps> = (props) => {
    return (
        <AuthProvider>
            <ThemeProvider theme={ChessTheme}>
                <CentrifugeProvider>
                    <NotificationCenterComponent {...props} />
                </CentrifugeProvider>
            </ThemeProvider>
    </AuthProvider>
);
};

export default NotificationCenter;
