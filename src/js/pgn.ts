import { renderRoot } from './utils/renderUtils';
import { ComponentProps } from './utils/types';
import ChessApplicationComponent from "./app/ChessApplicationComponent";
import PgnGame from "./ui/game/PgnGame";

export const chessApp = (container: HTMLElement, props: ComponentProps<typeof ChessApplicationComponent>) =>
    renderRoot(container, ChessApplicationComponent, props);

export const pgnGame = (container: HTMLElement, props: ComponentProps<typeof PgnGame>) =>
    renderRoot(container, PgnGame, props);