import React, {useMemo} from "react";
import GameWrapper from "./GameWrapper";
import {GameProps} from "../../chess/settings/GameProps";
import WatchGameComponent from "./WatchGameComponent";

const WatchGame: React.FC<GameProps> = (propsIn) => {
    const props = useMemo(() => {
        return {
            ...propsIn,
            mode: 'watch'
        } as GameProps;
    }, [propsIn]);

    return (
        <GameWrapper GameComponent={WatchGameComponent} {...props} />
    );
};

export default WatchGame;