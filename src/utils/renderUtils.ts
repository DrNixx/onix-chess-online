import React from 'react';
import { createRoot } from 'react-dom/client';

// eslint-disable-next-line @typescript-eslint/ban-types
export function renderRoot<T extends React.ComponentType<T>, P extends {}>(
    container: HTMLElement,
    Component: React.ComponentType<P>,
    props?: P,
) {
    const root = createRoot(container);
    root.render(React.createElement(Component, props));
}
