import toSafeInteger from 'lodash/toSafeInteger';
import { nanoid } from 'nanoid';
//import isNumber from 'lodash/isNumber';
//import indexOf from 'lodash/indexOf';

import * as Colors from './types/Colors';
import * as Squares from './types/Squares';
import * as Color from './Color';
import * as GameResult from './GameResult';
import * as Piece from './Piece';
import * as Square from './Square';
import { Position, ChessPositionStd, SanCheckLevel, GenerateMode } from './Position';
import { Move } from './Move';
import { SimpleMove } from './SimpleMove';
import {
    IGameData,
    IMovePart,
    ITreePart,
    IChessPlayer,
    IChessOpening,
    IGameAnalysis,
    IGameStatus, IChessTournament, IChessGame, AnyClock, GameUrls
} from './types/Interfaces';
import { FenString } from './FenString';
import { plyToColor, plyToTurn, turnToPly } from './Common';
import { EvalItem } from './EvalItem';
import deepMerge from "../utils/deepMerge";
import {defaultGameData} from "./settings/GameSettings";

const defaultEco: IChessOpening = {
    code: "A00"
};

export enum ChessRatingType {
    none = 0,
    elo = 1,
    internal = 2,
    rapid = 3,
    iccf = 4
}

// const ChessRatingNames: string[] = ["Unknown", "Elo", "Rating", "Rapid", "ICCF"];

/*
function chessRatingParseType(value: string | number): ChessRatingType {
    return (isNumber(value)) ? value : toSafeInteger(value);
}

function chessRatingParseValue(value: string | number): number {
    return (isNumber(value)) ? value : toSafeInteger(value);
}

const stdTags: string[] = [
    "gameid",
    "gtype_id",
    "white",
    "white_id",
    "black",
    "black_id",
    "event",
    "event_id",
    "site",
    "site_id",
    "round",
    "game_date",
    "event_date",
    "result_id"
];

const addTags: string[] = [
    "whiteratingtype",
    "whiterating",
    "blackratingtype",
    "blackrating",
    "ecocode",
    "fen",
    "setup"
];

*/

export class ChessTags {
    private tags: Map<string, string> = new Map<string, string>();

    /**
     * constructor
     */
    constructor(/* private owner: Chess */) {
    }

    public clear() {
        this.tags.clear();
    }

    /*
    public add(name: string, value: any) {
        if (name) {
            name = name.toLowerCase();
            if (indexOf(stdTags, name) === -1) {
                if (indexOf(addTags, name) !== -1) {
                    switch (name) {
                        case "whiteratingtype":
                            this.owner.whiteRatingType = chessRatingParseType(value);
                            break;
                        case "whiterating":
                            this.owner.whiteElo = chessRatingParseValue(value);
                            break;
                        case "blackratingtype":
                            this.owner.blackRatingType = chessRatingParseType(value);
                            break;
                        case "blackrating":
                            this.owner.blackElo = chessRatingParseValue(value);
                            break;
                        case "ecocode":
                            this.owner.eco = {
                                code: value
                            }
                            break;
                        case "fen":
                            this.owner.startFen = value;
                            break;
                        case "setup":
                            break;
                    }
                } else {
                    this.tags.set(name, value);
                }
            }
        }
    }
    */
}

export class ChessGameState {
    public inCheckMate = false;
    public inStaleMate = false;
    public isNoMaterialWhite = false;
    public isNoMaterialBlack = false;
    public isPosRepeation = false;
    public is50MovesRule = false;
}

// type encodedMoves = [number, string, number, number, string, string];

export type GamePlayers = {
    white?: IChessPlayer;
    black?: IChessPlayer;
};

export class Chess {
    private readonly game: IChessGame;

    private readonly trn?: IChessTournament;

    public white?: IChessPlayer;

    public black?: IChessPlayer;

    /**
     * If game in play mode - Color of current player
     */
    public get player(): Colors.BW {
        return (this.game.player == "black") ? Color.Black : Color.White;
    }

    private readonly observer?: number;
    public get observerId() {
        return this.observer;
    }

    private readonly owner?: number;


    //private savedMove: Move | null = null;
    //private savedPos: Position | null = null;
    //private savedPlyCount = 0;
    //private pgnLastMovePos: number;
    //private pgnNextMovePos: number;
    //private varDepth = 0;
    private supressEvents = false;
    private moveList: Map<string, Move> = new Map<string, Move>();
    private curMove!: Move;
    private curPos!: Position;
    private readonly startPos: Position;
    private startFenValue: string = FenString.standartStart;

    public altered: boolean;

    public inPromotion = false;

    public savedMove: SimpleMove|null = null;

    public savedPlyCount: number = 0;

    public savedPos: Position|null = null;

    /// <summary>
    /// True if game has a promotion to R/B/N.
    /// </summary>
    public noQueenPromotion = false;
    public tags: ChessTags;

    public get gameId(): number | string | undefined {
        return this.game.id;
    }

    public get gameStatus(): IGameStatus | undefined {
        return this.game.status;
    }

    public getPlayers(): GamePlayers {
        return {
            white: this.white,
            black: this.black,
        };
    }

    public get tournament(): IChessTournament | undefined {
        return this.trn;
    }

    public get createdAt(): number | undefined {
        return this.game.createdAt;
    }

    public get eventName(): string {
        return this.trn?.name ?? this.game.event ?? '?';
    }

    public site?: string;

    public gameDate?: string;

    public eventDate?: string;

    public round?: string;

    public whiteElo?: number;

    public whiteRatingType?: ChessRatingType;

    public blackElo?: number;

    public blackRatingType?: ChessRatingType;

    public get eco(): IChessOpening {
        return this.game.opening ?? defaultEco;
    }

    public get result(): GameResult.Color {
        return this.gameStatus?.result ?? GameResult.Color.None
    }

    public readonly urls?: GameUrls;

    public get isExternal(): boolean {
        return !this.game.insite;
    }

    public get isRated(): boolean {
        return !!this.game.rated;
    }

    public get isCorrespondence(): boolean {
        return this.game.speed == "correspondence";
    }

    public get isAdvance(): boolean {
        return !!this.game.advance;
    }

    public get speed() {
        return this.game.speed
    }

    private readonly _timer: AnyClock | undefined;
    get timer(): AnyClock | undefined {
        return this._timer;
    }


    public get toMove() {
        return this.currentPos.WhoMove;
    }

    public get currentPlyCount() {
        return this.currentMove.PlyCount;
    }

    public get startPlyCount() {
        return (this.startPos) ? this.startPos.PlyCount + 1 : 1;
    }

    public get currentMove(): Move {
        return this.curMove;
    }

    public get currentPos(): Position {
        return this.curPos;
    }

    public get startFen() {
        return this.startFenValue;
    }

    public set startFen(value: string) {
        this.startFenValue = value;
    }

    public get nonStandardStart(): boolean {
        return this.startFenValue !== FenString.standartStart;
    }

    public fen: string = FenString.standartStart;

    private readonly _pgn: string;
    get pgn(): string {
        return this._pgn;
    }

    public analysis: IGameAnalysis = {};

    public readonly hasMovetimes: boolean;

    public pgnLastMovePos: number;
    public pgnNextMovePos: number;

    /**
     * @constructor
     */
    constructor(data?: IGameData) {
        this.tags = new ChessTags();
        this.altered = false;
        this.pgnLastMovePos = this.pgnNextMovePos = 0;
        this.startPos = ChessPositionStd;

        this.clear();

        const raw = deepMerge.withOptions({extendMode: true}, data ?? {}, defaultGameData) as IGameData;
        this.game = raw.game;
        this.trn = raw.tournament;

        this.observer = raw.observer;
        this.owner = raw.owner;
        this.assignPlayer(raw.player);
        this.assignPlayer(raw.opponent);

        this._timer = raw.correspondence ? raw.correspondence : raw.clock;



        if (this.game.initialFen) {
            if (this.game.initialFen != FenString.standartStart) {
                this.startFenValue = this.game.initialFen;
                this.startPos = new Position(this.startFenValue);
            }
        }

        this._pgn = raw.pgn ?? '';

        this.hasMovetimes = !!raw.game.moveCentis;
        this.urls = raw.url;

        this.init(raw);
        this.positionChanged();
    }

    private clear() {
        // CommentsFlag = NagsFlag = VarsFlag = 0;
        this.inPromotion = false;
        this.noQueenPromotion = false;

        this.analysis = {};

        this.clearStandardTags();
        this.clearExtraTags();
        this.clearMoves();
    }

    /// <summary>
    /// Clears all the standard tags.
    /// </summary>
    private clearStandardTags () {
        this.white = {
            color: "white",
            name: "?",
            user: {
                id: 0,
                name: "?"
            }
        };

        this.black = {
            color: "black",
            name: "?",
            user: {
                id: 0,
                name: "?"
            }
        };

        this.site = "?";
        this.round = "?";
        this.gameDate = "????.??.??";
        this.eventDate = "????.??.??";
        this.whiteElo = this.blackElo = 0;
        this.whiteRatingType = this.blackRatingType = ChessRatingType.elo;
    }

    /// <summary>
    /// clear any nonstandard tags.
    /// </summary>
    private clearExtraTags () {
        this.tags.clear();
    }

    /// <summary>
    /// clear all moves.
    /// </summary>
    private clearMoves () {
        this.moveList.clear();
        this.inPromotion = false;
        this.noQueenPromotion = false;

        this.savedMove = null;
        this.savedPlyCount = 0;
        this.savedPos = null;

        this.curMove = Move.init(this.startFenValue, this.startPos);
        this.moveList.set(this.curMove.Prev.moveKey, this.curMove.Prev);

        // Set up start
        this.curPos = new Position();
        this.curPos.copyFrom(this.startPos);
    }

    public init(data: IGameData) {
        const {
            analysis,
            steps,
            treeParts
        } = data;

        if (analysis) {
            this.analysis.state = analysis.state ?? "empty";
            if ((this.analysis.state == "inprogress") && (analysis.completed)) {
                this.analysis.completed = analysis.completed;
            }

            if (analysis.white) {
                this.analysis.white = {
                    blunder: toSafeInteger(analysis.white.blunder),
                    mistake: toSafeInteger(analysis.white.mistake),
                    inaccuracy: toSafeInteger(analysis.white.inaccuracy),
                    acpl: toSafeInteger(analysis.white.acpl)
                }
            }

            if (analysis.black) {
                this.analysis.black = {
                    blunder: toSafeInteger(analysis.black.blunder),
                    mistake: toSafeInteger(analysis.black.mistake),
                    inaccuracy: toSafeInteger(analysis.black.inaccuracy),
                    acpl: toSafeInteger(analysis.black.acpl)
                }
            }
        }

        const moves = treeParts ?? steps;
        if (moves) {
            this.supressEvents = true;
            this.decodeMoves(moves);
            if (treeParts) {
                let move = this.currentMove.Begin;
                while (!move.END_MARKER) {
                    if (!move.START_MARKER && move.sm?.eval && move.Prev.sm?.eval) {
                        move.sm.eval.normalize(move.Prev.sm!.eval!)
                    }

                    move = move.Next;
                }

                move = this.currentMove.Begin;
                while (!move.END_MARKER) {
                    if (!move.isLast() && move.sm?.eval && move.Next.sm?.eval) {
                        move.sm!.eval!.extend(move.Next.sm!.eval!)
                    }

                    move = move.Next;
                }
            }

            if (this.game.moveCentis) {
                const times = (<number[]>[]).concat(this.game.moveCentis);
                let move = this.currentMove.First;
                while (!move.END_MARKER && times.length) {
                    const time = times.shift();
                    if (move.sm) {
                        move.sm.time = toSafeInteger(time);
                    }

                    move = move.Next;
                }
            }

            this.supressEvents = false;
        }
    }

    private assignPlayer(player?: IChessPlayer) {
        if (player?.user) {
            if (!player.user.id || player.user.id == '?') {
                player.user.id = nanoid(6);
            }

            if (player.color === "black") {
                this.black = player;
            } else {
                this.white = player;
            }
        }
    }

    private isInstanceOfTreePart(object: IMovePart|ITreePart): object is ITreePart {
        return 'eval' in object;
    }

    public decodeMove(mv: IMovePart|ITreePart) {
        if (mv.uci === undefined) {
            if (this.isInstanceOfTreePart(mv)) {
                const move = this.currentMove.Begin;
                if (move && move.sm) {
                    move.sm.eval = new EvalItem(mv.eval);
                    move.sm.judgments = mv.comments;
                    move.sm.glyphs = mv.glyphs;
                }
            }
            return;
        }

        const sm = this.curPos.readCoordMove(mv.uci);
        if (sm !== null) {
            sm.ply = this.currentPos.PlyCount + 1;
            sm.permanent = true;
            sm.san = mv.san;
            sm.color = this.currentPos.WhoMove;
            if (this.isInstanceOfTreePart(mv)) {
                sm.eval = new EvalItem(mv.eval);
                sm.judgments = mv.comments;
                sm.glyphs = mv.glyphs;
            }

            const move = this.addMove(sm, sm.san, mv.fen);
            move.id = mv.id || nanoid(8);
            this.moveList.set(move.moveKey, move);
        }
    }

    private decodeMoves(moves: IMovePart[]|ITreePart[]) {
        for (let i = 0; i < moves.length; i++) {
            const mv = moves[i];

            this.decodeMove(mv);
        }
    }

    private positionChanged() {
        if (!this.supressEvents) {
            if (!this.curMove.fen) {
                this.curMove.fen = FenString.fromPosition(this.curPos);
            }

            this.fen = this.curMove.fen;
        }
    }

    public checkGameState(): ChessGameState {
        const state = new ChessGameState();

        const mlist = this.curPos.generateMoves(Piece.None, GenerateMode.All, true);

        if (mlist.length === 0) {
            if (this.curPos.isKingInCheck()) {
                state.inCheckMate = true;
            } else {
                state.inStaleMate = true;
            }
        }

        if ((!this.curPos.hasPiece(Piece.WPawn)) &&
            (!this.curPos.hasPiece(Piece.WQueen)) &&
            (!this.curPos.hasPiece(Piece.WRook))) {
            if ((!this.curPos.hasPiece(Piece.WKnight)) && (!this.curPos.hasPiece(Piece.WBishop))) {
                // King only
                state.isNoMaterialWhite = true;
            } else if ((!this.curPos.hasPiece(Piece.WKnight)) && (this.curPos.getPieceCount(Piece.WBishop) === 1)) {
                // King and bishop
                state.isNoMaterialWhite = true;
            } else if ((this.curPos.getPieceCount(Piece.WKnight) === 1) && (!this.curPos.hasPiece(Piece.WBishop))) {
                // King and knight
                state.isNoMaterialWhite = true;
            }
        }

        if ((!this.curPos.hasPiece(Piece.BPawn)) &&
            (!this.curPos.hasPiece(Piece.BQueen)) &&
            (!this.curPos.hasPiece(Piece.BRook))) {
            if ((!this.curPos.hasPiece(Piece.BKnight)) && (!this.curPos.hasPiece(Piece.BBishop))) {
                // King only
                state.isNoMaterialBlack = true;
            } else if ((!this.curPos.hasPiece(Piece.BKnight)) && (this.curPos.getPieceCount(Piece.BBishop) === 1)) {
                // King and bishop
                state.isNoMaterialBlack = true;
            } else if ((this.curPos.getPieceCount(Piece.BKnight) === 1) && (!this.curPos.hasPiece(Piece.BBishop))) {
                // King and knight
                state.isNoMaterialBlack = true;
            }
        }

        let move = this.curMove.Prev;
        const thisFen = move.fen;
        let rc = 0;
        while (!move.START_MARKER) {
            if (thisFen === move.fen) {
                rc++;
            }

            move = move.Prev;
        }

        state.isPosRepeation = rc >= 3;
        state.is50MovesRule = this.curPos.HalfMoveCount > 100;

        return state;
    }

    public makeMove(fr?: Squares.Square, to?: Squares.Square, promote?: string): SimpleMove | undefined {
        if (!fr || !to) {
            return undefined;
        }

        const { curPos: currentPos } = this;
        const sm = new SimpleMove();
        sm.pieceNum = currentPos.getPieceNum(fr);
        sm.movingPiece = currentPos.getPiece(fr);
        if (!Piece.isPiece(sm.movingPiece)) {
            return undefined;
        }

        sm.ply = this.currentPos.PlyCount + 1;
        sm.color = Piece.color(sm.movingPiece);
        sm.from = fr;
        sm.to = to;
        sm.capturedPiece = currentPos.getPiece(to);
        sm.capturedSquare = to;
        sm.castleFlags = currentPos.Castling.Flag;
        sm.epSquare = currentPos.EpTarget;
        sm.promote = Piece.None;

        const piece = sm.movingPiece;
        const ptype = Piece.type(piece);
        const enemy = Color.flip(currentPos.WhoMove);

        // handle promotion:
        const promoteRank = (currentPos.WhoMove === Color.White ? 7 : 0);
        if ((ptype == Piece.Pawn) && (Square.rank(to) == promoteRank)) {
            if (!promote) {
                this.inPromotion = true;
                return sm;
            } else {
                sm.promote = Piece.typeFromChar(promote);
            }
        }

        // Handle en passant capture:
        if (ptype == Piece.Pawn && (sm.capturedPiece == Piece.None) && (Square.fyle(fr) != Square.fyle(to))) {
            const enemyPawn = Piece.create(enemy, Piece.Pawn);
            sm.capturedSquare = (this.curPos.WhoMove === Color.White ? (to - 8) as Squares.Square : (to + 8) as Squares.Square);
            sm.capturedPiece = enemyPawn;
        }

        return sm;
    }

    /**
     * Add a move at current position and do it. The parameter 'san' can be NULL. If it is provided, it is stored with the move to speed up PGN printing.
     * @param sm SimpleMove
     * @param san String
     * @param fen
     */
    public addMove(sm: SimpleMove, san?: string, fen?: string) {
        const { curPos: currentPos } = this;

        // We must be at the end of a game/variation to add a move:
        if (!this.curMove.END_MARKER) {
            // truncate the game!
            this.curMove.truncate();
        }

        if (!sm.san) {
            if (!san) {
                sm.san = this.curPos.makeSanString(sm, SanCheckLevel.MateTest);
            } else {
                sm.san = san;
            }
        }

        const newMove = this.curMove.append(sm);

        this.curPos.doSimpleMove(sm);
        if (!fen) {
            fen = FenString.fromPosition(currentPos);
        }
        newMove.fen = fen;
        this.curMove.fen = fen;

        this.positionChanged();

        return newMove;
    }

    /**
     * Add temporary move. @see addMove
     *
     * @inheritdoc
     */
    public addProvisionalMove(sm: SimpleMove, san?: string, fen?: string) {
        this.moveEnd();
        const newMove = this.addMove(sm, san, fen);
        newMove.provisional = true;
        return newMove;
    }

    public removeProvisoryMoves() {
        this.moveLast();
        while (this.curMove.provisional) {
            const move = this.curMove;
            this.moveBackward();
            move.remove();
        }
    }

    public moveToKey(key: string) {
        const targetMove = this.moveList.get(key);
        if (targetMove) {
            if (!targetMove.inVariation()) {
                this.moveToPly(targetMove.PlyCount);
            } else {
                // TODO: Move in variation
                this.supressEvents = true;

                this.curMove = targetMove;
                if (!this.curMove.isBegin()) {
                    this.curPos = new Position(this.curMove.Prev.fen);
                } else {
                    this.curPos.copyFrom(this.startPos);
                }

                this.supressEvents = false;
                this.positionChanged();
            }
        }
    }

    /**
     * Move to begin game
     */
    public moveBegin() {
        this.curMove = this.currentMove.Begin;
        this.curPos.copyFrom(this.startPos);
        // this.currentPos = new Position(this.currentMove.fen);
    }

    /**
     * Move to first move
     */
    public moveFirst() {
        this.moveBegin();
        return this.moveForward();
    }

    /**
     * Move to last move
     */
    public moveLast() {
        this.moveEnd();
        return this.moveBackward();
    }

    /**
     * Move to end position
     */
    public moveEnd() {
        this.moveToPly(9999);
    }

    /**
     * Переместить текущую позицию на 1 вперед
     * @returns Boolean
     */
    public moveForward() {
        if (this.curMove.END_MARKER) {
            return false;
        }

        this.curMove = this.curMove.Next!;
        if (!this.curMove.END_MARKER) {
            this.curPos.doSimpleMove(this.curMove.sm!);
        }

        this.positionChanged();

        return true;
    }

    /**
     * Move to 1 turn back
     * @returns Boolean
     */
    public moveBackward() {
        if (this.curMove.START_MARKER) {
            return false;
        }

        if (this.curMove.Prev.START_MARKER) {
            if (this.curMove.inVariation()) {
                this.curPos.undoSimpleMove(this.curMove.sm!);
                this.curMove = this.curMove.exitVariation();
                this.positionChanged();
                return true;
            }

            this.curPos.copyFrom(this.startPos);
        } else if (!this.curMove.END_MARKER) {
            this.curPos.undoSimpleMove(this.curMove.sm!);
        }

        this.curMove = this.curMove.Prev;

        this.positionChanged();

        return true;
    }

    /**
     * Переместиться на указанную позицию в главной линии партии
     * @param hmNumber
     */
    public moveToPly(hmNumber: number) {
        this.supressEvents = true;
        if (hmNumber > this.currentPlyCount) {
            while (!this.currentMove.END_MARKER && (hmNumber > this.currentPlyCount)) {
                if (!this.moveForward()) {
                    break;
                }
            }

            this.supressEvents = false;
            this.positionChanged();
        } else if (hmNumber < this.currentPlyCount) {
            while (!this.currentMove.START_MARKER && (hmNumber < this.currentPlyCount)) {
                if (!this.moveBackward()) {
                    break;
                }
            }

            this.supressEvents = false;
            this.positionChanged();
        }

        this.supressEvents = false;
    }

    public findNextMistake(color: Colors.BW, ply: number, type: "blunder" | "mistake" | "inaccuracy"): number | undefined {
        if (!this.curMove.inVariation()) {
            const judgments = Array.from(this.moveList.values()).filter((value) => {
                const sm = value.sm;
                return ((sm.color === color) && (sm.judgments) && (sm.judgments.length) && (type === sm.judgments[0].name.toLowerCase()));
            });

            if (judgments.length > 0) {
                const right = judgments.filter((value) => {
                    return value.sm.ply > ply
                });
                if (right.length > 0) {
                    return right[0].PlyCount;
                }

                const left = judgments.filter((value) => {
                    return value.sm.ply < ply
                });

                if (left.length > 0) {
                    return left[0].PlyCount;
                }
            }
        }

        return undefined;
    }

    public get isMyMove() {
        const cm = this.curMove;
        return (cm.END_MARKER || (cm.Next && cm.Next.END_MARKER)) && (this.currentPos.WhoMove === this.myColor);
    }

    public get myColor() {
        if (this.isMyGame) {
            return (this.white?.user?.id == this.observer) ? Color.White : Color.Black;
        }

        return Color.None;
    }

    public get isMyGame() {
        if (this.observer) {
            return (this.white?.user?.id == this.observer) || (this.black?.user?.id == this.observer);
        }

        return false;
    }

    public get isStarted() {
        return (this.gameStatus?.name == "started");
    }

    public get isFinished() {
        return (this.result != GameResult.Color.None);
    }

    public get isNewGame() {
        return (!this.white?.user?.id) || (!this.black?.user?.id) && (this.gameStatus?.name == "new");
    }

    public get isChallenge() {
        return (this.gameStatus?.name == "wait");
    }

    public get isChallengeFromMe() {
        return (this.gameStatus?.name == "wait") && (!!this.observer) && (this.observer == this.owner);
    }

    public get isChallengeToMe() {
        return (this.gameStatus?.name == "wait") && (!!this.observer) && (this.observer != this.owner);
    }

    public static plyToTurn(ply: number) {
        return plyToTurn(ply);
    }

    public static plyToColor(ply: number) {
        return plyToColor(ply);
    }

    public static turnToPly(turn: number, color?: Colors.BW) {
        return turnToPly(turn, color);
    }
}