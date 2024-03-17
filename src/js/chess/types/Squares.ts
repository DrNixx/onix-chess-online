import * as Pieces from "./Pieces";

export type Empty = undefined;

export type Rank = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type RankChar = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8";
export type Fyle = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type FyleChar = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h";

export type A1 = 0x00; export type A2 = 0x08; export type A3 = 0x10; export type A4 = 0x18; export type A5 = 0x20; export type A6 = 0x28; export type A7 = 0x30; export type A8 = 0x38;
export type B1 = 0x01; export type B2 = 0x09; export type B3 = 0x11; export type B4 = 0x19; export type B5 = 0x21; export type B6 = 0x29; export type B7 = 0x31; export type B8 = 0x39;
export type C1 = 0x02; export type C2 = 0x0a; export type C3 = 0x12; export type C4 = 0x1a; export type C5 = 0x22; export type C6 = 0x2a; export type C7 = 0x32; export type C8 = 0x3a;
export type D1 = 0x03; export type D2 = 0x0b; export type D3 = 0x13; export type D4 = 0x1b; export type D5 = 0x23; export type D6 = 0x2b; export type D7 = 0x33; export type D8 = 0x3b;
export type E1 = 0x04; export type E2 = 0x0c; export type E3 = 0x14; export type E4 = 0x1c; export type E5 = 0x24; export type E6 = 0x2c; export type E7 = 0x34; export type E8 = 0x3c;
export type F1 = 0x05; export type F2 = 0x0d; export type F3 = 0x15; export type F4 = 0x1d; export type F5 = 0x25; export type F6 = 0x2d; export type F7 = 0x35; export type F8 = 0x3d;
export type G1 = 0x06; export type G2 = 0x0e; export type G3 = 0x16; export type G4 = 0x1e; export type G5 = 0x26; export type G6 = 0x2e; export type G7 = 0x36; export type G8 = 0x3e;
export type H1 = 0x07; export type H2 = 0x0f; export type H3 = 0x17; export type H4 = 0x1f; export type H5 = 0x27; export type H6 = 0x2f; export type H7 = 0x37; export type H8 = 0x3f;

export type Square =
    A1 | A2 | A3 | A4 | A5 | A6 | A7 | A8 |
    B1 | B2 | B3 | B4 | B5 | B6 | B7 | B8 |
    C1 | C2 | C3 | C4 | C5 | C6 | C7 | C8 |
    D1 | D2 | D3 | D4 | D5 | D6 | D7 | D8 |
    E1 | E2 | E3 | E4 | E5 | E6 | E7 | E8 |
    F1 | F2 | F3 | F4 | F5 | F6 | F7 | F8 |
    G1 | G2 | G3 | G4 | G5 | G6 | G7 | G8 |
    H1 | H2 | H3 | H4 | H5 | H6 | H7 | H8;

export type FromTo = { from: Square, to: Square, promo?: Pieces.PieceType };