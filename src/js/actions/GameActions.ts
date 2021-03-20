import { Move } from '../chess/Move';
import { SimpleMove } from '../chess/SimpleMove';
import { IGameData, IMovePart, ITreePart } from '../chess/types/Interfaces';

export namespace GameActions {
    export type NAVIGATE_TO_PLY = 'NAVIGATE_TO_PLY';
    export type NAVIGATE_TO_KEY = 'NAVIGATE_TO_KEY';
    export type NAVIGATE_TO_MOVE = 'NAVIGATE_TO_MOVE';
    export type GAME_LOAD_FULL = 'GAME_LOAD_FULL';
    export type GAME_LOAD_PARTIAL = 'GAME_LOAD_PARTIAL';
    export type GAME_ADD_MOVE = 'GAME_ADD_MOVE';
    export type GAME_ADD_PROVISIONAL = 'GAME_ADD_PROVISIONAL';
    export type GAME_REMOVE_PROVISIONAL = 'GAME_REMOVE_PROVISIONAL';

    export const NAVIGATE_TO_PLY : NAVIGATE_TO_PLY = 'NAVIGATE_TO_PLY';
    export const NAVIGATE_TO_KEY : NAVIGATE_TO_KEY = 'NAVIGATE_TO_KEY';
    export const NAVIGATE_TO_MOVE : NAVIGATE_TO_MOVE = 'NAVIGATE_TO_MOVE';
    export const GAME_LOAD_FULL : GAME_LOAD_FULL = 'GAME_LOAD_FULL';
    export const GAME_LOAD_PARTIAL : GAME_LOAD_PARTIAL = 'GAME_LOAD_PARTIAL';
    export const GAME_ADD_MOVE : GAME_ADD_MOVE = 'GAME_ADD_MOVE';
    export const GAME_ADD_PROVISIONAL : GAME_ADD_PROVISIONAL = 'GAME_ADD_PROVISIONAL';
    export const GAME_REMOVE_PROVISIONAL : GAME_REMOVE_PROVISIONAL = 'GAME_REMOVE_PROVISIONAL';

    export type NavigateToPly = {
        type: NAVIGATE_TO_PLY,
        ply: number,
    }

    export type NavigateToKey = {
        type: NAVIGATE_TO_KEY,
        move: string,
    }

    export type NavigateToMove = {
        type: NAVIGATE_TO_MOVE,
        move: Move,
    }

    export type AddMove = {
        type: GAME_ADD_MOVE,
        move: IMovePart|ITreePart,
    }

    export type AddProvisional = {
        type: GAME_ADD_PROVISIONAL,
        sm: SimpleMove,
    }

    export type RemoveProvisional = {
        type: GAME_REMOVE_PROVISIONAL
    }

    export type LoadFull = {
        type: GAME_LOAD_FULL,
        game: IGameData,
    }

    export type LoadPartial = {
        type: GAME_LOAD_PARTIAL,
        game: IGameData,
    }

    export type GameAction = 
        NavigateToPly | 
        NavigateToKey |
        NavigateToMove |
        AddMove |
        AddProvisional |
        RemoveProvisional |
        LoadPartial |
        LoadFull;
}