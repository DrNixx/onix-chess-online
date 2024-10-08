import React, {Suspense} from 'react';
import { Provider } from 'react-redux';

import CircularProgress from "@mui/material/CircularProgress";
import { GameProps, defaultProps } from '../../chess/settings/GameProps';
import {createCombinedGameState} from "../../actions/CombinedGameState";
import {createCombinedGameStore} from "../../actions/CombinedGameStore";
import ThemeContext from "../../context/ThemeContext";
import AlertContext from '../../context/AlertContext';

type GamePropsVsComponent = GameProps & {
    GameComponent: React.FC<GameProps>;
};

const GameWrapper: React.FC<GamePropsVsComponent> = (props) => {
    const {GameComponent, ...other} = props;

    const state = createCombinedGameState(other);
    const store = createCombinedGameStore(state);

    return (
        <Suspense fallback={<CircularProgress />}>
            <AlertContext>
                <Provider store={store}>
                    <ThemeContext>
                        <GameComponent {...other}/>
                    </ThemeContext>
                </Provider>
            </AlertContext>
        </Suspense>
    );
};

GameWrapper.defaultProps = defaultProps;

export default GameWrapper;