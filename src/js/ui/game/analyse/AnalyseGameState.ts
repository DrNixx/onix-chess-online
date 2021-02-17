import { IntlState } from "../../../i18n/IntlReducer";
import { createGameState, GameState } from "../../../actions/GameState";
import { BoardState } from "../../../actions/BoardState";
import { GameProps } from "../../../chess/settings/GameProps";

export interface AnalyseGameState {
    intl: IntlState;
    board: BoardState;
    game: GameState;
} 

export const createAnalyseGameState = (props: GameProps): AnalyseGameState => {
    const { locale, board, game } = props;
    return {
        intl: {
            locale: locale ?? 'en-us'
        },
        board: {
            is3d: !!board.is3d,
            size: board.size,
            piece: board.piece || 'alpha',
            square: board.square || 'color-brown',
            orientation: board.orientation ?? 'white',
            coordinates: !!board.coordinates
        },
        game: createGameState(props.game)
    }
}