import {IUser} from "../../app";
import React from "react";
import Box from "@mui/material/Box";

type UserNameElementProps = {
    user: IUser;
    compact: boolean;
};

const UserNameElement: React.FC<UserNameElementProps> = (props) => {
    const { user, compact, children } = props;
    const name = (user.display && user.name && (user.display != '?') && (user.name != '?') && (user.display != user.name)) ? user.name : undefined;
    const separator = (name && !compact) ? " :: " : "";
    return (
        <Box
            className="small"
            sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                flexWrap: 'nowrap'
            }}>
                        <span>
                            {!compact && <span># {user.id}</span>}
                            {name && <span>{separator}{name}</span>}
                        </span>
            { children ? (<span className="ps-4">{children}</span>) : null }
        </Box>
    );
};

export default UserNameElement;