import { BoardSize } from "onix-board-assets";

export type CHANGE_SIZE = 'CHANGE_SIZE';
export type SET_PIECE = 'SET_PIECE';
export type SET_SQUARE = 'SET_SQUARE';
export type FLIP_BOARD = 'FLIP_BOARD';
export type LEARN_BOARD = 'LEARN_BOARD';
export type SET_COORDS = 'SET_COORDS';
export type CONFIRM_MOVE = 'CONFIRM_MOVE';
export type MOVE_TABLE = 'MOVE_TABLE';

export const MOVE_TABLE : MOVE_TABLE = 'MOVE_TABLE';
export const CONFIRM_MOVE : CONFIRM_MOVE = 'CONFIRM_MOVE';
export const FLIP_BOARD : FLIP_BOARD = 'FLIP_BOARD';
export const LEARN_BOARD : LEARN_BOARD = 'LEARN_BOARD';
export const SET_COORDS : SET_COORDS = 'SET_COORDS';
export const CHANGE_SIZE : CHANGE_SIZE = 'CHANGE_SIZE';
export const SET_PIECE : SET_PIECE = 'SET_PIECE';
export const SET_SQUARE : SET_SQUARE = 'SET_SQUARE';

export type SetBoardSizeAction = {
    type: CHANGE_SIZE,
    size: BoardSize
}

export type SetPieceAction = {
    type: SET_PIECE,
    piece: string
}

export type SetSquareAction = {
    type: SET_SQUARE,
    square: string
}

export type BoardToggleAction = {
    type: FLIP_BOARD | SET_COORDS | LEARN_BOARD | CONFIRM_MOVE | MOVE_TABLE
}

export type BoardAction = 
    BoardToggleAction | 
    SetBoardSizeAction | 
    SetPieceAction | 
    SetSquareAction; 