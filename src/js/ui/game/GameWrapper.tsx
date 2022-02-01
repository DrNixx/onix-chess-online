import React, {useEffect} from 'react';
import { Provider } from 'react-redux';
import { SnackbarProvider } from 'notistack';

import { ThemeProvider } from '@mui/material/styles';

import { GameProps, defaultProps } from '../../chess/settings/GameProps';
import {createCombinedGameState} from "../../actions/CombinedGameState";
import {createCombinedGameStore} from "../../actions/CombinedGameStore";
import {i18n} from "../../i18n/i18n";
import {ChessTheme} from "../ChessTheme";

type GamePropsVsComponent = GameProps & {
    GameComponent: React.VFC<GameProps>;
};

const GameWrapper: React.VFC<GamePropsVsComponent> = (props) => {
    const {GameComponent, ...other} = props;

    const state = createCombinedGameState(other);
    const store = createCombinedGameStore(state);

    useEffect(() => {
        i18n.register();
    }, []);

    return (
        <SnackbarProvider maxSnack={4} anchorOrigin={{horizontal: "right", vertical: "bottom"}}>
            <Provider store={store}>
                <ThemeProvider theme={ChessTheme}>
                    <GameComponent {...other}/>
                </ThemeProvider>
            </Provider>
        </SnackbarProvider>
    );
};

GameWrapper.defaultProps = defaultProps;

export default GameWrapper;