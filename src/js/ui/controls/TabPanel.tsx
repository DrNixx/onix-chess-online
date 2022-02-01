import React, {Fragment} from 'react';
import clsx from "clsx";

type TabPanelProps = {
    id: string;
    className?: string;
    dir?: string;
    eventKey: string;
    activeKey: string;
}

const TabPanel: React.FC<TabPanelProps> = (props) => {

    const { children, id, eventKey, activeKey, className, ...other } = props;



    return (
        <div
            id={`${id}-tabpanel-${eventKey}`}
            className={clsx(className)}
            role="tabpanel"
            hidden={activeKey !== eventKey}
            aria-labelledby={`${id}-tab-${eventKey}`}
            {...other}
        >
            {activeKey === eventKey && (
                <Fragment>{children}</Fragment>
            )}
        </div>
    );
};

export default TabPanel;

export function a11yProps(id: string, eventKey: string) {
    return {
        id: `${id}-tab-${eventKey}`,
        'aria-controls': `${id}-tabpanel-${eventKey}`,
    };
}