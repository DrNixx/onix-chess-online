import React from 'react';
import * as ReactDOM from 'react-dom';

const Portal: React.FC<any> = (props) => {
    return ReactDOM.createPortal(props.children, document.body);
};

export default Portal;
