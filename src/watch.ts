import { renderRoot } from './utils/renderUtils';
import { ComponentProps } from './utils/types';
import WatchGame from "./components/chess/WatchGame";

export const watchGame = (container: HTMLElement, props: ComponentProps<typeof WatchGame>) =>
    renderRoot(container, WatchGame, props);