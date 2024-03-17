import React from "react";
import AlertContext from "../context/AlertContext";
import ChessApplication from "./ChessApplication";
import {ChessApplicationProps} from "./ChessApplicationProps";

const ChessApplicationComponent : React.FC<ChessApplicationProps> = (props) => {
    return (
        <AlertContext>
            <ChessApplication {...props} />
        </AlertContext>
    );
};

export default ChessApplicationComponent;