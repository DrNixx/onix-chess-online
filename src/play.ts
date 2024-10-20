import { renderRoot } from './utils/renderUtils';
import { ComponentProps } from './utils/types';
import PlayGame from "./components/chess/PlayGame";

export const playGame = (container: HTMLElement, props: ComponentProps<typeof PlayGame>) =>
    renderRoot(container, PlayGame, props);