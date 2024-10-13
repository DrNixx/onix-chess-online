import { renderRoot } from './utils/renderUtils';
import { ComponentProps } from './utils/types';
import ChessApplicationComponent from "./app/ChessApplicationComponent";
import PlayGame from "./components/chess/PlayGame";

export const chessApp = (container: HTMLElement, props: ComponentProps<typeof ChessApplicationComponent>) =>
    renderRoot(container, ChessApplicationComponent, props);

export const playGame = (container: HTMLElement, props: ComponentProps<typeof PlayGame>) =>
    renderRoot(container, PlayGame, props);