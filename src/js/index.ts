import { renderRoot } from './utils/renderUtils';
import { ComponentProps } from './utils/types';
import ChessApplicationComponent from "./app/ChessApplicationComponent";

const chessApp = (container: HTMLElement, props: ComponentProps<typeof ChessApplicationComponent>) =>
    renderRoot(container, ChessApplicationComponent, props);

const app_props = {
    locale: 'ru-RU',
    uid: import.meta.env.VITE_USER_ID,
    wsHost: import.meta.env.VITE_WS_HOST,
    token: import.meta.env.VITE_WS_TOKEN,
    modules: [],
};

chessApp(document.getElementById('app-root')!, app_props);