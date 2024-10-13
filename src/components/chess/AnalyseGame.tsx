import React, {useMemo} from "react";
import GameWrapper from "./GameWrapper";
import {GameProps} from "../../chess/settings/GameProps";
import AnalyseGameComponent from "./AnalyseGameComponent";

const AnalyseGame: React.FC<GameProps> = (propsIn) => {
    const props = useMemo(() => {
        return {
            ...propsIn,
            mode: 'analyse'
        } as GameProps;
    }, [propsIn]);

    return (
        <GameWrapper GameComponent={AnalyseGameComponent} {...props} />
    );
};

export default AnalyseGame;