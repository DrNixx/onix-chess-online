import React, {createContext, PropsWithChildren, useCallback, useEffect, useMemo, useState} from "react";
import * as cg from "chessground/types";
import {Chess as ChessEngine, GamePlayers} from "../chess/Chess";
import {IGameAnalysis, IGameData, IMovePart, ITreePart} from "../chess/types/Interfaces";
import {name as squareName} from "../chess/Square";
import {FenString} from "../chess/FenString";
import {toName as colorToName} from "../chess/Color";
import {Move} from "../chess/Move";
import {SimpleMove} from "../chess/SimpleMove";
import * as Colors from "../chess/types/Colors";
import {Square} from "../chess/types/Squares";
import * as GameResult from "../chess/GameResult";

export interface GameContextProps {
    gameId?: number | string;
    isStarted: boolean;

    startPly: number;
    currentPly: number;
    fen: string;
    pgn: string;
    lastMove?: cg.Key[];
    isCheck: cg.Color|boolean;
    turnColor: Colors.Name;

    captured: number[];
    gameResult: GameResult.Color;

    analysis: IGameAnalysis;

    navigateToPly: (ply: number) => void;
    navigateToKey: (key: string) => void;
    navigateToMove: (move: Move) => void;
    addMove: (move: IMovePart|ITreePart) => void;
    addProvisional: (sm: SimpleMove) => void;
    removeProvisional: () => void;
    makeProvisional: (fr?: Square, to?: Square) => void;
    loadFull: (game: IGameData) => void;
    loadPartial: (game: IGameData) => void;
    getPlayers: () => GamePlayers;
}

export const GameContext = createContext<GameContextProps>({
    isStarted: true,
    startPly: 1,
    currentPly: 0,
    fen: "",
    pgn: "",
    lastMove: undefined,
    isCheck: false,
    turnColor: 'white',
    captured: [],
    gameResult: GameResult.Color.None,
    analysis: {},
    navigateToPly: () => {},
    navigateToKey: () => {},
    navigateToMove: () => {},
    addMove: () => {},
    addProvisional: () => {},
    removeProvisional: () => {},
    makeProvisional: () => {},
    loadFull: () => {},
    loadPartial: () => {},
    getPlayers: () => {
        return {};
    },
});

type Props = {
    settings: IGameData;
};

export const GameProvider: React.FC<PropsWithChildren<Props>> = ({settings: baseSettings, children}) => {
    const [ settings, setSettings ] = useState(baseSettings)
    const engine = useMemo(() => new ChessEngine(settings), [settings]);
    
    const [ fen, setFen ] = useState("");
    const [ lastMove, setLastMove ] = useState<cg.Key[] | undefined>();
    const [ isCheck, setIsCheck ] = useState<cg.Color|boolean>(false);
    const [ turnColor, setTurnColor] = useState<Colors.Name>('white');
    const [ captured, setCaptured ] = useState<number[]>([]);
    const [ gameResult, setGameResult ] = useState<GameResult.Color>(GameResult.Color.None);

    const getLastMove = (move: Move) => {
        let lastMove: cg.Key[] | undefined = undefined;
        if (!move.isBegin()) {
            const { sm } = move;
            if (sm) {
                lastMove = [squareName(sm.from!) as cg.Key, squareName(sm.to!) as cg.Key];
            }
        }

        return lastMove;
    };

    const updateGameState = useCallback(() => {
        setLastMove(getLastMove(engine.CurrentMove));
        setFen(engine.CurrentMove.fen ?? FenString.fromPosition(engine.CurrentPos));
        setIsCheck(engine.CurrentPos.isKingInCheck() ? colorToName(engine.CurrentPos.WhoMove) : false);
        setTurnColor(colorToName(engine.ToMove));
        setCaptured(engine.CurrentPos.Captured);
        setGameResult(engine.Result);
    }, [engine]);

    useEffect(() => {
        updateGameState();
    }, [updateGameState]);

    const navigateToPly = useCallback((ply: number) => {
        engine.moveToPly(ply);
        updateGameState();
    }, [engine, updateGameState]);

    const navigateToKey = useCallback((key: string) => {
        engine.moveToKey(key);
        updateGameState();
    }, [engine, updateGameState]);

    const navigateToMove = useCallback((move: Move) => {
        engine.moveToPly(move.PlyCount);
        updateGameState();
    }, [engine, updateGameState]);

    const addMove = useCallback((move: IMovePart|ITreePart) => {
        engine.decodeMove(move);
        engine.moveLast();
        updateGameState();
    }, [engine, updateGameState]);

    const addProvisional = useCallback((sm: SimpleMove) => {
        engine.addProvisionalMove(sm);
        engine.moveLast();
        updateGameState();
    }, [engine, updateGameState]);

    const removeProvisional = useCallback(() => {
        engine.removeProvisoryMoves();
        engine.moveLast();
        updateGameState();
    }, [engine, updateGameState]);

    const makeProvisional = useCallback((fr?: Square, to?: Square) => {
        const sm = engine.makeMove(fr, to);
        if (sm) {
            addProvisional(sm);
        }
    }, [addProvisional, engine]);

    const loadPartial = useCallback((game: IGameData) => {
        const savedPly = engine.CurrentPlyCount;

        setSettings((s) => {
            return {
                ...s,
                ...game,
                display: savedPly
            }
        });
    }, [engine.CurrentPlyCount]);

    const loadFull = useCallback((game: IGameData) => {
        setSettings(game);
    }, []);

    const getPlayers = useCallback((): GamePlayers => {
        return engine.getPlayers();
    }, [engine]);

    /*
    const getLegalMovesMap = useCallback(() => {
        const mlist = engine.CurrentPos.generateMoves();

        const dests: cg.Dests = mlist.reduce((map, m) => {
            const from = squareName(m.from) as cg.Key;
            const to = squareName(m.to) as cg.Key;

            const toa: cg.Key[] = map.get(from) ?? [];
            toa.push(to);
            map.set(from, toa);

            return map;
        }, new Map());

        return dests;
    }, [engine.CurrentPos]);
    */

    return (
        <GameContext.Provider
            value={{
                gameId: engine.GameId,
                isStarted: engine.isStarted,
                startPly: engine.StartPlyCount,
                currentPly: engine.CurrentPlyCount,
                fen,
                pgn: engine.RawData.pgn ?? "",
                lastMove,
                isCheck,
                turnColor,
                captured,
                gameResult,
                analysis: engine.Analysis,
                getPlayers,
                navigateToPly,
                navigateToKey,
                navigateToMove,
                addMove,
                addProvisional,
                removeProvisional,
                makeProvisional,
                loadPartial,
                loadFull
        }}>
            {children}
        </GameContext.Provider>
    )
}
