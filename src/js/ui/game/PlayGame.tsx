import React, {useMemo} from "react";
import GameWrapper from "./GameWrapper";
import {GameProps} from "../../chess/settings/GameProps";
import PlayGameComponent from "./PlayGameComponent";

const PlayGame: React.FC<GameProps> = (propsIn) => {
    const props = useMemo(() => {
        return {
            ...propsIn,
            mode: 'play'
        } as GameProps;
    }, [propsIn]);

    return (
        <GameWrapper GameComponent={PlayGameComponent} {...props} />
    );
};

export default PlayGame;