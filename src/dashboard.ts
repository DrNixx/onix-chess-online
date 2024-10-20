import {ComponentProps} from "./utils/types";
import {renderPortal} from "./utils/renderUtils";
import GameListWidget from "./components/widgets/GameListWidget";
import ForumWidget from "./components/widgets/ForumWidget";

export const gameList = (container: HTMLElement, props: ComponentProps<typeof GameListWidget>) =>
    renderPortal(container, GameListWidget, props, true);

export const forumWidget = (container: HTMLElement, props: ComponentProps<typeof ForumWidget>) =>
    renderPortal(container, ForumWidget, props, true);
