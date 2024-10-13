import { renderRoot } from './utils/renderUtils';
import { ComponentProps } from './utils/types';
import ChessApplicationComponent from "./app/ChessApplicationComponent";
import NotificationCenter from './components/NotificationCenter';

export const chessApp = (container: HTMLElement, props: ComponentProps<typeof ChessApplicationComponent>) =>
    renderRoot(container, ChessApplicationComponent, props);

export const notificationCenter = (container: HTMLElement, props: ComponentProps<typeof NotificationCenter>) =>
    renderRoot(container, NotificationCenter, props);