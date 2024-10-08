import { Store, createStore as reduxCreateStore, combineReducers, AnyAction } from 'redux';
import { gameReducer } from './GameReducer';
import { boardReducer } from './BoardReducer';
import { CombinedGameState } from "./CombinedGameState";

export const createCombinedGameStore = (preloadedState: CombinedGameState): CombinedGameStore =>
    reduxCreateStore(
        combineReducers<CombinedGameState>({
            board: boardReducer,
            game: gameReducer,
        }), preloadedState);

// export type combinedAction = GameAction | ba.BoardAction | AnalyseAction | IntlAction;
export type CombinedGameStore = Store<CombinedGameState, AnyAction>;