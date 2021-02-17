import { Store, createStore as reduxCreateStore, combineReducers, AnyAction } from 'redux';
import { intlReducer } from '../../../i18n/IntlReducer';
import { gameReducer } from '../../../actions/GameReducer';
import { boardReducer } from '../../../actions/BoardReducer';
import { AnalyseGameState } from "./AnalyseGameState";

export const createAnalyseGameStore = (preloadedState: AnalyseGameState) =>
    reduxCreateStore(
        combineReducers<AnalyseGameState>({
            intl: intlReducer,
            board: boardReducer,
            game: gameReducer,
        }), preloadedState);

// export type combinedAction = GameAction | ba.BoardAction | AnalyseAction | IntlAction;
export type AnalyseGameStore = Store<AnalyseGameState, AnyAction>;