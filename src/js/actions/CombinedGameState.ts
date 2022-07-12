import { GameProps } from "../chess/settings/GameProps";
import { createGameState, GameState } from "./GameState";
import { BoardState } from "./BoardState";

export interface CombinedGameState {
    board: BoardState;
    game: GameState;
} 

export const createCombinedGameState = (props: GameProps): CombinedGameState => {
    const { board, game } = props;
    return {
        board: {
            is3d: !!board.is3d,
            size: board.size,
            piece: board.piece || 'alpha',
            square: board.square || 'color-brown',
            orientation: board.orientation ?? 'white',
            coordinates: !!board.coordinates,
            learnMode: !!board.learnMode,
            confirmMove: !!board.confirmMove,
            moveTable: !!board.moveTable
        },
        game: createGameState(props.game)
    }
}