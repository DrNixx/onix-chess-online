import React, {PropsWithChildren} from "react";
import Box from "@mui/material/Box";
import {IUser} from "../../models/user/IUser";

type UserNameElementProps = {
    user: IUser;
    compact: boolean;
};

const UserNameElement: React.FC<PropsWithChildren<UserNameElementProps>> = (props) => {
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
                        <Box sx={{ maxWidth: '100%', textOverflow: 'ellipsis', overflow: 'hidden'}}>
                            {!compact && <span># {user.id}</span>}
                            {name && <span>{separator}{name}</span>}
                        </Box>
            { children ? (<span className="ps-4">{children}</span>) : null }
        </Box>
    );
};

export default UserNameElement;