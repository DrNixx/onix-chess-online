import * as Colors from './types/Colors';
import * as Pieces from './types/Pieces';
import * as Color from './Color';

const noPiece = undefined;

const PIECE_IS_SLIDER: boolean[] = [false, false, true, true, true, false, false, false];
const PIECE_CHARS: string[] = ["x", "K", "Q", "R", "B", "N", "P", ".", "x", "k", "q", "r", "b", "n", "p", "x"];
const PIECE_NAMES: string[] = ["xx", "wk", "wq", "wr", "wb", "wn", "wp", "xx", "xx", "bk", "bq", "br", "bb", "bn", "bp"];

// Piece types (without color): ============
export const King: Pieces.King = 0x01;
export const Queen: Pieces.Queen = 0x02;
export const Rook: Pieces.Rook = 0x03;
export const Bishop: Pieces.Bishop = 0x04;
export const Knight: Pieces.Knight = 0x05;
export const Pawn: Pieces.Pawn = 0x06;
export const None: Pieces.Empty = undefined;

// White pieces: ============
export const WKing: Pieces.WKing = 0x01;
export const WQueen: Pieces.WQueen = 0x02;
export const WRook: Pieces.WRook = 0x03;
export const WBishop: Pieces.WBishop = 0x04;
export const WKnight: Pieces.WKnight = 0x05;
export const WPawn: Pieces.WPawn = 0x06;

// Black pieces: ============
export const BKing: Pieces.BKing = 0x09;
export const BQueen: Pieces.BQueen = 0x0A;
export const BRook: Pieces.BRook = 0x0B;
export const BBishop: Pieces.BBishop = 0x0C;
export const BKnight: Pieces.BKnight = 0x0D;
export const BPawn: Pieces.BPawn = 0x0E;

export const Score = [NaN, 9999, 10, 6, 3, 3, 1];

export function notEmpty(p?: Pieces.Piece): Pieces.Piece {
    return p!;
}

export function isPiece(p?: number): p is Pieces.Piece {
    return (p !== noPiece) && ((p >= WKing && p <= WPawn) || ( p>= BKing && p <= BPawn));
}

export function isPieceType(p?: number): p is Pieces.PieceType {
    return (p !== noPiece) && (p >= King && p <= Pawn);
}

/**
 * Return piece type.
 */
export function type(p: Pieces.Piece): Pieces.PieceType {
    return (p & 0x07) as Pieces.PieceType;
}

/**
 * Return piece color.
 * If piece is invalid or empty return [[Color.NoColor]].
 */
export function color(p: Pieces.Piece): Colors.BW {
    return ((p & 0x08) >> 3) as Colors.BW;
}

/**
 * Return piece color for valid piece
 */
export function colorOrEmpty(p?: Pieces.Piece): Colors.BW | Colors.None {
    return (p === None) ? Color.None : ((p & 0x08) >> 3) as Colors.BW;
}

/**
 * Make colored piece.
 * @param c piece color
 * @param p piece type
 */
export function create(c: Colors.BW, p: Pieces.PieceType): Pieces.Piece {
    return ((c << 3) | (p & 0x07)) as Pieces.Piece;
}

/**
 * Return true, if piece can slide moves.
 */
export function isSlider(p: Pieces.Piece): boolean {
    return PIECE_IS_SLIDER[type(p)];
}

/**
 * Return piece type from piece char.
 */
export function typeFromChar(pc: string): Pieces.PieceType | Pieces.Empty {
    switch (pc) {
        case "k": return King;
        case "q": return Queen;
        case "r": return Rook;
        case "n": return Knight;
        case "b": return Bishop;
        case "p": return Pawn;
        default: return None;
    }
}

/**
 * Return piece char.
 * White pieces will be returns uppercased, black lowercased.
 */
export function toChar(p: Pieces.Piece): string {
    return PIECE_CHARS[p];
}

/**
 * Return uppercased piece char.
 */
export function toUpperChar(p: Pieces.Piece): string {
    const pt = type(p);
    switch (pt) {
        case King: return "K";
        case Queen: return "Q";
        case Rook: return "R";
        case Knight: return "N";
        case Bishop: return "B";
        case Pawn: return "P";
        default: return "";
    }
}

export function pieceName(p: Pieces.Piece): string {
    return PIECE_NAMES[p];
}
