import { Store } from 'redux';
import { BoardSize } from 'onix-board-assets';
import * as cg from 'chessground/types';
import { BoardAction } from './BoardActions';

export interface BoardState {
    is3d: boolean;
    size: BoardSize;
    piece: string;
    square: string;
    orientation: cg.Color;
    coordinates: boolean;
}

export interface BoardRelatedState {
    board: BoardState,
}

export type BoardRelatedStore = Store<BoardRelatedState, BoardAction>;
