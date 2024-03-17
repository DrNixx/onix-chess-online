import React, {Suspense} from 'react';

import { GameProps, defaultProps } from '../../chess/settings/GameProps';
import ThemeContext from "../../context/ThemeContext";
import AlertContext from '../../context/AlertContext';
import {AuthProvider} from "../../providers/AuthProvider";
import {GameProvider} from "../../providers/GameProvider";
import {BoardProvider} from "../../providers/BoardProvider";
import Loader from "../Loader";

type GamePropsVsComponent = GameProps & {
    GameComponent: React.FC<GameProps>;
};

const GameWrapper: React.FC<GamePropsVsComponent> = (props) => {
    const {GameComponent, ...other} = props;

    return (
        <Suspense fallback={<Loader />}>
            <AuthProvider>
                <AlertContext>
                    <ThemeContext>
                        <GameProvider settings={props.game}>
                            <BoardProvider>
                                <GameComponent {...other}/>
                            </BoardProvider>
                        </GameProvider>
                    </ThemeContext>
                </AlertContext>
            </AuthProvider>
        </Suspense>
    );
};

GameWrapper.defaultProps = defaultProps;

export default GameWrapper;