import { renderRoot } from './utils/renderUtils';
import { ComponentProps } from './utils/types';
import ChessApplicationComponent from "./app/ChessApplicationComponent";
import WatchGame from "./ui/game/WatchGame";

export const chessApp = (container: HTMLElement, props: ComponentProps<typeof ChessApplicationComponent>) =>
    renderRoot(container, ChessApplicationComponent, props);

export const watchGame = (container: HTMLElement, props: ComponentProps<typeof WatchGame>) =>
    renderRoot(container, WatchGame, props);