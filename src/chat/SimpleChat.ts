import {createRoot} from "react-dom/client";
import React from "react";
import Chat from "./Chat";
import {ChatProps} from "./ChatProps";

export const simpleChat = (container: HTMLElement, props: ChatProps) => {
    const root = createRoot(container);
    root.render(React.createElement(Chat, props));
};