import { renderRoot } from './utils/renderUtils';
import { ComponentProps } from './utils/types';
import ConfigureGame from "./components/chess/ConfigureGame";

export const configureGame = (container: HTMLElement, props: ComponentProps<typeof ConfigureGame>) =>
    renderRoot(container, ConfigureGame, props);