export type Empty = undefined;

export type King = 0x01;
export type Queen = 0x02;
export type Rook = 0x03;
export type Bishop = 0x04;
export type Knight = 0x05;
export type Pawn = 0x06;

export type WKing = 0x01;
export type WQueen = 0x02;
export type WRook = 0x03;
export type WBishop = 0x04;
export type WKnight = 0x05;
export type WPawn = 0x06;

export type BKing = 0x09;
export type BQueen = 0x0A;
export type BRook = 0x0B;
export type BBishop = 0x0C;
export type BKnight = 0x0D;
export type BPawn = 0x0E;

export type PieceType = King | Queen | Rook | Bishop | Knight | Pawn;
export type Piece =
    WKing | WQueen | WRook | WBishop | WKnight | WPawn |
    BKing | BQueen | BRook | BBishop | BKnight | BPawn;