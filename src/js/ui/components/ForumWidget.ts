import React from "react";
import {createRoot} from "react-dom/client";
import {ForumWidgetProps} from "./ForumWidgetProps";
import ForumWidgetComponent from "./ForumWidgetComponent";

export const forumWidget = (props: ForumWidgetProps, container: HTMLElement) => {
    const root = createRoot(container);
    root.render(React.createElement(ForumWidgetComponent, props));
};
