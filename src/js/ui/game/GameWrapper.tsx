import React, {Suspense, useEffect} from 'react';
import { Provider } from 'react-redux';
import { SnackbarProvider } from 'notistack';

import CircularProgress from "@mui/material/CircularProgress";
import { ThemeProvider } from '@mui/material/styles';

import { GameProps, defaultProps } from '../../chess/settings/GameProps';
import {createCombinedGameState} from "../../actions/CombinedGameState";
import {createCombinedGameStore} from "../../actions/CombinedGameStore";
import {ChessTheme} from "../ChessTheme";

type GamePropsVsComponent = GameProps & {
    GameComponent: React.VFC<GameProps>;
};

const GameWrapper: React.FC<GamePropsVsComponent> = (props) => {
    const {GameComponent, ...other} = props;

    const state = createCombinedGameState(other);
    const store = createCombinedGameStore(state);

    useEffect(() => {
    }, []);

    return (
        <Suspense fallback={<CircularProgress />}>
            <SnackbarProvider maxSnack={4} anchorOrigin={{horizontal: "right", vertical: "bottom"}}>
                <Provider store={store}>
                    <ThemeProvider theme={ChessTheme}>
                        <GameComponent {...other}/>
                    </ThemeProvider>
                </Provider>
            </SnackbarProvider>
        </Suspense>
    );
};

GameWrapper.defaultProps = defaultProps;

export default GameWrapper;