import {createPortal} from "react-dom";
import React from "react";
import Chat from "./Chat";
import {ChatProps} from "./ChatProps";

export const simpleChat = (container: HTMLElement, props: ChatProps) => {
    return createPortal(React.createElement(Chat, props), container);
};
