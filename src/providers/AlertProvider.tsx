import React, { PropsWithChildren } from 'react';
import { SnackbarProvider } from 'notistack';

export const AlertProvider: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <SnackbarProvider maxSnack={3} anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
            {children}
        </SnackbarProvider>
    );
};
