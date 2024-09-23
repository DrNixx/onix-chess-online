import React, {useMemo} from "react";
import {defaultProps as gameDefaults, GameProps} from "../../chess/settings/GameProps";
import GameWrapper from "./GameWrapper";
import ConfigureGameComponent from "./ConfigureGameComponent";
import {BoardSettings} from "../../chess/settings/BoardSettings";

const ConfigureGame: React.FC<Partial<BoardSettings>> = (props) => {
    const gameProps = useMemo<GameProps>(()=> {
        return {
            ...gameDefaults,
            board: {...props}
        };
    }, [props]);

    return (
        <GameWrapper GameComponent={ConfigureGameComponent} {...gameProps} />
    );
};

export default ConfigureGame;