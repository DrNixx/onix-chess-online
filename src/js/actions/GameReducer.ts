import { Reducer } from 'redux';
import { Logger } from '../common/Logger';
import { GameActions as ga } from './GameActions';
import { GameState, getGameState } from './GameState';
import { Chess as ChessEngine } from '../chess/Chess';
import { IGameData } from '../chess/types/Interfaces';
import { MovesMode } from '../ui/components/Constants';

const INITIAL_STATE: GameState = {
    engine: new ChessEngine(),
    fen: "",
    isCheck: false,
    moves: MovesMode.List
};

export const gameReducer: Reducer<GameState, ga.GameAction> = (state: GameState = INITIAL_STATE, action: ga.GameAction) => {
    Logger.debug('Try game action', action);
    switch (action.type) {
        case ga.NAVIGATE_TO_PLY: {
            const { engine, moves } = state;

            if (engine) {
                engine.moveToPly(action.ply);

                return {
                    ...state,
                    ...getGameState(engine),
                    moves
                }
            }
            
            return {
                ...state
            };
        }

        case ga.NAVIGATE_TO_MOVE: {
            const { engine, moves } = state;

            if (engine) {
                engine.moveToPly(action.move.PlyCount);

                return {
                    ...state,
                    ...getGameState(engine),
                    moves
                }
            }
            
            return {
                ...state
            };
        }

        case ga.NAVIGATE_TO_KEY: {
            const { engine, moves } = state;

            if (engine) {
                engine.moveToKey(action.move);
                return {
                    ...state,
                    ...getGameState(engine),
                    moves
                }
            }
            
            return {
                ...state
            };
        }

        case ga.GAME_ADD_MOVE: {
            const { engine, moves } = state;

            if (engine) {
                engine.decodeMove(action.move);
                engine.moveLast();
                return {
                    ...state,
                    ...getGameState(engine),
                    moves
                }
            }
            
            return {
                ...state
            };
        }

        case ga.GAME_LOAD_PARTIAL: {
            const { engine, moves } = state;
            const savedPly = engine.CurrentPlyCount;

            const newData: IGameData = {
                ...engine.RawData,
                ...action.game
            }

            const newEngine = new ChessEngine(newData);
            newEngine.moveToPly(savedPly);

            return {
                engine: newEngine,
                ...getGameState(newEngine),
                moves
            }
        }

        case ga.GAME_LOAD_FULL: {
            const { moves } = state;
            const engine = new ChessEngine(action.game);
            engine.moveLast();
            return {
                engine,
                ...getGameState(engine),
                moves
            }
        }

        case ga.TOGGLE_MOVES: {
            const { moves, ...other } = state;
            const newMode = (moves == MovesMode.List) ? MovesMode.Table : MovesMode.List;

            return {
                moves: newMode,
                ...other
            }
        }

        default:
            return state;
    }
}
