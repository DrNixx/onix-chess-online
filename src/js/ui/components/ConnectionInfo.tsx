import React from 'react';
import clsx from "clsx";

import Button from "@mui/material/Button";

import { ConnectionStatus } from '../../net/ConnectionStatus';

export interface ConnectionInfoProps  {
    status: ConnectionStatus
}

const names = ['Offline', 'Connect', 'Online', 'Offline'];
const classes = ['gray', 'yellow', 'green', 'red'];

export class ConnectionInfo extends React.Component<ConnectionInfoProps, any> {
    constructor(props: ConnectionInfoProps) {
        super(props);
    }

    onClick = (e: React.MouseEvent) => {
        return;
    }

    render() {
        const { onClick, props } = this;
        const { status } = props;

        const name = names[status];
        const classc = classes[status];

        return (
            <span><Button variant="text" href="#" onClick={onClick} >
                <div className={clsx('status-icon', classc)} /> {name}
            </Button></span>
        );
    }
}
