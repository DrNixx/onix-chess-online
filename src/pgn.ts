import { renderRoot } from './utils/renderUtils';
import { ComponentProps } from './utils/types';
import PgnGame from "./components/chess/PgnGame";

export const pgnGame = (container: HTMLElement, props: ComponentProps<typeof PgnGame>) =>
    renderRoot(container, PgnGame, props);