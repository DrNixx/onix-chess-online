import { Store, createStore as reduxCreateStore, combineReducers, AnyAction } from 'redux';
import { intlReducer } from '../i18n/IntlReducer';
import { gameReducer } from './GameReducer';
import { boardReducer } from './BoardReducer';
import { CombinedGameState } from "./CombinedGameState";

export const createCombinedGameStore = (preloadedState: CombinedGameState): CombinedGameStore =>
    reduxCreateStore(
        combineReducers<CombinedGameState>({
            intl: intlReducer,
            board: boardReducer,
            game: gameReducer,
        }), preloadedState);

// export type combinedAction = GameAction | ba.BoardAction | AnalyseAction | IntlAction;
export type CombinedGameStore = Store<CombinedGameState, AnyAction>;