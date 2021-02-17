import { BoardSize } from "onix-board-assets";

export type CHANGE_SIZE = 'CHANGE_SIZE';
export type SET_PIECE = 'SET_PIECE';
export type SET_SQUARE = 'SET_SQUARE';
export type FLIP_BOARD = 'FLIP_BOARD';
export type SET_COORDS = 'SET_COORDS';

export const FLIP_BOARD : FLIP_BOARD = 'FLIP_BOARD';
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
    type: FLIP_BOARD | SET_COORDS
}

export type BoardAction = 
    BoardToggleAction | 
    SetBoardSizeAction | 
    SetPieceAction | 
    SetSquareAction; 