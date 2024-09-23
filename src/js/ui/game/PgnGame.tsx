import React, {useMemo} from "react";
import GameWrapper from "./GameWrapper";
import {GameProps} from "../../chess/settings/GameProps";
import PgnGameComponent from "./PgnGameComponent";

const PgnGame: React.FC<GameProps> = (propsIn) => {
    const props = useMemo(() => {
        return {
            ...propsIn,
            mode: 'pgn'
        } as GameProps;
    }, [propsIn]);

    return (
        <GameWrapper GameComponent={PgnGameComponent} {...props} />
    );
};

export default PgnGame;