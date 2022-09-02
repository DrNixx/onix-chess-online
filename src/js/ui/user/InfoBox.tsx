import React, {PropsWithChildren} from "react";
import Box from "@mui/material/Box";

const InfoBox: React.FC<PropsWithChildren> = (props) => {
    return (
        <Box sx={{
            pl: 1,
            lineHeight: 1,
            overflow: "hidden",
            "& > div": {
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis"
            }
        }}>
            {props.children}
        </Box>
    );
};

export default InfoBox;