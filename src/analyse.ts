import { renderRoot } from './utils/renderUtils';
import { ComponentProps } from './utils/types';
import ChessApplicationComponent from "./app/ChessApplicationComponent";
import AnalyseGame from "./components/chess/AnalyseGame";

export const chessApp = (container: HTMLElement, props: ComponentProps<typeof ChessApplicationComponent>) =>
    renderRoot(container, ChessApplicationComponent, props);

export const analyseGame = (container: HTMLElement, props: ComponentProps<typeof AnalyseGame>) =>
    renderRoot(container, AnalyseGame, props);