import React, {createContext, PropsWithChildren, useCallback, useState} from "react";
import clsx from "clsx";
import Container from "@mui/material/Container";
import * as cg from "chessground/types";
import * as Color from "../chess/Color";
import {BoardSize, BoardSizeClasses} from "onix-board-assets";


export type BoardProps = {
    is3d: boolean;
    size: BoardSize;
    piece: string;
    square: string;
    orientation: cg.Color;
    coordinates: boolean;
    learnMode: boolean;
    confirmMove: boolean;
    moveTable: boolean;
};

export type BoardContextProps = BoardProps & {
    set3d: (value: boolean) => void;
    setSize: (value: BoardSize) => void;
    setPiece: (value: string) => void;
    setSquare: (value: string) => void;
    flipBoard: () => void;
    toggleCoords: () => void;
    toggleLearn: () => void;
    toggleConfirm: () => void;
    toggleMoves: () => void;
}

const INITIAL_STATE: BoardProps = {
    is3d: false,
    size: BoardSize.Normal,
    piece: "alpha",
    square: "color-brown",
    orientation: 'white',
    coordinates: true,
    learnMode: false,
    confirmMove: false,
    moveTable: false,
};

export const BoardContext = createContext<BoardContextProps>({
    ...INITIAL_STATE,
    set3d: () => {},
    setSize: () => {},
    setPiece: () => {},
    setSquare: () => {},
    flipBoard: () => {},
    toggleCoords: () => {},
    toggleLearn: () => {},
    toggleConfirm: () => {},
    toggleMoves: () => {},
});

type Props = Partial<BoardProps>;

export const BoardProvider: React.FC<PropsWithChildren<Props>> = (propsIn) => {
    const props = { ...INITIAL_STATE, ...propsIn };
    const [is3d, setIs3d] = useState(props.is3d);
    const [size, setSizeState] = useState(props.size);
    const [piece, setPieceState] = useState(props.piece);
    const [square, setSquareState] = useState(props.square);
    const [orientation, setOrientation] = useState(props.orientation);
    const [coordinates, setCoordinates] = useState(props.coordinates);
    const [learnMode, setLearnMode] = useState(props.learnMode);
    const [confirmMove, setConfirmMove] = useState(props.confirmMove);
    const [moveTable, setMoveTable] = useState(props.moveTable);

    const set3d = useCallback((value: boolean) => {
        setIs3d(value);
    }, []);

    const setSize = useCallback((value: BoardSize) => {
        setSizeState(value);
    }, []);

    const setPiece = useCallback((value: string) => {
        setPieceState(value);
    }, []);

    const setSquare = useCallback((value: string) => {
        setSquareState(value);
    }, []);

    const flipBoard = useCallback(() => {
        setOrientation((o) => Color.toName(Color.flip(Color.fromName(o))));
    }, []);

    const toggleCoords = useCallback(() => {
        setCoordinates((c) => !c);
    }, []);

    const toggleLearn = useCallback(() => {
        setLearnMode((m) => !m);
    }, []);

    const toggleConfirm = useCallback(() => {
        setConfirmMove((m) => !m);
    }, []);

    const toggleMoves = useCallback(() => {
        setMoveTable((m) => !m);
    }, []);

    const containerClass = useCallback(() => {
        return [
            square,
            BoardSizeClasses[size],
            {
                "coords-no": !coordinates,
                "is2d": !is3d,
                "is3d": is3d
            }
        ];
    }, [coordinates, is3d, size, square]);

    return (
        <BoardContext.Provider
            value={{
                is3d,
                size,
                piece,
                square,
                orientation,
                coordinates,
                learnMode,
                confirmMove,
                moveTable,
                set3d,
                setSize,
                setPiece,
                setSquare,
                flipBoard,
                toggleCoords,
                toggleLearn,
                toggleConfirm,
                toggleMoves
        }}>
            <Container maxWidth={false} className={clsx(containerClass)}>
                {props.children}
            </Container>
        </BoardContext.Provider>
    );
}