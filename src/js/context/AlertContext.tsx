import React, {PropsWithChildren} from "react";
import {SnackbarProvider} from "notistack";

const AlertContext = (props: PropsWithChildren<any>) => {
    return (
        <SnackbarProvider maxSnack={4} anchorOrigin={{horizontal: "right", vertical: "bottom"}}>
            {props.children}
        </SnackbarProvider>
    );
};

export default AlertContext;