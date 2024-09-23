import { IGameData } from '../types/Interfaces';
import {defaultOf} from "../../utils/propsUtils";

export interface GameSettings extends IGameData {   
}

type propsGameWithDefaults = 'game' | 'orientation';
export const defaultGameData: defaultOf<IGameData, propsGameWithDefaults> = {
    game: {
        id: 0,
        load: false,
        insite: false,
        event: '?',
        variant: {
            key: "standard",
            name: "Standard",
            shortName: "Std"
        },
        speed: "correspondence",
        rated: false,
        initialFen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        player: "white",
        turns: 0,
        startedAtTurn: 0,
        status: {
            name: "noStart"
        },
    },
    orientation: "white"
};