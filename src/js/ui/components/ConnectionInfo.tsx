import * as React from 'react';
import classNames from 'classnames';
import { SafeAnchor } from 'react-bootstrap';
import { ConnectionStatus } from '../../net/ConnectionStatus';

export interface ConnectionInfoProps  {
    status: ConnectionStatus
}

const names = ['Offline', 'Connect', 'Online', 'Offline'];
const classes = ['gray', 'yellow', 'green', 'red'];

export class ConnectionInfo extends React.Component<ConnectionInfoProps, {}> {
    constructor(props: ConnectionInfoProps) {
        super(props);
    }

    onClick = (e: React.MouseEvent) => {

    }

    render() {
        const { onClick, props } = this;
        const { status } = props;

        const name = names[status];
        const classc = classes[status];

        return (
            <span><SafeAnchor href="#" onClick={onClick} >
                <div className={classNames('status-icon', classc)}></div> {name}
            </SafeAnchor></span>
        );
    }
}
