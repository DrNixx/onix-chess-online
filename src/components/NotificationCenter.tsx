import React from 'react';
import NotificationCenterComponent from './NotificationCenterComponent';
import { NotificationCenterProps } from './NotificationCenterProps';

const NotificationCenter: React.FC<NotificationCenterProps> = (props) => {
    return (
        <NotificationCenterComponent {...props} />
    );
};

export default NotificationCenter;
