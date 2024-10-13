import React, {Suspense} from "react";
import {createRoot} from "react-dom/client";
import Loader from "../../ui/Loader";
import {GameListProps} from "./GameListProps";
import GameListComponent from "./GameListComponent";

const GameListWrapper = (props: GameListProps) => {
    return (
        <Suspense fallback={<Loader />}>
            <GameListComponent {...props} />
        </Suspense>
    )
};

export const gameList = (props: GameListProps, container: HTMLElement) => {
    const root = createRoot(container);
    root.render(React.createElement(GameListWrapper, props));
};