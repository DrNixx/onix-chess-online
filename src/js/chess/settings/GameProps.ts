import { BoardSettings, defaultSettings as boardDefaults } from "./BoardSettings";
import { GameSettings, defaultGameData as gameDefaults } from "./GameSettings";
import {defaultOf} from "../../utils/propsUtils";

export type GameMode = 'pgn' | 'play' | 'watch' | 'analyse';

export interface GameProps {
    mode?: GameMode;
    locale?: string;
    board?: Partial<BoardSettings>;
    game?: GameSettings;
}

type propsWithDefault = 'mode' | 'locale' | 'board' | 'game';
export const defaultProps: defaultOf<GameProps, propsWithDefault> = {
    mode: 'watch',
    locale: "ru-ru",
    board: boardDefaults,
    game: gameDefaults
};