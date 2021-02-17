import { BoardSize } from 'onix-board-assets';
import { Reducer, Store, createStore as reduxCreateStore, AnyAction } from 'redux';
import { BoardState } from './BoardState';
import { BoardAction, CHANGE_SIZE, FLIP_BOARD, SET_COORDS, SET_PIECE, SET_SQUARE } from './BoardActions';
import { Color as c } from '../chess/Color';

const INITIAL_STATE: BoardState = {
    is3d: false,
    size: BoardSize.Normal,
    piece: "alpha",
    square: "color-brown",
    orientation: 'white',
    coordinates: true,
}

export const boardReducer: Reducer<BoardState, BoardAction> = (state: BoardState = INITIAL_STATE, action: BoardAction): BoardState => {
    switch (action.type) {
        case FLIP_BOARD:
            const { orientation } = state;
            const bwOrientation = c.fromName(orientation!);

            return {
                ...state,
                orientation: c.toName(c.flip(bwOrientation))
            };

        case SET_COORDS:
            const { coordinates } = state;

            return {
                ...state,
                coordinates: !coordinates
            };

        case CHANGE_SIZE:
            return {
                ...state,
                size: action.size
            };

        case SET_PIECE:
            return {
                ...state,
                piece: action.piece
            };

        case SET_SQUARE:
            return {
                ...state,
                square: action.square
            };

        default:
            return state;
    }
}

export const createBoardStore = (preloadedState: BoardState) =>
    reduxCreateStore(boardReducer, preloadedState);

export type BoardStore = Store<BoardState, BoardAction>;