import React, {createContext, PropsWithChildren, useCallback, useEffect, useMemo, useState} from "react";
import * as cg from "chessground/types";
import {Chess as ChessEngine, GamePlayers} from "../chess/Chess";
import {
    AnyClock, GameUrls,
    IChessOpening, IChessTournament,
    IGameAnalysis,
    IGameData,
    IGameStatus,
    IMovePart,
    ITreePart, MistakeLevel
} from "../chess/types/Interfaces";
import {name as squareName} from "../chess/Square";
import {FenString} from "../chess/FenString";
import {toName as colorToName, None as ColorNone} from "../chess/Color";
import {Move} from "../chess/Move";
import {Position, ChessPositionStd} from "../chess/Position";
import {SimpleMove} from "../chess/SimpleMove";
import * as Colors from "../chess/types/Colors";
import {Square} from "../chess/types/Squares";
import * as GameResult from "../chess/GameResult";
import {useApi} from "../hooks/useApi";
import {applyDefaults} from "../utils/propsUtils";
import {defaultGameData} from "../chess/settings/GameSettings";
import {GameMode} from "../chess/settings/GameProps";
import * as Squares from "../chess/types/Squares";
import {BW} from "../chess/types/Colors";

export interface GameContextProps {
    gameId?: number | string;
    isStarted: boolean;
    isFinished: boolean;
    isNewGame: boolean;
    isChallengeFromMe: boolean;
    isChallengeToMe: boolean;

    startPly: number;
    currentPly: number;
    fen: string;
    pgn: string;
    opening?: IChessOpening;
    focusMove?: string;
    lastMove?: cg.Key[];
    isCheck: cg.Color|boolean;
    inPromotion: boolean;
    turnColor: Colors.Name;
    timer?: AnyClock;

    captured: number[];
    gameResult: GameResult.Color;

    analysis: IGameAnalysis;

    showComments: boolean;

    eventName?: string;
    isExternal?: boolean;
    urls?: GameUrls;

    isMyGame?: boolean;
    isMyMove?: boolean;
    myColor?: Colors.BW;

    isRated?: boolean;
    isCorrespondence?: boolean;
    isAdvance?: boolean;
    hasMovetimes?: boolean;
    createdAt?: number;

    canNavBackward: boolean;
    canNavForward: boolean;
    navigateFirst: () => void;
    navigateBackward: () => void;
    navigateForward: () => void;
    navigateLast: () => void;
    navigateToPly: (ply?: number) => void;
    navigateToKey: (key: string) => void;
    navigateToMove: (move: Move) => void;
    navigateToNextMistake: (color: BW, type: MistakeLevel) => void;
    toggleComments: () => void;
    isLegalMove: (sm?: SimpleMove) => boolean;
    makeMove: (fr?: Squares.Square, to?: Squares.Square, promote?: string) => SimpleMove | undefined;
    addMove: (move: IMovePart|ITreePart) => void;
    addProvisional: (sm: SimpleMove) => void;
    removeProvisional: () => void;
    makeProvisional: (fr?: Square, to?: Square) => void;
    loadFull: (game: IGameData) => void;
    loadPartial: (game: IGameData) => void;
    getCurrentMove: () => Move;
    getCurrentPosition: () => Position;
    getGameStatus: () => IGameStatus|undefined;
    getTournamentInfo: () => IChessTournament|undefined;
    getLegalMovesMap: () => cg.Dests;
    getOpening: () => IChessOpening|undefined;
    getPlayers: () => GamePlayers;
}

export const GameContext = createContext<GameContextProps>({
    isStarted: true,
    isFinished: false,
    isNewGame: false,
    isChallengeFromMe: false,
    isChallengeToMe: false,

    startPly: 1,
    currentPly: 0,
    fen: "",
    pgn: "",
    opening: undefined,
    lastMove: undefined,
    isCheck: false,
    inPromotion: false,
    turnColor: 'white',
    timer: undefined,
    captured: [],
    gameResult: GameResult.Color.None,
    analysis: {},

    showComments: false,

    isMyGame: false,
    isMyMove: false,
    myColor: ColorNone,

    canNavBackward: false,
    canNavForward: false,
    navigateFirst: () => false,
    navigateBackward: () => false,
    navigateForward: () => false,
    navigateLast: () => false,
    navigateToPly: () => {},
    navigateToKey: () => {},
    navigateToMove: () => {},
    navigateToNextMistake: () => {},

    toggleComments: () => {},
    isLegalMove: () => false,
    makeMove: () => undefined,
    addMove: () => {},
    addProvisional: () => {},
    removeProvisional: () => {},
    makeProvisional: () => {},
    loadFull: () => {},
    loadPartial: () => {},

    getCurrentMove: () => {
        return new Move();
    },

    getCurrentPosition: () => {
        return ChessPositionStd;
    },

    getGameStatus: () => {
        return undefined;
    },

    getTournamentInfo: () => {
        return undefined;
    },

    getLegalMovesMap: () => {
        return new Map();
    },
    getOpening: () => undefined,
    getPlayers: () => {
        return {};
    },
});

type Props = {
    mode?: GameMode;
    settings?: IGameData;
    showComments?: boolean;
};

export const GameProvider: React.FC<PropsWithChildren<Props>> = ({children, ...props}) => {
    const mode = useMemo(() => props.mode ?? 'watch', [props.mode]);
    const [settings, setSettings] = useState<IGameData>(applyDefaults(props.settings ?? defaultGameData, defaultGameData));
    const [focusMove, setFocusMove] = useState<string>();
    const engine = useMemo(() => {
        const e = new ChessEngine(settings);
        e.moveLast();
        setFocusMove(e.currentMove.uid);
        return e;
    }, [settings]);

    const [currentFen, setCurrentFen] = useState(FenString.standartStart);
    const [ showComments, setShowComments ] = useState(!!props.showComments);

    const {apiGet} = useApi();

    const getLastMove = useCallback(() => {
        let lastMove: cg.Key[] | undefined = undefined;
        if (!engine.currentMove.isBegin()) {
            const { sm } = engine.currentMove;
            if (sm?.from && sm?.to) {
                lastMove = [squareName(sm.from) as cg.Key, squareName(sm.to) as cg.Key];
            }
        }

        return lastMove;
    }, [engine.currentMove]);
    
    const getIsCheck = useCallback(() => {
        return engine.currentPos.isKingInCheck() ? colorToName(engine.currentPos.WhoMove) : false;
    }, [engine.currentPos]);

    const getTurnColor = useCallback(() => {
        return colorToName(engine.toMove);
    }, [engine.toMove]);

    const getCaptured = useCallback(() => {
        return engine.currentPos.Captured;
    }, [engine.currentPos.Captured]);

    const getGameResult = useCallback(() => {
        return engine.result;
    }, [engine.result]);

    const updateGameState = useCallback(() => {
        setCurrentFen(engine.fen);
    }, [engine.fen]);
    
    const updateGameFocus = useCallback(() => {
        updateGameState();
        setFocusMove(engine.currentMove.uid);
    }, [engine.currentMove.uid, updateGameState]);

    useEffect(() => {
        setCurrentFen(engine.fen);
    }, [engine]);

    const navigateToPly = useCallback((ply?: number) => {
        if (ply) {
            engine.moveToPly(ply);
            updateGameFocus();
        }
    }, [engine, updateGameFocus]);

    const navigateToKey = useCallback((key: string) => {
        engine.moveToKey(key);
        updateGameFocus();
    }, [engine, updateGameFocus]);

    const navigateToMove = useCallback((move: Move) => {
        engine.moveToPly(move.PlyCount);
        updateGameFocus();
    }, [engine, updateGameFocus]);

    const navigateToNextMistake = useCallback((color: BW, type: MistakeLevel) => {
        navigateToPly(engine.findNextMistake(color, engine.currentPlyCount, type));
    }, [engine, navigateToPly]);

    const makeMove = useCallback((fr?: Squares.Square, to?: Squares.Square, promote?: string) => {
        return engine.makeMove(fr, to, promote);
    }, [engine]);
    
    const addMove = useCallback((move: IMovePart|ITreePart) => {
        engine.decodeMove(move);
        engine.moveLast();
        updateGameFocus();
    }, [engine, updateGameFocus]);

    const addProvisional = useCallback((sm: SimpleMove) => {
        engine.addProvisionalMove(sm);
        engine.moveLast();
        updateGameFocus();
    }, [engine, updateGameFocus]);

    const removeProvisional = useCallback(() => {
        engine.removeProvisoryMoves();
        engine.moveLast();
        updateGameFocus();
    }, [engine, updateGameFocus]);

    const makeProvisional = useCallback((fr?: Square, to?: Square) => {
        const sm = engine.makeMove(fr, to);
        if (sm) {
            addProvisional(sm);
        }
    }, [addProvisional, engine]);

    const loadPartial = useCallback((game: IGameData) => {
        const savedPly = engine.currentPlyCount;

        setSettings((s) => {
            return {
                ...s,
                ...game,
                display: savedPly
            }
        });
    }, [engine.currentPlyCount]);

    const loadFull = useCallback((game: IGameData) => {
        setSettings(game);
    }, []);

    useEffect(() => {
        if (settings.game?.load && settings.game?.id) {

            apiGet<IGameData>(`/api/game/${mode}/${settings.game.id}`, {})
                .then((data) => {
                    if (data.model) {
                        setSettings(data.model);
                    }

                })
                .catch();
        }
    }, [apiGet, mode, settings.game?.id, settings.game?.load, updateGameState]);

    const getPlayers = useCallback((): GamePlayers => {
        return engine.getPlayers();
    }, [engine]);

    const toggleComments = useCallback(() => {
        setShowComments((prevState) => !prevState);
    }, []);

    const isLegalMove = useCallback((sm?: SimpleMove) => {
        return engine.currentPos.isLegalMove(sm);
    }, [engine.currentPos]);
    
    const getLegalMovesMap = useCallback(() => {
        const mlist = engine.currentPos.generateMoves();

        const dests: cg.Dests = mlist.reduce((map, m) => {
            const from = squareName(m.from) as cg.Key;
            const to = squareName(m.to) as cg.Key;

            const toa: cg.Key[] = map.get(from) ?? [];
            toa.push(to);
            map.set(from, toa);

            return map;
        }, new Map());

        return dests;
    }, [engine.currentPos]);

    const getOpening = useCallback(() => {
        return engine.eco;
    }, [engine.eco]);

    const getCurrentMove = useCallback(() => {
        return engine.currentMove;
    }, [engine.currentMove]);

    const getCurrentPosition = useCallback(() => {
        return engine.currentPos;
    }, [engine.currentPos]);
    
    const getGameStatus = useCallback(() => {
        return engine.gameStatus;
    }, [engine.gameStatus]);

    const getTournamentInfo = useCallback(() => {
        return engine.tournament;
    }, [engine.tournament]);

    const navigateFirst = useCallback(() => {
        if (engine.moveFirst()) updateGameFocus();
    }, [engine, updateGameFocus]);

    const navigateBackward = useCallback(() => {
        if (engine.moveBackward()) updateGameFocus();
    }, [engine, updateGameFocus]);

    const navigateForward = useCallback(() => {
        if (engine.moveForward()) updateGameFocus();
    }, [engine, updateGameFocus]);

    const navigateLast = useCallback(() => {
        if (engine.moveLast()) updateGameFocus();
    }, [engine, updateGameFocus]);

    return (
        <GameContext.Provider
            value={{
                gameId: engine.gameId,
                isStarted: engine.isStarted,
                isFinished: engine.isFinished,
                isNewGame: engine.isNewGame,
                isChallengeFromMe: engine.isChallengeFromMe,
                isChallengeToMe: engine.isChallengeToMe,
                startPly: engine.startPlyCount,
                currentPly: engine.currentPlyCount,
                fen: currentFen,
                pgn: engine.pgn,
                opening: engine.eco,
                focusMove: focusMove,
                lastMove: getLastMove(),
                isCheck: getIsCheck(),
                inPromotion: engine.inPromotion,
                turnColor: getTurnColor(),
                timer: engine.timer,
                captured: getCaptured(),
                gameResult: getGameResult(),
                analysis: engine.analysis,

                showComments,
                toggleComments,

                getPlayers,
                eventName: engine.eventName,

                urls: engine.urls,
                isExternal: engine.isExternal,
                isRated: engine.isRated,
                isCorrespondence: engine.isCorrespondence,
                isAdvance: engine.isAdvance,
                hasMovetimes: engine.hasMovetimes,

                isMyGame: engine.isMyGame,
                isMyMove: engine.isMyMove,
                myColor: engine.myColor,

                createdAt: engine.createdAt,

                canNavBackward: !engine.currentMove.isBegin(),
                canNavForward: !engine.currentMove.isLast(),

                navigateFirst,
                navigateBackward,
                navigateForward,
                navigateLast,
                navigateToPly,
                navigateToKey,
                navigateToMove,
                navigateToNextMistake,
                isLegalMove,
                makeMove,
                addMove,
                addProvisional,
                removeProvisional,
                makeProvisional,
                loadPartial,
                loadFull,

                getCurrentMove,
                getCurrentPosition,

                getGameStatus,
                getTournamentInfo,
                getLegalMovesMap,
                getOpening,
        }}>
            {children}
        </GameContext.Provider>
    )
}
