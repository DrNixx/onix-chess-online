import React from "react";
import CircularProgress, {CircularProgressProps} from "@mui/material/CircularProgress";



const Loader: React.FC<CircularProgressProps> = (props) => {
    return (
        <CircularProgress {...props} />
    );
};

export default Loader;