import { BoardSize } from 'onix-board-assets';
import { BoardSettings } from "./BoardSettings";
import { GameSettings } from "./GameSettings";

export interface GameProps {
    locale?: string,
    board: BoardSettings,
    game: GameSettings,
}

export const defaultProps: GameProps = {
    locale: "ru-ru",
    board: {
        is3d: false,
        orientation: "white",
        size: BoardSize.Largest,
        piece: "alpha",
        square: "cedar",
        learnMode: false,
        confirmMove: false,
    },
    game: {
        orientation: "white"
    }
};