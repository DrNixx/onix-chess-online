import React from 'react';

import { GameProps } from '../../chess/settings/GameProps';
import ThemeContext from "../../context/ThemeContext";
import {AuthProvider} from "../../providers/AuthProvider";
import {GameProvider} from "../../providers/GameProvider";
import {BoardProvider} from "../../providers/BoardProvider";

type GamePropsVsComponent = GameProps & {
    GameComponent: React.FC<GameProps>;
};

const GameWrapper: React.FC<GamePropsVsComponent> = (props) => {
    const {GameComponent, ...other} = props;

    return (
        <GameProvider settings={props.game} mode={props.mode}>
            <BoardProvider {...props.board}>
                <GameComponent {...other}/>
            </BoardProvider>
        </GameProvider>
    );
};

export default GameWrapper;