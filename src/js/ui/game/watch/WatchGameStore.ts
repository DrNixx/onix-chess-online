import { Store, createStore as reduxCreateStore, combineReducers, AnyAction } from 'redux';
import { intlReducer } from '../../../i18n/IntlReducer';
import { boardReducer } from '../../../actions/BoardReducer';
import { gameReducer } from '../../../actions/GameReducer';
import { WatchGameState } from "./WatchGameState";


export const createWatchGameStore = (preloadedState: WatchGameState): WatchGameStore =>
    reduxCreateStore(
        combineReducers<WatchGameState>({
            intl: intlReducer,
            board: boardReducer,
            game: gameReducer,
        }), preloadedState);

// export type combinedAction = GameAction | ba.BoardAction | AnalyseAction | IntlAction;
export type WatchGameStore = Store<WatchGameState, AnyAction>;