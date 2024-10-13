import { renderRoot } from './utils/renderUtils';
import { ComponentProps } from './utils/types';
import ChessApplicationComponent from "./app/ChessApplicationComponent";
import ConfigureGame from "./components/chess/ConfigureGame";

export const chessApp = (container: HTMLElement, props: ComponentProps<typeof ChessApplicationComponent>) =>
    renderRoot(container, ChessApplicationComponent, props);

export const configureGame = (container: HTMLElement, props: ComponentProps<typeof ConfigureGame>) =>
    renderRoot(container, ConfigureGame, props);