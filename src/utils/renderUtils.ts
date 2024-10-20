import React from 'react';
import { createRoot } from 'react-dom/client';
import { createPortal } from 'react-dom';

export function renderRoot<T extends React.ComponentType<T>, P extends {}>(
    container: HTMLElement,
    Component: React.ComponentType<P>,
    props?: P,
) {
    const root = createRoot(container);
    root.render(React.createElement(Component, props));
}

export function renderPortal<T extends React.ComponentType<T>, P extends {}>(
    container: HTMLElement,
    Component: React.ComponentType<P>,
    props?: P,
    clearContainer?: boolean,
    key?: string | null
) {
    if (clearContainer) container.innerHTML = '';
    return createPortal(React.createElement(Component, props), container, key);
}