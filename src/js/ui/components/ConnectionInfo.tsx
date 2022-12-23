import React from 'react';
import clsx from "clsx";

import Button from "@mui/material/Button";

type Props = {
    online: boolean;
};

const ConnectionInfo: React.FC<Props> = ({online}) => {
    const name = online ? 'Online' : 'Offline';
    const classc = online ? 'green' : 'gray';

    return (
        <span><Button variant="text" href="#" >
            <div className={clsx('status-icon', classc)} /> {name}
        </Button></span>
    );
}

export default ConnectionInfo;
