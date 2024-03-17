import {createRoot} from "react-dom/client";
import React from "react";
import Chat from "./Chat";
import {ChatProps} from "./ChatProps";

export const simpleChat = (props: ChatProps, container: HTMLElement) => {
    const root = createRoot(container);
    root.render(React.createElement(Chat, props));
};